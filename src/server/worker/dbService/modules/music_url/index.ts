import { getDB } from '../../db'

export const getMusicUrl = async (id: string) => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM music_url WHERE id = ?')
  return stmt.get(id)
}

export const saveMusicUrl = async (id: string, url: string, expire: number) => {
  const db = getDB()
  
  // 检查是否已存在
  const existing = await getMusicUrl(id)
  
  if (existing) {
    const stmt = db.prepare(`
      UPDATE music_url SET url = ?, expire = ?, update_time = ?
      WHERE id = ?
    `)
    stmt.run(url, expire, Date.now(), id)
  } else {
    const stmt = db.prepare(`
      INSERT INTO music_url (id, url, expire, update_time)
      VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, url, expire, Date.now())
  }
}
