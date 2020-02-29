import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';

import "ant-design-vue/dist/antd.css";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  // Icon,
  InputNumber,
  // message,
  Row,
  Table,
  Tabs
} from 'ant-design-vue'

// Vue.prototype.$message = message;
// axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.baseURL = "http://49.233.132.179:5000";
Vue.prototype.$axios = axios;

Vue.use(Button);
Vue.use(Card);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(Divider);
// Vue.use(Icon);
Vue.use(InputNumber);
Vue.use(Row);
Vue.use(Table);
Vue.use(Tabs);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
