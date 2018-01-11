<template>
  <div>
      <Tabs v-model="caseTab" @on-click="tabClick" :animated="false">
        <TabPane label="案件管理" name="ajgl">
            <router-view v-if="caseTab == 'ajgl'"></router-view>
        </TabPane>
        <TabPane label="文书下载" name="wsxz">
            <router-view v-if="caseTab == 'wsxz'"></router-view>
        </TabPane>
        <!-- <TabPane label="思维导图" name="swdt">
            <router-view v-if="caseTab == 'swdt'"></router-view>
        </TabPane> -->
      </Tabs>
  </div>
</template>

<script>
export default {
    created(){
        this.caseTab = this.$route.name
    },
    data(){
        return {
            caseTab:'ajgl'
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
            this.caseTab = newVal
        }
    }
}
</script>

<style>

</style>
