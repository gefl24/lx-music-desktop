import path from 'node:path'
import { existsSync, mkdirSync } from 'fs'
import { initHotKey, initSetting } from './utils'
import defaultSetting from '@common/defaultSetting'
import createWorkers from './worker'
import { migrateDBData } from './utils/migrate'

// 扩展全局对象
declare global {
  var envParams: any
  var lx: any
  var staticPath: string
  var lxDataPath: string
  var lxOldDataPath: string
}

export const initGlobalData = () => {
  // 环境参数
  global.envParams = {
    cmdParams: {},
    deeplink: '',
  }
  
  // 全局数据
  global.lx = {
    inited: false,
    isSkipTrayQuit: false,
    appSetting: defaultSetting,
    worker: createWorkers(),
    hotKey: {
      enable: true,
      config: {
        local: {
          enable: false,
          keys: {},
        },
        global: {
          enable: false,
          keys: {},
        },
      },
      state: new Map(),
    },
    theme: {
      shouldUseDarkColors: false,
      theme: {
        id: '',
        name: '',
        isDark: false,
        colors: {},
      },
    },
    player_status: {
      status: 'stoped',
      name: '',
      singer: '',
      albumName: '',
      picUrl: '',
      progress: 0,
      duration: 0,
      playbackRate: 1,
      lyricLineText: '',
      lyricLineAllText: '',
      lyric: '',
      tlyric: '',
      rlyric: '',
      lxlyric: '',
      collect: false,
      volume: 0,
      mute: false,
    },
  }

  // 静态路径
  global.staticPath = path.join(__dirname, '../renderer')

  // 数据路径
  setUserDataPath()
}

export const setUserDataPath = () => {
  // 在容器环境中，使用 /app/data 作为数据目录
  const dataPath = process.env.DATA_PATH || path.join(process.cwd(), 'data')
  if (!existsSync(dataPath)) mkdirSync(dataPath, { recursive: true })
  
  global.lxOldDataPath = dataPath
  global.lxDataPath = path.join(dataPath, 'LxDatas')
  if (!existsSync(global.lxDataPath)) mkdirSync(global.lxDataPath)
}

let isInitialized = false
export const initAppSetting = async() => {
  if (!global.lx.inited) {
    const config = await initHotKey()
    global.lx.hotKey.config.local = config.local
    global.lx.hotKey.config.global = config.global
    global.lx.inited = true
  }

  if (!isInitialized) {
    let dbFileExists = await global.lx.worker.dbService.init(global.lxDataPath)
    if (dbFileExists === null) {
      console.warn('Database verify failed, rebuilding database...')
      dbFileExists = await global.lx.worker.dbService.init(global.lxDataPath)
    }
    global.lx.appSetting = (await initSetting()).setting
    if (!dbFileExists) await migrateDBData().catch(err => { console.error(err) })
  }

  isInitialized ||= true
}

export const quitApp = () => {
  global.lx.isSkipTrayQuit = true
  process.exit(0)
}
