<!--离婚房产分隔-->
<template>
    <div class="u-divorce-house">
        <div class="u-ct-container">
            <Form ref="countForm" :model="form" :rules="rules" :label-width="180">
                <FormItem label="结婚时诉争房产价格（万）：" prop="marryMoney">
                    <Input placeholder="请输入金额" v-model.number="form.marryMoney"></Input>
                </FormItem>
                <FormItem label="离婚时诉争房产价格（万）：" prop="divorceMoney">
                    <Input placeholder="请输入金额" v-model.number="form.divorceMoney"></Input>
                </FormItem>
                <FormItem label="共同已还利息（万）：" prop="commonInterest">
                    <Input placeholder="请输入金额" v-model.number="form.commonInterest"></Input>
                </FormItem>
                <FormItem label="契税等其他费用（万）：" prop="otherMoney">
                    <Input placeholder="请输入金额" v-model.number="form.otherMoney"></Input>
                </FormItem>
                <FormItem label="共同还贷部分（万）：" prop="commonRepayment">
                    <Input placeholder="请输入金额" v-model.number="form.commonRepayment"></Input>
                </FormItem>
                
                <FormItem>
                    <Button @click="countHandler" type="primary">计算</Button>
                    <Button @click="resetHandler">重置</Button>
                </FormItem>
            </Form>
            <Form :label-width="180">
                <FormItem label="诉争房产的升值率">
                        <div>{{resultObj.appreciation}}</div>
                </FormItem>
                <FormItem label="婚后增值金额">
                        <div>{{resultObj.addedValue}}</div>
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
                marryMoney: null, //结婚房产价格
                divorceMoney: null, //离婚房产价格
                commonInterest: null, //共同已还利息
                otherMoney: null, // 其他费用
                commonRepayment: null //还贷费用
            },
            rules:{
                marryMoney:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                divorceMoney:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                commonInterest:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                otherMoney:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                commonRepayment:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ]
            },
            resultObj:{
                appreciation: '', //房产升值率
                addedValue: '' //增值金额
            }
        }
    },
    methods:{
        countHandler(){
            this.$refs['countForm'].validate(valid => {
                if (valid){
                    var v = parseFloat(this.form.marryMoney) + parseFloat(this.form.commonInterest )+ parseFloat(this.form.otherMoney)
                
                    this.resultObj.appreciation = ((parseFloat(this.form.divorceMoney)/v).toFixed(2))*100+'%';
                    this.resultObj.addedValue = (parseFloat(this.form.commonRepayment)*(parseFloat(this.form.divorceMoney)/v)).toFixed(2);
                }
            })
        },
        resetHandler(){
            this.form = {
                marryMoney: '', //结婚房产价格
                divorceMoney: '', //离婚房产价格
                commonInterest: '', //共同已还利息
                otherMoney: '', // 其他费用
                commonRepayment: '' //还贷费用
            }

            this.resultObj = {
                appreciation: '', //房产升值率
                addedValue: '' //增值金额
            }
        }
    }
}
</script>

<style lang=less>
    .u-divorce-house{

    }
</style>
