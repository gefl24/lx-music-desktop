import express from 'express'
import * as musicSdk from '@renderer/utils/musicSdk'

const router = express.Router()

// 搜索音乐
router.get('/', async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20, source } = req.query
    
    if (!keyword) {
      return res.status(400).json({ success: false, message: 'Keyword is required' })
    }
    
    const sourceStr = typeof source === 'string' ? source : ''
    
    if (!sourceStr || !musicSdk[sourceStr]?.search) {
      return res.status(400).json({ success: false, message: 'Invalid source' })
    }
    
    const result = await musicSdk[sourceStr].search(keyword as string, parseInt(page as string), parseInt(limit as string))
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Failed to search music:', error)
    res.status(500).json({ success: false, message: 'Failed to search music' })
  }
})

// 获取音乐详情
router.get('/detail', async (req, res) => {
  try {
    const { id, source } = req.query
    
    const sourceStr = typeof source === 'string' ? source : ''
    
    if (!id || !sourceStr || !musicSdk[sourceStr]?.musicInfo) {
      return res.status(400).json({ success: false, message: 'Invalid id or source' })
    }
    
    const result = await musicSdk[sourceStr].musicInfo.getMusicInfo(id as string)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Failed to get music detail:', error)
    res.status(500).json({ success: false, message: 'Failed to get music detail' })
  }
})

// 获取音乐 URL
router.get('/url', async (req, res) => {
  try {
    const { id, source, quality = 'standard' } = req.query
    
    const sourceStr = typeof source === 'string' ? source : ''
    
    if (!id || !sourceStr || !musicSdk[sourceStr]?.musicInfo) {
      return res.status(400).json({ success: false, message: 'Invalid id or source' })
    }
    
    const result = await musicSdk[sourceStr].musicInfo.getMusicUrl(id as string, quality as string)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Failed to get music url:', error)
    res.status(500).json({ success: false, message: 'Failed to get music url' })
  }
})

export default router
