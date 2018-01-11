<!--裁决书逾期计算器-->
<template>
  <div class="u-award-overdue">
        <div class="u-ct-container">
            <Form ref="countForm" :model="form" :rules="rules" :label-width="180">
                <FormItem label="标的金额：" prop="money">
                    <Input v-model.number="form.money" placeholder="请输入标的金额"></Input>
                </FormItem>
                <FormItem label="起算日" prop="beginTime">
                    <DatePicker type="date" @on-change="date=>form.beginTime=date" placeholder="请选择开始日期"></DatePicker>
                </FormItem>
                <FormItem label="截止日" prop="endTime">
                    <DatePicker type="date" @on-change="date=>form.endTime=date" placeholder="请选择结束日期"></DatePicker>
                </FormItem>
                <FormItem label="还款方式：">
                    <Select style="width:100%;" v-model="form.type" placeholder="请选择">
                        <Option
                            label='银行同期利率'
                            value='1'></Option>
                        <Option
                            label='约定利率'
                            value='2'></Option>
                    </Select>
                </FormItem>
                <FormItem v-if="form.type==2" label="违约金利率（% / 日）：" prop="rate">
                    <Input v-model.number="form.rate" placeholder="请输入违约金利率"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="countHandler" type="primary">计算</Button>
                    <Button @click="resetHandler">重置</Button>
                </FormItem>
            </Form>
            <Form :label-width="170">
                <FormItem label="一般债务利息：">
                        <div>{{resultObj.mormal}}</div>
                </FormItem>
                <FormItem label="加倍部分债务利息：">
                        <div>{{resultObj.double}}</div>
                </FormItem>
                <FormItem label="延迟期间债务利息：">
                        <div>{{resultObj.lazy}}</div>
                </FormItem>
            </Form>
        </div>
  </div>
</template>

