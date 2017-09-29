/**
 * 路由
 */

import Vue from 'vue';
import Abstract from 'routes/common/abstract.vue';
import NotFound from 'routes/common/404.vue';
import Help from 'routes/help/index.vue';

import ErrorComp from 'routes/list/error.vue';
import Dashboard from 'routes/dashboard/index.vue';

const root = Vue.component('root', {
  template: '<router-view></router-view>'
});

const routes = [
  {
    path: '/404',
    component: NotFound,
    name: '404'
  },
  {
    path: '/',
    component: root,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: '仪表盘',
        iconClass: 'el-icon-view'
      },
      {
        path: 'list',
        component: Abstract,
        name: '数据列表',
        iconClass: 'el-icon-document',
        children: [
          {
            path: 'error',
            name: '错误',
            component: ErrorComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          // {
          //   path: 'api',
          //   name: '接口',
          //   component: NotFound,
          //   imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          // },
          // {
          //   path: 'perf',
          //   name: '性能',
          //   component: NotFound,
          //   imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          // }
        ]
      },
      {
        path: 'help',
        component: Help,
        name: '帮助',
        iconClass: 'el-icon-information'
      }
    ]
  },
  {
    path: '*',
    redirect: { path: '/404' }
  }
];
const menuCount = routes.length;
routes[menuCount - 2].children.forEach((route) => {
  if (route.children) {
    if (!route.meta) route.meta = {};
    route.meta.children = route.children;
  }
});

export default routes;
