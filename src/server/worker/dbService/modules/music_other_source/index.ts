import { getDB } from '../../db'

export const getMusicInfo = async (id: string) => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM music_other_source WHERE id = ?')
  const row = stmt.get(id)
  return row ? {
    ...row,
    data: JSON.parse(row.data)
  } : null
}

export const saveMusicInfo = async (id: string, data: any) => {
  const db = getDB()
  
  // 检查是否已存在
  const existing = await getMusicInfo(id)
  
  if (existing) {
    const stmt = db.prepare(`
      UPDATE music_other_source SET data = ?, update_time = ?
      WHERE id = ?
    `)
    stmt.run(JSON.stringify(data), Date.now(), id)
  } else {
    const stmt = db.prepare(`
      INSERT INTO music_other_source (id, data, update_time)
      VALUES (?, ?, ?)
    `)
    stmt.run(id, JSON.stringify(data), Date.now())
  }
}
