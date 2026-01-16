const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// 定义数据库文件路径
// 优先使用环境变量，否则使用当前目录下的 data 文件夹 (Docker 挂载点)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data')
const DB_PATH = path.join(DATA_DIR, 'lx.data.db')

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

let db = null

// 数据库初始化 SQL (来自原 tables.ts)
const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS "db_info" (
    "id" INTEGER NOT NULL UNIQUE,
    "field_name" TEXT,
    "field_value" TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
  );

  CREATE TABLE IF NOT EXISTS "my_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT,
    "sourceListId" TEXT,
    "position" INTEGER NOT NULL,
    "locationUpdateTime" INTEGER,
    PRIMARY KEY("id")
  );

  CREATE TABLE IF NOT EXISTS "my_list_music_info" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "singer" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "interval" TEXT,
    "meta" TEXT NOT NULL,
    UNIQUE("id","listId")
  );
  CREATE INDEX IF NOT EXISTS "index_my_list_music_info" ON "my_list_music_info" ("id", "listId");

  CREATE TABLE IF NOT EXISTS "my_list_music_info_order" (
    "listId" TEXT NOT NULL,
    "musicInfoId" TEXT NOT NULL,
    "order" INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "index_my_list_music_info_order" ON "my_list_music_info_order" ("listId", "musicInfoId");
`

const init = () => {
  if (db) return db
  
  console.log('Initializing Database at:', DB_PATH)
  try {
    db = new Database(DB_PATH) // verbose: console.log 可以开启日志
    
    // 执行建表语句
    db.exec(INIT_SQL)
    
    // 简单的版本检查 (可选)
    const versionCheck = db.prepare('SELECT field_value FROM db_info WHERE field_name = ?').get('version')
    if (!versionCheck) {
      db.prepare('INSERT INTO db_info (field_name, field_value) VALUES (?, ?)').run('version', '2.0.0')
    }
    
    console.log('Database initialized successfully.')
  } catch (err) {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  }
  return db
}

const getDB = () => {
  if (!db) return init()
  return db
}

module.exports = {
  getDB
}
