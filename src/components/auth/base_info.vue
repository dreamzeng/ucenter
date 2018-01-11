<!-- 律师基本资料 -->
<template>
  <div class="u-auth-lawyer-info u-base-info-container">
      <div class="u-base-info-banner">
          <img :src="form.logo" alt="律师头像">
          <div class="u-base-info-edit-pic">修改头像</div>
      </div>
      <div class="u-base-info-form">
          <h4>基本资料</h4>
          <!-- 律师资料 -->
          <Form :model="form" ref="baseinfo-form" class="u-lawyer-info" :label-width="120" :rules="infoRules">
            <FormItem label="姓名：" prop="realName">
                <Input v-model="form.realName" disabled placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="身份证号：" prop="idCard">
                <Input v-model="form.idCard" disabled placeholder="请输入身份证号"></Input>
            </FormItem>
            <FormItem label="执业证号：" prop="code">
                <Input v-model="form.code" disabled placeholder="请输入执业证号"></Input>
            </FormItem>
            <FormItem label="律所：">
                <Input v-model="form.company" placeholder="请输入律所"></Input>
            </FormItem>
            <FormItem label="律所地址：">
                <Input v-model="form.address" placeholder="请输入律所地址"></Input>
            </FormItem>
            <FormItem label="担任职位：">
                <Input v-model="form.position" placeholder="请输入担任的职位"></Input>
            </FormItem>
            <FormItem label="擅长领域：">
                <Select v-model="form.caseIds" label="请选择擅长领域" multiple style="width:100%;">
                    <Option v-for="(caseType, index) in caseTypeList" :value="caseType.id" :key="index">{{ caseType.name }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" shape="circle" @click="submitInfo()">保存</Button>
            </FormItem>
          </Form>
          <h4>
            证件信息
            <span class="u-base-info-show-pic" @click="showPic=!showPic" v-if="!showPic">查看</span>
            <span class="u-base-info-show-pic" @click="showPic=!showPic" v-if="showPic">收起</span>
          </h4>
          <div class="u-base-info-pic-container" v-show="showPic">
              <div class="pic-container">
                  <img :src="lawyerInfoObj.pic" alt="职业证照">
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import {API_URL} from '@/lib/Ajax'
import {mapState} from 'vuex'
import {SET_USER_DATA} from 'store'
export default {
    mounted(){
        this.initLawyerInfo()
        this.$nextTick(()=>{
            this.initUpload()
        })
    },
    data() {
        return {
            form: {
                realName: "", //姓名
                idCard: "", //身份证号
                code: "", //执业证号
                company: "", //律所
                address: "", //地址
                position: "", //担任职位
                caseIds: [], //擅长领域
                logo: ''  //头像
            },
            infoRules:{
                realName:[
                    {required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                idCard:[
                    {required: true, message: '请输入身份证号', trigger: 'blur' }
                ],
                code:[
                    {required: true, message: '请输入执业证号', trigger: 'blur' }
                ]
            },
            caseTypeList: [],
            showPic: false,
            uploader:null,
            lawyerInfoObj:{

            }
        }
    },
    methods: {
        initLawyerInfo() {
            this.Api.auth.getLawyerInfo().then(resp=>{
                this.lawyerInfoObj = resp.data || {}
                this.form = {
                    realName: this.lawyerInfoObj.realName || "", //姓名
                    idCard: this.lawyerInfoObj.idCard || "", //身份证号
                    code: this.lawyerInfoObj.code || "", //执业证号
                    company: this.lawyerInfoObj.company || "", //律所
                    address: this.lawyerInfoObj.address || "", //地址
                    position: this.lawyerInfoObj.position || "", //担任职位
                    caseIds: [], //擅长领域
                    logo: this.lawyerInfoObj.logo || ""
                }
                if(this.lawyerInfoObj.caseTypeList){
                    this.form.caseIds = this.lodash.map( this.lodash.filter(this.lawyerInfoObj.caseTypeList, item=>{
                        return item.goodAt == 1
                    }), item=>item.id)
                    
                }

                this.caseTypeList = this.lawyerInfoObj.caseTypeList || []
            })
            
        },
        initUpload(){
            if(!this.uploader){
                this.uploader = WebUploader.create({
                    // swf文件路径
                    swf: '../../../static/uploader/Uploader.swf',
                    server: API_URL + "/common/uploadByStream",
                    compress:false,
                    auto:true,
                    pick:{
                        id:'.u-base-info-edit-pic',
                        multiple: false
                    },
                    thumb:{
                        width: 265,
                        height: 175,
                        quality:100

                    },
                    accept:{
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*'
                    }
                });
                // this.uploader.on('fileQueued', this.fileQueued)
                this.uploader.on('uploadSuccess', this.uploadSuccess)
                this.uploader.on('uploadBeforeSend', this.uploadBeforeSend)
                this.uploader.on('uploadError', this.uploadError)
            }
        },
        // fileQueued(file){
        //     this.uploader.makeThumb( file, ( error, ret ) =>{
        //         if(error){
        //             this.$Message.error('预览错误')
        //             return
        //         }
        //         this.form.logo = ret
        //     });
        // },
        uploadBeforeSend(object, data, headers){
            headers.token = this.token
        },
        uploadError(file, reason){
            this.$Message.error('头像上传失败')
            this.uploader.reset()
        },
        uploadSuccess(file, response){
            if(response.code == 0){
                this.$Message.error('头像上传失败')
                return
            }
            this.form.logo = response.data.url
            this.$Message.success('头像上传成功')
        },
        submitInfo(){
            this.$refs['baseinfo-form'].validate((valid) => {
                if (valid) {
                    if(this.form.caseIds){
                        this.form.caseIds = this.form.caseIds.toString()
                    }
                    this.Api.auth.saveLawyerInfo(this.form).then(resp=>{
                        this.$Message.success('修改基本资料成功')
                        
                        ///更新头像
                        let userData = this.userData
                        userData.user.logo = this.form.logo
                        this.$store.commit(SET_USER_DATA, userData)
                        sessionStorage.setItem('userInfo', JSON.stringify(userData))
                        sessionStorage.setItem('user_logo', this.form.logo)
                    }).catch(resp=>{
                        this.$Message.error('修改基本资料失败')
                    })
                }
            })
        }
    },
    computed: {
        ...mapState({
            userData(state){
                return state.userData
            },
            token(state){
                return state.userData.token
            }
        })
    },
    watch: {
        
    },
}
</script>

<style lang=less src="./auth.less"></style>
