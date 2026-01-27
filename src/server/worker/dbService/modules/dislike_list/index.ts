import { getDB } from '../../db'

export const getList = async () => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM dislike_list')
  return stmt.all()
}

export const add = async (items: any[]) => {
  const db = getDB()
  const tx = db.transaction((items: any[]) => {
    for (const item of items) {
      const stmt = db.prepare(`
        INSERT INTO dislike_list (id, type, content, create_time)
        VALUES (?, ?, ?, ?)
      `)
      stmt.run(
        item.id,
        item.type,
        item.content,
        Date.now()
      )
    }
  })
  tx(items)
}

export const remove = async (ids: string[]) => {
  const db = getDB()
  const tx = db.transaction((ids: string[]) => {
    for (const id of ids) {
      const stmt = db.prepare('DELETE FROM dislike_list WHERE id = ?')
      stmt.run(id)
    }
  })
  tx(ids)
}

export const clear = async () => {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM dislike_list')
  stmt.run()
}
