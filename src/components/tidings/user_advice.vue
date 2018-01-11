<!-- 用户咨询 -->
<template>
    <div class="u-user-advice-container" v-show="showContaner" :style="adviceContainer">
        <div class="u-user-list">
            <div class="u-user-search">
                <Input v-model="searchKey" placeholder="请输入用户名称/手机号"></Input>
                <Input v-model="userId" placeholder="输入ID"></Input>
                <Input v-model="targetUserId" placeholder="输入聊天对象ID"></Input>
                <Button @click="connetIM" type="primary">开始聊天</Button>
            </div>
            <div class="user-list">
                <ul>
                    <li class="clearfix current">
                        <div class="u-user-item">
                            <div class="u-user-head">
                                <img src="http://192.168.10.224/upload/user/1926/f3124ca1074c43608671d780be2d9519.png" alt="头像">
                            </div>
                            <div class="u-user-detail">
                                <div class="u-user-name">
                                    <h4>张三</h4>
                                    <time>11:13</time>
                                </div>
                                <div class="u-msg-detail">
                                    你好，有人在吗
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="clearfix">
                        <div class="u-user-item">
                            <div class="u-user-head">
                                <img src="http://192.168.10.224/upload/user/1926/f3124ca1074c43608671d780be2d9519.png" alt="头像">
                            </div>
                            <div class="u-user-detail">
                                <div class="u-user-name">
                                    <h4>李四</h4>
                                    <time>10:13</time>
                                </div>
                                <div class="u-msg-detail">
                                    哈哈啊，这个真很高箱啊啊搞笑
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="u-advice-chat" :style="{width:chatWidth}">
            <div class="chat-header">
                <span>张三</span>
                <Button type="ghost">在线</Button>
            </div>
            <div class="chat-container" ref="chat-container" :style="{height:chatHeight}">
                <div class="msg-box clearfix" :class="{'u-send-self': o.isSendSelf || userId==o.sendUserId}" v-for="(o, index) in msgList" :key="index">
                    <div class="header">
                        <img src="http://192.168.10.224/upload/user/1926/f3124ca1074c43608671d780be2d9519.png" alt="头像">
                    </div>
                    <div class="text" v-if="o.msgType == Constant.msg.TEXT_TYPE || o.messageType == messageType[Constant.msg.TEXT_TYPE]">
                        {{o.content}}
                    </div>
                    <div class="text" v-if="o.msgType == Constant.msg.IMG_TYPE || o.messageType == messageType[Constant.msg.IMG_TYPE]">
                        <img :src="getIMG(o)" class="u-msg-img" alt="图片消息">
                    </div>
                    <div class="text" v-if="o.msgType == Constant.msg.FILE_TYPE && !o.isSendSelf || o.messageType == messageType[Constant.msg.FILE_TYPE] && !o.isSendSelf">
                        接收到文件：“{{getFileObj(o).fileName}}” <a :href="getFileObj(o).fileUrl" target="_blank">下载</a>
                    </div>
                    <!-- 本地发送文件 -->
                    <div class="text" v-if="o.msgType == Constant.msg.FILE_TYPE && o.isSendSelf || o.messageType == messageType[Constant.msg.FILE_TYPE] && o.isSendSelf">
                        发送文件：“{{getFileObj(o).fileName}}”
                    </div>
                </div>
                
            </div>
            <div class="chat-dialog">
                <div class="dialog-toolbar">
                    <Icon type="happy-outline"></Icon>
                    <Icon type="scissors"></Icon>
                    <span @click="()=>{$refs['msgImg'].click()}"><Icon type="image"></Icon></span>
                    <input id="msgImg" ref="msgImg" @change="msgImgChange($event)" class="u-tool-input" type="file" name="msg">
                    <span @click="()=>{$refs['msgFile'].click()}"><Icon type="folder"></Icon></span>
                    <input id="msgFile" ref="msgFile" class="u-tool-input" @change="msgFileChange($event)" type="file" name="msg">
                    <Icon type="mic-a"></Icon>
                </div>
                <div class="dialog-input">
                    <Input v-model="msgText" type="textarea" :rows="4" placeholder="聊点啥^_^"></Input>
                </div>
                <div class="dialog-footer">
                    <Button @click="sendMsg">发送</Button>
                </div>
            </div>
        </div>
        <div class="u-advice-service">
            <div class="u-user-data">
                <Tabs value="data">
                    <TabPane label="资料" name="data">
                        <ul>
                            <li>
                                <span span="u-data-label">姓名：</span>张三
                            </li>
                            <li>
                                <span span="u-data-label">手机号：</span>17866965858
                            </li>
                            <li>
                                <span span="u-data-label">所在地：</span>广东省深圳市南山区
                            </li>
                            <li>
                                <span span="u-data-label">备注：</span>律政律师
                            </li>
                        </ul>
                    </TabPane>
                    <TabPane label="订单" name="order">用户订单</TabPane>
                </Tabs>
            </div>
            <div class="u-service-order">
                <span class="u-panel-title">最后一次订单服务</span>
                <ul>
                    <li>人事合同：</li>
                    <li>2017-11-20 20:20:21</li>
                </ul>
                <span class="u-panel-title">服务次数</span>
                <ul>
                    <li>2次</li>
                </ul>
            </div>
            <div class="u-common-tool">
                <span class="u-panel-title">常用工具</span>
                <ul>
                    <li>
                        <div class="tool-item">
                            <div><img src="static/images/tool/gspcj.png" alt=""></div>
                            <div>律师费计算</div>
                        </div>
                    </li>
                    <li>
                        <div class="tool-item">
                            <div><img src="static/images/tool/gspcj.png" alt=""></div>
                            <div>诉讼费计算</div>
                        </div>
                    </li>
                    <li>
                        <div class="tool-item">
                            <div><img src="static/images/tool/gspcj.png" alt=""></div>
                            <div>劳动合同</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import imMixins from './imMixins'
