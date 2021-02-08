import dataBaseDefault from '@/utils/chartSource'
export default {
  data () {
    return {
      layoutColNum: 100,
      // 布局位置数据
      layoutMap: [],
      // 布局数据
      layoutData: [],
      layoutHeight: 100, // 默认高度
      currentType: '页面设计',
      currentItem: {},
      nowIndex: 0,
      dialogVisible: true // 是否可拖拽或改变大小c
    }
  },
  methods: {
    resizeEvent (i, newH, newW, newHPx, newWPx) { // 改变宽高
      this.layoutData.map((item) => {
        if (item.i === i) {
          this.$set(item, 'commentWidth', newWPx)
          this.$set(item, 'commentHeight', newHPx)
        }
      })
    },
    movedEvent (i, newX, newY) {
      console.log('MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    addElement (item) { // 添加
      this.layoutData.map((item) => {
        this.$set(item, 'active', false)
      })
      let width = item.type === 'table' ? 100 : 50
      let itemH = 3
      let addEle = {}
      if (item.type !== 'table') {
        addEle = {
          active: true,
          title: '',
          components: item.comment,
          type: item.type,
          cName: item.cName,
          legend1: 'bottom',
          legend2: 'center',
          chartSettings: {
            radius: 80,
            metrics: ['访问用户']
          },
          chartExtend: {
            legend: {
              show: true,
              bottom: 0,
              left: 'center',
              orient: 'horizontal'
            },
            series: {
              center: ['50%', '50%']
            }
          }, // 图例配置
          grid: {
            top: 40,
            left: 40,
            right: 40,
            bottom: 40
          }, // 图位置配置
          chartData: {
            columns: ['日期', '访问用户', '下单用户2', '下单率2'],
            rows: [
              { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
              { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
              { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
              { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
              { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
              { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
            ]
          }
        }
      } else {
        addEle = {
          active: true,
          title: '',
          components: item.comment,
          type: item.type,
          cName: item.cName,
          pageSize: 10,
          columns: [], // 表头名称
          source: dataBaseDefault,
          rows: [], // 数据
          bordered: false // 是否有边线
        }
      }

      var addItem = {
        'x': 0,
        'y': this.layoutMap.length,
        'w': width,
        'h': itemH,
        'i': this.nowIndex,
        ...addEle
      }
      if (this.layoutMap.length) { // 区域检测 c,r 二维数据地图起始坐标点  w,rLen 检测区域宽高
        for (let r = 0, rLen = this.layoutMap.length; r < rLen; r++) {
          for (let c = 0; c <= (this.layoutColNum - width); c++) {
            let res = this.regionalTest(
              c,
              r,
              width,
              rLen > (r + itemH) ? itemH : rLen - r
            )

            if (res.result) { // 更新添加数据内容
              addItem = {
                'x': res.x,
                'y': res.y,
                'w': width,
                'h': itemH,
                ...addEle
              }

              c = this.layoutColNum + 1
              r = rLen + 1
            } else {
              c = res.offsetX
            }
          }
        }
      }
      // 更新二维数组地图
      for (let itemR = 0; itemR < itemH; itemR++) {
        for (let itemC = 0; itemC < width; itemC++) {
          if (!this.layoutMap[addItem.y + itemR]) { // 如果没有该行，初始化
            this.layoutMap[addItem.y + itemR] = new Array(this.layoutColNum)
            for (let i = 0; i < this.layoutColNum; i++) {
              this.layoutMap[addItem.y + itemR][i] = 0
            }
          }
          // 标记点
          this.layoutMap[addItem.y + itemR][addItem.x + itemC] = 1
        }
      }

      this.layoutData.push(addItem)

      this.nowIndex = Number(this.nowIndex) + 1
      this.currentType = item.type
      this.currentItem = addItem

      if (this.$refs.DataModule) {
        this.$refs.DataModule.hide()
      }
      if (item.comment === 'MePie') {
        this.chartSeriesCenterLeft = addItem.chartExtend.series.center[0].replace(/%/, '')
        this.chartSeriesCenterTop = addItem.chartExtend.series.center[1].replace(/%/, '')
      }
      this.chooseTheme()
    },
    deleteItem (item) { // 删除
      this.layoutData = this.layoutData.filter((ele) => {
        return ele.i !== item.i
      })
      this.currentItem = {}
      this.currentType = '页面设计'
    },
    onActivated (item) { // 点击选中
      this.currentItem = item
      if (this.$refs.DataModule) {
        this.$refs.DataModule.hide()
      }
      this.$nextTick(() => {
        this.layoutData.map((ele) => {
          if (ele.i === item.i) {
            this.$set(ele, 'active', true)
          } else {
            this.$set(ele, 'active', false)
          }
        })
        this.currentType = item.type
      })
    },
    copyItem (item) { // 复制
      const { active } = item
      const midData = { ...item }
      midData.i = this.nowIndex

      midData.active = !active
      const arr1 = this.layoutData
      arr1.unshift(midData)
      this.layoutData = arr1

      this.nowIndex = Number(this.nowIndex) + 1

      this.refreshLayout(item)
    },
    // 生成二维数组地图
    genereatePlaneArr (data) {
      var map = []
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var one = data[i]
          // 循环行
          for (var r = one.y; r < (one.y + one.h); r++) {
            // 循环列
            for (var c = one.x; c < (one.x + one.w); c++) {
              if (!map[r]) { // 检修当前行是否存在
                map[r] = new Array(this.layoutColNum)

                for (let i = 0; i < this.layoutColNum; i++) {
                  map[r][i] = 0
                }
              }
              // 占据为1
              map[r][c] = 1
            }
          }
        }
      }
      return map
    },
    // 区域检测 x,y 二维数据地图起始坐标点  w,h 检测区域宽高
    regionalTest (x, y, w, h) {
      // 定义返回 x,y 偏移 及 是否有空位置
      let offsetX = 0; let offsetY = 0; let res = true
      // 按区域循环检测 二维数组地图
      for (let r = 0; r <= h; r++) {
        for (let c = 0; c <= w; c++) {
          let point = this.layoutMap[y + c] ? this.layoutMap[y + c][x + r] : 0
          if (point === 1) { // 如该点被占据 记录偏移值
            res = false
            offsetX = offsetX > (x + r) ? offsetX : x + r
            offsetY = offsetY > (y + c) ? offsetY : y + c
          }
        }
      }

      return {
        result: res,
        offsetX: offsetX,
        x: x,
        y: y
      }
    },
    refreshLayout (item) {
      let itemWidth = 0
      let itemHeight = 0
      if (!item.width) {
        itemWidth = item.type === 'table' ? 50 : 50
      } else {
        itemWidth = item.width
      }
      if (!item.height) {
        itemHeight = 3
      } else {
        itemHeight = item.width
      }

      // 更新二维数组地图
      for (let itemR = 0; itemR < itemHeight; itemR++) {
        for (let itemC = 0; itemC < itemWidth; itemC++) {
          // 如果没有该行，初始化
          if (!this.layoutMap[item.y + itemR]) {
            this.layoutMap[item.y + itemR] = new Array(this.layoutColNum)
            for (let i = 0; i < this.layoutColNum; i++) {
              this.layoutMap[item.y + itemR][i] = 0
            }
          }
          // 标记点
          this.layoutMap[item.y + itemR][item.x + itemC] = 1
        }
      }
    },
    // 当插件加载完成后  获取现在的二维地图树
    layoutReadyEvent (newLayout) {
      this.layoutMap = this.genereatePlaneArr(this.layoutData)
    },
    // 当插件内容布局发生变化后  获取现在的二维地图树
    layoutUpdatedEvent (newLayout) {
      this.layoutMap = this.genereatePlaneArr(this.layoutData)
    }
  }
}
