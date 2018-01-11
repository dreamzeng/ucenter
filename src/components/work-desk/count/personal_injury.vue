<!--人身损害计算-->

<template>
    <div class="u-personal-injury">
        <div class="u-ct-container">
            <Form :model="form" ref="countForm" :label-width="120" :rules="rules">
                <FormItem label="选择地区：">
                    <Select v-model="form.province" placeholder="请选择地区" filterable>
                        <Option
                            v-for="item in provincefrom"
                            :key="item.name"
                            :value="item.name">{{item.py}}-{{item.name}}
                        </Option>
                        </Select>
                    </FormItem>
                <FormItem label="选择户口：">
                    <RadioGroup v-model="form.account">
                        <Radio label="城镇"></Radio>
                        <Radio label="农村"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否伤亡：">
                    <RadioGroup v-model="form.isDied">
                        <Radio label="是"></Radio>
                        <Radio label="否"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="伤残项：" v-if="form.isDied == '否'">
                    <RadioGroup v-model="form.level">
                        <Radio label="单级"></Radio>
                        <Radio label="多级"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="伤残等级：" v-if="form.isDied == '否'">
                    <Select v-if="form.level=='单级'" v-model="form.level_single" placeholder="请选择伤残等级">
                        <Option key="1" value="1" >一级</Option>
                        <Option key="2" value="2" >二级</Option>
                        <Option key="3" value="3" >三级</Option>
                        <Option key="4" value="4" >四级</Option>
                        <Option key="5" value="5" >五级</Option>
                        <Option key="6" value="6" >六级</Option>
                        <Option key="7" value="7" >七级</Option>
                        <Option key="8" value="8" >八级</Option>
                        <Option key="9" value="9" >九级</Option>
                        <Option key="10" value="10" >十级</Option>
                    </Select>
                    <span v-if="levelMultiList.length == 0" @click="()=>multiLevelModal=true">
                        <Input readonly  v-if="form.level!='单级'" placeholder="请选择伤残等级"/>
                    </span>
                    <ul  v-if="levelMultiList.length > 0" class="dengji-multi-list">
                        <li class="detail" v-for="(o, index) in levelMultiList" :key="index">
                            {{number_json[o.key.split('-')[0]]}}有{{o.key.split('-')[1]}}处
                        </li>
                    </ul>
                </FormItem>
                <FormItem label="年龄：" prop="age" v-if="form.isDied == '否'">
                    <Input placeholder="请输入年龄" v-model.number="form.age"></Input>
                </FormItem>
                <FormItem label="误工费（元）：" prop="lostIncome">
                    <Input placeholder="请输入金额" v-model.number="form.lostIncome"></Input>
                </FormItem>
                <FormItem label="被抚养人生活费（元）：" prop=maintenance>
                    <Input placeholder="请输入金额" v-model.number="form.maintenance"></Input>
                </FormItem>
                <FormItem label="交通费（元）：" prop="transportation">
                    <Input placeholder="请输入金额" v-model.number="form.transportation"></Input>
                </FormItem>
                <FormItem label="医疗费（元）：" prop="medicalCharge">
                    <Input placeholder="请输入金额" v-model.number="form.medicalCharge"></Input>
                </FormItem>
                <FormItem label="住宿费（元）：" prop="accommodation">
                    <Input placeholder="请输入金额" v-model.number="form.accommodation"></Input>
                </FormItem>
                
                <FormItem>
                    <Button @click="countHandler" type="primary">计算</Button>
                    <Button @click="resetHandler">重置</Button>
                </FormItem>
            </Form>
            <Form :model="resultObj" ref="resultForm" :label-width="120">
                <FormItem label="总计赔偿金额（元）:">{{resultObj.allMoney}}</FormItem>
                <FormItem label="伤残赔偿金（元）：">{{resultObj.disabilityMoney}}</FormItem>
            </Form>
        </div>
        <Modal
            :closable="false"
            width="316"
            v-model="multiLevelModal">
                <div slot="header" class="died-dialog-title">
                    <span>伤残等级</span>
                    <span>几处</span>
                </div>
                <div>
                    <ul class="level-multi-list clearfix">
                        <li v-for="(value, key) in number_json" :key="key">
                            <span>{{value}}</span>
                            <span>
                                <div class="u-add-minus">
                                    <span class="u-minus" @click="minus(key)">-</span>
                                        <input class="u-num" readonly v-model="levelObj[key]" type="text">
                                    <span class="u-minus" @click="add(key)">+</span>
                                </div>
                            </span>
                        </li>
                    </ul>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button @click="multiLevelModal = false">取 消</Button>
                    <Button type="primary" @click="select_level_ok">确 定</Button>
                </span>
        </Modal>
    </div>
