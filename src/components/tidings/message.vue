<template>
    <div class="msg_content_box" >  
                    <div class="layout-header">
                    <Button v-if="$store.state.message.messageCount!=0" @click="messageModify(allRead,1)">全部已读</Button>
                    <Button v-else>全部已读</Button>
                    系统消息({{dataList.length}})</div>
                    <div class="layout-content-main">
                        <ul>
                            <li v-for="(item,index) in dataList" :key="index" :class="item.state.code===1?'on':''">
                              <a href="javascript:;" v-if="item.state.code===0" @click="messageModify(item.id,0,item)">{{item.title}}</a>
                              <a href="javascript:;" v-else="item.state.code===1">{{item.title}}</a>
                              <p>{{item.createTime}}</p>
                            </li>
                        </ul>
                        <p v-if="dataList==''" class="no-data"><i></i></p>
                    </div>           
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    components:{
    },
    data(){
        return {
           dataList:[],
           allRead:[],
           nums:'',
           loading: false,
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getResource();
        });
    },
    methods:{
        ...mapActions([
            'messageCount'
            ]),
       getResource: function (page, limit) {
            let _this = this;
            let param = {
                page: page,type:1
            };
            _this.messageCount(param).then(resp=>{
            if(resp.code == 1){
                _this.dataList = resp.data.items;
                let data = resp.data.items;
                data.forEach(item=>{
                   if(item.state.code == 0){
                      _this.allRead.push(item.id)
                   }
                }); 
                _this.nums =  _this.allRead.length;
                _this.allRead = _this.allRead.join(',')
              }  
            })
             
        },
        messageModify(id,count,item){
          let _this = this;
          let param = {
             ids:id, count:count
          };
          _this.Api.message.messageModify(param).then((resp)=>{
             if(resp.code == 1){
               _this.getResource(1)
               _this.$Message.info(resp.msg);
              } 
            })

        },
        toLoading () {
            this.loading = true;
        },
       
    }
}
</script>

<style lang="less">
@import '../../assets/less/message.less';
</style>