import apiClient from './index'

export const searchMusic = async (keyword: string, source: string, page: number = 1, limit: number = 20) => {
  const response = await apiClient.get('/search', {
    params: { keyword, source, page, limit }
  })
  return response.data
}

export const getMusicDetail = async (id: string, source: string) => {
  const response = await apiClient.get('/search/detail', {
    params: { id, source }
  })
  return response.data
}

export const getMusicUrl = async (id: string, source: string, quality: string = 'standard') => {
  const response = await apiClient.get('/search/url', {
    params: { id, source, quality }
  })
  return response.data
}
