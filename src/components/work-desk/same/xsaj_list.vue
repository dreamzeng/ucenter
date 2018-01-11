<template>
  <Row class="row u-xsaj-list-container">
      <Col span="24">
          <div class="u-ct-container u-xsaj-list">
            <div>
                <div class="u-xsaj-same-rate">
                    <span>相似度：</span>
                    <span>
                        <Button type="primary" shape="circle">查看详情</Button>
                    </span>
                </div>
            </div>


              <!-- <div class="u-find-none">
                <img src="http://static.fy13322.com/front/lawyer/public/images/noart-pub.png">
                <br>暂无数据
              </div> -->
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
    .u-xsaj-list-container{
        .u-xsaj-list{
            padding: 20px;
        }
    }
</style>
