import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/home/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome'
import User from '@/components/user/User'
import Role from '@/components/role/Role'
import Dept from '@/components/dept/Dept'
import SysLog from '@/components/log/SysLog'
import LoginLog from '@/components/log/LoginLog'
import Error from '@/components/error/Error'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children:[
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/user',
          component: User
        },
        {
          path: '/role',
          component: Role
        },
        {
          path: '/dept',
          component: Dept
        },
        {
          path: '/sysLog',
          component: SysLog
        },
        {
          path: '/loginLog',
          component: LoginLog
        },
      ]
    },
    {
      path: '/err',
      name: '/err',
      component: Error
    },{
      path: '*',
      redirect: {name:'/err',params:{msg:'您访问的路径不存在'}}
    }
  ]
})
