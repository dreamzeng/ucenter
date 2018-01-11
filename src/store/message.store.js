
/**
 * 系统消息
 */
const Api = require('@/api/index').default
export const MESSAGE_COUNT = 'MESSAGE_COUNT'

export default{
    state: {
        messageCount:0
    },
    mutations: {
        [MESSAGE_COUNT](state,payload){
            state.messageCount = payload
        }
    },
    actions:{
        messageCount(context, param){
             return new Promise((resolve, reject) =>{
                 let nums = [];
                Api.message.messageList(param).then(resp=>{
                    let data = resp.data.items;
                    data.forEach(item=>{
                       if(item.state.code == 0){
                          nums.push(item.id);
                       }
                    });
                    nums = nums.length;
                    context.commit(MESSAGE_COUNT, nums)
                    resolve(resp)
                }).catch(err=>{
                    reject(err)
                })
            })
        }
    },
    getters:{
       messageCount: state => state.messageCount
    }
}