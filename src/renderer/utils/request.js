// src/renderer/utils/request.js (重写版)
import { debugRequest } from './env'
import { requestMsg } from './message'
import { bHh } from './musicSdk/options'

// 移除所有 Node/Electron 相关依赖
// import needle from 'needle' 
// import { deflateRaw } from 'zlib' 
// import { httpOverHttp, httpsOverHttp } from 'tunnel'

// 简单的 Buffer 模拟，因为浏览器没有 Buffer 全局对象
// 如果你的构建工具没有自动 polyfill Buffer，可能需要安装 'buffer' 包
import { Buffer } from 'buffer' 

const defaultHeaders = {
  // Web 端设置 User-Agent 不生效，会在后端代理层设置
}

// 核心：将请求发送给 Node 后端代理
const sendRequestToProxy = async (url, options) => {
  const proxyUrl = '/api/proxy'
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        method: options.method || 'get',
        headers: options.headers || {},
        data: options.body || options.form || options.formData // 简化处理，统一放到 data
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const text = await response.text()
    // 尝试解析 JSON，如果失败则返回文本
    try {
      return JSON.parse(text)
    } catch (e) {
      return text
    }
  } catch (err) {
    throw err
  }
}

// 模拟原有的 fetchData 接口
const fetchData = async(url, method, {
  headers = {},
  format = 'json',
  timeout = 15000,
  ...options
}, callback) => {
  debugRequest && console.log('---start---', url)

  // 处理加密头 (保留原逻辑，但需注意浏览器兼容性)
  if (headers[bHh]) {
    // 注意：这里的加密逻辑如果在浏览器跑不通，
    // 建议将整个 headers 生成逻辑移到后端。
    // 暂时先注释掉加密头，测试基础功能
    // delete headers[bHh] 
  }

  const reqOptions = {
    ...options,
    method,
    headers: Object.assign({}, defaultHeaders, headers),
  }

  try {
    const body = await sendRequestToProxy(url, reqOptions)
    // 模拟 needle 的响应格式
    const resp = {
      statusCode: 200,
      body: body,
      raw: body
    }
    callback(null, resp, body)
  } catch (err) {
    console.error('Request Fail:', err)
    callback(err, null)
  }
}

// 导出与原文件一致的 API
export const httpFetch = (url, options = { method: 'get' }) => {
  return {
    promise: new Promise((resolve, reject) => {
      fetchData(url, options.method, options, (err, resp, body) => {
        if (err) return reject(err)
        resolve(resp)
      })
    }),
    cancelHttp: () => { console.warn('Cancel not implemented in Web mode') }
  }
}

export const http = (url, options, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  options.method = options.method || 'get'
  return fetchData(url, options.method, options, (err, resp, body) => cb(err, resp, body))
}

export const httpGet = (url, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  return fetchData(url, 'get', options, (err, resp, body) => callback(err, resp, body))
}

// 其他导出保持空实现或简单封装，以通过编译
export const checkUrl = () => Promise.resolve()
