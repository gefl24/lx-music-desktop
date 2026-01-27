import express from 'express'
import path from 'path'

const app = express()
const port = 3000

// 中间件
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// 简单的 API 路由
app.get('/api/leaderboard', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: '飙升榜',
        source: 'kw',
        boardId: 'kw__16',
      },
      {
        id: '2',
        name: '新歌榜',
        source: 'kw',
        boardId: 'kw__17',
      },
    ],
  })
})

app.get('/api/leaderboard/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      list: [
        {
          id: '1',
          name: '示例歌曲 1',
          singer: '示例歌手 1',
          album: '示例专辑 1',
          picUrl: '',
          interval: '03:30',
        },
        {
          id: '2',
          name: '示例歌曲 2',
          singer: '示例歌手 2',
          album: '示例专辑 2',
          picUrl: '',
          interval: '04:20',
        },
      ],
    },
  })
})

app.get('/api/songList', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: '热门歌单 1',
        source: 'kw',
        sourceListId: 'kw__1',
        picUrl: '',
        count: 100,
      },
      {
        id: '2',
        name: '热门歌单 2',
        source: 'kw',
        sourceListId: 'kw__2',
        picUrl: '',
        count: 150,
      },
    ],
  })
})

app.get('/api/songList/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      list: [
        {
          id: '1',
          name: '示例歌曲 1',
          singer: '示例歌手 1',
          album: '示例专辑 1',
          picUrl: '',
          interval: '03:30',
        },
        {
          id: '2',
          name: '示例歌曲 2',
          singer: '示例歌手 2',
          album: '示例专辑 2',
          picUrl: '',
          interval: '04:20',
        },
      ],
    },
  })
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
