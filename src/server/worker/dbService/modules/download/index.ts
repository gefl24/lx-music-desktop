import { getDB } from '../../db'

export const getList = async () => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM download_list ORDER BY add_time DESC')
  const rows = stmt.all()
  return rows.map(row => ({
    ...row,
    music_info: JSON.parse(row.music_info)
  }))
}

export const add = async (items: any[]) => {
  const db = getDB()
  const tx = db.transaction((items: any[]) => {
    for (const item of items) {
      const stmt = db.prepare(`
        INSERT INTO download_list (
          id, name, singer, album_name, pic_url, lyric, tlyric, rlyric,
          status, progress, size, url, save_path, music_info, add_time, last_update_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      stmt.run(
        item.id,
        item.name,
        item.singer,
        item.album_name,
        item.pic_url,
        item.lyric,
        item.tlyric,
        item.rlyric,
        item.status,
        item.progress || 0,
        item.size || 0,
        item.url,
        item.save_path,
        JSON.stringify(item.music_info),
        Date.now(),
        Date.now()
      )
    }
  })
  tx(items)
}

export const update = async (id: string, data: any) => {
  const db = getDB()
  const fields = Object.keys(data)
  const values = Object.values(data)
  
  const setClause = fields.map(field => `${field} = ?`).join(', ')
  const stmt = db.prepare(`
    UPDATE download_list SET ${setClause}, last_update_time = ?
    WHERE id = ?
  `)
  
  stmt.run(
    ...values,
    Date.now(),
    id
  )
}

export const remove = async (ids: string[]) => {
  const db = getDB()
  const tx = db.transaction((ids: string[]) => {
    for (const id of ids) {
      const stmt = db.prepare('DELETE FROM download_list WHERE id = ?')
      stmt.run(id)
    }
  })
  tx(ids)
}

export const clear = async () => {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM download_list')
  stmt.run()
}
