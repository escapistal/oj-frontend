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

// import katex from 'katex';
// import 'katex/dist/katex.css'
// import 'katex/contrib/auto-render/auto-render'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

import 'clipboard/dist/clipboard.js'
// import clipboard from 'clipboard';
// Vue.prototype.clipboard = clipboard;
// import VueClipboard from 'vue-clipboard2'

// Vue.use(VueClipboard)

// import ace from 'ace-builds'
// Vue.use(ace)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
