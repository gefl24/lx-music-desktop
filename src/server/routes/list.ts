import express from 'express'

const router = express.Router()

// 获取歌单列表
router.get('/', async (req, res) => {
  try {
    const lists = await global.lx.worker.dbService.list.getUserLists()
    res.json({ success: true, data: lists })
  } catch (error) {
    console.error('Failed to get user lists:', error)
    res.status(500).json({ success: false, message: 'Failed to get user lists' })
  }
})

// 创建歌单
router.post('/', async (req, res) => {
  try {
    const list = req.body
    await global.lx.worker.dbService.list.addUserList(list)
    res.json({ success: true, message: 'Playlist created successfully' })
  } catch (error) {
    console.error('Failed to create playlist:', error)
    res.status(500).json({ success: false, message: 'Failed to create playlist' })
  }
})

// 更新歌单
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const list = { ...req.body, id }
    await global.lx.worker.dbService.list.updateUserList(list)
    res.json({ success: true, message: 'Playlist updated successfully' })
  } catch (error) {
    console.error('Failed to update playlist:', error)
    res.status(500).json({ success: false, message: 'Failed to update playlist' })
  }
})

// 删除歌单
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await global.lx.worker.dbService.list.removeUserList(id)
    res.json({ success: true, message: 'Playlist deleted successfully' })
  } catch (error) {
    console.error('Failed to delete playlist:', error)
    res.status(500).json({ success: false, message: 'Failed to delete playlist' })
  }
})

// 获取歌单歌曲
router.get('/:id/musics', async (req, res) => {
  try {
    const { id } = req.params
    const musics = await global.lx.worker.dbService.list.getListMusics(id)
    res.json({ success: true, data: musics })
  } catch (error) {
    console.error('Failed to get playlist musics:', error)
    res.status(500).json({ success: false, message: 'Failed to get playlist musics' })
  }
})

// 添加歌单歌曲
router.post('/:id/musics', async (req, res) => {
  try {
    const { id } = req.params
    const musics = req.body
    await global.lx.worker.dbService.list.addListMusics(id, musics)
    res.json({ success: true, message: 'Musics added successfully' })
  } catch (error) {
    console.error('Failed to add musics to playlist:', error)
    res.status(500).json({ success: false, message: 'Failed to add musics to playlist' })
  }
})

// 删除歌单歌曲
router.delete('/:id/musics', async (req, res) => {
  try {
    const { id } = req.params
    const { ids } = req.body
    await global.lx.worker.dbService.list.removeListMusics(id, ids)
    res.json({ success: true, message: 'Musics deleted successfully' })
  } catch (error) {
    console.error('Failed to delete musics from playlist:', error)
    res.status(500).json({ success: false, message: 'Failed to delete musics from playlist' })
  }
})

// 更新歌单歌曲位置
router.put('/:id/musics/position', async (req, res) => {
  try {
    const { id } = req.params
    const { position, ids } = req.body
    await global.lx.worker.dbService.list.updateListMusicsPosition(id, position, ids)
    res.json({ success: true, message: 'Music positions updated successfully' })
  } catch (error) {
    console.error('Failed to update music positions:', error)
    res.status(500).json({ success: false, message: 'Failed to update music positions' })
  }
})

export default router
