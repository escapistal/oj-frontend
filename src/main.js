import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/axios'
import store from './store'
import 'jquery/dist/jquery.js'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'


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

import vSelectPage from 'v-selectpage'
Vue.use(vSelectPage)

import 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
jQuery.extend(true, jQuery.fn.datetimepicker.defaults, {
  icons: {
    time: 'far fa-clock',
    date: 'far fa-calendar',
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check',
    clear: 'far fa-trash-alt',
    close: 'far fa-times-circle'
  }
});


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
    "H+": this.getHours(), //小时
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
