import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import axios from 'axios'
import Tinymce from '@/components/tinymce/index.vue'
import test from '@/components/test/index.vue'
import RwCardTitle from '@/components/RwCardTitle/index.vue'
import RWEchart from '@/components/RWEchart/index.vue'
Vue.component('RWEchart', RWEchart)
Vue.component('RwCardTitle', RwCardTitle)
Vue.component('test', test)
Vue.component('tinymce', Tinymce)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
