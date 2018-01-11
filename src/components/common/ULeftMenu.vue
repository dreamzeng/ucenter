<template>
  <div class="u-left-menu-container">
    <div class="u-left-menu-user">
        <div class="u-hpic"><img :src="userData.logo" alt="律师头像" /></div>
        <div class="u-u-name">
            <span>{{baseLawyerObj.realName}}</span>
            <span>{{baseLawyerObj.position}}</span>
        </div>
        <div class="u-u-auth" @click="gotoAuth(userData.isAuth.code)">
            <img v-if="userData.isAuth.code === 0" src="static/images/auth_unautherized.png" alt="认证状态">
            <img v-if="userData.isAuth.code === 2" src="static/images/auth_autherized.png" alt="认证状态">
            <img v-if="userData.isAuth.code === 1" src="static/images/auth_authing.png" alt="认证状态">
            <img v-if="userData.isAuth.code === -1" src="static/images/auth_fail.png" alt="认证状态">
        </div>
    </div>


    <Menu theme="dark" width="100%" :open-names="['work-desk']"  accordion @on-select="menuSelect">
        <!-- <MenuItem name="overview">
            <Icon type="document-text"></Icon>
            总览
        </MenuItem> -->
         <Submenu name="message">  
            <template slot="title">
                <i class="icon-tiding"></i>
                消息
            </template>
            <!-- <MenuItem name="user_advice">
                用户咨询
            </MenuItem> -->
            <MenuItem name="message">
                系统消息
            </MenuItem>
        </Submenu>
        <Submenu name="work-desk">      
             <template slot="title">
                <i class="icon-job"></i>
                工作台
            </template>
            <MenuItem name="work-desk">
                工具
            </MenuItem>
            <MenuItem name="my-collect">
                我的收藏
            </MenuItem>
        </Submenu>
        <Submenu name="service">
            <template slot="title">
                <i class="icon-manage"></i>
                管理
            </template>
            <MenuItem name="service-mgr">
                服务管理
            </MenuItem>
        </Submenu>
          <Submenu name="set-up">
            <template slot="title">
                <i class="icon-setup"></i>
                设置
            </template>
             <MenuItem name="set-up">
                账号安全
            </MenuItem>
        </Submenu>
    </Menu>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {SET_AUTH_INFO, SET_LAWYER_INFO} from 'store/auth.store'
export default {
    mounted(){
        this.$nextTick(()=>{
            this.getAuthInfo(this.userData.token)
            //默认跳转
            if(this.$route.name == 'home'){
                let _that = this
                this.getLawyerInfo().then(resp=>{
                    let code = _that.baseLawyerObj.isAuth ? _that.baseLawyerObj.isAuth.code : null
                    _that.gotoAuth(code)
                }).catch(err=>{
                    console.error(err)
                })
            }else{
                this.getLawyerInfo()
            }
        })
    },
    data(){
        return {
            laywerInfoObj: {isAuth:{}, step:{}}
        }
    },
    methods:{
        ...mapActions([
            'getLawyerInfo'
        ]),
        menuSelect(name){
            this.$router.replace({name})
        },
        gotoAuth(code){
            let status = ''
            // let status = this.Constant.auth['STEP_'+step]
            switch(code){
                case 0: status = 'info'
                break;
            }

            //认证通过
            if(code == 2){
                this.$router.replace({name: 'base_info'})
                return
            }

            //如果已经填写资料，跳转到已经执行的步骤
            if(this.laywerInfoObj.step && this.laywerInfoObj.step.code){
                status = this.Constant.auth['STEP_'+this.laywerInfoObj.step.code]
                this.$router.replace({name: 'auth_lawyer_info', params:{status}})
            }
        },
        getAuthInfo(token){
            this.Api.auth.getAuthInfo({
                token
            }).then(resp =>{
                this.laywerInfoObj = resp.data || {isAuth:{}, step:{}}
                this.$store.commit(SET_LAWYER_INFO, this.laywerInfoObj)
            }).catch(err => {
                this.$Message.error('获取律师认证信息失败')
            })
        }
    },
    computed: {
        ...mapState({
            userData(state){
                let data = state.userData ? state.userData : {user:{}}
                return data.user || {isAuth:{}}
            },
            baseLawyerObj(state){
                return state.auth.baseLawyerObj || {}
            }
        })
    },
    watch:{
        '$route.name': {
            handler(newVal){
                if(newVal=='home'){
                    let code = this.baseLawyerObj.isAuth ? this.baseLawyerObj.isAuth.code : null
                    this.gotoAuth(code)
                }
            },
            deep: true
        }
    }
}
</script>
<style lang=less >
@import '../../assets/less/u_leftside.less';
.ivu-menu-dark{background: #1f2329}
.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item{padding-left: 58px}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened{background: none}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title{background:#37393c!important; border-left: 4px solid #0099ff!important}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover{
    background: none!important; color: #0099ff
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background: #37393c!important; color: #fff
}
</style>