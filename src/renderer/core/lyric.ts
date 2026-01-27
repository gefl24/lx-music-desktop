// Mock modules
class Lyric {
  constructor(options: any) {
    console.log('Lyric constructor called with options:', options)
  }
  setLyric(lrc: string, extendedLyrics: string[]) {
    console.log('Lyric setLyric called with lrc:', lrc)
  }
  play(time: number) {
    console.log('Lyric play called with time:', time)
  }
  pause() {
    console.log('Lyric pause called')
  }
  setOffset(offset: number) {
    console.log('Lyric setOffset called with offset:', offset)
  }
  setPlaybackRate(rate: number) {
    console.log('Lyric setPlaybackRate called with rate:', rate)
  }
  setDisabledAutoPause(disabled: boolean) {
    console.log('Lyric setDisabledAutoPause called with disabled:', disabled)
  }
}

const getAnalyser = () => null
const getPlayerCurrentTime = () => 0
const setLines = () => {}
const setOffset = () => {}
const setTempOffset = () => {}
const setText = () => {}
const setStatusText = () => {}
const markRawList = (list: any[]) => list
const onNewDesktopLyricProcess = () => {}

const lyric = {
  line: 0,
  offset: 0,
}

const isPlay = {
  value: false,
}

const musicInfo = {
  id: '',
  singer: '',
  name: '',
  album: '',
  lrc: '',
  tlrc: '',
  rlrc: '',
  lxlrc: '',
}

const appSetting = {
  'player.playbackRate': 1,
  'player.isShowLyricRoma': false,
  'player.isShowLyricTranslation': false,
  'player.isSwapLyricTranslationAndRoma': false,
  'player.isPlayLxlrc': false,
}

const getCurrentTime = () => {
  return getPlayerCurrentTime() * 1000
}

let lrc: Lyric
let desktopLyricPort: any = null
const analyserTools: {
  dataArray: Uint8Array
  bufferLength: number
  analyser: any
  sendDataArray: () => void
} = {
  dataArray: new Uint8Array(),
  bufferLength: 0,
  analyser: null,
  sendDataArray() {
    if (this.analyser == null) {
      this.analyser = getAnalyser()
      if (!this.analyser) return
      this.bufferLength = 0
    }
    const dataArray = new Uint8Array(this.bufferLength)
    sendDesktopLyricInfo({
      action: 'send_analyser_data_array',
      data: dataArray,
    }, [dataArray.buffer])
  },
}

export const sendDesktopLyricInfo = (info: any, transferList?: any[]) => {
  if (desktopLyricPort == null) return
  if (transferList) desktopLyricPort.postMessage(info, transferList)
  else desktopLyricPort.postMessage(info)
}
const handleDesktopLyricMessage = (action: string) => {
  switch (action) {
    case 'get_info':
      sendDesktopLyricInfo({
        action: 'set_info',
        data: {
          id: musicInfo.id,
          singer: musicInfo.singer,
          name: musicInfo.name,
          album: musicInfo.album,
          lrc: musicInfo.lrc,
          tlrc: musicInfo.tlrc,
          rlrc: musicInfo.rlrc,
          lxlrc: musicInfo.lxlrc,
          isPlay: isPlay.value,
          line: lyric.line,
          played_time: getCurrentTime(),
        },
      })
      break
    case 'get_status':
      sendDesktopLyricInfo({
        action: 'set_status',
        data: {
          isPlay: isPlay.value,
          line: lyric.line,
          played_time: getCurrentTime(),
        },
      })
      break
    case 'get_analyser_data_array':
      analyserTools.sendDataArray()
      break
    default:
      break
  }
}
export const init = () => {
  lrc = new Lyric({
    shadowContent: false,
    onPlay(line: number, text: string) {
      setText(text, Math.max(line, 0))
      setStatusText(text)
      if (window.app_event?.lyricLinePlay) {
        window.app_event.lyricLinePlay(text, line)
      }
    },
    onSetLyric(lines: string[], offset: number) {
      setLines(markRawList([...lines]))
      setText(lines[0] ?? '', 0)
      setOffset(offset)
      setTempOffset(0)
    },
    onUpdateLyric(lines: string[]) {
      setLines(markRawList([...lines]))
      setText(lines[0] ?? '', 0)
    },
    rate: appSetting['player.playbackRate'],
  })

  onNewDesktopLyricProcess(({ event }: any) => {
    console.log('onNewDesktopLyricProcess')
    const [port] = event.ports
    desktopLyricPort = port

    port.onmessage = ({ data }: any) => {
      handleDesktopLyricMessage(data.action)
    }

    port.onmessageerror = (event: any) => {
      console.log('onmessageerror', event)
    }
  })
}

