<template>
  <div class="data-module-layout">
    <div class="module-left">
      <div class="module-left__con" v-if="currentItem.type === 'table'">
        <div class="grid-box module-left__hd">
          <a-icon type="cluster" />表格列
        </div>
        <div class="grid-box">
          <draggable
            v-model="filterArr4"
            tag="ul"
            class="bi-select-tree"
            :class="[{'droppable': startMove || startMove2 }]"
            group="weiduAll"
            animation="300"
          >
            <transition-group>
              <li
                class="criterion"
                :class="[{'e-active': currentAttr.name === item.name ? true : false}, {'zb-bk': item.type === 'zb' ? true : false}]"
                v-for="item in filterArr4"
                :key="item.id"
              >
                <div class="meta type-dimension" @click="editAttr(item)">
                  <div>
                    {{ item.name }}
                    <a-icon type="arrow-down" v-if="item.sortName && item.sortName === 'descend'" style="color:rgb(82, 196, 26)"/>
                    <a-icon type="arrow-up" v-if="item.sortName && item.sortName === 'ascend'"  style="color:rgb(82, 196, 26)"/>
                  </div>
                  <a-icon type="delete" class="delete" @click="deleteItem(4, item)"/>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder">
            拖拽右侧字段进行添加
          </div>
        </div>
      </div>
      <div class="module-left__con" v-else>
        <div class="grid-box module-left__hd">
          <a-icon type="cluster" />维度
        </div>
        <div class="grid-box">
          <draggable
            v-model="filterArr1"
            tag="ul"
            class="bi-select-tree"
            :class="[{'droppable': startMove && weiduAllLimit === 'weiduAll' ? true:false}, {'limit': filterArr1.length > 0 ? true:false}]"
            :group="weiduAllLimit"
            animation="300"
          >
            <transition-group>
              <li
                class="criterion"
                :class="[{'e-active': currentAttr.name === item.name ? true : false}]"
                v-for="item in filterArr1"
                :key="item.id"
              >
                <div class="meta type-dimension">
                  {{ item.name }}
                  <a-icon type="delete" class="delete" @click="deleteItem(1, item)"/>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder" v-if="weiduAllLimit === 'weiduAll'">
            拖拽右侧字段进行添加
          </div>
        </div>

        <div class="grid-box module-left__hd">
          <a-icon type="cluster" />指标
        </div>
        <div class="grid-box">
          <draggable
            v-model="filterArr2"
            tag="ul"
            class="bi-select-tree"
            group="zhibiaoAll"
            animation="300"
            :class="[{'droppable': startMove2 ? true:false}]"
          >
            <transition-group>
              <li
                class="criterion"
                :class="[{'e-active': currentAttr.name === item.name ? true : false}, {'zb-bk': item.type === 'zb' ? true : false}]"
                v-for="item in filterArr2"
                :key="item.id"
              >
                <div class="meta type-dimension">
                  {{ item.name }}
                  <a-icon type="delete" class="delete"  @click="deleteItem(2, item)"/>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder">
            拖拽右侧字段进行添加
          </div>
        </div>
      </div>
      <div class="module-left__con">
        <div class="grid-box module-left__hd">
          <a-icon type="cluster" />过滤
        </div>
        <div class="grid-box">
          <draggable
            :list="filterArr3"
            tag="ul"
            class="bi-select-tree"
            :class="[{'droppable': startMove ? true:false}]"
            group="weiduAll"
            animation="300"
            :move="onMove"

            dragClass="dragClass"
            ghostClass="ghostClass"
            chosenClass="chosenClass"
          >
            <transition-group>
              <li
                class="criterion"
                :class="currentAttr.name === item.name ? 'e-active' : ''"
                v-for="item in filterArr3"
                :key="item.id"
              >
                <div class="meta type-dimension">
                  {{ item.name }}
                  <a-icon type="delete" class="delete"  @click="deleteItem(3, item)"/>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder">
            拖拽右侧字段进行添加
          </div>
        </div>
      </div>
    </div>

    <div class="module-right">
      <div class="module-right__hd">
        <div style="cursor: pointer;" @click="changeTheme"><a-icon type="gold" />订单</div>
        <div><a-icon type="info-circle" /></div>
      </div>
      <div class="module-right__box">
        <a-tabs type="card" @change="changeTab2">
          <a-tab-pane key="1" tab="维度">
            <a-input v-model="searchKeyOne" placeholder="按名称过滤...">
              <a-icon slot="prefix" type="search" />
              <a-icon
                type="close"
                slot="suffix"
                style="color: rgba(0, 0, 0, 0.45)"
              />
            </a-input>
            <div class="module-right__grid__left">
              <draggable
                tag="ul"
                :list="themeWeidu"
                draggable=".node"
                class="bi-tree"
                animation="300"
                :move="onMove"
              >
                <transition-group>
                  <li
                    v-for="(item, index) in themeWeidu"
                    :key="item.id"
                    class="item"
                  >
                    <div class="column">
                      <draggable
                        tag="ul"
                        :list="Array(themeWeidu[index])"
                        class="bi-tree"
                        @start="start"
                        @end="end"
                        animation="300"
                        :move="onMove"
                        :options="{
                          forceFallback: true,
                          group: { name: 'weiduAll', pull: 'clone', put: false },
                          sort: false,
                        }"
                      >
                        <li eid="acyion" class="item droppable" @click="showChildren(item)">
                          <div class="node">
                            <a-icon
                              class="node-icon"
                              type="down"
                              v-if="item.children && item.open"
                            />
                            <a-icon
                              class="node-icon"
                              type="right"
                              v-if="item.children && !item.open"
                            />
                            <img
                              class="type-icon"
                              :src="item.img"
                              style="height: 15px; width: 15px"
                            />
                            {{ item.name }}
                          </div>
                        </li>
                      </draggable>
                    </div>
                    <div
                      class="columns"
                      v-if="item.children"
                      :style="{ display: item.open ? 'block' : 'none' }"
                    >
                     <li
                          eid="acyion"
                          class="item droppable"
                        >
                      <draggable
                         v-for="(ele, k) in item.children"
                         :key="ele.id"
                         :list="Array(themeWeidu[index].children[k])"
                        class="bi-tree"
                        :options="{
                          forceFallback: true,
                          group: { name: 'weiduAll', pull: 'clone', put: false },
                          sort: false,
                        }"
                        @start="start"
                        @end="end"
                        animation="300"
                        :move="onMove"
                      >
                          <div class="node">
                            <img
                              :src="ele.img"
                              class="type-icon"
                              style="height: 15px; width: 15px"
                            />
                            {{ ele.name }}
                          </div>
                      </draggable>
                      </li>
                    </div>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="指标">
            <a-input v-model="searchKeyTwo" placeholder="按名称过滤...">
              <a-icon slot="prefix" type="search" />
              <a-icon
                type="close"
                slot="suffix"
                style="color: rgba(0, 0, 0, 0.45)"
              />
            </a-input>
            <div class="module-right__grid__left">
              <draggable
                tag="ul"
                :list="themeZb"
                draggable=".node"
                class="bi-tree"
                animation="300"
                :move="onMove"
              >
                <transition-group>
                  <li
                    v-for="(item, index) in themeZb"
                    :key="item.id"
                    class="item"
                  >
                    <div class="column">
                      <ul
                        tag="ul"
                        class="bi-tree"
                      >
                        <li eid="acyion" class="item droppable" @click="showChildren(item)">
                          <div class="node" style="cursor: auto;">
                            <a-icon
                              class="node-icon"
                              type="down"
                              v-if="item.children && item.open"
                            />
                            <a-icon
                              class="node-icon"
                              type="right"
                              v-if="item.children && !item.open"
                            />
                            <img
                              class="type-icon"
                              :src="item.img"
                              style="height: 15px; width: 15px"
                            />
                            {{ item.name }}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div
                      class="columns"
                      v-if="item.children"
                      :style="{ display: item.open ? 'block' : 'none' }"
                    >
                     <li
                          eid="acyion"
                          class="item droppable"
                        >
                      <draggable
                         v-for="(ele, k) in item.children"
                         :key="ele.id"
                         :list="Array(themeZb[index].children[k])"
                        class="bi-tree"
                        :options="{
                          forceFallback: true,
                          group: { name: currentItem.chart === 'table' ? 'weiduAll' : 'zhibiaoAll', pull: 'clone', put: false },
                          sort: false,
                        }"
                        @start="start2"
                        @end="end2"
                        animation="300"
                        :move="onMove2"
                      >
                          <div class="node">
                            <img
                              :src="ele.img"
                              class="type-icon"
                              style="height: 15px; width: 15px"
                            />
                            {{ ele.name }}
                          </div>
                      </draggable>
                      </li>
                    </div>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </a-tab-pane>
          <div slot="tabBarExtraContent" @click="changeExpand">
            <a-icon type="menu-fold" v-if="expand" />
            <a-icon type="menu-unfold" v-else />
          </div>
        </a-tabs>
      </div>
    </div>

    <edit-attr :currentAttr="currentAttr" :currentItem="currentItem" ref="EditAttr" @modifyItemCol="modifyItemCol"/>
  </div>
