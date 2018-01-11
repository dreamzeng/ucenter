<template>
  <div class="u-pjyc-container">
        <!-- <pjyc-forcast></pjyc-forcast> -->
        <div class="u-ct-container u-pjyc-crime">
            <div class="u-crime-detail">
                <div class="u-crime-type" :class="{'u-pjyc-active': crimeType == 1}" @click="crimeType = 1">
                    <span class="crime-img"><img src="http://static.fy13322.com/front/lawyer/public/images/crimeC1.png" alt="盗窃罪"></span>
                    <span class="crime-text">盗窃罪</span>
                </div>
                <div class="u-crime-type" :class="{'u-pjyc-active': crimeType == 2}" @click="crimeType = 2">
                    <span class="crime-img"><img src="http://static.fy13322.com/front/lawyer/public/images/crime2.png" alt="诈骗罪"></span>
                    <span class="crime-text">诈骗罪</span>
                </div>
                <div class="u-crime-type" :class="{'u-pjyc-active': crimeType == 3}" @click="crimeType = 3">
                    <span class="crime-img"><img src="http://static.fy13322.com/front/lawyer/public/images/crime3.png" alt="危险驾驶罪"></span>
                    <span class="crime-text">危险驾驶罪</span>
                </div>
                <div class="u-crime-type"  :class="{'u-pjyc-active': crimeType == 4}" @click="crimeType = 4">
                    <span class="crime-img"><img src="http://static.fy13322.com/front/lawyer/public/images/crime4.png" alt="交通肇事罪"></span>
                    <span class="crime-text">交通肇事罪</span>
                </div>
                <div class="u-crime-type" :class="{'u-pjyc-active': crimeType == 5}" @click="crimeType = 5">
                    <span class="crime-img"><img src="http://static.fy13322.com/front/lawyer/public/images/crime4.png" alt="故意伤害罪"></span>
                    <span class="crime-text">故意伤害罪</span>
                </div>
            </div>
            <!-- 盗窃罪 -->
            <div class="u-dq-attr-container" v-if="crimeType == 1">
                <u-panel title="基本属性（多选）" class="u-dq-attr u-ml-30">
                    <CheckboxGroup  v-model="dqForm.dqAttr">
                        <Checkbox label="未遂">未遂</Checkbox>
                        <Checkbox label="累犯">累犯</Checkbox>
                        <Checkbox label="自首">自首</Checkbox>
                        <Checkbox label="认罪">认罪</Checkbox>
                    </CheckboxGroup>
                </u-panel>
                <u-panel title="是否返回赃物" class="u-dq-return u-ml-30" >
                    <RadioGroup v-model="dqForm.dqReturned" type="button">
                        <Radio label="未返还"></Radio>
                        <Radio label="已返还"></Radio>
                    </RadioGroup>
                </u-panel>
                <u-panel class="u-dq-return">
                    <Form :model="dqForm" :label-width="100">
                        <FormItem label="涉案金额：">
                            <Input v-model="dqForm.input" placeholder="请输入涉案金额"></Input>
                        </FormItem>
                    </Form>
                </u-panel>
            </div>

            <!-- 诈骗罪 -->
            <div class="u-zp-attr-container"  v-if="crimeType == 2">
                <u-panel title="基本属性（多选）" class="u-zp-attr u-ml-30">
                    <CheckboxGroup v-model="zpForm.zpAttr">
                        <Checkbox label="未遂">未遂</Checkbox>
                        <Checkbox label="累犯">累犯</Checkbox>
                        <Checkbox label="自首">自首</Checkbox>
                        <Checkbox label="认罪">认罪</Checkbox>
                    </CheckboxGroup>
                </u-panel>
                <div class="clearfix u-zp-return">
                    <u-panel title="是否赔偿" class=" u-ml-30 u-zp-pc">
                        <RadioGroup type="button" v-model="zpForm.isCompensate">
                            <Radio label="未赔偿"></Radio>
                            <Radio label="已赔偿"></Radio>
                        </RadioGroup type="button">
                    </u-panel>
                    <u-panel title="是否返还" class="u-zp-fh">
                        <RadioGroup type="button" v-model="zpForm.zpReturned">
                            <Radio label="未返回"></Radio>
                            <Radio label="已返还"></Radio>
                        </RadioGroup type="button">
                    </u-panel>
                </div>
                <u-panel class="u-zp-return">
                    <Form :model="zpForm" :label-width="100">
                        <FormItem label="涉案金额：">
                            <Input v-model="zpForm.input" placeholder="请输入涉案金额"></Input>
                        </FormItem>
                    </Form>
                </u-panel>
            </div>

            <!-- 危险驾驶 -->
            <div class="u-wxjs-attr-container"  v-if="crimeType == 3">
                <u-panel title="基本属性（多选）" class="u-wxjs-attr u-ml-30">
                    <CheckboxGroup v-model="wxjsForm.wxjsAttr">
                        <Checkbox label="自首">自首</Checkbox>
                        <Checkbox label="认罪">认罪</Checkbox>
                    </CheckboxGroup>
                </u-panel>
                <u-panel title="类型（多选）" class="u-wxjs-return u-ml-30" >
                    <CheckboxGroup v-model="wxjsForm.wxjsType">
                        <Checkbox label="无证驾驶">无证驾驶</Checkbox>
                        <Checkbox label="醉驾">醉驾</Checkbox>
                        <Checkbox label="超载">超载</Checkbox>
                        <Checkbox label="逃逸">逃逸</Checkbox>
                    </CheckboxGroup>
                </u-panel>
            </div>

            <!-- 交通肇事 -->
            <div class="u-jtzs-attr-container"  v-if="crimeType == 4">
                <u-panel title="基本属性（多选）" class="u-jtzs-attr u-ml-50">
                    <CheckboxGroup v-model="jtzsForm.jtzsAttr">
                        <Checkbox label="自首">自首</Checkbox>
                        <Checkbox label="认罪">认罪</Checkbox>
                    </CheckboxGroup>
                </u-panel>
                <div title="类型（多选）" class="u-jtzs-return u-ml-50">
                    <CheckboxGroup v-model="jtzsForm.jtzsType">
                        <Checkbox label="无证驾驶">无证驾驶</Checkbox>
                        <Checkbox label="醉驾">醉驾</Checkbox>
                        <Checkbox label="超载">超载</Checkbox>
                        <Checkbox label="逃逸">逃逸</Checkbox>
                    </CheckboxGroup>
                </div>
                <u-panel class="u-jtzs-return">
                    <Form :model="jtzsForm" :label-width="100">
                        <FormItem label="重伤：">
                            <Input v-model="jtzsForm.input" placeholder="请输入重伤人数"></Input>
                        </FormItem>
                        <FormItem label="死亡：">
                            <Input v-model="jtzsForm.input" placeholder="请输入死亡人数"></Input>
                        </FormItem>
                    </Form>
                </u-panel>
            </div>

            <!-- 故意伤害罪 -->
            <div class="u-gysh-attr-container"  v-if="crimeType == 5">
                <u-panel title="基本属性（多选）" class="u-gysh-attr u-ml-50">
                    <CheckboxGroup v-model="gyshForm.gyshAttr">
                        <Checkbox label="未遂">未遂</Checkbox>
                        <Checkbox label="累犯">累犯</Checkbox>
                        <Checkbox label="自首">自首</Checkbox>
                        <Checkbox label="认罪">认罪</Checkbox>
                    </CheckboxGroup>
                </u-panel>
                <div class="clearfix u-gysh-return">
                    <u-panel title="是否赔偿" class="u-gysh-pc u-ml-50">
                        <RadioGroup type="button" v-model="gyshForm.isCompensate">
                            <Radio label="未赔偿"></Radio>
                            <Radio label="已赔偿"></Radio>
                        </RadioGroup type="button">
                    </u-panel>
                </div>
                <u-panel class="u-gysh-return">
                    <Form :model="gyshForm" :label-width="100">
                        <FormItem label="重伤：">
                            <Input v-model="gyshForm.input" placeholder="请输入重伤人数"></Input>
                        </FormItem>
                        <FormItem label="死亡：">
                            <Input v-model="gyshForm.input" placeholder="请输入死亡人数"></Input>
                        </FormItem>
                        <FormItem label="轻伤：">
                            <Input v-model="gyshForm.input" placeholder="请输入轻伤人数"></Input>
                        </FormItem>
                    </Form>
                </u-panel>
            </div>
            <div class="u-pyjc-prediction-btn">
                <Button type="primary" shape="circle">判决预测</Button>
            </div>

        </div>
  </div>
