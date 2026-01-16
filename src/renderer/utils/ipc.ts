// src/renderer/utils/ipc.ts (重写版部分)

// ----------------------
// 核心劫持代码
// ----------------------
const webInvoke = async (channel: string, data?: any) => {
  const resp = await fetch(`/api/ipc/invoke/${channel}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return resp.json()
}

// Stub 存根，防止调用报错
const webSend = (channel: string, data?: any) => {
  console.log('[WebIPC] Send:', channel, data)
  // 对于单向消息，也可以发给后端处理
  webInvoke(channel, data).catch(console.error)
}

const webOn = (channel: string, listener: any) => {
  console.warn(`[WebIPC] Listener registered for ${channel} (Web mode not supported yet)`)
}

const webOff = (channel: string, listener: any) => {}

// ----------------------
// 下面是具体的业务方法导出，保持函数签名不变，但替换实现
// ----------------------

// 示例：获取设置
export const getSetting = async() => {
  return webInvoke('get_app_setting')
}

// 示例：更新设置
export const updateSetting = async(setting: any) => {
  await webInvoke('set_app_setting', setting)
}

// ... 对于文件中的其他几百个函数，你需要做如下批量替换：
// 将 rendererInvoke(...) 替换为 webInvoke(...)
// 将 rendererSend(...) 替换为 webSend(...)
// 将 rendererOn(...) 替换为 webOn(...)

// 特殊处理：涉及 Electron 原生 UI 的功能，直接返回空或做浏览器适配
export const closeWindow = () => {
  console.log('Web version cannot close browser tab directly')
}

export const minWindow = () => {}
export const maxWindow = () => {}

// ... 其他导出请保留原样，确保 import 该文件的组件不会报错
