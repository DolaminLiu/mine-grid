// with polyfills
import Vue from 'vue'
import App from './App'
import VCharts from 'v-charts'
import router from './router'
import store from './store/'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

Vue.config.productionTip = false
Vue.use(Antd)
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

Vue.use(VCharts)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
