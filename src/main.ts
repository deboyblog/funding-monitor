import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Icon, Button, message } from "ant-design-vue";
Vue.config.productionTip = false;

Vue.use(Icon);
Vue.use(Button);
// 消息提醒
Vue.prototype.$message = message;
const app = new Vue({
  router,
  store,
  render: h => h(App)
});
app.$mount("#app");
