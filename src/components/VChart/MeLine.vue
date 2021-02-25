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
            columns: ['指标'],
            rows: [
              { '指标': 1393 },
              { '指标': 3530 },
              { '指标': 2923 },
              { '指标': 1723 },
              { '指标': 3792 },
              { '指标': 4593 }
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
