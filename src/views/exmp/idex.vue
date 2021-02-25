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
          type="sync"
          style="margin-left: 10px; cursor: pointer"
          @click="refresh"
        />
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
                :col-num="layoutColNum"
                :row-height="layoutHeight"
                :is-draggable="dialogVisible"
                :is-resizable="dialogVisible"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
                @layout-updated="layoutUpdatedEvent"
                @layout-ready="layoutReadyEvent"
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
                  @resizedEvent="resizedEvent"
                  @moved="movedEvent"
                >
                  <drag-item
                    :item="item"
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
            {{ currentItem.cName }}
          </a-menu-item>
        </a-menu>
        <div class="board-right__con">
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
          <a-tabs type="card" v-else @change="changeTab">
            <a-tab-pane key="1" tab="数据">
              <data-module @changeTheme="changeTheme" @changeFilter="changeFilter" :currentItem="currentItem" @modifyItemCol="modifyItemCol" ref="DataModule" />
            </a-tab-pane>
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
                          v-model="currentItem.title"
                          @change="changeBasic('title')"
                          width="100%"
                        />
                      </div>
                    </div>
                    <div class="item" style="margin-bottom: 20px">
                      <div class="tit">每页显示条数</div>
                      <div class="setting">
                        <a-select
                          :options="pageSizeArr"
                          v-model="currentItem.pageSize"
                          @change="changeBasic('pageSize')"
                          style="width:100%"
                        />
                      </div>
                    </div>
                    <!-- <div class="item">
                      <a-checkbox @change="changeTableCheck('1')" disabled>
                        Checkbox1
                      </a-checkbox>
                    </div>
                    <div class="item">
                      <a-checkbox @change="changeTableCheck('2')">
                        Checkbox2
                      </a-checkbox>
                    </div> -->
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
                  v-if="currentItem.components !== 'MeTable'"
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
                <a-collapse-panel key="3" header="坐标系网络" v-if="currentItem.components !== 'MePie' && currentItem.components !== 'MeTable'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item" v-for="ele in chartPosition" :key="ele.index">
                      <div class="tit">{{ele.name}}</div>
                      <div class="setting">
                        <a-input
                          type="number"
                          style="width: 100px"
                          v-model="currentItem.grid[`${ele.eName}`]"
                          @change="changeBasic('grid')"
                        />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="4" header="直径" v-if="currentItem.components === 'MePie'">
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
                <a-collapse-panel key="5" header="位置" v-if="currentItem.components === 'MePie'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">距顶部</div>
                      <div class="setting">
                        <a-input
                          v-model="chartSeriesCenterTop"
                          @change="changeBasic('pieCenter', 1)"
                          width="100%"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">距左边</div>
                      <div class="setting">
                        <a-input
                          v-model="chartSeriesCenterLeft"
                          @change="changeBasic('pieCenter', 0)"
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
        <div class="mid-line" v-if="JSON.stringify(currentItem) !== '{}' && currentTab === '1'"></div>
      </div>
    </div>
    <theme-modal ref="ThemeModal"/>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import DragItem from './components/DragItem'
import ThemeModal from './components/ThemeModal'
import DataModule from './components/DataModule'
import gridMethods from '@/mixins/gridMethods'
import chartSettings from '@/mixins/chartSettings'
const GridLayout = VueGridLayout.GridLayout
const GridItem = VueGridLayout.GridItem
export default {
  components: {
    GridLayout,
    GridItem,
    DragItem,
    ThemeModal,
    DataModule
  },
  mixins: [gridMethods, chartSettings],
  data () {
    return {
      currentTab: '1',
      pageSizeArr: [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '200', value: 200 },
        { label: '500', value: 500 },
        { label: '1000', value: 1000 }
      ],
      hasChooseTheme: false,
      screen_name: '',
      menuList: [ // 可选图表类型
        {
          name: 'bar-chart',
          comment: 'MeHistogram',
          type: 'v-charts',
          cName: '条形图'
        },
        {
          name: 'fund',
          comment: 'MeBar',
          type: 'v-charts',
          cName: '柱状图'
        },
        {
          name: 'line-chart',
          comment: 'MeLine',
          type: 'v-charts',
          cName: '折线图'
        },
        {
          name: 'pie-chart',
          comment: 'MePie',
          type: 'v-charts',
          cName: '饼图'
        },
        {
          name: 'table',
          comment: 'MeTable',
          type: 'table',
          cName: '表格'
        }
      ]
    }
  },
  methods: {
    basicSet () { // 点击设置图标
      this.currentType = '页面设计'
      this.layoutData.map((item) => {
        this.$set(item, 'active', false)
      })
      this.currentItem = {}
    },
    chooseTheme () { // 选择主题
      if (!this.hasChooseTheme) {
        this.$refs.ThemeModal.handleShow()
        this.hasChooseTheme = true
      }
    },
    changeTheme () { // 改变主题
      this.$refs.ThemeModal.handleShow()
    },
    refresh () {
      location.reload()
    },
    changeTab (e) {
      this.currentTab = e
    },
    changeFilter (source) { // 选择表格列
      const { type, data } = source
      if (type === '4') { // 表格
        this.layoutData.map(item => {
          if (this.currentItem.i === item.i) {
            const res = data.map(ele => {
              if (ele.hasSort || ele.hasSort === '') {
                return {
                  title: ele.editName,
                  dataIndex: ele.name,
                  name: ele.name,
                  align: ele.align,
                  sorter: true,
                  sortName: '',
                  symbol: ele.symbol,
                  width: Number(ele.width),
                  id: ele.id
                }
              } else {
                return {
                  title: ele.editName,
                  dataIndex: ele.name,
                  name: ele.name,
                  align: ele.align,
                  width: Number(ele.width),
                  id: ele.id,
                  symbol: ele.symbol
                }
              }
            })

            this.$set(item, 'columns', res)
            this.$set(item, 'rows', data)
          }
        })
      }
    },
    modifyItemCol (data) { // 编辑列属性
      console.log(data)
      this.layoutData.map(item => {
        if (this.currentItem.i === item.i) {
          const { columns } = item
          const res = columns.map(ele => {
            const _res = data.res
            if (ele.id === _res.id) {
              if (data.type === 'sort') {
                const { sorter, sortName, symbol, ...others } = ele
                return {
                  sorter: _res.sortName !== '',
                  sortName: _res.sortName,
                  symbol: _res.symbol,
                  // sortDirections: _res.sortDirections,
                  ...others
                }
              } else {
                const { align, title, width, symbol, ...others } = ele
                return {
                  align: _res.align,
                  title: _res.editName,
                  width: Number(_res.width),
                  symbol: _res.symbol,
                  ...others
                }
              }
            } else {
              return {
                ...ele
              }
            }
          })
          console.log(res)
          this.$set(item, 'columns', res)
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
.click-active .oprate {
    -webkit-transform: translateY(0);
    transform: translateY(0);
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
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  .mid-line {
    height: 100%;
    width: 1px;
    position: absolute;
    background: #efefef;
    top: 80px;
    right: 205px;
    bottom: 0;
  }
  .ant-menu {
    height: 47px;
  }
  .board-right__con {
    padding: 3px 0 0 3px;
    flex: 1;
    .ant-tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .ant-tabs .ant-tabs-top-content {
      flex: 1;
    }

    .ant-tabs-bar {
      height: 30px;
    }
  }
}
</style>
