// server/index.js
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

// 引入原有的业务逻辑模块 (你需要将 src/main 下的核心逻辑剥离出来)
// 注意：这部分工作量最大，你需要将 src/main/modules 下的逻辑适配为普通函数
// const musicApi = require('../src/main/modules/musicApi') 
// const dbService = require('../src/main/worker/dbService')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))

// 1. 静态资源托管 (托管编译后的 Vue 前端)
app.use(express.static(path.join(__dirname, '../dist')))

// 2. 核心 API 路由 (对应 IPC invoke)
app.post('/api/invoke/:channel', async (req, res) => {
  const channel = req.params.channel
  const data = req.body

  try {
    let result = null
    
    // 路由分发 (Routing)
    switch (channel) {
      case 'music_search':
        // 调用原本的搜索逻辑
        // result = await musicApi.search(data) 
        break;
      case 'list_get':
        // 调用原本的数据库逻辑
        // result = await dbService.getAllLists()
        break;
      case 'music_url':
        // 最关键：获取音乐 URL
        // Web 端无法直接跨域请求，必须由这里(Node)去请求第三方服务器
        // result = await musicApi.getUrl(data)
        break;
      default:
        console.warn('Unknown channel:', channel)
        result = {}
    }
    
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// 3. 处理所有其他路由请求，返回 index.html (SPA 必须)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`LX Music Server running on port ${PORT}`)
})
