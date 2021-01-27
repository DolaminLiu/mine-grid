<template>
  <div class="my-drag-layout">
    <div class="head">
      <a-input placeholder="请输入大屏名称..." class="screen-name" v-model="screen_name" :maxLength="20"/>
      <div>
        <a-icon type="setting" style="margin-left:10px;cursor:pointer" @click="basicSet"/>
        <a-button class="forward">预览</a-button>
        <a-button type="primary" class="save">保存</a-button>
        <a-button type="primary" class="save">保存并发布</a-button>
      </div>
    </div>
    <div class="board">
    <div class="board-left">
      <a-menu mode="horizontal">
        <a-menu-item
          v-for="menu in menuList"
          :key="menu.name"
          @click="addElement(menu)"
        >
          <a-icon :type="menu.name" />
        </a-menu-item>
      </a-menu>
      <div class="my-drag-box">
        <div class="drag-scroll">
        <div class="drag-parent">
        <grid-layout
          :layout.sync="layoutData"
          :col-num="100"
          :row-height="layoutHeight"
          :is-draggable="dialogVisible"
          :is-resizable="dialogVisible"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layoutData"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            :class="item.active ? 'click-active' : ''"
            @resize="resizeEvent"
            @moved="movedEvent"
          >
            <drag-item
              :item="item"
              @deleteItem="deleteItem"
              @onActivated="onActivated"
              @copyItem="copyItem"
            />
          </grid-item>
        </grid-layout>
      </div>
      </div>
      </div>
    </div>
    <div class="board-right">
      <a-menu mode="horizontal">
        <a-menu-item :key="currentType">
          {{ currentType }}
        </a-menu-item>
      </a-menu>
      <div style="padding: 3px">
        <a-collapse default-active-key="1" v-if="currentType === '页面设计'">
        <a-collapse-panel key="1" header="仪表盘描述">
          <a-textarea placeholder="请输入仪表盘描述" :rows="4" />
        </a-collapse-panel>
      </a-collapse>
      <a-tabs type="card" v-else>
        <a-tab-pane key="1" tab="数据"> 数据 </a-tab-pane>
        <a-tab-pane key="2" tab="样式"> 样式 </a-tab-pane>
      </a-tabs>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import DragItem from './components/DragItem'
const GridLayout = VueGridLayout.GridLayout
const GridItem = VueGridLayout.GridItem
export default {
  components: {
    GridLayout,
    GridItem,
    DragItem
  },
  data () {
    return {
      screen_name: '',
      dialogVisible: true, // 是否可拖拽或改变大小
      layoutHeight: 100, // 默认高度
      nowIndex: 0,
      menuList: [
        {
          name: 'bar-chart',
          comment: 'MeBar',
          type: 'v-charts'
        },
        {
          name: 'line-chart',
          comment: 'MeLine',
          type: 'v-charts'
        },
        {
          name: 'pie-chart',
          comment: 'MePie',
          type: 'v-charts'
        },
        {
          name: 'table',
          comment: 'MeTable',
          type: 'table'
        }
      ],
      // 布局数据
      layoutData: [],
      currentType: '页面设计'
    }
  },
  methods: {
    basicSet () {
      this.currentType = '页面设计'
      this.layoutData.map(item => {
        this.$set(item, 'active', false)
      })
    },
    resizeEvent (i, newH, newW, newHPx, newWPx) {
      console.log(
        'RESIZE i=' +
          i +
          ', H=' +
          newH +
          ', W=' +
          newW +
          ', H(px)=' +
          newHPx +
          ', W(px)=' +
          newWPx
      )
      this.layoutData.map((item) => {
        if (item.i === i) {
          this.$set(item, 'commentWidth', newWPx)
          this.$set(item, 'commentHeight', newHPx)
        }
      })
    },
    movedEvent (i, newX, newY) {
      console.log('MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    addElement (item) {
      console.log(this.nowIndex)
      this.layoutData.map((item) => {
        this.$set(item, 'active', false)
      })
      let width = item.type === 'table' ? 100 : 50
      console.log(width)
      this.layoutData.push({
        x: 0,
        y: this.nowIndex,
        w: width,
        h: 3,
        active: true,
        i: `${this.nowIndex + 1}`,
        title: '',
        components: item.comment,
        type: item.type,
        chartData: {
          columns: ['日期', '访问用户', '下单用户2', '下单率2'],
          rows: [
            { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
            { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
            { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
            { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
            { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
            { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
          ]
        }
      })
      console.log(this.layoutData)
      this.nowIndex = Number(this.nowIndex) + 1
      this.currentType = item.type
    },
    deleteItem (item) {
      this.layoutData = this.layoutData.filter((ele) => {
        return ele.i !== item.i
      })
    },
    onActivated (item) {
      this.$nextTick(() => {
        this.layoutData.map((ele) => {
          if (ele.i === item.i) {
            this.$set(ele, 'active', true)
          } else {
            this.$set(ele, 'active', false)
          }
        })
        this.currentType = item.type
      })
    },
    copyItem (item) {
      console.log(this.nowIndex)
      const { active } = item
      const midData = { ...item }
      midData.i = `${Number(this.nowIndex) + 1}`
      midData.y = this.nowIndex
      midData.active = !active
      this.layoutData.unshift(midData)
      this.nowIndex = Number(this.nowIndex) + 1
    }
  },
  created () {
    // this.init()
  }
}
</script>

 <style lang="less">
 .my-drag-layout {
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
 }
 .head {
    padding: 10px 30px;
    background: #f7f7f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .screen-name {
      margin-left: 10px;
      border: none;
      flex: 1;
    }
    button.save {
      margin-left: 10px;
      -webkit-box-shadow: 0 0 6px 2px rgba(24,144,255,.5);
      box-shadow: 0 0 6px 2px rgba(24,144,255,.5);
    }
    .forward {
      background: #4bd4cf;
      color: #ffffff;
      margin-left: 10px;
    }
  }
.board {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
}
.board-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.my-drag-box {
  width: 100%;
  flex: 1;
  position: relative;
}
.drag-scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    overflow-y: auto;
    background: #dfeaf4;
}
.drag-parent {
  width: 100%;
  min-height: 100%;
  display: block;
  position: relative;
  -webkit-box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.05);
  box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.05);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
  margin: 0 auto;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  background-image: linear-gradient(hsla(0, 0%, 85.1%, 0.4) 1px, transparent 0),
    linear-gradient(90deg, hsla(0, 0%, 85.1%, 0.4) 1px, transparent 0),
    linear-gradient(hsla(0, 0%, 85.1%, 0.4) 1px, transparent 0),
    linear-gradient(90deg, hsla(0, 0%, 85.1%, 0.4) 1px, transparent 0);
  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
}
.vue-grid-item {
  border: 1px solid #bfbfbf;
  background: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
}
.vue-grid-item.click-active {
  z-index: 1;
  border-color: #1890ff;
  -webkit-box-shadow: rgba(24, 144, 255, 0.2) 0 0 0 2px;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.attention {
  position: absolute;
  left: 10px;
  width: 20px;
  bottom: 8px;
  color: #fa8c16;
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
.ant-menu-item {
  border-bottom: none;
}
.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-item-selected {
  border-bottom: none;
}
.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  border-bottom: none;
}
.ant-menu-horizontal > .ant-menu-item,
.ant-menu-horizontal > .ant-menu-submenu {
  border-bottom: none;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
  height: 30px;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  height: 30px;
  line-height: 30px;
}
.ant-tabs-tabpane {
  padding: 0 10px;
}

.board-right {
  width: 420px;
  height: 100%;
}
</style>
