<template>
  <div class="editAttr" :style="{display: showEdit ? 'block':'none'}">
    <div class="editAttr-hd">
      <div><a-icon type="project" />编辑列属性</div>
      <a-icon type="double-right" style="cursor:pointer" @click="() => showEdit = false"/>
    </div>
    <div class="editAttr-bd">
      <div class="editAttr-bd__title">{{ editAttrItem.name }}<a-icon type="right" style="margin-left:5px"/></div>
      <div class="editAttr-bd__con">
        <div class="item">
          <div class="tit">表头</div>
          <div class="setting">
            <a-input
              width="100%"
              v-model="editAttrItem.editName"
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
            <div class="sort-icon" :class="editAttrItem.align === 'left' ? 'align-active':''">
              <a-icon type="pic-left" />
            </div>
            <div class="sort-icon" :class="editAttrItem.align === 'auto' ? 'align-active':''">
              <a-icon type="pic-center" />
            </div>
            <div class="sort-icon" :class="editAttrItem.align === 'right' ? 'align-active':''">
              <a-icon type="pic-right" />
            </div>
          </div>
        </div>
        <div class="item" v-if="editAttrItem.sortDirections && editAttrItem.sortDirections.length >= 0">
          <div class="tit">排序</div>
          <div class="setting">
            <a-select :options="sortOptions" v-model="editAttrItem.sortName" @change="modifyItemCol('sort')" style="width:100%"/>
          </div>
        </div>
        <div class="item" v-if="editAttrItem.symbol">
          <div class="tit">格式</div>
          <div class="setting">
            <a-select v-if="editAttrItem.symbol === '日期'" :options="formatOptionsDate" v-model="editAttrItem.format" @change="modifyItemCol('format')" style="width:100%"/>
            <a-select v-if="editAttrItem.symbol === '季度'" :options="formatOptionsQuarter" v-model="editAttrItem.format" @change="modifyItemCol('format')" style="width:100%"/>
            <a-select v-if="editAttrItem.symbol === '月'" :options="formatOptionsMontn" v-model="editAttrItem.format" @change="modifyItemCol('format')" style="width:100%"/>
            <a-select v-if="editAttrItem.symbol === '数值'" :options="formatOptionsNumber" v-model="editAttrItem.format" @change="modifyItemCol('format')" style="width:100%"/>
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
      editAttrItem: {},
      editAttrItemName: '',
      sortOptions: [
        { title: '无序', value: '' },
        { title: '升序', value: 'ascend' },
        { title: '降序', value: 'descend' }
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
        { title: 'YYYY-MM', value: '1' },
        { title: 'YYYY年-MM月', value: '2' },
        { title: 'MM月', value: '3' }
      ],
      formatOptionsNumber: [
        { title: '¥0,0.00', value: '1' },
        { title: '0,0.00', value: '2' },
        { title: '0', value: '3' },
        { title: '0.00%', value: '4' },
        { title: '0件', value: '5' }
      ]
    }
  },
  watch: {
    currentAttr (newVal) {
      this.editAttrItem = newVal
      this.editAttrItemName = newVal.name
    }
  },
  methods: {
    modifyItemCol (setName) {
      const obj = {
        type: setName,
        res: this.editAttrItem
      }
      this.$emit('modifyItemCol', obj)
    },
    hide () {
      this.showEdit = false
    },
    showEditMethods () {
      this.showEdit = true
    }
  }
}
</script>

<style lang="less">
.editAttr {
  width: 300px;
  background: #fff;
  position: fixed;
  z-index: 100;
  top: 105px;
  right: 421px;
  -webkit-transition: all;
  transition: all;
  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0,15%);
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
