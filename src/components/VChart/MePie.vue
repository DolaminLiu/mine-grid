<template>
  <div class="chartcontainer" style="width:100%;height:100%" ref="MeLine">
    <ve-pie
    ref="mychart"
    :data="dataSource.chartData"
    width="100%"
    height="100%"
    :chartSettings="chartSettings"
    :colors="colors"
    :settings="dataSource.chartSettings"
    :judge-width="true"
    :data-empty="dataEmpty"
    :grid="grid"
    :extend="chartExtend"
    ></ve-pie>
  </div>
</template>

<script>
import VePie from 'v-charts/lib/pie.common'
export default {
  // props: ['dataSource', 'commentWidth', 'commentHeight', 'colors', 'chartSettings'],
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {
          title: '饼图',
          index: 2,
          components: 'MePie',
          type: 'v-charts',
          width: 200,
          x: 420,
          height: 200,
          chartData: {
            columns: ['上架日期', '访问用户'],
            rows: [
              { '上架日期': '1/1', '访问用户': 1393 },
              { '上架日期': '1/2', '访问用户': 3530 },
              { '上架日期': '1/3', '访问用户': 2923 },
              { '上架日期': '1/4', '访问用户': 1723 },
              { '上架日期': '1/5', '访问用户': 3792 },
              { '上架日期': '1/6', '访问用户': 4593 }
            ]
          }
        }
      }
    },
    commentWidth: Number,
    commentHeight: Number,
    grid: Object,
    chartExtend: Object,
    title: String,
    chartSettings: Object,
    colors: {
      type: Array,
      default: () => {
        return [
          '#5AB1EF',
          '#FA6E86',
          '#FFB980',
          '#0167A6',
          '#C4B4E4',
          '#1BD4AE'
        ]
      }
    }
  },
  components: {
    VePie
  },
  data () {
    return {
      dataEmpty: false
    }
  },
  watch: {
    dataSource (newVal) {
      this.$refs.mychart.echarts.resize()
      this.dataEmpty = !newVal.chartData.rows.length
    },
    commentWidth (newVal) {
      this.$refs.mychart.echarts.resize()
    },
    commentHeight () {
      this.$refs.mychart.echarts.resize()
    },
    title () {
      this.$refs.mychart.echarts.resize()
    }
  }
}
</script>

<style>

</style>
