// Global mock module for all missing dependencies

// Mock store modules
export const store = {
  get state() {
    return {
      player: {
        lyric: {
          line: 0,
          offset: 0,
        },
        state: {
          isPlay: false,
          musicInfo: {
            id: '',
            singer: '',
            name: '',
            album: '',
            lrc: '',
            tlrc: '',
            rlrc: '',
            lxlrc: '',
            meta: {
              picUrl: '',
            },
          },
          playMusicInfo: null,
          playInfo: null,
        },
        volume: {
          value: 0.7,
          isMute: false,
        },
        playbackRate: {
          value: 1,
        },
        playProgress: {
          now: 0,
          max: 0,
        },
      },
      list: {
        state: {
          userLists: [],
          tempList: [],
          tempListMeta: {},
          loveList: [],
          defaultList: [],
        },
      },
      songList: {
        state: {},
      },
      setting: {
        state: {
          'common.langId': 'en-us',
          'common.fontSize': 14,
          'player.playbackRate': 1,
          'player.isShowLyricRoma': false,
          'player.isShowLyricTranslation': false,
          'player.isSwapLyricTranslationAndRoma': false,
          'player.isPlayLxlrc': false,
          'list.isClickPlayList': false,
          'common.startInFullscreen': false,
          'common.windowSizeId': 1,
        },
      },
      qualityList: {},
      userApi: {
        status: false,
        message: 'initing',
        apis: {},
      },
      isFullscreen: false,
      proxy: {
        enable: false,
        host: '',
        port: 0,
        username: '',
        password: '',
        envProxy: null,
      },
      sync: {
        enable: false,
        service: '',
      },
      windowSizeList: [],
    }
  },
  get lyric() {
    return this.state.player.lyric
  },
  get isPlay() {
    return {
      value: this.state.player.state.isPlay,
    }
  },
  get musicInfo() {
    return this.state.player.state.musicInfo
  },
  get playMusicInfo() {
    return this.state.player.state.playMusicInfo
  },
  get playInfo() {
    return this.state.player.state.playInfo
  },
  get volume() {
    return this.state.player.volume
  },
  get playbackRate() {
    return this.state.player.playbackRate
  },
  get playProgress() {
    return this.state.player.playProgress
  },
  get userLists() {
    return this.state.list.state.userLists
  },
  get tempList() {
    return this.state.list.state.tempList
  },
  get tempListMeta() {
    return this.state.list.state.tempListMeta
  },
  get loveList() {
    return this.state.list.state.loveList
  },
  get defaultList() {
    return this.state.list.state.defaultList
  },
  get appSetting() {
    return this.state.setting.state
  },
  get qualityList() {
    return this.state.qualityList
  },
  get userApi() {
    return this.state.userApi
  },
  get isFullscreen() {
    return this.state.isFullscreen
  },
  get proxy() {
    return this.state.proxy
  },
  get sync() {
    return this.state.sync
  },
  get windowSizeList() {
    return this.state.windowSizeList
  },
}

// Mock store actions
export const storeActions = {
  player: {
    action: {
      setStatusText: () => {},
      setAllStatus: () => {},
    },
    lyric: {
      setLines: () => {},
      setOffset: () => {},
      setTempOffset: () => {},
      setText: () => {},
    },
  },
  list: {
    action: {
      getListMusics: async() => [],
      getUserLists: async() => [],
      registerAction: () => {},
      addListMusics: async() => {},
      removeListMusics: async() => {},
      updateListMusics: async() => {},
      checkListExistMusic: async() => false,
      setTempList: () => {},
    },
  },
  songList: {
    action: {
      getListDetail: async() => {},
      getListDetailAll: async() => {},
    },
  },
  setting: {
    saveVolume: async() => {},
    saveVolumeIsMute: async() => {},
    savePlaybackRate: async() => {},
    saveMediaDeviceId: async() => {},
  },
}

