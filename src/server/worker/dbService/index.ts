import { initDB, getDB, closeDB } from './db'
import { initTables } from './tables'
import { migrateDB } from './migrate'
import { verifyDB } from './verifyDB'
import * as dislikeListModule from './modules/dislike_list'
import * as downloadModule from './modules/download'
import * as listModule from './modules/list'
import * as lyricModule from './modules/lyric'
import * as musicOtherSourceModule from './modules/music_other_source'
import * as musicUrlModule from './modules/music_url'

export const createDbService = () => {
  const dbService = {
    // 初始化数据库
    init: async (dataPath: string) => {
      try {
        await initDB(dataPath)
        const dbFileExists = await verifyDB()
        if (dbFileExists) await migrateDB()
        else await initTables()
        return dbFileExists
      } catch (error) {
        console.error('Failed to init database:', error)
        return null
      }
    },
    
    // 关闭数据库
    close: async () => {
      await closeDB()
    },
    
    // 不喜欢列表模块
    dislikeList: {
      getList: async () => await dislikeListModule.getList(),
      add: async (items: any[]) => await dislikeListModule.add(items),
      remove: async (ids: string[]) => await dislikeListModule.remove(ids),
      clear: async () => await dislikeListModule.clear(),
    },
    
    // 下载模块
    download: {
      getList: async () => await downloadModule.getList(),
      add: async (items: any[]) => await downloadModule.add(items),
      update: async (id: string, data: any) => await downloadModule.update(id, data),
      remove: async (ids: string[]) => await downloadModule.remove(ids),
      clear: async () => await downloadModule.clear(),
    },
    
    // 列表模块
    list: {
      getUserLists: async () => await listModule.getUserLists(),
      addUserList: async (list: any) => await listModule.addUserList(list),
      updateUserList: async (list: any) => await listModule.updateUserList(list),
      removeUserList: async (id: string) => await listModule.removeUserList(id),
      updateUserListPosition: async (data: any) => await listModule.updateUserListPosition(data),
      getListMusics: async (listId: string) => await listModule.getListMusics(listId),
      addListMusics: async (listId: string, musics: any[]) => await listModule.addListMusics(listId, musics),
      updateListMusics: async (musics: any[]) => await listModule.updateListMusics(musics),
      removeListMusics: async (listId: string, ids: string[]) => await listModule.removeListMusics(listId, ids),
      updateListMusicsPosition: async (listId: string, position: number, ids: string[]) => await listModule.updateListMusicsPosition(listId, position, ids),
      overwriteListMusics: async (listId: string, musics: any[]) => await listModule.overwriteListMusics(listId, musics),
      clearListMusics: async (listId: string) => await listModule.clearListMusics(listId),
    },
    
    // 歌词模块
    lyric: {
      getLyric: async (id: string) => await lyricModule.getLyric(id),
      saveLyric: async (id: string, lyric: string, tlyric: string, rlyric: string) => await lyricModule.saveLyric(id, lyric, tlyric, rlyric),
    },
    
    // 音乐其他源模块
    musicOtherSource: {
      getMusicInfo: async (id: string) => await musicOtherSourceModule.getMusicInfo(id),
      saveMusicInfo: async (id: string, data: any) => await musicOtherSourceModule.saveMusicInfo(id, data),
    },
    
    // 音乐 URL 模块
    musicUrl: {
      getMusicUrl: async (id: string) => await musicUrlModule.getMusicUrl(id),
      saveMusicUrl: async (id: string, url: string, expire: number) => await musicUrlModule.saveMusicUrl(id, url, expire),
    },
  }
  
  return dbService
}