</template>

<script>
import PjycForcast from './pjyc_forecast' 
export default {
    components: {
        PjycForcast
    },
    data(){
        return {
            crimeType:1, // 1-盗窃罪   2-诈骗罪  3-危险驾驶罪  4-交通肇事罪  5-故意伤害罪
            dqForm:{
                dqAttr:[],
                dqReturned:''
            },
            zpForm:{
                zqAttr:[],
                isCompensate:'',
                zpReturned:''
            },
            wxjsForm:{
                wxjsAttr:[],
                wxjsType:[]
            },
            jtzsForm:{
                jtzsAttr:[],
                jtzsType:[]
            },
            gyshForm: {
                gyshAttr:[],
                isCompensate:''
            }
        }
    }
}
</script>

<style lang=less>
    @import '../../../assets/less/work-desk.less';
    @w-58: 58px;
    .u-pjyc-container{
        .u-pjyc-crime{
            padding: 30px;
            .u-crime-detail{
                margin-bottom: 50px;
                height: 160px;
                background: #fafafa;
                /* 犯罪类型 */
                .u-crime-type{
                    cursor: pointer;
                    width: 20%;
                    padding: 30.5px 0px;
                    float: left;
                    border-right: 1px solid #ccc;
                    text-align: center;
                    &:last-of-type{
                        border: 0px;
                    }
                    span.crime-img, span.crime-text{
                        display: block;
                    }
                    span.crime-text{
                        margin-top: 14px;
                    }
                }
            }
            /* 当前选择 */
            .u-pjyc-active{
                background: #fff;
            }

            .u-ml-30{
                margin-left: 30px;
                width: 96%;
            }
            .u-ml-50{
                margin-left: 50px;
                width: 93%;
            }


            .func(@name){
                /* 盗窃罪 */
                .u-@{name}-attr-container{
                    .u-@{name}-attr{
                        padding-bottom: @w-58;
                        border-bottom: 1px solid #eee;
                    }
                    .u-@{name}-return{
                        margin-top: @w-58;
                        .u-@{name}-money{
                            margin-left: -18px;
                            input{
                                border-radius: 20px;
                                width: 30%;
                            }
                        }
                    }
                }
            }

            /* 盗窃 */
            .func(dq);
            /* 诈骗 */
            .func(zp);
            .u-zp-pc, .u-zp-fh{
                float: left;
                width: 50%;
            }
            .u-zp-pc{
                width: 45%;
            }
            /* 危险驾驶 */
            .func(wxjs);
            /* 交通肇事 */
            .func(jtzs);
            /* 故意伤害 */
            .func(gysh);


            .u-pyjc-prediction-btn{
                width: 100%;
                margin-top: 20px;
                text-align: center;
            }
        }
        
    }
</style>
