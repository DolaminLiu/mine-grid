<template>
  <vdr
    :key="item.index"
    :w="item.width"
    :h="item.height"
    :min-width="200"
    :min-height="200"
    :debug="false"
    :snap="true"
    :x="item.x"
    :y="item.y"
    :snapTolerance="5"
    :handles="['br']"
    :grid="[10, 10]"
    :class-name="'my-drag'"
    class-name-handle="my-handle-class"
    @activated="onActivated"
    @deactivated="onDeactivated"
    v-on:resizing="onResize"
    :class="`${item.active ? 'click-active':''}`"
  >
    <div v-if="item.type === 'v-charts'" class="drag-box">
      <div class="report-title">{{ item.sort || ''}}</div>
      <div class="report-title">{{ item.components || ''}}</div>
      <component
        :is="item.components"
        :dataSource="item"
        :setting="item.setting"
        :commentWidth="commentWidth"
        :commentHieght="commentHeight"
        :judge-width="true"
      ></component>
    </div>
    <div v-if="item.type === 'table'" class="drag-box">
      <div class="report-title">{{ item.sort || ''}}</div>
      <div class="report-title">{{ item.components || ''}}</div>
      <component
        :is="item.components"
        :key="item.key"
        :dataSource="item"
      ></component>
    </div>
    <div class="oprate">
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <a-icon type="ellipsis" style="color: #ffffff; font-size: 16px" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item @click="deleteItem(item)">
            <a href="javascript:;">
              <a-icon type="delete" style="margin-right:5px"/>删除
            </a>
          </a-menu-item>
          <a-menu-item @click="copyItem">
            <a href="javascript:;">
              <a-icon type="copy" style="margin-right:5px" />复制</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="attention">
      <a-icon type="question-circle" />
    </div>
  </vdr>
</template>

<script>
import vdr from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import { MeBar, MeLine, MePie, MeTable } from '@/components/VChart'
export default {
  props: ['item'],
  name: 'app',
  components: {
    vdr,
    MeLine,
    MeBar,
    MeTable,
    MePie
  },
  data () {
    return {
      thisItem: {},
      vLine: [],
      hLine: [],
      commentWidth: 0,
      commentHeight: 0,
      x: 0,
      active: '',
      colors: ['#6BAAFA', '#2CD7D7', '#74D791', '#FBDC62', '#F78C7E', '#B48AD2', '#FDBB86', '#FEB8D5', '#FFECDC', '#4CC1C1']
    }
  },
  mounted () {
    this.thisItem = this.item
  },
  watch: {
    item (newVal) {
      this.thisItem = newVal
    }
  },
  methods: {
    onResize (x, y, width, height) {
      this.commentWidth = width
      this.commentHeight = height
      const para = { ...this.item }
      para.width = width
      para.height = height
      this.thisItem = para
      // this.$emit('resize')
    },
    onActivated () {
      // this.active = 'click-active'
      this.$emit('onActivated', this.thisItem)
    },
    onDeactivated () {
      this.active = ''
    },
    deleteItem () {
      this.$emit('deleteItem', this.thisItem)
    },
    copyItem () {
      this.$emit('copyItem', this.thisItem)
    }
  }
}
</script>

<style>
.my-drag {
  border: 1px solid #bfbfbf;
  background: #ffffff;
  overflow: hidden;
}
.my-drag.click-active {
  z-index: 1;
  border-color: #1890ff;
  -webkit-box-shadow: rgba(24, 144, 255, 0.2) 0 0 0 2px;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.oprate {
  width: 24px;
  position: absolute;
  right: 4px;
  top: 0;
  line-height: 0;
  font-size: 14px;
  overflow: hidden;
  padding: 2px 4px;
  border-radius: 0 0 2px 2px;
  cursor: pointer;
  background: #1890ff;
  color: #fff;
  -webkit-transform: translateY(-100%);
  transform: translateY(-100%);
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  z-index: 2;
}
.click-active .oprate {
  -webkit-transform: translateY(0);
  transform: translateY(0);
}
.oprate:hover {
  background: #329cff;
}
.my-handle-class {
  position: absolute;
  height: 20px !important;
  width: 20px !important;
  z-index: 999 !important;
  box-sizing: border-box;
  background: url("../../../assets/ang.png") 0 0 no-repeat;
  background-size: 100% 100%;
  transform: rotate(270deg);
  padding: 0 0 8px 8px;
  background-repeat: no-repeat;
  background-origin: content-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 300ms linear;
  -ms-transition: all 300ms linear;
  transition: all 300ms linear;
}
.attention {
  position: absolute;
    left: 10px;
    width: 20px;
    bottom: 8px;
    color: #fa8c16;
}
.drag-box {
  padding: 8px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.my-handle-class-br {
  bottom: -14px;
  right: -14px;
  cursor: se-resize;
}
</style>
