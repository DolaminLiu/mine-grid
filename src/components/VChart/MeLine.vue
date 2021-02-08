<template>
  <div class="chartcontainer" style="width:100%;flex: 1" ref="MeLine">
    <ve-line
    ref="mychart"
    :data="dataSource.chartData"
    width="100%"
    height="100%"
    :colors="colors"
    :judge-width="true"
    :data-empty="dataEmpty"
    :grid="grid"
    :settings="dataSource.chartSettings"
    :extend="chartExtend"
    ></ve-line>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
export default {
  // props: ['dataSource', 'commentWidth', 'commentHeight', 'colors'],
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {
          title: '折线图',
          index: 0,
          components: 'MeLine',
          type: 'v-charts',
          width: 200,
          x: 0,
          height: 200,
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
        }
      }
    },
    commentWidth: Number,
    title: String,
    commentHeight: Number,
    colors: {
      type: Array,
      default: () => {
        return [
          '#61a0a8',
          '#d48265',
          '#91c7ae',
          '#749f83',
          '#ca8622',
          '#bda29a',
          '#6e7074',
          '#546570',
          '#c4ccd3']
      }
    },
    grid: Object,
    chartExtend: Object
  },
  components: {
    VeLine
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
