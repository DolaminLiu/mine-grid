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
        return {}
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
