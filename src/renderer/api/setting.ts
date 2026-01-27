import apiClient from './index'

export const getSetting = async () => {
  const response = await apiClient.get('/setting')
  return response.data
}

export const updateSetting = async (setting: any) => {
  const response = await apiClient.put('/setting', setting)
  return response
}

export const resetSetting = async () => {
  const response = await apiClient.post('/setting/reset')
  return response
}