export default {
    mixins:[imMixins],
    mounted(){
        this.$nextTick(()=>{
            this.loadImJS()
            this.initMsgType()
            this.initResize()
            setTimeout(() => {
                this.showContaner = true
            }, 600);
        })
    },
    data() {
        return {
            searchKey: '',
            msgText:'',
            adviceContainer:{
                height:'600px',
                width:'100%'
            },
            showContaner:false,
            chatWidth:'51%',
            chatHeight:'62%'
        }
    },
    methods: {
        getChatList(){
            this.Api.advice.getChatList({
                userId:'',
                userRoleType:1 //1:律师;2:用户;3:产权代理
            })
        },
        initResize(){
            
            let getSize = ()=>{
                this.adviceContainer.height = ($('html')[0].clientHeight - 100) + 'px'
                this.adviceContainer.width = ($('html')[0].clientWidth -310) + 'px'
                this.chatWidth = ($('html')[0].clientWidth -850) + 'px'
                this.chatHeight = ($('html')[0].clientHeight - 370) + 'px'
            }
            getSize()
            $(window).resize(function(){
                getSize()
            })
        }
    }
}
</script>

<style lang="less" scoped>
    html{
        overflow: hidden;
    }
    .u-user-advice-container{
        // height: 600px;
        background: #fff;
        .u-user-list, .u-advice-chat{
            float: left;
        }
        .u-advice-service{
            float: right;
            width: 270px;
            border-left:1px solid #eee;
            height: 100%;
        }

        // 回话列表
        .u-user-list{
            width: 270px;
            height: 100%;
            border-right: 1px solid#ccc;

            .u-user-search{
                padding: 15px;
            }

            .user-list{
                ul{
                    li{
                        // background: #eee;
                        &:hover{
                            background: #eee;
                        }
                        height: 65px;
                        // 列表项
                        .u-user-item{
                            width: 100%;
                            .u-user-head, .u-user-detail{float: left;}
                            .u-user-head{
                                width: 50px;
                                height: 50px;
                                border-radius: 100%;
                                margin: 8px 10px;
                                img{
                                    width: 50px;
                                    height: 50px;
                                    border-radius: 100%;
                                }
                            }
                            .u-user-detail{
                                margin: 8px 10px;
                                width: 60%;
                                .u-user-name{
                                    position: relative;
                                    h4{
                                        font-weight: bold;
                                        font-size: 16px;
                                    }
                                    time{
                                        position: absolute;
                                        right:0px;
                                        top: 0px;
                                    }
                                }

                                .u-msg-detail{
                                    margin-top: 5px;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                    li.current{
                        background: #eee;
                    }
                }
            }
        }

        //聊天界面
        .u-advice-chat{
            width: 51%;
            height: 100%;
            // border: 1px solid red;
            position: relative;
            .chat-header{
                height: 80px;
                line-height: 80px;
                padding-left: 30px;
                border-bottom: 1px solid #eee;
            }
            .chat-container{
                height: 60%;
                overflow: auto;
                .msg-box{
                    width: 100%;
                    margin-top: 10px;
                    .header, .text{
                        float: left;
                    }
                    .header{
                        margin-left: 20px;
                        img{
                            width: 50px;
                            height: 50px;
                            border-radius: 100%;
                        }
                    }
                    .text{
                        width: 60%;
                        border: 1px solid #ccc;
                        margin-left: 20px;
                        min-height: 50px;
                        line-height: 30px;
                        padding: 10px;
                        .u-msg-img{
                            width: 95%;
                        }
                    }
                }

                .u-send-self{
                    .header, .text{
                        float: right;
                    }
                }
            }
            .chat-dialog{
                position: absolute;
                width: 100%;
                bottom: 0px;
                .dialog-toolbar{
                    .ivu-icon{
                        font-size: 26px;
                        margin-left: 10px;
                        cursor: pointer;
                    }
                    .u-tool-input{
                        display: none;
                    }
                }
                .dialog-footer{
                    text-align: right;
                    margin: 10px 10px;
                }
            }
        }
    }
</style>
