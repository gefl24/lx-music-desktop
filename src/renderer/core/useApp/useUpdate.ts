// For web version, we'll provide mock implementations
const nextTick = (callback: () => void) => Promise.resolve().then(callback)
const onBeforeUnmount = (callback: () => void) => {
  // No-op for web version
}
const watch = (source: any, callback: any) => {
  // No-op for web version
  return () => {}
}

// Mock store
const isShowChangeLog = {
  value: false
}

const versionInfo = {
  version: '0.0.0',
  newVersion: null as any,
  showModal: false,
  isUnknown: false,
  isLatest: true,
  reCheck: false,
  status: 'idle' as string,
  downloadProgress: null as any,
}

// Mock app setting
const appSetting = {
  'common.showChangeLog': false,
  'common.tryAutoUpdate': false,
}

// Mock IPC functions
const getIgnoreVersion = () => Promise.resolve('')
const getLastStartInfo = () => Promise.resolve('')
const saveLastStartInfo = () => Promise.resolve()
const onUpdateAvailable = () => () => {}
const onUpdateNotAvailable = () => () => {}
const onUpdateError = () => () => {}
const onUpdateProgress = () => () => {}
const onUpdateDownloaded = () => () => {}

// Mock dialog
const dialog = () => Promise.resolve()

// Mock utils
const compareVer = (ver1: string, ver2: string) => {
  return 0
}

const isWin = false

// Mock getVersionInfo
const getVersionInfo = () => Promise.resolve({ version: '0.0.0', desc: '' })

export default () => {
  let isShowedChangeLog = false

  // 更新超时定时器
  let updateTimeout: number | null = null
  const startUpdateTimeout = () => {
    // No-op for web version
  }

  const clearUpdateTimeout = () => {
    if (!updateTimeout) return
    clearTimeout(updateTimeout)
    updateTimeout = null
  }

  const handleShowChangeLog = () => {
    isShowedChangeLog = true
    void getLastStartInfo().then((version: string) => {
      if (version == process.versions.app) return
      saveLastStartInfo(process.versions.app)
      if (!appSetting['common.showChangeLog']) return
      if (version) {
        if (compareVer(process.versions.app, version) < 0) {
          void dialog({
            message: 'Downgrade detected',
            confirmButtonText: 'OK',
          })
          return
        }

        if (versionInfo.newVersion && compareVer(version, versionInfo.newVersion.version) >= 0) return
      } else if (
        // 如果当前版本不在已发布的版本中，则不需要显示更新日志
        versionInfo.newVersion &&
        ![{ version: versionInfo.newVersion.version, desc: '' }, ...(versionInfo.newVersion.history ?? [])]
          .some(i => i.version == process.versions.app)
      ) return
      isShowChangeLog.value = true
    })
  }

  const handleGetVersionInfo = async() => {
    return (versionInfo.newVersion?.history && !versionInfo.reCheck
      ? Promise.resolve(versionInfo.newVersion)
      : getVersionInfo().then((body: any) => {
        versionInfo.newVersion = body
        return body
      })
    ).catch(() => {
      if (versionInfo.newVersion) return versionInfo.newVersion
      let result = {
        version: '0.0.0',
        desc: '',
      }
      versionInfo.newVersion = result
      return result
    })
  }

  let versionInfoPromise: null | ReturnType<typeof handleGetVersionInfo> = null

  const showUpdateModal = (status?: string) => {
    if (versionInfoPromise) {
      if (
        // @ts-expect-error
        versionInfoPromise.resolved &&
        versionInfo.reCheck) {
        versionInfoPromise = handleGetVersionInfo()
      }
    } else versionInfoPromise = handleGetVersionInfo()
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    void versionInfoPromise.then((result: any) => {
      versionInfo.reCheck = false

      if (result.version == '0.0.0') {
        versionInfo.isUnknown = true
        versionInfo.status = 'error'
        let ignoreFailTipTime = parseInt(localStorage.getItem('update__check_failed_tip') ?? '0')
        if (Date.now() - ignoreFailTipTime > 7 * 86400000) {
          versionInfo.showModal = true
        }
        return
      }
      versionInfo.isUnknown = false
      if (compareVer(versionInfo.version, result.version) != -1) {
        versionInfo.status = 'idle'
        versionInfo.isLatest = true
        handleShowChangeLog()
        return
      }

      return getIgnoreVersion().then((ignoreVersion: string) => {
        versionInfo.isLatest = false
        let preStatus = versionInfo.status
        if (status) versionInfo.status = status
        if (result.version === ignoreVersion) return
        void nextTick(() => {
          versionInfo.showModal = true
          if (status == 'error' && preStatus == 'downloading' && !localStorage.getItem('update__download_failed_tip')) {
            setTimeout(() => {
              void dialog({
                message: 'Update error',
                confirmButtonText: 'OK',
              }).finally(() => {
                localStorage.setItem('update__download_failed_tip', '1')
              })
            }, 500)
          }
        })
      })
    }).finally(() => {
      // @ts-expect-error
      versionInfoPromise!.resolved = true
    })
  }

  const rUpdateAvailable = onUpdateAvailable(({ params: info }: any) => {
    versionInfo.newVersion = {
      version: info.version,
      desc: info.releaseNotes as string,
    }
    versionInfo.isLatest = false
    if (appSetting['common.tryAutoUpdate']) {
      versionInfo.status = 'downloading'
      startUpdateTimeout()
    }
    void nextTick(() => {
      showUpdateModal()
    })
  })
  const rUpdateNotAvailable = onUpdateNotAvailable(({ params: info }: any) => {
    clearUpdateTimeout()
    void handleGetVersionInfo().finally(() => {
      versionInfo.isLatest = true
      versionInfo.isUnknown = false
      versionInfo.status = 'idle'
      handleShowChangeLog()
    })
  })
  const rUpdateError = onUpdateError((params: any) => {
    clearUpdateTimeout()
    void nextTick(() => {
      showUpdateModal('error')
    })
  })
  const rUpdateProgress = onUpdateProgress(({ params: progress }: any) => {
    versionInfo.downloadProgress = progress
  })
  const rUpdateDownloaded = onUpdateDownloaded(({ params: info }: any) => {
    clearUpdateTimeout()
    void nextTick(() => {
      showUpdateModal('downloaded')
    })
  })

  watch(() => versionInfo.showModal, (visible: boolean) => {
    if (visible || isShowedChangeLog || versionInfo.status == 'downloaded') return
    setTimeout(() => {
      handleShowChangeLog()
    }, 1000)
  })

  onBeforeUnmount(() => {
    clearUpdateTimeout()
    rUpdateAvailable()
    rUpdateNotAvailable()
    rUpdateError()
    rUpdateProgress()
    rUpdateDownloaded()
  })
}
