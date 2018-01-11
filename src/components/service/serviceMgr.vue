<template>
  <div class="u-service-mgr-container">
        <Row>
            <Col span="24">
                <u-panel title="咨询" class="clearfix" v-show="consultList!=''">
                    <div class="lawyer-consult">
                        <div class="u-service-panel u-shadow " v-for="(item,index) in consultList" :key="index">
                            <div class="u-service-panel-desc">
                                <div class="u-service-pic"><img :src="item.imageUrl" /></div>
                                <div class="u-service-price">
                                    <ul>
                                        <li>
                                            <div>
                                                 <h4 class="u-fl">{{item.name }}</h4>
                                                <span class="u-fr" v-if="item.startState == 1&&item.name!='业务咨询'"  v-cloak>已上架</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="u-price-container u-fl">
                                                ￥<span class="u-price" >{{item.price}}</span>
                                            </div>
                                        </li>
                                        <li>
                                            订单总数：<span >{{item.orderCount}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="u-service-panel-btn" v-show="item.name!='业务咨询'" >
                              <span v-if="item.startState == 0"  v-cloak>
                                  <Button shape="circle" type="primary" @click="doChangPrice(item.goodsId,item.price)">改价</Button>  
                                  <Button shape="circle" @click="consultUpDown(item.goodsId,1,item)" class="open">开启</Button>  
                              </span>
                              <span v-else>
                                  <Button shape="circle" type="primary" @click="doChangPrice(item.goodsId,item.price)">改价</Button>  
                                  <Button shape="circle" @click='consultUpDown(item.goodsId,0,item)'>关闭</Button>  
                              </span>
                            </div>
                        </div>
                        <Modal
                            ref="list"
                            class-name="u-service-modal vertical-center-modal"
                            :closable="false"
                            v-model="dialogVisible"  width="480px">
                            <strong class="title">快速咨询/天</strong>
                            <Input v-model="formParam.price" placeholder="元"  @keyup.native="checkPrice(formParam)" required="required"></Input>
                            <span class="price_range">价格区间：1.00-7.00元<em>请输入正常的价格</em></span>
                            <span slot="footer" class="dialog-footer">
                                <Button shape="circle" @click="dialogVisible = false">取 消</Button>
                                <Button shape="circle" type="primary" @click="ModifyBox(formParam)">确 定</Button>
                            </span>
                        </Modal>
                    </div>
                </u-panel>
                <u-panel title="企业法律顾问"  class="clearfix" v-show="serviceList!=''">
                    <div class="container-fluid lawyer-customer">
                        <div class="u-service-panel u-shadow"  v-for="(item,index) in serviceList" :key="index">
                            <div class="u-service-panel-desc">
                                <div class="u-service-pic"><img :src="item.imageUrl" /></div>
                                <div class="u-service-price">
                                    <ul>
                                        <li>
                                            <div>
                                                <h4 class="u-fl">{{item.name }}</h4>
                                                <span class="u-fr" v-if="item.flag == 1" v-cloak>已上架</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="u-price-container u-fl">
                                                ￥<span class="u-price">{{item.priceStart}}</span>
                                            </div>
                                        </li>
                                        <li>
                                            订单总数：<span>{{item.orderCount}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="u-service-panel-btn">
                                <span v-if="item.flag == 0" v-cloak >
                                    <Button shape="circle" round @click='serviceUpDown(item.goodsId,1,item)'>上架</Button>
                                    <Button shape="circle" round @click='doChangService(item.goodsId,item.name,item.flag,item)'>修改</Button>
                                </span>
                                <span v-else>
                                    <Button shape="circle" round @click='serviceUpDown(item.goodsId,0,item)'>下架</Button>
                                </span>
                            </div>
                        </div>
                        <Modal ref="list" class-name="u-service-modal vertical-center-modal" :closable="false" title="修改服务"
                            v-model="dialogVisible1"  width="480px">
                            <ul >
                                <li>
                                    <span class="s-fl">服务名称</span><span class="s-fr" :title='formParam1.title' >{{formParam1.title}}</span>
                                </li>
                                <li>
                                    <span class="s-fl">服务范围</span>
                                    <div class="s-fr service_sel">
                                     <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                        <ul>
                                            <li 
                                                v-for="(item,index) in options" 
                                                :label="item.specAttrsCombName" 
                                                :key="index" @change="checkAllGroupChange" >
                                                <Checkbox :label="item.specId" class="u-service-scope" >
                                                       <span>{{item.specAttrsCombName}}</span>
                                                </Checkbox>

                                            </li>
                                        </ul>
                                     </CheckboxGroup>
                                    </div>
                                </li>
                            </ul>
                            <span slot="footer" class="dialog-footer">
                                <Button shape="circle" @click="dialogVisible1 = false">取 消</Button>
                                <Button shape="circle" type="primary" @click="ServiceBox(formParam1)">确 定</Button>
                            </span>
                        </Modal> 
                    </div>
                </u-panel>
            </Col>
        </Row>
  </div>

</template>

<script>
export default {
  data () {
    return {
            single:true,
            dialogVisible: false,
            dialogVisible1:false,
            formParam: {
               price: '',
               id:1
            },
            formParam1: {
               id:1,
               price:'',
               title:'',
               flag:'',
               specId:''
            },
            checkAllGroup: [],
            options:[],
            consultList: [],
            serviceList: [],
      }
    },
  mounted: function () {
        this.$nextTick(function () {
              this.init();
        });
    },
  methods: {
      init:function(){
          const $this = this;
          this.Api.overview.consultList().then(resp=>{
                console.log(resp);
                if(resp.code == 1){
                  $this.consultList = resp.data; 
                } 
            });
          this.Api.overview.serviceList().then(resp=>{
            $this.serviceList = [];
                if(resp.code == 1){
                   resp.data.forEach(item=>{
                     item.goodsList.forEach(e=>{
                        $this.serviceList.push(e); 
                        if(e.goodsfwList.length>0){
                            e.goodsfwList.forEach((g)=>{
                                if(g.specFlag ==1){
                                   $this.checkAllGroup.push(g.specId);
                                 }
                            });
                        }
                     });
                   })
                } 
            });
      },
      consultUpDown:function(id,state,item){
        this.Api.overview.consultUpDown({
            goodsId:id,
            state:state,
            lawofficeUuid:this.uuid
        }).then(resp=>{
            if(resp.code == 1){
              if(state == 0){
                  item.startState = 0;
                }else if(state == 1){
                  item.startState = 1;
              }
              this.$Message.info(resp.msg);  
            }  
        })   
      },
      serviceUpDown:function(id,state,item){
          let specId = '';
          item.goodsfwList.forEach(e=>{
               specId += e.specId+',';     
          });
          this.Api.overview.serviceUpDown({
            goodsId:id,
            specId:specId,
            state:state,
            lawofficeUuid:this.uuid
        }).then(resp=>{
            if(resp.code == 1){
              if(state == 0){
                   item.flag = 0;
                }else if(state == 1){
                   item.flag = 1;
              }
              this.$Message.info(resp.msg);  
            } 
        })
      },
       checkPrice:function(val){
       this.formParam.price = this.formParam.price.replace(/[^\d|.]/g, '');
       if(this.formParam.price<=0){ 
            $('.price_range em').show();
            return false
          }else{
            $('.price_range em').hide();
          }
      },
      checkAllGroupChange(data) {},
      ModifyBox:function(list) {  
          if(this.formParam.price<=0){ 
            return false
          }
         this.dialogVisible = false;
         this.Api.overview.consultPriceEdit({
            goodsId:list.id,
            price:Number(list.price)
        }).then(resp=>{
            if(resp.code == 1){
              this.$Message.info(resp.msg)  
              this.init();
            } 
        })
      },
      doChangPrice:function(id,price){ 
          this.formParam.price = price;
          this.formParam.id = id;
          this.dialogVisible = true;    
      },
      doChangService:function(id,title,flag,item){
          let $this = this,specId='';
          $this.options = [],$this.checkAllGroup=[];
          $this.formParam1.id = id;
          $this.formParam1.title = title;
          $this.formParam1.flag = flag;
          item.goodsfwList.forEach(e=>{
             $this.options.push(e);
             if(e.specFlag ==1){
              $this.checkAllGroup.push(e.specId);
             }else{
               specId += e.specId+','
             }

          })
          $this.formParam1.specId = specId;
          $this.dialogVisible1 = true;
      },
      ServiceBox:function(item) {
        let transferStr = '';
        let checked = this.checkAllGroup;
        transferStr = checked.join(",");
        this.dialogVisible1 = false;
        this.Api.overview.serviceUpDown({
            goodsId:item.id,
            specId:transferStr,
            state:2
        }).then(resp=>{
            if(resp.code == 1){
              this.checkAllGroup = checked;
              item.flag = 1;
              this.$Message.info(resp.msg);
              this.init();
            } 
        })
      }
    }
}
</script>
<style lang=less >
@import '../../assets/less/service-list.less';
[v-cloak] {
  display: none;
}
.ivu-checkbox+span, .ivu-checkbox-wrapper+span {
   font-size: 14px;
}
.ivu-checkbox{float: right;}

</style>