const express = require('express')
const router = express.Router()

// 模拟 IPC invoke
router.post('/invoke/:channel', async (req, res) => {
  const channel = req.params.channel
  const data = req.body

  console.log(`[IPC] Invoke: ${channel}`)

  try {
    let result = null
    switch (channel) {
      case 'get_app_setting':
        // TODO: 从数据库读取设置
        result = {} 
        break
      case 'get_system_fonts':
        result = ['Arial', 'Microsoft YaHei'] // Web 端无法获取系统字体，返回默认列表
        break
      default:
        // console.warn(`Unhandled IPC channel: ${channel}`)
        result = null
    }
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
