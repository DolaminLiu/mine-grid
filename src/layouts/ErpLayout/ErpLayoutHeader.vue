<template>
  <a-layout-header>
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo">
    </div>

    <erp-layout-menu :my-menus="menus" theme="dark" mode="horizontal" />

    <div class="user-wrapper">
      <a href="javascript:;" class="user-wrapper__action">
        <a-icon type="desktop" style="margin-right: 12px;" />
        <span>控制台</span>
      </a>

      <a-dropdown placement="bottomRight">
        <span class="user-wrapper__action">
          <a-avatar class="avatar" size="small" icon="user" />
          <span>74583839...</span>
          <a-icon type="down" style="margin-left: 14px;" />
        </span>
        <a-menu slot="overlay">
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script>
import { mapGetters } from 'vuex'
import ErpLayoutMenu from './ErpLayoutMenu'
export default {
  name: 'ErpHeader',
  components: {
    ErpLayoutMenu
  },
  computed: {
    ...mapGetters(['menus'])
  }
}
</script>

<style lang="less" scoped>
.logo {
  margin-left: 25px;
  margin-right: 25px;

  img {
    display: block;
    width: 79px;
    height: 35px;
  }
}

.user-wrapper {
  margin-right: 14px;
  flex: 0 0 256px;
  align-self: flex-end;
  display: flex;

  &__action {
    padding: 0 14px;
    color: #ffffff;
    font-size: 14px;
    line-height: 50px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(255,255,255,.25);
      color: #40a9ff;
    }

    .avatar {
      margin-top: -2px;
      margin-right: 12px;
    }
  }
}
</style>
