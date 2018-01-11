
/**
 * 创建api对象
 */
import {Ajax} from 'lib/Ajax'
let md5 = require('lib/md5')
let qs = require('qs')
let Api = {
    login(){
        return Ajax.post({
            url: '/lawyer/user-center-login',
            params:{
                // 'user':'13798452435',
                // 'pwd':md5.hex_md5('123456').toUpperCase()
                'user':'13418476245',
                'pwd':md5.hex_md5('222222').toUpperCase()
            }
        })
    }
}

let requireContext = require.context('./', false, /\.api.js$/)
requireContext.keys().forEach(path => {
    let apiObject = requireContext(path).default
    let key = path.match(/\.\/(\w+).api/)[1]
    Api[key] = apiObject
});

export default Api