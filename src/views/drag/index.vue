<template>
  <div class="flex-cont">
      <a-menu mode="horizontal">
      <a-menu-item v-for="menu in menuList" :key="menu.name" @click="addElement(menu)">
        <a-icon :type="menu.name" />
      </a-menu-item>
    </a-menu>
    <div class="drag-con">
      <div class="drag-scroll">
        <div class="scroll-tent">
          <div class="helloword" :style="{ height: height }">
            <div style="width:100%;height:100%">
              <me-drag
              v-for="item in itemList"
              :key="item.sort"
              :item="item"
              @resize="resize"
              @deleteItem="deleteItem(item)"
              @onActivated="onActivated"
              @copyItem="copyItem"/>
            </div>
          </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script>
import MeDrag from './components/MeDrag'
export default {
  name: 'app',
  components: {
    MeDrag
  },
  data () {
    return {
      height: '',
      vLine: [],
      hLine: [],
      x: 0,
      colors: [
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
      ],
      menuList: [
        {
          name: 'bar-chart',
          comment: 'MeBar',
          type: 'v-charts'
        },
        {
          name: 'line-chart',
          comment: 'MeLine',
          type: 'v-charts'
        },
        {
          name: 'pie-chart',
          comment: 'MePie',
          type: 'v-charts'
        },
        {
          name: 'table',
          comment: 'MeTable',
          type: 'table'
        }
      ],
      itemList: [],
      itemData: [{
        title: '折线图',
        sort: 0,
        components: 'MeLine',
        type: 'v-charts',
        width: 400,
        height: 400,
        x: 10,
        y: 10,
        chartData: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        }
      },
      {
        title: '柱图',
        sort: 1,
        components: 'MeBar',
        type: 'v-charts',
        width: 400,
        height: 400,
        x: 10,
        y: 10,
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
      },
      {
        title: '饼图',
        sort: 2,
        components: 'MePie',
        type: 'v-charts',
        width: 400,
        height: 400,
        x: 10,
        y: 10,
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      },
      {
        title: '表格',
        sort: 3,
        components: 'MeTable',
        type: 'table',
        width: 400,
        height: 400,
        x: 10,
        y: 10,
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
      },
      {
        title: '柱图',
        sort: 4,
        components: 'MeBar',
        type: 'v-charts',
        width: 400,
        height: 400,
        x: 10,
        y: 10,
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
      ]
    }
  },
  methods: {
    addElement (item) {
      const len = this.itemList.length
      const list = this.itemList
      list.push({
        sort: len,
        components: item.comment,
        type: item.type,
        width: 980,
        height: 200,
        x: 0,
        y: 0,
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
      })
      this.itemList = list
      console.log(this.itemList)
    },
    resize () {
      const dom = document.getElementsByClassName('scroll-tent')
      const height = dom[0].scrollHeight
      console.log(dom[0].offsetHeight)
      console.log(dom[0].offsetWidth)
      dom[0].scrollTop = height
    },
    deleteItem (item) {
      const list = this.itemList.filter(ele => {
        return ele.sort !== item.sort
      })
      this.itemList = list
    },
    onActivated (item) {
      this.$nextTick(() => {
        this.itemList.map(ele => {
          if (ele.sort === item.sort) {
            this.$set(ele, 'active', true)
          } else {
            this.$set(ele, 'active', false)
          }
        })
        console.log(this.itemList)
      })
    },
    copyItem (item) {
      console.log(item)
      // console.log(item.width)
      // console.log(item.height)
      const list = this.itemList.map(ele => {
        if (ele.sort < item.sort) {
          return ele
        } else if (ele.sort > item.sort) {
          let { sort, ...others } = ele
          return {
            sort: Number(`${sort}`) + 1,
            ...others
          }
        } else {
          const { width, height, sort, ...other } = ele
          return {
            sort: Number(`${sort}`) + 1,
            width: item.width,
            height: item.height,
            ...other
          }
        }
      })

      const para = { ...item }
      para.active = false
      // const height = Number(`${item.height}`) + Number(`${item.y}`) + 10
      // para.y = height
      if (item.sort === 0) {
        para.sort = 0
        list.unshift(para)
      } else {
        const sot = Number(`${item.sort}`)
        para.sort = sot
        list.splice(sot, 0, para)
      }
      this.itemList = list
    }
  }
}
</script>

<style>
.flex-cont {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.drag-con {
  position: relative;
  flex: 1;
  overflow: auto;
  -webkit-align-self: auto;
  -ms-flex-item-align: auto;
  align-self: auto;
}
.drag-scroll {
      height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.scroll-tent {
      display: block;
    height: 100%;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    overflow-y: auto;
    position: relative;
    background: #dfeaf4;
}
.helloword {
    width: 1000px;
    height: 1000px;
    /* min-height: 100%; */
    display: block;
    position: relative;
    -webkit-box-shadow: 2px 2px 4px 2px rgba(0,0,0,.05);
    box-shadow: 2px 2px 4px 2px rgba(0,0,0,.05);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff;
    margin: 0 auto;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transition-duration: .2s;
    transition-duration: .2s;
    -webkit-transition-property: -webkit-transform;
    transition-property: -webkit-transform;
    transition-property: transform;
    transition-property: transform,-webkit-transform;
    background-image: linear-gradient(hsla(0,0%,85.1%,.4) 1px,transparent 0),linear-gradient(90deg,hsla(0,0%,85.1%,.4) 1px,transparent 0),linear-gradient(hsla(0,0%,85.1%,.4) 1px,transparent 0),linear-gradient(90deg,hsla(0,0%,85.1%,.4) 1px,transparent 0);
    background-size: 50px 50px,50px 50px,10px 10px,10px 10px;
  /* width: 1200px;
  height: 800px;
  border: 1px solid red;
  min-height: 300px;
  position: relative;
background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 10px 10px, linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 10px 10px; */
}
.grid-con {
      position: relative;
    -webkit-transition: height .2s ease;
    transition: height .2s ease;
}
  .ant-menu-item {
    border-bottom: none;
  }
  .ant-menu-horizontal > .ant-menu-item:hover,
  .ant-menu-horizontal > .ant-menu-item-active,
  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: none;
  }
  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    border-bottom: none;
  }
  .ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-submenu {
    border-bottom: none;
  }
</style>
