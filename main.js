// #ifndef VUE3
import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false

App.mpType = 'app'
console.log("no VUE3");
const app = new Vue({
    ...App
})
app.$mount()
// #endif
// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
App.mpType = 'app';
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif