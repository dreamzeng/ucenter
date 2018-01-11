import {Ajax} from 'lib/Ajax'

export default {
    
    /**
     * 查询律师当前认证信息
     * @param {*} params 
     */
    getAuthInfo(params){
        return Ajax.request({
            url: '/lawyer/auth/get/info',
            params:{},
            auth: {
                token: params.token
            }
        })
    },

    /**
     * 提交基本资料
     * @param {*} params 
     *  realName	Y	String	姓名
     *  idCard	Y	String	身份证号
        code	Y	String	执业证号
        company	N	String	律所
        address	N	String	地址
        position	N	String	担任职位
        caseIds	N	String	擅长领域
     */
    submitBaseInfo(params){
        return Ajax.post({
            url: 'lawyer/auth/submit/base-info',
            params
        })
    },

    /**
     * 提交职业证号
     * @param {*} params 
     * certifyImgUrl	Y	String	律师执业证图片路径
     */
    submitCertifyImg(params){
        return Ajax.post({
            url: '/lawyer/auth/submit/certify-img',
            params
        })
    },

    /**
     * 获取律师基本信息
     * @param {*} params 
     */
    getLawyerInfo(params){
        return Ajax.get({
            url: '/lawyer/center/info',
            params
        })
    },

    /**
     * 更新律师基本信息
     * @param {*} params 
     */
    saveLawyerInfo(params){
        return Ajax.post({
            url: '/lawyer/center/save-lawyer',
            params
        })
    }
}

