const express = require('express')
const router = express.Router()
const needle = require('needle') // 需要在项目根目录运行 npm install needle

// 通用代理接口
// 前端传参: { url: string, method: string, headers: object, data: any }
router.post('/', async (req, res) => {
  const { url, method = 'get', headers = {}, data } = req.body

  // 过滤掉浏览器禁止发送的 Header，由 Node 代发
  const options = {
    headers: {
      ...headers,
      // 强制伪装 User-Agent
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    },
    json: false,
    response_timeout: 15000,
    rejectUnauthorized: false // 忽略 SSL 错误
  }

  try {
    const resp = await needle(method, url, data, options)
    
    // 将目标服务器的响应透传回前端
    // 注意：这里可能需要处理 Set-Cookie，但在纯 API 模式下通常不需要
    res.status(resp.statusCode).send(resp.body)
  } catch (err) {
    console.error('Proxy Error:', url, err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
