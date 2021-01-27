<template>
  <a-layout class="page-view">
    <div class="page-view__breadcrumb">
      <span>当前位置：</span>
      <s-breadcrumb />
    </div>
    <a-layout-content>
      <slot></slot>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Breadcrumb from '@/components/tools/Breadcrumb'
export default {
  name: 'PageView',
  components: {
    's-breadcrumb': Breadcrumb
  }
}
</script>

<style lang="less">
.page-view {
  padding: 20px;
}

.page-view__breadcrumb {
  margin-top: -5px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  color: #3F354A;
  font-size: 13px;

  .breadcrumb {
    flex: 1;
    font-size: 13px;
  }
}
</style>