<script>
let bank_rule = {
    //180-1 365-2  1.3-3  3.5-4   5-5
    "19890201":["0.1134","0.1134","0.1278","0.1440","0.1926"],
    "19900821":["0.0864","0.0936","0.1008","0.1080","0.1116"],
    "19910321":["0.0900","0.1008","0.1080","0.1152","0.1188"],
    "19910421":["0.0810","0.0864","0.0900","0.0954","0.0972"],
    "19930515":["0.0882","0.0936","0.1080","0.1206","0.1224"],
    "19930711":["0.0900","0.1098","0.1224","0.1386","0.1404"],
    "19950101":["0.0900","0.1098","0.1296","0.1458","0.1476"],
    "19950701":["0.1008","0.1206","0.1305","0.1512","0.1530"],
    "19960501":["0.0972","0.1098","0.1314","0.1494","0.1512"],
    "19960823":["0.0918","0.1008","0.1098","0.1170","0.1242"],
    "19971023":["0.0765","0.0864","0.0936","0.0990","0.1053"],
    "19980325":["0.0702","0.0792","0.0900","0.0972","0.1035"],
    "19980701":["0.0657","0.0693","0.0711","0.0765","0.0801"],
    "19981207":["0.0612","0.0639","0.0666","0.0720","0.0756"],
    "19990610":["0.0558","0.0585","0.0594","0.0603","0.0621"],
    "20020221":["0.0504","0.0531","0.0549","0.0558","0.0576"],
    "20041029":["0.0522","0.0558","0.0576","0.0585","0.0612"],
    "20050317":["0.0522","0.0558","0.0576","0.0585","0.0612"],
    "20060428":["0.0540","0.0585","0.0603","0.0612","0.0639"],
    "20060819":["0.0558","0.0612","0.0630","0.0648","0.0684"],
    "20070318":["0.0567","0.0639","0.0657","0.0675","0.0711"],
    "20070519":["0.0585","0.0657","0.0675","0.0693","0.0720"],
    "20070721":["0.0603","0.0684","0.0702","0.0720","0.0738"],
    "20070822":["0.0621","0.0702","0.0720","0.0738","0.0756"],
    "20070915":["0.0648","0.0729","0.0747","0.0765","0.0783"],
    "20071221":["0.0657","0.0747","0.0756","0.0774","0.0783"],
    "20080916":["0.0621","0.0720","0.0729","0.0756","0.0774"],
    "20081009":["0.0612","0.0693","0.0702","0.0729","0.0747"],
    "20081027":["0.0612","0.0693","0.0702","0.0729","0.0747"],
    "20081030":["0.0603","0.0666","0.0675","0.0702","0.0720"],
    "20081127":["0.0504","0.0558","0.0567","0.0594","0.0612"],
    "20081223":["0.0486","0.0531","0.0540","0.0576","0.0594"],
    "20101020":["0.0510","0.0556","0.0560","0.0596","0.0614"],
    "20101226":["0.0535","0.0581","0.0585","0.0622","0.0640"],
    "20110209":["0.0560","0.0606","0.0610","0.0645","0.0660"],
    "20110406":["0.0585","0.0631","0.0640","0.0665","0.0680"],
    "20110707":["0.0610","0.0656","0.0665","0.0690","0.0705"],
    "20120608":["0.0585","0.0631","0.0640","0.0665","0.0680"],
    "20120706":["0.0560","0.0600","0.0615","0.0640","0.0655"],
    "20141122":["0.0560","0.0560","0.0600","0.0600","0.0615"],
    "20150301":["0.0535","0.0535","0.0575","0.0575","0.0590"],
    "20150511":["0.0510","0.0510","0.0550","0.0550","0.0565"],
    "20150628":["0.0485","0.0485","0.0525","0.0525","0.0540"],
    "20150826":["0.0460","0.0460","0.0500","0.0500","0.0515"],
    "20151024":["0.0435","0.0435","0.0475","0.0475","0.0490"]
}
export default {
    data(){
        return {
            form:{
                money:null,
                startTime:null,
                endTime:null,
                rate:null,
                type:'1' //还款方式
            },
            rules:{
                money:[
                    {required: true, message: '请输入标的金额'},
                    {type:'number', message: '标的金额只能输入数值'}
                ],
                beginTime:[
                    {type: 'string', required: true, message: '请选择开始时间'}
                ],
                endTime:[
                    {type: 'string', required: true, message: '请选择结束时间'}
                ],
                rate:[
                    {required: true, message: '请输入违约金利率'},
                    {type:'number', message: '违约金利率只能输入数值', trigger: 'blur' }
                ]
                
            },
            resultObj:{
                mormal:'0.00', //一般债务利息：
                double:'0.00',//加倍部分债务利息：
                lazy:'0.00'//延迟期间债务利息：
            }
        }
    },
    methods:{
        countHandler(){
            this.$refs['countForm'].validate(valid => {
                if (valid){
                    this.form.type == 1 ? this.bank() : this.appoint()
                }
            })
        },
        resetHandler(){
            this.form = {
                money:'',
                beginTime:'',
                endTime:'',
                rate:'',
                type:'1' //还款方式
            }

            this.resultObj = {
                mormal:'0.00', //一般债务利息：
                double:'0.00',//加倍部分债务利息：
                lazy:'0.00'//延迟期间债务利息：
            }
        },
        bank(){
            var start_json = '';
            var key_diff_start = '';
            var bank_key_data = '', sum = parseFloat(this.form.money)
            //开始时间 计算 银行利率
            for(var bank_key in bank_rule){
                bank_key_data = this.dateAddHeng(bank_key);
                if(start_json == '')    start_json = bank_key;
                if(key_diff_start == '')key_diff_start = this.dateDiff(bank_key_data,this.form.beginTime);

                
                //起始时间 键值排序
                if(this.dateDiff(bank_key_data,this.form.beginTime) < key_diff_start && this.dateDiff(bank_key_data,this.form.beginTime) > 0){
                    start_json = bank_key;
                    key_diff_start = this.dateDiff(bank_key_data,this.form.beginTime);
                }
            }

            //银行同期利率获取
            var day = this.dateDiff(this.form.beginTime,this.form.endTime);
            if(day <= 180)                  var category = bank_rule[start_json][0];
            if(day > 180 && day <= 365)     var category = bank_rule[start_json][1];
            if(day > 365 && day <= 1095)    var category = bank_rule[start_json][2];
            if(day > 1095 && day <= 1825)   var category = bank_rule[start_json][3];
            if(day > 1825)                  var category = bank_rule[start_json][4];
            category = category / 360;

            var rate_normal = day * sum * category;
            if(this.dateDiff(this.form.beginTime,"2014-08-01") > 0 && this.dateDiff("2014-08-01",this.form.endTime) < 0){
                var rate_overdue = day * sum * category * 2;
            }else if(this.dateDiff(this.form.beginTime,"2014-08-01") > 0 && this.dateDiff("2014-08-01",this.form.endTime) > 0){
                var rate_overdue = (this.dateDiff(this.form.beginTime,"2014-08-01") * sum * category * 2) + (this.dateDiff("2014-08-01",this.form.endTime) * sum  * 0.000175);
            }else{
                var rate_overdue = day * sum * 0.000175;
            }
            
            var rate_all = rate_overdue + rate_normal;

            this.resultObj = {
                mormal:rate_normal.toFixed(2), //一般债务利息：
                double:rate_overdue.toFixed(2),//加倍部分债务利息：
                lazy:rate_all.toFixed(2)//延迟期间债务利息：
            }
        },
        appoint(){
            var diffDay =this.dateDiff(this.form.beginTime, this.form.endTime);
            var sum = parseFloat(this.form.money),
                rate = parseFloat(this.form.rate)/100
            var rate_normal = diffDay * sum * rate;

            if(this.dateDiff(this.form.beginTime,"2014-08-01") > 0 && this.dateDiff("2014-08-01",this.form.endTime) < 0){
                var rate_overdue = diffDay * sum * category * 2;
            }else if(this.dateDiff(this.form.beginTime,"2014-08-01") > 0 && dateDiff("2014-08-01",this.form.endTime) > 0){
                var rate_overdue = (this.dateDiff(this.form.beginTime,"2014-08-01") * sum * category * 2) + (this.dateDiff("2014-08-01",this.form.endTime) * sum  * 0.000175);
            }else{
                var rate_overdue = diffDay * sum * 0.000175;
            }
            
            var rate_all = rate_overdue + rate_normal;
            this.resultObj = {
                mormal:rate_normal.toFixed(2), //一般债务利息：
                double:rate_overdue.toFixed(2),//加倍部分债务利息：
                lazy:rate_all.toFixed(2)//延迟期间债务利息：
            }
        },
        dateDiff(startTime, endTime){
            var st = new Date(startTime);
            var et = new Date(endTime);
            return (et.getTime() - st.getTime()) / 86400000;
        },
        dateAddHeng(value){
            return value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8);//当前键值日期格式化
        }
    }
}
</script>

<style lang=less>
    .u-award-overdue{

    }
</style>
