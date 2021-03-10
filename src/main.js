// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import  VueRouter from 'vue-router'
import App from './App'
import router from './router'
import axios from 'axios'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/bootstrap.min.css'
import'./assets/css/global.css'
Vue.use(elementui)
Vue.use(VueRouter)
Vue.prototype.$axios=axios //给vue定义一个全局的变量axios
axios.defaults.baseURL="http://localhost:8088"

import moment from 'moment'
Vue.prototype.$moment=moment


// 基于jwt实现验证
// axios.interceptors.request.use(config=>{
//   console.log(config);
//   config.headers.Authorization = sessionStorage.getItem("token");
//   return config;
// })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
