import express from 'express'

const router = express.Router()

// 获取下载列表
router.get('/', async (req, res) => {
  try {
    const downloadList = await global.lx.worker.dbService.download.getList()
    res.json({ success: true, data: downloadList })
  } catch (error) {
    console.error('Failed to get download list:', error)
    res.status(500).json({ success: false, message: 'Failed to get download list' })
  }
})

// 添加下载任务
router.post('/', async (req, res) => {
  try {
    const downloadTask = req.body
    await global.lx.worker.dbService.download.add([downloadTask])
    res.json({ success: true, message: 'Download task added successfully' })
  } catch (error) {
    console.error('Failed to add download task:', error)
    res.status(500).json({ success: false, message: 'Failed to add download task' })
  }
})

// 更新下载任务
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    await global.lx.worker.dbService.download.update(id, updateData)
    res.json({ success: true, message: 'Download task updated successfully' })
  } catch (error) {
    console.error('Failed to update download task:', error)
    res.status(500).json({ success: false, message: 'Failed to update download task' })
  }
})

// 删除下载任务
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await global.lx.worker.dbService.download.remove([id])
    res.json({ success: true, message: 'Download task deleted successfully' })
  } catch (error) {
    console.error('Failed to delete download task:', error)
    res.status(500).json({ success: false, message: 'Failed to delete download task' })
  }
})

// 清空下载列表
router.delete('/', async (req, res) => {
  try {
    await global.lx.worker.dbService.download.clear()
    res.json({ success: true, message: 'Download list cleared successfully' })
  } catch (error) {
    console.error('Failed to clear download list:', error)
    res.status(500).json({ success: false, message: 'Failed to clear download list' })
  }
})

export default router
