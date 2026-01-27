import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API request failed:', error)
    return Promise.reject(error)
  }
)

// 导出 API 客户端
export default apiClient

// 导出 API 模块
export * from './list'
export * from './leaderboard'
export * from './userApi'
export * from './search'
export * from './download'
export * from './setting'
