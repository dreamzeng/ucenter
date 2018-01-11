<template>
  <div>
    <div class="u-ct-container u-fun-wait">
        功能正在设计中，敬请期待...
    </div>
    <!-- <div class="u-ajgl-search">
        <Input class="u-input-round u-ajgl-search-input" placeholder="请输入当事人姓名" />
        <Button type="primary" shape="circle">搜索</Button>
    </div>
    <div class="u-ajgl-case-intro">
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
            <div class="case-state u-fr">
                <p>
                    进度：<span></span>
                </p>
                <p>
                    2017-04-11
                </p>
            </div>
        </div>
        <div class="u-ajgl-case-tit">
            <p>案件标题：<span>提提</span></p>
            <p>案号：<span>262626</span></p>
            <p>案由：<span>买家秀</span></p>
        </div>
        <div class="u-ajgl-case-price clearfix">
            <ul>
                <li>案件类型：<span class="u-ajgl-case-type">公司企业</span></li>
                <li>代理费：<span class="u-ajgl-case-money">69591.00</span>元</li>
            </ul>
            <Button class="u-ajgl-show-detail" @click="$router.replace({name:'ajgl', params:{type:'detail', id: '1'}})" type="primary">查看详情</Button>
        </div>
    </div> -->
  </div>
</template>

<script>
export default {

}
</script>

<style lang=less>
    @size20: 20px;
    .u-fun-wait{
        font-size: 32px;
        font-weight: bold;
        text-align: center;
    }
    .u-ajgl-search{
        .u-ajgl-search-input{
            width: 60%;
            margin-right: @size20;
        }
    }
    .u-ajgl-case-intro{
        background: #fff;
        border: 1px solid #eee;
        margin-top: 17px;
        color: #333;

        .u-ajgl-case-way{
            overflow: hidden;
            padding: 28.5px @size20;
            background: #f7f8f9;
            .case-name{
                width: 60%;
            }
            .case-state{
                width: 40%;
                text-align: end;
            }
        }

        .u-ajgl-case-tit{
            padding: 28.5px @size20;
            p{
                line-height: 23px;
            }
        }

        .u-ajgl-case-price{
            padding: 10px @size20;
            /* margin-bottom: 40px; */
            ul{
                float: left;
                li{
                    .u-ajgl-case-type{
                        color: #fea500;
                    }
                    .u-ajgl-case-money{
                        color: #ff655f;
                    }
                    &:nth-of-type(2){
                        margin-left: 16px;
                    }
                    float: left;
                }
            }
            .u-ajgl-show-detail{
                float: right;
            }
        }
    }
</style>
