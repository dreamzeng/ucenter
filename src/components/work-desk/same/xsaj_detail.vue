<template>
  <Row class="u-xsaj-detail-container">
      <Col span="24">
          <div class="u-ct-container u-xsaj-detail">
                <ul>
                    <li>审判长：</li>
                    <li>审判员：</li>
                    <li>陪审员：</li>
                    <li>公诉机关：</li>
                    <li>犯罪嫌疑人：</li>
                    <li>犯罪类型：</li>
                    <li>受审双方信息：</li>
                    <li>内容：</li>
                    <li>本院认为：</li>
                    <li>过程：</li>
                    <li>判决结果：</li>
                    <li>立案日期：</li>
                    <li>判决日期：</li>
                </ul>
          </div>
      </Col>
  </Row>
</template>

<script>
export default {

}
</script>

<style lang=less>
    @import '../../../assets/less/work-desk.less';
    .u-xsaj-detail-container{
        .u-xsaj-detail{
            padding: 40px 30px;
            color: #666;
            font-size: 14px;
            ul{
                li{
                    line-height: 30px;
                }
            }
        }
    }
</style>
