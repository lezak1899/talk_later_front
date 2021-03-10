import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/user/Login.vue'
import home from '../components/Home.vue'

import welcome from '../components/sys/Welcome'
import userMange from '../components/user/UserMange'
import operatorMange from '../components/user/OperatorMange'
import adminMange from '../components/user/AdminMange'


Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/' ,
    redirect:'/login'
    },
    { path:'/login',
      component:login,
    },
    { path:'/home',
      component:home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:welcome},
        {path:'/userMange',component:userMange},
        {path:'/operatorMange',component:operatorMange},
        {path:'/adminMange',component:adminMange},

        ]
    },
  ],

})


router.beforeEach((to,from,next)=>{
    if(to.path==='/login') {
      next();
      return;
    }

    const currentUser = sessionStorage.getItem("currentUser");
    if(currentUser==null){
      console.log(currentUser);
      console.log("未登录");
      next("/login");
    }

    next();
})

export default router;
