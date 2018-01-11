<template>
  <div class="u-ajgl-detail-container">
    <div class="clearfix">
        <Button type="primary" class="u-fr u-ajgl-detail-del">编辑</Button>
        <Button type="error" class="u-fr u-ajgl-detail-edit">删除</Button>
    </div>
    <div class="u-ajgl-case-way">
        <div class="case-name u-fl">
            <p>
                <img src="//static.fy13322.com/front/lawyer/public/images/party.png?475090">
                <span>还是</span>
            </p>
            <p>
                <img src="//static.fy13322.com/front/lawyer/public/images/mobile.png?475090">
                <span>777</span>
            </p>
        </div>
        <div class="case-state u-fl">
            <p>
                进度：<span></span>
            </p>
            <p>
                2017-04-11
            </p>
        </div>
    </div>
    <div class="u-ajgl-detail">
        <div class="u-ajgl-add-group">
            <h4>案件情况</h4>
        </div>
        <ul>
            <li>案件标题：</li>
            <li>案号：</li>
            <li>案由：</li>
            <li>案件类别：</li>
            <li>诉讼标的：</li>
            <li>审级：</li>
            <li>审级结果：</li>
            <li>代理费：</li>
            <li>证据列表：</li>
        </ul>
        <div class="u-ajgl-add-group">
            <h4>案件情况</h4>
        </div>
        <ul>
            <li>收案时间：</li>
            <li>收案地点：</li>
            <li>立案时间：</li>
            <li>立案地点：</li>
            <li>开庭时间：</li>
            <li>开庭地点：</li>
            <li>裁决时间：</li>
            <li>裁决地点：</li>
            <li>上诉时间：</li>
            <li>上诉地点：</li>
        </ul>
        <div class="u-ajgl-add-group">
            <h4>备注</h4>
        </div>
        <ul>
            <li>备注：</li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang=less>
    .u-ajgl-detail-container{
        .u-ajgl-case-way{
            overflow: hidden;
            padding: 28.5px 20px;
            background: #f7f8f9;
            .case-name{
                width: 60%;
            }
            .case-state{
                width: 40%;
            }
        }
        .u-ajgl-detail{
            .u-ajgl-add-group{
                border-bottom: 1px solid #eee;
                margin-top: 20px;
                margin-bottom: 10px;
            }
        }

        .u-ajgl-detail-del, .u-ajgl-detail-edit{
            width: 80px;
            margin-right: 20px;
            margin-bottom: 20px;
        }
    }
</style>
