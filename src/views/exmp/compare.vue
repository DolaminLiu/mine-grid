<template>
  <div class="data-module-layout">
    <div class="module-left">
      <div class="module-left__con">
        <div class="grid-box module-left__hd">
          <a-icon type="cluster" />维度
        </div>
        <div class="grid-box">
          <draggable
            v-model="filterArr1"
            tag="ul"
            class="bi-select-tree"
            @end="end1"
            group="weiduAll"
            animation="300"
            :move="onMove1"
          >
            <transition-group>
              <li
                class="criterion"
                :class="currentAttr.id === item.id ? 'e-active' : ''"
                v-for="item in filterArr1"
                :key="item.id"
              >
                <div class="meta type-dimension">
                  {{ item.name }}
                  <a-icon type="delete" class="delete" style="display: none" />
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder" v-if="filterArr1.length === 0">
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
            @end="end2"
            group="weiduAll"
            animation="300"
            :move="onMove2"
          >
            <transition-group>
              <li
                class="criterion"
                :class="currentAttr.id === item.id ? 'e-active' : ''"
                v-for="item in filterArr2"
                :key="item.id"
              >
                <div class="meta type-dimension">
                  {{ item.name }}
                  <a-icon type="delete" class="delete" style="display: none" />
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder" v-if="filterArr2.length === 0">
            拖拽右侧字段进行添加
          </div>
        </div>

        <div class="grid-box module-left__hd">
          <a-icon type="cluster" />过滤
        </div>
        <div class="grid-box">
          <draggable
            :list="filterArr3"
            tag="ul"
            class="bi-select-tree"
            :class="startMove ? 'droppable':''"
            group="weiduAll"
            animation="300"
            :move="onMove"

            dragClass="dragClass"
            ghostClass="ghostClass"
            chosenClass="chosenClass"
            @start="start3"
            @end="end3"
          >
            <transition-group>
              <li
                class="criterion"
                :class="currentAttr.id === item.id ? 'e-active' : ''"
                v-for="item in filterArr3"
                :key="item.id"
              >
                <div class="meta type-dimension">
                  {{ item.name }}
                  <a-icon type="delete" class="delete" style="display: none" />
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="box-placeholder" v-if="filterArr3.length === 0">
            拖拽右侧字段进行添加
          </div>
        </div>
      </div>
    </div>

    <div class="module-right">
      <div class="module-right__hd">
        <div><a-icon type="gold" />订单</div>
        <div><a-icon type="info-circle" /></div>
      </div>
      <div class="module-right__box">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="维度">
            <a-input v-model="searchKey" placeholder="按名称过滤...">
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

                draggable=".node"
                class="bi-tree"
                        :options="{
                          forceFallback: true,
                          group: { name: 'weiduAll', pull: 'clone', put: false },
                          sort: false,
                        }"
                        animation="300"
                        :move="onMove"
              >
                <transition-group>
                  <li
                    v-for="item in themeWeidu"
                    :key="item.id"
                    class="item"
                  >
                    <div class="column">
                      <draggable
                        tag="ul"
                        class="bi-tree"
                        @start="start"
                        @end="end"
                        :options="{
                          forceFallback: true,
                          group: { name: 'weiduAll', pull: 'clone', put: false },
                          sort: false,
                        }"
                        animation="300"
                        :move="onMove"
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
                      <draggable
                        tag="ul"
                        class="bi-tree"
                        @start="start"
                        @end="end"
                        :options="{
                          forceFallback: true,
                          group: { name: 'weiduAll', pull: 'clone', put: false },
                          sort: false,
                        }"
                        animation="300"
                        :move="onMove"
                      >
                        <li
                          v-for="ele in item.children"
                          :key="ele.id"
                          eid="acyion"
                          class="item droppable"
                        >
                          <div class="node">
                            <img
                              :src="ele.img"
                              class="type-icon"
                              style="height: 15px; width: 15px"
                            />
                            {{ ele.name }}
                          </div>
                        </li>
                      </draggable>
                    </div>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="指标">
            <a-input v-model="searchKey" placeholder="按名称过滤...">
              <a-icon slot="prefix" type="search" />
              <a-icon
                type="close"
                slot="suffix"
                style="color: rgba(0, 0, 0, 0.45)"
              />
            </a-input>
          </a-tab-pane>
          <div slot="tabBarExtraContent" @click="changeExpand">
            <a-icon type="menu-fold" v-if="expand" />
            <a-icon type="menu-unfold" v-else />
          </div>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import img from '../../../assets/animal.png'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data () {
    return {
      weiduArr: [],
      zhibiaoArr: [],
      guolvArr: [],
      filterArr1: [],
      filterArr2: [],
      filterArr3: [],
      moveId: -1,
      startMove: false,
      moveEle: {},
      themeWeidu: [
        {
          name: '日期',
          img: img,
          open: true,
          id: 1,
          children: [
            { name: '年', id: 11, img: img },
            { name: '月', id: 111, img: img },
            { name: '日', id: 1111, img: img }
          ]
        },
        { name: '款式名称', id: 2, img: img, isLeaf: true },
        { name: '仓库sku', id: 3, img: img, isLeaf: true },
        { name: '部门名称', id: 4, img: img, isLeaf: true },
        { name: '团队', id: 5, img: img, isLeaf: true },
        { name: '产品一级品类', id: 6, img: img, isLeaf: true },
        {
          name: '店铺',
          img: img,
          open: false,
          id: 7,
          children: [
            { name: '年', id: 77, img: img },
            { name: '月', id: 777, img: img },
            { name: '日', id: 7777, img: img }
          ]
        }
      ],
      expand: true,
      searchKey: '',
      collapseComponentData: {
        on: {
          change: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      }
    }
  },
  methods: {
    start (e) {
      console.log(e)
      this.startMove = true
    },
    start3 (e) {
      console.log(e)
    },
    end1 (e) {
      console.log('end1')
      // var that = this
      // var items = this.filterArr.filter(function (m) {
      //   return m.id === that.moveId
      // })
      // // 如果左边
      // if (items.length < 2) return
      // this.filterArr.splice(e.newDraggableIndex, 1)
      // if (e.newDraggableIndex === e.oldDraggableIndex) {
      //   this.filterArr.splice(e.newDraggableIndex, 1)
      // }
    },
    // 右边往左边拖动时的事件
    end2 (e) {
      console.log('end2')

      // var that = this
      // var items = this.arr1.filter(function (m) {
      //   return m.id === that.moveId
      // })
      // // 如果左边
      // if (items.length < 2) return
      // this.arr1.splice(e.newDraggableIndex, 1)
    },
    // 右边往左边拖动时的事件
    end3 (e) {
      console.log(e)
      const that = this
      console.log(that.filterArr3)

      // var that = this
      // var items = this.arr1.filter(function (m) {
      //   return m.id === that.moveId
      // })
      // // 如果左边
      // if (items.length < 2) return
      // this.arr1.splice(e.newDraggableIndex, 1)
    },
    // 右边往左边拖动时的事件
    end (e) {
      console.log('end')
      this.startMove = false
      // var that = this
      // var items = this.arr1.filter(function (m) {
      //   return m.id === that.moveId
      // })
      // // 如果左边
      // if (items.length < 2) return
      // this.arr1.splice(e.newDraggableIndex, 1)
    },
    // move回调方法
    onMove (e, originalEvent) {
      console.log(e)
      console.log(originalEvent)
      // this.moveEle = e.draggedContext.element
      // this.moveId = e.draggedContext.element.id
      // this.filterArr.map((item) => {
      //   if (item.id === this.moveId) {
      //     this.moveEle = {}
      //     return false
      //   } else {
      //     return true
      //   }
      // })
      // this.moveId = e.relatedContext.element.id
      // return true
    },
    onMove1 (e, originalEvent) {
      console.log('move1')
    },
    onMove2 (e, originalEvent) {
      console.log('move2')
    },
    onMove3 (e, originalEvent) {
      console.log('move3')
    },
    changeExpand () {
      this.expand = !this.expand
    },
    showChildren (item) {
      this.themeWeidu.map((ele) => {
        if (ele.id === item.id) {
          this.$set(item, 'open', !item.open)
        }
      })
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
      padding: 8px 8px 2px 5px;
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
      .item {
        padding: 1px 6px;
        cursor: pointer;
        position: relative;
        &:hover {
          background: rgba(24, 144, 255, 0.05);
        }
        .node {
          color: rgba(0, 0, 0, 0.75);
        border: 1px solid transparent;
        border-radius: 2px;
        line-height: 22px;
        padding: 4px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        }
      }
    }
    .bi-select-tree .meta:hover .delete,
    .bi-select-tree .meta:hover .setting {
      display: inline-block;
      background-color: #fff;
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
