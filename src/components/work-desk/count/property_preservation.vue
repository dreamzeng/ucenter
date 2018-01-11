<!--财产保全计算器-->
<template>
  <div class="u-property-oreservation">
        <div class="u-ct-container">
            <Form ref="countForm" :model="form" :rules="rules" :label-width="180">
                <FormItem label="诉讼标的（元）：" prop="money">
                    <Input placeholder="请输入标的金额" v-model.number="form.money"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="countHandler" type="primary">计算</Button>
                    <Button @click="resetHandler">重置</Button>
                </FormItem>
            </Form>
            <Form :label-width="170">
                <FormItem label="受理费（元）:">
                        <div>{{countValue}}</div>
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
                money:null
            },
            rules:{
                money:[
                    {required: true, message: '请输入标的金额'},
                    {type:'number',required: true, message: '标的金额只能输入数值'}
                ]
            },
            countValue:''
        }
    },
    methods:{
        countHandler(){
            this.$refs['countForm'].validate(valid => {
                if (valid){
                    var iptmoney = parseFloat(this.form.money)
                    var qb = 1;
                    if(iptmoney <= 1000){
                        this.countValue = (30*qb).toFixed(2)
                        return false;
                    }
                    if(iptmoney > 1000 && iptmoney <= 100000){
                        var caichansumMoney = (30 + (iptmoney - 1000)*0.01)*qb;
                        this.countValue = caichansumMoney.toFixed(2)
                        return false;
                    }
                    if(iptmoney > 100000){
                        var caichansumMoney = (30 + (100000 - 1000)*0.01 + (iptmoney - 100000)*0.005)*qb;
                        if(caichansumMoney > 5000){
                            caichansumMoney = 5000;
                        }
                        this.countValue = caichansumMoney.toFixed(2)
                        return false;
                    }  
                }
            })
        },
        resetHandler(){
            this.form = {
                money:''
            }

            this.countValue = ''
        }
    }
}
</script>

<style lang=less>
    .u-property-oreservation{

    }
</style>
