<template>
  <div>
      <Tabs v-model="searchTab" @on-click="tabClick" :animated="false">
        <TabPane label="司法通讯录" name="justice-contact">
            <router-view v-if="searchTab == 'justice-contact'"></router-view>
        </TabPane>
        <!-- <TabPane label="法规检索" name="law-search">
            <router-view v-if="searchTab == 'law-search'"></router-view>
        </TabPane>
        <TabPane label="案例检索" name="case-search">
            <router-view v-if="searchTab == 'case-search'"></router-view>
        </TabPane> -->
      </Tabs>
  </div>
</template>

<script>
export default {
    created(){
        this.searchTab = this.$route.name
    },
    data(){
        return {
            searchTab:'justice-contact'
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
            this.searchTab = newVal
        }
    }
}
</script>

<style>

</style>
