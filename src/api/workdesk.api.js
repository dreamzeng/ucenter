import {Ajax} from 'lib/Ajax'

let workdesk = {

    /**
     * 请求工作台首页
     */
    getCategoryList(){
        return Ajax.get({
            url: '/lawyer/work-desk-index',
            params:{}
        })
    },

    /**
     * 添加到常用工具
     * @param params
     * token	Y	varchar	token
     *  workdeskUuid	Y	varchar	工作台UUID
     */
    addCommonTool(params){
        return Ajax.post({
            url: '/lawyer/add-common-tool',
            params
        })
    },

    /**
     * 去除常用工具
     * @param {*} params 
     * token	Y	varchar	token
     * workdeskUuid	Y	varchar	工作台UUID
     */
    lessCommonTool(params){
        return Ajax.post({
            url: '/lawyer/less-common-tool',
            params
        })
    },

    getJusticeType(){
        return Ajax.get({
            url:'lawyer/justice-type'
        })
    },

    getCaseAddress(params){
        return Ajax.get({
            url:'lawyer/case-address',
            params
        })
    },

    getCaseName(params){
        return Ajax.get({
            url:'lawyer/case-name',
            params
        })
    },

    /**
     * 文书下载列表
     */
    documentList(params){
        return Ajax.get({
            url:'lawyer/document-list',
            params
        })
    },
    /**
     * 查看文书详情
     */
    findDocumentContract(params){
        return Ajax.get({
            url:'lawyer/find-documentContract',
            params
        })
    },
     /**
     * 我的收藏
     */
     myCollect(params){
        return Ajax.get({
            url:'lawyer/information/my-collect',
            params
        })
    }
}

export default workdesk