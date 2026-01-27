import express from 'express'
import * as musicSdk from '@renderer/utils/musicSdk'

const router = express.Router()

// 获取排行榜列表
router.get('/', async (req, res) => {
  try {
    const leaderboards = []
    
    // 遍历所有音乐源，获取排行榜列表
    for (const source in musicSdk) {
      if (musicSdk[source]?.leaderboard?.list) {
        const boards = musicSdk[source].leaderboard.list.map((board: any) => ({
          ...board,
          source
        }))
        leaderboards.push(...boards)
      }
    }
    
    res.json({ success: true, data: leaderboards })
  } catch (error) {
    console.error('Failed to get leaderboards:', error)
    res.status(500).json({ success: false, message: 'Failed to get leaderboards' })
  }
})

// 获取排行榜详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, source } = req.query
    
    const sourceStr = typeof source === 'string' ? source : ''
    
    if (!sourceStr || !musicSdk[sourceStr]?.leaderboard?.getList) {
      return res.status(400).json({ success: false, message: 'Invalid source' })
    }
    
    const result = await musicSdk[sourceStr].leaderboard.getList(id, parseInt(page as string))
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Failed to get leaderboard detail:', error)
    res.status(500).json({ success: false, message: 'Failed to get leaderboard detail' })
  }
})

export default router
