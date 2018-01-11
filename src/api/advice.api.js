import {Ajax} from 'lib/Ajax'

export default {
    /**
     * 获取回话消息列表
     * @param {*} params 
     * userId	Y	String	当前用户ID
     * userRoleType	Y	String	用户角色类型,1:律师;2:用户;3:产权代理
     */
    getChatList(params){
        return Ajax.post({
            url: 'cj/getChatList',
            params
        })
    }
}