export default {
  data () {
    return {
      currentItem: {},
      destroyInactivePanel: false,
      styleCollapse: ['0', '1', '2', '3', '4', '5'], // 打开的样式折叠面板

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
    changeType (type) {
      console.log(type)
      this.currentItem.chartPie = type
      let pietype = ''
      if (type === 'funnel') {
        this.currentItem.chartSettings.type = type
        pietype = 'funnel'
      } else {
        this.currentItem.chartSettings.type = 'pie'
        pietype = 'pie'
        this.currentItem.chartSettings.roseType = type
      }

      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          this.$set(item, 'chartPie', type)
          this.$set(item, 'chart', pietype)
          this.$set(item, 'chartSettings', this.currentItem.chartSettings)
        }
      })
    },
    changeExtend (type, name) { // 切换图例
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          let td = {}
          if (type === '1') { // 方位切换自动将水平方向居中
            this.currentItem.legend1 = name
            this.currentItem.legend2 = 'center'
            if (name === 'top' || name === 'bottom') {
              td = {
                [`${name}`]: 0,
                left: 'center',
                orient: 'horizontal'
              }
            } else {
              td = {
                [`${name}`]: 0,
                top: 'center',
                orient: 'vertical'
              }
            }
          } else { // 水平位置切换
            this.currentItem.legend2 = name
            const base = this.currentItem.legend1
            if (base === 'top' || base === 'bottom') { // 方位在上下对水平方向的判断
              if (name === 'center') {
                td = {
                  [`${base}`]: 0,
                  left: 'center',
                  orient: 'horizontal'
                }
              } else {
                td = {
                  [`${name}`]: 0,
                  [`${base}`]: 0,
                  orient: 'horizontal'
                }
              }
            } else { // 方位在左右对水平方向的判断
              if (name === 'left') {
                td = {
                  [`${base}`]: 0,
                  top: 0,
                  orient: 'horizontal'
                }
              } else if (name === 'center') {
                td = {
                  [`${base}`]: 0,
                  top: 'center',
                  orient: 'vertical'
                }
              } else {
                td = {
                  [`${base}`]: 0,
                  bottom: 0,
                  orient: 'horizontal'
                }
              }
            }
          }
          this.currentItem.chartExtend.legend = td
        }
      })
      console.log(this.layoutData)
    },
    changeTableCheck (type) {
    },
    changeBasic (setName, type) { // v-chart样式的配置
      this.layoutData.map(item => {
        if (item.i === this.currentItem.i) {
          const elem = { ...this.currentItem }
          const sets = elem[`${setName}`]
          this.$set(item, `${setName}`, sets)

          const set = { ...item.chartExtend }

          if (setName === 'pieCenter') {
            console.log('9999999999999')
            const top = item.chartSeriesCenterTop === '' ? ['0'] : [`${item.chartSeriesCenterTop}%`]
            const left = item.chartSeriesCenterLeft === '' ? ['0'] : [`${item.chartSeriesCenterLeft}%`]
            let center = [...top, ...left]
            console.log(center)
            item.chartExtend.series.center = center
            set.series.center = center
          } else if (setName === 'radius') {
            let radius = [...Array(item.radiusInner), ...Array(item.radiusOut)]
            item.chartExtend.series.radius = radius
            set.series.radius = radius
          }

          this.$set(item, 'chartExtend', set)
          this.$refs[`chart${item.i}`][0].resizedEvent()
        }
      })
    }
  }
}
