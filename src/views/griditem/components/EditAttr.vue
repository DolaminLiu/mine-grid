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
              @change="modifyItemCol('name')"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">系列类型</div>
          <div class="setting">
            <a-select
              :options="sortOptionsChart"
              v-model="editAttrItem.sortName"
              @change="modifyItemCol('sort')"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit">聚合</div>
          <div class="setting">
            <a-select
              :options="sortOptionsChart"
              v-model="editAttrItem.sortName"
              @change="modifyItemCol('sort')"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit"></div>
          <div class="setting">
            <a-checkbox /> 显示标签
          </div>
        </div>
        <div class="item">
          <div class="tit">标签格式</div>
          <div class="setting">
            <a-input
              width="100%"
              v-model="editAttrItem.title"
              @change="modifyItemCol('format')"
            />
          </div>
        </div>
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
        <div class="item">
          <div class="tit">粗细</div>
          <div class="setting">
            <a-input
              width="100%"
              v-model="editAttrItem.title"
              @change="modifyItemCol('width')"
            />
          </div>
        </div>
        <div class="item">
          <div class="tit"></div>
          <div class="setting">
            <a-checkbox /> 平滑
          </div>
        </div>
        <div class="item">
          <div class="tit"></div>
          <div class="setting">
            <a-checkbox /> 面积填充
          </div>
        </div>
        <div class="item">
          <div class="tit">标记图形</div>
          <div class="setting">
            <a-select
              :options="sortOptionsChart"
              v-model="editAttrItem.icon"
              @change="modifyItemCol('icon')"
              style="width: 100%"
            />
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
      alignOptions: [
        { title: '左', value: 'left', icon: 'pic-left' },
        { title: '中', value: 'center', icon: 'pic-center' },
        { title: '右', value: 'right', icon: 'pic-right' }
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
        { title: '0', value: '1' },
        { title: '0,0', value: '2' },
        { title: '0.00', value: '3' },
        { title: '0,0.00', value: '4' }
      ],
      editType: '',
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
    modifyItemCol (setName) {
      const obj = {
        type: this.editType,
        name: setName,
        res: this.editAttrItem
      }
      this.$emit('modifyItemCol', obj)
    },
    hide () {
      this.showEdit = false
    },
    showEditMethods (type) {
      console.log(type)
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
        margin-left: 20px;
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
