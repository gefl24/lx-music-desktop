const { getDB } = require('../db')

// ----------------------
// 辅助函数：生成 SQL 语句 (Statements)
// ----------------------
// 对应 src/main/worker/dbService/modules/list/statements.ts
const stmts = {
  getList: () => getDB().prepare(`
    SELECT "id", "name", "source", "sourceListId", "position", "locationUpdateTime"
    FROM "my_list" ORDER BY "position" ASC
  `),
  
  getMusic: () => getDB().prepare(`
    SELECT mInfo."id", mInfo."name", mInfo."singer", mInfo."source", mInfo."interval", mInfo."meta"
    FROM my_list_music_info mInfo
    LEFT JOIN my_list_music_info_order O
    ON mInfo.id=O.musicInfoId AND O.listId=@listId
    WHERE mInfo.listId=@listId
    ORDER BY O."order" ASC
  `),

  insertList: () => getDB().prepare(`
    INSERT OR REPLACE INTO "my_list" ("id", "name", "source", "sourceListId", "position", "locationUpdateTime")
    VALUES (@id, @name, @source, @sourceListId, @position, @locationUpdateTime)
  `),

  deleteList: () => getDB().prepare('DELETE FROM "my_list" WHERE "id"=?'),
  
  // 级联删除：删除列表时，删除该列表下的歌曲和排序信息
  deleteMusicByListId: () => getDB().prepare('DELETE FROM "my_list_music_info" WHERE "listId"=?'),
  deleteOrderByListId: () => getDB().prepare('DELETE FROM "my_list_music_info_order" WHERE "listId"=?'),

  insertMusic: () => getDB().prepare(`
    INSERT OR REPLACE INTO "my_list_music_info" ("id", "listId", "name", "singer", "source", "interval", "meta")
    VALUES (@id, @listId, @name, @singer, @source, @interval, @meta)
  `),

  insertOrder: () => getDB().prepare(`
    INSERT INTO "my_list_music_info_order" ("listId", "musicInfoId", "order")
    VALUES (@listId, @musicInfoId, @order)
  `),
  
  deleteMusic: () => getDB().prepare(`DELETE FROM "my_list_music_info" WHERE "id"=@id AND "listId"=@listId`),
  deleteOrder: () => getDB().prepare(`DELETE FROM "my_list_music_info_order" WHERE "musicInfoId"=@id AND "listId"=@listId`)
}

// ----------------------
// 业务逻辑 (Service Methods)
// ----------------------

module.exports = {
  // 1. 获取所有列表（不含歌曲详情，仅列表头）
  getAllUserList: () => {
    return stmts.getList().all()
  },

  // 2. 获取指定列表内的所有歌曲
  getListMusics: (listId) => {
    const musics = stmts.getMusic().all({ listId })
    // 解析 meta 字段 (DB中是JSON字符串，前端需要对象)
    return musics.map(m => ({
      ...m,
      meta: m.meta ? JSON.parse(m.meta) : {}
    }))
  },

  // 3. 批量创建/覆盖列表
  setList: (lists) => {
    const insert = stmts.insertList()
    const db = getDB()
    const transaction = db.transaction((lists) => {
      // 这里的逻辑简化处理：直接 upsert
      for (const list of lists) {
        insert.run(list)
      }
    })
    transaction(lists)
  },

  // 4. 删除列表
  removeList: (ids) => {
    const db = getDB()
    const transaction = db.transaction((ids) => {
      for (const id of ids) {
        stmts.deleteList().run(id)
        stmts.deleteMusicByListId().run(id)
        stmts.deleteOrderByListId().run(id)
      }
    })
    transaction(ids)
  },

  // 5. 添加歌曲到列表
  addMusic: (listId, musicInfos) => {
    const db = getDB()
    // 获取当前列表歌曲数量，用于计算 order
    const currentCount = stmts.getMusic().all({ listId }).length
    
    const transaction = db.transaction((infos) => {
      let order = currentCount
      for (const info of infos) {
        // 插入歌曲信息
        stmts.insertMusic().run({
          id: info.id,
          listId: listId,
          name: info.name,
          singer: info.singer,
          source: info.source,
          interval: info.interval || null,
          meta: JSON.stringify(info.meta || {})
        })
        
        // 插入排序信息
        stmts.insertOrder().run({
          listId: listId,
          musicInfoId: info.id,
          order: order++
        })
      }
    })
    transaction(musicInfos)
  },

  // 6. 删除列表中的歌曲
  removeMusic: (listId, ids) => {
    const db = getDB()
    const transaction = db.transaction((ids) => {
      for (const id of ids) {
        stmts.deleteMusic().run({ listId, id })
        stmts.deleteOrder().run({ listId, id })
      }
    })
    transaction(ids)
  }
}
