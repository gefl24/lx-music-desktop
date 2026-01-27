import apiClient from './index'

export const getDownloadList = async () => {
  const response = await apiClient.get('/download')
  return response.data
}

export const addDownloadTask = async (task: any) => {
  const response = await apiClient.post('/download', task)
  return response
}

export const updateDownloadTask = async (id: string, data: any) => {
  const response = await apiClient.put(`/download/${id}`, data)
  return response
}

export const deleteDownloadTask = async (id: string) => {
  const response = await apiClient.delete(`/download/${id}`)
  return response
}

export const clearDownloadList = async () => {
  const response = await apiClient.delete('/download')
  return response
}
