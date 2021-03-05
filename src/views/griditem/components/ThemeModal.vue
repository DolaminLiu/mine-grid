<template>
  <a-modal
    title=""
    :visible="visible"
    width="700px"
    class="grid-theme"
    :closable="false"
    :maskClosable="false"
    :footer="null"
    @cancel="handleCancel"
    :bodyStyle="{ padding: '10px', fontSize: '12px' }"
  >
    <a-tabs default-active-key="1" type="card">
      <a-tab-pane key="1" tab="数据主题">
         <div class="grid-theme__wrap__bd">
        <div class="grid-theme__wrap__bd__con" v-for="item in themeList" :key="item.value" @click="chooseItem(item)">
              <img
                :src="item.img"
                alt="1"
                style="width: 55px; height: 65px"
              />
              {{item.name}}
          </div>
         </div>
        <!-- <div class="grid-theme__wrap" v-for="theme in themeList" :key="theme.value">
          <div class="grid-theme__wrap__hd">
            {{theme.name}}<a-icon type="down" />
          </div>
          <div class="grid-theme__wrap__bd">
            <div class="grid-theme__wrap__bd__con" v-for="item in theme.children" :key="item.value" @click="chooseItem(item)">
              <img
                :src="item.img"
                alt="1"
                style="width: 55px; height: 65px"
              />
              {{item.name}}
            </div>
          </div>
        </div> -->
      </a-tab-pane>
      <!-- <a-tab-pane key="2" tab="自选表"> </a-tab-pane> -->
    </a-tabs>
    <div class="footer">
      <span class="detail">更多版本说明</span>
      <div class="please">
        <a-icon type="check-square" />申请试用 （旗舰版本）
      </div>
    </div>
  </a-modal>
</template>
<script>
import img from '../../../assets/happy.png'
import { datasetList } from '@/api'
export default {
  data () {
    return {
      visible: false,
      themeList: []
      // themeList: [
      //   {
      //     name: '已开通主题',
      //     value: '0',
      //     children: [
      //       { name: '采购', value: 'order', img: img },
      //       { name: '库存', value: 'detail', img: img },
      //       { name: '销售', value: 'details', img: img },
      //       { name: '产品', value: 'post', img: img },
      //       { name: '仓库', value: 'warehouse', img: img }
      //     ]
      //   },
      //   {
      //     name: '待开通主题',
      //     value: '1',
      //     children: [
      //       { name: '店铺', value: 'order', img: img },
      //       { name: '广告', value: 'detailss', img: img },
      //       { name: '财务', value: 'profit', img: img }
      //     ]
      //   }
      // ]
    }
  },
  mounted () {
    datasetList().then(res => {
      const { data, error, message } = res
      if (error !== 0) {
        this.$message.error(message)
        return false
      }
      this.themeList = data.map(item => {
        return {
          name: item.dataset_name,
          value: item.dataset_code,
          img
        }
      })
    })
  },
  methods: {
    handleShow (data) {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    chooseItem (item) {
      this.visible = false
      this.$emit('chooseItemUp', item)
    }
  }
}
</script>

<style lang="less" scoped>
.grid-theme {
  font-size: 12px;
  .anticon {
      margin: 0 5px;
      font-size: 12px;
    }
  .ant-tabs {
    font-size: 12px;
  }
  .grid-theme__wrap__bd {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 5px 0 15px;
    .grid-theme__wrap__bd__con {
      padding: 5px 20px;
      margin-right: 10px;
      background: rgba(24, 144, 255, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border: 1px solid transparent;
      border-radius: 2px;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
      -webkit-transition-property: all;
      transition-property: all;
      cursor: pointer;
      img {
        margin-bottom: 10px;
      }
      &:hover {
        border-color: #1890ff;
        background: rgba(24, 144, 255, 0.1);
        // box-shadow: 0 0 10px 0 rgb(24, 144, 255, .1);
        -webkit-box-shadow: 0 0 8px 0 rgba(24, 144, 255, 40%);
        box-shadow: 0 0 8px 0 rgba(24, 144, 255, 40%);
      }
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    .detail {
      color: #1890ff;
      cursor: pointer;
    }
    .please {
      padding: 5px 10px;
      background: #1890ff;
      color: #ffffff;
      border-radius: 3px;
      cursor: pointer;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
      -webkit-transition-property: all;
      transition-property: all;
      &:hover {
        opacity: .7;
      }
    }
  }
}
</style>
