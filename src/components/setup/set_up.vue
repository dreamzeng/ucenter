<template>
    <div class="content_box">
      <ul>
          <li>
           <h4><span class="iphone_edit"><a href="javascript:;" @click="iphoneReplace">更换</a></span>修改手机号<em v-if="listpage==false">绑定手机：
           <b v-text="lawyerPhone"></b></em></h4>
             <div class="layout-content-main" v-show="listpage">
                         <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="180">
                          <div v-if="stage==1">
                              <FormItem label="当前绑定的手机号为：" >
                                  <span class="old_phone" v-text="lawyerPhone"></span>
                              </FormItem>
                              <FormItem label="手机验证码：" prop="codeCheck">
                                  <div class="code">
                                  <Input type="text" placeholder="请输入验证码" v-model="formCustom.codeCheck"  :maxlength='11' @keyup.native="higthlight(formCustom.codeCheck,0)" ></Input>
                                     <a href="javascript:;" v-show="show"  @click="sendCode(this)" :maxlength='11'>获取验证码</a>
                                     <a href="javascript:;" v-show="!show">{{count}} s</a>
                                  </div>
                              </FormItem>
                            </div>
                            <transition  name="slide" >
                             <div v-if="stage==2">
                                 <FormItem label="请输入新手机号码：">
                                    <Input type="text" v-model="formCustom.newphone"  @keyup.native = "checkPhone" placeholder="请输入新手机号码：" :maxlength='11'></Input>
                                </FormItem>
                                <FormItem label="请输入验证码：" prop="codeCheck1">
                                    <div class="code">
                                    <Input type="text" v-model="formCustom.codeCheck1" placeholder="请输入验证码" :maxlength="11" @keyup.native="higthlight(formCustom.codeCheck1,1)"></Input>
                                     <a href="javascript:;" v-show="show"  @click="sendCode(this,formCustom.newphone)" :maxlength='11'>获取验证码</a>
                                     <a href="javascript:;" v-show="!show">{{count}} s</a>

                                    </div>
                                </FormItem>
                            </div>
                            </transition>
                            <transition  name="slide" >
                            <div v-if="stage==3">
                                <FormItem label="已绑定手机：">
                                <span v-text="formCustom.iphone_num"></span>
                                <p><b v-text="formCustom.newphone"></b><i class="success_icon"></i><br>成功绑定手机,请用新手机号码重新登录</p>
                                </FormItem>
                            </div>
                            </transition>
                            <FormItem>
                                <Button type="primary" :loading="loading" @click="handleSubmit('formCustom')" shape="circle" :class="unable?'on':'off'" v-if="stage==1">
                                   <span v-if="!loading">确认修改</span>
                                   <span v-else>Loading...</span>
                                </Button>
                                <Button type="primary" :loading="loading" @click="handleSubmit('formCustom')" shape="circle" :class="unable1?'on':'off'" v-if="stage==2">
                                   <span v-if="!loading">确认绑定</span>
                                   <span v-else>Loading...</span>
                                </Button>
                                <router-link to="/login"><Button type="primary"shape="circle" v-if="stage==3">确认</Button></router-link>
                                <Button type="ghost" @click="handleReset('formCustom')" v-if="stage!=3" style="margin-left: 8px" shape="circle">取消</Button>
                            </FormItem>
                        </Form>
                 </div>
          </li>
          <li>
          <h4><span class="pwd_edit"><a href="javascript:;" @click="pwdReplace">编辑</a></span> 修改密码</h4>
                <div class="layout-content-main" v-show="listpage1">
                         <Form ref="formCustom1" :model="formCustom1" :rules="ruleCustom" :label-width="180">
                            <FormItem label="旧密码" prop="oldPasswd">
                                <Input type="password" v-model="formCustom1.oldPasswd" :maxlength='16'></Input>
                            </FormItem>
                            <FormItem label="新密码" prop="newPasswd" >
                                <Input type="password" v-model="formCustom1.newPasswd" :maxlength='16' @keyup.native='checkPwd(formCustom1)'></Input>
                            </FormItem>
                            <FormItem label="确认密码" prop="newpasswdCheck">
                                <Input type="password" v-model="formCustom1.newpasswdCheck" @keyup.native="higthlight(formCustom1.newpasswdCheck)" 
                                :maxlength='16'></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" :loading="loading1" @click="handleSubmit('formCustom1')" shape="circle"  :class="unable?'on':'off'" >确认修改</Button>
                                <Button type="ghost" @click="handleReset('formCustom1')" style="margin-left: 8px" shape="circle" >取消</Button>
                            </FormItem>
                        </Form>
                        <Modal
                            v-model="modal" title=" " @on-ok="phone_success" ok-text="重新登录" >
                            <div class="modal_con">
                              <p v-if="phone_sus"><i class="icon-phone-success"></i></p>
                              <p v-if="pwd_sus"><i class="icon-pwd-success"></i></p>
                              <p v-if="phone_sus"><span v-text="formCustom.newphone"></span>手机号码修改成功！</p>
                              <p v-if="pwd_sus"><span></span>密码修改成功！</p>
                             </div>
                        </Modal>
                 </div>
          </li>
      </ul>    
    </div>

