/**
 * 在浏览器打开URL
 * @param {*} url
 */
export const openUrl = async(url: string) => {
  if (!/^https?:\/\//.test(url)) return
  window.open(url, '_blank')
}


/**
 * 复制文本到剪贴板
 * @param str
 */
export const clipboardWriteText = (str: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str)
  } else {
    // Fallback for non-secure contexts
    const textArea = document.createElement('textarea')
    textArea.value = str
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
    document.body.removeChild(textArea)
  }
}

/**
 * 从剪贴板读取文本
 * @returns
 */
export const clipboardReadText = async(): Promise<string> => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.readText()
  } else {
    // Fallback for non-secure contexts
    const textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    let text = ''
    try {
      text = document.execCommand('paste') ? textArea.value : ''
    } catch (err) {
      console.error('Failed to read text from clipboard:', err)
    }
    document.body.removeChild(textArea)
    return text
  }
}


export const encodePath = (path: string) => {
  // https://github.com/lyswhut/lx-music-desktop/issues/963
  // https://github.com/lyswhut/lx-music-desktop/issues/1461
  return path.replaceAll('%', '%25').replaceAll('#', '%23')
}

/**
 * 在资源管理器中打开目录
 * @param {string} dir
 */
export const openDirInExplorer = (dir: string) => {
  // For web version, we can't open the file explorer
  console.log('Opening directory:', dir)
}
