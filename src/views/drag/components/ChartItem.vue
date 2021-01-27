<template>
    <div class="main-chart-li" @click="clickThis(num)" :class="myName">
        <div class="chart-con">
           <component :is="myName" :dataSource="datas" :borderColor="borderColor" :title="title"></component>
        </div>
      </div>
</template>

<script>
import { DataPart, ListComp, ListSimple, ListSort, EchartDom } from './index'
export default {
  props: ['dataSourceComp'],
  name: 'ChartMainItem',
  components: {
    DataPart,
    ListComp,
    ListSimple,
    ListSort,
    EchartDom
  },
  data () {
    return {
      dataSource: null,
      datas: null,
      myName: '',
      myClass: '',
      borderColor: '',
      title: '',
      num: 0
    }
  },
  mounted () {
    this.dataSource = this.dataSourceComp
  },
  watch: {
    dataSource (newVal) {
      this.myClass = newVal.componentClass
      this.borderColor = newVal.color
      this.num = newVal.index
    },
    'dataSource.title': {
      deep: true,
      handler: function (newV, oldV) {
        this.title = newV
      }
    },
    'dataSource.componentName': {
      deep: true,
      handler: function (newV, oldV) {
        switch (newV) {
          case 'EchartDom':
            this.myName = 'EchartDom'
            break
          case 'combined_table':
            this.myName = 'DataPart'
            break
          case 'rolling_cell_table':
            this.myName = 'ListComp'
            break
          case 'scrolling_compact_table':
            this.myName = 'ListSimple'
            break
          case 'static_table':
            this.myName = 'ListSort'
            break
          default:
            this.myName = 'EchartDom'
            break
        }
      }
    },
    'dataSource.componentData': {
      deep: true,
      handler: function (newV, oldV) {
        if (this.myName === 'ListSort' && this.title === '断货预警') {
          const obj = [{
            0: '仓库SKU',
            1: '仓库',
            2: '仓库/区域',
            3: '销售量',
            4: '销售额',
            5: '可售库存',
            6: '可售天数'
          }]
          this.datas = obj.concat(newV)
        } else {
          this.datas = newV
        }
      }
    }
  },
  methods: {
    clickThis () {
      this.$emit('clickComp', this.num)
    }
  }
}
</script>

<style lang="less">
.main-chart-li {
    // flex: 0 0 33%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    .chart-con {
      height: 100%;
    }
    &.DataPart {
      background: none;
    }
  }
</style>
