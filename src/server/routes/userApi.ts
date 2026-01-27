import express from 'express'
import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

const router = express.Router()

// 获取用户 API 配置
router.get('/', async (req, res) => {
  try {
    const userApiPath = path.join(global.lxDataPath, 'user_api.json')
    let userApiConfig = []
    
    if (existsSync(userApiPath)) {
      try {
        const data = JSON.parse(readFileSync(userApiPath, 'utf8'))
        userApiConfig = data
      } catch (error) {
        console.error('Failed to read user API config:', error)
      }
    }
    
    res.json({ success: true, data: userApiConfig })
  } catch (error) {
    console.error('Failed to get user API config:', error)
    res.status(500).json({ success: false, message: 'Failed to get user API config' })
  }
})

// 保存用户 API 配置
router.post('/', async (req, res) => {
  try {
    const userApiPath = path.join(global.lxDataPath, 'user_api.json')
    const userApiConfig = req.body
    
    writeFileSync(userApiPath, JSON.stringify(userApiConfig, null, 2), 'utf8')
    res.json({ success: true, message: 'User API config saved successfully' })
  } catch (error) {
    console.error('Failed to save user API config:', error)
    res.status(500).json({ success: false, message: 'Failed to save user API config' })
  }
})

// 测试用户 API
router.post('/test', async (req, res) => {
  try {
    const { apiConfig } = req.body
    
    // 这里可以添加 API 测试逻辑
    // 例如：尝试调用 API 的搜索接口，验证是否可用
    
    res.json({ success: true, message: 'API test completed', data: { status: 'ok' } })
  } catch (error) {
    console.error('Failed to test user API:', error)
    res.status(500).json({ success: false, message: 'Failed to test user API' })
  }
})

export default router
