import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

export const initDB = async (dataPath: string) => {
  const dbPath = path.join(dataPath, 'lx.data.db')
  db = new Database(dbPath, {
    fileMustExist: false,
    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
  })
  
  // 配置数据库
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('cache_size = -64000') // 64MB 缓存
}

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export const closeDB = async () => {
  if (db) {
    db.close()
    db = null
  }
}
