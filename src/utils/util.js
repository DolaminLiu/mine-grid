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

export function initDataWd (item) {
  let obj = {}
  let formate = []
  if (item.time_type === '2') {
    formate = [
      { title: 'YYYYMM', value: '1' },
      { title: 'YYYY-MM', value: '2' },
      { title: 'YYYY年MM月', value: '3' },
      { title: 'MM月', value: '4' }
    ]
  } else if (item.time_type === '3') {
    formate = [
      { title: 'YYYY-MM-DD', value: '1' },
      { title: 'YYYY年MM月DD日', value: '2' }
    ]
  }
  if (item.time_type === '0') {
    obj = {
      code: item.dataset_code,
      dataIndex: item.field_cn,
      field_en: item.field_en,
      title: item.field_cn,
      hasSort: item.is_sort === '1',
      sortName: item.field_en,
      sortType: '',
      width: 'auto',
      align: 'left',
      id: item.id,
      group: item.group,
      format: '',
      time_type: '0'
    }
  } else {
    obj = {
      code: item.dataset_code,
      dataIndex: item.field_cn,
      field_en: item.field_en,
      title: item.field_cn,
      hasSort: item.is_sort === '1',
      sortName: item.field_en,
      sortType: '',
      group: item.group,
      width: 'auto',
      align: 'left',
      id: item.id,
      format: '',
      formatOptions: formate,
      time_type: item.time_type
    }
  }
  return obj
}

export function initDataZb (item) {
  const obj = {
    code: item.dataset_code,
    dataIndex: item.field_cn,
    field_en: item.field_en,
    title: item.field_cn,
    hasSort: item.is_sort === '1',
    sortName: item.field_en,
    sortType: '',
    group: item.group,
    width: 'auto',
    align: 'left',
    valType: '1',
    valWay: '1',
    valRange: '',
    id: item.id,
    format: ''
  }
  return obj
}

export function randomDate () {
  let date = new Date(Math.random() * 1756334057000)
  return date
}

export function getRandomChineseWord () {
  var _rsl = ''
  var _randomUniCode = Math.floor(Math.random() * (40870 - 19968) + 19968).toString(16)
  // eslint-disable-next-line no-eval
  eval('_rsl=' + '"\\u' + _randomUniCode + '"')
  return _rsl
}
export function getRandomNumber (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}
