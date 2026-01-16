const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const proxyRoute = require('./routes/proxy')
const ipcRoute = require('./routes/ipc')

const app = express()
const PORT = process.env.PORT || 3000

// 允许跨域
app.use(cors())
// 支持大数据包 (如导入歌单)
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// 1. 静态资源托管 (托管 Vue 编译后的 dist 目录)
app.use(express.static(path.join(__dirname, '../dist')))

// 2. API 路由
app.use('/api/proxy', proxyRoute) // 处理跨域请求
app.use('/api/ipc', ipcRoute)     // 处理 IPC 调用

// 3. SPA 路由回退 (所有非 API 请求返回 index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`LX Music Server running at http://localhost:${PORT}`)
})
