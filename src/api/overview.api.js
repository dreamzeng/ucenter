import {Ajax} from 'lib/Ajax'

let OverviewApi = {
    getDetail(params={}) {
        return Ajax.post({
            url: '/caseType/get-case-type',
            params
        })
    },
    userList(params){
        return Ajax.get({
            url: '/third/user',
            params
        })
    },
    serviceList(params){
        return Ajax.get({
            url:'/lawyer/service/lawyer-all-goods',
            params
        })
    },
    consultList(params){
        return Ajax.get({
            url:'/lawyer/service/lawyer-counseling',
            params
        })  
    },
    consultPriceEdit(params){
        return Ajax.post({
            url:'/lawyer/service/lawyer-edit-price',
            // url: `/lawyer/service/lawyer-edit-price/${params.goodsId ,params.price}`,
            params
        })
    },
    consultUpDown(params){
        return Ajax.post({
            url:'/lawyer/service/set-lawyer-consult',
            // url: `/lawyer/service/set-lawyer-consult?${params.goodsId ,params.state}`,
            params
        })
    },
    serviceUpDown(params){
        return Ajax.post({
            url:'/lawyer/service/lawyer-goods-updown',
            params
        })
    }
}

export default OverviewApi