</template>

<script>
let provincefrom = require('./provincefrom.json')
var number_json = {
    1: '一级',
    2: '二级',
    3: '三级',
    4: '四级',
    5: '五级',
    6: '六级',
    7: '七级',
    8: '八级',
    9: '九级',
    10: '十级'
};
var city_json = {
    '北京': '57275',
    '天津': '34074',
    '上海': '57692',
    '江苏省': '40152',
    '河北省': '28249',
    '河南省': '27233',
    '湖南省': '31284',
    '湖北省': '33616',
    '浙江省': '47237',
    '云南省': '28611',
    '陕西省': '28440',
    '贵州省': '26742.62',
    '广西壮族自治区': '28234',
    '黑龙江省': '31195',
    '甘肃省': '20804',
    '吉林省': '26530.42',
    '四川省': '28335',
    '广东省': '37684.3',
    '江西省': '28670',
    '青海省': '26757',
    '辽宁省': '32860',
    '山东省': '34012',
    '西藏自治区': '20023',
    '重庆': '29610',
    '福建省': '36014',
    '新疆维吾尔自治区': '28463.4',
    '内蒙古自治区': '32975',
    '山西省': '27352',
    '海南省': '28453',
    '宁夏回族自治区': '27153',
    '安徽省': '29156'
};
var rural_json = {
    '北京': '22310',
    '天津': '15405',
    '上海': '25520',
    '江苏省': '17606',
    '河北省': '11919',
    '河南省': '11697',
    '湖南省': '11930',
    '湖北省': '12363',
    '浙江省': '22866',
    '云南省': '9020',
    '陕西省': '9396',
    '贵州省': '8090.28',
    '广西壮族自治区': '10359',
    '黑龙江省': '11422',
    '甘肃省': '5376',
    '吉林省': '12122.94',
    '四川省': '11203',
    '广东省': '14512.2',
    '江西省': '12140',
    '青海省': '8664',
    '辽宁省': '12870',
    '山东省': '13954',
    '西藏自治区': '6578',
    '重庆': '11549',
    '福建省': '14999',
    '新疆维吾尔自治区': '10183.2',
    '内蒙古自治区': '11609',
    '山西省': '10082',
    '海南省': '11843',
    '宁夏回族自治区': '9852',
    '安徽省': '11720'
};
export default {
    data(){
        return {
            multiLevelModal: false,
            provincefrom,
            number_json,
            levelMultiList: [],
            levelObj: {}, //多个等级对象
            form: {
                province: "北京", //地区
                account: "城镇", //户口
                isDied: "否", //伤亡
                level: "单级", //伤残等级
                level_single: "1", //单级
                age: "", //年龄
                lostIncome: "", //误工费
                maintenance: "", //生活费
                transportation: "", //交通费
                medicalCharge: "",  //医疗费
                accommodation: "" //住宿费
            },
            resultObj:{
                allMoney: '',  //总赔偿金
                disabilityMoney: '' //伤残赔偿金
            },
            rules:{
                age:[
                    {type: 'number', required: true, message: '请输入年龄'},
                    {type: 'number', max:200, required: true, message: '年龄不能大于200'},
                    {type: 'number', min:1, required: true, message: '年龄最小为1'}
                ],
                lostIncome:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                maintenance:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                transportation:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                medicalCharge:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ],
                accommodation:[
                    {required: true, message: '请输入金额'},
                    {type:'number', required: true, message: '金额只能输入数值'}
                ]
            }
        }
    },
    mounted(){
        this.initLevelObj()
    },
    methods: {
        initLevelObj() {
            Object.keys(this.number_json).forEach(key=>{
                this.$set(this.levelObj, key, 0)
            })
        },
        minus(key){
            if(this.levelObj[key] == 0){
                return
            }
            this.levelObj[key] = parseInt(this.levelObj[key]) - 1
        },
        add(key){
            this.levelObj[key] = parseInt(this.levelObj[key]) + 1
        },
        select_level_ok(){
            this.levelMultiList = []
            Object.keys(this.levelObj).forEach(key=>{
                if(parseInt(this.levelObj[key]) > 0){
                this.levelMultiList.push({
                    "key":key + '-' + this.levelObj[key]
                })
                }
            })
            this.multiLevelModal = false
        },
        resetHandler(){
            this.form = {
                province: "110000", //地区
                account: "城镇", //户口
                isDied: "否", //伤亡
                level: "单级", //伤残等级
                level_single: "1", //单级
                age: "", //年龄
                lostIncome: "", //误工费
                maintenance: "", //生活费
                transportation: "", //交通费
                medicalCharge: "",  //医疗费
                accommodation: "" //住宿费
            }
            this.resultObj = {
                allMoney: '',  //总赔偿金
                disabilityMoney: '' //伤残赔偿金
            }
        },
        countHandler(){
            let _that = this
            this.$refs['countForm'].validate(valid => {
                if (valid){
                    if(_that.form.isDied != '是' && _that.form.level == '多级' && _that.levelMultiList.length == 0 ){
                        _that.$message.error("请选择伤残等级")
                        return
                    }
                    //金额 * 赔偿年 * 比例
                    var sum = 0;
                    var ratio = 0
                    if (_that.form.account == '城镇'){
                        sum = city_json[_that.form.province];
                    } 
                    if (_that.form.account == '农村'){
                        sum = rural_json[_that.form.province];
                    }

                    if (_that.form.level == '单级') {
                        ratio = (11 - _that.form.level_single) / 10;
                    }
                    if (_that.form.level == '多级') {
                        var first_ratio = '';
                        ratio = 0;
                        _that.levelMultiList.forEach(item =>{
                            let id = item.key.split('-')[0]
                            let value = item.key.split('-')[1]
                            if (first_ratio == '' && id != 0) {
                                first_ratio = (11 - id) / 10;
                            }
                            ratio += ((11 - id) / 100) * value;
                        })

                        ratio = ratio + first_ratio - (first_ratio / 10);
                    }

                    if (_that.form.isDied == '是') {
                        ratio = 1;
                    }
                    if (ratio > 1) ratio = 1;

                    //赔偿多少年
                    var yearNum = 20;
                    var age = _that.form.age
                    if (age >= 60 && age <= 74) {
                        yearNum = 20 - (age - 60);
                    }
                    if (age > 74) yearNum = 5;
                    var pay_money = sum * yearNum * ratio;
                    _that.resultObj = {
                        allMoney:pay_money,
                        disabilityMoney:pay_money
                    }
                }
            })
        }
    },
    watch: {
        'form.level':{
            handler(){
                this.levelMultiList = []
            },
            deep:true
        }
    }
}
</script>