</template>
<script>
import {mapState,mapActions,mapGetters} from 'vuex'
const md5 = require('@/lib/md5')
export default {
    components:{
    },
    data(){
            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            };
            const validateOld = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入旧密码'));
                } else {
                    callback();
                }
            };
            const validateNew = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else if(value.length<6){
                    callback(new Error('密码不得少于6位数'));
                }
                else {
                    callback();
                }
            };
            const validateNewCheck = (rule, value, callback) => {
                   if (value === '') {
                    callback(new Error('请重复输入新密码'));
                } else if (value !== this.formCustom1.newPasswd) {
                    callback(new Error('与新密码输入不一致'));
                } else {
                    callback();
                }
            };
            
        return {
           unable: true,
           unable1:true,
           modal: false,
           listpage:false,
           listpage1:false,
           stage: 1,
           show: true,
           phone_sus:false,
           pwd_sus:false,
           loading: false,
           loading1:false,
           count: '',
           timer: null,
           timeCount:60,
           formCustom: {
                    codeCheck:'',
                    codeCheck1:'',
                    newphone:'',
                    iphone_num:this.lawyerPhone
                },
          formCustom1: {
              oldPasswd: '',
              newPasswd: '',
              newpasswdCheck: '',
            },
                ruleCustom: {
                    codeCheck: [
                        { validator: validateCode, trigger: 'blur' }
                    ],
                    oldPasswd: [
                        { validator: validateOld, trigger: 'blur' }
                    ],
                    newPasswd: [
                        { validator: validateNew, trigger: 'blur' }
                    ],
                    newpasswdCheck: [
                        { validator: validateNewCheck, trigger: 'blur' }
                    ]
                }
        }
    },
    methods:{
        iphoneReplace(){
          if(this.listpage == false){
             this.listpage = true
             this.listpage1 = false
          }else{
             this.listpage = false
          }
        },
        checkPhone(phone){
           this.formCustom.newphone = this.formCustom.newphone.replace(/[^0-9]/g, '');
        },
        checkPwd(item){
          this.formCustom1.newPasswd = this.formCustom1.newPasswd.replace(/[^\a-\z\A-\Z0-9]/g,'')
          this.formCustom1.newpasswdCheck = this.formCustom1.newpasswdCheck.replace(/[^\a-\z\A-\Z0-9]/g,'')
        },
        pwdReplace(){
          this.$refs['formCustom'].resetFields();
          this.$refs['formCustom1'].resetFields();
          if(this.listpage1 == false){
             this.listpage1 = true;
             this.listpage = false
          }else{
             this.listpage1 = false
          }
        },
        phone_success(){
             sessionStorage.removeItem('token');
             localStorage.clear();
             this.setUserData();
             setTimeout(function(){
               window.location.href = '/login.html'
            }, 5000);

        },
        sendCode(obj,phone){
           this.show = false;
           this.count = 60;
           if (!this.timer) {
               this.count = this.timeCount;
               this.show = false;
               this.timer = 60;
               this.timer = setInterval(() => {
               if (this.count > 0 && this.count <= this.timeCount) {
                 this.count--;
                } else {
                 this.show = true;
                 clearInterval(this.timer);
                 this.timer = null;
                }
               }, 1000);
               this.Api.setup.sendSmsCode({phone:phone}).then((resp) => {
                 if(resp.code == 1){
                        _this.$Message.success({
                         content:resp.msg,
                         duration: 3
                       });
                   }
               });

            }
        },
        higthlight (len,id){
          let _this = this;
          _this.checkPwd();
          if(id==1){
             if(len.length>0){
               _this.unable1 = false;
            }else{
               _this.unable1 = true;
            }

          }else{
            if(len.length>0){
               _this.unable = false;
            }else{
               _this.unable = true;
            }
          }
        },
        handleSubmit (name) {
              let _this = this;
               _this.$refs[name].validate((valid) => {
                if (valid) {
                    if(name=='formCustom1'){
                        _this.loading1 = true;
                        let newPwd = md5.hex_md5(_this.formCustom1.newPasswd);
                        let oldPwd = md5.hex_md5(_this.formCustom1.oldPasswd);
                        let param = {
                                newPwd:newPwd.toUpperCase(),
                                oldPwd:oldPwd.toUpperCase()
                              };
                         _this.Api.setup.resetPassword(param).then((resp)=>{
                             if(resp.code == 1){
                                 _this.loading1 = false;
                                 _this.pwd_sus = true;
                                 _this.phone_sus = false;
                                 _this.modal = true
                                 setTimeout(function(){
                                  window.location.href = '/login.html';
                                  localStorage.clear();
                                }, 3000);
                              }else if(resp.code == 0){
                                 _this.$Message.warning(resp.msg);
                                 _this.loading1 = false;
                              }    
                        }).catch((err)=>{
                              _this.loading1 = false;
                            });
                       }else if(name == 'formCustom'){
                             let param ={
                                code:_this.formCustom.codeCheck
                             }
                             _this.loading = true;
                             _this.show = true;
                             _this.timeCount = 60;
                             if(_this.formCustom.codeCheck && (_this.stage == 1)){
                                 _this.Api.setup.checkSmsCode(param).then((resp)=>{
                                   if(resp.code == 1){
                                        _this.$Message.success({
                                         content:resp.msg,
                                         duration: 3
                                       });
                                       _this.stage = 2;
                                       _this.show = true;
                                       _this.loading = false;

                                    }else if(resp.code == 0){
                                       _this.$Message.warning(resp.msg);
                                       _this.loading = false;
                                    } 
                                }).catch((err)=>{
                                   _this.loading = false;
                             　　});
                             }
                             else if(_this.formCustom.codeCheck1 && (_this.stage == 2)){
                                 let param ={
                                        phone:_this.formCustom.newphone,
                                        code:_this.formCustom.codeCheck1
                                     }
                                 _this.Api.setup.modifyPhone(param).then((resp)=>{
                                       if(resp.code == 1){
                                           _this.loading = false;
                                           _this.phone_sus = true;
                                           _this.pwd_sus = false;
                                           _this.modal = true;
                                           setTimeout(function(){ 
                                            window.location.href = '/login.html';
                                            localStorage.clear();
                                         }, 3000);
                                        }else{
                                           _this.$Message.warning(resp.msg);
                                           _this.loading = false;
                                        }  
                                    }).catch((err)=>{
                                       _this.loading = false;
                             　　   });
                               }
                            
                       }
                }else{
                    _this.$Message.error(resp.message);
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            this.loading = false;
            this.loading1 = false;
            this.unable = true
        }
       
    },
    computed:{
         ...mapActions([
            'setUserData'
            ]),
         ...mapState({
            lawyerPhone(state){
                let lawyerPhone = state.userData.user && state.userData.user.phone || '';
                let reg = new RegExp("(\\d{3})(\\d{4})(\\d{4})");
                lawyerPhone = lawyerPhone.replace(reg, "$1****$3");
                return lawyerPhone;
            }
        })
    }
}
</script>

<style lang="less" >
@import '../../assets/less/set_up.less';
</style>