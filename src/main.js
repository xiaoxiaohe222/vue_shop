import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/vuex/store";

import * as API from './api/index'
import "./elementui"
import ZkTable from 'vue-table-with-tree-grid'


Vue.config.productionTip = false
Vue.prototype.$API = API;
Vue.component(ZkTable.name, ZkTable)


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