// Mock utils modules
export const utils = {
  encodePath: (path: string) => path,
  formatPlayTime: (time: number) => '00:00',
  formatPlayTime2: (time: number) => '00:00',
  isUrl: (path: string) => /https?:\/\//.test(path),
  parseUrlParams: (str: string) => ({}),
  throttle: (fn: Function, delay: number) => fn,
  debounce: (fn: Function, delay: number) => fn,
  filterFileName: (name: string) => name,
  similar: (a: string, b: string) => 0,
  sortInsert: (arr: any[], data: any) => arr,
  toMD5: (str: string) => str,
  getFontSizeWithScreen: () => 14,
  deduplicationList: (list: any[]) => list,
  dateFormat: (date: any) => '',
  dateFormat2: (date: any) => '',
  setTitle: (title: string) => {},
  langS2T: async(str: string) => str,
  decodeName: (name: string) => name,
  toNewMusicInfo: (oldMusicInfo: any) => oldMusicInfo,
  toOldMusicInfo: (newMusicInfo: any) => newMusicInfo,
}

// Mock vueTools module
export const vueTools = {
  computed: (fn: Function) => ({ value: fn() }),
  watch: () => () => {},
  ref: (value: any) => ({ value }),
  onBeforeUnmount: () => {},
  onMounted: () => {},
  markRaw: (value: any) => value,
  markRawList: (list: any[]) => list,
}

// Export vueTools functions for direct imports
export const computed = (fn: Function) => ({ value: fn() })
export const watch = () => () => {}
export const ref = (value: any) => ({ value })
export const onBeforeUnmount = () => {}
export const onMounted = () => {}
export const markRaw = (value: any) => value
export const markRawList = (list: any[]) => list

// Mock vueRouter module
export const vueRouter = {
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
  }),
  useRoute: () => ({
    path: '',
    query: {},
    params: {},
  }),
}

// Mock player module
export const player = {
  play: () => {},
  pause: () => {},
  playNext: () => {},
  playPrev: () => {},
  togglePlay: () => {},
  playList: () => {},
  collectMusic: () => {},
  uncollectMusic: () => {},
  dislikeMusic: () => {},
  setMusicUrl: () => {},
  action: {
    pause: () => {},
  },
  utils: {
    setPowerSaveBlocker: () => {},
  },
}

// Mock plugins modules
export const plugins = {
  player: {
    getAnalyser: () => null,
    getCurrentTime: () => 0,
    setVolume: () => {},
    setMute: () => {},
    setPlaybackRate: () => {},
    setPreservesPitch: () => {},
    setMediaDeviceId: () => {},
    setMaxOutputChannelCount: () => {},
    setStop: () => {},
    isEmpty: () => true,
  },
  i18n: {
    useI18n: () => ({
      locale: 'en-us',
      t: (key: string) => key,
    }),
  },
  Dialog: {
    dialog: {
      alert: async() => {},
      confirm: async() => false,
      prompt: async() => null,
    },
  },
}

// Mock ipc module
export const ipc = {
  sendPlayerStatus: () => {},
  onPlayerAction: () => {},
  saveLyric: async() => {},
  saveMusicUrl: async() => {},
  onNewDesktopLyricProcess: () => {},
  focusWindow: () => {},
  sendSyncAction: () => {},
  setWindowSize: () => {},
  sendOpenAPIAction: () => {},
}

// Mock musicSdk module
export const musicSdk = {
  supportQuality: {},
  init: async() => {},
  searchMusic: async() => [],
  findMusic: async() => [],
}

// Mock data module
export const data = {
  getListUpdateInfo: async() => {},
}

// Mock message module
export const message = {
  requestMsg: async() => {},
}

// Mock event module
export const event = {
  AppEventTypes: {},
  KeyEventTypes: {},
}

// Mock lang module
export const lang = {
  availableLocales: ['en-us'],
  setLanguage: () => {},
}

