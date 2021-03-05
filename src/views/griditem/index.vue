<template>
  <div class="my-drag-layout">
    <div class="head">
      <a-input
        placeholder="请输入报表名称..."
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
        <a-button type="primary" class="save" @click="saveScreen('2')">保存</a-button>
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
                  @resized="resizedEvent(item)"
                  @moved="movedEvent"
                >
                  <drag-item
                    :item="item"
                    :grid="item.grid"
                    :legend="item.legend"
                    :currentItem="currentItem"
                    :ref="`chart${item.i}`"
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
                v-model="screen_describe"
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
            <a-tab-pane key="2" tab="选项">
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
                v-if="currentType === 'v-charts'"
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
                <a-collapse-panel key="0" header="图表类型" v-if="currentItem.chart === 'pie_chart' || currentItem.chart === 'funnel'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="setting">
                        <div class="setting-wrap">
                          <div
                            v-for="pie in pieType"
                            :key="pie.index"
                            style="margin-right: 8px;"
                            :class="currentItem.chartPie === pie.name ? 'active' : 'pie-type'"
                            @click="changeType(pie.name)"
                          >
                            <a-icon :type="pie.icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
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
                    <div v-if="currentItem.chart === 'histogram' || currentItem.chart === 'line_chart'">
                      <div class="item">
                      <div class="tit">横轴标题</div>
                      <div class="setting">
                        <a-input
                          label="横轴标题"
                          width="100%"
                          v-model="currentItem.chartExtend.xAxis.name"
                          @change="changeChartExtend(currentItem, 'xAxis')"
                          placeholder="请输入横轴标题"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">纵轴标题</div>
                      <div class="setting">
                        <a-input
                          label="纵轴标题"
                          width="100%"
                          v-model="currentItem.chartExtend[`yAxis.0`].name"
                          @change="changeChartExtend(currentItem, 'yAxis')"
                          placeholder="请输入纵轴标题"
                        />
                      </div>
                    </div>
                    </div>
                    <div v-if="currentItem.chart === 'bar_chart'">
                      <div class="item">
                      <div class="tit">横轴标题</div>
                      <div class="setting">
                        <a-input
                          label="横轴标题"
                          width="100%"
                          v-model="currentItem.chartExtend[`xAxis.0`].name"
                          @change="changeChartExtend(currentItem, 'xAxis')"
                          placeholder="请输入横轴标题"
                        />
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">纵轴标题</div>
                      <div class="setting">
                        <a-input
                          label="纵轴标题"
                          width="100%"
                          v-model="currentItem.chartExtend.yAxis.name"
                          @change="changeChartExtend(currentItem, 'yAxis')"
                          placeholder="请输入纵轴标题"
                        />
                      </div>
                    </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel
                  key="2"
                  header="图例"
                  :disabled="disabledLegend"
                  v-if="currentItem.chart !== 'table'"
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
                            @click="changeExtend('1', leg.name)"
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
                            @click="changeExtend('2', leg.name)"
                          >
                            <a-icon :type="leg.icon" />
                          </div>
                          <div
                            v-show="currentItem.legend1 === 'left' || currentItem.legend1 === 'right'"
                            v-for="leg in legends2"
                            :key="leg.index"
                            :class="currentItem.legend2 === leg.name ? 'active' : ''"
                            @click="changeExtend('2', leg.name)"
                          >
                            <a-icon :type="leg.icon" style="transform:rotate(90deg)"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="3" header="坐标系网络" v-if="currentItem.chart !== 'pie_chart' && currentItem.chart !== 'table'">
                  <div class="my-drag-layout__panel__cont" v-if="currentItem.chart === 'funnel'">
                    <div class="item" v-for="ele in chartPosition" :key="ele.index">
                      <div class="tit">{{ele.name}}</div>
                      <div class="setting">
                        <a-input
                          type="number"
                          style="width: 100px"
                          v-model="currentItem.chartExtend.series[`${ele.eName}`]"
                          @change="changeBasic('grid')"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="my-drag-layout__panel__cont" v-else>
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
                <a-collapse-panel key="4" header="直径" v-if="currentItem.chart === 'pie_chart'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">内直径</div>
                      <div class="setting">
                        <a-input
                          style="width:80%"
                          v-model="currentItem.radiusInner"
                          @change="changeBasic('radius')"
                        />%
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">外直径</div>
                      <div class="setting">
                        <a-input
                          style="width:80%"
                          v-model="currentItem.radiusOut"
                          @change="changeBasic('radius')"
                        />%
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="5" header="位置" v-if="currentItem.chart === 'pie_chart'">
                  <div class="my-drag-layout__panel__cont">
                    <div class="item">
                      <div class="tit">距顶部</div>
                      <div class="setting">
                        <a-input
                          v-model="currentItem.chartSeriesCenterLeft"
                          @change="changeBasic('pieCenter', 1)"
                          style="width:80%"
                        />%
                      </div>
                    </div>
                    <div class="item">
                      <div class="tit">距左边</div>
                      <div class="setting">
                        <a-input
                          v-model="currentItem.chartSeriesCenterTop"
                          @change="changeBasic('pieCenter', 0)"
                          style="width:80%"
                        />%
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
    <theme-modal ref="ThemeModal" @chooseItemUp="chooseItemUp"/>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import DragItem from './components/DragItem'