<style lang=less>
.ivu-modal-content{
    .ivu-modal-header{
        padding: 0px;
        font-weight: bold;
    }
    .ivu-modal-footer{
        border: 0px;
        text-align: center;
    }
    .died-dialog-title{
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        background: #20A0FF;
        span{
            text-align: center;
            display: inline-block;
            color: #fff;
            width: 49.5%;
            float: left;
            &:last-child{
                border-left:1px solid #fff;
            }
        }
    }
  .level-multi-list{
    list-style: none;
    padding: 0px;
    li.detail{
      font-size: 14px;
      border: 0px;
      padding: 2px;
      height: 32px;
      line-height: 32px;
      margin-top: -12px;
    }
    li{
      float: left;
      width: 100%;
      border-bottom: 1px solid #E5E5E5;
      span{
        display: inline-block;
        padding: 8px;
        float: left;
        width: 46%;
        text-align: center;
      }
      .u-add-minus{
          width: 100%;
          margin-left: 50px;
        .u-minus, .u-add{
          display: flex;
          float: left;
          border: 1px solid #c7c7c7;
          width: 10px;
          height: 18px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .u-num{
            display: inline-block;
            float: left;
            border: 1px solid #c7c7c7;
            width: 20%;
            height: 18px;
            text-align: center;
            border-left: 0;
            border-right: 0;
        }
      }
    }
  }
}
</style>
