<template>
  <div>
      <Tabs v-model="sameTab" @on-click="tabClick" :animated="false">
        <TabPane label="判决预测" name="pjyc">
            <router-view v-if="sameTab == 'pjyc'"></router-view>
        </TabPane>
        <TabPane label="相似案件" name="xsaj">
            <router-view v-if="sameTab == 'xsaj'"></router-view>
        </TabPane>
      </Tabs>
  </div>
</template>

<script>
export default {
    created(){
        this.sameTab = this.$route.name
    },
    data(){
        return {
            sameTab:'xsaj'
        }
    },
    methods:{
        tabClick(name){
            this.$router.replace({name})
        }
    },
    computed:{
        routeName(){
            return this.$route.name
        }
    },
    watch: {
        routeName(newVal){
            this.sameTab = newVal
        }
    }
}
</script>

<style>

</style>
