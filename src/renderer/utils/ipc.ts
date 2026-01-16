// src/renderer/utils/ipc.ts (修复版 v2)

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
    return null
  }
}

export const rendererSend = (channel: string, data?: any) => {
  rendererInvoke(channel, data).catch(console.error)
}

export const rendererOn = (channel: string, listener: (event: any, ...args: any[]) => void) => {
  return () => {}
}

export const rendererOff = (channel: string, listener: any) => {}
export const rendererOnce = (channel: string, listener: any) => {}


// ==========================================
// 2. 本地数据持久化 (localStorage 替代 JSON 文件)
// ==========================================
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

// --- 列表位置/状态 ---
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

// --- 搜索历史 (本次修复重点) ---
export const getSearchHistoryList = async () => localGet('searchHistoryList', [])
export const saveSearchHistoryList = async (list: any) => localSave('searchHistoryList', list)

// --- 播放相关 ---
export const getPlayInfo = async () => localGet('playInfo', {})
export const savePlayInfo = async (info: any) => localSave('playInfo', info)

// --- 其它数据 ---
export const getDislikeList = async () => localGet('dislikeList', [])
export const saveDislikeList = async (list: any) => localSave('dislikeList', list)

export const getAppSetting = async () => {
  const remote = await rendererInvoke('get_app_setting')
  return remote || localGet('appSetting', {})
}
export const setAppSetting = async (setting: any) => {
  localSave('appSetting', setting)
  await rendererInvoke('set_app_setting', setting)
}


// ==========================================
// 3. Electron 原生功能 Mock
// ==========================================
export const minWindow = () => {}
export const maxWindow = () => {}
export const closeWindow = () => {}
export const setFullScreen = () => {}
export const isFullscreen = () => false

export const openSaveDir = async (options: any) => {
  alert('Web版不支持直接写入文件，将尝试浏览器下载。')
  return { canceled: true }
}
export const showSelectDialog = async (options: any) => {
  alert('请使用页面上的导入按钮进行文件上传。')
  return { canceled: true, filePaths: [] }
}

export const clipboardWriteText = (text: string) => {
  if (navigator.clipboard) navigator.clipboard.writeText(text)
}

export const onNewDesktopLyricProcess = (callback: any) => {}
export const sendDesktopLyricInfo = () => {}

export const getSystemFonts = async () => ['Arial', 'Microsoft YaHei', 'sans-serif']

export const clearEnvParams = async () => {}
export const getEnvParams = async () => ({})
export const updateTray = () => {}
