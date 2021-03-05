import numerify from 'numerify'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dataDefault: [],
      layoutColNum: 100,
      // 布局位置数据
      layoutMap: [],
      // 布局数据
      layoutData: [],
      layoutHeight: 100, // 默认高度
      currentType: '页面设计',
      currentItem: {},
      nowIndex: 0,
      currentThemeCode: '',
      currentThemeName: '',
      dialogVisible: true // 是否可拖拽或改变大小c
    }
  },
  computed: {
    ...mapGetters('sso', [
      'dataBaseDefault'
    ])
  },
  mounted () {
    this.dataDefault = this.dataBaseDefault
  },
  watch: {
    dataBaseDefault (newVal) {
      console.log(newVal)
      this.dataDefault = newVal
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          if (this.currentItem.source) {
            this.$set(item, 'source', this.dataDefault)
          } else {
            const chart = {
              rows: this.dataDefault
            }
            this.$set(item, 'chartData', chart)
          }
        }
      })
    }
  },
  methods: {
    resizedEvent (item) { // 改变宽高
      const id = item.i
      if (this.currentItem.chart !== 'table') {
        setTimeout(() => {
          this.$refs[`chart${id}`][0].resizedEvent(item.i)
        }, 200)
      }
      // this.$refs[`chart${id}`][0].resizedEvent()
    },
    movedEvent (i, newX, newY) {
      console.log('MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    addElement (item) { // 添加
      this.chooseTheme()
      this.layoutData.map((it) => {
        this.$set(it, 'active', false)
      })
      let width = item.type === 'table' ? 100 : 50
      let itemH = 3
      let addEle = {}
      if (item.type !== 'table') {
        const extend1 = { // 折线图柱图
          legend: {
            show: true,
            bottom: 0,
            left: 'center',
            orient: 'horizontal'
          },
          xAxis: {
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              color: '#d9d9d9'
            }
          },
          'yAxis.0': {
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              color: '#d9d9d9'
            }
          },
          series: {
            label: {
              show: false
            }
          }
        }
        const extend2 = { // 横图
          legend: {
            show: true,
            bottom: 0,
            left: 'center',
            orient: 'horizontal'
          },
          'xAxis.0': {
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              color: '#d9d9d9'
            }
          },
          yAxis: {
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              color: '#d9d9d9'
            }
          },
          series: {
            label: {
              show: false
            }
          }
        }
        const extend3 = { // 饼图
          legend: {
            show: true,
            bottom: 0,
            left: 'center',
            orient: 'horizontal'
          },
          series: {
            label: {
              show: true,
              formatter: '{a}\n{b}: {c}'
            },
            smooth: false,
            center: ['50%', '50%'],
            radius: ['0', '80']
          }
        }
        const extend4 = { // 漏斗图
          legend: {
            show: true,
            bottom: 0,
            left: 'center',
            orient: 'horizontal'
          },
          series: {
            label: {
              show: true,
              formatter: '{a}\n{b}: {c}'
            },
            top: '20',
            right: '20',
            bottom: '20',
            left: '20'
          }
        }
        let extend = {}

        if (item.chart === 'pie_chart') {
          extend = extend3
        } else if (item.chart === 'bar_chart') {
          extend = extend2
        } else if (item.chart === 'funnel') {
          extend = extend4
        } else {
          extend = extend1
        }

        const showL = item.cName === '折线图' ? ['指标'] : []
        addEle = {
          'i': this.nowIndex,
          'w': width,
          'h': itemH,
          active: true,
          components: item.comment,
          cName: item.cName,
          chart: item.chart,
          dataEmpty: true,
          weidu: [],
          zhibiao: [],
          guolv: [],
          chartExtend: extend, // 图例配置
          chartSettings: {
            type: item.comment,
            showLine: showL,
            dimension: ['维度'],
            metrics: ['指标'],
            xAxisName: [''],
            yAxisName: [''],
            labelMap: {},
            roseType: '',
            useDefaultOrder: true,
            limitShowNum: item.chart === 'pie_chart' ? 10 : 500
          },
          chartData: {
            rows: this.dataDefault
          },
          chartType: item.type,
          grid: {
            top: 40,
            left: 40,
            right: 40,
            bottom: 40
          }, // 图位置配置
          legend1: 'bottom',
          legend2: 'center',
          size: item.chart === 'pie_chart' ? 10 : 500,
          title: '',
          chartPie: '',
          radiusInner: '0',
          radiusOut: '80',
          chartSeriesCenterLeft: '50',
          chartSeriesCenterTop: '50',
          themeCode: this.currentThemeCode,
          themeName: this.currentThemeName
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
          source: this.dataDefault,
          title: '',
          chart: item.chart,
          chartType: item.type,
          rows: [], // 数据
          themeCode: this.currentThemeCode,
          themeName: this.currentThemeName
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
      if (item.chart === 'pie_chart') {
        this.chartSeriesCenterLeft = addItem.chartExtend.series.center[0].replace(/%/, '')
        this.chartSeriesCenterTop = addItem.chartExtend.series.center[1].replace(/%/, '')
      }
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
        this.currentType = item.chartType
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
          if (currentZ[`${type}`].length === 0 && type !== 'columns') { // 数据拖拽类数组皆为空或者类为列
            res = data.map(ele => {
              var change = {}
              if (ele.children) {
                const { children, ...other } = ele
                change = { ...other }
              } else {
                change = { ...ele }
              }
              change.type = lay.components
              return {
                ...change
              }
            })
          } else {
            const ids = currentZ[`${type}`].map(els => els.id)

            res = data.map(ele => {
              let yu = {}
              if (ids && ids.indexOf(ele.id) >= 0) { // 已经有的不替换
                const yt = currentZ[`${type}`].filter(elss => elss.id === ele.id)
                yu = { ...yt[0] }
              } else { // 没有的添加
                var change = {}
                if (ele.children) {
                  const { children, ...other } = ele
                  change = { ...other }
                } else {
                  change = { ...ele }
                }
                change.type = lay.components
                yu = {
                  ...change
                }
              }
              return {
                ...yu
              }
            })
          }

          this.$set(lay, type, res)

          if (type === 'weidu') { // 替换维度
            const { dimension, ...oter } = lay.chartSettings
            let obj = {}
            if (lay.weidu.length === 0) {
              if (data.length === 0) {
                obj = {
                  dimension: ['维度'],
                  metrics: ['指标'],
                  ...oter
                }
              } else {
                const resW = Array(data[0].dataIndex)
                obj = {
                  dimension: resW,
                  metrics: ['指标'],
                  ...oter
                }
              }
            } else {
              if (data.length === 0) {
                obj = {
                  dimension: ['维度'],
                  ...oter
                }
                // if (lay.chart === 'pie') {
                //   obj = {
                //     dimension: ['维度'],
                //     ...oter
                //   }
                // } else {
                //   obj = {
                //     dimension: ['上架日期'],
                //     ...oter
                //   }
                // }
              } else {
                const resW = Array(data[0].dataIndex)
                obj = {
                  dimension: resW,
                  ...oter
                }
              }
            }
            this.$set(lay, 'chartSettings', obj)
          } else if (type === 'zhibiao') { // 替换指标
            if (lay.chart === 'pie_chart' || lay.chart === 'funnel') {
              const extend = { ...lay.chartExtend }
              extend.series.name = data.length === 0 ? '维度' : data[0].title
              extend.tooltip = {
                show: true,
                formatter: '{a}<br />{b}: {c}'
                // formatter: (param) => {
                //   const ser = lay.zhibiao.length === 0 ? '维度' : lay.zhibiao[0].title
                //   return `${ser}<br />${param.name}: ${param.value}`
                // }
              }
              this.$set(lay, 'chartExtend', extend)
            }
            const { metrics, showLine, ...oter } = lay.chartSettings

            var resW = []
            var showLi = []
            if (data.length === 0) { // 只有默认一个指标（指标）
              resW = ['指标']
              showLi = lay.components === 'line' ? ['指标'] : []
            } else {
              resW = data.map(re => re.dataIndex)
              lay.zhibiao.map(dt => {
                if (dt.type === 'line') {
                  showLi.push(dt.dataIndex)
                }
              })
            }
            const obj = {
              metrics: resW,
              showLine: showLi,
              ...oter
            }
            this.$set(lay, 'chartSettings', obj)
          }
          this.currentItem = lay
        }
      })
      console.log(this.layoutData)
    },
    modifyItemCol (data) { // 编辑列属性
      this.layoutData.map(item => {
        if (this.currentItem.i === item.i) {
          if (data.name === 'size') { // 显示条数
            const setting = { ...item.chartSettings }
            setting.limitShowNum = data.res
            this.$set(item, 'size', data.res)
            this.$set(item, 'chartSettings', setting)
          } else {
            const res = item[`${data.type}`].map(ele => {
              const _res = data.res

              if (ele.id === _res.id) {
                if (data.name === 'sort') { // 排序更改
                  const { sortType, ...others } = ele
                  return {
                    sortType: _res.sortType,
                    ...others
                  }
                } else { // 其他配置更改
                  if (data.name === 'format') {
                    this.changeFormat(item, data.res)
                  }
                  console.log(ele)
                  if (ele.chartSymbol !== undefined) {
                    const { type, chartWidth, width, align, area, smooth, chartSymbol, symbolSize, order, sortName, chartLabel, labelFormat, labelPosition, title, ...others } = ele
                    return {
                      type: _res.type,
                      title: _res.title,
                      chartWidth: _res.chartWidth,
                      align: _res.align,
                      order: _res.order,
                      labelPosition: _res.labelPosition,
                      labelFormat: _res.labelFormat,
                      symbolSize: _res.symbolSize,
                      width: Number(_res.width),
                      area: _res.area,
                      smooth: _res.smooth,
                      sortName: _res.sortName,
                      chartSymbol: _res.chartSymbol,
                      chartLabel: _res.chartLabel,
                      ...others
                    }
                  } else {
                    console.log('999999')
                    console.log(ele)
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
            // 先把对应维度指标过滤改了方便数据回写
            this.$set(item, data.type, res)
            // 开始正式更改图表样式配置
            if (data.type === 'zhibiao') {
              if (data.rights === 'extend') { // extand统一修改方法
                this.changeChartExtend(item, data)
              } else if (data.rights === 'settings') { // chartsetting统一修改方法
                this.changeChartSettings(item, data)
              }
            }
          }
          this.currentItem = item
        }
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
        if (item.chart === 'pie_chart' || item.chart === 'funnel') {
          const extend = { ...item.chartExtend }
          extend.series.name = item.zhibiao[0].title
          this.$set(item, 'chartExtend', extend)
        }
      } else if (data.name === 'type') {
        const ar = []
        item.zhibiao.map(ele => {
          if (ele.type === 'line') {
            ar.push(ele.dataIndex)
          }
        })
        result.showLine = ar
      }
      this.$set(item, 'chartSettings', result)
    },
    changeChartExtend (item, data) {
      if (data.attrName && data.attrName === 'series') {
        const { series, ...other } = item.chartExtend
        let extend = {}
        if (item.chart === 'pie_chart' || item.chart === 'funnel') {
          extend = { ...item.chartExtend }
          extend.series.label.show = data.res.chartLabel
        } else {
          const serFuc = function (options) {
            const resul = options.map((ops, index) => {
              const op = { ...ops }
              if (ops.type === 'bar') {
                op.label = {
                  show: item.zhibiao[index].chartLabel,
                  position: item.zhibiao[index].labelPosition,
                  formatter (options) {
                    return numerify(options.data, item.zhibiao[index].labelFormat)
                  }
                }
              } else if (ops.type === 'line') {
                op.label = {
                  show: item.zhibiao[index].chartLabel,
                  position: item.zhibiao[index].labelPosition,
                  offset: [0, -15],
                  formatter (options) {
                    return numerify(options.data, item.zhibiao[index].labelFormat)
                  }
                }
              }
              op.lineStyle = {
                width: item.zhibiao[index].chartWidth
              }
              if (item.zhibiao[index].chartSymbol !== '') {
                op.symbol = item.zhibiao[index].chartSymbol
              }
              op.symbolSize = item.zhibiao[index].symbolSize
              op.smooth = item.zhibiao[index].smooth
              op.order = item.zhibiao[index].order
              op.name = item.zhibiao[index].title
              if (item.zhibiao[index].area) {
                op.areaStyle = {
                  opacity: 0.1
                }
              } else {
                op.areaStyle = {
                  opacity: 0
                }
              }

              return {
                ...op
              }
            })
            return resul
          }
          extend = {
            series: serFuc,
            ...other
          }
        }
        this.$set(item, 'chartExtend', extend)
      }
    },
    changeFormat (item, data) {
      var result = []
      if (data.dataIndex === '上架日期') {
        result = this.dealDateFormat(item, data)
      } else if (data.dataIndex === '月') {
        result = this.dealMonthFormat(item, data)
      } else if (data.type === 'zb') {
        result = this.dealValueFormat(item, data)
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
      result = res.map(ele => {
        return numerify(ele[`${data.dataIndex}`], data.format)
      })
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
