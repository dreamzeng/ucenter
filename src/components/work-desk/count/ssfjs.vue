<template>
    <div class="u-count-ssfjs-container">
        <div class="u-ct-container">
            <Form ref="form" :model="form" :label-width="100">
                <FormItem label="计算类型：">
                    <Select v-model="form.countType" placeholder="请选择">
                        <Option v-for="(key, value, index) in countTypeObj" :key="index" 
                            :label="key" 
                            :value="value"></Option>
                    </Select>
                </FormItem>
                <FormItem label="金额：">
                    <Input v-model="form.month_get" placeholder="请输入平均月薪"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="countHandler" shape="circle">计 算</Button>
                </FormItem>
            </Form>
            <div class="u-count-result clearfix">
                <div class="u-swf u-count-base">
                    <div class="u-count-text">
                        <p>{{countTypeObj[form.countType]}}</p>
                        <p class="u-number">{{parseInt(result.countVal||0)}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            countTypeObj:{
                1: '诉讼费',
                2: '保全费',
                3: '执行费',
                4: '离婚案',
                5: '人格权纠纷'
            },
            form: {
                countType:'',
                money: ''
            },
            result: {
                countVal:''
            }
        }
    },
    methods: {
        countHandler(){
            this.result.countVal = this.sstype(this.form.countType, this.form.money)
        },
        sstype(type, money) {
            //案件诉讼费
            if (type == 1) {
                var result = 0;
                if ((money > 0) && (money <= 10000)) {
                    result = 50;
                } else if ((money > 10000) && (money <= 100000)) {
                    result = (money - 10000) * 0.025 + 50;
                } else if ((money > 100000) && (money <= 200000)) {
                    result = (money - 100000) * 0.02 + 2300;
                } else if ((money > 200000) && (money <= 500000)) {
                    result = (money - 200000) * 0.015 + 4300;
                } else if ((money > 500000) && (money <= 1000000)) {
                    result = (money - 500000) * 0.01 + 8800;
                } else if ((money > 1000000) && (money <= 2000000)) {
                    result = (money - 1000000) * 0.009 + 13800;
                } else if ((money > 2000000) && (money <= 5000000)) {
                    result = (money - 2000000) * 0.008 + 22800;
                } else if ((money > 5000000) && (money <= 10000000)) {
                    result = (money - 5000000) * 0.007 + 46800;
                } else if ((money > 10000000) && (money <= 20000000)) {
                    result = (money - 10000000) * 0.006 + 81800;
                } else if (money > 20000000) {
                    result = (money - 20000000) * 0.005 + 141800;
                }
                return result;
            }

            //案件保全费
            if (type == 2) {
                var result = 0;
                if ((money > 0) && (money <= 1000)) {
                    result = 30;
                } else if ((money > 1000) && (money <= 100000)) {
                    result = money * 0.01 + 20;
                } else if (money > 100000) {
                    result = money * 0.005 + 520;
                }
                if (result >= 5000) {
                    result = 5000;
                }
                return result;
            }

            //案件执行费
            if (type == 3) {
                var result = 0;
                if ((money > 0) && (money < 10000)) {
                    result = 50;
                } else if ((money >= 10000) && (money <= 500000)) {
                    result = (money - 10000) * 0.015 + 50;
                } else if ((money >= 500000) && (money <= 5000000)) {
                    result = (money - 500000) * 0.01 + 7400;
                } else if ((money >= 5000000) && (money <= 10000000)) {
                    result = (money - 5000000) * 0.005 + 52400;
                } else if (money > 10000000) {
                    result = (money - 10000000) * 0.001 + 77400;
                }
                return result;
            }

            //离婚费
            if (type == 4) {
                var result_min = 0;
                var result_max = 0;
                var result = "";
                if ((money > 0) && (money <= 200000)) {
                    result = "300--500";
                } else if (money > 200000) {
                    result_min = (money - 200000) * 0.005 + 50;
                    result_max = (money - 200000) * 0.005 + 300;
                    result = result_min + "--" + result_max;
                }

                if (money <= 0) {
                    result = 0;
                }
                return result;
            }

            //人格纠纷
            if (type == 5) {
                var result_max = 0;
                var result_min = 0;
                var result = "";
                if (money <= 50000) {
                    result = "300--500"
                } else if (money > 50000 && money <= 100000) {
                    result_min = (money - 50000) * 0.01 + 100;
                    result_max = (money - 50000) * 0.01 + 500;
                    result = result_min + "--" + result_max;
                } else if (money > 100000) {
                    result_min = (money - 100000) * 0.005 + 600;
                    result_max = (money - 100000) * 0.005 + 1000;
                    result = result_min + "--" + result_max;
                }
                return result;
            }
        }
    }
}
</script>

<style lang=less>
    @import '../../../assets/less/work-desk.less';
    .u-count-ssfjs-container{

    }
</style>
