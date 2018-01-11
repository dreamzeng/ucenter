<!--日期计算器-->
<template>
  <div class="u-count-date-container">
        <div class="u-ct-container">
            <Tabs v-model="activeName" :animated="false">
                <TabPane label="天数计算" name="day">
                    <Form ref="form" :model="form" :rules="rules" :label-width="180">
                        <FormItem label="起算日：" prop="beginTime">
                            <DatePicker type="date" @on-change="date=>form.beginTime=date" placeholder="请选择结束时间"></DatePicker>
                        </FormItem>
                        <FormItem label="截至日：" prop="endTime">
                            <DatePicker type="date" @on-change="date=>form.endTime=date" placeholder="请选择结束时间"></DatePicker>
                        </FormItem>
                        <FormItem>
                            <Button @click="countDayHandler" type="primary">计算</Button>
                            <Button @click="resetDayHandler">重置</Button>
                        </FormItem>
                    </Form>
                    <Form :label-width="170">
                        <FormItem label="天：">
                                <div>{{countObj.day}}</div>
                        </FormItem>
                        <FormItem label="月：">
                                <div>{{countObj.month}}</div>
                        </FormItem>
                        <FormItem label="年：">
                                <div>{{countObj.year}}</div>
                        </FormItem>
                        <FormItem label="工作日：">
                                <div>{{countObj.workDay}}天</div>
                        </FormItem>
                    </Form>
            </TabPane>
            <TabPane label="日期计算" name="date">
                    <Form ref="form-date" :model="formDate" :rules="rulesDate" :label-width="180">
                        <FormItem label="起算日：" prop="beginTime">
                            <DatePicker type="date" @on-change="date=>formDate.beginTime=date" placeholder="请选择开始时间"></DatePicker>
                        </FormItem>
                        <FormItem label="间隔天数：" prop="days">
                            <Input v-model.number="formDate.days" placeholder="请输入间隔天数" />
                        </FormItem>
                        <FormItem label="推算方式：">
                            <RadioGroup v-model="formDate.type" type="button">
                                <Radio label="向后"></Radio>
                                <Radio label="向前"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="是否仅计算工作日：">
                            <RadioGroup v-model="formDate.isWorktime" type="button">
                                <Radio label="否"></Radio>
                                <Radio label="是"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem>
                            <Button @click="countDateHandler" type="primary">计算</Button>
                            <Button @click="resetDateHandler">重置</Button>
                        </FormItem>
                    </Form>
                    <div>申明：本平台提供的数据从2010年开始至今，若给您的使用带来不便，敬请谅解。</div>
                    <div>{{countVal}}</div>
                </TabPane>
            </Tabs>
        </div>
  </div>
</template>

