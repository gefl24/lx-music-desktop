// Mock modules
const DISLIKE_EVENT_NAME = {
  get_dislike_music_infos: 'get_dislike_music_infos',
  add_dislike_music_infos: 'add_dislike_music_infos',
  overwrite_dislike_music_infos: 'overwrite_dislike_music_infos',
  clear_dislike_music_infos: 'clear_dislike_music_infos',
}

const rendererInvoke = () => Promise.resolve()
const rendererOff = () => {}
const rendererOn = () => {}

const action = {
  initDislikeInfo: (info: any) => {},
  hasDislike: (info: any) => false,
  addDislikeInfo: (info: any) => {},
  overwirteDislikeInfo: (info: any) => {},
  clearDislikeInfo: () => {},
}


export const initDislikeInfo = async() => {
  action.initDislikeInfo(await rendererInvoke())
}

export const hasDislike = (info: LX.Music.MusicInfo | LX.Download.ListItem | null) => {
  if (!info) return false
  return action.hasDislike(info)
}

export const addDislikeInfo = async(infos: LX.Dislike.DislikeMusicInfo[]) => {
  await rendererInvoke()
}

export const overwirteDislikeInfo = async(rules: string) => {
  await rendererInvoke()
}

export const clearDislikeInfo = async() => {
  await rendererInvoke()
}


const noop = () => {}

export const registerRemoteDislikeAction = (onListChanged: (listIds: string[]) => void = noop) => {
  const add_dislike_music_infos = ({ params: datas }: LX.IpcRendererEventParams<LX.Dislike.DislikeMusicInfo[]>) => {
    action.addDislikeInfo(datas)
  }
  const overwrite_dislike_music_infos = ({ params: datas }: LX.IpcRendererEventParams<LX.Dislike.DislikeRules>) => {
    action.overwirteDislikeInfo(datas)
  }
  const clear_dislike_music_infos = () => {
    return action.clearDislikeInfo()
  }

  rendererOn()
  rendererOn()
  rendererOn()

  return () => {
    rendererOff()
    rendererOff()
    rendererOff()
  }
}
