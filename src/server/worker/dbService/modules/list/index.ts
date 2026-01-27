import { getDB } from '../../db'

export const getUserLists = async () => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM user_list ORDER BY location_update_time')
  return stmt.all()
}

export const addUserList = async (list: any) => {
  const db = getDB()
  const stmt = db.prepare(`
    INSERT INTO user_list (id, name, source, source_list_id, location_update_time, create_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  stmt.run(
    list.id,
    list.name,
    list.source,
    list.source_list_id,
    Date.now(),
    Date.now()
  )
}

export const updateUserList = async (list: any) => {
  const db = getDB()
  const stmt = db.prepare(`
    UPDATE user_list SET name = ?, source = ?, source_list_id = ?, location_update_time = ?
    WHERE id = ?
  `)
  stmt.run(
    list.name,
    list.source,
    list.source_list_id,
    Date.now(),
    list.id
  )
}

export const removeUserList = async (id: string) => {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM user_list WHERE id = ?')
  stmt.run(id)
}

export const updateUserListPosition = async (data: any) => {
  const db = getDB()
  const tx = db.transaction((data: any) => {
    for (const item of data) {
      const stmt = db.prepare('UPDATE user_list SET location_update_time = ? WHERE id = ?')
      stmt.run(item.position, item.id)
    }
  })
  tx(data)
}

export const getListMusics = async (listId: string) => {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM list_music WHERE list_id = ? ORDER BY position')
  const rows = stmt.all(listId)
  return rows.map(row => ({
    ...row,
    music_info: JSON.parse(row.music_info)
  }))
}

export const addListMusics = async (listId: string, musics: any[]) => {
  const db = getDB()
  
  // 获取当前最大位置
  const maxPosStmt = db.prepare('SELECT MAX(position) as max_pos FROM list_music WHERE list_id = ?')
  const maxPosResult = maxPosStmt.get(listId)
  let position = (maxPosResult?.max_pos || -1) + 1
  
  const tx = db.transaction((musics: any[]) => {
    for (const music of musics) {
      const stmt = db.prepare(`
        INSERT INTO list_music (id, list_id, music_info, position, add_time)
        VALUES (?, ?, ?, ?, ?)
      `)
      stmt.run(
        music.id,
        listId,
        JSON.stringify(music.music_info),
        position++,
        Date.now()
      )
    }
  })
  tx(musics)
}

export const updateListMusics = async (musics: any[]) => {
  const db = getDB()
  const tx = db.transaction((musics: any[]) => {
    for (const music of musics) {
      const stmt = db.prepare('UPDATE list_music SET music_info = ? WHERE id = ?')
      stmt.run(JSON.stringify(music.music_info), music.id)
    }
  })
  tx(musics)
}

export const removeListMusics = async (listId: string, ids: string[]) => {
  const db = getDB()
  const tx = db.transaction((ids: string[]) => {
    for (const id of ids) {
      const stmt = db.prepare('DELETE FROM list_music WHERE id = ? AND list_id = ?')
      stmt.run(id, listId)
    }
  })
  tx(ids)
  
  // 重新计算位置
  await reorderListMusics(listId)
}

export const updateListMusicsPosition = async (listId: string, position: number, ids: string[]) => {
  const db = getDB()
  
  // 获取当前列表
  const currentMusics = await getListMusics(listId)
  
  // 移除要移动的歌曲
  const remainingMusics = currentMusics.filter(m => !ids.includes(m.id))
  
  // 将要移动的歌曲插入到指定位置
  const movingMusics = currentMusics.filter(m => ids.includes(m.id))
  const newMusics = [
    ...remainingMusics.slice(0, position),
    ...movingMusics,
    ...remainingMusics.slice(position)
  ]
  
  // 更新位置
  const tx = db.transaction((musics: any[]) => {
    for (let i = 0; i < musics.length; i++) {
      const stmt = db.prepare('UPDATE list_music SET position = ? WHERE id = ?')
      stmt.run(i, musics[i].id)
    }
  })
  tx(newMusics)
}

export const overwriteListMusics = async (listId: string, musics: any[]) => {
  const db = getDB()
  const tx = db.transaction((musics: any[]) => {
    // 清空列表
    const clearStmt = db.prepare('DELETE FROM list_music WHERE list_id = ?')
    clearStmt.run(listId)
    
    // 添加新歌曲
    for (let i = 0; i < musics.length; i++) {
      const stmt = db.prepare(`
        INSERT INTO list_music (id, list_id, music_info, position, add_time)
        VALUES (?, ?, ?, ?, ?)
      `)
      stmt.run(
        musics[i].id,
        listId,
        JSON.stringify(musics[i].music_info),
        i,
        Date.now()
      )
    }
  })
  tx(musics)
}

export const clearListMusics = async (listId: string) => {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM list_music WHERE list_id = ?')
  stmt.run(listId)
}

const reorderListMusics = async (listId: string) => {
  const db = getDB()
  const musics = await getListMusics(listId)
  
  const tx = db.transaction((musics: any[]) => {
    for (let i = 0; i < musics.length; i++) {
      const stmt = db.prepare('UPDATE list_music SET position = ? WHERE id = ?')
      stmt.run(i, musics[i].id)
    }
  })
  tx(musics)
}
