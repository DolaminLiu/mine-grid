<template>
  <div style="width: 100%;height:100%">
    <div class="drag-box" @click="onActivated(item)">
            <div class="report-title">{{ item.i || "" }}</div>
            <component
              :is="item.components"
              :dataSource="item"
              :setting="item.setting"
              :commentWidth="item.commentWidth"
              :commentHieght="item.commentHeight"
              :judge-width="true"
              :style="{ flex: 1, overflow: item.type === 'v-charts' ? 'hidden' : 'auto'}"
            ></component>
          </div>
          <div class="oprate">
            <a-dropdown placement="bottomRight" :trigger="['click']">
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                <a-icon
                  type="ellipsis"
                  style="color: #ffffff; font-size: 16px"
                />
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click="deleteItem(item)">
                  <a href="javascript:;">
                    <a-icon type="delete" style="margin-right: 5px" />删除
                  </a>
                </a-menu-item>
                <a-menu-item @click="copyItem(item)">
                  <a href="javascript:;">
                    <a-icon type="copy" style="margin-right: 5px" />复制</a
                  >
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="attention">
            <a-icon type="question-circle" />
          </div>
  </div>
</template>

<script>
import { MeBar, MeLine, MePie, MeTable } from '@/components/VChart'
export default {
  props: ['item'],
  components: {
    MeLine,
    MeBar,
    MePie,
    MeTable
  },
  methods: {
    deleteItem (item) {
      this.$emit('deleteItem', item)
    },
    onActivated (item) {
      this.$emit('onActivated', item)
    },
    copyItem (item) {
      this.$emit('copyItem', item)
    }
  }
}
</script>

<style>
.drag-box {
  padding: 8px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
