<template>
  <div class="chartcontainer" style="width:100%;height:100%">
    <ve-histogram
    ref="mychart"
    :data="dataSource.chartData"
    width="100%"
    height="100%"
    :colors="colors"
    :judge-width="true"
    :data-empty="dataEmpty"
    :settings="dataSource.chartSettings"
    :grid="grid"
    :extend="chartExtend"
    ></ve-histogram>
  </div>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
export default {
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {
          title: '柱图',
          index: 1,
          components: 'MeHistogram',
          type: 'v-charts',
          width: 200,
          height: 200,
          x: 210,
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
      }
    },
    commentWidth: Number,
    commentHeight: Number,
    grid: Object,
    title: String,
    chartExtend: Object,
    colors: {
      type: Array,
      default: () => {
        return [
          '#5AB1EF',
          '#FA6E86',
          '#FFB980',
          '#0167A6',
          '#C4B4E4',
          '#1BD4AE']
      }
    }
  },
  components: {
    VeHistogram
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
    commentHeight (vewVal) {
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
