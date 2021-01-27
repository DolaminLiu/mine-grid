import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getPane } from '@/utils/util'

const sso = {
  state: {
    menus: [],
    panes: [], // [{ key: 'home', tab: '首页', path: 'about:blank', breadList: ['首页'], closable: true }]
    activeKey: 'home'
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
    }
  },
  actions: {
    setMenus ({ commit }, menus) {
      commit('SET_MENUS', menus)
    },
    setActiveKey: ({ commit }, key) => {
      commit('ADD_PANE_BY_KEY', key)
      commit('SET_ACTIVE_KEY', key)
    }
  }
}

export default sso
