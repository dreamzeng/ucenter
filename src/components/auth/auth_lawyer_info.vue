<template>
  <div class="u-auth-lawyer-info">
      <div class="u-banner">
          <img src="static/images/auth_banner_text.png" alt="资料认证">
      </div>
      <div class="u-tab">
          <img src="static/images/auth_info.png" v-if="status=='info'" alt="律师认证">
          <img src="static/images/auth_license.png" v-if="status=='license'" alt="律师认证">
          <img src="static/images/auth_auth.png" v-if="status=='auth'" alt="律师认证">
      </div>
        <!-- 律师资料 -->
        <div class="u-lawyer-info" v-if="status=='info'">
          <Form :model="form" ref="baseinfo-form" :label-width="120" :rules="infoRules">
            <FormItem label="姓名：" prop="realName">
                <Input v-model="form.realName" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="身份证号：" prop="idCard">
                <Input v-model="form.idCard" placeholder="请输入身份证号"></Input>
            </FormItem>
            <FormItem label="执业证号：" prop="code">
                <Input v-model="form.code" placeholder="请输入执业证号"></Input>
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
            <FormItem class="u-auth-btn">
                <Button @click="submitBaseInfo" shape="circle">下一步</Button>
            </FormItem>
          </Form>
        </div>
        <!-- 执业证照 -->
        <div class="u-license-pic" v-show="status=='license'">
            <div>
                请上传清晰的执业证照
            </div>
            <div class="license-pic-box">
                <img :src="lawyerInfoObj.pic ? lawyerInfoObj.pic : 'static/images/license_pic.png'" alt="证件照" />
                <i class="license-add-icon"></i>
                <div class="license-add-icon-box"></div>
            </div>
            <Form class="license-button">
                <FormItem class="u-auth-btn">
                    <Button @click="setStatus('info')" shape="circle">上一步</Button>
                    <Button @click="submitCertifyImg" type="primary" shape="circle">提交</Button>
                </FormItem>
            </Form>
        </div>
        <!-- 审核状态 -->
        <div class="u-lawyer-auth-status" v-if="status.indexOf('auth')>=0">
            <!-- 审核中 -->
            <div v-if="status == 'auth-ing'">
                <div class="auth-box">
                    <img src="static/images/auth_ing.png" alt="审核中"/>
                    <span>已提交审核</span>
                </div>
                <div class="auth-text">
                    您的资料已经提交，我们将会在3个工作日内完成审核，审核的结果将以短信的形式发送到您注册的手机，您也可以再此页面查看审核结果。
                </div>
            </div>
            <!-- 审核失败 -->
            <div v-if="status == 'auth-fail'">
                <div class="auth-box">
                    <img src="static/images/auth_no_pass.png" alt="审核失败"/>
                    <span>已提交审核</span>
                </div>
                <div class="auth-text">
                    您的资料已经提交，我们将会在3个工作日内完成审核，审核的结果将以短信的形式发送到您注册的手机，您也可以再此页面查看审核结果。
                </div>
            </div>
            <div class="auth-back">
                <span class="auth-back-err">信息填写有误？</span><Button @click="setStatus('info')" type="text">重新填写</Button>
            </div>
        </div>

        <!-- 上传执业证号弹框 -->
        <Modal
            v-model="licenseVisible"
            class="u-auth-license-modal"
            width="596"
            :closable="false"
            :scrollable="false"
            >
            <div slot="header">上传证件</div>
            <div class="u-license-upload">
                <div class="upload-box">
                    <div class="img">
                        <img :src="licensePreviewSrc" alt="证件预览图">
                    </div>
                    <div class="upload-btn" @click="reUpload">重新上传</div>
                </div>
            </div>
            <div slot="footer">
                <Button shape="circle" @click="licenseVisible=false">取消</Button>
                <Button shape="circle" type="primary" @click="saveLicense">确定</Button>
            </div>
        </Modal>
  </div>
</template>

