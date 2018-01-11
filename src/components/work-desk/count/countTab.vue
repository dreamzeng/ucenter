<template>
  <div>
      <Tabs  v-model="countTab" @on-click="tabClick" :animated="false">
        <TabPane  label="交通赔偿金" name="jtpcj">
            <router-view v-if="countTab == 'jtpcj'"></router-view>
        </TabPane >
        <TabPane  label="工伤赔偿金" name="gspcj">
            <router-view v-if="countTab == 'gspcj'"></router-view>
        </TabPane >
        <TabPane  label="诉讼费计算器" name="legal_cost">
            <router-view v-if="countTab == 'legal_cost'"></router-view>
        </TabPane >
        <TabPane  label="劳动补偿金计算" name="labour_cost">
            <router-view v-if="countTab == 'labour_cost'"></router-view>
        </TabPane >
        <TabPane  label="日期计算器" name="date_count">
            <router-view v-if="countTab == 'date_count'"></router-view>
        </TabPane >
        <TabPane  label="人身损害计算器" name="personal_injury">
            <router-view v-if="countTab == 'personal_injury'"></router-view>
        </TabPane >
        <TabPane  label="离婚房产分隔计算器" name="divorce_house">
            <router-view v-if="countTab == 'divorce_house'"></router-view>
        </TabPane >
        <TabPane  label="房屋还贷计算器" name="house_repayment">
            <router-view v-if="countTab == 'house_repayment'"></router-view>
        </TabPane >
        <TabPane  label="个人所得税计算器" name="personal_tax">
            <router-view v-if="countTab == 'personal_tax'"></router-view>
        </TabPane >
        <TabPane  label="财产保全计算器" name="property_preservation">
            <router-view v-if="countTab == 'property_preservation'"></router-view>
        </TabPane >
        <TabPane  label="裁决书逾期计算器" name="award_overdue">
            <router-view v-if="countTab == 'award_overdue'"></router-view>
        </TabPane >
      </Tabs >
  </div>
</template>

<script>
export default {
    created(){
        this.countTab = this.$route.name
    },
    data(){
        return {
            countTab:'jtpcj'
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
            this.countTab = newVal
        }
    }
}
</script>

<style>

</style>
