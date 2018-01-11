<template>
  <Row class="u-wsxz-list-container">
        <Col span="24">
            <div class="u-wsxz-search">
                <ul>
                    <li>
                        <Input v-model="title" placeholder="请输入您要搜索的内容" ></Input>
                    </li>
                    <li class="u-wsxz-search-btn">
                        <Button type="primary" @click="searchHandler()" shape="circle" >查询</Button>
                    </li>
                    <li>
                        <ul class="u-wsxz-search-type">
                            <li :class="{current: typeId == o.id}" 
                                v-for="(o, index) in documentObj.documentType" 
                                :key="index" @click="seachByType(o.id)">
                                {{o.name}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="u-wsxz-list">
                <ul>
                    <li v-for="(o, index) in documentObj.documentList.items" :key="index">
                        <p>
                            <router-link :to="{name:'wsxz', params:{type:'detail', id: o.id}}">{{o.title}}</router-link>
                        </p>
                    </li>
                </ul>
                <Page :total="documentObj.documentList.total" @on-change="onPageChange" class="u-wsxz-page" size="small"></Page>
            </div>
        </Col>
    </Row>
</template>

<script>
export default {
    mounted () {
        this.documentList()
    },
    data(){
        return {
            documentObj: {
                documentList:{}
            },
            title: '',
            typeId: -1,
        }
    },
    methods: {
        documentList(pageNow = 1){
            this.Api.workdesk.documentList({
                title: this.title,
                type: this.typeId,
                page: pageNow,
                limit: this.Constant.page.PAGE_SIZE
            }).then(resp=>{
                this.documentObj = resp.data
            })
        },
        searchHandler(){
            this.documentList(1)
        },
        seachByType(id){
            this.typeId = id
            this.documentList(1)
        },
        onPageChange(page){
            this.$router.replace({name:'wsxz', params:{pageNow:page}})
            this.documentList(page)
        }
    }
}
</script>

<style lang=less>
    @bgcolor:#fff;
    .u-wsxz-list-container{
        .u-wsxz-search{
            background: @bgcolor;
            width: 215px;
            border: 0px solid #ccc;
            padding: 0 10px;
            float: left;
            .ivu-input-type{
                margin-top: 28px;
            }
            .u-wsxz-search-btn{
                text-align: center;
                .ivu-btn{
                    width: 135px;
                    margin: 20px 0px;
                }
            }
            .u-wsxz-search-type{
                li{
                    margin-top: 10px;
                    margin-left: 10px;
                    padding: 0;
                    line-height: 45px;
                    width: 82px;
                    float: left;
                    text-align: center;
                    border-radius: 5px;
                    border: 0px solid #eee;
                    background: #f7f8f9;
                    cursor: pointer;
                }
                .current{
                    background: #0099FF;
                    color: #fff;
                    border: none;
                }
            }
            }

            .u-wsxz-list{
            float: left;
            background: @bgcolor;
            width: 55%;
            margin-left: 20px;
            padding: 27px 8% 0 8%;
            min-width: 550px;
            ul{
                li{
                    border-bottom: 1px solid #eee;
                    p{
                        line-height: 60px;
                        font-size: 16px;
                        a{
                        &:before{
                            content: "•";
                            vertical-align: middle;
                            color: rgb(254, 165, 0);
                            font-size: 26px;
                            padding-right: 8px;
                        }
                        }
                    }
                }
            }
            .u-wsxz-page{
                margin: 20px 0px;
            }
        }
    }
</style>
