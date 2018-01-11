<template>
  <div class="u-tool-panel-container">
        <div class="panel-container">
            <div class="u-tool-panel u-shadow" @click="gotoTool(tool.types)" v-for="(tool, index) in toolList" :key="index">
                <i class="u-minus-tool" @click="minusTool(tool, index)" v-if="toolType == 1 && isEdit && tool.isFixed==0"></i>
                <i class="u-add-tool" @click="addTool(tool, index)" v-if="toolType != 1  && isEdit && tool.isFixed==0 && tool.isAdd!=1"></i>
                <div class="u-tool-detail">
                    <i class="u-tool-icon" :style="getBg(tool.types)"></i>
                    <span>{{tool.workdeskName}}</span>
                </div>
                <span class="u-tool-added-tip" v-if="toolType != 1 && tool.isAdd==1">已添加</span>
            </div>
            <div class="u-tool-panel u-tool-panel-dash u-shadow" v-if="toolType == 1 && isEdit"></div>
        </div>   
  </div>
</template>

<script>
let ToolTypes = require('./tool-types.json')
//工具面板
export default {
    props:{
        toolList:{
            type: Array,
            default: ()=>{return []}
        },
        toolType: {
            type: Number
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            toolDatas:[],
            isSubmit: false //是否提交数据
        }
    },
    methods: {
        gotoTool(types){
            if(!this.isEdit){
                let pathName = ToolTypes[types].path
                this.$router.replace({name: pathName})
            }
        },
        minusTool(tool, index){
            if(this.checkSubmit()){
                this.Api.workdesk.lessCommonTool({
                    workdeskUuid:tool.uuid
                }).then(resp =>{
                    this.isSubmit = false
                    this.$Message.success('去除常用工具成功')
                    this.$parent.$parent.getCategoryList()
                }).catch(err=>{
                    console.error(err);
                    this.$Message.error('去除常用工具失败')
                })      
            }
        },
        checkSubmit(){
            if(this.isSubmit){
                return false
            }
            this.isSubmit = true
            return true
        },
        addTool(tool, index){
            if(this.checkSubmit()){
                this.Api.workdesk.addCommonTool({
                    workdeskUuid:tool.uuid
                }).then(resp =>{
                    this.isSubmit = false
                    this.$Message.success('添加到常用工具成功')
                    this.$parent.$parent.getCategoryList()
                }).catch(err=>{
                    console.error(err);
                    this.$Message.error('添加到常用工具失败')
                })
            }
        },
        getBg(types){
            let icon = ToolTypes[types].path
            return {backgroundImage: 'url(static/images/tool/'+icon+'.png)'}
        }
    },
    watch: {
        
    }
}
</script>

<style lang=less>
    .u-tool-panel-container{
        .panel-container{
            margin-left: -15px;
        }
        .u-tool-panel{
            position: relative;
            height: 140px;
            width: 300px;
            float: left;
            margin-right: 25px;
            margin-bottom: 25px;
            cursor: pointer;
            .u-tool-detail{
                font-size: 16px;
                color: #666;
                text-align: center;
                height: 100%;
                position: relative;
                i.u-tool-icon{
                    display: inline-block;
                    width: 70px;
                    height: 70px;
                    font-size: 55px;
                    margin-right: 20px;
                    color: rgb(136, 78, 240);
                    /* border-radius: 10px; */
                    background-repeat: no-repeat;
                    position: absolute;
                    left:40px;
                    top: 35px;
                }
                span{
                    position: absolute;
                    top:60px;
                    left: 128px;
                }
            }
            .u-minus-tool, .u-add-tool{
                width: 31px;
                height: 31px;
                position: absolute;
                z-index: 100;
                top:-16px;
                right: -16px;
            }
            .u-minus-tool{
                background: url('../../../static/images/minus-tool.png') no-repeat;
            }
            .u-add-tool{
                background: url('../../../static/images/add-tool.png') no-repeat;
            }
            .u-tool-added-tip{
                position: absolute;
                right: 6px;
                bottom: 6px;
            }
        }

        .u-tool-panel-dash{
            border: 1px dashed #ccc;
        }
    }
</style>
