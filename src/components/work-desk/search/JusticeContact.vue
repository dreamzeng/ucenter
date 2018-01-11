<template>
  <div class="u-justice-container">
      <Row>
        <Col span="6">
          <ul class="u-type-container" :style="{height:courtHeight}">
            <li v-for="(typeObj, index) in justiceTypeObj.data" :key="index" @click="getCaseAddress(typeObj.id)">
              <span class="u-type-img"><img :src="typeObj.imageUrl" alt="logo"></span>
              <span>{{typeObj.name}}</span>
            </li>
          </ul>
        </Col>
       <Col span="18" class="u-court-container">
         <div class="u-court-name">
            <div class="u-court-input">
                <Input v-model="searchKey" class="u-court-search" icon="search" @on-enter="getCaseAddress(typeId, true)"  @on-click="getCaseAddress(typeId, true)" placeholder="搜索"></Input>
            </div>
           <ul :style="{height:courtHeight}">
             <li v-for="(address, index) in caseAddressObj.items" @click="getCaseName(address.comName)" :key="index">
               {{address.comName}}
             </li>
           </ul>
         </div>
         <div class="u-court-contact">
           <div class="u-contact-list">
             <div class="u-sign"><p>总</p></div>
             <div class="u-contact-way">
               <p>{{caseNameObj.items ? caseNameObj.items[0].fullName : ''}}</p>
               <ul>
                 <li>
                   <img src="//static.fy13322.com/front/lawyer/public/images/contact_phone.png?475090" alt="">
                  <p>
                    <span class="gray">联系方式：</span>
                    <small class="phone">{{caseNameObj.items ? caseNameObj.items[0].phone : ''}}</small>
                  </p>
                 </li>
                 <li>
                   <img src="//static.fy13322.com/front/lawyer/public/images/contact_addr.png?475090" alt="">
                  <p>
                    <span class="gray">地址：</span>
                    <small class="address">{{caseNameObj.items ? caseNameObj.items[0].address : ''}}</small>
                  </p>
                 </li>
               </ul>
             </div>
           </div>
         </div>
       </Col>
      </Row>
  </div>
</template>

<script>
export default {
    mounted(){
      this.getJusticeType()
      this.$nextTick(()=>{
        this.initEvent()
      })
    },
    data(){
      return {
        justiceTypeObj:{},
        caseAddressObj:{},
        caseNameObj:{},
        searchKey:'',
        typeId:0,
        courtHeight:'100%'
      }
    },
    methods:{
      getJusticeType(){
        this.Api.workdesk.getJusticeType().then(respData=>{
          this.justiceTypeObj = respData
          this.getCaseAddress(respData.data[0].id)
        })
      },
      getCaseAddress(type, isSearch){
        this.typeId = type
        let params = {
          type
        }
        if(isSearch){
          params.search = this.searchKey
        }
        this.Api.workdesk.getCaseAddress(params).then(respData=>{
          this.caseAddressObj = respData.data ? respData.data : {items:[]}
          this.getCaseName(this.caseAddressObj.items[0].comName)
        })
      },
      getCaseName(conName){
        this.Api.workdesk.getCaseName({
          conName
        }).then(respData=>{
          this.caseNameObj = respData.data ? respData.data : {items:[]}
        })
      },
      initEvent(){
          let getHeight = ()=>{
              this.courtHeight = $('html')[0].clientHeight - 235
              if(this.courtHeight < 100){
                  this.courtHeight = 100
              }
              this.courtHeight = this.courtHeight + 'px'
          }
          $(window).resize(function(){
              getHeight()
          })
          getHeight()
      }
    }
}
</script>

<style lang="less" scoped>
  .u-justice-container{
    .u-type-container{
      background: #fff;
      font-size: 16px;
      border: 1px solid #fff;
      padding-bottom: 20px;
      margin-right: 20px;
      overflow: auto;
      li{
        line-height: 45px;
        padding-left: 20px;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        span{
          display: inline-block;
          margin-right: 8px;
        }
        .u-type-img{
            width: 26px;
            height: 26px;
            img{
              width: 100%;
              height: 100%;
            }
        }
      }
    }
    .u-court-container{
      background: #fff;
      height: 100%;
      .u-court-name, .u-court-contact{
          float: left;
      }
      .u-court-name{
        width: 29%;
        font-size: 16px;
        border: 1px solid #fff;
        border-right: 1px solid #eee;
        // height: 970px;
        ul{
          overflow: auto;
        }
        .u-court-input{
          width: 100%;
          text-align: center;
          margin-top: 15px;
          .u-court-search{
            width: 90%;
            .ivu-icon-search{
              cursor: pointer;
            }
            input{
              border-radius: 20px;
            }
          }
        }
        ul{
          overflow-y: auto;
          height: 66%;
          li{
            line-height: 45px;
            margin-top: 12px;
            padding: 0 5% 0 7%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
      }
      
      .u-court-contact{
        width: 71%;
        .u-contact-list{
            padding-bottom: 16px;
            background: #f7f8f9;
            overflow: hidden;
            margin: 0 auto;
            width: 90%;
            margin-top: 20px;

            .u-sign{
                width: 20%;
                float: left;
                p{
                    background: #0099ff;
                    color: #fff;
                    border-radius: 40px;
                    text-align: center;
                    font-size: 22px;
                    width: 55px;
                    height: 55px;
                    padding: 11px;
                    margin: 0px auto;
                    margin-top: 26px;
                }
            }

            .u-contact-way{
              float: left;
              width: 80%;
              p{
                font-size: 16px;
                margin-top: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
              ul{
                margin-top: 4px;
                li{
                  line-height: 25px;
                  p{
                    display: inline-block;
                    margin: 0px;
                    color: #333;
                    vertical-align: middle;
                    width: 91%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    span{
                      margin-left: 8px;
                      color: #999;
                    }
                    .gray{
                      background: #eee;
                    }
                    small{
                          font-size: 14px;
                          color: #0099ff;
                    }
                    .address{
                      color: #333!important;
                    }
                  }
                }
              }
            }
        }
      }
    }
    
  }
</style>
