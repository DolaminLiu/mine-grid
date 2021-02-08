<template>
    <a-table
    v-if="dataSource.columns && dataSource.columns.length !== 0"
    class="grid-table"
      :dataSource="tableSource.rows"
      :columns="columns"
      :rowKey="(record, index) => index"
    >
  </a-table>
  <img v-else src="../../assets/no-data.png" alt="无数据" style="width: 65px;height: 65px">
</template>

<script>
import dataBaseDefault from '@/utils/chartSource'
export default {
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      tableSource: []
    }
  },
  mounted () {
    this.tableSource = dataBaseDefault
  },
  computed: {
    columns () {
      const _def = this.dataSource.columns.map((key) => {
        return {
          title: key,
          dataIndex: key
        }
      })
      return [..._def]
    }
  }
}
</script>

<style>
.grid-table-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-table {
  width: 100%;
  padding: 8px;
}
</style>
