// src/renderer/utils/ipc.ts
// 这是一个完整的 Web 版 IPC 适配文件，修复了所有构建错误

// ==========================================
// 1. 核心通信层 (HTTP Fetch 替代 IPC)
// ==========================================
export const rendererInvoke = async (channel: string, data?: any) => {
  try {
    const response = await fetch(`/api/invoke/${channel}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return await response.json()
  } catch (err) {
    console.error('[WebIPC] Invoke Failed:', channel, err)
    // 返回 null 防止前端解构报错
    return null
  }
}

export const rendererSend = (channel: string, data?: any) => {
  // 对于单向消息，Web版也走 Invoke 通道，或者直接忽略
  rendererInvoke(channel, data).catch(console.error)
}

export const rendererOn = (channel: string, listener: (event: any, ...args: any[]) => void) => {
  // Web 版暂时不支持服务端主动推送 (需 WebSocket)
  // console.warn(`[WebIPC] Listener for ${channel} ignored`)
  return () => {}
}

export const rendererOff = (channel: string, listener: any) => {}
export const rendererOnce = (channel: string, listener: any) => {}


// ==========================================
// 2. 本地数据持久化 (localStorage 替代 JSON 文件)
// ==========================================
// 辅助函数：读写 localStorage
const localGet = (key: string, def: any = null) => {
  try {
    const val = localStorage.getItem('lx_' + key)
    return val ? JSON.parse(val) : def
  } catch (e) { return def }
}
const localSave = (key: string, val: any) => {
  try {
    localStorage.setItem('lx_' + key, JSON.stringify(val))
  } catch (e) { console.error(e) }
}

// --- 列表位置/状态相关 ---
export const getListPositionInfo = async () => localGet('listPositionInfo', {})
export const saveListPositionInfo = async (info: any) => localSave('listPositionInfo', info)

export const getListPrevSelectId = async () => localGet('listPrevSelectId', 'default')
export const saveListPrevSelectId = async (id: any) => localSave('listPrevSelectId', id)

export const getListUpdateInfo = async () => localGet('listUpdateInfo', {})
export const saveListUpdateInfo = async (info: any) => localSave('listUpdateInfo', info)

// --- 设置相关 ---
export const getSearchSetting = async () => localGet('searchSetting', {})
export const saveSearchSetting = async (setting: any) => localSave('searchSetting', setting)

export const getSongListSetting = async () => localGet('songListSetting', {})
export const saveSongListSetting = async (setting: any) => localSave('songListSetting', setting)

export const getLeaderboardSetting = async () => localGet('leaderboardSetting', {})
export const saveLeaderboardSetting = async (setting: any) => localSave('leaderboardSetting', setting)

export const getViewPrevState = async () => localGet('viewPrevState', {})
export const saveViewPrevState = async (state: any) => localSave('viewPrevState', state)

// --- 其他通用设置 ---
export const getAppSetting = async () => {
  // 优先从后端获取全局配置，失败则读本地
  const remote = await rendererInvoke('get_app_setting')
  return remote || localGet('appSetting', {})
}
export const setAppSetting = async (setting: any) => {
  // Web版将设置保存在本地，以免刷新丢失
  localSave('appSetting', setting)
  // 同时尝试同步给后端
  await rendererInvoke('set_app_setting', setting)
}


// ==========================================
// 3. Electron 原生功能 Mock (防止调用报错)
// ==========================================

// 窗口控制 (Web 无权控制)
export const minWindow = () => {}
export const maxWindow = () => {}
export const closeWindow = () => {}
export const setFullScreen = () => {}
export const isFullscreen = () => false

// 弹窗与文件操作
export const openSaveDir = async (options: any) => {
  alert('Web版不支持直接写入文件，将尝试浏览器下载。')
  return { canceled: true }
}
export const showSelectDialog = async (options: any) => {
  alert('请使用页面上的导入按钮进行文件上传。')
  return { canceled: true, filePaths: [] }
}

// 剪贴板
export const clipboardWriteText = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  }
}

// 桌面歌词
export const onNewDesktopLyricProcess = (callback: any) => {}
export const sendDesktopLyricInfo = () => {}

// 系统字体
export const getSystemFonts = async () => {
  return ['Arial', 'Microsoft YaHei', 'SimHei', 'Times New Roman']
}

// 其它杂项
export const clearEnvParams = async () => {}
export const getEnvParams = async () => ({})
export const updateTray = () => {}
