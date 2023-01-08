import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./utils/rem.js";
// import VueiClient from '@supermap/vue-iclient-mapboxgl';

Vue.config.productionTip = false;
// Vue.use(VueiClient);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
