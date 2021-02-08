<template>
  <div id="gridPage">
    <h1>grid</h1>
    <div class="btnGroup">
      <button @click="addItem">add</button>
    </div>
    <div class="view">
      <grid-layout
        :layout.sync="layout"
        :col-num="layoutColNum"
        :row-height="10"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        @layout-updated="layoutUpdatedEvent"
        @layout-ready="layoutReadyEvent"
        >
        <grid-item v-for="(item,idx) in layout"
          class="item"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="idx">
            {{item.i}}|{{idx}}
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
// 导入draggable组件
import VueGridLayout from 'vue-grid-layout'
export default {
  // 注册draggable组件
  name: 'girdPage',
  data: function () {
    return {
      // 布局位置数据
      layout: [],
      // 布局二维数组地图
      layoutMap: [],
      // 布局列数
      layoutColNum: 50
    }
  },
  methods: {
    // 添加项目
    addItem: function () {
      // 产生随机宽高
      var itemW = this.rnd(5, 10)
      var itemH = this.rnd(5, 10)
      var addItem = {
        'x': 0,
        'y': this.layoutMap.length,
        'w': itemW,
        'h': itemH,
        'i': this.layout[this.layout.length - 1] ? parseInt(this.layout[this.layout.length - 1].i) + 1 : 0
      }
      if (this.layoutMap.length) {
        // console.log(this.layoutMap.length);
        for (let r = 0, rLen = this.layoutMap.length; r < rLen; r++) {
          for (let c = 0; c <= (this.layoutColNum - itemW); c++) {
            let res = this.regionalTest(
              c,
              r,
              100,
              rLen > (r + itemH) ? itemH : rLen - r
            )

            if (res.result) {
              // 更新添加数据内容
              addItem = {
                'x': res.x,
                'y': res.y,
                'w': itemW,
                'h': itemH,
                'i': parseInt(this.layout[this.layout.length - 1].i) + 1
              }

              c = this.layoutColNum + 1
              r = rLen + 1
            } else {
              c = res.offsetX
            }
          }
        }
      }
      // 更新二维数组地图
      for (let itemR = 0; itemR < itemH; itemR++) {
        for (let itemC = 0; itemC < itemW; itemC++) {
          // 如果没有该行，初始化
          if (!this.layoutMap[addItem.y + itemR]) {
            this.layoutMap[addItem.y + itemR] = new Array(this.layoutColNum)
            for (let i = 0; i < this.layoutColNum; i++) {
              this.layoutMap[addItem.y + itemR][i] = 0
            }
          }
          // 标记点
          this.layoutMap[addItem.y + itemR][addItem.x + itemC] = 1
        }
      }

      // console.log(this.layoutMap);
      // 添加数据
      this.layout.push(addItem)
    },
    // 生成二维数组地图
    genereatePlaneArr: function (data) {
      var map = []
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var one = data[i]
          // 循环行
          for (var r = one.y; r < (one.y + one.h); r++) {
            // 循环列
            for (var c = one.x; c < (one.x + one.w); c++) {
              // 检修当前行是否存在
              if (!map[r]) {
                map[r] = new Array(this.layoutColNum)

                for (let i = 0; i < this.layoutColNum; i++) {
                  map[r][i] = 0
                }
              }
              // 占据为1
              map[r][c] = 1
            }
          }
        }
      }
      return map
    },
    // 区域检测 x,y 二维数据地图起始坐标点  w,h 检测区域宽高
    regionalTest: function (x, y, w, h) {
      // 定义返回 x,y 偏移 及 是否有空位置
      let offsetX = 0; let offsetY = 0; let res = true
      // 按区域循环检测 二维数组地图
      for (let r = 0; r < w; r++) {
        for (let c = 0; c <= h; c++) {
          let point = this.layoutMap[y + c] ? this.layoutMap[y + c][x + r] : 0
          // 如该点被占据 记录偏移值
          if (point === 1) {
            res = false
            offsetX = offsetX > (x + r) ? offsetX : x + r
            offsetY = offsetY > (y + c) ? offsetY : y + c
            console.log(offsetX, offsetY)
          }
        }
      }

      return {
        result: res,
        offsetX: offsetX,
        x: x,
        y: y
      }
    },
    // 组件更新完成生命周期
    layoutReadyEvent: function (newLayout) {
      // console.log("4Ready");
      // console.log(this.layout);
      // 当插件加载完成后  获取现在的二维地图树
      this.layoutMap = this.genereatePlaneArr(this.layout)
    },
    layoutUpdatedEvent: function (newLayout) {
      // console.log("Updated");
      // console.log(this.layout);
      // 当插件内容布局发生变化后  获取现在的二维地图树
      this.layoutMap = this.genereatePlaneArr(this.layout)
    },
    rnd: function (m, n) {
      return (Math.random() * (m - n + 1) + n) | 0
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }
}

</script>
<style lang="less">
      #gridPage{
    >h1{
      font-size: 16px;
    }
    >.view{
      border: 1px solid #000;
      .item{
        background-color: #aaa;
      }
    }
  }
</style>
