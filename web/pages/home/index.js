/**
 * home
 */

import Vue from 'vue';
import ElementUI from 'element-ui';

import Breadcrumb from '@/components/breadcrumb.vue';
import ProjectSelect from '@/components/project_select.vue';

import App from './app.vue';
import router from './router';
import './index.scss';

Vue.use(ElementUI);

Vue.component('db-breadcrumb', Breadcrumb);
Vue.component('tk-project-select', ProjectSelect);

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
