import apiClient from './index'

export const getPlaylists = async () => {
  const response = await apiClient.get('/list')
  return response.data
}

export const createPlaylist = async (playlist: any) => {
  const response = await apiClient.post('/list', playlist)
  return response
}

export const updatePlaylist = async (id: string, playlist: any) => {
  const response = await apiClient.put(`/list/${id}`, playlist)
  return response
}

export const deletePlaylist = async (id: string) => {
  const response = await apiClient.delete(`/list/${id}`)
  return response
}

export const getPlaylistMusics = async (id: string) => {
  const response = await apiClient.get(`/list/${id}/musics`)
  return response.data
}

export const addPlaylistMusics = async (id: string, musics: any[]) => {
  const response = await apiClient.post(`/list/${id}/musics`, musics)
  return response
}

export const removePlaylistMusics = async (id: string, ids: string[]) => {
  const response = await apiClient.delete(`/list/${id}/musics`, {
    data: { ids }
  })
  return response
}

export const updatePlaylistMusicPosition = async (id: string, position: number, ids: string[]) => {
  const response = await apiClient.put(`/list/${id}/musics/position`, {
    position,
    ids
  })
  return response
}
