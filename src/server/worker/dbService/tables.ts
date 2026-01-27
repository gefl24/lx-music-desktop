import { getDB } from './db'

export const initTables = async () => {
  const db = getDB()
  
  // 不喜欢列表
  db.exec(`
    CREATE TABLE IF NOT EXISTS dislike_list (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      create_time INTEGER NOT NULL
    );
  `)
  
  // 下载列表
  db.exec(`
    CREATE TABLE IF NOT EXISTS download_list (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      singer TEXT NOT NULL,
      album_name TEXT NOT NULL,
      pic_url TEXT,
      lyric TEXT,
      tlyric TEXT,
      rlyric TEXT,
      status TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      size INTEGER NOT NULL DEFAULT 0,
      url TEXT,
      save_path TEXT,
      music_info TEXT NOT NULL,
      add_time INTEGER NOT NULL,
      last_update_time INTEGER NOT NULL
    );
  `)
  
  // 用户列表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_list (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source TEXT,
      source_list_id TEXT,
      location_update_time INTEGER NOT NULL,
      create_time INTEGER NOT NULL
    );
  `)
  
  // 列表歌曲
  db.exec(`
    CREATE TABLE IF NOT EXISTS list_music (
      id TEXT PRIMARY KEY,
      list_id TEXT NOT NULL,
      music_info TEXT NOT NULL,
      position INTEGER NOT NULL,
      add_time INTEGER NOT NULL,
      FOREIGN KEY (list_id) REFERENCES user_list (id) ON DELETE CASCADE
    );
  `)
  
  // 歌词
  db.exec(`
    CREATE TABLE IF NOT EXISTS lyric (
      id TEXT PRIMARY KEY,
      lyric TEXT,
      tlyric TEXT,
      rlyric TEXT,
      update_time INTEGER NOT NULL
    );
  `)
  
  // 音乐其他源
  db.exec(`
    CREATE TABLE IF NOT EXISTS music_other_source (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      update_time INTEGER NOT NULL
    );
  `)
  
  // 音乐 URL
  db.exec(`
    CREATE TABLE IF NOT EXISTS music_url (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      expire INTEGER NOT NULL,
      update_time INTEGER NOT NULL
    );
  `)
  
  // 创建索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_list_music_list_id ON list_music (list_id);
    CREATE INDEX IF NOT EXISTS idx_list_music_position ON list_music (list_id, position);
    CREATE INDEX IF NOT EXISTS idx_download_list_status ON download_list (status);
  `)
}
