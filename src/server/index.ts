import express from 'express'
import path from 'path'
import { initGlobalData, initAppSetting } from './app'
import registerRoutes from './routes'

const app = express()
const PORT = process.env.PORT || 3000

// 初始化全局数据
initGlobalData()

// 静态文件服务
app.use(express.static(path.join(__dirname, '../renderer')))

// 中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 注册路由
registerRoutes(app)

// 启动服务器
;(async () => {
  try {
    // 初始化应用设置
    await initAppSetting()
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Web interface: http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
})()
