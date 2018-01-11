<template>
    <div class="u-count-gspcj-container">
        <div class="u-ct-container">
            <Form ref="form" :model="form" :rules="rules" :label-width="100">
                <FormItem label="伤残等级：" prop="scdj">
                    <Select v-model="form.scdj" placeholder="请选择">
                        <Option label="一级伤残" value="1"></Option>
                        <Option label="二级伤残" value="2"></Option>
                        <Option label="三级伤残" value="3"></Option>
                        <Option label="四级伤残" value="4"></Option>
                        <Option label="五级伤残" value="5"></Option>
                        <Option label="六级伤残" value="6"></Option>
                        <Option label="七级伤残" value="7"></Option>
                        <Option label="八级伤残" value="8"></Option>
                        <Option label="九级伤残" value="9"></Option>
                        <Option label="十伤残" value="10"></Option>
                    </Select>
                </FormItem>
                <FormItem label="平均月薪：" prop="month_get">
                    <Input v-model.number="form.month_get" placeholder="请输入平均月薪"></Input>
                </FormItem>
                <FormItem>
                    <Button shape="circle" type="primary" @click="countHandler" round>计 算</Button>
                </FormItem>
            </Form>
            <div class="u-count-result clearfix">
                <div class="u-swf u-count-base">
                    <div class="u-count-text">
                        <p>赔偿费用</p>
                        <p class="u-number">{{parseInt(result.gspc||0)}}</p>
                    </div>
                </div>
                <div class="u-szf u-count-base">
                    <div class="u-count-text">
                        <p>伤残津贴/月</p>
                        <p class="u-number">{{parseInt(result.gsjt || 0)}}</p>
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
            form: {
                scdj:'',
                month_get: null
            },
            result: {
                gsjt:'', //津贴
                gspc:'' // 赔偿
            },
            rules:{
                scdj:[
                    {type: 'string', required: true, message: '请选择伤残等级', trigger: 'change'}
                ],
                month_get:[
                    {required: true, message: '请输入平均月薪'},
                    {type: 'number', message: '工资只能为数字'}
                ]
            }
        }
    },
    methods: {

        /**工伤津贴的方法*
         *
         *grade:伤残等级
        **/
        iib(grade) {
            var ratio = 0;
            switch (parseInt(grade)) {
                case 1:
                    ratio = 0.90;
                    break;
                case 2:
                    ratio = 0.85;
                    break;
                case 3:
                    ratio = 0.80;
                    break;
                case 4:
                    ratio = 0.75;
                    break;
                case 5:
                    ratio = 0.70;
                    break;
                case 6:
                    ratio = 0.60;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                default:
                    ratio = 0;
                    break;
            }
            return ratio;
        },
        /**工伤赔偿的方法*
         *
         *grade:伤残等级
        **/
        iim(grade) {
            var ratio = 0;
            switch (parseInt(grade)) {
                case 1:
                    ratio = 27;
                    break;
                case 2:
                    ratio = 25;
                    break;
                case 3:
                    ratio = 23;
                    break;
                case 4:
                    ratio = 21;
                    break;
                case 5:
                    ratio = 18;
                    break;
                case 6:
                    ratio = 16;
                    break;
                case 7:
                    ratio = 13;
                    break;
                case 8:
                    ratio = 11;
                    break;
                case 9:
                    ratio = 9;
                    break;
                case 10:
                    ratio = 7;
                    break;
                default:
                    ratio = 0;
                    break;
            }
            return ratio;
        },
        countHandler(){
            this.$refs['form'].validate(valid => {
                //工商赔偿
                this.result.gspc = this.form.month_get * this.iim(this.form.scdj)
                //工伤津贴
                this.result.gsjt = this.form.month_get * this.iib(this.form.scdj)
            })
        }
    }
}
</script>

<style lang=less>
    @import '../../../assets/less/work-desk.less';
    .u-count-jtpcj-container{

    }
</style>
