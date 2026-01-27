import express from 'express'
import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import defaultSetting from '@common/defaultSetting'

const router = express.Router()

// 获取设置
router.get('/', async (req, res) => {
  try {
    const settingPath = path.join(global.lxDataPath, 'setting.json')
    let setting = { ...defaultSetting }
    
    if (existsSync(settingPath)) {
      try {
        const data = JSON.parse(readFileSync(settingPath, 'utf8'))
        setting = { ...setting, ...data }
      } catch (error) {
        console.error('Failed to read setting:', error)
      }
    }
    
    res.json({ success: true, data: setting })
  } catch (error) {
    console.error('Failed to get setting:', error)
    res.status(500).json({ success: false, message: 'Failed to get setting' })
  }
})

// 更新设置
router.put('/', async (req, res) => {
  try {
    const settingPath = path.join(global.lxDataPath, 'setting.json')
    const updateData = req.body
    
    // 读取现有设置
    let setting = { ...defaultSetting }
    if (existsSync(settingPath)) {
      try {
        const data = JSON.parse(readFileSync(settingPath, 'utf8'))
        setting = { ...setting, ...data }
      } catch (error) {
        console.error('Failed to read setting:', error)
      }
    }
    
    // 更新设置
    setting = { ...setting, ...updateData }
    
    // 保存设置
    writeFileSync(settingPath, JSON.stringify(setting, null, 2), 'utf8')
    
    // 更新全局设置
    global.lx.appSetting = setting
    
    res.json({ success: true, message: 'Setting updated successfully' })
  } catch (error) {
    console.error('Failed to update setting:', error)
    res.status(500).json({ success: false, message: 'Failed to update setting' })
  }
})

// 重置设置
router.post('/reset', async (req, res) => {
  try {
    const settingPath = path.join(global.lxDataPath, 'setting.json')
    
    // 重置为默认设置
    const setting = { ...defaultSetting }
    
    // 保存设置
    writeFileSync(settingPath, JSON.stringify(setting, null, 2), 'utf8')
    
    // 更新全局设置
    global.lx.appSetting = setting
    
    res.json({ success: true, message: 'Setting reset successfully' })
  } catch (error) {
    console.error('Failed to reset setting:', error)
    res.status(500).json({ success: false, message: 'Failed to reset setting' })
  }
})

export default router
