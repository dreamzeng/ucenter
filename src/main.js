// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from 'store'
import {SET_USER_DATA} from 'store'

import 'static/assets/font-awesome/css/font-awesome.css';
import {Ajax} from 'lib/Ajax'
let md5 = require('lib/md5')

require('static/css/style.css')
// require('../src/assets/less/base.less')
//IE9版本单独加载样式
if(navigator.userAgent.indexOf('MSIE 9.0')<0){
  require('static/css/iview.css');
}

var jQuery = require('jquery')
top.jQuery = jQuery


import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式

const {UCenterPlugins} = require('./plugins/index')
Vue.use(UCenterPlugins)

import iView from 'iview';
import { Modal, Message } from 'iview';
Vue.use(iView)

Vue.config.productionTip = false

import {logout} from '@/lib/utils'
top.logout = logout

//登录态处理
router.beforeEach(({meta, path,fullPath}, from, next) => {
  NProgress.start(); // 开启Progress
  let userInfo = sessionStorage.getItem('userInfo') == 'undefined' ? '{}' : sessionStorage.getItem('userInfo')
  let userData = JSON.parse(userInfo)
  if(userData && userData.token){
    store.commit(SET_USER_DATA, userData)
    next();
  }else{
      if(process.env.IS_PROD){
        Modal.confirm({
            "title": "提示",
            "content": "你已被登出，可以取消继续留在该页面，或者重新登录",
            okText: "重新登录",
            cancelText: "取消",
            onOk: ()=>{
              logout()
            }
        })
        return false
      }else{
        Ajax.post({
          url: '/lawyer/user-center-login',
          params:{
                // 'user':'18666668888', //系统消息
                // 'pwd':md5.hex_md5('......').toUpperCase()
                // 'user':'13728839259', //系统消息
                // 'pwd':md5.hex_md5('123456').toUpperCase()
                // 'user':'13751068766',
                'user':'13748484848',
                'pwd':md5.hex_md5('111111').toUpperCase()
            }
        }).then(resp=>{
          let userData = resp.data
          if(resp.code===0){
            Message.error(resp.msg)
            return false
          }
          sessionStorage.setItem('userInfo', JSON.stringify(userData))
          store.commit(SET_USER_DATA, userData)
          next()
        })
      }
  }

});
router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

let vueRoot = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
//方便本地调试
if(!process.env.IS_PROD){
  top.vueRoot = vueRoot
}