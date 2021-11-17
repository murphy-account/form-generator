import axios from 'axios'
import { Message } from 'element-ui'
import common from './common.js'
import api from '@/api/api.js'
const  CancelToken = axios.CancelToken;
const vtshost = api.vtshost
const qs = require('qs')

// create an axios instance
const service = axios.create({
    baseURL: '', // api的base_url
    timeout: 60000 // request timeout
})
var promiseQueue =  {}
// request interceptor
service.interceptors.request.use(
    config => {
        if (config.method === 'get') {
            // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
            config.paramsSerializer = function(params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }
        // 处理url
        var url = config.url
        // 多次请求同一个接口，则取消上一个接口请求
        let requestName 
        if(config.params && config.params.requestName){
            requestName = config.params.requestName
        }
        if(config.data && config.data.requestName){
            requestName = config.data.requestName
        }
        if(requestName){
            // console.log('promiseQueue[requestName]',promiseQueue);
            if(promiseQueue[requestName] && promiseQueue[requestName].cancel){
                promiseQueue[requestName].cancel.call(null,'cancel')
            }
            config.cancelToken = new CancelToken(c => {
                promiseQueue[requestName] = {}
                promiseQueue[requestName].cancel = c
            })
        }   
        const Token = common.getUrlKey('token') || sessionStorage.getItem('TOKEN')
        // 处理请求本地localhost的键盘精灵webapi
        if(url.startsWith("http://localhost:48899") || url.startsWith(vtshost)){
            config.url = url
            return config
        }
        else if (Token) {
            url = common.addUrlParm(url, 'token', Token)
        }
        config.url = url
        // console.log('ajax:', config)
        return config
    },
    error => {
        // Do something with request error
        Promise.reject(error)
    }
)

// respone interceptor
service.interceptors.response.use(
    response => {
        // 根据http状态码判断请求
        if (response.status === 200) {
            return response.data
        }
        if (response.status === 204) {
            return Promise.reject(204)
        }
        console.log('response:', response)
        const res = response.data
        return Promise.reject(res.resultMsg)
    },
    error => {
        console.log('error.response:', error.response)
        var data = error.response && error.response.data

        // console.log('error.data1:', data, typeof data)
        if (typeof data === 'object') {
            var view = new DataView(data)
            data = decodeURI(escape(String.fromCharCode.apply(null, new Uint8Array(view.buffer))))
            error.response.data = data
        }
        // console.log('error.data2:', data, typeof data)
        var error_msg = ''
        if (typeof data === 'string') {
            error_msg = data.indexOf('|') === -1 ? data : data.substr(0, data.indexOf('|'))
        }
        // console.log('error_msg:', error_msg) // for debug
        /**触发了CancelToken的跳过报错提示 */
        if(!axios.isCancel(error)){
            Message({
                message: error_msg,
                type: 'error'
            })
        }   
        return Promise.reject(error)
    }
)

export default service
