<template>
  <Row class="u-swdt-add-container">
      <Col class="col-md-12">
            <div class="u-swdt-case-info">
                <p class="u-swdt-case-info-tit">案件详情</p>
                <div class="u-swdt-case-info-case">
                  <Input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入案件详情"
                    v-model="form.case">
                    </Input>
                </div>
            </div>
            <div class="u-swdt-req-tit clearfix">
                <span>用户诉求</span>
                <add-req-btn></add-req-btn>
            </div>
            <div class="u-swdt-req-list">
                <Form :model="form" :label-width="80">
                    <div class="u-swdt-req-item">
                        <div class="u-swdt-req-item-tit">
                            <span>诉求1</span>
                            <add-req-btn class="u-fr"></add-req-btn>
                        </div>
                        <ul class="u-swdt-req-item-container">
                            <li>
                                <FormItem label="条件1：">
                                    <Input v-model="form.name"></Input>
                                    <Checkbox></Checkbox>
                                </FormItem>
                                <Icon type="trash-a"></Icon>
                            </li>
                            <li>
                                <FormItem label="条件2：">
                                    <Input v-model="form.name"></Input>
                                    <Checkbox></Checkbox>
                                </FormItem>
                                <Icon type="trash-a"></Icon>
                            </li>
                            <li class="u-swdt-req-btn">
                                <Button shape="circle" class="u-fr u-swdt-req-btn" type="primary">添加条件</Button>
                                <Button shape="circle" class="u-fr u-swdt-req-btn" type="error">删除诉求</Button>
                            </li>
                        </ul>
                    </div>
                    <div class="u-swdt-req-item">
                        <div class="u-swdt-req-item-tit">
                            <span>诉求1</span>
                            <add-req-btn class="u-fr"></add-req-btn>
                        </div>
                        <ul class="u-swdt-req-item-container">
                            <li>
                                <FormItem label="条件1：">
                                    <Input v-model="form.name"></Input>
                                    <Checkbox></Checkbox>
                                </FormItem>
                                <Icon type="trash-a"></Icon>
                            </li>
                            <li>
                                <FormItem label="条件2：">
                                    <Input v-model="form.name"></Input>
                                    <Checkbox></Checkbox>
                                </FormItem>
                                <Icon type="trash-a"></Icon>
                            </li>
                            <li>
                                <Button shape="circle" class="u-fr u-swdt-req-btn" type="primary">添加条件</Button>
                                <Button shape="circle" class="u-fr u-swdt-req-btn" type="error">删除诉求</Button>
                            </li>
                        </ul>
                    </div>
                </Form>
                <div class="u-swdt-req-add-btn">
                    <Button shape="circle" class="u-swdt-req-btn" type="primary">保存</Button>
                    <Button shape="circle" class="u-swdt-req-btn" type="primary">查看组织结构</Button>
                </div>
            </div>
      </Col>
  </Row>
</template>

<script>
import Vue from 'vue'
var addReqBtn = Vue.extend({
    template:`
        <span @click="$emit('addReqBtnClick')" class="u-swdt-add-req-btn"><i class="el-icon-plus"></i>添加诉求</span>
    `
})
export default {
    components:{
        addReqBtn
    },
    data(){
        return {
            form:{

            }
        }
    }
}
</script>

<style lang=less>
    .u-swdt-add-container{
        margin: -20px;
        .u-swdt-add-req-btn{
            font-size: 14px;
            color:#0099FF;
            cursor: pointer;
        }
        .u-swdt-case-info{

        }
        .u-swdt-req-tit{
            margin: 15px 0px;
            span{
                &:first-of-type{
                    font-size: 18px;
                }
                &:last-of-type{
                    float: right;
                }
            }
        }
        .u-swdt-req-list{
            .u-swdt-req-item-tit{
                background: #f7f8f9;
                line-height: 70px;
                padding: 0 20px;
            }
            .u-swdt-req-item{
                border: 1px solid #eee;
                margin-bottom: 30px;
                ul.u-swdt-req-item-container{
                    padding: 10px;
                    li{
                        height: 50px;
                        line-height: 50px;
                        position: relative;
                        .ivu-input-type{
                            width: 90%;
                        }
                        .ivu-icon-trash-a{
                            margin-left: 10px;
                            cursor: pointer;
                            position: absolute;
                            right: 20px;
                            top:8px;
                        }
                        .u-swdt-req-btn{
                            margin-left: 10px;
                        }
                    }
                }
            }

            .u-swdt-req-add-btn{
                width: 100%;
                text-align: center;
            }
            
        }
    }
</style>
