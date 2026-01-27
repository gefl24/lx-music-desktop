import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import defaultSetting from '@common/defaultSetting'

export const initHotKey = async () => {
  const hotkeyPath = path.join(global.lxDataPath, 'hotkey.json')
  if (existsSync(hotkeyPath)) {
    try {
      const data = JSON.parse(readFileSync(hotkeyPath, 'utf8'))
      return data
    } catch (error) {
      console.error('Failed to read hotkey config:', error)
    }
  }
  return {
    local: {
      enable: false,
      keys: {},
    },
    global: {
      enable: false,
      keys: {},
    },
  }
}

export const initSetting = async () => {
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
  
  // 保存设置
  writeFileSync(settingPath, JSON.stringify(setting, null, 2), 'utf8')
  
  return { setting }
}

export const getTheme = () => {
  return {
    id: 'default',
    name: '默认主题',
    isDark: false,
    colors: {
      primary: '#409EFF',
      secondary: '#6C757D',
      success: '#67C23A',
      warning: '#E6A23C',
      danger: '#F56C6C',
      info: '#909399',
      light: '#F5F7FA',
      dark: '#303133',
    },
  }
}
