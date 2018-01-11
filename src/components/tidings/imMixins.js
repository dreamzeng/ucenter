let loadjs = require('loadjs')
export default{
    data(){
        return {
            antClient:null,
            messageType:{
                
            },
            targetUserId:'4219',
            userId:'4218',
            msgCM: '',  //自定义消息
            msgText: '',  //文本消息
            msgList: []   ///聊天列表
        }
    },
    methods: {
        initMsgType(){
            this.messageType = {
                [this.Constant.msg.TEXT_TYPE]:'3901', //文本
                [this.Constant.msg.IMG_TYPE]:'3902', //消息
                [this.Constant.msg.FILE_TYPE]:'3904', //文件
                [this.Constant.msg.CUS_TYPE]:'3899', //自定义
            }
        },
        /**
         * 加载聊天脚本
         */
        loadImJS() {
            loadjs([
                    'static/im/mqttws31.min.js', 
                    'static/im/socket.io.min.js', 
                    'static/im/crypto-js.js',
                    'static/im/nodemqtt.js',
                    // 'static/im/antim_v1.js',
                    // 'static/im/im_1.1.0.min.js'
                    ],{
                        success:()=>{
                            //this.connetIM()
                            // console.log(CryptoJS);
                            loadjs(['static/im/antim_v1.js'])
                            // loadjs(['static/im/antim.js'])
                        }
                    })
        },
        /**
         * 初始化IM
         */
        connetIM() {
            let option = {
                companyCode:"13322", //公司代码
                appKey:"13322001", //应用ID
                appSecret:"191e646e6e6746f0b3b093ed32dc7942", //加密字符
                userId: this.userId, //用户ID
                connectWay: 1, //连接方式，0：允许多端 1：允许一端
                onSuccess:()=>{ //连接成功回调
                    this.$Message.success('连接成功')
                    this.antClient.updateUser({userName:'关羽'});
                    this.getRoomHisMsg()
                    this.acceptRoomMsg(); // 接受聊天室消息
                    // getUserChatRooms(); // 查询用户所在聊天室，返回聊天室列表
                },
                onFailure() { //连接失败回调
                    console.log("连接失败");
                }
            };
            this.antClient = AntClientManager.newInterface(option, true, 'pre');
        },
        /**
         * 接收聊天消息
         */
        acceptRoomMsg(){
            this.antClient.acceptRoomMsg({
                textMsg: this.textMsgCallback, //收到聊天室文本消息
                imgMsg: this.imgMsgCallback, //收到聊天室图片消息
                fileMsg: this.fileMsgCallback, //收到聊天室文件消息
                customizeMsg: this.customizeMsgCallback, //收到聊天室自定义消息

                // 聊天室成员加入
                // roomMembersJoin:this.roomMembersJoin,

                // 删除聊天室
                // deleteRoom: this.deleteRoom,

                // 聊天室信息更新
                // updateRoom: this.updateRoom,

                // 成员退出聊天室
                // roomMembersLeave: this.roomMembersLeave,
                // 收到邀请加入聊天室的消息
                // joinRoom: this.joinRoom
            });
        },
        /**
         * 文本消息回调
         */
        textMsgCallback(data){
            data.msgType = this.Constant.msg.TEXT_TYPE
            this.msgList.push(data)
        },
        /**
         * 图片消息回调
         */
        imgMsgCallback(data){
            data.msgType = this.Constant.msg.IMG_TYPE
            this.msgList.push(data)
        },
        msgImgChange(event){
            console.log(event);
            this.sendImgMsg(event)
        },
        /**
         * 文件消息回调
         */
        fileMsgCallback(data){
            data.msgType = this.Constant.msg.FILE_TYPE
            this.msgList.push(data)
        },
        msgFileChange(event){
            console.log(event);
            this.sendFileMsg(event)
        },
        /**
         * 自定义消息回调
         */
        customizeMsgCallback(data){
            data.msgType = this.Constant.msg.CUS_TYPE
            this.msgList.push(data)
        },
        /**
         * 发送文本消息
         */
        sendMsg(){
            this.antClient.sendRoomTxtMsg(this.targetUserId, this.msgText, '', (data)=>{

                this.msgList.push({
                    msgType: this.Constant.msg.TEXT_TYPE,
                    content: this.msgText,
                    isSendSelf: true
                })
                this.msgText = ''
                console.log('发送消息成功');
            }, (data)=> {
                console.log('发送消息失败');
            }, 'face');
        },
        /**
         * 发送图像消息
         */
        sendImgMsg(){
            this.antClient.sendRoomFileMsg(this.targetUserId, 'msgImg', 
                (data)=> {
                    this.$Message.success('图片上传成功')
                    let msgObj = {
                        "picUrl":"http://demo-ftp.71chat.com/group1/M00/00/0D/CoUWF1pB-Q2ADo8zAAR0kOxzNow675.jpg"
                    }
                    this.msgList.push({
                        msgType: this.Constant.msg.IMG_TYPE,
                        isSendSelf: true,                        
                        content: JSON.stringify(msgObj)
                    })
                }, 
                (data)=> {
                    this.$Message.error('图片上传失败');
                },
                (data)=> {
                    this.$Message.error('图片上传失败');
                },
                (data)=> {
                    this.$Message.error('图片上传失败');
                },
                (data)=> {
                    // 上传进度
                },
            'face', false)
        },
        /**
         * 发送文件消息
         */
        sendFileMsg(event){
            this.antClient.sendRoomFileMsg(this.targetUserId, 'msgFile', 
                (data)=> {
                    this.$Message.success('文件上传成功')
                    let msgObj = {
                        "fileName":event.target.value
                    }
                    this.msgList.push({
                        msgType: this.Constant.msg.FILE_TYPE,
                        isSendSelf: true,
                        content: JSON.stringify(msgObj)
                    })
                }, 
                (data)=> {
                    this.$Message.error('文件上传失败');
                },
                (data)=> {
                    this.$Message.error('文件上传失败');
                },
                (data)=> {
                    this.$Message.error('文件上传失败');
                },
                (data)=> {
                    // 上传进度
                }, 
            'face', false)
        },
        /**
         * 发送自定义消息
         */
        sendCustomizeMsg(){

        },
        createSessionId(userId, targetUserId){
            if(!userId || !targetUserId) {
                return null;
            }
            var sessionId = null;
            if(this.compare(userId, targetUserId) > 0){
                sessionId = targetUserId + userId;
            }else{
                sessionId = userId + targetUserId;
            }
            sessionId = CryptoJS.MD5(sessionId).toString();
            return sessionId;
        },
        compare(userId, targetUserId){
            var result = 1;
            userId = userId.replace(/[^0-9a-zA-Z]/g,"");
            targetUserId = targetUserId.replace(/[^0-9a-zA-Z]/g,"");
            if(userId.length > targetUserId.length){
                result = 1;
            } else if(userId.length < targetUserId.length){
                result = -1;
            } else {
                var userIdArray = userId.split('');
                var targetUserIdArray = targetUserId.split('');
                for(var i = 0; i < userIdArray.length; i++){
                    if(userIdArray[i] < targetUserIdArray[i]){
                        result = -1;
                        break;
                    }else if(userIdArray[i] > targetUserIdArray[i]){
                        result = 1;
                        break;
                    }
                }
            }
            return result;
        },
        /**
         * 获取历史消息
         */
        getRoomHisMsg(){
            let sessionId = this.createSessionId(this.userId, this.targetUserId)
            this.antClient.getRoomHisMsg(
                sessionId,
                null,
                null,
                (data)=>{
                    console.log(data);
                    this.msgList = data
                    setTimeout(() => {
                        this.scrollToBottom()
                    }, 200);
                },
                (data)=>{
                    console.err('errrrrrrrrr')
                    console.err(data);
                }
            )
        },
        scrollToBottom(){
            let el = document.querySelector('.chat-container')
            el.scrollTop = el.scrollHeight + 100
        },
        getIMG(o){
            return JSON.parse(o.content).picUrl
        },
        getFileObj(o){
            return JSON.parse(o.content)
        }
    },
    computed:{
        msgLength(){
            return this.msgList.length
        }
    },
    watch: {
        msgLength(newValue, oldValue) {
            setTimeout(() => {
                this.scrollToBottom()
            }, 200);
        }
    },
}