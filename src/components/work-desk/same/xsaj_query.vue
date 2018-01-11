<template>
    <Row class="u-xsaj-query-container">
        <Col span="24">
            <div class="u-ct-container u-xsaj-query-form">
              <Input
                type="textarea"
                :rows="5"
                placeholder="示例：故意杀人"
                v-model="keyword">
                </Input>
                <div class="u-xsaj-query-form-btn">
                    <Button type="primary" icon="search" @click="query()" shape="circle">查找相似案件</Button>
                </div>
            </div>
            <div class="u-xsaj-query-history">
                <div class="u-xsaj-query-history-tit">
                    历史检索
                </div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="u-shadow u-xsaj-query-histore-card" v-for="(o, index) in historyKws" :key="index">
                            <div class="u-xsaj-query-histore-keyword">
                                {{o}}
                            </div>
                            <div class="u-xsaj-query-histore-add-btn" @click="()=>addToQuery(o)">
                                <Icon type="plus-round"></Icon>导入到详情
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Col>
    </Row>
</template>

<script>
export default {
    mounted () {
        this.queryHistory()
    },
    data(){
        return {
            keyword:'',
            historyKws: []
        }
    },
    methods: {
        queryHistory(){
            this.historyKws = localStorage.getItem("historyKws").split(',')
        },
        query(){
            if(this.keyword == ""){
                this.$Message.error("请输入查找内容")
                return
            }else{
                if(this.lodash.indexOf(this.historyKws, this.keyword)<0){
                    if(this.historyKws.length < 6){
                        this.historyKws.push(this.keyword)
                    }else{
                        this.historyKws.shift()
                        this.historyKws.push(this.keyword)
                    }
                    localStorage.setItem('historyKws', this.historyKws)
                }
                
                this.keyword = ''
            }
            
        },
        addToQuery(kw){
            this.keyword = kw
        }
    }
}
</script>

<style lang=less>
    @import '../../../assets/less/work-desk.less';
    
    .u-xsaj-query-container{
        .u-xsaj-query-form{
            padding: 30px;
            
            /*查询按钮*/
            .u-xsaj-query-form-btn{
                width: 100%;
                text-align: center;
                margin-top: 30px;
            }
        }

        /* 历史检索 */
        .u-xsaj-query-history{
            margin-top: 50px;
            .u-xsaj-query-history-tit{
                font-size: 16px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .u-xsaj-query-histore-card{
                width: 252px;
                height: 138px;
                float: left;
                margin: 20px;
                .u-xsaj-query-histore-keyword{
                    padding: 28px 18px;
                    line-height: 20px;
                }
                .u-xsaj-query-histore-add-btn{
                    text-align: center;
                    cursor: pointer;
                    vertical-align: middle;
                    line-height: 60px;
                    background: #F7F8F9;
                }
            }
        }
    }
</style>
