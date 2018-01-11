<template>
  <div class="u-header-container">
      
      <div class="u-top-menu">
            <div class="u-logo">
                <a href="/index.html">
                    <img src="static/images/logo.png" alt="logo">
                </a>
            </div>
            <Menu mode="horizontal" theme="light" @on-select="menuClick" active-name="1">
                <MenuItem name="home">
                    首页
                </MenuItem>
                <MenuItem name="orgCenter" v-if="officeIsShow">
                    我的律所
                </MenuItem>
                <MenuItem name="orgCenter" v-if="controlIsShow">
                    律所控制台
                </MenuItem>
            <!--  <Badge count="1">
                <a href="#" class="badge">系统消息</a>
            </Badge> -->
               
              <div class="u-right">
              <router-link to="message">
              <Badge :count="messageCount">
                  <Icon type="ios-bell-outline" size="26"></Icon>
              </Badge></router-link>
              <span class="quit" @click="quit">
                  <i></i>
              </span></div>
            </Menu>

      </div>
                
  </div>
</template>

<script>
import {mapState,mapActions,mapGetters} from 'vuex'
import {logout} from '@/lib/utils'
export default {
    data(){
        return {
            officeIsShow:false,
            controlIsShow:false,
            activeIndex:'1'
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init();
        });
    },
    methods: {
       ...mapActions([
            'setUserData'
            ]),
          init(){
            this.officeIsShow = this.lawOffice
            this.controlIsShow = this.lawOfficeControl
            if(this.lawOffice!="" && (this.lawOfficeControl == 0)){
                this.officeIsShow = true;  
            }
             
            if(this.lawOffice!="" && (this.lawOfficeControl == 1)){
                this.officeIsShow = true;  
                this.controlIsShow = true; 
            }
          },
          quit(){
            logout()
          },
          menuClick(name){
              if("home" == name){
                  this.$router.replace({name:'home'})
              }else{
                  window.location.href="/orgCenter/"
              }
          }
    },
    computed:{
        ...mapGetters([
            'messageCount'
          ]),
        ...mapState({
                lawOffice(state){
                    let lawOffice = state.userData.user 
                                        && state.userData.lawOfficeEmpVO 
                                        && state.userData.lawOfficeEmpVO.leve
                                        && state.userData.lawOfficeEmpVO.leve  != 1 || false
                    return lawOffice;
                },
                lawOfficeControl(state){
                    let lawOfficeControl = state.userData.user && state.userData.lawOfficeEmpVO.leve == 1 || false;
                    return lawOfficeControl;
                }
            })
    }
}
</script>

<style lang=less src="../../assets/less/u_header.less"></style>
