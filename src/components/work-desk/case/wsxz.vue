<template>
  <div class="u-wsxz-container">
      <wsxz-list v-if="$route.params.type!='detail'"></wsxz-list>
      <wsxz-detail v-if="$route.params.type=='detail'" ></wsxz-detail>
  </div>
</template>

<script>
import WsxzList from './wsxz-list'
import WsxzDetail from './wsxz-detail'
export default {
  components:{
    WsxzList,
    WsxzDetail
  }
}
</script>

<style lang=less>
  
  .u-wsxz-container{
    
  }


</style>