</template>

<script>
import EditAttr from './EditAttr'
import img from '../../../assets/animal.png'
import draggable from 'vuedraggable'
export default {
  props: ['currentItem'],
  components: {
    draggable,
    EditAttr
  },
  data () {
    return {
      weiduAllLimit: 'weiduAll',
      weiduArr: [],
      zhibiaoArr: [],
      guolvArr: [],
      filterArr1: [], // 数据--维度
      filterArr2: [], // 数据--指标
      filterArr3: [], // 数据--过滤
      filterArr4: [], // 数据--表格列
      moveId: -1,
      startMove: false,
      startMove2: false,
      moveEle: {},
      themeWeidu: [],
      themeWeiduDefault: [
        {
          name: '日期',
          editName: '日期',
          type: 'wd',
          width: 'auto',
          align: 'left',
          img: img,
          open: true,
          symbol: '日期',
          id: 1,
          children: [
            { name: '年', editName: '年', type: 'wd', width: 'auto', align: 'left', id: 2, img: img, default: ['2001', '2002', '2003', '2004'] },
            { name: '季度', editName: '季度', type: 'wd', width: 'auto', align: 'left', symbol: '季度', id: 3, img: img, default: ['2021Q1', '2021Q2', '2021Q3', '2021Q4'] },
            { name: '月', editName: '月', type: 'wd', width: 'auto', align: 'left', symbol: '月', id: 4, img: img, default: ['2021-01', '2021-02', '2021-03', '2021-04'] }
          ]
        },
        { name: '款式名称', editName: '款式名称', type: 'wd', width: 'auto', align: 'left', id: 5, img: img },
        { name: '仓库sku', editName: '仓库sku', type: 'wd', width: 'auto', align: 'left', id: 6, img: img },
        { name: '部门名称', editName: '部门名称', type: 'wd', width: 'auto', align: 'left', id: 7, img: img },
        { name: '团队', editName: '团队', type: 'wd', width: 'auto', align: 'left', id: 8, img: img },
        { name: '产品一级品类', editName: '产品一级品类', type: 'wd', width: 'auto', align: 'left', id: 9, img: img },
        { name: '产品二级品类', editName: '产品二级品类', type: 'wd', width: 'auto', align: 'left', id: 10, img: img },
        { name: '产品三级品类', editName: '产品三级品类', type: 'wd', width: 'auto', align: 'left', id: 11, img: img },
        { name: '产品名称', editName: '产品名称', type: 'wd', width: 'auto', align: 'left', id: 12, img: img }
      ],
      themeZb: [],
      themeZbDefault: [
        {
          name: '销售',
          img: img,
          open: true,
          id: 13,
          children: [
            { name: '产品销售', editName: '产品销售', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 14, img: img },
            { name: '销售额_人民币', editName: '销售额_人民币', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 15, img: img },
            { name: '销售额_美元', editName: '销售额_美元', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 16, img: img }
          ]
        },
        {
          name: '利润',
          img: img,
          open: true,
          id: 17,
          children: [
            { name: '营业利润_人民币', editName: '营业利润_人民币', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 18, img: img },
            { name: '营业利润_美元', editName: '营业利润_美元', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 19, img: img },
            { name: '营业利润率(按美元)', editName: '营业利润率(按美元)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 20, img: img }
          ]
        },
        {
          name: '退款',
          img: img,
          open: true,
          id: 21,
          children: [
            { name: '退款费用_人民币(按退款时间)', editName: '退款费用_人民币(按退款时间)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 22, img: img },
            { name: '退款费用_美元(按退款时间)', editName: '退款费用_美元(按退款时间)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 23, img: img },
            { name: '退款率(按退款时间和美元)', editName: '退款率(按退款时间和美元)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 24, img: img },
            { name: '退款费用_人民币(出库时间)', editName: '退款费用_人民币(出库时间)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 25, img: img },
            { name: '退款费用_美元(出库时间)', editName: '退款费用_美元(出库时间)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 26, img: img },
            { name: '退款率(按出库时间和美元)', editName: '退款率(按出库时间和美元)', type: 'zb', width: 'auto', align: 'left', sorter: false, sortName: '', sortDirections: [''], id: 27, img: img }
          ]
        }
      ],
      expand: true,
      searchKeyOne: '',
      searchKeyTwo: '',
      themeTab: '1',
      currentAttr: {} // 当前选择的编辑维度/指标

    }
  },
  mounted () {
    this.themeWeidu = this.themeWeiduDefault
    this.themeZb = this.themeZbDefault
  },
  watch: {
    currentItem (newVal) {
      if (newVal.type === 'table') {
        this.filterArr4 = newVal.rows
      }
    },
    filterArr1 (newVal) {
      if (newVal.length > 0) {
        this.weiduAllLimit = ''
      } else {
        this.weiduAllLimit = 'weiduAll'
      }
      const obj = { type: '1', data: newVal }
      this.$emit('changeFilter', obj)
    },
    filterArr2 (newVal) {
      const obj = { type: '2', data: newVal }
      this.$emit('changeFilter', obj)
    },
    filterArr3 (newVal) {
      const obj = { type: '3', data: newVal }
      this.$emit('changeFilter', obj)
    },
    filterArr4 (newVal) {
      const obj = { type: '4', data: newVal }
      this.$emit('changeFilter', obj)
    },
    searchKeyOne (newVal) {
      if (newVal === '') {
        this.themeWeidu = this.themeWeiduDefault
      } else {
        const res = this.themeWeiduDefault.filter(item => {
          const re = { ...item }
          return this.filters(re, newVal)
        })
        this.themeWeidu = res
      }
    },
    searchKeyTwo (newVal) {
      if (newVal === '') {
        this.themeZb = this.themeZbDefault
      } else {
        const res = this.themeZbDefault.filter(item => {
          const re = { ...item }
          return this.filters(re, newVal)
        })
        this.themeZb = res
      }
    }
  },
  methods: {
    filters (item, query) {
      if (item.name.indexOf(query) > -1) return true
      if (item.hasOwnProperty('children')) {
        item.children = item.children.filter(function (child) {
          if (child.hasOwnProperty('children')) {
            return this.filter(child, query)
          } else {
            return child.name.indexOf(query) > -1
          }
        })
        if (item.children.length > 0) {
          return true
        }
      } else {
        return item.name.indexOf(query) > -1
      }
    },
    start (e) { // 维度开始拖动
      this.startMove = true
    },
    end (e) { // 维度停止拖动
      this.startMove = false
      this.$refs.EditAttr.showEdit = false
    },
    start2 (e) { // 指标开始拖动
      this.startMove2 = true
    },
    end2 (e) { // 指标停止拖动
      this.startMove2 = false
      this.$refs.EditAttr.showEdit = false
    },
    // 过滤/表格列拖拽去重
    onMove (e, originalEvent) {
      let res = false
      // console.log(e.draggedContext.element.id)
      this.moveEle = e.draggedContext.element
      this.moveId = e.draggedContext.element.id
      if (this.currentItem.chart === 'table' && this.filterArr4.length !== 0) {
        res = this.filterArr4.find(item => item.id === this.moveId)
      } else if (this.filterArr3.length !== 0) {
        res = this.filterArr3.find(item => item.id === this.moveId)
      }
      return !res
    },
    // 指标拖拽去重
    onMove2 (e, originalEvent) {
      let res = false
      // console.log(e.draggedContext.element.id)
      this.moveEle = e.draggedContext.element
      this.moveId = e.draggedContext.element.id

      if (this.filterArr2.length !== 0) {
        res = this.filterArr2.find(item => item.id === this.moveId)
      }
      return !res
    },
    changeTab2 (e) {
      this.themeTab = e
    },
    changeExpand () { // tab展开全部
      this.expand = !this.expand
      if (this.themeTab === '1') {
        this.themeWeidu.map(item => {
          if (item.children) {
            this.$set(item, 'open', this.expand)
          }
        })
      } else {
        this.themeZb.map(item => {
          if (item.children) {
            this.$set(item, 'open', this.expand)
          }
        })
      }
    },
    showChildren (item) { // 维度展开子维度
      this.themeWeidu.map((ele) => {
        if (ele.id === item.id) {
          this.$set(item, 'open', !item.open)
        }
      })
    },
    deleteItem (type, item) {
      this[`filterArr${type}`] = this[`filterArr${type}`].filter(ele => ele.id !== item.id)
    },
    changeTheme () {
      this.$emit('changeTheme')
    },
    editAttr (item) {
      this.$refs.EditAttr.showEditMethods(item)
      this.currentAttr = item
      // this.currentItem.columns.map(ele => {
      //   if (ele.id === item.id) {
      //     this.$refs.EditAttr.showEditMethods(ele)
      //     this.currentAttr = ele
      //   }
      // })
    },
    modifyItemCol (item) {
      if (item.type === 'sort') {
        this.currentItem.columns.map(ele => {
          if (ele.id === item.id) {
            this.$set(ele, 'sortName', item.res.sortName)
          }
        })
      }
      this.$emit('modifyItemCol', item)
    },
    hide () {
      if (this.$refs.EditAttr) {
        this.$refs.EditAttr.hide()
      }
    }
  }
}
</script>

<style lang="less">
.data-module-layout {
  width: 100%;
  height: 100%;
  font-size: 12px !important;
  display: flex;
  flex-direction: row;
  position: relative;
  .anticon {
    margin-right: 8px;
    font-size: 12px;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    font-size: 12px;
  }
  .module-left {
    flex: 1;
    margin-right: 5px;
    .module-left__con {
      display: flex;
      flex-direction: column;
    }
    .criterion-box {
      padding-bottom: 8px;
      min-height: 160px;
    }
    .module-left__hd {
      padding: 15px 8px 2px 5px;
    }
    .box-placeholder {
      margin: -33px 5px 4px;
      text-align: center;
      line-height: 24px;
      background-color: hsla(0, 0%, 100%, 0.1);
      border: 1px dashed rgba(0, 0, 0, 0.15);
      color: rgba(0, 0, 0, 0.5);
      pointer-events: none;
    }
    .module-left__grid > div > span {
      display: block;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 30px;
    }
    .grid-box {
      -ms-flex: 0 1 auto;
      -webkit-box-flex: 0;
      flex: 0 1 auto;
      -webkit-align-self: auto;
      -ms-flex-item-align: auto;
      align-self: auto;
    }
    .bi-select-tree {
      padding: 4px 0;
      list-style: none;
      color: #999;
      font-size: 12px;
      margin: 0 1px;
      overflow: hidden;
      border: 1px solid transparent;
      border-radius: 2px;
      -webkit-transition-property: border, background;
      transition-property: border, background;
      -webkit-transition-duration:.5s;
      transition-duration: .5s;
      &.limit >span {
        padding-bottom: 0px;
      }
      &.droppable {
        border-color: #fa8c16;
        background-color: rgba(250,140,22,.02);
        -webkit-transition-duration: .5s;
        transition-duration: .5s;
      }
      &>span {
        display: block;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 30px;
      }
      .criterion {
        &.e-active {
          border: 1px solid #1890ff;
        }
        &.e-active.zb-bk {
          border: 1px solid #52c41a;
        }
        &.zb-bk {
          background: rgba(82,196,26,.1);
        }
        padding: 1px 6px;
        cursor: pointer;
        position: relative;
        background: rgba(24, 144, 255, 0.05);
        margin-bottom: 5px;
        .meta {
          color: rgba(0, 0, 0, 0.75);
        border: 1px solid transparent;
        border-radius: 2px;
        line-height: 22px;
        padding: 4px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:hover .delete {
          display: block;
        }
        .delete {
          display: none;
         }
        }
      }
    }
  }
  .module-right {
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .module-right__hd {
      height: 34px;
      display: flex;
      justify-content: space-between;
      padding: 8px 0 8px 8px;
    }
    .module-right__box {
      flex: 1;
    }
    .bi-tree {
      padding-left: 0;
      font-size: 12px;
      li {
        list-style: none;
      }
      .item {
        line-height: 28px;
        .node {
          padding-left: 12px;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          &:hover {
            background: rgba(24, 144, 255, 0.05);
          }
          .node-icon {
            font-size: 60%;
            position: absolute;
            left: 6px;
            top: 9px;
            color: rgba(0, 0, 0, 0.75);
          }
          .type-icon {
            margin: 0 8px;
          }
        }
      }
      .anticon {
        font-size: 10px !important;
      }
    }
    .columns {
      .bi-tree {
        padding-left: 15px;
      }
    }
    .ant-input {
      font-size: 12px;
    }
    .ant-tabs.ant-tabs-card .ant-tabs-extra-content {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }
    .ant-input-affix-wrapper .ant-input {
      border: none;
    }
    .ant-input-affix-wrapper .ant-input-suffix {
      right: 0;
    }
  }
}
</style>
