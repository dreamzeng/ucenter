<!--个人所得税-->
<template>
  <div class="u-personal-tax">
        <div class="u-ct-container">
            <Form ref="countForm" :model="form" :rules="rules" :label-width="180">
                    <FormItem label="收入类型：">
                        <Select v-model="form.type" placeholder="请选择收入类型">
                            <Option value="1" key="1" >工资、薪金所得</Option>
                            <Option value="2" key="2" >个体工商户生产、经营所得</Option>
                            <Option value="3" key="3" >对企事业单位的承包经营</Option>
                            <Option value="4" key="4" >劳务报酬所得</Option>
                            <Option value="5" key="5" >稿酬所得</Option>
                            <Option value="6" key="6" >特许权使用费所得</Option>
                            <Option value="7" key="7" >财产租赁所得</Option>
                            <Option value="8" key="8" >财产转让所得</Option>
                            <Option value="9" key="9" >利息、股息、红利所得</Option>
                            <Option value="10" key="10" >偶然所得</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="收入总额（元）：" prop="money">
                        <Input placeholder="请输入收入金额" v-model.number="form.money"></Input>
                    </FormItem>
                    <FormItem v-if="form.type==1" label="税前扣除的三险一金（元）：" prop="iptmoney">
                        <Input placeholder="请输入金额" v-model.number="form.iptmoney"></Input>
                    </FormItem>
                    <FormItem v-if="form.type==1" label="起征额（元）：" prop="thresholdValue">
                        <Input placeholder="请输入收入起征额" v-model.number="form.thresholdValue"></Input>
                    </FormItem>
                    
                    <FormItem>
                        <Button @click="countHandler" type="primary">计算</Button>
                        <Button @click="resetHandler">重置</Button>
                    </FormItem>
                </Form>
                <Form :label-width="170">
                    <FormItem label="应缴税款（元）:">
                            <div>{{resultObj.taxpayable}}</div>
                    </FormItem>
                    <FormItem label="税后收入（元）:">
                            <div>{{resultObj.afterTaxIncome}}</div>
                    </FormItem>
                </Form>
        </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            form:{
                money:null,
                type:'1',
                iptmoney:null,
                thresholdValue:3500
            },
            rules:{
                money:[
                    {required: true, message: '请输入收入金额'},
                    {type:'number', message: '金额只能输入数值'}
                ],
                iptmoney:[
                    {required: true, message: '请输入金额'},
                    {type:'number', message: '金额只能输入数值'}
                ],
                thresholdValue:[
                    {required: true, message: '请输入起征额'},
                    {type:'number', message: '起征额只能输入数值'}
                ]
            },
            resultObj:{
                taxpayable:'', //应交税
                afterTaxIncome:'' //税后收入
            }
        }
    },
    methods:{
        countHandler(){
            this.$refs['countForm'].validate(valid => {
                if (valid){
                    let type = this.form.type
                    if('1' == type){
                        this.count_1()
                    }else if('2' == type || '3' == type){
                        this.count_2_3()
                    }else if('4' == type){
                        this.count_4()
                    }else if('5' == type){
                        this.count_5()
                    }else if('6' == type || '7' == type){
                        this.count_6_7()
                    }else if('8' == type || '9' == type || '10' == type){
                        this.count_8_9_10()
                    }
                }
            })
        },
        resetHandler(){
            this.form = {
                money:null,
                type:'1',
                iptmoney:null,
                thresholdValue:3500
            }
            this.resultObj = {
                taxpayable:'', //应交税
                afterTaxIncome:'' //税后收入
            }
        },
        //工资、薪金所得
        count_1(){
            //应缴个人所得税的计算公式为=（月应税收入-3500）*税率-速算扣除数
            var v =  parseFloat(this.form.money)-parseFloat(this.form.iptmoney)-parseFloat(this.form.thresholdValue);
            var taxpayable = ''
            if(v<=1500){
                taxpayable = v*0.03 - 0;
            }
            else if(v<=4500){
                taxpayable = v*0.1 - 105;
            }
            else if(v<=9000){
                taxpayable = v*0.2 - 555;
            }
            else if(v<=35000){
                taxpayable = v*0.25 - 1005;
            }
            else if(v<=55000){
                taxpayable = v*0.3 - 2755;
            }
            else if(v<=80000){
                taxpayable = v*0.35 - 5505;
            }
            else{
                taxpayable = v*0.45 - 13505;
            }
            var afterTaxIncome = this.form.money-this.form.iptmoney-taxpayable ; //税后收入
            this.resultObj = {
                taxpayable:taxpayable.toFixed(2), //应交税
                afterTaxIncome:afterTaxIncome.toFixed(2) //税后收入
            }
        },
        //个体工商户生产、经营所得 和对企事业单位的承包经营、承租经营所得适用
        count_2_3(){
            var grossReceipts = parseFloat(this.form.money)
            var taxpayable = 0
            if(grossReceipts<=15000){
                taxpayable = grossReceipts*0.05 - 0;
            }
            else if(grossReceipts<=30000){
                taxpayable = grossReceipts*0.1 - 750;
            }
            else if(grossReceipts<=60000){
                taxpayable = grossReceipts*0.2 - 3750;
            }
            else if(grossReceipts<=100000){
                taxpayable = grossReceipts*0.3 - 9750;
            }
            else{
                taxpayable = grossReceipts*0.35 - 14750; 
            }
            var afterTaxIncome = grossReceipts-taxpayable ; //税后收入
            this.resultObj = {
                taxpayable:taxpayable.toFixed(2), //应交税
                afterTaxIncome:afterTaxIncome.toFixed(2) //税后收入
            }
        },
        //劳务报酬所得
        count_4(){
            var v , grossReceipts = parseFloat(this.form.money), taxpayable = 0; //应税金额
            if(grossReceipts<=4000){
                v = grossReceipts-800;
            }
            else{
                v = grossReceipts-(grossReceipts*0.2); 
            }
            if(v<=20000){
                taxpayable = v*0.2;
            }
            else if(v<=50000){
                taxpayable = v*0.3 - 2000;
            } 
            else if(v>50000) {
                taxpayable = v*0.4 - 7000;
            } 
            var afterTaxIncome = grossReceipts-taxpayable ; //税后收入
            this.resultObj = {
            taxpayable:taxpayable.toFixed(2), //应交税
            afterTaxIncome:afterTaxIncome.toFixed(2) //税后收入
            }
        },
        //稿酬所得
        count_5(){
            var v , grossReceipts = parseFloat(this.form.money), taxpayable = 0; //应税金额
            if(grossReceipts<=4000){
                v = grossReceipts-800;
            }
            else{
                v = grossReceipts-(grossReceipts*0.2); 
            }
            taxpayable = v*0.2*0.7;  //稿酬所得按应纳税所得减征30%。
            var afterTaxIncome = grossReceipts-taxpayable ; //税后收入
            this.resultObj = {
                taxpayable:taxpayable.toFixed(2), //应交税
                afterTaxIncome:afterTaxIncome.toFixed(2) //税后收入
            }
        },
        //特许权使用费所得、财产租赁所得
        count_6_7(){
            var v , grossReceipts = parseFloat(this.form.money), taxpayable = 0; //应税金额
            if(grossReceipts<=4000){
                v = grossReceipts-800;
            }
            else{
                v = grossReceipts-(grossReceipts*0.2); 
            }
            taxpayable = v*0.2;  
            var afterTaxIncome = grossReceipts-taxpayable ; //税后收入
            this.resultObj = {
            taxpayable:taxpayable.toFixed(2), //应交税
            afterTaxIncome:afterTaxIncome.toFixed(2) //税后收入
            }
        },
        //财产转让所得 \利息、股息、红利所得 \ 偶然所得
        count_8_9_10(){
            var taxpayable = parseFloat(this.form.money)*0.2;  
            var afterTaxIncome = parseFloat(this.form.money)-taxpayable ; //税后收入
            this.resultObj = {
                taxpayable:taxpayable.toFixed(2), //应交税
                afterTaxIncome:afterTaxIncome.toFixed(2) //税后收入
            }
        }
    }
}
</script>

<style lang=less>
    .u-personal-tax{

    }
</style>
