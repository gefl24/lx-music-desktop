import { getDB } from './db'

export const verifyDB = async (): Promise<boolean> => {
  const db = getDB()
  
  try {
    // 检查是否存在必要的表
    const tables = ['dislike_list', 'download_list', 'user_list', 'list_music', 'lyric', 'music_other_source', 'music_url']
    
    for (const table of tables) {
      const result = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table)
      if (!result) {
        console.warn(`Table ${table} does not exist`)
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Failed to verify database:', error)
    return false
  }
}
