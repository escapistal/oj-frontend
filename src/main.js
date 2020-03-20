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

String.prototype.strip=function(maxlen){
  if(this.replace(/[\u0391-\uFFE5]/g,"aa").length>maxlen) {
    let len=0
    for (let i=0;i<this.length;i++) {
      if ((this.charCodeAt(i) & 0xff00) != 0)
        ++len
      ++len
      if(len>=maxlen) {
        return this.substr(0,i)+'...'
        break
      }
    }
  }
  return this
}


Date.prototype.format = function (fmt) {
  const o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
