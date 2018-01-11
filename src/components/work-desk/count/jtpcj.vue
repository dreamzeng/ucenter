<template>
  <div class="u-count-jtpcj-container">

        <div class="u-ct-container">
            <Form ref="form" :model="form" :rules="rules" :label-width="100">
                <FormItem label="计算类型：">
                <Select v-model="form.costType" placeholder="请选择">
                    <Option label="伤残赔偿" value="1"></Option>
                    <Option label="死亡赔偿" value="2"></Option>
                </Select>
                </FormItem>
                <FormItem label="受审地区：" prop="pid">
                <Select v-model="form.pid" placeholder="请选择">
                    <Option v-for="(key, value, index) in cityJson" :key="index"
                        :label="key" 
                        :value="value"></Option>
                </Select>
                </FormItem>
                <FormItem label="伤残等级：" v-if="form.costType==1" prop="sclist">
                <Select v-model="form.sclist" placeholder="请选择">
                    <Option label="一级伤残" value="10"></Option>
                    <Option label="二级伤残" value="9"></Option>
                    <Option label="三级伤残" value="8"></Option>
                    <Option label="四级伤残" value="7"></Option>
                    <Option label="五级伤残" value="6"></Option>
                    <Option label="六级伤残" value="5"></Option>
                    <Option label="七级伤残" value="4"></Option>
                    <Option label="八级伤残" value="3"></Option>
                    <Option label="九级伤残" value="2"></Option>
                    <Option label="十伤残" value="1"></Option>
                </Select>
                </FormItem>
                <FormItem label="户口类型：" prop="hklist">
                <Select v-model="form.hklist" placeholder="请选择">
                    <Option label="城镇户口" value="1"></Option>
                    <Option label="农村户口" value="2"></Option>
                </Select>
                </FormItem>
                <FormItem label="年龄：" prop="age">
                    <Input v-model.number="form.age"></Input>
                </FormItem>
                <FormItem>
                    <Button shape="circle" type="primary" @click="getprom(form.costType, form.pid, form.sclist, form.hklist, form.age)" round>计 算</Button>
                </FormItem>
            </Form >
        <div class="u-count-result clearfix">
            <div class="u-swf u-count-base" v-if="form.costType == 2">
                <div class="u-count-text">
                    <p>死亡赔偿费用</p>
                    <p class="u-number">{{parseInt(result.swpc||0)}}</p>
                </div>
            </div>
            <div class="u-szf u-count-base" v-if="form.costType == 2">
                <div class="u-count-text">
                    <p>丧葬费</p>
                    <p class="u-number">{{parseInt(result.szf || 0)}}</p>
                </div>
            </div>
            <div class="u-szf u-count-base" v-if="form.costType == 1">
                <div class="u-count-text">
                    <p>残疾赔偿费用</p>
                    <p class="u-number">{{parseInt(result.cjpc || 0)}}</p>
                </div>
            </div>
        </div>
        </div>
  </div>
</template>

<script>
let cityJson = {110000: "北京", 120000: "天津", 130000: "河北", 140000: "山西", 150000: "内蒙古", 210000: "辽宁", 220000: "吉林", 230000: "黑龙江", 310000: "上海", 320000: "江苏", 330000: "浙江", 340000: "安徽", 350000: "福建", 360000: "江西", 370000: "山东", 410000: "河南", 420000: "湖北", 430000: "湖南", 440000: "广东", 450000: "广西", 460000: "海南", 500000: "重庆", 510000: "四川", 520000: "贵州", 530000: "云南", 540000: "西藏", 610000: "陕西", 620000: "甘肃", 630000: "青海", 640000: "宁夏", 650000: "新疆"}
/**
 *平均收入:伤残死亡
 *品均收入数据
 *expend:品均支出
 **/