<script>
var specialDate = { "2010-01-01": 2, "2010-01-02": 3, "2010-01-03": 3, "2010-02-13": 3, "2010-02-14": 3, "2010-02-15": 2, "2010-02-16": 2, "2010-02-17": 2, "2010-02-18": 2, "2010-02-19": 2, "2010-02-20": 0, "2010-02-21": 0, "2010-04-03": 3, "2010-04-04": 3, "2010-04-05": 2, "2010-05-01": 3, "2010-05-02": 3, "2010-05-03": 2, "2010-06-12": 0, "2010-06-13": 0, "2010-06-14": 2, "2010-06-15": 2, "2010-06-16": 2, "2010-09-19": 0, "2010-09-22": 2, "2010-09-23": 2, "2010-09-24": 2, "2010-09-25": 0, "2010-09-26": 0, "2010-10-01": 2, "2010-10-02": 3, "2010-10-03": 3, "2010-10-04": 2, "2010-10-05": 2, "2010-10-06": 2, "2010-10-07": 2, "2010-10-09": 0, "2011-01-01": 3, "2011-01-02": 3, "2011-01-03": 2, "2011-01-30": 0, "2011-02-02": 2, "2011-02-03": 2, "2011-02-04": 2, "2011-02-05": 3, "2011-02-06": 3, "2011-02-07": 2, "2011-02-08": 2, "2011-02-12": 0, "2011-04-02": 0, "2011-04-03": 3, "2011-04-04": 2, "2011-04-05": 2, "2011-04-30": 3, "2011-05-01": 3, "2011-05-02": 2, "2011-06-04": 3, "2011-06-05": 3, "2011-06-06": 2, "2011-09-10": 3, "2011-09-11": 3, "2011-09-12": 2, "2011-10-01": 3, "2011-10-02": 3, "2011-10-03": 2, "2011-10-04": 2, "2011-10-05": 2, "2011-10-06": 2, "2011-10-07": 2, "2011-10-08": 0, "2011-10-09": 0, "2011-12-31": 0, "2012-01-01": 3, "2012-01-02": 2, "2012-01-03": 2, "2012-01-21": 0, "2012-01-22": 3, "2012-01-23": 2, "2012-01-24": 2, "2012-01-25": 2, "2012-01-26": 2, "2012-01-27": 2, "2012-01-28": 3, "2012-01-29": 0, "2012-03-31": 0, "2012-04-01": 0, "2012-04-02": 2, "2012-04-03": 2, "2012-04-04": 2, "2012-04-28": 0, "2012-04-29": 3, "2012-04-30": 2, "2012-05-01": 2, "2012-06-22": 2, "2012-06-23": 3, "2012-06-24": 3, "2012-09-29": 0, "2012-09-30": 3, "2012-10-01": 2, "2012-10-02": 2, "2012-10-03": 2, "2012-10-04": 2, "2012-10-05": 2, "2012-10-06": 3, "2012-10-07": 3, "2013-01-01": 2, "2013-01-02": 2, "2013-01-03": 2, "2013-01-05": 0, "2013-01-06": 0, "2013-02-09": 3, "2013-02-10": 3, "2013-02-11": 2, "2013-02-12": 2, "2013-02-13": 2, "2013-02-14": 2, "2013-02-15": 2, "2013-02-16": 0, "2013-02-17": 0, "2013-04-04": 2, "2013-04-05": 2, "2013-04-06": 3, "2013-04-07": 0, "2013-04-27": 0, "2013-04-28": 0, "2013-04-29": 2, "2013-04-30": 2, "2013-05-01": 2, "2013-06-08": 0, "2013-06-09": 0, "2013-06-10": 2, "2013-06-11": 2, "2013-06-12": 2, "2013-09-19": 2, "2013-09-20": 2, "2013-09-21": 3, "2013-09-22": 0, "2013-09-29": 0, "2013-10-01": 2, "2013-10-02": 2, "2013-10-03": 2, "2013-10-04": 2, "2013-10-05": 3, "2013-10-06": 3, "2013-10-07": 2, "2013-10-12": 0, "2014-01-01": 2, "2014-01-26": 0, "2014-01-31": 2, "2014-02-01": 3, "2014-02-02": 3, "2014-02-03": 2, "2014-02-04": 2, "2014-02-05": 2, "2014-02-06": 2, "2014-02-08": 0, "2014-04-05": 3, "2014-04-06": 3, "2014-04-07": 2, "2014-05-01": 2, "2014-05-02": 2, "2014-05-03": 3, "2014-05-04": 0, "2014-06-02": 2, "2014-09-08": 2, "2014-09-28": 0, "2014-10-01": 2, "2014-10-02": 2, "2014-10-03": 2, "2014-10-04": 3, "2014-10-05": 3, "2014-10-06": 2, "2014-10-07": 2, "2014-10-11": 0, "2015-01-01": 2, "2015-01-02": 2, "2015-01-03": 3, "2015-01-04": 0, "2015-02-15": 0, "2015-02-18": 2, "2015-02-19": 2, "2015-02-20": 2, "2015-02-21": 3, "2015-02-22": 3, "2015-02-23": 2, "2015-02-24": 2, "2015-02-28": 0, "2015-04-04": 3, "2015-04-05": 3, "2015-04-06": 2, "2015-05-01": 2, "2015-05-02": 3, "2015-05-03": 3, "2015-06-20": 3, "2015-06-21": 3, "2015-06-22": 2, "2015-09-03": 2, "2015-09-04": 2, "2015-09-05": 3, "2015-09-27": 3, "2015-10-01": 2, "2015-10-02": 2, "2015-10-03": 3, "2015-10-04": 3, "2015-10-05": 2, "2015-10-06": 2, "2015-10-07": 2, "2015-10-10": 0, "2016-01-01": 2, "2016-02-06": 0, "2016-02-07": 3, "2016-02-08": 2, "2016-02-09": 2, "2016-02-10": 2, "2016-02-11": 2, "2016-02-12": 2, "2016-02-13": 3, "2016-02-14": 0, "2016-04-04": 2, "2016-05-01": 3, "2016-05-02": 2, "2016-06-09": 2, "2016-06-10": 2, "2016-06-11": 3, "2016-06-12": 0, "2016-09-15": 2, "2016-09-16": 2, "2016-09-17": 3, "2016-09-18": 0, "2016-10-01": 3, "2016-10-02": 3, "2016-10-03": 2, "2016-10-04": 2, "2016-10-05": 2, "2016-10-06": 2, "2016-10-07": 2, "2016-10-08": 0, "2016-10-09": 0, "2016-12-31": 3, "2017-01-01": 3, "2017-01-02": 2, "2017-01-22": 0, "2017-01-27": 2, "2017-01-28": 3, "2017-01-29": 3, "2017-01-30": 2, "2017-01-31": 2, "2017-02-01": 2, "2017-02-02": 2, "2017-02-04": 0, "2017-04-01": 0, "2017-04-02": 3, "2017-04-03": 3, "2017-04-04": 2, "2017-04-29": 3, "2017-04-30": 3, "2017-05-01": 2, "2017-05-27": 0, "2017-05-28": 3, "2017-05-29": 2, "2017-05-30": 2, "2017-09-30": 0, "2017-10-01": 3, "2017-10-02": 2, "2017-10-03": 2, "2017-10-04": 2, "2017-10-05": 2, "2017-10-06": 2, "2017-10-07": 3, "2017-10-08": 3 };
var nextMonth = ''
export default {
  components: {
      
  },
  data(){
    return {
      activeName:'date',
      formDate:{
          days:'',
          beginTime:'',
          type:'向后',
          isWorktime:'否'
      },
      form:{
        beginTime:'',
        endTime:''
      },
      rules:{
        beginTime:[
            {type: 'string', required: true, message: '请选择开始时间'}
        ],
        endTime:[
            {type: 'string', required: true, message: '请选择结束时间'}
        ]
      },
      rulesDate:{
          beginTime:[
              {type: 'string', required: true, message: '请选择开始时间'}
          ],
          days:[
              {required: true, message: '请输入间隔天数'},
              {type: 'number', required: true, message: '间隔天数只能输入数值'}
          ]
      },
      countObj:{
        day:'',
        month:'',
        year:'',
        workDay:''
      },
      countVal:''
    }
  },
  methods:{
    countDayHandler(){
      this.$refs['form'].validate(valid => {
        if (valid){
            if(this.form.startTime <= this.form.endTime){
                this.$message.error('请选择正确的日期')
            }
            var doopNum = this.dateDiff(this.form.beginTime, this.form.endTime);
            var doopDate = this.dayDoop(this.form.beginTime, doopNum);
            var doopMonth = this.checkTime(this.form.beginTime, this.form.endTime);

            this.countObj = {
                day:doopDate[0],
                month:doopMonth[0] + "月" + doopMonth[1] + "天",
                year:Math.floor(doopMonth[0] / 12) + "年" + doopMonth[0] % 12 + "月" + doopMonth[1] + "天",
                workDay:doopDate[1]
            }
        }
      })
    },
    resetDayHandler(){
      this.form = {
          beginTime:'',
          endTime:''
      }

      this.countObj = {
          day:'',
          month:'',
          year:'',
          workDay:''
      }
    },
    countDateHandler(){
        this.$refs['form-date'].validate(valid => {
            var day_type = ''
            if (valid){
                var weekJson = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                var beginTime = this.formDate.beginTime; //开始日期
                var spaceDay = this.formDate.days; //间隔天数
                var tsway = this.formDate.type == '向后' ? 1 : 2; //推算方式 1-向后，2-向前
                var sfjs = this.formDate.isWorktime == '否' ? 1 : 2; //是否仅计算工作日 1-否,2-是
                //计算所有日期
                if (sfjs == 1) {
                    if (tsway == 2) {
                        spaceDay = -spaceDay;
                    } //日期向前推算 变负数
                    var rqGetDay = this.AddDays(beginTime, spaceDay);
                } else { //仅计算工作日
                    var doopNum = Number(spaceDay);
                    for (var i = 0; i < doopNum; i++) {
                        var beginDate = new Date(beginTime);
                        if (tsway == 2) {
                            beginDate.setDate(beginDate.getDate() - 1);
                        } else {
                            beginDate.setDate(beginDate.getDate() + 1);
                        }
                        var year = beginDate.getFullYear();
                        var month = beginDate.getMonth() + 1;
                        var day = beginDate.getDate();
                        if (month < 10) month = "0" + month;
                        if (day < 10) day = "0" + day;
                        beginTime = year + "-" + month + "-" + day;
                        if (specialDate[beginTime] == 2 || specialDate[beginTime] == 3) {
                            day_type = "节假日";
                            doopNum += 1;
                        } else if ((beginDate.getDay() == 0 || beginDate.getDay() == 6) && specialDate[beginTime] != 0) {
                            day_type = "休息日";
                            doopNum += 1;
                        } else {
                            day_type = "工作日";
                        }
                    };
                    var rqGetDay = beginTime;
                }
                var mydate = new Date(rqGetDay);
                var nowWeekNum = mydate.getDay(); //获取当前星期X(0-6,0代表星期天)
                var rqYear = mydate.getFullYear(); //获取完整的年份(4位,1970-????)
                var rqMonth = mydate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
                var rqDay = mydate.getDate(); //获取当前日(1-31)
                if (specialDate[rqGetDay] == 2 || specialDate[rqGetDay] == 3) {
                    day_type = "节假日";
                } else if ((nowWeekNum == 0 || nowWeekNum == 6) && specialDate[rqGetDay] != 0) {
                    day_type = "休息日";
                } else {
                    day_type = "工作日";
                }
                this.countVal = rqYear + '年' + rqMonth + '月' + rqDay + '日' + '(' + weekJson[nowWeekNum] + ',' + day_type + ')';
                
            }
        })
    },
    resetDateHandler(){
        this.formDate = {
            days:'',
            type:'向后',
            isWorktime:'否'
        }

        this.countVal = ''
    },
    dateDiff(startTime, endTime){
        var st = new Date(startTime);
        var et = new Date(endTime);
        return (et.getTime() - st.getTime()) / 86400000;
    },
    dayDoop(beginTime, doopNum) {
        var weekJson = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        var day_type = "工作日";
        var week_num = 0;
        for (var i = 0; i < doopNum; i++) {
            var beginDate = new Date(beginTime);
            beginDate.setDate(beginDate.getDate() + 1);
            var year = beginDate.getFullYear();
            var month = beginDate.getMonth() + 1;
            var day = beginDate.getDate();
            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            beginTime = year + "-" + month + "-" + day;
            if (specialDate[beginTime] == 2 || specialDate[beginTime] == 3) {
                day_type = "节假日";
            } else if ((beginDate.getDay() == 0 || beginDate.getDay() == 6) && specialDate[beginTime] != 0) { //type==0 是周末但是是工作日
                day_type = "休息日";
            } else {
                day_type = "工作日";
                week_num++;
            }
        };
        return [doopNum, week_num];
    },
    checkTime(beginTime, endTime) {
        var xjMonth = 0;
        var monthNum = 0;
        var beginDate = new Date(beginTime);
        var endDate = new Date(endTime);
        //计算相距多少月
        monthNum += (endDate.getFullYear() - beginDate.getFullYear()) * 12;
        if (monthNum > 0) {
            monthNum -= beginDate.getMonth();
            monthNum += endDate.getMonth();
        } else {
            monthNum = endDate.getMonth() - beginDate.getMonth();
        }
        
        if (endDate.getDate() > beginDate.getDate()) monthNum++;
        var new_year = beginDate.getFullYear(); //开始日期的年份
        var new_month = beginDate.getMonth() + 1; //开始日期的月份
        var stateDay = beginTime;
        for (var i = 1; i <= monthNum; i++) {
            this.nextMonthDate(new_year + '-' + new_month + "-" + beginDate.getDate()); //下个月日期
            if (parseInt(this.dateDiff(nextMonth, endTime)) > 0) {
                xjMonth += 1
            };
            if (i == monthNum) { //最后一个月计算天数
                var dayStep = parseInt(this.dateDiff(stateDay, endTime));
            }
            stateDay = nextMonth;
            new_month++;
            if (new_month > 12) {
                new_month -= 12;
                new_year++;
            }
        }
        return [xjMonth, dayStep];
    },
    //下一个月日期
    nextMonthDate(date) {
        date = date.split('-');
        var nextDate = new Date(date[0], date[1], date[2]);
        if (date[1] == 12) {
            var month = 0;
        } else {
            var month = date[1];
        }
        if (nextDate.getMonth() != month) {
            var newDate = date[0] + "-" + date[1] + "-" + (date[2] - 1);
            this.nextMonthDate(newDate);
        } else {
            var nextDate_month = nextDate.getMonth();
            nextDate_month++;
            nextMonth = nextDate.getFullYear() + "-" + nextDate_month + "-" + nextDate.getDate();
        }
    },
    //日期加上天数后的新日期. 
    AddDays(date, days) {
        var nd = new Date(date);
        nd = nd.valueOf();
        nd = nd + days * 24 * 60 * 60 * 1000;
        nd = new Date(nd);
        var y = nd.getFullYear();
        var m = nd.getMonth() + 1;
        var d = nd.getDate();
        if (m <= 9) m = "0" + m;
        if (d <= 9) d = "0" + d;
        var cdate = y + "-" + m + "-" + d;
        return cdate;
    }
  }
}
</script>

<style lang="less">
    .u-count-date-container{

    }
</style>