import ThemeModal from './components/ThemeModal'
import DataModule from './components/DataModule'
import gridMethods from '@/mixins/gridMethods'
import chartSettings from '@/mixins/chartSettings'
import { datasetField, addScreen } from '@/api'
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
      currentChooseItem: {},
      pageSizeArr: [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '200', value: 200 },
        { label: '500', value: 500 },
        { label: '1000', value: 1000 }
      ],
      screen_name: '',
      screen_describe: '',
      menuList: [ // 可选图表类型
        {
          name: 'bar-chart',
          comment: 'histogram',
          type: 'v-charts',
          chart: 'histogram',
          cName: '条形图'
        },
        {
          name: 'fund',
          comment: 'bar',
          type: 'v-charts',
          chart: 'bar_chart',
          cName: '柱状图'
        },
        {
          name: 'line-chart',
          comment: 'line',
          type: 'v-charts',
          chart: 'histogram',
          cName: '折线图'
        },
        {
          name: 'pie-chart',
          comment: 'pie',
          type: 'v-charts',
          chart: 'pie_chart',
          cName: '饼图'
        },
        {
          name: 'table',
          comment: 'MeTable',
          type: 'table',
          chart: 'table',
          cName: '表格'
        }
      ],
      pieType: [
        { name: '', icon: 'pie-chart' },
        { name: 'radius', icon: 'pie-chart' },
        { name: 'funnel', icon: 'funnel-plot' }
      ]
    }
  },
  watch: {
    currentItem (newVal) {
      this.currentChooseItem = newVal
    },
    currentType (newVal) {
      // console.log(newVal)
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
    chooseTheme () { // 选择主题弹框
      console.log(this.currentThemeCode)
      if (this.currentThemeCode === '') {
        this.$refs.ThemeModal.handleShow()
      }
    },
    chooseItemUp (data) { // 主题选择确定
      this.currentThemeCode = data.value
      this.currentThemeName = data.name
      this.layoutData.map((item) => {
        if (item.i === this.currentItem.i) {
          this.$set(item, 'themeCode', data.value)
          this.$set(item, 'themeName', data.name)
          const current = { ...this.currentItem }
          current.themeCode = data.value
          current.themeName = data.name
          this.currentItem = current
        }
      })
      datasetField({ dataset_code: data.value }).then(res => {
        const { data, error, message } = res
        if (error !== 0) {
          this.$message.error(message)
          return false
        }
        this.$store.dispatch('sso/setDataBaseDefault', data)
        data.map(item => {
          if (item.type === 'index') {
            this.$store.dispatch('sso/setThemeZb', item.data)
            // this.themeZbDefaults = item.data
          } else {
            this.$store.dispatch('sso/setThemeWd', item.data)
            // this.themeWeiduDefault = item.data
          }
        })
      })
    },
    changeTheme () { // 改变主题弹框
      this.$refs.ThemeModal.handleShow()
    },
    refresh () {
      location.reload()
    },
    changeTab (e) {
      this.currentTab = e
    },
    saveScreen (type) {
      console.log(this.layoutData)

      if (this.screen_name === '') {
        this.$message.info('报表名称不能为空！')
        return false
      }

      const componentArr = this.layoutData.map((item, index) => {
        let obj = {}
        const gv = item.guolv
        if (item.components === 'MeTable') {
          const columns = item.columns
          if (columns.length === 0) {
            this.$message.info('请添加维度列！')
            return false
          }
          const weidu = item.columns.filter(col => col.themeType === 'wd')
          const zhibiao = item.columns.filter(col => col.themeType === 'zb')
          const dimensionArr = weidu.map(col => {
            return {
              field_en: col.field_en,
              header: col.title,
              width: col.width,
              align_type: col.align,
              sort: col.sortType,
              time_type: col.formate || ''
            // time_type:
            // sort:
            }
          })
          const indexArr = zhibiao.map(col => {
            return {
              field_en: col.field_en,
              index_name: col.title,
              polymerize_type: '1',
              format: col.format,
              width: col.width,
              align_type: col.align,
              sort: col.sortType
            // time_type:
            // sort:
            }
          })
          const filterArr = gv.map(col => {
            let type = ''
            if (col.time_type === '0') {
              type = 'data_filter_type'
            } else {
              type = 'value_type'
            }
            return {
              filter_en: col.field_en,
              [`${type}`]: col.valType,
              filter_content: col.valValue
            }
          })
          obj = {
            page_size: item.pageSize,
            dimension_arr: dimensionArr,
            index_arr: indexArr,
            filter_arr: filterArr
          }
        } else {
          const weidu = item.weidu
          const zhibiao = item.zhibiao
          if (zhibiao.length === 0) {
            this.$message.info('请选择指标！')
            return false
          } else if (weidu.length === 0) {
            this.$message.info('请选择维度！')
            return false
          }
          const extend = item.chartExtend
          let unique = {}
          if (item.components === 'line' || item.components === 'histogram') {
            unique = {
              horizontal_axis_title: extend.xAxis.name,
              longitudinal_axis_title: extend['yAxis.0'].name,
              left_margin: item.grid.left,
              right_margin: item.grid.right,
              top_margin: item.grid.top,
              bottom_margin: item.grid.bottom
            }
          } else if (item.components === 'bar') {
            unique = {
              horizontal_axis_title: extend['xAxis.0'].name,
              longitudinal_axis_title: extend.yAxis.name,
              left_margin: item.grid.left,
              right_margin: item.grid.right,
              top_margin: item.grid.top,
              bottom_margin: item.grid.bottom
            }
          } else {
            let pie = ''
            if (item.chartPie === '') {
              pie = '1'
            } else if (item.chartPie === 'radius') {
              pie = '2'
            } else {
              pie = '3'
            }
            unique = {
              pie_chart_type: pie,
              in_diameter: item.radiusInner,
              out_diameter: item.radiusOut,
              top_margin: item.chartSeriesCenterTop,
              left_margin: item.chartSeriesCenterLeft
            }
          }
          // const settings = item.chartSettings
          const dimensionArr = weidu.map(wd => {
            return {
              field_en: wd.field_en,
              sort: wd.sortType
            }
          })
          const indexArr = zhibiao.map(zb => {
            return {
              field_en: zb.field_en,
              index_name: zb.title,
              index_type: zb.type === 'histogram' ? '2' : '1',
              polymerize_type: '1',
              format: zb.labelFormat,
              is_fill: zb.area ? '1' : '0',
              is_smooth: zb.smooth ? '1' : '0',
              thickness: zb.chartWidth,
              sort: zb.order,
              is_show_tag: zb.chartLabel,
              mark_type: zb.chartSymbol,
              tag_position: zb.labelPosition
            }
          })
          const filterArr = item.guolv.map(gl => {
            let type = ''
            if (gl.time_type === '0') {
              type = 'data_filter_type'
            } else {
              type = 'value_type'
            }
            return {
              field_en: gl.field_en,
              [`${type}`]: gl.valType,
              filter_content: gl.valValue
            // time_type:
            // sort:
            }
          })
          obj = {
            ...unique,
            total_count: item.size,
            position_type: item.legend1,
            horizontal_position: item.legend2,
            dimension_arr: dimensionArr,
            index_arr: indexArr,
            filter_arr: filterArr
          }
        }
        console.log(obj)
        return {
          ...obj,
          dataset_code: item.themeCode,
          component_type: item.chart,
          component_sort: index + 1,
          component_title: item.title
        }
        // const wd = item.weidu
        // const zb = item.zhibiao
      })

      const param = {
        screen_name: this.screen_name,
        status: '2',
        component_arr: componentArr
      }
      addScreen(param).then(res => {
        const { data, error, message } = res
        if (error !== 0) {
          this.$message.error(message)
          return false
        }
        this.$message.success(data)
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
          .pie-type {
            border-left: 1px solid #d9d9d9;
          }
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
.ant-select-selection {
  font-size: 12px;
}
.ant-input {
  font-size: 12px;
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
