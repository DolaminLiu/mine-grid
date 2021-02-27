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
    resizedEvent (i, newH, newW, newHPx, newWPx) { // 改变宽高
      const id = this.currentItem.i
      this.$refs[`chart${id}`][0].resizedEvent()
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
        const ser1 = {
          center: ['50%', '50%']
        }
        const ser2 = []
        const serise = item.chart === 'pie' ? ser1 : ser2
        addEle = {
          'i': this.nowIndex,
          'w': width,
          'h': itemH,
          active: true,
          components: item.comment,
          cName: item.cName,
          chart: item.chart,
          weidu: [],
          zhibiao: [],
          guolv: [],
          chartExtend: {
            legend: {
              show: true,
              bottom: 0,
              left: 'center',
              orient: 'horizontal'
            },
            xAxis: {
              nameLocation: 'end',
              nameTextStyle: {
                color: '#d9d9d9'
              }
            },
            yAxis: {
              nameLocation: 'end',
              nameTextStyle: {
                color: '#d9d9d9'
              }
            },
            series: serise
          }, // 图例配置
          chartSettings: {
            type: item.chart,
            radius: 80,
            dimension: ['日期'],
            metrics: ['指标'],
            xAxisName: [''],
            yAxisName: [''],
            labelMap: {}
          },
          chartData: {
            rows: dataBaseDefault
          },
          grid: {
            top: 40,
            left: 40,
            right: 40,
            bottom: 40
          }, // 图位置配置
          legend1: 'bottom',
          legend2: 'center',
          size: 500,
          title: ''
        }
      } else {
        addEle = {
          'i': this.nowIndex,
          'w': width,
          'h': itemH,
          active: true,
          bordered: false, // 是否有边线
          components: item.comment,
          cName: item.cName,
          columns: [], // 表头名称
          guolv: [],
          pageSize: 10,
          source: dataBaseDefault,
          title: '',
          type: item.type,
          rows: [] // 数据
        }
      }

      var addItem = {
        'x': 0,
        'y': this.layoutMap.length,
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
      console.log(item.comment)
      if (item.comment === 'pie') {
        console.log(addItem.chartExtend.series)
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
              // 检修当前行是否存在
              if (!map[r]) {
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
      for (let r = 0; r < w; r++) {
        for (let c = 0; c <= h; c++) {
          let point = this.layoutMap[y + c] ? this.layoutMap[y + c][x + r] : 0
          // 如该点被占据 记录偏移值
          if (point === 1) {
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
    },
    changeFilter (source) { // 选择表格列
      const { type, data } = source

      this.layoutData.map(lay => {
        if (this.currentItem.i === lay.i) {
          const currentZ = { ...lay }
          let res = []
          if (currentZ[`${type}`].length === 0 || type === 'columns') { // 数据拖拽类数组皆为空或者类为列
            res = data.map(ele => {
              if (ele.children) {
                const { children, ...other } = ele
                return {
                  ...other
                }
              } else {
                return {
                  ...ele
                }
              }
            })
          } else {
            const ids = currentZ[`${type}`].map(els => els.id)

            res = data.map(ele => {
              let yu = {}
              if (ids.indexOf(ele.id) >= 0) { // 已经有的不替换
                const yt = currentZ[`${type}`].filter(elss => elss.id === ele.id)
                yu = { ...yt[0] }
              } else { // 没有的添加
                if (ele.children) {
                  const { children, ...other } = ele
                  yu = {
                    ...other
                  }
                } else {
                  yu = {
                    ...ele
                  }
                }
              }
              return {
                ...yu
              }
            })
          }
          this.$set(lay, type, res)

          if (type === 'weidu' && lay.weidu.length !== 0) { // 替换维度
            const { dimension, ...oter } = lay.chartSettings
            const resW = Array(data[0].dataIndex)
            const obj = {
              dimension: resW,
              ...oter
            }
            this.$set(lay, 'chartSettings', obj)
          } else if (type === 'zhibiao') { // 替换指标
            const { metrics, ...oter } = lay.chartSettings
            const { series, ...ot } = lay.chartExtend
            var resW = []
            var ser = []
            if (data.length === 0) { // 只有默认一个指标（指标）
              resW = ['指标']
              ser = Array({ type: lay.chart })
            } else {
              resW = data.map(re => re.dataIndex)
              ser = data.map(dt => {
                return {
                  type: dt.type,
                  myName: dt.dataIndex
                }
              })
            }
            const obj = {
              metrics: resW,
              ...oter
            }
            const seri = {
              series: ser,
              ...ot
            }
            this.$set(lay, 'chartSettings', obj)
            this.$set(lay, 'chartExtend', seri)
          }
        }
      })
      console.log(this.layoutData)
    },
    modifyItemCol (data) { // 编辑列属性
      this.layoutData.map(item => {
        if (this.currentItem.i === item.i) {
          const res = item[`${data.type}`].map(ele => {
            const _res = data.res

            if (ele.id === _res.id) {
              if (data.name === 'sort') { // 排序更改
                const { sorter, sortName, symbol, ...others } = ele
                return {
                  sorter: _res.sortName !== '0',
                  sortName: _res.sortName,
                  symbol: _res.symbol,
                  ...others
                }
              } else { // 其他配置更改
                if (data.name === 'format') {
                  this.changeFormat(item, data.res)
                }
                if (ele.chartLabel) {
                  const { type, chartWidth, width, area, smooth, chartSymbol, sortName, chartLabel, title, ...others } = ele
                  return {
                    type: _res.type,
                    title: _res.title,
                    chartWidth: _res.chartWidth,
                    width: Number(_res.width),
                    area: _res.area,
                    smooth: _res.smooth,
                    sortName: _res.sortName,
                    chartSymbol: _res.chartSymbol,
                    chartLabel: _res.chartLabel,
                    ...others
                  }
                } else {
                  const { align, format, width, symbol, title, ...others } = ele
                  return {
                    align: _res.align,
                    title: _res.title,
                    format: _res.format,
                    width: Number(_res.width),
                    symbol: _res.symbol,
                    ...others
                  }
                }
              }
            } else {
              return {
                ...ele
              }
            }
          })
          this.$set(item, data.type, res)
          // if (data.name === 'labelMap') {
          //   this.changeChartSettings(item)
          // }
          if (data.type === 'zhibiao') {
            if (data.rights === 'extend') {
              this.changeChartExtend(item, data)
            } else if (data.rights === 'settings') {
              this.changeChartSettings(item, data)
            }
          }
        }
        console.log(this.layoutData)
      })
    },
    changeChartSettings (item, data) {
      const result = { ...item.chartSettings }
      // const { name, ...others } = item.chartSettings
      const objs = {}

      if (data.name === 'labelMap') {
        item.zhibiao.map(ele => {
          const obj = {
            [`${ele.dataIndex}`]: ele.title
          }
          Object.assign(objs, obj)
        })
        result.labelMap = objs
      } else if (data.name === 'type') {
        const ar = []
        item.zhibiao.map((ele, index) => {
          let au = ''
          if (ele.dataIndex === data.res.dataIndex) {
            au = data.res.type
          } else {
            au = ele.type
          }
          ar.push(au)
        })
        result.type = ar
      }
      console.log(result)
      this.$set(item, 'chartSettings', result)
    },
    changeChartExtend (item, data) {
      const result = { ...item.chartExtend }
      const serArr = result.series

      const arr = serArr.map(ser => {
        if (ser.myName === data.res.dataIndex) {
          const serEle = { ...ser }
          serEle[`${data.name}`] = data.res[`${data.name}`]
          return {
            ...serEle
          }
        } else {
          return {
            ...ser
          }
        }
      })
      result.series = arr
      this.$set(item, 'chartExtend', result)
      this.resizedEvent()
    },
    changeFormat (item, data) {
      var result = []
      if (data.dataIndex === '日期') {
        result = this.dealDateFormat(item, data)
      } else if (data.dataIndex === '月') {
        result = this.dealMonthFormat(item, data)
      } else if (data.symbol === '数量') {
        result = this.dealValueFormat(item, data)
      } else if (data.symbol === '数值') {
        result = this.dealNumberFormat(item, data)
      }
      this.$set(item, 'source', result)
    },
    dealDateFormat (item, data) { // 处理完整日期格式
      const res = item.source
      var result = []
      if (data.format === '1') {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = ele[`${data.dataIndex}`].replace(/[^0-9]/ig, '-')
          midEle[`${data.dataIndex}`] = val.substring(0, val.length - 1)
          return {
            ...midEle
          }
        })
      } else {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = ele[`${data.dataIndex}`].replace(/-/, '年')
          const val2 = val.replace(/-/, '月')
          midEle[`${data.dataIndex}`] = `${val2}日`
          return {
            ...midEle
          }
        })
      }
      return result
    },
    dealMonthFormat (item, data) { // 处理月份格式
      const res = item.source
      var result = []
      if (data.format === '1') {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = `${ele[`年`]}${ele[`月份`]}`
          midEle[`${data.dataIndex}`] = val
          return {
            ...midEle
          }
        })
      } else if (data.format === '2') {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = `${ele[`年`]}-${ele[`月份`]}`
          midEle[`${data.dataIndex}`] = val
          return {
            ...midEle
          }
        })
      } else if (data.format === '3') {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = `${ele[`年`]}年${ele[`月份`]}月`
          midEle[`${data.dataIndex}`] = val
          return {
            ...midEle
          }
        })
      } else {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = `${ele[`月份`]}月`
          midEle[`${data.dataIndex}`] = val
          return {
            ...midEle
          }
        })
      }
      return result
    },
    dealValueFormat (item, data) { // 处理整型
      const res = item.source
      var result = []
      if (data.format === '1') { // 不带千分号
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = ele[`${data.dataIndex}`].replace(/,/g, '')
          midEle[`${data.dataIndex}`] = val
          return {
            ...midEle
          }
        })
      } else if (data.format === '2') {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = Number(ele[`${data.dataIndex}`])
          if (val.length >= 2) {
            midEle[`${data.dataIndex}`] = val
          } else {
            midEle[`${data.dataIndex}`] = val.toLocaleString()
          }
          return {
            ...midEle
          }
        })
      }
      return result
    },
    dealNumberFormat (item, data) { // 处理数值
      const res = item.source
      var result = []
      if (data.format === '1') { // 不带千分号
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = ele[`${data.dataIndex}`].replace(/,/g, '')
          midEle[`${data.dataIndex}`] = val
          return {
            ...midEle
          }
        })
      } else if (data.format === '2') {
        result = res.map(ele => {
          const midEle = { ...ele }
          const val = Number(ele[`${data.dataIndex}`])
          if (val.length >= 2) {
            midEle[`${data.dataIndex}`] = val
          } else {
            midEle[`${data.dataIndex}`] = val.toLocaleString()
          }
          return {
            ...midEle
          }
        })
      }
      return result
    }
  }
}
