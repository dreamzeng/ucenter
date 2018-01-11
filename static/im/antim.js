(function (window) {
    var DEBUG = true,
        protocol = (("https:" == window.document.location.protocol) ? "https://" : "http://"),
        DNS_URL = protocol + "www.71ant.com/antapi", /**默认环境*/
        DNS_URL_TEST = protocol + "192.168.12.48/antapi", /**测试环境地址*/
        DNS_URL_HB = protocol + "getway.lonecm.com/antapi", /**HB环境*/
        DNS_URL_PRO = protocol + "www.71ant.com/getway", /**东莞环境*/
        DNS_URL_DEV = protocol + "192.168.12.36/antapi", /**开发环境*/
        DNS_URL_PRE = protocol + "pre.71ant.com/antapi", /**预发布环境**/
        ANT_MESSAGE_URL,
        ANT_AES_IV = CryptoJS.enc.Utf8.parse("hhly#*&^%$#@!)*(");

    var SDK_TYPE = 2,
        QOS = 1,
        MSG_FLAG = 0,
        MSG_STATE = 0,
        CHAT_TYPE = 1,
        ROOM_CHAT_TYPE = 2,
        CROSSDOMAIN = true,
        MESSAGEARRAY = [];

    var EMPTYFN = function () {
    };

    var TOPICS = {
        SEND_MSG_TOPIC: "sdk_send",
        RECEIVE_MSg_TOPIC: "sdk_receive",
        READ_MSg_TOPIC: "sdk_read",
        USER_MSG_TOPIC: "sdk_user"
    };

    var AntMessagerParse = {
        CHATMSG_TYPE_FLAG: "1",
        CHATMSG_TYPE_FLAG_3: "3",
        CHATMSG_TYPE: {
            RECIVE: 1000,
            TXT: 3901,
            IMG: 3902,
            AUDIO: 1003,
            VIDEO: 1004,
            FILE: 3904,
            CUSTOMIZE: 3899,
            POSITION: 1006,
            MULTIFUNCTION: 1007,// 图文混合
            AT_MSG: 1008,//@消息
            VIDEO_MULITI: 1009,//多人音频视频
            OTHER: 1999//多人音频视频
        },
        NOTICE_TYPE_FLAG: "21",
        NOTICE_TYPE: {
            VERSION_UPDATE: 2000,
            USER_EXIT: 2100,//用户退出登录
            USER_ONLINE: 2101,//用户在线
            USER_LIVE: 2102,//用户离开
            USER_BUSY: 2103,//用户忙碌
            USER_TICK_OUT: 2104,//用户被踢出登录
            USER_ACCOUNT_ENABLE: 2105,//用户账号被停用
            USER_INFO_UPDATE: 2110 //用户信息变更（包括头像、名称、个性签名等信息的变更）
        },
        ROOM_TYPE_FLAG: "22",
        ROOM_TYPE: {
            CREATE: 2201, //创建聊天室
            DELETE: 2202, //解散聊天室
            MEMBER_ADD: 2203, //聊天室成员变更（增加成员）
            MEMBER_DELETE: 2204, //聊天室成员变更（删除成员)
            MEMBER_EXIT: 2205, //聊天室成员变更（成员退出)
            MEMBER_UPDATE: 2206, //聊天室成员变更（备注信息的变更等等）
            ROOM_UPDATE: 2207, //聊天室更新(包括头像、名称等变更)
            ROOM_SECRET_MODE: 2291, //聊天室是阅后即焚模式
            ROOM_NORMAL_MODE: 2292 //聊天室是普通消息模式
        },
        ORG_TYPE_FLAG: "23",
        ORG_TYPE: {
            UPDATE: 2301//组织架构变更
        },
        GROUP_TYPE_FlAG: "25",
        GROUP_TYPE: {
            CREATE: 2501, //	创建讨论组
            DELETE: 2502, //	解散讨论组
            MEMBER_ADD: 2503, //	讨论组成员变更（增加成员）
            MEMBER_DELETE: 2504, //	讨论组成员变更（删除成员）
            MEMBER_EXIT: 2505, //	讨论组成员变更（成员退出）
            MEMBER_UPDATE: 2506, //	讨论组成员变更（备注信息的变更等等）
            ROOM_UPDATE: 2507, //	讨论组更新(包括头像、名称等变更)
            ROOM_SECRET_MODE: 2591, //	讨论组是阅后即焚模式
            ROOM_NORMAL_MODE: 2592 //	讨论组是普通消息模式
        },
        SESSION_TYPE_FLAG: "24",
        SESSION_TYPE: {
            SESSION_APPLY: 2401, //	邀请加入会话的通知
            AGREE_APPLY: 2402//	同意加入会话的通知
        },
        PASSTHROUGH_TYPE: "1998" // 透传消息
    };

    var Emoji = {
        path: '',
        face: [],
        map: {},
        parseEmoji: function (msg) {
            if (typeof Emoji === 'undefined' || typeof Emoji.map === 'undefined') {
                return msg;
            } else {
                var emoji = Emoji,
                    reg = null;

                for (var face in emoji.map) {
                    if (emoji.map.hasOwnProperty(face)) {
                        while (msg.indexOf(face) > -1) {
                            msg = msg.replace(face, Emoji.map[face]);
                        }
                    }
                }
                return msg;
            }
        },
        init: function () {
            for (var i = 0; i < 36; i++) {
                var str;
                if (i < 9) {
                    str = (i + 1);
                    str = "0" + str;
                } else {
                    str = (i + 1);
                }
                var faceStr = "1f" + str;
                var faceName = "[" + faceStr + "]";
                var path = Emoji.path + '/' + faceStr + '.png';
                var facePath = '<img src="' + path + '">';
                Emoji.map[faceName] = facePath;
                Emoji.face[i] = {faceName: faceName, facePath: facePath, path: path};
            }
        }
    };

    Emoji.init();


    var AntMessage = function () {
    };
    AntMessage.prototype.messageType = "";


    var ChatMessage = function () {
    };
    ChatMessage.prototype = new AntMessage();
    ChatMessage.prototype.chatType = "";
    ChatMessage.prototype.os = "";
    ChatMessage.prototype.flag = "";
    ChatMessage.prototype.status = "";
    ChatMessage.prototype.messageId = "";
    ChatMessage.prototype.appKey = "";
    ChatMessage.prototype.sendUserId = "";
    ChatMessage.prototype.targetId = "";
    ChatMessage.prototype.sessionId = "";
    ChatMessage.prototype.chatIndex = "";
    ChatMessage.prototype.sendTime = "";
    ChatMessage.prototype.attr = "";
    ChatMessage.prototype.content = "";

    ChatMessage.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.chatType ? this.chatType : "";
        contentArray[1] = this.os ? this.os : "";
        contentArray[2] = this.flag ? this.flag : "";
        contentArray[3] = this.status ? this.status : "";
        contentArray[4] = this.messageId ? this.messageId : "";
        contentArray[5] = this.appKey ? this.appKey : "";
        contentArray[6] = this.sendUserId ? this.sendUserId : "";
        contentArray[7] = this.targetId ? this.targetId : "";
        contentArray[8] = this.sessionId ? this.sessionId : "";
        contentArray[9] = this.chatIndex ? this.chatIndex : "";
        contentArray[10] = this.sendTime ? this.sendTime : "";
        contentArray[11] = this.content ? this.content : "";
        contentArray[12] = this.attr ? this.attr : "";
        msg[1] = contentArray;
        return msg;
    };

    ChatMessage.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.chatType = array[0];
        this.os = array[1];
        this.flag = array[2];
        this.status = array[3];
        this.messageId = array[4];
        this.appKey = array[5];
        this.sendUserId = array[6];
        this.targetId = array[7];
        this.sessionId = array[8];
        this.chatIndex = array[9];
        this.sendTime = array[10];
        this.content = array[11];
        this.attr = array[12];
    };


    /**收到的MQTT 回执***/
    var MessageReceipt = function () {
    };
    MessageReceipt.prototype.messageId = "";
    MessageReceipt.prototype.sessionId = "";
    MessageReceipt.prototype.chatIndex = "";
    MessageReceipt.prototype.sendTime = "";
    MessageReceipt.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.messageId ? this.messageId : "";
        contentArray[1] = this.sessionId ? this.sessionId : "";
        contentArray[2] = this.chatIndex ? this.chatIndex : "";
        contentArray[3] = this.sendTime ? this.sendTime : "";
    };
    MessageReceipt.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.messageId = array[0];
        this.sessionId = array[1];
        this.chatIndex = array[2];
        this.sendTime = array[3];
    };

    var MessageRead = function () {
    };
    MessageRead.prototype = new AntMessage();
    MessageRead.prototype.os = "";
    MessageRead.prototype.flag = "";
    MessageRead.prototype.status = "";
    MessageRead.prototype.appKey = "";
    MessageRead.prototype.sendUserId = "";
    MessageRead.prototype.targetId = "";
    MessageRead.prototype.sessionId = "";
    MessageRead.prototype.chatIndex = "";
    MessageRead.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.os ? this.os : "";
        contentArray[1] = this.flag ? this.flag : "";
        contentArray[2] = this.status ? this.status : "";
        contentArray[3] = this.appKey ? this.appKey : "";
        contentArray[4] = this.sendUserId ? this.sendUserId : "";
        contentArray[5] = this.targetId ? this.targetId : "";
        contentArray[6] = this.sessionId ? this.sessionId : "";
        contentArray[7] = this.chatIndex ? this.chatIndex : "";
        msg[1] = contentArray;
        return msg;
    };
    MessageRead.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.os = array[0];
        this.flag = array[1];
        this.status = array[2];
        this.appKey = array[3];
        this.sendUserId = array[4];
        this.targetId = array[5];
        this.sessionId = array[6];
        this.chatIndex = array[7];
    };

    var MessageReceive = function () {
    };
    MessageReceive.prototype = new AntMessage();
    MessageReceive.prototype.os = "";
    MessageReceive.prototype.appKey = "";
    MessageReceive.prototype.sendUserId = "";
    MessageReceive.prototype.sessionId = "";
    MessageReceive.prototype.chatIndex = "";
    MessageReceive.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.os ? this.os : "";
        contentArray[1] = this.appKey ? this.appKey : "";
        contentArray[2] = this.sendUserId ? this.sendUserId : "";
        contentArray[3] = this.sessionId ? this.sessionId : "";
        contentArray[4] = this.chatIndex ? this.chatIndex : "";
        msg[1] = contentArray;
        return msg;
    };
    MessageReceive.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.os = array[0];
        this.appKey = array[1];
        this.sendUserId = array[2];
        this.sessionId = array[3];
        this.chatIndex = array[4];
    };

    var SessionMsg = function () {
    };
    SessionMsg.prototype = new AntMessage();
    SessionMsg.prototype.sendUserId = "";
    SessionMsg.prototype.targetId = "";
    SessionMsg.prototype.sessionId = "";
    SessionMsg.prototype.content = "";
    SessionMsg.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.sendUserId ? this.sendUserId : "";
        contentArray[1] = this.targetId ? this.targetId : "";
        contentArray[2] = this.sessionId ? this.sessionId : "";
        contentArray[3] = this.content ? this.chatIndex : "";
        msg[1] = contentArray;
        return msg;
    };
    SessionMsg.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.sendUserId = array[0];
        this.targetId = array[1];
        this.sessionId = array[2];
        this.content = array[3];
    };

    var RoomMsg = function () {
    };
    RoomMsg.prototype = new AntMessage();
    RoomMsg.prototype.sessionId = "";
    RoomMsg.prototype.chatIndex = "";
    RoomMsg.prototype.content = null;
    RoomMsg.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.sessionId ? this.sessionId : "";
        contentArray[1] = this.chatIndex ? this.chatIndex : "";
        contentArray[2] = this.content ? this.content : "";
        msg[1] = contentArray;
        return msg;
    };
    RoomMsg.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.sessionId = array[0];
        this.chatIndex = array[1];
        this.content = array[2];
    };

    /**图片消息内容**/
    var ImgMsgInfo = function () {
    };
    ImgMsgInfo.prototype.picUrl = null;

    /**文件消息内容**/
    var FileMsgInfo = function () {
    };
    FileMsgInfo.prototype.fileName = null;
    FileMsgInfo.prototype.fileUrl = null;
    FileMsgInfo.prototype.size = null;

    var PassthroughInfo = function () {
        this.messageType = AntMessagerParse.PASSTHROUGH_TYPE;
    };
    PassthroughInfo.prototype = new AntMessage();
    PassthroughInfo.prototype.targetId = "";
    PassthroughInfo.prototype.content = null;

    PassthroughInfo.prototype.encode = function () {
        var msg = [], contentArray = [];
        msg[0] = [this.messageType];
        contentArray[0] = this.targetId ? this.targetId : "";
        contentArray[1] = this.content ? this.content : "";
        msg[1] = contentArray;
        return msg;
    };

    PassthroughInfo.prototype.decode = function (msg) {
        var type = msg[0][0];
        var array = msg[1];
        this.messageType = type;
        this.targetId = array[0];
        this.content = array[1];
    };

    /***错误信息**/
    var ERROR = {
        INVALID_TYPE: {code: 1, text: "参数类型校验错误  type {0} for {1}."},
        UNKNOWN_PARAMS: {code: 2, text: "未知的参数   for {0}."},
        TRANCE_TYPE: {code: 2, text: "接受到服务器都数据格式错误 "},
        SDK_NOT_ININT: {code: 3, text: "SDK 没有初始化"},
        PARAMS_ERROR: {code: 4, text: "参数错误 TYPE {0}"},
    };

    /***str 错误提示**/
    var format = function (error, substitutions) {
        var text = error.text;
        if (substitutions) {
            var field, start;
            for (var i = 0; i < substitutions.length; i++) {
                field = "{" + i + "}";
                start = text.indexOf(field);
                if (start > 0) {
                    var part1 = text.substring(0, start);
                    var part2 = text.substring(start + field.length);
                    text = part1 + substitutions[i] + part2;
                }
            }
        }
        return text;
    };

    /**校验**/
    var validate = function (obj, keys) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (keys.hasOwnProperty(key)) {
                    if (typeof obj[key] !== keys[key])
                        throw new Error(format(ERROR.INVALID_TYPE, [typeof obj[key], key]));
                } else {
                    var errorStr = "Unknown property, " + key + ". Valid properties are:";
                    for (var key in keys)
                        if (keys.hasOwnProperty(key))
                            errorStr = errorStr + " " + key;
                    throw new Error(format(ERROR.UNKNOWN_PARAMS, key));
                }
            }
        }
    };

    var scope = function (f, scope) {
        return function () {
            return f.apply(scope, arguments);
        };
    };

    var Log = {
        log: function () {
            if (window.console && DEBUG) {
                console.log("INFO", this.log.arguments);
            }
        },
        error: function () {
            if (window.console) {
                console.log("ERROR", this.error.arguments);
            }
        }
    };

    var Utils = {
        isCanUploadFileAsync: typeof FormData !== 'undefined',

        browseType: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) {
                    return "IE7";
                }
                else if (fIEVersion == 8) {
                    return "IE8";
                }
                else if (fIEVersion == 9) {
                    return "IE9";
                }
                else if (fIEVersion == 10) {
                    return "IE10";
                }
                else if (fIEVersion == 11) {
                    return "IE11";
                }
                else {
                    return "0"
                }//IE版本过低
            }//isIE end

            if (isFF) {
                return "FF";
            }
            if (isOpera) {
                return "Opera";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
            if (isEdge) {
                return "Edge";
            }
        },

        /**
         * @param opt
         * @param opt.data    jsonp 请求的参数
         * @param opt.success jsonp 请求成功回调
         * @param opt.url     jsonp url 地址
         */
        jsonp: function (opt) {
            var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
                script = document.createElement("script"),
                temp = {},
                now = new Date().getTime(),
                random = Math.random().toString();
            random = random.substring(random.indexOf('.') + 1);

            temp = opt.data || {};
            temp.callback = "hhlykfCallback" + random;
            temp._ = now;

            window[temp.callback] = function (str) {
                opt.success && opt.success(Utils.parseJSON(str));
                window[temp.callback] = null;
            };
            script.charset = "utf-8";
            opt.data.callback = temp.callback;
            script.src = Utils.transUrl(opt.url, opt.data);
            script.onload = script.onreadystatechange = function () {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    script.onload = script.onreadystatechange = null;
                    if (head && script.parentNode) {
                        head.removeChild(script);
                    }
                    script = undefined;
                }
            };
            script.onerror = function () {
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
                script = undefined;
                if(opt.error){
                    opt.error();
                }
            };
            head.insertBefore(script, head.firstChild);
        },

        // aes解密
        aesDecrypt: function(key, value){
            key = CryptoJS.enc.Utf8.parse(key);
            var bytes = CryptoJS.AES.decrypt(value.toString(), key, {
                iv: ANT_AES_IV,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var decryptResult = bytes.toString(CryptoJS.enc.Utf8);
            return decryptResult;
        },

        getHeader: function (token) {
            if (token) {
                return {authorization: token, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"};
            } else {
                return {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"};
            }
        },
        postHeader: function (token) {
            if (token) {
                return {authorization: token, "Content-Type": "application/json"};
            } else {
                return {"Content-Type": "application/json"};
            }

        },

        ajax: function (data) {
            if (data.method == "GET") {
                Utils.get(data);
            } else {
                Utils.post(data);
            }
        },

        ajaxCallback: function (data, xmlHttp) {
            var readyState = xmlHttp.readyState;
            if (readyState != 4) {
                return;
            }
            var status = xmlHttp.status;
            if (status == 200) {
                if (!data) {
                    return;
                }
                var responseText = xmlHttp.responseText;
                data.type = data.type || "json";
                if (data.type == "json") {
                    var jsonData = Utils.parseJSON(responseText);
                    if (data.success) {
                        data.success(jsonData, xmlHttp);
                    }
                    // if (jsonData.hasOwnProperty("errorCode")) {
                    //     if (data.error) {
                    //         data.error(jsonData, xmlHttp);
                    //     }
                    // } else {
                    //
                    // }
                }
            } else {
                if (data[status]) {
                    data[data](xmlHttp);
                } else {
                    if (data.error) {
                        data.error(status, xmlHttp);
                    }
                }
            }
        },

        getXhp: function () {

            var xmlHttp;
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlHttp;

        },

        getXDRequest: function () {
            var xmlHttp = new XDomainRequest();
            xmlHttp.readyState = 0;
            xmlHttp.status = 100;
            xmlHttp.timeout = 5000;
            xmlHttp.onreadystatechange = EMPTYFN;
            xmlHttp.onload = function () {
                xmlHttp.readyState = 4;
                xmlHttp.status = 200;

                var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = 'false';
                xmlDoc.loadXML(xmlHttp.responseText);
                xmlHttp.responseXML = xmlDoc;
                xmlHttp.response = xmlHttp.responseText;
                xmlHttp.onreadystatechange();
            };
            xmlHttp.onprogress = function(){
                Log.log("XDR onprogress");
                Log.log("Got: " + xmlHttp.responseText);
            };
            xmlHttp.ontimeout = xmlHttp.onerror = function () {
                xmlHttp.readyState = 4;
                xmlHttp.status = 500;
                xmlHttp.onreadystatechange();
            };
            xmlHttp.setRequestHeader = function (key, value) {
            	if(key == "Content-Type"){
            		xmlHttp.contentType  = value;
            	}else{
            		 xmlHttp[key] = value;
            	}
               
            };
            return xmlHttp;
        },

        isXDRequest: function () {
            var browseType = Utils.browseType();
            if (!browseType) {
                return false;
            }

            var index = browseType.indexOf("IE");
            if (index < 0) {
                return false;
            }
            var ieVersion = parseInt(browseType.replace("IE", ""));
            if (!ieVersion || ieVersion >= 10) {
                return false;
            }
            if (typeof window.XDomainRequest === 'undefined') {
                return false;
            }
            return true;
        },

        getByXHRequest: function (data) {
            var xmlHttp = Utils.getXhp();
            var url = data.url;

            // 华为手机自带浏览器对于修改header会使ajax发送失败
            if(url){
                data.data["authorization"] = data.header["authorization"];
                delete data.header["authorization"];
            }
            if (data.data) {
                url = Utils.transUrl(data.url, data.data);
            }
            xmlHttp.open("GET", url, true);
            if (data && data.header) {
                var headerObj = data.header;
                for (var key in headerObj) {
                    if (headerObj[key]) {
                        xmlHttp.setRequestHeader(key, headerObj[key]);
                    }

                }
            }
            xmlHttp.onreadystatechange = function () {
                Utils.ajaxCallback(data, xmlHttp)
            };
            xmlHttp.send();
        },

        getByXDRequest: function (data) {
            var xmlHttp = Utils.getXDRequest();
            var url = data.url;
            if (data && data.header) {
            	if(data.header && data.header["Content-Type"] && xmlHttp.contentType){
            		xmlHttp.contentType = data.header["Content-Type"];
            	}
                Utils.extend(data.data, data.header);
            }
            if (data.data) {
                url = Utils.transUrl(data.url, data.data);
            }
            xmlHttp.open("GET", url, true);
            xmlHttp.onreadystatechange = function () {
                Utils.ajaxCallback(data, xmlHttp)
            };
            xmlHttp.send();
        },

        get: function (data) {
            if (Utils.isXDRequest() && CROSSDOMAIN) {
                Utils.getByXDRequest(data);
            } else {
                Utils.getByXHRequest(data);
            }
        },

        postByXHRequest: function (data) {
            var xmlHttp = Utils.getXhp();
            var url = data.url;

            // 华为手机自带浏览器对于修改header会使ajax发送失败
            if(url){
                data.data["authorization"] = data.header["authorization"];
                delete data.header["authorization"];
            }
            xmlHttp.open("POST", url, true);
            if (data && data.header) {
                var headerObj = data.header;
                for (var key in headerObj) {
                    if (headerObj[key]) {
                        xmlHttp.setRequestHeader(key, headerObj[key]);
                    }

                }
            }
            xmlHttp.onreadystatechange = function () {
                Utils.ajaxCallback(data, xmlHttp)
            };
            xmlHttp.send(Utils.stringify(data.data));
        },

        postByXDRequest: function (data) {
            var xmlHttp = Utils.getXDRequest();
            var url = data.url + "/IE";
            xmlHttp.open("POST", url, true);
            if (data && data.header && data.header["authorization"]) {
                data.data = data.data || {};
                Utils.extend(data.data, {authorization: data.header["authorization"]});
            }
            xmlHttp.onreadystatechange = function () {
                Utils.ajaxCallback(data, xmlHttp)
            };
            xmlHttp.send(Utils.stringify(data.data));
        },

        post: function (data) {
            if (Utils.isXDRequest() && CROSSDOMAIN) {
                Utils.postByXDRequest(data);
            } else {
                Utils.postByXHRequest(data);
            }
        },

        trim: (function () {
            var trim = String.prototype.trim;
            return trim ?
                function (text) {
                    return text == null ?
                        "" :
                        trim.call(text);
                } :
                function (text) {
                    var trimLeft = /^\s+/,
                        trimRight = /\s+$/;

                    return text == null ?
                        "" :
                        text.toString().replace(trimLeft, "").replace(trimRight, "");
                }
        })(),

        parseJSON: function (data) {
            var rvalidchars = /^[\],:{}\s]*$/,
                rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

            if (typeof data !== "string" || !data) {
                return data;
            }
            data = Utils.trim(data);
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }
            if (rvalidchars.test(data.replace(rvalidescape, "@")
                    .replace(rvalidtokens, "]")
                    .replace(rvalidbraces, ""))) {

                return ( new Function("return " + data) )();

            }
            win.console || win.console.error("Invalid JSON: " + data);
        },

        stringify: function (json) {
            if (typeof JSON !== 'undefined' && JSON.stringify) {
                return JSON.stringify(json);
            } else {
                var s = '',
                    arr = [];

                var iterate = function (json) {
                    var isArr = false;

                    if (Object.prototype.toString.call(json) === '[object Array]') {
                        arr.push(']', '[');
                        isArr = true;
                    } else if (Object.prototype.toString.call(json) === '[object Object]') {
                        arr.push('}', '{');
                    }

                    for (var o in json) {
                        if (Object.prototype.toString.call(json[o]) === '[object Null]') {
                            json[o] = 'null';
                        } else if (Object.prototype.toString.call(json[o]) === '[object Undefined]') {
                            json[o] = 'undefined';
                        }

                        if (json[o] && typeof json[o] === 'object') {
                            s += ',' + (isArr ? '' : '"' + o + '":' + (isArr ? '"' : '')) + iterate(json[o]) + '';
                        } else {
                            s += ',"' + (isArr ? '' : o + '":"') + json[o] + '"';
                        }
                    }

                    if (s != '') {
                        s = s.slice(1);
                    }

                    return arr.pop() + s + arr.pop();
                };
                return iterate(json);
            }
        },

        transUrl: function (url, data) {
            var array = [], key;
            for (key in data) {
                array.push(key + "=" + data[key]);
            }
            return url + (/\?/.test(url) ? "&" : "?") + array.join("&");
        },

        extend: function (target, source) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }
            return target;
        },

        isSuppertWebSocket: function () {
            if (!("WebSocket" in window && window["WebSocket"] !== null)) {
                return false;
            }
            return true;
        },

        isBlank: function (str) {
            if (str == null || str.trim() == "") {
                return true;
            } else {
                return false;
            }
        },

        indexOf: function (array, val) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == val) return i;
            }
            return -1;
        },

        remove: function (array, val) {
            var index = Utils.indexOf(array, val);
            if (index > -1) {
                array.splice(index, 1);
            }
        },

        getIDIndex: function () {
            // var result = GLOBAL_VALUE.MESSAGEID_PRE + GLOBAL_VALUE.MSG_ID_BACK;
            // GLOBAL_VALUE.MSG_ID_BACK++;
            // return result;
            return 'M' + new Date().getTime() + SDK_TYPE + parseInt(Math.random()*Math.pow(10,8));
        },

        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        parseLink: function (msg) {

            var reg = /(https?\:\/\/|www\.)([a-zA-Z0-9-]+(\.[a-zA-Z0-9]+)+)(\:[0-9]{2,4})?\/?((\.[:_0-9a-zA-Z-]+)|[:_0-9a-zA-Z-]*\/?)*\??[:_#@*&%0-9a-zA-Z-/=]*/gm;

            msg = msg.replace(reg, function (v) {

                var prefix = /^https?/gm.test(v);

                return "<a href='"
                    + (prefix ? v : '//' + v)
                    + "' target='_blank'>"
                    + v
                    + "</a>";

            });

            return msg;

        },

        File: {
            getFileUrl: function (fileInputId) {
                var uri = {
                    url: '',
                    filename: '',
                    filetype: '',
                    data: ''
                };
                var fileObj = typeof fileInputId === 'string' ? document.getElementById(fileInputId) : fileInputId;
                if (!Utils.isCanUploadFileAsync || !fileObj) {
                    return uri;
                }
                try {
                    if (window.URL.createObjectURL) {
                        var fileItems = fileObj.files;
                        if (fileItems.length > 0) {
                            var u = fileItems.item(0);
                            uri.data = u;
                            uri.url = window.URL.createObjectURL(u);
                            uri.filename = u.name || '';
                        }
                    } else { // IE
                        var u = document.getElementById(fileInputId).value;
                        uri.url = u;
                        var pos1 = u.lastIndexOf('/');
                        var pos2 = u.lastIndexOf('\\');
                        var pos = Math.max(pos1, pos2);
                        if (pos < 0)
                            uri.filename = u;
                        else
                            uri.filename = u.substring(pos + 1);
                    }
                    var index = uri.filename.lastIndexOf('.');
                    if (index != -1) {
                        uri.filetype = uri.filename.substring(index + 1).toLowerCase();
                    }
                    return uri;

                } catch (e) {
                    throw e;
                }
            },
            getFileSize: function (file) {
                var fileSize = 0;
                if (file) {
                    if (file.files) {
                        if (file.files.length > 0) {
                            fileSize = file.files[0].size;
                        }
                    } else if (file.select && 'ActiveXObject' in window) {
                        file.select();
                        var fileobject = new ActiveXObject('Scripting.FileSystemObject');
                        var file = fileobject.GetFile(file.value);
                        fileSize = file.Size;
                    }
                }
                Log.log('fileSize: ', fileSize);
                if (fileSize > 10000000) {
                    return false;
                }
                var kb = Math.round(fileSize / 1000);
                if (kb < 1000) {
                    fileSize = kb + ' KB';
                } else if (kb >= 1000) {
                    var mb = kb / 1000;
                    if (mb < 1000) {
                        fileSize = mb.toFixed(1) + ' MB';
                    } else {
                        var gb = mb / 1000;
                        fileSize = gb.toFixed(1) + ' GB';
                    }
                }
                return fileSize;
            },
            uploadFile: function (options) {
                if (!window.FormData) {
                    Log.log("不支持AJAX 文件上传");
                    return;
                }
                var xhr = Utils.getXhp();
                var onError = function (e) {
                    options.onFileUploadError({
                        xhr: xhr,
                        id: options.id
                    });
                };
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', options.onFileUploadProgress, false)
                }
                if (xhr.addEventListener) {
                    xhr.addEventListener('abort', options.onFileUploadCanceled, false);
                    xhr.addEventListener('load', function (e) {
                        try {
                            var json = Utils.parseJSON(xhr.responseText);
                            try {
                                if (json.data) {
                                    options.onFileUploadComplete(json.data);
                                }
                            } catch (e) {
                                options.onFileUploadError({data: e});
                            }
                        } catch (e) {
                            options.onFileUploadError({
                                data: xhr.responseText,
                                id: options.id,
                                xhr: xhr
                            });
                        }
                    }, false);
                    xhr.addEventListener('error', onError, false);
                } else if (xhr.onreadystatechange) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (ajax.status === 200) {
                                try {
                                    var json = Utils.parseJSON(xhr.responseText);
                                    if (json.data) {
                                        options.onFileUploadComplete(json.data);
                                    }
                                } catch (e) {
                                    options.onFileUploadError({
                                        data: xhr.responseText,
                                        id: options.id,
                                        xhr: xhr
                                    });
                                }
                            } else {
                                options.onFileUploadError({
                                    data: xhr.responseText,
                                    id: options.id,
                                    xhr: xhr
                                });
                            }
                        } else {
                            xhr.abort();
                            options.onFileUploadCanceled();
                        }
                    }
                }
                var fileUpUrl = FILE_UPLOAD_URL + "/v1/file/upload";
                xhr.open('POST', fileUpUrl);
                var formData = new FormData();
                formData.append('file', options.file.data);
                formData.append('key', SDK_TYPE);
                formData.append('needMD5Query', 1);
                formData.append('requestTime', new Date().getTime());
                xhr.send(formData);
            },
            isImg: function (fileNmae) {
                // fileType = fileType.replace(/image\//, '');
                if (/\.(png|jpg|jpeg|gif|bmp|x-ms-bmp)$/.test(fileNmae)) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        addEventHandler: function (target, type, func) {
            if (target.addEventListener) {
                target.addEventListener(type, func, false);
            } else if (target.attachEvent) {
                target.attachEvent("on" + type, func);
            } else {
                target["on" + type] = func;
            }
        },

        removeEventHandler: function (target, type, func) {
            if (target.removeEventListener) {
                target.removeEventListener(type, func, false);
            } else if (target.detachEvent) {
                target.detachEvent("on" + type, func);
            } else {
                delete target["on" + type];
            }
        },

        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },

        setCookie: function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },

        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = Utils.getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        },

        /**跨域实现，通过weindow.name 来获取数据**/
        getDataByWN:function(url,callback){
            if(!url || typeof url !== 'string'){
                return ;
            }
            var frame = document.createElement('iframe'),state = 0,self = this;
            document.body.appendChild(frame);
            frame.style.display = 'none';
            var clear = function(){
                try{
                    frame.contentWindow.document.write('');
                    frame.contentWindow.close();
                    document.removeChild(frame);
                }catch(e){}
            };
            var getData = function(){
                try{
                    var data = frame.contentWindow.name;
                }catch(e){}
                clear();
                if(callback && typeof callback === 'function'){
                    callback(data);
                }
            }
            Utils.addEventHandler(frame,'load',function(){
                if(state === 1){
                    getData();
                }else if(state === 0){
                    state = 1;
                    frame.contentWindow.location ;
                }
            });
            frame.src = url;
        },

        uuid: function (len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        }
    };

    var compare = function(userId, targetUserId){
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
    }

    var createSessionId = function(userId, targetUserId){
        if(!userId || !targetUserId) {
            return null;
        }
        var sessionId = null;
        if(compare(userId, targetUserId) > 0){
            sessionId = targetUserId + userId;
        }else{
            sessionId = userId + targetUserId;
        }
        sessionId = CryptoJS.MD5(sessionId).toString();
        return sessionId;
    }

    // 消息去重
    var removeRepetition = function(messageId){
        if(MESSAGEARRAY.indexOf(messageId) > -1){
            return false;
        }else{
            if(MESSAGEARRAY.length >= 1000){
                MESSAGEARRAY.splice(0, 1);
            }
            MESSAGEARRAY.push(messageId);
            return true;
        }
    }

    /**HTTP 接口业务**/
    var AntHttpClient = function (option, mqttClientProxy) {
        this.mqttClient = mqttClientProxy;
        this.token = null;
        this.companyCode = option.companyCode;
        this.appKey = option.appKey;
        this.appSecret = option.appSecret;
        this.connectWay = option.connectWay;
        this.userId = option.userId;


        var that = this;

        this.getBasePath = function (dns, prePath) {
            if (!dns) {
                dns = DNS_URL;
            }
            if (prePath) {
                return dns + "/" + prePath + "/" + this.companyCode + "/" + this.appKey;
            } else {
                return dns + "/" + this.companyCode + "/" + this.appKey;
            }
        };

        this.getHeader = function () {
            return {authorization: this.token, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"};
        };
        this.postHeader = function () {
            return {authorization: this.token, "Content-Type": "application/json"};
        };

        /**
         * @param params  参数
         * @param callback  成功回调方法
         * @param interface 接口名称
         * @param isPost  是否是post 请求
         * @param error   错误的时候的回调方法
         * @param dns    请求地址
         * @param prePath  接口前缀
         */
        this.createAjaxFun = function (params, callback, interface, isPost, error, dns, prePath) {
            var header = isPost ? this.postHeader() : this.getHeader();
            header.authorization = this.token;
            
            var url = this.getBasePath(dns, prePath) + interface;
            Utils.ajax({
                url: url,
                header: header,
                data: params,
                method: isPost ? "POST" : "GET",
                success: function (data) {
                    if (data && data.errorCode != 0 && data.errorMsg != '请求成功') {
                        if (error) {
                            error(data);
                        } else {
                            if (callback) callback(data);
                        }
                    } else {
                        if (callback) callback(data.data);
                    }
                },
                error: function (m) {
                    if (error) error(m);
                }
            })
        };


        this.SysBusy = {
            that: null,
            oAuth: function (params, callback, error) {
                var header = that.getHeader();
                
                Utils.ajax({
                    url: that.getBasePath() + "/oauth/token",
                    header: header,
                    data: params,
                    method: "GET",
                    type: "json",
                    success: function (data) {
                        if (data && data.errorCode != '0' && data.errorMsg != '请求成功') {
                            if (error) {
                                error(data);
                            } else {
                                if (callback) callback(data);
                            }
                        } else {
                            if (callback) callback(data);
                        }
                    },
                    error: function () {
                        if (error) {
                            error();
                        }
                    }
                })
            },

            mqtts: function (params, callback, error) {
                var header = that.getHeader();
                header.authorization = that.token;

                var url = that.getBasePath(null, "core") + "/config/encryptMqtts";
                Utils.ajax({
                    url: url,
                    header: header,
                    data: params,
                    method: "GET",
                    success: function (data) {
                        if (data && data.errorCode != '0' && data.errorMsg != '请求成功') {
                            if (error) {
                                error(data);
                            } else{
                                Log.error("获取配置信息错误",data);
                            }
                        } else {
                            if (callback) callback(data.data);
                        }
                    },
                    error: function (m) {
                        if (error) error(m);
                    }
                })
            }
        };

        this.UserBusy = {
            that: null,
            updateUser: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/user/update", 1, error, null, "core")
            }
        };

        this.RoomBusy = {
            that: null,
            addRoom: function (params, callback, error) {
                that.RoomBusy.that.createAjaxFun(params, callback, "/room/add", 1, error, null, "core")
            },
            updateRoom: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/update", 1, error, null, "core")
            },
            deleteRoom: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/delete", 0, error, null, "core")
            },
            exitRoom: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/exitRoom", 1, error, null, "core")
            },
            addRoomMembers: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/addMembers", 1, error, null, "core")
            },
            deleteMembers: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/deleteMembers", 1, error, null, "core")
            },
            updateMember: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/updateMember", 1, error, null, "core")
            },
            findRooms: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/findRooms", 0, error, null, "core")
            },
            getRoomsDetail: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/get", 0, error, null, "core")
            },
            findRoomMembers: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/findMembers", 0, error, null, "core")
            },
            //邀请会话
            invite: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/invite", 1, error, null, "core");
            },
            //处理邀请
            hanlderInvite: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/inviteHandle", 1, error, null, "core");
            },
            //获取成员
            getRoomMemberDetail: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/room/getMember", 0, error, null, "core")
            },
            // 获取聊天室历史消息
            getRoomHisMsg: function (params, callback, error) {
                that.createAjaxFun(params, callback, "/roamMessage", 1, error, null, "core")
            },
            // 获取聊天室历史消息
            queryOfflineMsg: function (params, callback, error) {
                //
                Log.log("查询离线消息");
                that.createAjaxFun(params, callback, "/queryOfflineMsg", 1, error, null, "core")
            },
            // 获取会话列表
            getChatList: function (params, callback, error) {
                Log.log("获取会话列表");
                that.createAjaxFun(params, callback, "/session", 0, error, null, "core")
            },
        };

        this.SysBusy.that = that;
        this.RoomBusy.that = that;
        this.UserBusy.that = that;

        this.init = function (callback) {
            var oauthFun = function(){
                that.SysBusy.oAuth({
                    appKey: that.appKey,
                    appSecret: that.appSecret,
                    id: that.userId,
                    sdkType: SDK_TYPE
                },
                function (data) {
                    if(data.errorCode != 0 && data.errorMsg != '请求成功'){
                        console.log('获取token接口错误');
                        return false;
                    }
                    that.token = data.data;
                    Utils.setCookie(appKey, that.token);
                    that.SysBusy.mqtts({ways: that.connectWay}, callback);
                });
            };

            var mqttsSuccess = function(res){
                if(!res || !res.host){
                    oauthFun();
                }else{
                    callback(res);
                }
            }

            var appKey = this.appKey + "_" + this.userId;
            var token = Utils.getCookie(appKey);

            if (token && token !== 'undefined') {
                that.token = token;
                that.SysBusy.mqtts({ways: that.connectWay, authorization: token},mqttsSuccess,oauthFun);
            } else {
                oauthFun();
            }
        }
    };

    var AntMqttClient = function (interface) {
        var MqttInterfaceImpl = function (interface) {
            this.interface = interface;
            this.mqttUserName = null;
            this.mqttPassword = null;
            this.isWaitingConnected = false;
            this.initData = null;
            this.reconnectFlag = 0;
        };

        // 心跳消息内容
        var heartbeatMessageContent = [],
            heartbeatTimer = 'null';
        heartbeatMessageContent[0] = [];
        heartbeatMessageContent[0][0] = '0001';
        heartbeatMessageContent[1] = [];
        heartbeatMessageContent[1][0] = interface.appKey;
        heartbeatMessageContent[1][1] = interface.userId;
        heartbeatMessageContent[1][2] = String(SDK_TYPE);
        heartbeatMessageContent[1][3] = '';

        MqttInterfaceImpl.prototype.subList = [];

        MqttInterfaceImpl.prototype.isConnected = function () {
            if (!this.mqttClient) {
                return false;
            }
            return this.mqttClient.isConnected();
        };

        MqttInterfaceImpl.prototype.mqttClient = null;

        MqttInterfaceImpl.prototype.init = function (data) {
            var _this = this;
            this.initData = data;
            this.createMqttClient(data);

            var _aes_key = this.interface.httpClientProxy.token.slice(0, 16);
            try {
                this.mqttUserName = Utils.aesDecrypt(_aes_key, data.userName);
                this.mqttPassword = Utils.aesDecrypt(_aes_key, data.password);
            } catch (error) {
                Log.log(error);
                this.mqttUserName = data.userName;
                this.mqttPassword = data.password;
                Log.log('解密失败');
            }
            this.connect();
            heartbeatTimer = setInterval(function(){
                _this.heartbeatMessage(heartbeatMessageContent);
            }, 60000);
        };

        MqttInterfaceImpl.prototype.connect = function () {
            if (!this.mqttClient.isConnected() && !this.isWaitingConnected) {
                this.isWaitingConnected = true;
                var useSSL = false;
                if(protocol == "https://"){
                    useSSL = true;
                }else{
                    useSSL = false;
                }
                this.mqttClient.connect({
                    userName: this.mqttUserName,
                    password: this.mqttPassword,
                    useSSL:useSSL,
                    onSuccess: scope(this.onConnect, this),
                    onFailure: scope(this.connectFail, this)
                });

            }
        };

        MqttInterfaceImpl.prototype.createMqttClient = function (option) {
            var host = option.host;
            var port = Number(option.port);
            var wwsHost = option.mqttWwsHost;
            var wwsPort = Number(option.mqttWwsPort);
            var clientId = option.clientId;

            var reg = /^http:\/\/|https:\/\//i;
            var proxyUrl = '';
            if(reg.test(option.antWebMessageProxy)){
                proxyUrl = option.antWebMessageProxy;
            }else{
                proxyUrl = protocol + option.antWebMessageProxy;
            }

            if(Utils.isSuppertWebSocket() && window.localStorage && protocol == "https://"){
                this.mqttClient = new Paho.MQTT.Client(wwsHost, wwsPort, clientId);
            }else if(Utils.isSuppertWebSocket() && window.localStorage){
                this.mqttClient = new Paho.MQTT.Client(host, port, clientId);
            }else{
                this.mqttClient = new NODE.MQTT.Client(host, port, clientId, proxyUrl);
            }

            this.mqttClient.trace = this.newTraceFunction;
            this.mqttClient.startTrace();

            if (this.mqttClient) {
                this.mqttClient.onConnectionLost = scope(this.connectFail, this);
                this.mqttClient.onMessageArrived = scope(this.connectMsgArrived, this);
            }
        };

        MqttInterfaceImpl.prototype.onConnect = function () {
            if (this.interface.userId) {
                if (this.reconnectFlag == 1 && this.subList && this.subList.length > 0) {
                    // this.reconnectFlag = 0;
                    Log.log("重新连接成功，重新订阅主题");
                    this.subscribeReConnect(this.subList);
                    var params = {
                        userId: this.interface.userId,
                        os: SDK_TYPE,
                        appKey: this.interface.appKey,
                        list: [],
                    };
                    try{
                        // 如果注册了从新连接成功回调方法，调用回调方法
                        if(this.interface.reConnectCallback){
                            this.interface.reConnectCallback();
                        }
                    }catch(e){

                    }
                    if(this.interface.currentRoomId){
                        var roomItem = {
                            sessionId:this.interface.currentRoomId
                        }
                        params.list.push(roomItem);
                    }
                    //重新连接成功,获取离线消息
                    this.interface.httpClientProxy.RoomBusy.queryOfflineMsg(params);
                }
                this.subscribe(this.interface.userId); // 默认订阅用户消息
                var osTopic = this.createUserOSTopic();// 默认订阅用户当前端的消息
                this.subscribe(osTopic);
            }
            try {
                if (this.interface.callback && this.interface.callback.connectSuccess) {
                    this.interface.callback.connectSuccess(this.reconnectFlag);
                    Log.log("连接成功");
                }
            } catch (e) {
                Log.log("调用用户连接成功接口错误", e);
            }

        };

        MqttInterfaceImpl.prototype.connectFail = function () {
            try {
                if (!this.reconnectFlag && this.interface.callback && this.interface.callback.connectFailure) {
                    this.interface.callback.connectFailure();
                }
                this.isWaitingConnected = false;
                var self = this;
                var flag = setInterval(function () {
                    clearInterval(flag);
                    Log.log("重新连接 ");
                    self.reconnectFlag = 1;
                    self.connect();
                }, 3000);
            } catch (e) {
                Log.error("重新连接 连接错误", e);
            }
        };

        MqttInterfaceImpl.prototype.subscribe = function (topicName, qos, success, fail) {
            var temp = topicName;
            topicName = this.createRealTopic(topicName);
            if (!qos) {
                qos = QOS;
            }
            var index = Utils.indexOf(this.subList, topicName);
            if (index >= 0) {
                try{
                    if(success){
                        success(temp);
                    }
                }catch(e){
                    Log.error("回调订阅主题成功异常", e);
                }
                return;
            }
            if (this.mqttClient) {
                if (!qos) {
                    qos = 0;
                }
                var options = {
                    qos: qos,
                    onSuccess: success ? success : EMPTYFN,
                    onFailure: fail ? success : EMPTYFN,
                };
                Log.log("订阅了主题：", topicName);
                this.mqttClient.subscribe(topicName, options);
                this.subList.push(topicName);
            }
        };

        MqttInterfaceImpl.prototype.subscribeReConnect = function (topicNames) {
            if (this.mqttClient) {
                for (var i = 0; i < topicNames.length; i++) {
                    Log.log("订阅了主题：", topicNames[i]);
                    this.mqttClient.subscribe(topicNames[i]);
                }
                // this.mqttClient.subscribeByTopics(topicNames);
            }
        };

        MqttInterfaceImpl.prototype.unSubscribe = function (topicName) {
            topicName = this.createRealTopic(topicName);
            if (this.mqttClient) {
                Utils.remove(this.subList, topicName);
                this.mqttClient.unsubscribe(topicName);
            }
        };

        MqttInterfaceImpl.prototype.heartbeatMessage = function(message){
            if (this.mqttClient) {
                this.mqttClient.send(TOPICS.USER_MSG_TOPIC, Utils.stringify(message), 0);
                Log.log('发送心跳消息', 'topic: ' + TOPICS.USER_MSG_TOPIC, Utils.stringify(message));
            }
        }

        MqttInterfaceImpl.prototype.publish = function (topic, message, success, fail) {
            clearInterval(heartbeatTimer);
            if (!this.isConnected()) {
                try {
                    if (fail)fail();
                } catch (e) {
                    Log.log("发布消息错误，执行回调方法错误", e);
                }
            }
            if (this.mqttClient) {
                try{
                    var _this = this;
                    _this.mqttClient.send(topic, Utils.stringify(message), QOS);
                    heartbeatTimer = setInterval(function(){
                        _this.heartbeatMessage(heartbeatMessageContent);
                    }, 60000);
                }catch(e){
                    Log.log("消息发送异常", e);
                    if (fail) fail();
                }

            }
        };

        MqttInterfaceImpl.prototype.publishPassthrough = function (topic, message, fail) {
            if (!this.isConnected()) {
                try {
                    if (fail)fail();
                } catch (e) {
                    Log.log("发布消息错误，执行回调方法错误", e);
                }

            }
            if (this.mqttClient) {
                this.mqttClient.send(topic, Utils.stringify(message), 0);
            }
        };

        MqttInterfaceImpl.prototype.connectMsgArrived = function (message) {
            clearInterval(heartbeatTimer);
            if (!message) {
                return;
            }
            var topic = message.destinationName;
            var content = message.payloadString;
            var msgType = AntMessagerParse.CHATMSG_TYPE.OTHER;
            var resultMsg = null;
            try {
                var jsonMsg = JSON.parse(content);
                if (!jsonMsg[0] || !jsonMsg[0][0]) {
                    this.expOtherMsg(topic, content);
                    return;
                }

                var _this = this;
                heartbeatTimer = setInterval(function(){
                    _this.heartbeatMessage(heartbeatMessageContent);
                }, 60000);

                msgType = jsonMsg[0][0];
                if (msgType == AntMessagerParse.PASSTHROUGH_TYPE) { // 透传消息
                    var passMsg = new PassthroughInfo();
                    passMsg.decode(jsonMsg);
                    this.excuteClientCallback(AntMessagerParse.PASSTHROUGH_TYPE, passMsg);
                    Log.log(topic, msgType, passMsg);
                    return;
                }
                var startStr = msgType.substr(0, 1);
                if (startStr == AntMessagerParse.CHATMSG_TYPE_FLAG || startStr == AntMessagerParse.CHATMSG_TYPE_FLAG_3) { //聊天消息
                    if (msgType == AntMessagerParse.CHATMSG_TYPE.RECIVE) { //消息回执
                        var receive = new MessageReceipt();
                        receive.decode(jsonMsg);
                        var messageId = receive.messageId;
                        this.excuteClientMessageCallback(messageId, receive);
                        Log.log(topic, msgType, receive);
                        return;
                    }
                    // 没有messageId 是其他人发送过来的消息
                    resultMsg = new ChatMessage();
                    resultMsg.decode(jsonMsg);

                    if(!removeRepetition(resultMsg.messageId)){
                        Log.log('重复消息', resultMsg);
                        return false;
                    }
                    var msgKey = resultMsg.sessionId + resultMsg.chatIndex;
                    this.interface.msgReciveList[msgKey] = resultMsg;
                    if (this.interface.callback.hasOwnProperty(resultMsg.messageType)) {
                        this.excuteClientCallback(msgType, resultMsg);
                    } else {
                        this.excuteClientCallback(AntMessagerParse.CHATMSG_TYPE.OTHER, resultMsg, topic);
                    }
                    Log.log(topic, msgType, resultMsg);
                } else if (topic == this.interface.appKey) { //用户相关消息

                } else { // 聊天室相关
                    startStr = msgType.substr(0, 2);
                    if (startStr == AntMessagerParse.ROOM_TYPE_FLAG || startStr == AntMessagerParse.GROUP_TYPE_FlAG) {  // 聊天室讨论组消息
                        resultMsg = new RoomMsg();
                        resultMsg.decode(jsonMsg);
                        var userMsg = Utils.parseJSON(resultMsg.content);
                        if (!userMsg.roomId || userMsg.roomId == "") {
                            userMsg.roomId = resultMsg.sessionId;
                        }
                        this.excuteClientCallback(resultMsg.messageType, userMsg);
                        Log.log(topic, msgType, userMsg);
                    } else if (startStr == AntMessagerParse.SESSION_TYPE_FLAG) {  // 邀请加入会话消息
                        resultMsg = new SessionMsg();
                        resultMsg.decode(jsonMsg);
                        this.excuteClientCallback(resultMsg.messageType, resultMsg);
                        Log.log(topic, msgType, resultMsg);
                    } else if (startStr == AntMessagerParse.ORG_TYPE_FLAG) { // 组织架构消息

                    }
                }
                // 发送已收回执
                if (resultMsg) {
                    var receive = new MessageReceive();
                    receive.messageType = resultMsg.messageType;
                    receive.os = SDK_TYPE;
                    receive.appKey = resultMsg.appKey ? resultMsg.appKey : this.interface.appKey;
                    receive.sendUserId = this.interface.userId;
                    receive.sessionId = resultMsg.sessionId;
                    receive.chatIndex = resultMsg.chatIndex;
                    this.mqttClient.send(TOPICS.RECEIVE_MSg_TOPIC, Utils.stringify(receive.encode()), 0);
                }
            } catch (e) {
                this.expOtherMsg(topic, content);

            }
        };

        MqttInterfaceImpl.prototype.expOtherMsg = function (topic, data) {
            var index = topic.indexOf("/");
            if (index >= 0) {
                topic = topic.substr(index, topic.length);
            }
            this.excuteClientCallback(AntMessagerParse.CHATMSG_TYPE.OTHER, data, topic);
            Log.log(topic, AntMessagerParse.CHATMSG_TYPE.OTHER, data);
        };

        /**执行消息回调方法**/
        MqttInterfaceImpl.prototype.excuteClientMessageCallback = function (messageId, argObj) {
            try {
                if (this.interface.msgSendCallback[messageId]) {
                    this.interface.msgSendCallback[messageId](argObj);
                    delete this.interface.msgSendCallback[messageId];
                }
            } catch (e) {
                Log.log("调用用户注册的回调方法出现错误", e);
            }
        };

        /**执行消息回调方法**/
        MqttInterfaceImpl.prototype.excuteClientCallback = function (callbackType, argObj, topic) {
            try {
                if (this.interface.callback[callbackType]) {
                    if (topic) {
                        this.interface.callback[callbackType](argObj, topic);
                    } else {
                        this.interface.callback[callbackType](argObj);
                    }
                }
                if (callbackType == AntMessagerParse.ROOM_TYPE.CREATE) {
                    var roomId = argObj.roomId;
                    if (this.interface.craeteRooomCallback.hasOwnProperty(roomId)) {
                        this.interface.craeteRooomCallback[roomId](argObj);
                        delete this.interface.craeteRooomCallback[roomId];
                    }
                }
            } catch (e) {
                console.log("调用用户注册的回调方法出现错误_", e);
            }
        };

        MqttInterfaceImpl.prototype.createRealTopic = function (topic) {
            var topic = this.interface.appKey + "/" + topic;

            return topic;
        };

        MqttInterfaceImpl.prototype.createUserOSTopic = function () {
            var topic = this.interface.userId + "/" + SDK_TYPE;
            return topic;
        };

        MqttInterfaceImpl.prototype.newTraceFunction = function (msg) {
            if (msg && msg.severity == "INFO") {
                Log.log(msg);
            }
        };
        return new MqttInterfaceImpl(interface);
    };

    var AntClient = function (option) {
        /***
         *
         * @param option
         * @param {string} option.companyCode 公司代码
         * @param {string} option.appKey 应用ID
         * @param {string} option.appSecret 加密
         * @param {string} option.userId 用户ID
         * @param {string} option.connectWay 连接方式，0：允许多端
         * @param {string} option.connectWay 连接方式，1：允许一端
         * @param {function} option.onSuccess 连接成功回调
         * @param {function} option.onFailure 连接失败回调
         * @constructor
         */
        var Interface = function (option) {
            option = option || {};
            validate(option, {
                companyCode: "string",
                appKey: "string",
                appSecret: "string",
                userId: "string",
                connectWay: "number",
                onSuccess: "function",
                onFailure: "function"
            });
            this.companyCode = option.companyCode;
            this.appKey = option.appKey;
            this.appSecret = option.appSecret;
            this.userId = option.userId;
            this.connectWay = null;
            this.connectWay = option.connectWay;

            this.callback.connectSuccess = option.onSuccess;
            this.callback.connectFailure = option.onFailure;
            this.mqttClientProxy = new AntMqttClient(this);
            this.httpClientProxy = new AntHttpClient(option, this.mqttClientProxy);
            var that = this;
            this.httpClientProxy.init(function (data) {
                //文件的上传地址
                FILE_UPLOAD_URL = data.fileUploadUrl;
                ANT_MESSAGE_URL = data.antMessageUrl;
                that.mqttClientProxy = new AntMqttClient(that);
                that.mqttClientProxy.init(data);
            });
        };
        //保存回调方法
        Interface.prototype.callback = {};
        Interface.prototype.connectWay = 0;
        Interface.prototype.appSecret = null;
        Interface.prototype.userId = null;
        Interface.prototype.userName = null;
        Interface.prototype.companyCode = null;
        Interface.prototype.appKey = null;
        Interface.prototype.mqttClientProxy = null;
        Interface.prototype.httpClientProxy = null;
        Interface.prototype.MESSAGEID_PRE = new Date().getTime() + "";
        Interface.prototype.MSG_ID_BACK = 0;
        Interface.prototype.msgSendCallback = {};
        Interface.prototype.msgReciveList = {};  //收到消息的列表
        Interface.prototype.craeteRooomCallback = {};
        Interface.prototype.passthroughMsgCallback = {};
        // Interface.prototype.reConnectCallback = EMPTYFN;

        Interface.prototype.reConnectCallback = function(callback){
            callback && callback();
        }

        // 当前用户聊天室的ID
        Interface.prototype.currentRoomId = null;


        /**
         * 注册用户信息
         * @param user 注册的用户信息
         * @param {string} user.userName 注册的用户姓名
         * @param {function} callback
         */
        Interface.prototype.updateUser = function (user, callback) {
            user = user || {};
            validate(user, {
                userName: "string"
            });
            this.userName = user.userName;
            this.httpClientProxy.UserBusy.updateUser(user, callback)
        };


        /**
         * 接受用户消息
         * @param {object} acceptUserMsgOption
         * @param {function} acceptUserMsgOption.joinRoom 收到加入聊天室的消息
         * @param {function} acceptUserMsgOption.joinRoomApply 收到邀请加入聊天室的消息
         * @param {function} acceptUserMsgOption.joinApplyResult 收到同意或者拒绝邀请
         * @param {function} acceptUserMsgOption.other 收到其他的消息
         * @param {function} acceptUserMsgOption.passthroughMsg 收到透传消息
         */
        Interface.prototype.acceptUserMsg = function (acceptUserMsgOption) {
            if (!this.mqttClientProxy) {
                throw new Error(format(ERROR.SDK_NOT_ININT));
                return;
            }
            // console.log("开始接受用户消息");
            acceptUserMsgOption = acceptUserMsgOption || {};

            validate(acceptUserMsgOption, {
                joinRoom: "function", // 收到加入聊天室的消息
                joinRoomApply: "function", //收到邀请加入聊天室的消息
                joinApplyResult: "function",// 收到同意或者拒绝邀请
                other: "function",
                passthroughMsg: "function"// 接受透彻消息
            });

            this.callback[AntMessagerParse.SESSION_TYPE.SESSION_APPLY] = acceptUserMsgOption.joinRoomApply;
            this.callback[AntMessagerParse.SESSION_TYPE.AGREE_APPLY] = acceptUserMsgOption.joinApplyResult;
            this.callback[AntMessagerParse.ROOM_TYPE.CREATE] = acceptUserMsgOption.joinRoom;
            this.callback[AntMessagerParse.CHATMSG_TYPE.OTHER] = acceptUserMsgOption.other;
            this.callback[AntMessagerParse.PASSTHROUGH_TYPE] = acceptUserMsgOption.passthroughMsg;
        };

        /***
         * @param {object}  acceptRoomMsgOption
         * @param {function}  acceptRoomMsgOption.deleteRoom 聊天室删除的消
         * @param {function}  acceptRoomMsgOption.updateRoom 聊天室信息更新的消息
         * @param {function}  acceptRoomMsgOption.roomMembersJoin 聊天室成员加入的消息
         * @param {function}  acceptRoomMsgOption.roomMembersExit 聊天室用户离开的消息
         * @param {function}  acceptRoomMsgOption.roomMembersLeave 聊天室用户删除的消息
         * @param {function}  acceptRoomMsgOption.roomMemberUpdate  聊天室成员信息改变的消息
         * @param {function}  acceptRoomMsgOption.textMsg  消息内容
         * @param {function}  acceptRoomMsgOption.imgMsg  图片消息
         * @param {function}  acceptRoomMsgOption.fileMsg  文件消息
         * @param {string} roomId 聊天室ID
         */
        Interface.prototype.acceptRoomMsg = function (acceptRoomMsgOption, roomId) {
            if (!this.mqttClientProxy) {
                throw new Error(format(ERROR.SDK_NOT_ININT));
            }
            if (!this.mqttClientProxy.isConnected()) {
                throw new Error(format(ERROR.SDK_NOT_ININT));
            }
            acceptRoomMsgOption = acceptRoomMsgOption || {};
            validate(acceptRoomMsgOption, {
                deleteRoom: "function", //聊天室删除的消息
                updateRoom: "function", // 聊天室信息更新的消息
                roomMembersJoin: "function",// 聊天室成员加入的消息
                roomMembersLeave: "function",// 聊天室用户离开的消息
                roomMembersExit: "function",// 聊天室用户离开的消息
                roomMemberUpdate: "function",// 聊天室成员信息改变的消息
                textMsg: "function",//msg 消息内容，roomId 聊天室ID
                imgMsg: "function",//图片消息，roomId 聊天室的ID
                fileMsg: "function",// 文件消息，roomId 聊天室的ID
                customizeMsg: "function", // 自定义消息

                joinRoom: "function", // 自定义消息
            });

            this.callback[AntMessagerParse.ROOM_TYPE.DELETE] = acceptRoomMsgOption.deleteRoom;
            this.callback[AntMessagerParse.ROOM_TYPE.ROOM_UPDATE] = acceptRoomMsgOption.updateRoom;
            this.callback[AntMessagerParse.ROOM_TYPE.MEMBER_ADD] = acceptRoomMsgOption.roomMembersJoin;
            this.callback[AntMessagerParse.ROOM_TYPE.MEMBER_EXIT] = acceptRoomMsgOption.roomMembersExit;
            this.callback[AntMessagerParse.ROOM_TYPE.MEMBER_DELETE] = acceptRoomMsgOption.roomMembersLeave;
            this.callback[AntMessagerParse.ROOM_TYPE.MEMBER_UPDATE] = acceptRoomMsgOption.roomMemberUpdate;
            this.callback[AntMessagerParse.CHATMSG_TYPE.TXT] = acceptRoomMsgOption.textMsg;
            this.callback[AntMessagerParse.CHATMSG_TYPE.IMG] = acceptRoomMsgOption.imgMsg;
            this.callback[AntMessagerParse.CHATMSG_TYPE.FILE] = acceptRoomMsgOption.fileMsg;
            this.callback[AntMessagerParse.CHATMSG_TYPE.CUSTOMIZE] = acceptRoomMsgOption.customizeMsg;

            this.callback[AntMessagerParse.ROOM_TYPE.CREATE] = acceptRoomMsgOption.joinRoom;
            if (roomId) {
                this.mqttClientProxy.subscribe(roomId);
                this.currentRoomId = roomId;
            }
        };

        Interface.prototype.acceptRoomMsgByRoomId = function (roomId, success, fail) {
            this.mqttClientProxy.subscribe(roomId, 1, success, fail);
            this.currentRoomId = roomId;
        };

        /****
         * 接受自定义透传消息
         * @param tag
         * @param callback
         */
        Interface.prototype.acceptPassthroughMsg = function (tags, success, fail) {
            var params = {tags: tags};
            validate(params, {
                tags: "object"
            });
            if (!tags) {
                throw new Error(format(ERROR.PARAMS_ERROR, "tag"));
                return;
            }
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                if (!tag) {
                    throw new Error(format(ERROR.PARAMS_ERROR, "tag"));
                    return;
                }
                this.mqttClientProxy.subscribe(tag, 0, success, fail);
            }

        };

        /**
         * 取消接受聊天室消息
         * @param {string} roomId 聊天室ID
         */
        Interface.prototype.unAcceptRoomMsg = function (roomId) {
            if (!this.mqttClientProxy) {
                throw new Error(format(ERROR.SDK_NOT_ININT));
                return;
            }
            if (!this.mqttClientProxy.isConnected()) {
                throw new Error(format(ERROR.SDK_NOT_ININT));
                return;
            }
            if (roomId) {
                this.mqttClientProxy.unSubscribe(roomId);
            }
        };

        /**
         * 创建聊天室
         * @param {string} roomInfo 聊天室信息
         * @param {string} roomInfo.roomName   聊天室名称
         * @param {string} roomInfo.desc   聊天室描述
         * @param {string} roomInfo.remark   聊天室备注
         * @param {string} roomInfo.attr1   扩展值
         * @param {string} roomInfo.attr2   扩展值
         * @param {string} roomInfo.attr3   扩展值
         * @param {string} roomInfo.robotFlag   是否启用机器人
         * @param {string} roomInfo.robotType   机器人类型
         * @param {array} roomInfo.members   聊天室成员列表
         * @param {string} roomInfo.members[0].userId   聊天室成员ID
         * @param {string} roomInfo.members[0].userName   聊天室成员姓名
         * @param {function} successBack  成功回调
         * @param {function} failBack  失败回调
         */
        Interface.prototype.createRoom = function (roomInfo, successBack, failBack) {
            roomInfo = roomInfo || {};
            validate(roomInfo, {
                roomName: "string", // 聊天室名称
                desc: "string",
                remark: "string",
                attr1: "string",
                attr2: "string",
                attr3: "string",
                robotFlag: "number",
                robotType: "number",
                members: "object"
            });
            var hasSelfFlag = 0;
            if (roomInfo && roomInfo.members) {
                var members = roomInfo.members;
                if (!Utils.isArray(members)) {
                    throw new Error(format(ERROR.SDK_NOT_ININT));
                    return;
                }
                for (var i = 0; i < members.length; i++) {
                    var member = members[i];
                    validate(member, {
                        userId: "string",
                        userName: "string"
                    });
                    if (member.userId == this.userId) {
                        hasSelfFlag = 1;
                    }

                }
            }
            // 添加用户Id
            roomInfo.operateId = this.userId;
            var that = this;
            this.httpClientProxy.RoomBusy.addRoom(roomInfo, function (data) {
                var roomId = data.data;
                if (data && data.errorCode == 0 && data.errorMsg == '请求成功' && roomId) {
                    if (hasSelfFlag == 1) {
                        if (successBack) {
                            that.craeteRooomCallback[roomId] = successBack;
                        }
                    } else {
                        Log.log("创建聊天室成功，聊天室ID 为：" + roomId);
                        try {
                            that.mqttClientProxy.subscribe(roomId);
                        } catch (e) {
                            Log.log("创建聊天室，订阅聊天室主题错误", e);
                        }
                        if (successBack) {
                            successBack(data);
                        }
                    }
                }
            }, failBack);
        };

        /***
         * 更新聊天室
         * @param {object} roomInfo
         * @param {string} roomInfo.roomName  聊天室名称
         * @param {string} roomInfo.desc 聊天室描述
         * @param {string} roomInfo.remark 聊天室备注
         * @param {string} roomInfo.attr1 扩展值
         * @param {string} roomInfo.attr2 扩展值
         * @param {string} roomInfo.attr3  扩展值
         * @param {string} roomInfo.roomId 聊天室ID
         * @param {function} successBack   成功回调
         * @param {function} failBack 失败回调
         */
        Interface.prototype.updateRoom = function (roomInfo, successBack, failBack) {
            roomInfo = roomInfo || {};
            validate(roomInfo, {
                roomName: "string",
                desc: "string",
                remark: "string",
                attr1: "string",
                attr2: "string",
                attr3: "string",
                roomId: "string", // 聊天室ID
            });
            this.httpClientProxy.RoomBusy.updateRoom(roomInfo, successBack, failBack);
        };

        //获取用户的所有聊天室
        Interface.prototype.findRooms = function (successBack, failBack) {
            this.httpClientProxy.RoomBusy.findRooms({userId: this.userId}, successBack, failBack);
        };

        //查询聊天室成员
        Interface.prototype.findRoomMembers = function (roomId, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            this.httpClientProxy.RoomBusy.findRoomMembers({roomId: roomId}, successBack, failBack);
        };

        //查询聊天室成员
        Interface.prototype.getRoomMemberDetail = function (roomId, userId, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            if (userId == null || userId.trim() == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "userId"));
            }
            this.httpClientProxy.RoomBusy.getRoomMemberDetail({roomId: roomId, userId: userId}, successBack, failBack);
        };

        //获取聊天室详细信息
        Interface.prototype.getRoomDetail = function (roomId, ope, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            if (ope) {
                this.httpClientProxy.RoomBusy.getRoomsDetail({roomId: roomId, ope: ope}, successBack, failBack);
            } else {
                this.httpClientProxy.RoomBusy.getRoomsDetail({roomId: roomId}, successBack, failBack);
            }

        };

        //获取聊天室历史信息
        Interface.prototype.getRoomHisMsg = function (roomId, startChatIndex, endChatIndex, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var serverParam = {
                appKey: this.appKey,
                sessionId: roomId,
                startChatIndex: startChatIndex !== undefined ? startChatIndex : '',
                endChatIndex: endChatIndex !== undefined ? endChatIndex : ''
            };
            this.httpClientProxy.RoomBusy.getRoomHisMsg(serverParam, successBack, failBack);
        };

        //删除聊天室
        Interface.prototype.deleteRoom = function (roomId, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            this.httpClientProxy.RoomBusy.deleteRoom({roomId: roomId, operateId: this.userId}, successBack, failBack);
        };

        //退出聊天室
        Interface.prototype.exitRoom = function (roomId, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var that = this;
            this.httpClientProxy.RoomBusy.exitRoom({
                roomId: roomId,
                userId: this.userId,
                userName: this.userName
            }, function (data) {
                that.mqttClientProxy.unSubscribe(roomId);
                if (successBack) successBack(data);
            }, failBack);
        };

        //删除聊天室成员
        Interface.prototype.deleteMembers = function (params, successBack, failBack) {
            params = params || {};
            validate(params, {
                roomId: "string",
                operateId: "string",
                members: "object",
            });
            if (!params.members) {
                throw new Error(format(ERROR.PARAMS_ERROR, "members"));
            }
            var members = params.members;
            if (!Utils.isArray(members)) {
                throw new Error(format(ERROR.PARAMS_ERROR, "members"));
            }
            for (var i = 0; i < members.length; i++) {
                validate(members[i], {
                    userId: "string",
                    userName: "string"
                });
            }
            this.httpClientProxy.RoomBusy.deleteMembers(params, successBack, failBack);
        };

        //添加聊天室成员
        Interface.prototype.addRoomMembers = function (params, successBack, failBack) {
            params = params || {};
            validate(params, {
                roomId: "string",
                operateId: "string",
                members: "object",
            });
            if (!params.members) {
                throw new Error(format(ERROR.PARAMS_ERROR, "members"));
            }
            for (var i = 0; i < params.members.length; i++) {
                validate(params.members[i], {
                    userId: "string",
                    userName: "string"
                });
            }
            this.httpClientProxy.RoomBusy.addRoomMembers(params, successBack, failBack);
        };

        //邀请用户加入聊天室
        Interface.prototype.inviteToRoom = function (handleId, roomId, roomName, remark, successBack, failBack) {
            var params = {
                handleId: handleId,
                targetId: roomId,
                targetName: roomName,
                remark: remark,
            };
            if (!params.targetId) {
                throw new Error(format(ERROR.PARAMS_ERROR, "targetId"));
            }
            if (!params.handleId) {
                throw new Error(format(ERROR.PARAMS_ERROR, "handleId"));
            }
            params.userId = this.userId;
            params.userName = this.userName;
            this.httpClientProxy.invite(params, successBack, failBack);
        };

        //同意或者拒绝邀请
        Interface.prototype.handleInvite = function (state, handleId, roomId, roomName, userName, remark, successBack, failBack) {
            var params = {
                handleId: handleId,
                targetId: roomId,
                targetName: roomName,
                remark: remark,
                state: state,
            };
            var state = parseInt(params.state);
            if (isNaN(state)) {
                throw new Error(format(ERROR.PARAMS_ERROR, "state"));
            }

            if (state != 1 && state != 2) {
                throw new Error(format(ERROR.PARAMS_ERROR, "state"));
            }

            if (!params.targetId) {
                throw new Error(format(ERROR.PARAMS_ERROR, "targetId"));
            }
            if (!params.handleId) {
                throw new Error(format(ERROR.PARAMS_ERROR, "handleId"));
            }
            params.userId = this.userId;
            params.userName = this.userName;
            this.httpClientProxy.invite(params, successBack, failBack);
        };

        //更新聊天室成员信息
        Interface.prototype.updateRoomMemberInfo = function (roomId, member, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            member.roomId = roomId;
            if (!member.userId) {
                member.userId = this.userId;
            }
            if (!member.operateId) {
                member.operateId = this.userId;
            }
            validate(member, {
                "userId": "string",   //成员ID
                "userName": "string",   //成员ID
                "operateId": "string",   //操作者ID
                "roomId": "string",   // 聊天室ID
                "desc": "string",     // 描述
                "remark": "string",   // 备注
                "attr1": "string",    // 扩展信息
                "attr2": "string",    // 扩展信息
                "attr3": "string"     // 扩展信息
            });
            this.httpClientProxy.RoomBusy.updateMember(member, successBack, failBack);
        };

        //邀请成员加入聊天室
        Interface.prototype.applyMemberJoinRoom = function (roomId, targetId, userName, roomName) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var sessionMsg = new SessionMsg();
            sessionMsg.messageType = AntMessagerParse.SESSION_TYPE.SESSION_APPLY;
            sessionMsg.sendUserId = this.userId;
            sessionMsg.targetId = targetId;
            sessionMsg.sessionId = roomId;
            sessionMsg.content = {
                username: userName,
                sessionName: roomName
            };

            this.mqttClientProxy.publish(TOPICS.SEND_MSG_TOPIC, sessionMsg.encode());
        };

        //同意加入聊天室
        Interface.prototype.agreeJoinRoom = function (roomId, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var params = {
                roomId: roomId,
                members: [
                    {userId: this.userId, userName: this.userName}
                ]
            };
            this.httpClientProxy.RoomBusy.addRoomMembers(params, successBack, failBack);
        };

        //发送聊天室文本消息
        Interface.prototype.sendRoomTxtMsg = function (roomId, msg, attr, successBack, failBack, chatType, messageId) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var msgId = messageId || this.getIDIndex();
            var message = new ChatMessage();
            if(chatType == 'room'){
                message.chatType = ROOM_CHAT_TYPE;
                message.sessionId = roomId;
            }else{
                message.chatType = CHAT_TYPE;
                message.sessionId = createSessionId(this.userId, roomId);
            }
            message.messageType = AntMessagerParse.CHATMSG_TYPE.TXT;
            message.os = SDK_TYPE;
            message.flag = MSG_FLAG;
            message.status = MSG_STATE;
            message.messageId = msgId;
            message.appKey = this.appKey;
            message.sendUserId = this.userId;
            message.targetId = roomId;
            message.attr = msg.attr;
            message.content = msg;

            if (successBack) {
                this.msgSendCallback[msgId] = successBack;
            }
            try{
                Log.log("发送的消息为：", msg, msgId, this.userId,  message.encode());
                this.mqttClientProxy.publish(TOPICS.SEND_MSG_TOPIC, message.encode(), successBack, failBack);
            }catch(e){
                if(failBack){
                    failBack(msgId);
                }
            }
            return message;
        };

        //发送自定义消息
        Interface.prototype.sendCustomizeMsg = function (roomId, msg, attr, successBack, failBack, chatType, messageId) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var msgId = messageId || this.getIDIndex();
            var message = new ChatMessage();
            if(chatType == 'room'){
                message.chatType = ROOM_CHAT_TYPE;
                message.sessionId = roomId;
            }else{
                message.chatType = CHAT_TYPE;
                message.sessionId = createSessionId(this.userId, roomId);
            }
            message.messageType = AntMessagerParse.CHATMSG_TYPE.CUSTOMIZE;
            message.os = SDK_TYPE;
            message.flag = MSG_FLAG;
            message.status = MSG_STATE;
            message.messageId = msgId;
            message.appKey = this.appKey;
            message.sendUserId = this.userId;
            message.targetId = roomId;
            message.attr = msg.attr;
            message.content = msg;

            if (successBack) {
                this.msgSendCallback[msgId] = successBack;
            }
            try{
                Log.log("发送的消息为：", msg, msgId, this.userId,  message.encode());
                this.mqttClientProxy.publish(TOPICS.SEND_MSG_TOPIC, message.encode(), successBack, failBack);
            }catch(e){
                if(failBack){
                    failBack(msgId);
                }
            }
            return message;
        };

        //发送聊天室文本消息
        Interface.prototype.sendRoomMsg = function (roomId, message, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var msgId = this.getIDIndex();
            message.messageId = msgId;
            if (successBack) {
                this.msgSendCallback[msgId] = successBack;
            }
            this.mqttClientProxy.publish(TOPICS.SEND_MSG_TOPIC, message.encode(), successBack, failBack);
            return message;
        };

        /***
         * 发送自带路径的图片消息
         * @param roomId 聊天室ID
         * @param imgInfo  带路径的图片信息
         * @param successBack 发送成功回调
         * @param failBack 发送失败回调
         */
        Interface.prototype.sendRoomImgTxtMsg = function (roomId, imgInfo, successBack, failBack) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            imgInfo = imgInfo || new ImgMsgInfo();
            validate(imgInfo, {
                "picUrl": "string",            //文件的名称
            });
            var msgId = this.getIDIndex();
            var message = new ChatMessage();
            message.messageType = AntMessagerParse.CHATMSG_TYPE.IMG;
            message.chatType = CHAT_TYPE;
            message.os = SDK_TYPE;
            message.flag = MSG_FLAG;
            message.status = MSG_STATE;
            message.messageId = msgId;
            message.appKey = this.appKey;
            message.sendUserId = this.userId;
            message.targetId = roomId;
            message.sessionId = roomId;
            message.content = imgInfo;
            if (successBack) {
                this.msgSendCallback[msgId] = successBack;
            }
            this.mqttClientProxy.publish(TOPICS.SEND_MSG_TOPIC, message.encode(), successBack, failBack);
            return message;
        };

        /***
         * 发送文件消息
         * @param roomId  聊天室ID
         * @param fileInputId  文件的INPUT ID
         * @param successBack 发送成功回调
         * @param failBack 发送失败回调
         */
        Interface.prototype.sendRoomFileMsg = function (roomId, fileInputId, upLoadsuccessBack, upLoadFailBack, sendSuccessBack, sendFailBack, progressCallback, chatType, isFile, msgId) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            var that = this;
            var uri = Utils.File.getFileUrl(fileInputId);
            var msgId = msgId || this.getIDIndex();
            var onFileUploadComplete = function (jsonData) {
                if (jsonData.fileType) {
                    if (Utils.File.isImg(jsonData.fileName) && !isFile) {
                        var fileInfo = new ImgMsgInfo();
                        fileInfo.picUrl = jsonData.dowmnloadUrl;
                        upLoadsuccessBack && upLoadsuccessBack(fileInfo, msgId);
                        that.sendRoomImgTxtMsg(roomId, fileInfo, sendSuccessBack, sendFailBack, chatType, msgId);
                    } else {
                        var fileInfo = new FileMsgInfo();
                        fileInfo.fileName = jsonData.fileName || uri.filename || "";
                        fileInfo.fileUrl = jsonData.dowmnloadUrl;
                        fileInfo.size = jsonData.fileSize;
                        upLoadsuccessBack && upLoadsuccessBack(fileInfo, msgId);
                        that.sendRoomFileTxtMsg(roomId, fileInfo, sendSuccessBack, sendFailBack, chatType, msgId);
                    }
                }
            };
            var onFileUploadFailBack = function(msgId){
                upLoadFailBack && upLoadFailBack(msgId);
            }
            var options = {
                onFileUploadError: onFileUploadFailBack || EMPTYFN,
                onFileUploadProgress: progressCallback || EMPTYFN,
                onFileUploadCanceled: onFileUploadFailBack || EMPTYFN,
                onFileUploadComplete: onFileUploadComplete,
                file: uri
            };
            
            Utils.File.uploadFile(options);

            var message = {};
            message.messageId = msgId;
            return message
        };


        /**
         * 自定义文件上传，方式发送文件消息，及文件在自己的服务器上上传，返回上传地址，在这里发送文件消息
         * @param roomId
         * @param fileInfo
         * @param successBack
         * @param failBack
         */
        Interface.prototype.sendRoomFileTxtMsg = function (roomId, fileInfo, successBack, failBack, chatType, msgId) {
            if (roomId == null || roomId == "") {
                throw new Error(format(ERROR.PARAMS_ERROR, "roomId"));
            }
            fileInfo = fileInfo || new FileMsgInfo();
            validate(fileInfo, {
                "fileName": "string",            //文件的名称
                "fileUrl": "string",     //文件的地址
                "size": "number"
            });
            var msgId = msgId || this.getIDIndex();
            var message = new ChatMessage();

            if(chatType == 'group'){
                message.chatType = GROUP_CHAT_TYPE;
                message.sessionId = roomId;
            }else if(chatType == 'room'){
                message.chatType = ROOM_CHAT_TYPE;
                message.sessionId = roomId;
            }else{
                message.chatType = CHAT_TYPE;
                message.sessionId = createSessionId(this.userId, roomId);
            }

            message.messageType = AntMessagerParse.CHATMSG_TYPE.FILE;
            message.os = SDK_TYPE;
            message.flag = MSG_FLAG;
            message.status = MSG_STATE;
            message.messageId = msgId;
            message.appKey = this.appKey;
            message.sendUserId = this.userId;
            message.targetId = roomId;
            message.content = fileInfo;
            if (successBack) {
                this.msgSendCallback[msgId] = successBack;
            }
            this.mqttClientProxy.publish(TOPICS.SEND_MSG_TOPIC, message.encode(), successBack, failBack);
            return message;
        };

        /***
         * 给聊天室发送透传消息
         * @param msg
         * @param target
         * @param sdk 0:
         */
        Interface.prototype.sendPassthroughMsg = function (msg, targetId, sdk) {
            if (!msg) {
                return;
            }
            if (sdk && (sdk != 0 || sdk != 1 || sdk != 2 || sdk != 3 || sdk != 4 || sdk != 5)) {
                return;
            }
            var o = {msg:msg};

            validate(o,{msg:"string"});

            var passthroughInfo = new PassthroughInfo();
            passthroughInfo.targetId = targetId;
            passthroughInfo.content = msg;
            var topic = this.appKey;
            if (targetId) {
                topic += "/" + targetId;
            }
            if (sdk) {
                topic += "/" + sdk;
            }
            this.mqttClientProxy.publishPassthrough(topic, passthroughInfo.encode());
            return passthroughInfo;
        };

        /**标记消息为已经读了***/
        Interface.prototype.markMsgToRead = function (roomId, chatIndex) {
            var msgKey = roomId + "" + chatIndex;
            if (this.msgReciveList[msgKey]) {
                var msg = this.msgReciveList[msgKey];
                var readMsg = new MessageRead();
                readMsg.os = SDK_TYPE;
                readMsg.flag = msg.flag;
                readMsg.status = msg.status;
                readMsg.appKey = msg.appKey;
                readMsg.sendUserId = msg.sendUserId;
                readMsg.targetId = msg.targetId;
                readMsg.sessionId = msg.sessionId;
                readMsg.chatIndex = msg.chatIndex;
                this.mqttClientProxy.publish(TOPICS.READ_MSg_TOPIC, readMsg.encode());
            }
        };
        /***
         * 获取系统自带的表情报
         * @returns {Array}
         */
        Interface.prototype.getSysEmoil = function () {
            return Emoji.face;
        };

        /**
         * 获取消息的ID
         * @returns {*}
         */
        Interface.prototype.getIDIndex = function () {
            // var result = this.MESSAGEID_PRE + this.MSG_ID_BACK;
            // this.MSG_ID_BACK++;
            // return result;
            return 'M' + new Date().getTime() + SDK_TYPE + parseInt(Math.random()*Math.pow(10,8));
        };

        // 订阅主题
        Interface.prototype.subscribe = function(topicNames, successBack, failBack){
            this.mqttClientProxy.subscribe(topicNames, QOS, successBack, failBack);
        };

        /**
         * 获取会话列表
         * @returns {*}
         */
        Interface.prototype.getChatList = function (params, successBack, failBack) {
            params.os = SDK_TYPE;
            this.httpClientProxy.RoomBusy.getChatList(params, function(data){
                if (data && data.errorCode == 0) {
                    successBack && successBack(data.data);
                }else{
                    failBack && failBack(data);
                }
            }, function(data){
                failBack && failBack(data);
            });
        };

        // 取消订阅主题
        Interface.prototype.unSubscribe = function(topicNames, successBack, failBack){
            this.mqttClientProxy.unSubscribe(topicNames, successBack, failBack);
        };

        return new Interface(option);
    };

    window.AntClientManager = {
        newInterface: function (options, crossDomain, domain){
            if (typeof crossDomain === "undefined"){
                CROSSDOMAIN = true;
            } else {
                CROSSDOMAIN = crossDomain;
            }
            
            if(!domain){
                DNS_URL = DNS_URL;
            }else if(domain == 'test'){
                DNS_URL = DNS_URL_TEST;
            }else if(domain == 'hb'){
                DNS_URL = DNS_URL_HB;
            }else if(domain == 'pre'){
                DNS_URL = DNS_URL_PRE;
            }else if(domain == 'dev'){
                DNS_URL = DNS_URL_DEV;
            }else{
                var reg = /^http:\/\/|https:\/\//i;
                domain = domain.replace(reg, '');
                DNS_URL = protocol + domain;
            }

            return new AntClient(options);
        }
    };

    window.AntImgMsgInfo = ImgMsgInfo;

    window.ChatMessage = ChatMessage;

    window.AntMessagerParse = AntMessagerParse;

    window.AntFileMsgInfo = FileMsgInfo;

    window.ANTUtils = window.ANTUtils || Utils;

})(window);