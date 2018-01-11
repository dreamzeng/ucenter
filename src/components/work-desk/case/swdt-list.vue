<template>
  <Row class="u-swdt-list-container">
      <Col span="24" class="u-swdt-list">
          <div class="u-swdt-new-case-btn clearfix">
              <Button type="primary" shape="circle">新建案件</Button>
          </div>
          <div class="u-swdt-item clearfix">
              <div class="u-swdt-item-header">
                  <p class="u-swdt-item-tit">
                     <span>案件详情</span>
                     <small>（2017/11/20）</small>
                     <Icon type="trash-a"></Icon>
                  </p>
                  <p class="u-content">
                      交通
                  </p>
              </div>
              <div class="u-swdt-item-content">
                  <span>诉求：</span>
                  <p>1/2（共2个诉求，其中一个诉求满足所有条件）</p>
              </div>
              <div class="u-swdt-item-btn">
                  <Button type="primary" shape="circle">查看详情</Button>
                  <Button type="primary" shape="circle">查看组织结构</Button>
              </div>
          </div>
      </Col>
  </Row>
</template>

<script>
export default {

}
</script>

<style lang="less">
    @import '../../../assets/less/base.less';
    .u-swdt-list-container{
        .u-swdt-list{
            background: @u-fff;
            // padding: 40px 30px;
            .u-swdt-new-case-btn{
                height: 40px;
                margin-bottom: 20px;
                .ivu-btn{
                    float: right;
                }
            }
            .u-swdt-item{
                border: 1px solid #eee;
                .u-swdt-item-header{
                    padding: 30px 20px 30px 10px;
                    background: #F7F8F9;
                    .u-swdt-item-tit{
                        span{
                            font-size: 18px;
                            color: #333;
                            vertical-align: middle;
                            margin-left: 5px;
                            &:before{
                                content: "•";
                                font-size: 32px;
                                color: rgb(0, 153, 255);
                                vertical-align: middle;
                            }
                        }
                        small{
                            font-size: 14px;
                            margin-left: 10px;
                        }
                        .ivu-icon-trash-a{
                            float: right;
                            cursor: pointer;
                        }
                    }
                    .u-content{
                        line-height: 20px;
                        padding-left: 20px;
                    }
                }

                .u-swdt-item-content{
                    padding: 20px;
                    background: @u-fff;
                    line-height: 22px;
                    span{
                        width: 20%;
                        vertical-align: top;
                        color: #333;
                    }
                }

                .u-swdt-item-btn{
                    margin-bottom: 20px;
                    margin-right: 20px;
                    height: 40px;
                    .ivu-btn{
                        float: right;
                        margin-left: 20px;
                    }
                }
            }
        }
    }
</style>
