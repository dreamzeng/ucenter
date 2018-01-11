import Vue from 'vue'
import Router from 'vue-router'
import {asyncComponent} from '@/lib/utils'

const PageNotFound = asyncComponent('common/404')
const Home = asyncComponent('Home')

Vue.use(Router)

export default new Router({
  base: '/',
  routes: [
    {
       path: '/',
       name: 'home',
      //  redirect:{name: 'work-desk'},
       components:{
         home: Home
       },
       children: registerRouter(require.context('./', false, /\.route.js$/))
    },
    //配置页面404
    {
      path: "*",
      components: {
        home: PageNotFound
      }
    }
  ]
})

function registerRouter(requireContext) {
  let rMap = [];
  requireContext.keys().forEach(comp => {
      let vueComp = requireContext(comp);
      let rList = vueComp.r || [];
      for(let i =0,l=rList.length;i<l;i++){
          rMap.push(rList[i]);
      }
  });
  return rMap;
}