// Mock common modules
export const common = {
  utils: {
    ...utils,
    log: {
      info: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      verbose: console.log,
    },
    vueTools: {
      ...vueTools,
    },
    common: {
      ...utils,
    },
    tools: {
      toNewMusicInfo: utils.toNewMusicInfo,
      toOldMusicInfo: utils.toOldMusicInfo,
      fixNewMusicInfoQuality: (musicInfo: any) => musicInfo,
      filterMusicList: (list: any[]) => list,
      clipNameLength: (name: string) => name,
      clipFileNameLength: (name: string) => name,
      joinPath: (...paths: string[]) => paths.join('/'),
      arrPushByPosition: (arr: any[], item: any, position: number) => arr,
      arrShuffle: (arr: any[]) => arr,
    },
    musicMeta: {
      parseMusicMeta: async() => ({}),
    },
    download: {
      downloadFile: async() => ({}),
    },
    nodejs: {
      saveStrToFile: async() => {},
      readLxConfigFile: async() => ({}),
      saveLxConfigFile: async() => {},
    },
  },
  hotKey: {
    HOTKEY_PLAYER: {},
  },
  constants: {
    LIST_IDS: {
      PLAY_LATER: 'play_later',
    },
    SPLIT_CHAR: '|',
    filterFileName: (name: string) => name,
    sortInsert: (arr: any[], item: any) => arr,
    similar: (a: string, b: string) => 0,
    arrPushByPosition: (arr: any[], item: any, position: number) => arr,
    arrShuffle: (arr: any[]) => arr,
    joinPath: (...paths: string[]) => paths.join('/'),
    clipNameLength: (name: string) => name,
    clipFileNameLength: (name: string) => name,
    createLocalMusicInfo: (path: string) => ({}),
  },
  ipcNames: {
    WIN_MAIN_RENDERER_EVENT_NAME: {
      handle_kw_decode_lyric: 'handle_kw_decode_lyric',
    },
    DISLIKE_EVENT_NAME: {
      get_dislike_music_infos: 'get_dislike_music_infos',
      add_dislike_music_infos: 'add_dislike_music_infos',
      overwrite_dislike_music_infos: 'overwrite_dislike_music_infos',
      clear_dislike_music_infos: 'clear_dislike_music_infos',
    },
  },
  defaultSetting: {
    common: {
      langId: 'en-us',
    },
  },
}

// Mock api modules
export const api = {
  setting: {
    getSetting: async() => ({}),
    updateSetting: async() => {},
  },
  userApi: {
    getUserApiConfig: async() => {},
  },
}

// Mock worker module
export const worker = {
  main: {
    getMusicFilePic: async() => null,
    getMusicFileLyric: async() => null,
    langS2t: async() => '',
  },
  download: {
    index: {},
  },
  utils: {
    MainTypes: {},
    DownloadTypes: {},
  },
}

// Mock core modules
export const core = {
  apiSource: {
    setUserApi: async() => {},
  },
  dislikeList: {
    initDislikeInfo: async() => {},
    hasDislike: () => false,
    addDislikeInfo: async() => {},
    overwirteDislikeInfo: async() => {},
    clearDislikeInfo: async() => {},
    registerRemoteDislikeAction: () => () => {},
  },
  lyric: {
    init: () => {},
    setLyricOffset: () => {},
    setPlaybackRate: () => {},
    setLyric: () => {},
    setDisabledAutoPause: () => {},
    setDisableAutoPauseBySource: () => {},
    play: () => {},
    pause: () => {},
    stop: () => {},
    sendInfo: () => {},
    sendDesktopLyricInfo: () => {},
  },
  player: {
    ...player,
  },
  music: {
    download: {
      getMusicUrl: async() => '',
      getPicUrl: async() => '',
      getLyricInfo: async() => ({
        lyric: '',
        tlrc: '',
        rlrc: '',
      }),
    },
    local: {
      getMusicUrl: async() => '',
      getPicUrl: async() => '',
      getLyricInfo: async() => ({
        lyric: '',
        tlrc: '',
        rlrc: '',
      }),
    },
    online: {
      getMusicUrl: async() => '',
      getPicUrl: async() => '',
      getLyricInfo: async() => ({
        lyric: '',
        tlrc: '',
        rlrc: '',
      }),
    },
    utils: {
      buildLyricInfo: (info: any) => info,
      getCachedLyricInfo: async() => null,
      getOnlineOtherSourceLyricByLocal: async() => ({
        lyricInfo: {
          lyric: '',
          tlrc: '',
          rlrc: '',
        },
        isFromCache: false,
      }),
      getOnlineOtherSourceLyricInfo: async() => ({
        lyricInfo: {
          lyric: '',
          tlrc: '',
          rlrc: '',
        },
        musicInfo: {},
        isFromCache: false,
      }),
      getOnlineOtherSourceMusicUrl: async() => ({
        url: '',
        quality: '',
        musicInfo: {},
        isFromCache: false,
      }),
      getOnlineOtherSourceMusicUrlByLocal: async() => ({
        url: '',
        quality: '',
        isFromCache: false,
      }),
      getOnlineOtherSourcePicByLocal: async() => ({
        url: '',
      }),
      getOnlineOtherSourcePicUrl: async() => ({
        url: '',
        musicInfo: {},
        isFromCache: false,
      }),
      getOtherSource: async() => [],
    },
  },
}

