<template>
  <div class="u-swdt-container u-ct-container">
      <swdt-list></swdt-list>
      <!-- <swdt-add></swdt-add> -->
  </div>
</template>

<script>
import SwdtList from './swdt-list'
import SwdtAdd from './swdt-add'
export default {
  components:{
    SwdtList,
    SwdtAdd
  }
}
</script>

<style lang=less>
  @import '../../../assets/less/work-desk.less';
</style>
