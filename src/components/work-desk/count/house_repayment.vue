<!--房屋还贷计算器-->
<template>
  <div class="u-house-repayment">
      <div class="u-ct-container">
            <Form ref="countForm" :model="form" :rules="rules" :label-width="120">
                  <FormItem label="贷款类型：">
                    <Select v-model="form.loanType" style="width:100%;" placeholder="请选择贷款类型">
                      <Option value="1" key="1" label="公积金贷款"></Option>
                      <Option value="2" key="2" label="商业贷款"></Option>
                      <Option value="3" key="3" label="组合贷款"></Option>
                    </Select>
                  </FormItem>
                  <FormItem label="贷款金额（万元）：" v-if="form.loanType !='3'" prop="loanMoney">
                      <Input placeholder="请手动输入金额" v-model.number="form.loanMoney"></Input>
                  </FormItem>
                  <FormItem label="贷款期限：" v-if="form.loanType !='3'">
                      <Select v-model="form.loanTime" style="width:100%;" placeholder="请选择贷款期限">
                        <Option value="60" key="60" label="05年期限"></Option>
                        <Option value="120" key="120" label="10年期限"></Option>
                        <Option value="180" key="180" label="14年期限"></Option>
                        <Option value="240" key="240" label="20年期限"></Option>
                        <Option value="300" key="300" label="25年期限"></Option>
                        <Option value="360" key="360" label="30年期限"></Option>
                      </Select>
                  </FormItem>
                  <FormItem label="输入利率(%)：" v-if="form.loanType !='3'" prop="loanRate">
                      <Input placeholder="请手动输入利率" v-model.number="form.loanRate"></Input>
                  </FormItem>
                  <FormItem label="折扣(%)：" v-if="form.loanType !='3'" prop="loanDiscount">
                      <Input placeholder="请手动输入折扣" v-model.number="form.loanDiscount"></Input>
                  </FormItem>
                  <FormItem label="公积金贷款金额（万）：" v-if="form.loanType =='3'" prop="fundLoan">
                      <Input placeholder="请手动输入金额" v-model.number="form.fundLoan"></Input>
                  </FormItem>
                  <FormItem label="商业贷款金额（万）：" v-if="form.loanType =='3'" prop="businessLoan">
                      <Input placeholder="请手动输入金额" v-model.number="form.businessLoan"></Input>
                  </FormItem>
                  <FormItem label="期限：" v-if="form.loanType =='3'">
                      <Select v-model="form.groupLoanTime" style="width:100%;" placeholder="请选择期限">
                        <Option value="60" key="60" label="05年期限"></Option>
                        <Option value="120" key="120" label="10年期限"></Option>
                        <Option value="180" key="180" label="14年期限"></Option>
                        <Option value="240" key="240" label="20年期限"></Option>
                        <Option value="300" key="300" label="25年期限"></Option>
                        <Option value="360" key="360" label="30年期限"></Option>
                      </Select>
                  </FormItem>
                  <FormItem label="输入公积金利率(%)：" v-if="form.loanType =='3'" prop="groupFundRate">
                      <Input placeholder="请手动输入利率" v-model.number="form.groupFundRate"></Input>
                  </FormItem>
                  <FormItem label="输入商业利率(%)：" v-if="form.loanType =='3'" prop="groupBusinessRate">
                      <Input placeholder="请手动输入利率" v-model.number="form.groupBusinessRate"></Input>
                  </FormItem>
                  <FormItem label="商业贷款折扣(%)：" v-if="form.loanType =='3'" prop="groupBusinessDiscount">
                      <Input placeholder="请输入折扣" v-model.number="form.groupBusinessDiscount"></Input>
                  </FormItem>
                  
                  <FormItem>
                      <Button @click="countHandler" type="primary">计算</Button>
                      <Button @click="resetHandler">重置</Button>
                  </FormItem>
            </Form>
            <div>
              等额本金
            </div>
            <Form :label-width="120">
              <FormItem label="还款月数（月）：">
                      <div>{{resultObj.capticalPayMonth}}</div>
              </FormItem>
              <FormItem label="总支付利息:">
                      <div>{{resultObj.capticalPayInterest}}</div>
              </FormItem>
              <FormItem label="本息合计（元）:">
                      <div>{{resultObj.capticalPayAllMoney}}</div>
              </FormItem>
            </Form>
            <div>
              等额本息
            </div>
            <Form :label-width="120">
              <FormItem label="每月还款（元）:">
                      <div>{{resultObj.interestPayMoney}}</div>
              </FormItem>
              <FormItem label="还款月数（月）:">
                      <div>{{resultObj.interestPayMonth}}</div>
              </FormItem>
              <FormItem label="总支付利息:">
                      <div>{{resultObj.interestAllInterest}}</div>
              </FormItem>
              <FormItem label="本息合计（元）:">
                      <div>{{resultObj.interestAllMoney}}</div>
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
            loanType: '1', //贷款类型
            loanMoney: null, //贷款金额
            loanTime: '60', //贷款期限
            loanRate: 2.75, //贷款利率
            loanDiscount: '', //贷款折扣
            fundLoan: null, //公积金贷款
            businessLoan: null, //商业贷款
            groupLoanTime: '60', //组合贷款期限
            groupFundRate: null, //组合贷款公积金利率
            groupBusinessRate: 4.9, //组合贷款商业利率
            groupBusinessDiscount: 100 //组合贷款商业折扣
          },
          rules:{
              loanMoney:[
                  {required: true, message: '请输入金额'},
                  {type:'number', required: true, message: '金额只能输入数值'}
              ],
              loanRate:[
                  {required: true, message: '请输入利率'},
                    {type:'number', required: true, message: '利率只能输入数值'}
              ],
              loanDiscount:[
                  {required: true, message: '请输入折扣'},
                  {type:'number', required: true, message: '折扣只能输入数值'}
              ],
              ///组合
              fundLoan:[
                  {required: true, message: '请输入公积金贷款金额'},
                  {type:'number', required: true, message: '公积金贷款金额只能输入数值'}
              ],
              businessLoan:[
                  {required: true, message: '请输入商业贷款金额'},
                  {type:'number', required: true, message: '商业贷款金额只能输入数值'}
              ],
              groupFundRate:[
                  {required: true, message: '请输入公积金利率'},
                  {type:'number', required: true, message: '公积金利率只能输入数值'}
              ],
              groupBusinessRate:[
                  {required: true, message: '请输入商业利率'},
                  {type:'number', required: true, message: '商业利率只能输入数值'}
              ],
              groupBusinessDiscount:[
                  {required: true, message: '请输入商业贷款折扣'},
                  {type:'number', required: true, message: '商业贷款折扣只能输入数值'}
              ]
          },
          resultObj:{
              //本金
              capticalPayMonth: '', //还款月数
              capticalPayInterest: '', //支付利息
              capticalPayAllMoney: '', //本息合计
              
              //本息
              interestPayMoney: '', //每月还款
              interestPayMonth: '', //组合还款月数
              interestAllInterest: '', //总支付利息
              interestAllMoney: '' //本息合计
          }
      }
  },
  methods:{
      countHandler(){
        this.$refs['countForm'].validate(valid => {
            if (valid){
                if(this.form.loanType == 3){
                  this.groupLoan()
                }else{
                  this.fundBusinessLoan()
                }
            }
        })
      },
      resetHandler(){
          
      },
      /**
       * 组合贷款
       */
      groupLoan(){
        //组合贷款
        var fundLoan        = parseFloat(this.form.fundLoan)
        var groupFundRate = parseFloat(this.form.groupFundRate)

        var businessLoan         = parseFloat(this.form.businessLoan)
        var groupBusinessRate  = parseFloat(this.form.groupBusinessRate)
        var groupBusinessDiscount       = parseFloat(this.form.groupBusinessDiscount)

        var groupLoanTime      = this.form.groupLoanTime
        
        var countCapital = (parseFloat(fundLoan)+parseFloat(businessLoan)) * 10000;

        //等额本息
        var fundIterestMoney = this.EqualQuotaInterest(fundLoan*10000 ,groupFundRate/100 ,groupLoanTime);
        var bussinessInterestMoney = this.EqualQuotaInterest(businessLoan*10000 ,groupBusinessRate/100*groupBusinessDiscount/100 ,groupLoanTime);

        //$("#debx .interest").text(((fundIterestMoney[1]+bussinessInterestMoney[1]) - (parseInt(fundLoan) + parseInt(businessLoan)) * 10000).toFixed(2));
        var interestAllInterest = fundIterestMoney[1]+bussinessInterestMoney[1] - countCapital;
        var sumMoney = (parseFloat(fundIterestMoney[1])+parseFloat(bussinessInterestMoney[1])).toFixed(2);

        //等额本金
        var fundCaptical = this.EqualQuotaCorpus(fundLoan*10000 ,groupFundRate/100 ,groupLoanTime);;
        var sy_corpus_money = this.EqualQuotaCorpus(businessLoan*10000 ,groupBusinessRate/100*groupBusinessDiscount/100 ,groupLoanTime);;
        var sumInterest=fundCaptical+sy_corpus_money;
        var totalMoney = (countCapital+sumInterest).toFixed(2);

        this.resultObj = {
          capticalPayMonth: groupLoanTime, //还款月数
          capticalPayInterest: sumInterest.toFixed(2), //支付利息
          capticalPayAllMoney: totalMoney, //本息合计（元)
          
          interestPayMoney: (fundIterestMoney[0]+bussinessInterestMoney[0]).toFixed(2), //每月还款（元）:
          interestPayMonth: groupLoanTime, //还款月数（月）
          interestAllInterest: interestAllInterest.toFixed(2), //总支付利息
          interestAllMoney: sumMoney //本息合计
        }
      },
      /**
       * 公积金商业贷款
       */
      fundBusinessLoan(){
        //公积金/商业 贷款
        var loanMoney = parseFloat(this.form.loanMoney);
        var loanRate = parseFloat(this.form.loanRate);
        var loanTime = this.form.loanTime;

        if(this.form.loanType == 2){
            var loanDiscount = parseFloat(this.form.loanDiscount);
            loanRate = loanRate * loanDiscount / 100;
        }

        var interestAllMoney = this.EqualQuotaInterest(loanMoney * 10000,loanRate / 100,loanTime);
      
        var capticalCount = this.EqualQuotaCorpus(loanMoney * 10000,loanRate / 100,loanTime);
        
        this.resultObj = {
          capticalPayMonth:loanTime, //还款月数
          capticalPayInterest:capticalCount.toFixed(2), //总支付利息
          capticalPayAllMoney:(capticalCount + loanMoney * 10000).toFixed(2), //本息合计（元)
          
          interestPayMoney:interestAllMoney[0].toFixed(2), //每月还款（元）:
          interestPayMonth:loanTime, //还款月数（月）
          interestAllInterest:(interestAllMoney[1] - loanMoney * 10000).toFixed(2), //总支付利息
          interestAllMoney:interestAllMoney[1].toFixed(2) //本息合计
        }
      },
      //等额本息
      EqualQuotaInterest(sum, rate, monthNum){
        //[贷款本金×月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数－1]
        var square_rate = (1+ rate / 12);
        for (var i = 1; i < monthNum; i++) {
            square_rate *= (1+ rate / 12);
        };
        var month_money = (sum * rate / 12 * square_rate) / (square_rate - 1);
        var all_money = month_money * monthNum;
    
        return [month_money,all_money];
      },
      //等额本金
      EqualQuotaCorpus(sum,rate,monthNum){
        var sum_month = sum / monthNum;
        var all_interest = 0;
    
        for (var i = 0; i < monthNum; i++) {
            var month_interest = sum * rate / 12;
            all_interest += month_interest;
            sum -= sum_month;
        };
    
        return all_interest;
      },
      setRate(){
        if(this.form.loanType == 1){
          this.form.loanRate = 3.25
        }
        if(this.form.loanType == 2){
          this.form.loanRate = 4.9
        }
        if(this.form.loanTime == 60 && this.form.loanType == 1){
          this.form.loanRate = 2.75
        }
        if(this.form.loanTime == 60 && this.form.loanType == 2){
          this.form.loanRate = 4.75
        }
      }
  },
  watch: {
    'form.loanType':{
      handler(newVal){
        this.setRate()
      },
      deep:true
    },
    'form.loanTime':{
      handler(newVal){
        this.setRate()
      },
      deep:true
    }
  }
}
</script>

<style lang=less>
  .u-house-repayment{
    
  }
</style>
