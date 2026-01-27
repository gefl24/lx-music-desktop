import apiClient from './index'

export const getUserApiConfig = async () => {
  const response = await apiClient.get('/user-api')
  return response.data
}

export const saveUserApiConfig = async (config: any[]) => {
  const response = await apiClient.post('/user-api', config)
  return response
}

export const testUserApi = async (apiConfig: any) => {
  const response = await apiClient.post('/user-api/test', { apiConfig })
  return response.data
}
