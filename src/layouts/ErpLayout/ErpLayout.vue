<template>
  <a-layout class="layout">
    <erp-layout-header />
    <a-layout>
      <a-layout-sider class="sider" :width="siderWidth">
        <erp-layout-menu :my-menus="myMenus" />
      </a-layout-sider>
      <router-view />
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ErpLayoutHeader from './ErpLayoutHeader'
import ErpLayoutMenu from './ErpLayoutMenu'

export default {
  name: 'ErpLayout',
  components: {
    ErpLayoutHeader,
    ErpLayoutMenu
  },
  computed: {
    ...mapGetters(['activeKey', 'menus']),
    myMenus () {
      const { menus } = this
      let myMenus = []

      menus.forEach(menu => {
        this.isExist(menu) && (myMenus = menu.childMenus)
      })

      return myMenus
    },
    siderWidth () {
      return this.myMenus.length ? 160 : 0
    }
  },
  methods: {
    isExist (menu) {
      let flag = false

      if (menu.childMenus.length > 0) {
        menu.childMenus.forEach(item => {
          !flag && (flag = this.isExist(item))
        })
      } else {
        flag = menu.menuId === this.activeKey
      }

      return flag
    }
  },
  mounted () {
    const { $ls, $http, $store } = this

    $ls.remove(ACCESS_TOKEN)
    $http.post('/user/login', { userName: '18825214097', password: '123456' })
      .then(() => {
        $http.post('/role/getRoleMenu', { systemCode: 'ERP' })
          .then(res => {
            const { data } = res
            $store.dispatch('setMenus', data)
          })
      })
  }
}
</script>

<style lang="less">
.layout.ant-layout {
  height: 100%;
  background: #edeff6;

  > .ant-layout-header {
    padding: 0;
    display: flex;
    align-items: center;
    height: 50px;
    background-color: #060747;
    line-height: 50px;

    .ant-menu.ant-menu-dark {
      flex: 1;
      min-width: 0;

      &,
      & .ant-menu-sub{
        background-color: #060747;
        line-height: 50px;
      }

      .ant-menu-item-selected {
        background-color: #5681F4;
      }
    }
  }

  .ant-tabs.ant-tabs-card {
    background: #ffffff;

    .ant-tabs-bar {
      margin: 0;
      border-bottom: 0;

      .ant-tabs-tab {
        margin: 0;
        padding: 0 8px;
        background: #ffffff;
        border: 0;
        border-right: 1px solid #E9E9E9;
        border-radius: 0;
        color: #666666;
        font-size: 12px;

        .ant-tabs-close-x {
          margin-left: 5px;
          color: rgba(0, 0, 0, 0.15);

          &:hover {
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }

      .ant-tabs-tab-active {
        background: #F6F7FA;
        border-bottom: 3px solid #5681F4;
        font-weight: 400;
      }
    }
  }

  .ant-tabs-nav {
    .ant-tabs-tab {
      .icon-home {
        margin-right: 0;
        padding: 0 4px;
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }

  .sider {
    background: #ffffff;

    .ant-menu-item {
      width: 100%;

      &::after {
        transition: none;
      }

      &:active {
        background: #F6F7FA;
        color: #000000;
      }
    }

    .ant-menu-item-selected {
      color: #000000;

      &::after {
        transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), -webkit-transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }

    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background: #F6F7FA;

      &::after {
        left: 0;
        right: auto;
      }
    }
  }
}
</style>
