// 引入安装的signalr包
// import * as signalR from '@aspnet/signalr'
import * as signalR from '@microsoft/signalr'
import common from './common.js'
import api from '@/api/api.js'
const host = api.host
// const negotiateHost = 'http://10.1.49.28:5003'// 调试地址
const negotiateHost = 'http://10.1.241.98:5003' // 测试地址
var token = common.getUrlKey('token')
const signal = new signalR.HubConnectionBuilder().withUrl(negotiateHost + '/notifyHub?token=' + token, {
  // accessTokenFactory: () => token
}).build()

/* const signalr = function () {
  var hub
  if (hub === undefined) {
    hub = signal
  }
  return hub
} */

//  自动重连
async function start() {
  try {
    await signal.start()
    console.log('connected')
  } catch (err) {
    console.log(err)
    setTimeout(() => start(), 5000)
  }
}

signal.onclose(async () => {
  await start()
})

// 将创建的signal赋值给Vue实例
export default {
  // install方法的第一个参数是 Vue 构造器， 第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.signalr = signal
  }
}