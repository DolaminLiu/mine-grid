export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

export function getPane (menu, activeKey) {
  const { childMenus, menuId, menuName, menuUrl } = menu
  let pane = null
  let flag = true

  if (childMenus.length > 0) {
    childMenus.forEach(item => {
      !pane && (pane = getPane(item, activeKey))

      if (pane && flag) {
        pane.breadList.unshift(item.menuName)
        flag = false
      }
    })
  } else {
    pane = menuId === activeKey
      ? { key: menuId, tab: menuName, path: menuUrl, breadList: [menuName], closable: true }
      : null
  }

  return pane
}
