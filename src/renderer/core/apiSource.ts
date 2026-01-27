// Mock store and utils
const apiSource = {
  value: ''
}

const qualityList = {
  value: {}
}

const userApi = {
  status: false,
  message: 'initing',
  apis: {}
}

const appSetting = {
  'common.apiSource': ''
}

const setApiSource = () => {
  console.log('setApiSource called')
}

const musicSdk = {
  supportQuality: {}
}

export const setUserApi = async(apiId: string) => {
  // For web version, we'll handle API source setting differently
  console.log('Setting API source:', apiId)
  
  // Update the API source in the store
  apiSource.value = apiId
  
  // Update the app setting if needed
  if (apiId != appSetting['common.apiSource']) {
    setApiSource()
  }
  
  // Initialize quality list and user API state
  if (/^user_api/.test(apiId)) {
    qualityList.value = {}
    userApi.status = false
    userApi.message = 'initing'
    userApi.apis = {}
  } else {
    qualityList.value = {}
  }
  
  // Resolve the API init promise
  if (window.lx?.apiInitPromise?.[2]) {
    window.lx.apiInitPromise[2](true)
  }
}
