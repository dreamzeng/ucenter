<template>
  <div class="u-container">
      <div class="u-header">
          <u-header></u-header>
      </div>
      <div class="u-left-menu">
          <u-left-menu></u-left-menu>
      </div>
      <div class="u-main">
          <div class="u-wrapper">
               <router-view></router-view>
          </div>
      </div>
  </div>
</template>

<script>
import UHeader from "@/components/common/UHeader"
import ULeftMenu from "@/components/common/ULeftMenu"
import {SET_USER_DATA} from 'store/index'
export default {
    mounted(){
        
    },
    methods: {
        
    },
    components: {
        UHeader,
        ULeftMenu
    }
}
</script>

<style lang=less scoped>
    @import '../assets/less/base.less';
    .u-container{
        width: 100%;
        height: 100%;
        padding-left: 0px;
        .u-header{
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            z-index: 1002;
            background: #fff;
            
        }
        .u-left-menu{
            width: @left-side-width;
            margin-top: -10px;
            height: 100%;
            position: fixed;
            background: #1F2328;
            overflow: hidden;
            outline: none;
            .el-menu{
                border: 0px;
            }
        }
        .u-main{
            margin-left: @left-side-width;overflow-x:hidden;
            .u-wrapper{
                margin-top: 80px;
                margin-bottom: 20px;
                padding: 15px;
                width: 100%;
                padding-left: 40px;
            }
        }
        
        .ivu-btn{
            padding: 6px 20px;
        }
    }
</style>
