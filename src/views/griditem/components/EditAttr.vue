<template>
  <div class="editAttr" :style="{ display: showEdit ? 'block' : 'none' }">
    <div class="editAttr-hd">
      <div><a-icon type="project" />编辑{{ editTypeName }}属性</div>
      <a-icon
        type="double-right"
        style="cursor: pointer"
        @click="() => (showEdit = false)"
      />
    </div>
    <div class="editAttr-bd">
      <div class="editAttr-bd__title">
        {{ editAttrItem.dataIndex
        }}<a-icon type="right" style="margin-left: 5px" />
      </div>
      <div class="editAttr-bd__con" v-if="editType === 'columns'">
        <div class="item">
          <div class="tit">表头</div>
          <div class="setting">
            <a-input
              width="100%"
              v-model="editAttrItem.title"
              @change="modifyItemCol('name')"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">宽度</div>
          <div class="setting">
            <a-input
              type="number"
              width="100%"
              v-model="editAttrItem.width"
              @change="modifyItemCol('width')"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">对齐</div>
          <div class="setting sort">
            <div
              class="sort-icon"
              v-for="item in alignOptions"
              :key="item.title"
              :class="editAttrItem.align === item.value ? 'align-active' : ''"
            >
              <a-icon :type="item.icon" @click="changeAligin(item.value)" />
            </div>
          </div>
        </div>
        <div class="item" v-if="editAttrItem.hasSort">
          <div class="tit">排序</div>
          <div class="setting">
            <a-select
              :options="sortOptions"
              v-model="editAttrItem.sortName"
              @change="modifyItemCol('sort')"
              style="width: 100%"
            />
          </div>
        </div>
        <div
          class="item"
          v-if="editAttrItem.symbol || editAttrItem.formatOptions"
        >
          <div class="tit">格式</div>
          <div class="setting">
            <a-select
              v-if="editAttrItem.symbol === '数值'"
              v-model="editAttrItem.format"
              :options="formatOptionsNumber"
              @change="modifyItemCol('format')"
              style="width: 100%"
            />
            <a-select
              v-if="editAttrItem.symbol === '数量'"
              v-model="editAttrItem.format"
              :options="formatOptionsVal"
              @change="modifyItemCol('format')"
              style="width: 100%"
            />
            <a-select
              v-if="editAttrItem.formatOptions"
              v-model="editAttrItem.format"
              :options="editAttrItem.formatOptions"
              @change="modifyItemCol('format')"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
      <div class="editAttr-bd__con" v-if="editType === 'weidu'">
        <div class="item">
          <div class="tit">排序</div>
          <div class="setting">
            <a-select
              :options="sortOptionsChart"
              v-model="editAttrItem.sortName"
              @change="modifyItemCol('sort')"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
      <div class="editAttr-bd__con" v-if="editType === 'zhibiao'">
        <div class="item">
          <div class="tit">系列名称</div>
          <div class="setting">
            <a-input
              width="100%"
              v-model="editAttrItem.title"
              @change="modifyItemCol('labelMap', 'settings')"
            />
          </div>
        </div>
        <div class="item" v-if="editAttrItem.type === 'line' || editAttrItem.type === 'histogram'">
          <div class="tit">系列类型</div>
          <div class="setting">
            <a-select
              :options="typeOptionsChart"
              v-model="editAttrItem.type"
              @change="modifyItemCol('type', 'settings')"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">聚合</div>
          <div class="setting">
            <a-select
              :options="addOptionsChart"
              v-model="editAttrItem.chartDataWay"
              @change="modifyItemCol('chartDataWay')"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit"></div>
          <div class="setting">
            <a-checkbox v-model="editAttrItem.chartLabel" @change="changeCheckBoxLabel"/> 显示标签
          </div>
        </div>
        <div class="item">
          <div class="tit">标签格式</div>
          <div class="setting">
            <a-select
              style="width: 100%"
              :options="formatOptionsNumber"
              v-model="editAttrItem.labelFormat"
              @change="modifyItemCol('labelFormat', 'extend')"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">排序</div>
          <div class="setting">
            <a-select
              :options="orderOptionsChart"
              v-model="editAttrItem.order"
              @change="modifyItemCol('order', 'extend')"
              style="width: 100%"
            />
          </div>
        </div>
        <div v-if="editAttrItem.type === 'histogram' && editAttrItem.chartLabel">
          <div class="item">
          <div class="tit">标签位置</div>
          <div class="setting">
            <a-select
              :options="positionOptions"
              v-model="editAttrItem.labelPosition"
              @change="modifyItemCol('chartLabel', 'extend')"
              style="width: 100%"
            />
          </div>
        </div>
        </div>
        <div v-if="editAttrItem.type === 'line'">
          <div class="item">
          <div class="tit">粗细</div>
          <div class="setting">
            <a-input
              width="100%"
              v-model="editAttrItem.chartWidth"
              @change="modifyItemCol('width', 'settings')"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit"></div>
          <div class="setting">
            <a-checkbox v-model="editAttrItem.smooth" @change="changeCheckBoxSmooth"/> 平滑
          </div>
        </div>
        <div class="item">
          <div class="tit"></div>
          <div class="setting">
            <a-checkbox v-model="editAttrItem.area" @change="changeCheckBoxArea"/> 面积填充
          </div>
        </div>
        <div class="item">
          <div class="tit">标记图形</div>
          <div class="setting">
            <a-select
              :options="symbolOptionsChart"
              v-model="editAttrItem.chartSymbol"
              @change="modifyItemCol('symbol', 'extend')"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">标记大小</div>
          <div class="setting">
            <a-input
              v-model="editAttrItem.symbolSize"
              @change="modifyItemCol('symbol', 'extend')"
              style="width: 100%"
            />
          </div>
        </div>
        </div>
      </div>
      <div
        class="editAttr-bd__con"
        v-if="editType === 'guolv' && !editAttrItem.valType"
      >
        <div class="">
          <a-radio-group v-model="filterType" style="margin-bottom: 16px">
            <a-radio-button value="1"> 多选过滤 </a-radio-button>
            <a-radio-button value="2"> 单选过滤 </a-radio-button>
          </a-radio-group>
          <a-textarea
            v-if="filterType === '1'"
            placeholder="请点击此处选择..."
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
          <a-input v-if="filterType === '2'" placeholder="请点击此处选择..." />
        </div>
      </div>
      <div
        class="editAttr-bd__con"
        v-if="editType === 'guolv' && editAttrItem.valType"
      >
        <div class="item">
          <div class="tit">值类型</div>
          <div class="setting">
            <a-radio-group v-model="editAttrItem.valType">
              <a-radio :value="'1'"> 区间值 </a-radio>
              <a-radio :value="'2'"> 单值 </a-radio>
            </a-radio-group>
          </div>
        </div>
        <!-- <div class="item">
          <div class="tit">取值方式</div>
          <div class="setting">
            <a-radio-group v-model="editAttrItem.valWay"
          @change="tepeChange">
          <a-radio :value="1">
            固定值
          </a-radio>
          <a-radio :value="2">
            相对值
          </a-radio>
        </a-radio-group>
          </div>
        </div> -->
        <div class="item">
          <div class="tit">取值范围</div>
          <div class="setting">
            <a-range-picker
              v-if="editAttrItem.valType === '1'"
              style="width: 200px"
              allowClear
              :placeholder="['开始时间', '结束时间']"
              format="YYYY-MM-DD"
            >
              <!-- <a-icon slot="suffixIcon" type="calendar" /> -->
            </a-range-picker>

            <a-date-picker
              v-if="editAttrItem.valType === '2'"
              style="width: 150px; min-width: 0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentAttr'],
  data () {
    return {
      showEdit: false,
      filterType: '1',
      editAttrItem: {},
      editAttrItemName: '',
      sortOptions: [
        { title: '是', value: '1' },
        { title: '否', value: '0' }
      ],
      sortOptionsChart: [
        { title: '无序', value: '0' },
        { title: '升序', value: '1' },
        { title: '降序', value: '2' }
      ],
      orderOptionsChart: [
        { title: '无序', value: '' },
        { title: '升序', value: 'asc' },
        { title: '降序', value: 'desc' }
      ],
      alignOptions: [
        { title: '左', value: 'left', icon: 'pic-left' },
        { title: '中', value: 'center', icon: 'pic-center' },
        { title: '右', value: 'right', icon: 'pic-right' }
      ],
      addOptionsChart: [
        { title: '合计', value: '1' }
      ],
      typeOptionsChart: [
        { title: '线图', value: 'line' },
        { title: '柱图', value: 'histogram' }
      ],
      positionOptions: [
        { title: '顶部（内）', value: 'insideTop' },
        { title: '顶部（外）', value: 'top' },
        { title: '居中', value: 'inside' },
        { title: '底部', value: 'insideBottom' }
      ],
      symbolOptionsChart: [
        { title: '无', value: 'none' },
        { title: '空心圆', value: '' },
        { title: '圆形', value: 'circle' },
        { title: '矩形', value: 'rect' },
        { title: '圆角', value: 'roundRect' },
        { title: '三角形', value: 'triangle' },
        { title: '菱形', value: 'diamond' },
        { title: '气泡', value: 'pin' },
        { title: '箭头', value: 'arrow' }
      ],
      formatOptionsDate: [
        { title: 'YYYY-MM-DD', value: '1' },
        { title: 'YYYY年MM月DD日', value: '2' }
      ],
      formatOptionsQuarter: [
        { title: 'YYYY年Q季度', value: '1' },
        { title: 'YYYY年-Q季度', value: '2' },
        { title: 'Q季度', value: '3' }
      ],
      formatOptionsMontn: [
        { title: 'YYYYMM', value: '1' },
        { title: 'YYYY-MM', value: '2' },
        { title: 'YYYY年MM月', value: '3' },
        { title: 'MM月', value: '4' }
      ],
      formatOptionsVal: [
        { title: '0', value: '1' },
        { title: '0,0', value: '2' }
      ],
      formatOptionsNumber: [
        { title: '0', value: '0' },
        { title: '0,0', value: '0,0' },
        { title: '0.00', value: '0.00' },
        { title: '0,0.00', value: '0,0.00' },
        { title: '0%', value: '0%' },
        { title: '0k', value: '0 a' }
      ],
      editType: '', // zhibiao,weidu,guolv,columns
      editTypeName: ''
    }
  },
  watch: {
    currentAttr (newVal) {
      this.editAttrItem = { ...newVal }
      this.editAttrItemName = newVal.name
    },
    editType (newVal) {
      switch (newVal) {
        case 'columns':
          this.editTypeName = '列'
          break
        case 'zhibiao':
          this.editTypeName = '指标'
          break
        case 'weidu':
          this.editTypeName = '维度'
          break
        case 'guolv':
          this.editTypeName = '过滤'
          break
        default:
          this.editTypeName = ''
      }
    }
  },
  methods: {
    modifyItemCol (setName, extend) {
      const obj = {
        type: this.editType,
        name: setName,
        res: this.editAttrItem,
        rights: extend
      }
      this.$emit('modifyItemCol', obj)
    },
    hide () {
      this.showEdit = false
    },
    showEditMethods (type) {
      this.editType = type
      this.showEdit = true
    },
    changeAligin (align) {
      const res = this.editAttrItem
      res.align = align
      const obj = {
        type: 'align',
        res: res
      }
      this.$emit('modifyItemCol', obj)
    },
    changeCheckBoxLabel (e) {
      const res = { ...this.editAttrItem }
      res.chartLabel = e.target.checked
      this.editAttrItem = res
      const obj = {
        type: this.editType,
        name: 'chartLabel',
        res: res,
        rights: 'extend'
      }
      this.$emit('modifyItemCol', obj)
    },
    changeCheckBoxArea (e) {
      const res = { ...this.editAttrItem }
      res.area = e.target.checked
      this.editAttrItem = res
      const obj = {
        type: this.editType,
        name: 'area',
        res: res,
        rights: 'extend'
      }
      this.$emit('modifyItemCol', obj)
    },
    changeCheckBoxSmooth (e) {
      const res = { ...this.editAttrItem }
      res.smooth = e.target.checked
      this.editAttrItem = res
      const obj = {
        type: this.editType,
        name: 'smooth',
        res: res,
        rights: 'extend'
      }
      this.$emit('modifyItemCol', obj)
    }
  }
}
</script>

<style lang="less">
.editAttr {
  width: 300px;
  height: 80%;
  background: #fff;
  position: fixed;
  z-index: 100;
  top: 105px;
  right: 421px;
  -webkit-transition: all;
  transition: all;
  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 15%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 15%);
  .editAttr-hd {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d9d9d9;
  }
  .editAttr-bd {
    padding: 20px 10px;
    .editAttr-bd__title {
      font-weight: 700;
      margin-bottom: 20px;
    }
    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tit {
        min-width: 4rem;
      }
      .setting {
        flex: 1;
        margin-left: 10px;
        &.sort {
          display: flex;
          align-items: center;
          justify-content: space-around;
          .anticon {
            font-size: 24px;
            cursor: pointer;
          }
        }
        .align-active .anticon {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
