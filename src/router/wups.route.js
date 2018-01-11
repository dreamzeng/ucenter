import {asyncComponent} from '@/lib/utils'

const message = asyncComponent('tidings/message')
const serviceMgr = asyncComponent('service/serviceMgr')
const myCollect = asyncComponent('work-desk/collect/my_collect')
const setUp = asyncComponent('setup/set_up')
const changeIphone = asyncComponent('setup/change_iphone')

export let r = [        
    //服务管理
    {
        path: 'service-mgr',
        name: 'service-mgr',
        component: serviceMgr
    },
    //工作台--我的收藏
    {
        path: 'my-collect',
        name: 'my-collect',
        component: myCollect
    },
    //消息
    {   
        path: 'message',
        name: 'message',
        component: message
    },
    //设置
    {
        path: 'set-up', 
        name: 'set-up',
        component: setUp
    }
]