let incomedata = [{ "pid": 110000, "income": [{ "county": 1, "money": 48531.85 }, { "county": 2, "money": 18867.3 }], "expend": [{ "county": 1, "money": 33717.45 }, { "county": 2, "money": 14535.06 }] }, { "pid": 310000, "income": [{ "county": 1, "money": 48841.4 }, { "county": 2, "money": 21191.64 }], "expend": [{ "county": 1, "money": 35182.44 }, { "county": 2, "money": 14820.08 }] }, { "pid": 120000, "income": [{ "county": 1, "money": 31506.03 }, { "county": 2, "money": 17014.18 }], "expend": [{ "county": 1, "money": 24289.64 }, { "county": 2, "money": 13738.62 }] }, { "pid": 500000, "income": [{ "county": 1, "money": 25147.23 }, { "county": 2, "money": 9489.82 }], "expend": [{ "county": 1, "money": 18279.49 }, { "county": 2, "money": 7982.56 }] }, { "pid": 130000, "income": [{ "county": 1, "money": 24141.34 }, { "county": 2, "money": 10186.14 }], "expend": [{ "county": 1, "money": 16203.82 }, { "county": 2, "money": 8247.99 }] }, { "pid": 140000, "income": [{ "county": 1, "money": 24069.43 }, { "county": 2, "money": 8809.44 }], "expend": [{ "county": 1, "money": 14636.88 }, { "county": 2, "money": 6991.69 }] }, { "pid": 220000, "income": [{ "county": 1, "money": 23217.82 }, { "county": 2, "money": 10780.12 }], "expend": [{ "county": 1, "money": 17156.14 }, { "county": 2, "money": 8139.82 }] }, { "pid": 230000, "income": [{ "county": 1, "money": 22609.03 }, { "county": 2, "money": 10453.2 }], "expend": [{ "county": 1, "money": 16466.63 }, { "county": 2, "money": 7829.99 }] }, { "pid": 320000, "income": [{ "county": 1, "money": 34346.26 }, { "county": 2, "money": 14958.44 }], "expend": [{ "county": 1, "money": 23476.28 }, { "county": 2, "money": 11820.27 }] }, { "pid": 350000, "income": [{ "county": 1, "money": 30722.39 }, { "county": 2, "money": 12650.19 }], "expend": [{ "county": 1, "money": 22204.06 }, { "county": 2, "money": 11055.93 }] }, { "pid": 360000, "income": [{ "county": 1, "money": 24309.19 }, { "county": 2, "money": 10116.58 }], "expend": [{ "county": 1, "money": 15141.78 }, { "county": 2, "money": 7548.26 }] }, { "pid": 370000, "income": [{ "county": 1, "money": 29221.94 }, { "county": 2, "money": 11882.26 }], "expend": [{ "county": 1, "money": 18322.6 }, { "county": 2, "money": 7962.23 }] }, { "pid": 420000, "income": [{ "county": 1, "money": 24852.28 }, { "county": 2, "money": 10849.06 }], "expend": [{ "county": 1, "money": 16681.41 }, { "county": 2, "money": 8680.93 }] }, { "pid": 430000, "income": [{ "county": 1, "money": 26570.16 }, { "county": 2, "money": 10060.17 }], "expend": [{ "county": 1, "money": 18334.66 }, { "county": 2, "money": 9024.84 }] }, { "pid": 460000, "income": [{ "county": 1, "money": 24486.53 }, { "county": 2, "money": 9912.57 }], "expend": [{ "county": 1, "money": 17513.78 }, { "county": 2, "money": 7028.97 }] }, { "pid": 510000, "income": [{ "county": 1, "money": 24234.41 }, { "county": 2, "money": 9347.74 }], "expend": [{ "county": 1, "money": 17759.93 }, { "county": 2, "money": 8301.1 }] }, { "pid": 520000, "income": [{ "county": 1, "money": 22548.21 }, { "county": 2, "money": 6671.22 }], "expend": [{ "county": 1, "money": 15254.64 }, { "county": 2, "money": 5970.25 }] }, { "pid": 610000, "income": [{ "county": 1, "money": 24365.76 }, { "county": 2, "money": 7932.21 }], "expend": [{ "county": 1, "money": 17545.96 }, { "county": 2, "money": 7252.37 }] }, { "pid": 620000, "income": [{ "county": 1, "money": 21803.86 }, { "county": 2, "money": 6276.59 }], "expend": [{ "county": 1, "money": 15942.25 }, { "county": 2, "money": 6147.78 }] }, { "pid": 150000, "income": [{ "county": 1, "money": 28349.64 }, { "county": 2, "money": 9976.3 }], "expend": [{ "county": 1, "money": 20885.23 }, { "county": 2, "money": 9972.24 }] }, { "pid": 210000, "income": [{ "county": 1, "money": 29081.75 }, { "county": 2, "money": 11191.49 }], "expend": [{ "county": 1, "money": 20519.57 }, { "county": 2, "money": 7800.75 }] }, { "pid": 330000, "income": [{ "county": 1, "money": 40392.72 }, { "county": 2, "money": 19373.28 }], "expend": [{ "county": 1, "money": 27241.74 }, { "county": 2, "money": 14497.81 }] }, { "pid": 340000, "income": [{ "county": 1, "money": 24838.52 }, { "county": 2, "money": 9916.42 }], "expend": [{ "county": 1, "money": 16107.07 }, { "county": 2, "money": 7980.76 }] }, { "pid": 410000, "income": [{ "county": 1, "money": 23672.06 }, { "county": 2, "money": 9966.07 }], "expend": [{ "county": 1, "money": 16184.46 }, { "county": 2, "money": 7277.21 }] }, { "pid": 440000, "income": [{ "county": 1, "money": 32148.11 }, { "county": 2, "money": 12245.56 }], "expend": [{ "county": 1, "money": 23611.74 }, { "county": 2, "money": 10043.21 }] }, { "pid": 450000, "income": [{ "county": 1, "money": 24669 }, { "county": 2, "money": 8683.18 }], "expend": [{ "county": 1, "money": 15045.4 }, { "county": 2, "money": 6675.07 }] }, { "pid": 530000, "income": [{ "county": 1, "money": 24299.01 }, { "county": 2, "money": 7456.13 }], "expend": [{ "county": 1, "money": 16268.33 }, { "county": 2, "money": 6030.26 }] }, { "pid": 540000, "income": [{ "county": 1, "money": 22015.81 }, { "county": 2, "money": 7359.2 }], "expend": [{ "county": 1, "money": 15669.36 }, { "county": 2, "money": 4822.08 }] }, { "pid": 630000, "income": [{ "county": 1, "money": 22306.57 }, { "county": 2, "money": 7282.73 }], "expend": [{ "county": 1, "money": 17492.89 }, { "county": 2, "money": 8235.14 }] }, { "pid": 640000, "income": [{ "county": 1, "money": 23284.56 }, { "county": 2, "money": 8410.02 }], "expend": [{ "county": 1, "money": 17216.23 }, { "county": 2, "money": 7676.49 }] }, { "pid": 650000, "income": [{ "county": 1, "money": 23214.03 }, { "county": 2, "money": 8723.83 }], "expend": [{ "county": 1, "money": 17684.52 }, { "county": 2, "money": 7365.32 }] }]

