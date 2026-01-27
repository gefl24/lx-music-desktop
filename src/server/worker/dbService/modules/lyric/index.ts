import { getDB } from '../../db'

export const getLyric = async (id: string) => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM lyric WHERE id = ?')
  return stmt.get(id)
}

export const saveLyric = async (id: string, lyric: string, tlyric: string, rlyric: string) => {
  const db = getDB()
  
  // 检查是否已存在
  const existing = await getLyric(id)
  
  if (existing) {
    const stmt = db.prepare(`
      UPDATE lyric SET lyric = ?, tlyric = ?, rlyric = ?, update_time = ?
      WHERE id = ?
    `)
    stmt.run(lyric, tlyric, rlyric, Date.now(), id)
  } else {
    const stmt = db.prepare(`
      INSERT INTO lyric (id, lyric, tlyric, rlyric, update_time)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(id, lyric, tlyric, rlyric, Date.now())
  }
}
