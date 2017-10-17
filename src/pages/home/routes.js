/**
 * 路由
 */

import Vue from 'vue';
import Abstract from 'routes/common/abstract.vue';
import NotFound from 'routes/common/404.vue';
import Help from 'routes/help/index.vue';

import ErrorComp from 'routes/list/error.vue';
import ApiComp from 'routes/list/api.vue';
import PerfComp from 'routes/list/perf.vue';
import Dashboard from 'routes/dashboard/index.vue';
import ProjectList from 'routes/project/list.vue';
import ProjectCreate from 'routes/project/create.vue';

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
        path: 'project',
        component: Abstract,
        name: '我的项目',
        iconClass: 'el-icon-star-off',
        children: [
          {
            path: 'create',
            name: '新建/编辑',
            component: ProjectCreate,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'list',
            component: ProjectList,
            name: '列表',
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
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
          {
            path: 'api',
            name: '接口',
            component: ApiComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'perf',
            name: '性能',
            component: PerfComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
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
