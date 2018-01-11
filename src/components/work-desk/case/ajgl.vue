<template>
  <div class="u-case-ajgl-container">
        <!-- <div class="u-ajgl-add-btn">
            <Button type="primary" @click="$router.replace({name:'ajgl', params:{type:'add'}})" shape="circle" class="u-fr">
                <i class="el-icon-edit-outline"></i>新建案件
            </Button>
        </div> -->
        <div class="row">
            <div class="col-md-12">
                <div class="u-ct-container">
                    <ajgl-list-case v-if="!$route.params.type"></ajgl-list-case>
                    <ajgl-add-case v-if="$route.params.type == 'add'"></ajgl-add-case>
                    <ajgl-detail-case v-if="$route.params.type == 'detail'"></ajgl-detail-case>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import AjglListCase from './ajgl-list-case'
import AjglAddCase from './ajgl-add-case'
import AjglDetailCase from './ajgl-detail-case'
export default {
    components:{
        AjglListCase,
        AjglAddCase,
        AjglDetailCase
    }
}
</script>
<style lang=less>
    @import '../../../assets/less/work-desk.less';
    @size20: 20px;
    .u-case-ajgl-container{
        .u-ajgl-add-btn{
            padding-bottom: @size20;
        }
        
    }
</style>
