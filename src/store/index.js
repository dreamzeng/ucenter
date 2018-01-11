import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const SET_USER_DATA = 'SET_USER_DATA'

let modules = {}
let requireContext = require.context('./', false, /\.store.js$/)
requireContext.keys().forEach(path => {
    let apiObject = requireContext(path).default
    let key = path.match(/\.\/(\w+).store/)[1]
    modules[key] = apiObject
});

export default new Vuex.Store({
    state:{
        userData:{}
    },
    mutations: {
        [SET_USER_DATA](state, userData){
            state.userData = userData
        }
    },
    actions:{
        setUserData({commit}, data){
            sessionStorage.removeItem('userInfo');
            commit(SET_USER_DATA,{userData:data});
            
        }
    },
    getters:{
       setUserData: state => state.setUserData
    },
    modules
})