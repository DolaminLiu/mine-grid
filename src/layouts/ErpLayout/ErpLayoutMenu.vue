<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ErpHeaderMenu',
  props: {
    myMenus: {
      type: Array,
      default () {
        return []
      }
    },
    theme: {
      type: String,
      default: 'light'
    },
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  computed: {
    ...mapGetters(['menus', 'activeKey'])
  },
  methods: {
    handleClick (e) {
      this.$store.dispatch('setActiveKey', e.key)
    },
    renderMenuItem (e) {
      const { menuId, menuName, childMenus } = e

      if (childMenus.length) {
        const menus = childMenus.map(menu => this.renderMenuItem(menu))
        return (
          <a-sub-menu key={menuId} title={menuName}>
            {menus}
          </a-sub-menu>
        )
      } else {
        return (
          <a-menu-item key={menuId}>{menuName}</a-menu-item>
        )
      }
    }
  },
  render () {
    const {
      handleClick,
      activeKey,
      $props: {
        myMenus,
        theme,
        mode
      }
    } = this
    const menuItems = myMenus.map(menu => this.renderMenuItem(menu))

    return (
      <a-menu
        selectedKeys={[activeKey]}
        theme={theme}
        mode={mode}
        {...{ on: { click: handleClick } }}>
        {menuItems}
      </a-menu>
    )
  }
}
</script>
