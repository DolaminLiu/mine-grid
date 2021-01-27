import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/default.config'
import { VueAxios } from '@/utils/request'

// base library
import Antd from 'ant-design-vue/es'
import 'ant-design-vue/dist/antd.less'

// ext library

Vue.use(Antd)
Vue.use(VueStorage, config.storageOptions)
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] WARNING: Antd now use fulled imported.')