export default {
    data(){
        return {
            form:{
                costType: '1',
                pid: '',
                hklist: '',
                sclist: '',
                age: null
            },
            cityJson,
            result:{
                swpc:'', //死亡赔偿
                szf:'', //丧葬费
                cjpc: '' //残疾赔偿费
            },
            rules:{
                pid:[
                    {type: 'string', required: true, message: '请选择受审地区', trigger: 'change'}
                ],
                hklist:[
                    {type: 'string', required: true, message: '请选择户口类型', trigger: 'change'}
                ],
                sclist:[
                    {type: 'string', required: true, message: '请选择伤残等级', trigger: 'change'}
                ],
                age:[
                    {required: true, message: '请输入年龄'},
                    {type: 'number', message: '年龄只能输入数字'},
                    {type: 'number', min: 0, max: 200,message: '年龄在0岁到200岁之间'}
                ]
            }
        }
    },
    methods:{
        /**
        *
        *获取省份平均收入的方法
        *pid:省份编号
        *hktype:户口类型
        **/
        getincome(pid, hktype) {
            var a = 0;
            for (var i = 0; i < incomedata.length; i++) {
                if (incomedata[i].pid == pid) {
                    a = i;
                }
            }

            for (var k = 0; k < incomedata[a].income.length; k++) {
                if (incomedata[a].income[k].county == hktype) {
                    return incomedata[a].income[k].money;
                }
            }
        },
        
        /**
        *丧葬费
        * @param address 省份id
        * @param hktype 户口类型
        */
        sangzang(address, hktype) {
            var income = this.getincome(address, hktype);
            var fy = (income * 0.5);
            return fy;
        },
        /**
        *交通赔偿金的方法
        *type:1.伤残赔偿，2.死亡赔偿
        *address:受审地区
        *scdj:伤残等级
        *residence:户口类型
        *age:年龄
        **/
        getprom(type, address, scdj, residence, age) {
            this.$refs['form'].validate(valid => {
                if (type == 1) {
                    var fy = 0; //赔偿金额
                    var income = this.getincome(address, residence); //获取平均年薪
                    scdj = (11 - (11 - scdj)) * 0.1; //伤残等级
                    age = this.cjage(age); //计算残疾年龄
                    fy = (income * age * scdj);
                    this.result.cjpc = fy
                } else {
                    var income = this.getincome(address, residence);
                    age = this.dieage(age); //死亡年龄
                    var fy = (income * age);
                    this.result.swpc = fy
                }
                this.result.szf = this.sangzang(address, residence)
            })
        },
        //残疾年龄计算
        cjage(age) {
            var a = 0;
            if (age > 0 && age <= 60) a = 20;
            else if (age > 60 && age <= 75) a = 80 - age;
            else if (age > 75) a = 5;
            return a;
        },
        //计算死亡年龄
        dieage(age) {
            var a = 0;
            if (age > 0 && age <= 60) a = 20;
            else if (age > 60 && age <= 75) a = 20 - (age - 60);
            else if (age > 75) a = 5;
            return a;
        }
    }
}
</script>

<style lang=less>
    @import '../../../assets/less/work-desk.less';
    .u-count-jtpcj-container{
        
    }
</style>
