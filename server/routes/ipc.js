const express = require('express')
const router = express.Router()
const listService = require('../services/listService')

// 统一的错误处理包装
const handleAction = async (res, action) => {
  try {
    const result = await action()
    res.json(result === undefined ? null : result)
  } catch (err) {
    console.error('IPC Error:', err)
    res.status(500).json({ error: err.message })
  }
}

router.post('/invoke/:channel', async (req, res) => {
  const channel = req.params.channel
  const data = req.body

  // console.log(`[IPC] Invoke: ${channel}`, data)

  switch (channel) {
    // --- 列表相关 (List) ---
    case 'list_get': // 获取所有列表
      handleAction(res, () => listService.getAllUserList())
      break
      
    case 'list_music_get': // 获取列表详情 (需要 listId)
      handleAction(res, () => listService.getListMusics(data))
      break
      
    case 'list_create': // 创建列表 (简化版，直接复用前端传来的结构)
      // 前端通常传来 { position, lists }
      handleAction(res, () => listService.setList(data.lists))
      break
      
    case 'list_remove': // 删除列表
      handleAction(res, () => listService.removeList(data))
      break
      
    case 'list_music_add': // 添加歌曲
      // data: { id: listId, musicInfos: [], addMusicLocationType: 'bottom' }
      handleAction(res, () => listService.addMusic(data.id, data.musicInfos))
      break
      
    case 'list_music_remove': // 删除歌曲
      // data: { listId, ids }
      handleAction(res, () => listService.removeMusic(data.listId, data.ids))
      break

    // --- 其他基础 ---
    case 'get_app_setting':
      res.json({}) // 暂时返回空设置，使用前端默认值
      break
      
    default:
      console.warn(`[IPC] Unhandled channel: ${channel}`)
      res.json(null)
  }
})

module.exports = router
