<template>
  <div class="u-ct-container u-pjyc-forecast-container">
        <div class="u-forecast-probation">
          缓刑概率
        </div>
        <div class="u-forecast-chart clearfix">
            <div class="u-forecast-punish">
              处罚类型
            </div>
            <div class="u-forecast-term">
              刑期
            </div>
        </div>
        <div class="u-forecast-law">
            相关法规
        </div>
        <div class="u-forecast-case">
            相关案例
        </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang=less>
    @import '../../../assets/less/base.less';
    @import '../../../assets/less/work-desk.less';
    @border:1px solid #eaeaec;
    @size-20: 20px;
    .u-pjyc-forecast-container{
        padding: 20px;
        background: #f5f6f7;
        .u-forecast-probation{
            height: 82px;
            background: @u-fff;
            border: @border;
            margin-bottom: @size-20;
        }

        .u-forecast-chart{
            width: 100%;
            .u-forecast-punish, .u-forecast-term{
                float: left;
                background: @u-fff;
                border: @border;
                width: 48%;
                height: 280px;
            }
            .u-forecast-punish{
                margin-right: @size-20+10;
            }
            margin-bottom: @size-20;
        }

        .u-forecast-law, .u-forecast-case{
            background: @u-fff;
            border: @border;
            margin-bottom: @size-20;
            height: 50px;
            line-height: 50px;
        }
    }
</style>
