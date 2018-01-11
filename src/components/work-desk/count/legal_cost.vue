<!--诉讼费计算器-->
<template>
  <div class="u-ssfjs-container">
      <div class="u-ct-container">
            <Form :model="form" ref="countForm" :label-width="100" :rules="rules">
                <FormItem label="案件类型">
                    <FormItem prop="caseType" class="u-case-select">
                        <Select v-model="form.caseType" style="width:200px" @on-change="onCaseChange">
                            <Option v-for="(caseObj, id) in caseTypes" :value="id" :key="id">{{ caseObj.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="u-case-select" prop="optionsId">
                        <Select v-model="form.optionsId" @on-change="onOptionChange" style="width:200px">
                            <Option v-for="(options, index) in caseOptions" :value="options.value" :key="index">{{ options.label }}</Option>
                        </Select>
                    </FormItem>
                </FormItem>

                <FormItem v-if="isShowEstate" label="是否涉及财产">
                    <RadioGroup v-model="form.isEstate">
                        <Radio label="是"></Radio>
                        <Radio label="否"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-if="isShowLegal && form.isEstate == '是'" label="诉讼标的" prop="legalVal">
                    <Input v-model.number="form.legalVal" placeholder="请输入标的金额"></Input>
                </FormItem>
                <FormItem label="计算方式">
                    <RadioGroup v-model="form.isHalf">
                        <Radio label="全额"></Radio>
                        <Radio label="减半"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem class="u-form-btn">
                    <Button shape="circle" @click="countHandler" type="primary">计算</Button>
                    <Button shape="circle" @click="resetHandler">重置</Button>
                </FormItem>
            </Form>
            <div class="u-count-result clearfix">
                <div class="u-swf u-count-base">
                    <div class="u-count-text">
                        <p>计算结果</p>
                        <p class="u-number">{{countValue}}</p>
                    </div>
                </div>
            </div>
      </div>
  </div>
</template>

<script>
let caseTypes = require('./j_legal_cost.json')
export default {
    created(){
        // this.caseOptions = this.caseTypes[0].options
    },
    data(){
        return {
            caseTypes,
            caseOptions:[],
            form: {
                caseType: null,
                optionsId:null,
                isEstate:'是', //财产
                legalVal:null, //标的
                isHalf:'全额'
            },
            showEstate: [2, 3, 4, 9, 10],
            isShowEstate: false,
            showLegal: [1,2, 3, 4, 9],
            isShowLegal:false,
            countValue:'',
            isReset: false,
            rules:{
                caseType: [
                    {   
                        required: true,
                        type:'number',
                        message: '请选择案件类型',
                        trigger: 'change'
                    }
                ],
                optionsId: [
                    {
                        required: true,
                        type:'number',
                        message: '请选择案件类型',
                        trigger: 'change'
                    }
                ],
                legalVal: [
                    {
                        required: true,
                        message: '请输入标的费用'
                    },
                    {
                        required: true,
                        type:'number',
                        message: '标的费用只能为数字',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods:{
        onCaseChange(index){
            let options = this.caseTypes[index].options
            // this.form.optionsId = options[0].value
            this.caseOptions = options
            
        },

        onOptionChange(val){
            this.isShowEstate = this.lodash.indexOf(this.showEstate, parseInt(val))>=0
            this.isShowLegal = this.lodash.indexOf(this.showLegal, parseInt(val))>=0

        },
        resetHandler(){
            this.form = {
                caseType: 0,
                optionsId:'',
                isEstate:'是', //财产
                legalVal:'', //标的
                isHalf:'全额',
            }
            this.countValue = ''
            this.caseOptions = []
        },
        countHandler(){
            this.$refs['countForm'].validate((valid) => {
                if (valid) {
                    this[this.form.optionsId]()
                } else {
                    return
                }
            })
            
        },
        //财产案件
        1(){
            var allMoney = [10000,100000,200000,500000,1000000,2000000,5000000,10000000,20000000];
            var allPer = [50,0.025,0.02,0.015,0.01,0.009,0.008,0.007,0.006,0.005];
            var allPerMoney = [50,2250,2000,4500,5000,9000,24000,35000,60000];
            
            var index = -1;
            for (var i = 0; i < allMoney.length; i++) {
                if (this.iptmoney - allMoney[i] < 0) {
                    index = i;
                    break;
                }
            }
            //第一个区间
            if (index == 0) {
                this.countValue = (allPerMoney[0]*this.qb).toFixed(2);
                return false;
            }

            //最大的区间
            var d=0;
            if (index == -1) {
                for (var i = 0; i < allPerMoney.length; i++) {
                    d += allPerMoney[i];
                }
                var v = (this.iptmoney - allMoney[allMoney.length - 1]) *allPer[allPer.length-1] + d;
                this.countValue = (v*this.qb).toFixed(2);
                return false;
            }


            //正常流程
            for (var i = 1; i <= index; i++) {
                d = allPerMoney[i - 1] + d;
            }
            var v = (this.iptmoney - allMoney[index - 1]) * allPer[index] + d;
            this.countValue = (v*this.qb).toFixed(2);
        },
        //离婚案件
        2(){
            var lhfei = ["25~150","50~300"];
            var lihun = 0;
            if(this.sjcc == 1){
                if(this.iptmoney <= 200000){
                    this.countValue = this.qb == 1 ? lhfei[1] : lhfei[0]
                    return false
                }
                if(this.iptmoney > 200000){
                    if(this.qb == 1){
                        lihun = (this.iptmoney - 200000) * 0.005;
                        var min = lihun + 50;
                        var max = lihun +300;
                        this.countValue = min+"~"+max;
                        return false;
                    }
                    if(this.qb == 0.5){
                        lihun = (this.iptmoney - 200000) * 0.005;
                        var min = lihun + 25;
                        var max = lihun +150;
                        this.countValue = min+"~"+max;
                        return false;
                    }
                }
            }
            if(this.sjcc == 2){
                this.countValue = this.qb == 1 ? lhfei[1] : lhfei[0]
            }
        },
        //人格权案件
        3(){
            var rgfei = ["50~250","100~500"];
            if(this.sjcc == 1){
                if(this.iptmoney <= 50000){
                    this.countValue = this.qb == 1 ? rgfei[1] : rgfei[0]
                    return false
                }
                // 五万到十万的部分
                if(this.iptmoney > 50000 && this.iptmoney <= 100000){
                    var min = (this.iptmoney - 50000) * 0.01*this.qb + 100;
                    var max = (this.iptmoney - 50000) * 0.01*this.qb + 500;
                    this.countValue = min.toFixed(2)+"~"+max.toFixed(2)
                    return false;
                }
                //超过十万
                if(this.iptmoney > 100000){
                    var min = (100000 - 50000) * 0.01*this.qb + (this.iptmoney - 100000) * 0.005 * this.qb + 100;
                    var max = (100000 - 50000) * 0.01*this.qb + (this.iptmoney - 100000) * 0.005 * this.qb + 500;
                    this.countValue = min.toFixed(2)+"~"+max.toFixed(2)
                    return false;
                }
            }
            if(this.sjcc == 2){
                this.countValue = this.qb == 1 ? rgfei[1] : rgfei[0]
                return false
            }
        },
        //知识产权案件
        4(){
            if(this.sjcc == 1){
                var allMoney = [10000,100000,200000,500000,1000000,2000000,5000000,10000000,20000000];
                var allPer = [50,0.025,0.02,0.015,0.01,0.009,0.008,0.007,0.006,0.005];
                var allPerMoney = [50,2250,2000,4500,5000,9000,24000,35000,60000];

                var index = -1;
                for (var i = 0; i < allMoney.length; i++) {
                    if (this.iptmoney - allMoney[i] < 0) {
                        index = i;
                        break;
                    }
                }
                //第一个区间
                if (index == 0) {
                    this.countValue = (allPerMoney[0] * this.qb).toFixed(2);
                    return false;
                }

                //最大的区间
                var d=0;
                if (index == -1) {
                    for (var i = 0; i < allPerMoney.length; i++) {
                        d += allPerMoney[i];
                    }
                    var v = (this.iptmoney - allMoney[allMoney.length - 1]) *allPer[allPer.length-1] + d;
                    this.countValue = (v*this.qb).toFixed(2);
                    return false;
                }


                //正常流程
                for (var i = 1; i <= index; i++) {
                    d = allPerMoney[i - 1] + d;
                }
                var v = (this.iptmoney - allMoney[index - 1]) * allPer[index] + d;
                this.countValue = (v*this.qb).toFixed(2);
                return false;
            }
            if(this.sjcc == 2){
                var zsfei = ["250~500","500~1000"];
                this.countValue = this.qb == 1 ? zsfei[1] : zsfei[0]
            }
        },
        //劳动争议案件
        5(){
            this.countValue = 10 * this.qb
        },
        //管辖权异议不成立的案件
        6(){
            var gxfei = ["25~50","50~100","（省、自治区、直辖市人民政府可以结合本地实际情况在本条第（二）项、第（三）项、第（六）项规定的幅度内制定具体交纳标准。）"];
            this.countValue = this.qb == 1 ? gxfei[1] : gxfei[0]
            //费用说明
        },
        //商标、专利、海事行政案件
        7(){
            this.countValue = 100 * this.qb
        },
        //其他行政案件
        8(){
            this.countValue = 50 * this.qb
        },
        //执行费
        9(){
             var zxlhfei = ["25~250","50~500"];
            //涉及财产关系
            if(this.sjcc == 1){
                
                if(this.iptmoney <= 10000){
                    this.countValue = 50 * this.qb
                    return false;
                }
                else if(this.iptmoney <= 500000){
                    var zhixingfeiSum = (50 + (this.iptmoney - 10000) * 0.015)*this.qb;
                    this.countValue = zhixingfeiSum.toFixed(2)
                    return false;
                }
                else if(this.iptmoney <= 5000000){
                    var zhixingfeiSum = (7400 + (this.iptmoney - 500000) * 0.01)*this.qb;
                    this.countValue = zhixingfeiSum.toFixed(2)
                    return false;
                }
                else if(this.iptmoney <= 10000000){
                    var zhixingfeiSum = (52400 + (this.iptmoney - 5000000) * 0.005)*this.qb;
                    this.countValue = zhixingfeiSum.toFixed(2)
                    return false;
                }
                else{
                    var zhixingfeiSum = (77400 + (this.iptmoney - 10000000) * 0.001)*this.qb;
                    this.countValue = zhixingfeiSum.toFixed(2)
                    return false;
                }
            }
            if(this.sjcc == 2){ //不涉及财产
                this.countValue = this.qb == 1 ? zxlhfei[1] : zxlhfei[0]
            }
        },
        //支付令
        10(){
            var allMoney = [10000,100000,200000,500000,1000000,2000000,5000000,10000000,20000000];
            var allPer = [50,0.025,0.02,0.015,0.01,0.009,0.008,0.007,0.006,0.005];
            var allPerMoney = [50,2250,2000,4500,5000,9000,24000,35000,60000];

            var index = -1;
            for (var i = 0; i < allMoney.length; i++) {
                if (this.iptmoney - allMoney[i] < 0) {
                    index = i;
                    break;
                }
            }
            //第一个区间
            if (index == 0) {
                this.countValue = (allPerMoney[0]/3)*this.qb.toFixed(2);
                return false;
            }

            //最大的区间
            var d=0;
            if (index == -1) {
                for (var i = 0; i < allPerMoney.length; i++) {
                    d += allPerMoney[i];
                }
                var v = (this.iptmoney - allMoney[allMoney.length - 1]) *allPer[allPer.length-1] + d;
                this.countValue = ((v/3)*this.qb).toFixed(2);
                return false;
            }

            //正常流程
            for (var i = 1; i <= index; i++) {
                d = allPerMoney[i - 1] + d;
            }
            var v = (this.iptmoney - allMoney[index - 1]) * allPer[index] + d;
            this.countValue = ((v/3)*this.qb).toFixed(2);
            return false;
        },
        //公示催告
        11(){
            this.countValue = 100 * this.qb
        }
    },
    computed:{
        //标的费
        iptmoney(){
            if(this.form.legalVal == ''){
                return 0
            }
            return parseFloat(this.form.legalVal)
        },
        //是否全额
        qb(){
            return this.form.isHalf == '全额' ? 1 : 0.5
        },
        //是否涉及财产
        sjcc(){
            return this.form.isEstate == '是' ? 1 : 2
        }
    }
}
</script>

<style lang="less">
    @import '../../../assets/less/work-desk.less';
    .u-case-select{
        float: left;
        margin-right: 10px;
    }
</style>
