// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import { MessageBox } from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
import './third/default.css'
import global from  './third/global.js'

axios.defaults.baseURL = 'http://localhost:8888/'
// axios.defaults.baseURL = 'http://47.105.187.153:92/'
//拦截器 每次请求之前获取本地的token
axios.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (window.sessionStorage.token) {
      config.headers['x-auth-token'] = window.sessionStorage.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
//处理异常请求
axios.interceptors.response.use(
  response => {
    //存在token 就刷新
    if(response.headers['x-auth-token']){
      window.sessionStorage.setItem("token", response.headers['x-auth-token'])
    }
    switch(response.data.code){
      case '-1':
        MessageBox.alert(response.data.message, "提示", {
          confirmButtonText: "跳转登录页面",
          callback: action => {
            // 跳转登录页
            window.location.href = "/"
          }
        })
        break
      case '-2':
        MessageBox.alert('运行时发生异常!', "提示", {
          confirmButtonText: "确定",
          callback: action => {
            router.push({name:'/err',params:{msg:'请联系管理员'}})
          }
        })
        break
      case '-3':
        MessageBox.alert('发生异常!', "提示", {
          confirmButtonText: "确定",
          callback: action => {
            router.push({name:'/err',params:{msg:'请联系管理员'}})
          }
        })
        break
    }
    return response
  },
  err => {
    MessageBox.alert('连接服务器失败!', "错误", {
      confirmButtonText: "确定",
      callback: action => {
        router.push({name:'/err',params:{msg:'请联系管理员'}})
      }
    })
    return Promise.reject(err)
  }
)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.prototype.$global=global
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//路由守卫
router.beforeEach(function(to,form,next){
  if(window.sessionStorage.token){
    next()
  }else{
    if (to.path === '/' || to.path === '/err' ) {
      next()
    } else {
      next({ name:'/err',params:{msg:'登录状态已失效'} })
    }
  }
})
