import { watch } from '@common/utils/vueTools'
import { useI18n } from '@renderer/plugins/i18n'
import { qualityList, userApi } from '@renderer/store'
import { appSetting } from '@renderer/store/setting'
import { dialog } from '@renderer/plugins/Dialog'
import { setUserApi } from '@renderer/core/apiSource'
import { getUserApiConfig } from '@renderer/api/userApi'

export default () => {
  const t = useI18n()

  return async() => {
    await setUserApi(appSetting['common.apiSource'])
    void getUserApiConfig().then(response => {
      if (response.success) {
        userApi.list = response.data
      }
    }).catch(err => {
      console.log(err)
    })

    // Initialize userApi state
    userApi.status = false
    userApi.message = 'initing'
    userApi.apis = {}
    qualityList.value = {}

    // For web version, we'll handle user API initialization differently
    // since we don't have real-time IPC updates
    if (!window.lx.apiInitPromise[1]) {
      window.lx.apiInitPromise[2](false)
    }
  }
}
