<script>
import { client } from '@/utils/request'

export default {
  name: 'MyTable',
  props: {
    rowKey: [String, Function],
    rowSelection: Object,
    apiPath: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: false
    },
    param: Object,
    scrollThis: {
      type: Object
      // default: () => {
      //   return { x: '100%' }
      // }
    },
    size: {
      type: String,
      default: 'middle'
    },
    dataSourceProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      parameter: {},
      loading: false,
      dataSource: [],
      scroll: { x: '100%' }
    }
  },
  mounted () {
    this.scroll = this.scrollThis
    if (this.columns.length !== 0) {
      this.dataSource = this.dataSourceProp.source
    }
  },
  computed: {
    pagination () {
      const source = this.dataSourceProp
      const totalNum = this.dataSourceProp.columns.length === 0 ? 0 : this.dataSource.length

      const obj = {
        total: totalNum,
        pageSize: source.pageSize,
        showSizeChanger: false,
        showTotal: total => `共 ${totalNum} 条`, // 分页中显示总的数据
        showSizeChange: () => { this.handlePaginationSizeChange() }
      }
      return obj
    }
  },
  watch: {
    param (newVal) {
      const { pageSize } = this.pagination
      this.parameter = Object.assign({ page: 1, page_size: pageSize }, newVal)
    },
    parameter (newVal) {
      this.loading = true
      this.dataSource = []
      this.fetch(newVal)
    },
    columns (newVal) {
      console.log(newVal)
      if (newVal.length !== 0) {
        this.dataSource = this.dataSourceProp.source
      }
    }
    // dataSourceProp (newVal) {
    //   if (this.columns.length !== 0) {
    //     this.dataSource = newVal.source
    //   }
    // }
  },
  methods: {
    fetch (data) {
      const { apiPath } = this
      this.loading = true
      this.dataSource = []
      this.$emit('query', [])
      this.pagination.total = 0
      client.post(apiPath, { data }).then(res => {
        const { data } = res
        const { paginator } = res.data
        const pagination = { ...this.pagination }
        this.loading = false

        // Read total count and page size from server
        paginator && (pagination.pageSize = Number(paginator.pageSize))
        paginator && (pagination.total = Number(paginator.totalCount))
        this.dataSource = data.data
        //  返回所有请求数据
        this.pagination = pagination

        this.$emit('fecthAllData', this.dataSource)
      }).catch(() => {
        this.loading = false
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const parameter = { ...this.parameter }
      Object.assign(parameter, {
        sort: sorter.order && sorter.field,
        sort_type: sorter.field && (sorter.order === 'ascend' ? 'asc' : 'desc'),
        page: pagination.current,
        page_size: pagination.pageSize
      })
      this.parameter = parameter
      this.pagination = pagination
    },
    handlePaginationChange (page, pageSize) {
      const parameter = { ...this.parameter }
      const pagination = {
        ...this.pagination,
        current: page,
        pageSize: pageSize
      }
      Object.assign(parameter, {
        page: page,
        page_size: pageSize
      })
      this.parameter = parameter
      this.pagination = pagination
    },
    handlePaginationSizeChange (page, pageSize) {
      const parameter = { ...this.parameter }
      const pagination = {
        ...this.pagination,
        current: page,
        pageSize: pageSize
      }
      Object.assign(parameter, {
        page: page,
        page_size: pageSize
      })
      this.parameter = parameter
      this.pagination = pagination
    }
  },
  render () {
    const { loading, dataSource, pagination, size, rowKey, scroll, columns, rowSelection, bordered } = this
    const props = { loading, dataSource, pagination, size, rowKey, scroll, columns, rowSelection, bordered }
    return (
      <div class='my-smart-table'>
        <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.handleTableChange}>
          { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
        </a-table>
      </div>
    )
  }
}
</script>

<style lang="less">
.ant-table {
  font-size: 12px;
}
  .ant-table-middle {
    .ant-table-thead {
      tr {
        th {
          padding: 5px !important;
        }
      }
    }
  }
  .my-smart-table {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .ant-table-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: auto;
      position: relative;
    }
    .ant-pagination {
      display: flex;
      justify-content: flex-end;
      padding: 15px 20px;
    }
    .ant-spin-container {
      position: static;
    }
    .ant-table-placeholder {
      border: none;
    }
    .ant-table-pagination.ant-pagination {
      margin: 0;
    }
    td {
      padding: 8px 5px !important;
    }
  }
</style>
