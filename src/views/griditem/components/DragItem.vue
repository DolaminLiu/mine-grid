<template>
  <div style="width: 100%; height: 100%" class="grid-wrap">
    <div class="drag-box" @click="onActivated(item)">
      <div class="report-title" v-if="item.title && item.title !== ''">
        {{ item.title }}
      </div>
      <div
        style="flex: 1; position: relative; overflow: hidden"
        v-if="item.type !== 'table'"
      >
        <component
          :is="item.components"
          :dataSource="item"
          :chartSettings="item.chartSettings"
          :commentWidth="item.commentWidth"
          :commentHieght="item.commentHeight"
          :grid="item.grid"
          :title="item.title"
          :legendVisible="item.legendVisible"
          :chartExtend="item.chartExtend"
          :judge-width="true"
          :style="{
            height: '100%',
            overflow: 'hidden',
          }"
        ></component>
        <div class="info">模拟效果</div>
      </div>
      <div style="flex: 1; position: relative; overflow: hidden;justify-content: center;display: flex;" v-else>
        <component
          :is="item.components"
          :dataSourceProp="item"
          :columns="item.columns"
          :bordered="item.bordered"
          :rowKey="(record, index) => index"
          :style="{
            height: 'calc(100% - 30px)',
            overflow: 'auto'
          }"
        ></component>
      </div>
    </div>
    <div class="oprate">
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <a-icon type="ellipsis" style="color: #ffffff; font-size: 16px" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item @click="deleteItem(item)">
            <a href="javascript:;">
              <a-icon type="delete" style="margin-right: 5px" />删除
            </a>
          </a-menu-item>
          <a-menu-item @click="copyItem(item)">
            <a href="javascript:;">
              <a-icon type="copy" style="margin-right: 5px" />复制</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="attention">
      <a-tooltip>
        <template slot="title">
          这里是说明
        </template>
        <a-icon type="question-circle" />
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import {
  MeHistogram,
  MeLine,
  MePie,
  MeTable,
  MeBar
} from '@/components/VChart'
export default {
  props: ['item'],
  components: {
    MeLine,
    MeHistogram,
    MePie,
    MeTable,
    MeBar
  },
  watch: {
    item (newVal) {
      // console.log('ooooo')
    }
  },
  methods: {
    deleteItem (item) {
      this.$emit('deleteItem', item)
    },
    onActivated (item) {
      this.$emit('onActivated', item)
    },
    copyItem (item) {
      this.$emit('copyItem', item)
    }
  }
}
</script>

<style lang="less">
.grid-wrap {
  .attention {
    position: absolute;
    left: 10px;
    width: 20px;
    bottom: 8px;
    color: #fa8c16;
  }
  .oprate {
    width: 24px;
    position: absolute;
    right: 4px;
    top: 0;
    line-height: 0;
    font-size: 14px;
    overflow: hidden;
    padding: 2px 4px;
    border-radius: 0 0 2px 2px;
    cursor: pointer;
    background: #1890ff;
    color: #fff;
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
    -webkit-transition-property: -webkit-transform;
    transition-property: -webkit-transform;
    transition-property: transform;
    transition-property: transform, -webkit-transform;
    -webkit-transition-duration: 0.2s;
    transition-duration: 0.2s;
    z-index: 2;
  }
  .oprate:hover {
    background: #329cff;
  }
  .drag-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .report-title {
      // overflow: hidden;
      font-size: 14px;
      padding: 6px 12px;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        left: 2px;
        width: 3px;
        top: 2px;
        bottom: 2px;
        background: #1890ff;
      }
    }
  }
  .info {
    border: 1px dashed #fa8c16;
    position: absolute;
    left: -38px;
    width: 120px;
    top: 10px;
    line-height: 24px;
    text-align: center;
    background-color: rgba(250, 140, 22, 0.05);
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    color: #fa8c16;
  }
}
</style>
