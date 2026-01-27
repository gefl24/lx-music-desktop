// For web version, we'll provide mock implementations
const appSetting = {
  'player.isShowStatusBarLyric': false
}

// Mock function for web version
const setDisableAutoPauseBySource = () => {
  console.log('setDisableAutoPauseBySource called')
}

export default () => {
  const handleEnable = (enable: boolean) => {
    setDisableAutoPauseBySource(enable, 'statusBarLyric')
  }

  // For web version, we'll mock the app_event
  if (window.app_event && window.app_event.on) {
    window.app_event.on('configUpdate', (setting: any) => {
      if (setting['player.isShowStatusBarLyric'] != null) {
        handleEnable(setting['player.isShowStatusBarLyric'])
      }
    })
  }

  return async() => {
    if (appSetting['player.isShowStatusBarLyric']) {
      handleEnable(true)
    }
  }
}