<script>
import {API_URL} from '@/lib/Ajax'
import {IdentityCodeValid} from '@/lib/utils'
import {mapState} from 'vuex'
export default {
    mounted () {
        this.status = this.$route.params.status || 'info'  
        this.initLawyerInfo()
        // if(!top.WebUploader){
        //     require('../../../static/uploader/webuploader.css')
        //     this.WebUploader = require('../../../static/uploader/webuploader.js')
        //     top.WebUploader = this.WebUploader
        // }else{
        //     this.WebUploader = top.WebUploader
        // }
        
        if(this.status == 'license'){
            this.$nextTick(()=>{
                this.initUpload()
            })
        }
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
                caseIds: [] //擅长领域
            },
            infoRules:{
                realName:[
                    {required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                idCard:[
                    {required: true, message: '请输入身份证号', trigger: 'blur' },
                    {
                        validator(rule, value, callback, source, options) {
                            var errors = [];
                            //校验身份证
                            if(!IdentityCodeValid(value)){
                                callback('请输入正确的身份证号');
                            }
                            callback(errors);
                        }
                    }
                ],
                code:[
                    {required: true, message: '请输入执业证号' ,trigger: 'blur' },
                    {len: 17, message: '请输入正确的执业证号' ,trigger: 'blur' }
                ]
            },
            status:'info', // info-基本资料  license-执业证照  auth-审核状态
            licenseVisible: false,
            uploader: null,
            licensePreviewSrc:'',
            caseTypeList:[],
            certifyImgUrl:'' ///职业证上传地址
        }
    },
    methods: {
        setStatus(status) {
            this.$router.replace({name: 'auth_lawyer_info', params:{status}})
            this.status = status
        },
        initLawyerInfo(){
            this.form = {
                realName: this.lawyerInfoObj.realName || "", //姓名
                idCard: this.lawyerInfoObj.idCard || "", //身份证号
                code: this.lawyerInfoObj.code || "", //执业证号
                company: this.lawyerInfoObj.company || "", //律所
                address: this.lawyerInfoObj.address || "", //地址
                position: this.lawyerInfoObj.position || "", //担任职位
                caseIds: [] //擅长领域
            }
            if(this.lawyerInfoObj.caseTypeList){
                this.form.caseIds = this.lodash.map( this.lodash.filter(this.lawyerInfoObj.caseTypeList, item=>{
                    return item.goodAt == 1
                }), item=>item.id)
                
            }

            this.caseTypeList = this.lawyerInfoObj.caseTypeList || []
        },
        initUpload(){
            if(!this.uploader){
                
                this.uploader = WebUploader.create({
                    // swf文件路径
                    swf: '../../../static/uploader/Uploader.swf',
                    server: API_URL + "/common/uploadByStream",
                    compress:false,
                    pick:{
                        id:'.license-add-icon-box',
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
                this.uploader.on('fileQueued', this.fileQueued)
                this.uploader.on('uploadSuccess', this.uploadSuccess)
                this.uploader.on('uploadBeforeSend', this.uploadBeforeSend)
                this.uploader.on('uploadError', this.uploadError)
            }
            
        },
        fileQueued(file){
            this.uploader.makeThumb( file, ( error, ret ) =>{
                if(error){
                    this.$Message.error('预览错误')
                    return
                }
                this.licenseVisible = true
                this.licensePreviewSrc = ret
            });
        },
        uploadBeforeSend(object, data, headers){
            headers.token = this.token
        },
        uploadError(file, reason){
            this.$Message.error('职业证号上传失败')
        },
        uploadSuccess(file, response){
            if(response.code == 0){
                this.$Message.error('职业证号上传失败')
                return
            }
            this.certifyImgUrl = response.data.url
            this.licenseVisible = false
            this.$Message.success('职业证号上传成功')
        },
        reUpload(){
            // this.licenseVisible = false
            // this.licensePreviewSrc = ''
            this.uploader.reset()
            $(".webuploader-element-invisible").click()
        },
        saveLicense(){
            this.uploader.upload()
        },
        submitBaseInfo(){

            this.$refs['baseinfo-form'].validate((valid) => {
                if (valid) {
                    if(this.form.caseIds){
                        this.form.caseIds = this.form.caseIds.toString()
                    }
                    this.Api.auth.submitBaseInfo(this.form).then(resp=>{
                        this.$router.replace({name:'auth_lawyer_info', params:{status: 'license'}})
                    }).catch(resp=>{
                        this.$Message.error('提交基本资料失败')
                    })
                }
            })
        },
        submitCertifyImg(){
            if(this.certifyImgUrl == ''){
                this.$Message.error('请上传请上传清晰的执业证照后在提交')
                return
            }
            this.Api.auth.submitCertifyImg({
                certifyImgUrl: this.certifyImgUrl
            }).then(resp=>{
                this.$router.replace({name:'auth_lawyer_info', params:{status:'auth-ing'}})
                this.$Message.success('执业证照上传成功')
            }).catch(err=>{
                console.log(err)
                this.$Message.error('提交职业证照失败，请重试')
            })
        }
    },
    computed: {
        ...mapState({
            lawyerInfoObj(state){
                this.certifyImgUrl = state.auth.lawyerInfoObj.pic
                return state.auth.lawyerInfoObj || {}
            },
            token(state){
                return state.userData.token
            }
        })
    },
    watch: {
        '$route.params.status': {
            handler(newVal){
                this.status = newVal || 'info'

                if(newVal == 'info'){
                    this.initLawyerInfo()
                }
                if(newVal == 'license'){
                    this.initUpload()
                }else{
                    this.uploader = null
                }
            },
            deep: true
        },
        licenseVisible(newVal){
            if(!newVal){
                this.uploader.reset()
            }
        },
        'lawyerInfoObj.id':{
            handler(){
                this.initLawyerInfo()
            },
            deep: true
        }
    }
}
</script>

<style lang=less src="./auth.less"></style>
