<template>
  <div class="u-law-container">
    <Row>
      <Col span="6">
        <div class="u-law-search">
          <Form ref="form" :model="form" :label-width="100">
            <ul>
              <li>
                <FormItem label="法律文库：">
                  <Input v-model="form.name"></Input>
                </FormItem>
              </li>
              <li>
                <FormItem label="关键字：">
                  <Input v-model="form.name" placeholder="请输入关键字"></Input>
                </FormItem>
              </li>
            </ul>
            <Button type="primary" shape="circle">查询</Button>
          </Form>
        </div>
        </Col>
        <Col span="18">
          <div class="u-law-detail">
            <div class="u-no-content">
              <img src="//static.fy13322.com/front/lawyer/public/images/noart-pub.png?475090" alt="无内容">
              <p class="u-tc">无内容</p>
            </div>
          </div>
        </Col>
      </Row>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form:{}
    }
  }
}
</script>

<style lang=less>
  .u-law-container{
    .u-law-search{
      padding: 0px 10px;
      text-align: center;
      .ivu-form{
        background: #fff;
        padding-bottom: 40px;
      }
      ul{
        li{
          border-bottom: 1px solid #eee;
          text-align: left;
          line-height: 33px;
          padding-top: 28px;
          .ivu-form-item{
            margin-bottom: 0px;
            padding: 0px;
            .ivu-input{
              border: 0px;
              outline: none;
              &:focus{
                border: 0px;
                outline: none!important;
              }
              &:hover{
                border: 0px;
                outline: none;
              }
            }
          }
          
        }
      }

      .ivu-btn{
        margin-top: 80px;
        width: 140px;
      }
    }

    .u-law-detail{
      background: #fff;
      margin-bottom: 130px;
      min-height: 550px;

      .u-no-content{
        margin: 0 auto;
        width: 215px;
        padding: 189px 0;
      }
    }
  }
</style>
