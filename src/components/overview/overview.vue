<template>
  <div>
    <div class="row u-overview-top">
        <div class="col-md-12">
            <div class="u-bill u-mr-30">
                <u-panel title="账单">
                    <div>
                        <div class="u-shadow u-mb-20">已到账</div>
                        <div class="u-shadow">未到账</div>
                    </div>
                </u-panel>
            </div>
            <div class="u-overview-detail">
                <u-panel title="总览">
                    <div class="u-shadow">
                        <div class="u-detail-item">待完成订单</div>
                        <div class="u-detail-item">全部订单</div>
                        <div class="u-detail-item">总收益</div>
                        <div class="u-detail-item">可体现金额</div>
                    </div>
                </u-panel>
            </div>
        </div>
    </div>
    <div class="row u-overview-list">
        <div class="col-md-12">
            <u-panel>
                <div slot="title">
                    <span>个人订单</span>
                    <span>更多</span>
                </div>
                <div class="u-shadow">
                    <el-table
                        :data="tableData"
                        style="width: 100%">
                        <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址">
                        </el-table-column>
                        </el-table>
                </div>
            </u-panel>
        </div>
    </div>
    <div class="row u-overview-tools">
        <div class="col-md-12">
            <u-panel title="常用工具">
                <div class="tools-list">
                    <div class="u-shadow">相似案件</div>
                    <div class="u-shadow">判决预测</div>
                    <div class="u-shadow">交通赔偿金</div>
                    <div class="u-shadow">文书下载</div>
                    <div class="u-shadow">案件管理</div>
                    <div class="u-shadow">工商赔偿金</div>
                </div>
            </u-panel>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    created(){
        // this.Api.overview.userList({
        //     page:1,
        //     limit:10,
        //     type: 1
        // }).then(resp=>{
        //     console.log(resp)
        // })
    },
    data() {
        return {
            tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
            }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
            }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    }
}
</script>

<style lang=less>
    .u-overview-top{
        height: 340px;
        .u-bill{
            .u-shadow{
                height: 140px;
                width: 380px;
            }
        }
        /*总览*/
        .u-overview-detail{
            width: 100%;
            .u-shadow{
                height: 300px;
                align-items: center;
                .u-detail-item{
                    width: 25%;
                    height: 170px;
                    border-right: 1px solid #ccc;
                    &:last-of-type{
                        border: 0px;
                    }
                }
            }
        }
    }
    .u-overview-tools{
        .tools-list{
            .u-shadow{
                height: 140px;
                width: 300px;
                float: left;
                margin-right: 20px;
                margin-bottom: 20px;
            }
        }
    }
    .u-overview-list, .u-overview-tools{
        margin-top: 30px;
    }
</style>
