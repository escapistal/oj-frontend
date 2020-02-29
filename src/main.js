import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import 'toastr/build/toastr.css'
import toastr from 'toastr'
toastr.options.positionClass="toast-top-center"
toastr.options.timeOut = 1800;
toastr.options.hideDuration=300;
Object.defineProperty(Vue.prototype, '$toastr', {value: toastr});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