// Mock compositions
export const compositions = {
  usePlaySonglist: () => ({
    playSonglist: () => {},
  }),
}

// Mock list sync
export const syncSourceList = {
  sync: async() => {},
}

// Mock data
export const dataVerify = () => true
export const sourceVerify = () => true
export const qualityFilter = (list: any[]) => list
export const sources = []

// Mock worker types
export const workerMainTypes = {}
export const workerDownloadTypes = {}

// Mock worker utils module
export const createMainWorker = () => ({
  getMusicFilePic: async() => null,
  getMusicFileLyric: async() => null,
  langS2t: async() => '',
})

export const createDownloadWorker = () => ({})

export const proxyCallback = (callback: Function) => callback

// Mock simplify-chinese-main module
const tranditionalize = (str: string) => str
const saveLxConfigFile = async() => {}
const readLxConfigFile = async() => ({})
const saveStrToFile = async(filePath: string, content: any) => {}

// Mock music utils module
const getLocalMusicFileLyric = async(filePath: string) => null
const getLocalMusicFilePic = async(filePath: string) => null
const checkPath = async(path: string) => true

// Mock electron module
const ipcMain = {
  on: (name: string, listener: Function) => {},
  once: (name: string, listener: Function) => {},
  removeListener: (name: string, listener: Function) => {},
  removeAllListeners: (name: string) => {},
  handle: (name: string, listener: Function) => {},
  handleOnce: (name: string, listener: Function) => {},
  removeHandler: (name: string) => {},
}

declare namespace Electron {
  type IpcMainEvent = any
  type WebContents = any
  type BrowserWindow = {
    webContents: {
      send: (name: string, params?: any) => void
    }
  }
  type OpenDialogOptions = any
  type OpenDialogReturnValue = any
  type SaveDialogOptions = any
  type SaveDialogReturnValue = any
}

// Mock I18n type
export type I18n = {
  locale: string
  t: (key: string) => string
}

// Export all as default
export default {
  ...store,
  ...storeActions,
  ...utils,
  ...vueTools,
  ...vueRouter,
  ...player,
  ...plugins,
  ...ipc,
  ...musicSdk,
  ...data,
  ...message,
  ...event,
  ...lang,
  ...common,
  ...api,
  ...worker,
  ...core,
  ...compositions,
  syncSourceList,
  dataVerify,
  sourceVerify,
  qualityFilter,
  sources,
  workerMainTypes,
  workerDownloadTypes,
  tranditionalize,
  saveLxConfigFile,
  readLxConfigFile,
  saveStrToFile,
  getLocalMusicFileLyric,
  getLocalMusicFilePic,
  checkPath,
  ipcMain,
}

// Export individual functions for direct imports
export { tranditionalize, saveLxConfigFile, readLxConfigFile, saveStrToFile, getLocalMusicFileLyric, getLocalMusicFilePic, checkPath, ipcMain }

// Export utility functions for direct imports
export const filterFileName = (name: string) => name
export const similar = (a: string, b: string) => 0
export const sortInsert = (arr: any[], data: any) => arr
export const arrPushByPosition = (arr: any[], item: any, position: number) => arr
export const arrShuffle = (arr: any[]) => arr
export const clipNameLength = (name: string) => name
export const clipFileNameLength = (name: string) => name
export const joinPath = (...paths: string[]) => paths.join('/')
export const createLocalMusicInfo = (path: string) => ({
  id: '',
  name: '',
  singer: '',
  album: '',
  lrc: '',
  tlrc: '',
  rlrc: '',
  lxlrc: '',
  meta: {
    picUrl: '',
    albumName: '',
    interval: '00:00',
    _qualitys: {},
    qualitys: [],
  },
  source: 'local',
  url: '',
  cover: '',
  lyricInfo: {
    lyric: '',
    tlrc: '',
    rlrc: '',
  },
})

// Export constants
export const SPLIT_CHAR = {
  DISLIKE_NAME: '@',
  DISLIKE_NAME_ALIAS: '#',
}
export const DOWNLOAD_STATUS = {
  RUN: 'run',
  WAITING: 'waiting',
  PAUSE: 'pause',
  ERROR: 'error',
  COMPLETED: 'completed',
}
export const QUALITYS = ['flac24bit', 'flac', 'wav', 'ape', '320k', '192k', '128k']
