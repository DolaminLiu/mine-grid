export default {
  data () {
    return {
      currentItem: {},
      destroyInactivePanel: false,
      styleCollapse: ['1', '2', '3', '4', '5'], // 打开的样式折叠面板
      chartSeriesCenterLeft: '',
      chartSeriesCenterTop: '',

      chartPosition: [
        { name: '左边距', eName: 'left' },
        { name: '右边距', eName: 'right' },
        { name: '上边距', eName: 'top' },
        { name: '下边距', eName: 'bottom' }
      ],
      legends1: [
        { name: 'top', icon: 'border-top' },
        { name: 'right', icon: 'border-right' },
        { name: 'bottom', icon: 'border-bottom' },
        { name: 'left', icon: 'border-left' }
      ],
      legends2: [
        { name: 'left', icon: 'pic-left' },
        { name: 'center', icon: 'pic-center' },
        { name: 'right', icon: 'pic-right' }
      ],
      disabledLegend: false
    }
  },
  methods: {
    onChangeSwitch (checked) { // 图表图例的开关
      this.styleCollapse = ['1', '3', '4', '5']
      this.destroyInactivePanel = !checked
      this.disabledLegend = !checked
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          const { legend, ...others } = this.currentItem.chartExtend
          const td = { ...legend }
          td.show = checked
          const res = {
            legend: td,
            ...others
          }
          this.$set(item, 'chartExtend', res)
        }
      })
    },
    changeLegend (type, name) { // 切换图例
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          const { series } = this.currentItem.chartExtend
          if (type === '1') { // 方位切换自动将水平方向居中
            this.currentItem.legend1 = name
            this.currentItem.legend2 = 'center'
            let td = {}
            if (name === 'top' || name === 'bottom') {
              td = {
                legend: {
                  [`${name}`]: 0,
                  left: 'center',
                  orient: 'horizontal'
                },
                series
              }
            } else {
              td = {
                legend: {
                  [`${name}`]: 0,
                  top: 'center',
                  orient: 'vertical'
                },
                series
              }
            }
            this.$set(item, 'chartExtend', td)
          } else { // 水平位置切换
            this.currentItem.legend2 = name
            const base = this.currentItem.legend1
            let td = {}
            if (base === 'top' || base === 'bottom') { // 方位在上下对水平方向的判断
              if (name === 'center') {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    left: 'center',
                    orient: 'horizontal'
                  },
                  series
                }
              } else {
                td = {
                  legend: {
                    [`${name}`]: 0,
                    [`${base}`]: 0,
                    orient: 'horizontal'
                  },
                  series
                }
              }
            } else { // 方位在左右对水平方向的判断
              if (name === 'left') {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    top: 0,
                    orient: 'horizontal'
                  },
                  series
                }
              } else if (name === 'center') {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    top: 'center',
                    orient: 'vertical'
                  },
                  series
                }
              } else {
                td = {
                  legend: {
                    [`${base}`]: 0,
                    bottom: 0,
                    orient: 'horizontal'
                  },
                  series
                }
              }
            }
            this.$set(item, 'chartExtend', td)
          }
        }
      })
    },
    changeTableCheck (type) {
    },
    changeBasic (setName, type) { // v-chart样式的配置
      if (setName === 'pieCenter') {
        this.layoutData.map(item => {
          const { legend, series } = item.chartExtend
          if (item.i === this.currentItem.i) {
            let ser = {}
            if (type === 0) { // 左边偏移
              const left = [`${this.chartSeriesCenterLeft}%`]
              const top = [`${series.center[1]}`]
              const mid = [...left, ...top]
              ser = {
                series: {
                  center: mid
                },
                legend
              }
            } else { // 顶部偏移
              const left = [`${series.center[0]}`]
              const top = [`${this.chartSeriesCenterTop}%`]
              const mid = [...left, ...top]
              ser = {
                series: {
                  center: mid
                },
                legend
              }
            }

            this.$set(item, 'chartExtend', ser)
          }
        })
      } else {
        this.layoutData.map(item => {
          if (item.i === this.currentItem.i) {
            const elem = { ...this.currentItem }
            const sets = elem[`${setName}`]
            this.$set(item, `${setName}`, sets)
          }
        })
      }
    }
  }
}