export const setLyricOffset = (offset: number) => {
  const tempOffset = offset - lyric.offset
  setTempOffset(tempOffset)
  lrc.setOffset(tempOffset)
  sendDesktopLyricInfo({
    action: 'set_offset',
    data: tempOffset,
  })

  if (isPlay.value) {
    setTimeout(() => {
      const time = getCurrentTime()
      sendDesktopLyricInfo({
        action: 'set_play',
        data: time,
      })
      lrc.play(time)
    })
  }
}

export const setPlaybackRate = (rate: number) => {
  lrc.setPlaybackRate(rate)

  if (isPlay.value) {
    setTimeout(() => {
      const time = getCurrentTime()
      lrc.play(time)
    })
  }
}

export const setLyric = () => {
  if (!musicInfo.id) return
  if (musicInfo.lrc) {
    const extendedLyrics = []
    if (appSetting['player.isShowLyricRoma'] && musicInfo.rlrc) extendedLyrics.push(musicInfo.rlrc)
    if (appSetting['player.isShowLyricTranslation'] && musicInfo.tlrc) extendedLyrics.push(musicInfo.tlrc)
    if (appSetting['player.isSwapLyricTranslationAndRoma']) extendedLyrics.reverse()

    lrc.setLyric(
      appSetting['player.isPlayLxlrc'] && musicInfo.lxlrc ? musicInfo.lxlrc : musicInfo.lrc,
      extendedLyrics,
    )
    sendDesktopLyricInfo({
      action: 'set_lyric',
      data: {
        lrc: musicInfo.lrc,
        tlrc: musicInfo.tlrc,
        rlrc: musicInfo.rlrc,
        lxlrc: musicInfo.lxlrc,
      },
    })
  }

  if (isPlay.value) {
    setTimeout(() => {
      const time = getCurrentTime()
      sendDesktopLyricInfo({ action: 'set_play', data: time })
      lrc.play(time)
    })
  }
}

export const setDisabledAutoPause = (disabledAutoPause: boolean) => {
  lrc.setDisabledAutoPause(disabledAutoPause)
}

let sources = new Map<string, boolean>()
let prevDisabled = false
export const setDisableAutoPauseBySource = (disabled: boolean, source: string) => {
  sources.set(source, disabled)
  const currentDisabled = Array.from(sources.values()).some(e => e)
  if (prevDisabled == currentDisabled) return
  prevDisabled = currentDisabled
  setDisabledAutoPause(currentDisabled)
}


export const play = () => {
  const currentTime = getCurrentTime()
  lrc.play(currentTime)
  sendDesktopLyricInfo({ action: 'set_play', data: currentTime })
}

export const pause = () => {
  lrc.pause()
  sendDesktopLyricInfo({ action: 'set_pause' })
}

export const stop = () => {
  lrc.setLyric('')
  sendDesktopLyricInfo({ action: 'set_stop' })
  setText('', 0)
}

export const sendInfo = () => {
  sendDesktopLyricInfo({
    action: 'set_info',
    data: {
      id: musicInfo.id,
      singer: musicInfo.singer,
      name: musicInfo.name,
      album: musicInfo.album,
      lrc: musicInfo.lrc,
      tlrc: musicInfo.tlrc,
      rlrc: musicInfo.rlrc,
      lxlrc: musicInfo.lxlrc,
      isPlay: isPlay.value,
      line: lyric.line,
      played_time: getCurrentTime(),
    },
  })
}
