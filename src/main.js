import Vue from 'vue'
import App from './App.vue'

import TreeView from "vue-json-tree-view"
import { LayoutPlugin } from 'bootstrap-vue'
import { VBModal, ModalPlugin, BButton } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false
Vue.use(LayoutPlugin)
Vue.use(ModalPlugin)
Vue.use(TreeView)
Vue.component('b-button', BButton)
Vue.directive('b-modal', VBModal)

new Vue({
  render: h => h(App),
}).$mount('#app')
