import express from 'express'
import path from 'path'
import listRoutes from './list'
import leaderboardRoutes from './leaderboard'
import userApiRoutes from './userApi'
import searchRoutes from './search'
import downloadRoutes from './download'
import settingRoutes from './setting'

const registerRoutes = (app: express.Application) => {
  // API 路由前缀
  const apiPrefix = '/api'
  
  // 健康检查
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })
  
  // 注册各模块路由
  app.use(`${apiPrefix}/list`, listRoutes)
  app.use(`${apiPrefix}/leaderboard`, leaderboardRoutes)
  app.use(`${apiPrefix}/user-api`, userApiRoutes)
  app.use(`${apiPrefix}/search`, searchRoutes)
  app.use(`${apiPrefix}/download`, downloadRoutes)
  app.use(`${apiPrefix}/setting`, settingRoutes)
  
  // 前端路由 fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../renderer/index.html'))
  })
}

export default registerRoutes
