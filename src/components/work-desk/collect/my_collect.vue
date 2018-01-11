<template>
    <div class="collect_content_box">
                <div class="layout-header">资讯收藏</div>
                    <div class="layout-content-main">
                        <ul>
                            <li v-for="(item,index) in dataList" :key="index" >
                            <a :href="item.articleId"><img :src="item.logo"></a>
                            <div class="content_right"><h2 v-text="item.title"></h2>
                             <p v-text="item.shortContent"></p><span v-text="item.categoryName"></span> 
                            </div></li>
                        </ul>
                         <p v-if="dataList==''" class="no-data"><i></i></p>
                        <div class="more">
                        <Button type="info" :loading="loading" v-if="dataList!=''"  @click="toLoading" style="width:270px">查看更多</Button>
                        <Button type="info"  v-if="dataList!=''&& dataReq==''"   style="width:270px">没有了...</Button>
                        </div>
                    </div>
              
    </div>
</template>
<script>
export default {
    components:{
    },
    data(){
        return {
           dataList: [],
           loading: false,
           dataReq:'1',
           page:1,
           limit:8
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getResource(this.page,this.limit);
        });
    },
    methods:{
         getResource: function (page, limit) {
            let _this = this;
            let param = {
                page: page, limit: limit
            };
            _this.Api.workdesk.myCollect(param).then((resp)=>{
             if(resp.code == 1){
                _this.loading = false;
                this.dataReq = resp.data.items;
                let data = resp.data.items;
                data.forEach((g)=>{
                    _this.dataList.push(g)
                });
              }   
            })
        },
        toLoading () {
            let _this = this;
            _this.loading = true;
            _this.page = _this.page + 1;
            _this.limit= _this.limit;
            _this.getResource(_this.page,_this.limit) 
        },
       
    }
}
</script>
<style lang="less">
@import '../../../assets/less/my_collect.less';
</style>
