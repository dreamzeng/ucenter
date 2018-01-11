import {Ajax} from 'lib/Ajax'

let messageApi = {
    messageList(params){
        return Ajax.get({
            url:'/lawyer/message/list',
            params
        })  
    },
    messageModify(params){
        return  Ajax.post({
            url:'/lawyer/modify-message',
            params
        })  
    }

}

export default messageApi