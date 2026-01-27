// Mock vueTools
const computed = (fn: () => any) => ({ value: fn() })
const watch = () => () => {}
const ref = (value: any) => ({ value })
const onBeforeUnmount = () => {}
type Ref<T> = { value: T }

// Mock store
const isFullscreen = { value: false }

// Mock setting
const appSetting = {
  'common.fontSize': 14,
}

// Mock utils
const getFontSizeWithScreen = () => 14

const useKeyEvent = ({ handleSelectAllData, listRef }: {
  handleSelectAllData: () => void
  listRef: Ref<any>
}) => {
  const keyEvent = {
    isShiftDown: false,
    isModDown: false,
  }

  const handle_key_shift_down = () => {
    keyEvent.isShiftDown ||= true
  }
  const handle_key_shift_up = () => {
    keyEvent.isShiftDown &&= false
  }
  const handle_key_mod_down = () => {
    keyEvent.isModDown ||= true
  }
  const handle_key_mod_up = () => {
    keyEvent.isModDown &&= false
  }
  const handle_key_mod_a_down = ({ event }: LX.KeyDownEevent) => {
    if (!event || (event.target as HTMLElement).tagName == 'INPUT' || document.activeElement != listRef.value?.$el) return
    event.preventDefault()
    if (event.repeat) return
    keyEvent.isModDown = false
    handleSelectAllData()
  }

  onBeforeUnmount()
  window.key_event.on('key_shift_down', handle_key_shift_down)
  window.key_event.on('key_shift_up', handle_key_shift_up)
  window.key_event.on('key_mod_down', handle_key_mod_down)
  window.key_event.on('key_mod_up', handle_key_mod_up)
  window.key_event.on('key_mod+a_down', handle_key_mod_a_down)

  return keyEvent
}


export default ({ props, listRef }: {
  props: {
    list: LX.Music.MusicInfoOnline[]
  }
  listRef: Ref<any>
}) => {
  const selectedList = ref([])
  let lastSelectIndex = -1
  const listItemHeight = computed(() => {
    return Math.ceil((isFullscreen.value ? getFontSizeWithScreen() : appSetting['common.fontSize']) * 2.3)
  })

  const removeAllSelect = () => {
    selectedList.value = []
  }
  const handleSelectAllData = () => {
    removeAllSelect()
    selectedList.value = [...props.list]
  }
  const keyEvent = useKeyEvent({ handleSelectAllData, listRef })

  const handleSelectData = (clickIndex: number) => {
    if (keyEvent.isShiftDown) {
      if (selectedList.value.length) {
        removeAllSelect()
        if (lastSelectIndex != clickIndex) {
          let isNeedReverse = false
          let _lastSelectIndex = lastSelectIndex
          if (clickIndex < _lastSelectIndex) {
            let temp = _lastSelectIndex
            _lastSelectIndex = clickIndex
            clickIndex = temp
            isNeedReverse = true
          }
          selectedList.value = props.list.slice(_lastSelectIndex, clickIndex + 1)
          if (isNeedReverse) selectedList.value.reverse()
        }
      } else {
        selectedList.value.push(props.list[clickIndex])
        lastSelectIndex = clickIndex
      }
    } else if (keyEvent.isModDown) {
      lastSelectIndex = clickIndex
      let item = props.list[clickIndex]
      let index = selectedList.value.indexOf(item)
      if (index < 0) {
        selectedList.value.push(item)
      } else {
        selectedList.value.splice(index, 1)
      }
    } else if (selectedList.value.length) {
      removeAllSelect()
    }
  }

  watch()

  return {
    selectedList,
    listItemHeight,
    removeAllSelect,
    handleSelectData,
  }
}
