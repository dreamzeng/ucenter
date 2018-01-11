<template>
  <div>
      <div v-if="$route.name == 'work-desk'">
        <u-panel class="clearfix" v-for="(item, index) in categoryObj.data" :key="index">
            <div slot="title" class="clearfix">
                <span class="u-fl">{{item.categoryName}}</span>
                <span class="u-fr" v-if="item.categoryId == 1">
                    <Button type="primary" @click="edit()" shape="circle">
                        <span v-if="!isEdit">编辑</span>
                        <span v-if="isEdit">完成</span>
                    </Button >
                </span>
            </div>
            <tool-panel :isEdit="isEdit" :toolType="item.categoryId" :toolList="sortData(item.workDeskVOList)"></tool-panel>
        </u-panel>
        
      </div>
      <div>
          <div class="row">
              <div class="col-md-12">
                  <router-view></router-view>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import ToolPanel from './tool-panel'
import ToolJSON from './tool-json'

export default {
    mounted(){
        this.getCategoryList()
    },
    components:{
        ToolPanel
    },
    data(){
        return {
            ToolJSON,
            categoryObj:{data:[]},
            isEdit: false
        }
    },
    methods:{
        edit(){
            this.isEdit = !this.isEdit
        },
        getCategoryList(){
            this.Api.workdesk.getCategoryList().then((resp)=>{
                this.categoryObj = resp
            })
        },
        /**
         * 根据sort字段进行数组排序
         */
        sortData(toolList){
            if(toolList && toolList.length > 0){
                return this.lodash.sortBy(toolList, 'sort')
            }else{
                return []
            }
        }
    }
}
</script>

<style>

</style>
