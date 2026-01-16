import { toRaw } from '@common/utils/vueTools'
import { openSaveDir, showSelectDialog } from '@renderer/utils/ipc'
import { useI18n } from '@renderer/plugins/i18n'
import { filterFileName, toNewMusicInfo, fixNewMusicInfoQuality, filterMusicList } from '@renderer/utils'
import { getListMusics, updateUserList, addListMusics, overwriteListMusics, createUserList } from '@renderer/store/list/action'
import { defaultList, loveList, userLists } from '@renderer/store/list/state'
import useImportTip from '@renderer/utils/compositions/useImportTip'
import { dialog } from '@renderer/plugins/Dialog'

export default () => {
  const t = useI18n()
  const showImportTip = useImportTip()

  const handleExportList = async (listInfo: LX.List.MyListInfo) => {
    if (!listInfo) return
    
    // 修复 1: 给 result 添加类型注解 (result: any)
    openSaveDir({
      title: t('lists__export_part_desc'),
      defaultPath: `lx_list_part_${filterFileName(listInfo.name)}.lxmc`,
    }).then(async (result: any) => {
      if (!result || result.canceled || !result.filePath) return
      
      // Web 兼容性处理: 检查 window.lx 是否存在
      if (window.lx && window.lx.worker) {
        void window.lx.worker.main.saveLxConfigFile(result.filePath, {
          type: 'playListPart_v2',
          data: { ...toRaw(listInfo), list: toRaw(await getListMusics(listInfo.id)) },
        })
      } else {
        console.warn('Web版暂不支持直接导出文件到本地文件系统 (需要实现浏览器下载逻辑)')
        // 你可以在这里实现一个浏览器下载 Blob 的逻辑来替代
      }
    })
  }

  const handleImportList = (listInfo: LX.List.MyListInfo, index: number) => {
    // 修复 2: 给 result 添加类型注解
    showSelectDialog({
      title: t('lists__import_part_desc'),
      properties: ['openFile'],
      filters: [
        { name: 'Play List Part', extensions: ['json', 'lxmc'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    }).then(async (result: any) => {
      if (!result || result.canceled) return
      const filePath = result.filePaths[0]
      if (!filePath) return
      
      let configData: any
      try {
        // Web 兼容性处理
        if (window.lx && window.lx.worker) {
          configData = await window.lx.worker.main.readLxConfigFile(filePath)
        } else {
           console.warn('Web版暂不支持读取本地路径 (需改为 <input type="file"> 上传)')
           return
        }
      } catch (error) {
        return
      }

      // ... 后续逻辑保持不变 ...
      let listData: LX.ConfigFile.MyListInfoPart['data']
      switch (configData.type) {
        case 'playListPart':
          listData = configData.data
          listData.list = filterMusicList(listData.list.map(m => toNewMusicInfo(m)))
          break
        case 'playListPart_v2':
          listData = configData.data
          listData.list = filterMusicList(listData.list).map(m => fixNewMusicInfoQuality(m))
          break
        default:
          showImportTip(configData.type)
          return
      }

      const targetList = [defaultList, loveList, ...userLists].find(l => l.id == listData.id)
      if (targetList) {
        const confirm = await dialog.confirm({
          message: t('lists__import_part_confirm', { importName: listData.name, localName: targetList.name }),
          cancelButtonText: t('lists__import_part_button_cancel'),
          confirmButtonText: t('lists__import_part_button_confirm'),
        })
        if (confirm) {
          listData.name = targetList.name
          switch (listData.id) {
            case defaultList.id:
            case loveList.id:
              break
            default:
              void updateUserList([
                {
                  name: listData.name,
                  id: listData.id,
                  source: (listData as LX.List.UserListInfo).source,
                  sourceListId: (listData as LX.List.UserListInfo).sourceListId,
                  locationUpdateTime: (targetList as LX.List.UserListInfo).locationUpdateTime,
                },
              ])
              break
          }
          void overwriteListMusics({
            listId: listData.id,
            musicInfos: listData.list.map(m => fixNewMusicInfoQuality(m)),
          })
          return
        }
        listData.id += `__${Date.now()}`
      }
      void createUserList({
        position: index,
        name: listData.name,
        id: listData.id,
        source: (listData as LX.List.UserListInfo).source,
        sourceListId: (listData as LX.List.UserListInfo).sourceListId,
      })
      void addListMusics(listData.id, listData.list.map(m => fixNewMusicInfoQuality(m)))
    })
  }

  return {
    handleExportList,
    handleImportList,
  }
}
