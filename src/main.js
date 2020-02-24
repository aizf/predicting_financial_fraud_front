import Vue from 'vue'
import App from './App.vue'
// import axios from 'axios';

import "ant-design-vue/dist/antd.css";
import {
  Button,
  Checkbox,
  // Col,
  Divider,
  // Icon,
  InputNumber,
  // message,
  // Row
  Table
} from 'ant-design-vue'

// Vue.prototype.$message = message;
// Vue.prototype.$axios = axios;

Vue.use(Button);
Vue.use(Checkbox);
// Vue.use(Col);
Vue.use(Divider);
// Vue.use(Icon);
Vue.use(InputNumber);
// Vue.use(Row);
Vue.use(Table);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
