import {Ajax} from 'lib/Ajax'

let setup = {
    resetPassword(params){
       return Ajax.post({
            url:'/lawyer/set/reset-password',
            params
        })
    },
    sendSmsCode(params){
        return Ajax.post({
            url:'/lawyer/set/send-sms-code',
            params
        })
    },
    checkSmsCode(params){
        return Ajax.post({
            url:'/lawyer/set/check-sms-code',
            params
        })  
    },
    modifyPhone(params){
        return Ajax.post({
            url:'/lawyer/set/modify-phone',
            params
        })
    }
}

export default setup