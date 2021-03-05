import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getPane, initDataWd, initDataZb, randomDate, getRandomNumber } from '@/utils/util'
import { Object } from 'core-js'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    menus: [],
    panes: [], // [{ key: 'home', tab: '首页', path: 'about:blank', breadList: ['首页'], closable: true }]
    activeKey: 'home',
    themeWd: [],
    themeZb: [],
    dataBaseDefault: [
      { '维度': '2021-01-01', '指标': '120' },
      { '维度': '2022-02-03', '指标': '130' },
      { '维度': '1998-03-11', '指标': '110' },
      { '维度': '2021-01-09', '指标': '65' },
      { '维度': '1981-11-02', '指标': '43' },
      { '维度': '2001-06-11', '指标': '72' },
      { '维度': '2021-08-09', '指标': '190' },
      { '维度': '2008-07-08', '指标': '175' },
      { '维度': '2011-02-01', '指标': '200' },
      { '维度': '1994-01-06', '指标': '108' }
    ]
  },
  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    ADD_PANE_BY_KEY: (state, key) => {
      let pane = null
      let flag = true

      state.menus.forEach(menu => {
        !pane && (pane = getPane(menu, key))

        if (pane && flag) {
          pane.breadList.length > 1 && pane.breadList.unshift(menu.menuName)
          pane.path = `${menu.menuDomian}${pane.path}?token=${Vue.ls.get(ACCESS_TOKEN)}`
          flag = false
        }
      })

      pane && !state.panes.filter(item => item.key === pane.key).length && state.panes.push(pane)
    },
    SET_ACTIVE_KEY: (state, key) => {
      state.activeKey = key
    },
    SET_THEMT_WD: (state, data) => {
      const result = data.map(item => {
        const res = { ...item }
        const comm = initDataWd(res)
        const add = {
          valType: '1',
          valValue: '',
          themeType: 'wd'
        }
        if (item.child) {
          const arrChid = []
          item.child.map(ele => {
            const chil = initDataWd(ele)
            const obj = Object.assign({}, { ...chil }, { ...add })
            arrChid.push({ ...obj })
          })
          return {
            ...comm,
            ...add,
            open: true,
            children: arrChid
          }
        } else {
          return {
            ...comm,
            ...add,
            open: true
          }
        }
      })
      state.themeWd = result
    },
    SET_THEMT_ZB: (state, data) => {
      const result = data.map(item => {
        const arrChid = []
        const add = {
          themeType: 'zb',
          type: '', // 图形类型
          chartWidth: '2', // 折线宽度
          chartDataWay: '1', // 聚合
          order: '', // 排序
          area: false, // 面积图
          smooth: false, // 平滑
          chartSymbol: '', // 标记图形
          symbolSize: 6, // 标记图形大小
          chartLabel: false, // 是否显示标签
          labelPosition: '', // 标签位置
          labelFormat: '0' // 标签格式
        }
        item.child.map(ele => {
          const chil = initDataZb({ ...ele })
          const obj = Object.assign({}, { ...chil }, { ...add })
          arrChid.push({ ...obj })
        })
        return {
          dataIndex: item.virtual_group,
          id: item.virtual_group,
          open: true,
          themeType: 'zb',
          children: arrChid
        }
      })
      state.themeZb = result
    },
    SET_DATA_DEFAULT: (state, data) => {
      let arr = []
      let arr2 = new Array(10)
      arr2.fill(1)
      let arr3 = []

      data.map(item => {
        if (item.type === 'index') { // 指标getRandomNumber
          item.data.map(ele => {
            if (ele.child) {
              ele.child.map((chi) => {
                arr.push({ name: chi.field_cn, type: '4' })
                // objs = Object.assign({ ...objs }, { [`${chi.field_cn}`]: getRandomNumber(50, 200) })
              })
            }
          })
        } else { // 维度
          item.data.map(ele => {
            if (ele.time_type === '3') { // 日期
              arr.push({ name: ele.field_cn, type: ele.time_type })
              // objs = Object.assign({ ...objs }, { [`${ele.field_cn}`]: moment(randomDate()).format('YYYY-MM-DD') })
              if (ele.child) {
                ele.child.map(chi => {
                  arr.push({ name: chi.field_cn, type: chi.time_type })
                })
              }
            } else {
              if (ele.child) {
                ele.child.map((chi) => {
                  arr.push({ name: chi.field_cn, type: '0' })
                })
              } else {
                arr.push({ name: ele.field_cn, type: '0' })
              }
            }
          })
        }
      })
      const defaultArr = [{ name: '指标', type: '4' }, { name: '维度', type: '0' }]

      const arrRes = [...arr, ...defaultArr]

      arr2.map((value, index) => {
        let objs = {}
        arrRes.map(val => {
          if (val.type === '1') { // 年
            objs = Object.assign({ ...objs }, { [`${val.name}`]: moment(randomDate()).format('YYYY') })
          } else if (val.type === '2') { // 月
            objs = Object.assign({ ...objs }, { [`${val.name}`]: moment(randomDate()).format('YYYY-MM') })
          } else if (val.type === '3') { // 日
            objs = Object.assign({ ...objs }, { [`${val.name}`]: moment(randomDate()).format('YYYY-MM-DD') })
          } else if (val.type === '4') { // 数字
            objs = Object.assign({ ...objs }, { [`${val.name}`]: getRandomNumber(80, 300) })
          } else if (val.type === '0') { // 文字
            objs = Object.assign({ ...objs }, { [`${val.name}`]: `${val.name}${index}` })
          }
        })
        arr3.push(objs)
      })
      state.dataBaseDefault = arr3
    }
  },
  getters: {
    themeWd: state => state.themeWd,
    themeZb: state => state.themeZb,
    dataBaseDefault: state => state.dataBaseDefault
  },
  actions: {
    setMenus ({ commit }, menus) {
      commit('SET_MENUS', menus)
    },
    setActiveKey: ({ commit }, key) => {
      commit('ADD_PANE_BY_KEY', key)
      commit('SET_ACTIVE_KEY', key)
    },
    setThemeWd ({ commit }, data) {
      commit('SET_THEMT_WD', data)
    },
    setThemeZb ({ commit }, data) {
      commit('SET_THEMT_ZB', data)
    },
    setDataBaseDefault ({ commit }, data) {
      commit('SET_DATA_DEFAULT', data)
    }
  }
}
