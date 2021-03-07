import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/user/Login.vue'
import home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path:'/login',
      component:login,
    },
    { path:'/home',
      component:home,
    },
  ]
})
