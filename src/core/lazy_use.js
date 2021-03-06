import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/default.config'
import { VueAxios } from '@/utils/request'

// base library
import '@/core/lazy_lib/components_use'

// ext library

Vue.use(VueStorage, config.storageOptions)
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] NOTICE: Antd use lazy-load.')
