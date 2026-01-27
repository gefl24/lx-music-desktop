import apiClient from './index'

export const getLeaderboards = async () => {
  const response = await apiClient.get('/leaderboard')
  return response.data
}

export const getLeaderboardDetail = async (id: string, source: string, page: number = 1) => {
  const response = await apiClient.get(`/leaderboard/${id}`, {
    params: { source, page }
  })
  return response.data
}
