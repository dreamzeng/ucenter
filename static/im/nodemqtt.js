if (typeof NODE === "undefined") {
    NODE = {};
}

NODE.MQTT = (function (global) {

    var PROXY_URL = 'http://14.17.70.69:8110';
    var Client = function(host, port, client,antWebMessageProxy){
        this.host = host;
        this.port = port;
        this.clientId = client;
        this.socket = null;
        PROXY_URL = antWebMessageProxy;
        this.connected = false;
        this.traceFlag = false;
        this.topicSuccessCallbackMap = {};
        this.topicFailCallbackMap = {};
        this.timer = null;
        this.reconnectionsCount = 0;
    };

    Client.prototype.onConnectionLost = null;
    Client.prototype.onMessageArrived = null;
    Client.prototype.onFailure = null;
    Client.prototype.onSuccess = null;
    Client.prototype.trace = null;

    Client.prototype.startTrace = function(){
        this.traceFlag = true;
    };

    Client.prototype.connect = function(data){
        var that = this;
        that.socket = io.connect(PROXY_URL);
        that.socket.on('connect', function () {
            if(that.traceFlag && that.trace){
                that.trace({
                    message: "node mqtt client connected ",
                    severity: "Debug",
                });
            }
            that.connected = true;
            if(data.onSuccess){
                data.onSuccess();
            }
        });
        that.socket.on("connect_failed", function(){
            if(that.traceFlag && that.trace){
                that.trace({
                    message: "node mqtt client connected Fail ",
                    severity: "Debug",
                });
            }
            if(data.onFailure){
                data.onFailure();
            }
            that.connected = false;
        });
        that.socket.on('mqtt', function (msg) { // 收到MQTT 消息
            if(that.onMessageArrived){
                that.onMessageArrived({
                    destinationName: msg.topic,
                    payloadString: msg.payload
                });
            }
        });
        that.socket.on('disconnect', function(){
            if(that.onConnectionLost){
                that.onConnectionLost();
            }
        });
        that.socket.on("subscribeCallback", function(data){
            try {
                data = JSON.parse(data);
            } catch (error) {
                
            }
            if(data){
                var topic = data.topic;
                var result = data.result;
                if(result == 1 && that.topicSuccessCallbackMap.hasOwnProperty(topic)){
                    that.topicSuccessCallbackMap[topic]();
                }else if(result == 0 && that.topicFailCallbackMap.hasOwnProperty(topic)){
                    that.topicFailCallbackMap[topic]();
                }
            }
        });
        that.socket.on('subscribeManyCallback', function(data){
            data = JSON.parse(data);
            if(data){
                var topic = data.topic,
                    result = data.result,
                    failSubscribeTopicName = [],
                    failSubscribeTopicCallback = [];
                for(var i = 0; i < data.result.length; i++){
                    if(result[i] == 1 && that.topicSuccessCallbackMap.hasOwnProperty(topic[i])){
                        that.topicSuccessCallbackMap[topic[i]]();
                    }else if(result[i] == 0){
                        if(that.topicFailCallbackMap.hasOwnProperty(topic[i])){
                            that.topicFailCallbackMap[topic[i]]();
                        }
                        failSubscribeTopicName.push(topic[i]);
                        failSubscribeTopicCallback.push(that.topicFailCallbackMap[topic[i]]);
                    }
                }
                // 批量订阅失败的topic重新尝试订阅                
                clearInterval(that.timer);
                if(that.reconnectionsCount < 5 && failSubscribeTopicName.length != 0){
                    that.timer = setInterval(function(){
                        that.subscribeMany(failSubscribeTopicName, 0, failSubscribeTopicCallback);
                        that.reconnectionsCount++;
                    }, 10000)
                }
            }
        })
    };

    Client.prototype.isConnected = function(){
        return this.connected;
    };

    Client.prototype.subscribe = function(topicName, options){
        if(options && options.onSuccess){
            this.topicSuccessCallbackMap[topicName] = options.onSuccess;
        }
        if(options && options.onFailure){
            this.topicFailCallbackMap[topicName] = options.onFailure;
        }
        if(options){
            options.topic = topicName;
            this.socket.emit("subscribe", options);
        }else{
            this.socket.emit("subscribe", {topic: topicName});
        }
    };

    Client.prototype.subscribeMany = function(topicArray, qosArray, options){
        if(!topicArray || !topicArray instanceof Array){
            return false;
        }
        var data = {},
            qosList = [];
        data.topic = topicArray;
        if(qosArray && qosArray instanceof Array){
            qosList = qosArray;
        }
        for(var i = 0; i < topicArray.length; i++){
            if(!qosArray || !qosArray instanceof Array){
                qosList[i] = 0;
            }
            if(options && options.onSuccess){
                this.topicSuccessCallbackMap[topicArray[i]] = options.onSuccess;
            }
            if(options && options.onFailure){
                this.topicFailCallbackMap[topicArray[i]] = options.onFailure;
            }
        }
        data.qos = qosList;
        
        this.socket.emit("subscribeMany", data);
    }

    Client.prototype.unsubscribe = function(topicName){
        this.socket.emit("unSubscribe", topicName);
    };

    Client.prototype.send = function(topic, msg, qos){
        this.socket.emit("send", {
            topic: topic,
            message: msg,
            qos: qos
        });
    };
    return {
        Client: Client
    }
})(window);