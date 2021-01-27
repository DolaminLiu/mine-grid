<template>
  <div ref="MeTable" class="my-table">
    <span v-for="item in dataSource.chartData.columns" :key="item.key">
      {{item}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {
          title: '表格',
          index: 3,
          components: 'MeTable',
          type: 'table',
          width: 200,
          height: 200,
          x: 630,
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
      }
    },
    commentWidth: String,
    commentHeight: String,
    chartSettings: String,
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
  }
}
</script>

<style>
</style>
