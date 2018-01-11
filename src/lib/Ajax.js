import axios from 'axios'

import { Message, Modal } from 'iview';
import Config from '@/config/index'

import router from '@/router/index'
import store from 'store'
import {logout} from '@/lib/utils'

let qs = require('qs')

const Merge = require('./merge').default

let BASE_API_URL = ""
if(process.env.NODE_ENV == 'prod'){
    BASE_API_URL = top.BASE_URL;
}else{
    BASE_API_URL = Config[process.env.NODE_ENV.toUpperCase()+'_API_URL']
}
export const API_URL = BASE_API_URL //Config[process.env.NODE_ENV.toUpperCase()+'_API_URL']


/**
 * 跳转到登录页
 */
const toLogin = ()=>{
    Modal.confirm({
        "title": "提示",
        "content": "你已被登出，可以取消继续留在该页面，或者重新登录",
        okText: "重新登录",
        cancelText: "取消",
        onOk: ()=>{
            logout()
        }
    })
}

// 添加一个请求拦截器
axios.interceptors.request.use(config => {
    config = Merge(config, {
        headers: {
            // 'X-Requested-With': 'XMLHttpRequest'
            // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        // withCredentials: true,
        timeout:30000, //设置30秒超时
        url: API_URL + config.url
    })

    //登录接口不做token判断
    if( config.url.indexOf('user-center-login')<0 ){
        let userData = store.state.userData
        if(userData && userData.token){
            config.headers['token'] = userData.token
        }
        
    }
    return config;
  },error => {
    console.log(error);
    Message.error("请求出错了，请重试")
    return Promise.reject(error);
  });

// 添加一个响应拦截器
axios.interceptors.response.use(response =>{
    
    let body = response.data;
    if (body && body.code === 10) {//登录态过期，需要登录
        toLogin()
        return;
    }
    // if (body && body.code == 10) {//重新登录
    //     Message({
    //         message: '请先登录',
    //         type: 'error',
    //         duration: 3 * 1000
    //     });
    //    window.location.href = "/login.html"
    // }

    return body;
  }, error => {
    console.log(error);
    if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1){
        Message.error("请求超时，请刷新重试")
    }else{
        Message.error("请求出错了，请重试")
    }
    
    return Promise.reject(error);
  });

export const Ajax = {
    get(opts){
        return axios.get(opts.url, {
            params : opts.params
        }, opts.config || {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        })
    },
    post(opts){
        return axios.post(opts.url, qs.stringify(opts.params), opts.config || {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        })
    },
    request(opts){
        return axios(opts)
    }
}