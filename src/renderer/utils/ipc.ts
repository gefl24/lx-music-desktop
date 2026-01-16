// src/renderer/utils/ipc.ts (重写版)

// 模拟 IPC 调用，实际上发送 HTTP 请求给 Node 后端
export const rendererInvoke = async (channel: string, data?: any) => {
  try {
    const response = await fetch(`/api/invoke/${channel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    })
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('API Call Failed:', channel, err)
    throw err
  }
}

export const rendererOn = (channel: string, listener: (event: any, ...args: any[]) => void) => {
  // Web 版暂时无法通过 HTTP 实现实时推送 (需要 WebSocket)
  // 这里留空防止报错，或者你可以实现 SSE / Socket.io
  console.warn(`Listener for ${channel} is not implemented in Web mode.`)
  return () => {} // 返回解绑函数
}

export const rendererSend = (channel: string, data?: any) => {
  // 对于单向发送，也走 Invoke 接口
  rendererInvoke(channel, data).catch(console.error)
}

export const rendererOff = (channel: string, listener: any) => {
  // 空实现
}
