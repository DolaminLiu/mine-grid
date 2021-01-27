<template>
  <div class="helloword">
    <vdr
        class-name="dragging1"
        v-for="(item, index) in itemList" :key="index"
        :w="200"
        :h="200"
        :min-width="300"
        :min-height="300"
        :parent="true"
        :snap="true"
        :snapTolerance="10"
        @activated="onActivated(item)"
        :isConflictCheck="true"
      >
         <div v-if="item.type === 'v-charts'" style="height: 100%">
           <div class="report-title">{{item.title}}</div>
           <component
           :is="item.components"
           :dataSource="item"
           :setting="item.setting"
           :judge-width="true"></component>
           <!-- <MeLine
          :dataSource="item"
          :changesizewidth="width"
          :changesizeheight="height"
          :colors="colors"
          v-if="item.type=='line'"
        ></MeLine> -->
         </div>
         <div v-if="item.type === 'table'" style="hieght:100%">
           <div class="report-title">{{item.title}}</div>
           <component :is="item.components" :key="item.key" :dataSource="item"></component>
         </div>
      </vdr>
  </div>
</template>

<script>
import vdr from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import MeLine from './components/MeLine'
import MeBar from './components/MeBar'
import MeTable from './components/MeTable'
export default {
  components: {
    vdr,
    MeLine,
    MeBar,
    MeTable
  },
  name: 'HelloWorld',
  data () {
    this.colors = ['#c23531', '#2f4554', '#61a0a8',
      '#d48265', '#91c7ae', '#749f83',
      '#ca8622', '#bda29a', '#6e7074',
      '#546570', '#c4ccd3']
    return {
      defaultELeWidth: '70',
      x: 0,
      y: 0,
      colors: [
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
      ],
      itemList: [
        {
          title: '折线图',
          components: 'MeLine',
          type: 'v-charts',
          width: '500',
          height: '500',
          chartData: {
            columns: ['日期', '访问用户', '下单用户', '下单率'],
            rows: [
              { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
              { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
              { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
              { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
              { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
              { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
            ]
          }
        },
        {
          title: '柱图',
          components: 'MeBar',
          type: 'v-charts',
          width: '500',
          height: '500',
          chartData: {
            columns: ['日期', '访问用户', '下单用户2', '下单率2'],
            rows: [
              { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
              { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
              { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
              { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
              { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
              { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
            ]
          }
        },
        {
          title: '表格',
          components: 'MeTable',
          type: 'table',
          width: '500',
          height: '500',
          key: 'ops',
          chartData: {
            columns: ['日期', '访问用户', '下单用户2', '下单率2'],
            rows: [
              { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
              { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
              { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
              { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
              { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
              { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
            ]
          }
        }
      ]
    }
  },
  methods: {
    onActivated (item) {
      console.log(item)
    }
  }
}
</script>

<style>
.helloword {
  width: 1200px;
  height: 800px;
  border: 1px solid red;
  /* float: left; */
  min-height: 300px;
  position: relative;
background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 10px 10px, linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 10px 10px;
}
.dragging1 {
  border: 1px solid gray;
  color: #000;
  background: #fff;
}
</style>
