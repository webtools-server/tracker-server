/**
 * login
 */

import Vue from 'vue';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-default/index.css';
import './index.scss';

import App from './app.vue';

Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount('#app');
