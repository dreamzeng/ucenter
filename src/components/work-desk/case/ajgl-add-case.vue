<template>
  <div class="u-ajgl-add-container">
    <Form ref="form" :model="caseObj" :label-width="100" style="width:100%;">
        <div class="u-ajgl-add-group">
            <h4>当事人情况</h4>
        </div>
        <FormItem label="姓名：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="电话：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="进度：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <div class="u-ajgl-add-group">
            <h4>案件情况</h4>
        </div>
        <FormItem label="案件标题：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="案号：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="案由：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="案件类型：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="诉讼标的：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="审级：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="审理结果：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="代理费：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="证据列表：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <div class="u-ajgl-add-group">
            <h4>案件情况</h4>
        </div>
        <FormItem label="收按时间：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="收案地点：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="立案时间：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="立案地点：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="开庭时间：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="开庭地点：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="裁决时间：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="裁决地点：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="上诉时间：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="上诉地点：">
            <Input v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <div class="u-ajgl-add-group">
            <h4>备注</h4>
        </div>
        
        <FormItem label="备注：">
            <Input type="textarea" v-model="caseObj.name" placeholder="请输入姓名"></Input>
        </FormItem>
        
        <FormItem>
            <Button type="primary">保存</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
    data(){
        return {
            caseObj:{

            }
        }
    }
}
</script>

<style lang=less>
    .u-ajgl-add-container{
        border: 1px solid #eee;
        padding: 8px 5% 0 5%;
        .u-ajgl-add-group{
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }
    }
</style>
