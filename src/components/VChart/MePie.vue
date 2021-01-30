<template>
  <div class="chartcontainer" style="width:100%;height:100%" ref="MeLine">
    <ve-pie
    ref="mychart"
    :data="dataSource.chartData"
    width="100%"
    height="100%"
    :chartSettings="chartSettings"
    :colors="colors"
    :settings="chartSettings"
    :judge-width="true"
    :data-empty="dataEmpty"
    :grid="grid"
    :legend-visible="legendVisible"
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
            columns: ['日期', '访问用户'],
            rows: [
              { '日期': '1/1', '访问用户': 1393 },
              { '日期': '1/2', '访问用户': 3530 },
              { '日期': '1/3', '访问用户': 2923 },
              { '日期': '1/4', '访问用户': 1723 },
              { '日期': '1/5', '访问用户': 3792 },
              { '日期': '1/6', '访问用户': 4593 }
            ]
          }
        }
      }
    },
    commentWidth: Number,
    commentHeight: Number,
    grid: Object,
    legendVisible: Boolean,
    chartExtend: Object,
    title: String,
    chartSettings: Object,
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
