<template>
  <div class="my-drag-layout">
    <div class="head">
      <a-input
        placeholder="请输入大屏名称..."
        class="screen-name"
        v-model="screen_name"
        :maxLength="20"
      />
      <div>
        <a-icon
          type="setting"
          style="margin-left: 10px; cursor: pointer"
          @click="basicSet"
        />
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
                    :legendVisible="item.legendVisible"
                    :grid="item.grid"
                    :legend="item.legend"
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
          <a-collapse
            default-active-key="1"
            v-if="currentType === '页面设计'"
            :bordered="false"
          >
            <a-collapse-panel key="1" header="仪表盘描述">
              <a-textarea
                placeholder="请输入仪表盘描述"
                :rows="4"
                style="margin-top: 10px"
              />
            </a-collapse-panel>
          </a-collapse>
          <a-tabs type="card" v-else>
            <a-tab-pane key="1" tab="数据"> 数据 </a-tab-pane>
            <a-tab-pane key="2" tab="样式">
              <a-collapse
                active-key="1"
                v-if="currentType === 'table'"
                :bordered="false"
              >
                <a-collapse-panel key="1" header="展示性属性">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item" style="margin-bottom: 20px">
                      <div class="tit">标题</div>
                      <div class="setting">
                        <a-input
                          label="标题"
                          width="100%"
                          placeholder="请输入标题"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <a-checkbox @change="changeTableCheck('1')" disabled>
                        Checkbox1
                      </a-checkbox>
                    </div>
                    <div class="item">
                      <a-checkbox @change="changeTableCheck('2')">
                        Checkbox2
                      </a-checkbox>
                    </div>
                    <div class="item">
                      <a-checkbox @change="changeTableCheck('3')">
                        Checkbox3
                      </a-checkbox>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <a-collapse
                v-else
                :activeKey="styleCollapse"
                :bordered="false"
                :destroyInactivePanel="destroyInactivePanel"
              >
                <template #expandIcon="props">
                  <a-icon
                    type="caret-right"
                    :rotate="props.isActive ? 90 : 0"
                  />
                </template>
                <a-collapse-panel key="1" header="基础">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">标题</div>
                      <div class="setting">
                        <a-input
                          label="标题"
                          width="100%"
                          v-model="currentItem.title"
                          @change="changeBasic('title')"
                          placeholder="请输入标题"
                        />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel
                  key="2"
                  header="图例"
                  :disabled="disabledLegend"
                >
                  <a-switch
                    slot="extra"
                    default-checked
                    @change="onChangeSwitch"
                  />
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">方位</div>
                      <div class="setting">
                        <div class="setting-wrap">
                          <div
                            v-for="leg in legends1"
                            :key="leg.index"
                            :class="currentItem.legend1 === leg.name ? 'active' : ''"
                            @click="changeLegend('1', leg.name)"
                          >
                            <a-icon :type="leg.icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">水平位置</div>
                      <div class="setting">
                        <div class="setting-wrap">
                          <div
                            v-show="currentItem.legend1 === 'top' || currentItem.legend1 === 'bottom'"
                            v-for="leg in legends2"
                            :key="leg.index"
                            :class="currentItem.legend2 === leg.name ? 'active' : ''"
                            @click="changeLegend('2', leg.name)"
                          >
                            <a-icon :type="leg.icon" />
                          </div>
                          <div
                            v-show="currentItem.legend1 === 'left' || currentItem.legend1 === 'right'"
                            v-for="leg in legends2"
                            :key="leg.index"
                            :class="currentItem.legend2 === leg.name ? 'active' : ''"
                            @click="changeLegend('2', leg.name)"
                          >
                            <a-icon :type="leg.icon" style="transform:rotate(90deg)"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="3" header="坐标系网络" v-show="currentItem.components !== 'MePie'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">左边距</div>
                      <div class="setting">
                        <a-input
                          type="number"
                          style="width: 100px"
                          v-model="currentItem.grid.left"
                          @change="changeBasic('grid')"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">右边距</div>
                      <div class="setting">
                        <a-input
                          type="number"
                          style="width: 100px"
                          v-model="currentItem.grid.right"
                          @change="changeBasic('grid')"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">上边距</div>
                      <div class="setting">
                        <a-input
                          type="number"
                          style="width: 100px"
                          v-model="currentItem.grid.top"
                          @change="changeBasic('grid')"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">下边距</div>
                      <div class="setting">
                        <a-input
                          style="width: 100px"
                          v-model="currentItem.grid.bottom"
                          @change="changeBasic('grid')"
                        />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="4" header="直径" v-show="currentItem.components === 'MePie'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">直径</div>
                      <div class="setting">
                        <a-input
                          width="100%"
                          v-model="currentItem.chartSettings.radius"
                          @change="changeBasic('chartSettings')"
                        />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="5" header="位置" v-show="currentItem.components === 'MePie'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">距顶部</div>
                      <div class="setting">
                        <a-input
                          v-model="currentItem.chartSettings.offsetY"
                          @change="changeBasic('chartSettings')"
                          width="100%"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">距左边</div>
                      <div class="setting">
                        <a-input
                          v-model="currentItem.chartSettings.offsetX"
                          @change="changeBasic('chartSettings')"
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-tab-pane>
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
      destroyInactivePanel: false,
      styleCollapse: ['1', '2', '3', '4', '5'], // 打开的样式折叠面板
      dialogVisible: true, // 是否可拖拽或改变大小
      layoutHeight: 100, // 默认高度
      nowIndex: 0,
      currentItem: {},
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
      currentType: '页面设计',
      legends1: [
        { name: 'top', icon: 'border-top' },
        { name: 'right', icon: 'border-right' },
        { name: 'bottom', icon: 'border-bottom' },
        { name: 'left', icon: 'border-left' }
      ],
      legends2: [
        { name: 'left', icon: 'pic-left' },
        { name: 'center', icon: 'pic-center' },
        { name: 'right', icon: 'pic-right' }
      ],
      disabledLegend: false
    }
  },
  methods: {
    basicSet () {
      this.currentType = '页面设计'
      this.layoutData.map((item) => {
        this.$set(item, 'active', false)
      })
      this.currentItem = {}
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
      this.layoutData.map((item) => {
        this.$set(item, 'active', false)
      })
      let width = item.type === 'table' ? 100 : 50
      const addEle = {
        x: 0,
        y: this.nowIndex,
        w: width,
        h: 3,
        active: true,
        i: `${this.nowIndex + 1}`,
        title: '',
        components: item.comment,
        type: item.type,
        legendVisible: true, // 是否显示图例
        legend1: 'bottom',
        legend2: 'center',
        chartSettings: {
          radius: 80,
          offsetY: 120,
          offsetX: 50
        },
        chartExtend: {
          legend: {
            bottom: 0,
            left: 'center',
            orient: 'horizontal'
          }
        }, // 图例配置
        grid: {
          top: 40,
          left: 40,
          right: 40,
          bottom: 40
        }, // 图位置配置
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
      }
      this.layoutData.push(addEle)
      this.nowIndex = Number(this.nowIndex) + 1
      this.currentType = item.type
      this.currentItem = addEle
    },
    deleteItem (item) {
      this.layoutData = this.layoutData.filter((ele) => {
        return ele.i !== item.i
      })
      this.currentItem = {}
      this.currentType = '页面设计'
    },
    onActivated (item) {
      this.currentItem = item
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
      const { active } = item
      const midData = { ...item }
      midData.i = `${Number(this.nowIndex) + 1}`
      midData.y = this.nowIndex
      midData.active = !active
      this.layoutData.unshift(midData)
      this.nowIndex = Number(this.nowIndex) + 1
    },
    onChangeSwitch (checked) {
      this.styleCollapse = ['1', '3']
      this.destroyInactivePanel = !checked
      this.disabledLegend = !checked
    },
    changeLegend (type, name) { // 切换图例
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          if (type === '1') { // 方位切换自动将水平方向居中
            this.currentItem.legend1 = name
            this.currentItem.legend2 = 'center'
            let td = {}
            if (name === 'top' || name === 'bottom') {
              td = {
                legend: {
                  [`${name}`]: 0,
                  left: 'center',
                  orient: 'horizontal'
                }
              }
            } else {
              td = {
                legend: {
                  [`${name}`]: 0,
                  top: 'center',
                  orient: 'vertical'
                }
              }
            }
            this.$set(item, 'chartExtend', td)
          } else { // 水平位置切换
            this.currentItem.legend2 = name
            const base = this.currentItem.legend1
            let td = {}
            if (base === 'top' || base === 'bottom') { // 方位在上下对水平方向的判断
              if (name === 'center') {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    left: 'center',
                    orient: 'horizontal'
                  }
                }
              } else {
                td = {
                  legend: {
                    [`${name}`]: 0,
                    [`${base}`]: 0,
                    orient: 'horizontal'
                  }
                }
              }
            } else { // 方位在左右对水平方向的判断
              if (name === 'left') {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    top: 0,
                    orient: 'horizontal'
                  }
                }
              } else if (name === 'center') {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    top: 'center',
                    orient: 'vertical'
                  }
                }
              } else {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    bottom: 0,
                    orient: 'horizontal'
                  }
                }
              }
            }
            this.$set(item, 'chartExtend', td)
          }
        }
      })
    },
    changeTableCheck (type) {
      console.log(type)
    },
    changeBasic (setName) { // v-chart样式的配置
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          const elem = { ...this.currentItem }
          const sets = elem[`${setName}`]
          this.$set(item, `${setName}`, sets)
        }
      })
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
  .ant-tabs-bar {
    margin: 0;
  }
  .ant-tabs-tabpane {
    padding: 0;
  }
  .ant-collapse-borderless > .ant-collapse-item {
    border-bottom: none;
  }
  .ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content {
    background: #ffffff;
  }
  .my-drag-layout__panel__cont {
    width: 90%;
    margin: 0 auto;
    .item {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      .tit {
        width: 100px;
      }
      .setting {
        flex: 1;
        margin-top: 10px;
        .setting-wrap {
          display: flex;
          border-left: 1px solid #d9d9d9;
          div {
            width: 30px;
            height: 30px;
            border: 1px solid #d9d9d9;
            border-left: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .anticon {
              font-size: 18px;
            }
          }
          div.active {
            color: #1890ff;
            border: 1px solid #1890ff;
            // .anticon {
            //   font-size: 18px;
            // }
          }
        }
      }
    }
  }
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
    -webkit-box-shadow: 0 0 6px 2px rgba(24, 144, 255, 0.5);
    box-shadow: 0 0 6px 2px rgba(24, 144, 255, 0.5);
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
.ant-menu-item-selected {
  color: inherit !important;
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
