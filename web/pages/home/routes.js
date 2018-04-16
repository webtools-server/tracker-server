/**
 * 路由
 */

import Vue from 'vue';
import Abstract from 'routes/common/abstract.vue';
import NotFound from 'routes/common/404.vue';
import Help from 'routes/help/index.vue';

import ErrorDetailComp from 'routes/error/detail.vue';
import ApiStatComp from 'routes/api/stat.vue';
import ApiDetailComp from 'routes/api/detail.vue';
import PerfDetailComp from 'routes/perf/detail.vue';

import Dashboard from 'routes/dashboard/index.vue';

import ProjectList from 'routes/project/list.vue';
import ProjectCreate from 'routes/project/create.vue';
import ProjectAlert from 'routes/project/alert.vue';
import ProjectAlertLog from 'routes/project/alert_log.vue';

import UserList from 'routes/user/list.vue';
import UserCreate from 'routes/user/create.vue';
import UserChangePwd from 'routes/user/changepwd.vue';

const root = Vue.component('root', {
  template: '<router-view></router-view>'
});

const routes = [
  {
    path: '/404',
    component: NotFound,
    name: '404',
    title: '404'
  },
  {
    path: '/',
    component: root,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'dashboard',
        title: '仪表盘',
        iconClass: 'el-icon-fa-tachometer'
      },
      {
        path: 'project',
        component: Abstract,
        name: 'project',
        title: '项目',
        iconClass: 'el-icon-fa-product-hunt',
        children: [
          {
            path: 'create',
            name: 'projectCreate',
            title: '新建/编辑',
            component: ProjectCreate,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'list',
            component: ProjectList,
            name: 'projectList',
            title: '列表',
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'log',
            component: ProjectAlertLog,
            name: 'projectAlertLog',
            title: '告警日志',
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'alert/:pid',
            component: ProjectAlert,
            name: 'projectAlert',
            title: '告警',
            hidden: true,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'user',
        component: Abstract,
        name: 'user',
        title: '用户',
        iconClass: 'el-icon-fa-user-circle-o',
        children: [
          {
            path: 'create',
            name: 'userCreate',
            title: '新建',
            component: UserCreate,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'edit/:id',
            name: 'userEdit',
            title: '编辑',
            component: UserCreate,
            hidden: true,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'list',
            component: UserList,
            name: 'userList',
            title: '列表',
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'changepwd/:id',
            component: UserChangePwd,
            name: 'UserChangePwd',
            title: '修改密码',
            hidden: true,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'error',
        component: Abstract,
        name: 'error',
        title: '错误',
        iconClass: 'el-icon-fa-exclamation-circle',
        children: [
          // {
          //   path: 'stat',
          //   name: 'errorStat',
          //   title: '统计',
          //   component: ErrorStatComp,
          //   imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          // },
          {
            path: 'detail',
            name: 'errorDetail',
            title: '明细',
            component: ErrorDetailComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'api',
        component: Abstract,
        name: 'api',
        title: '接口',
        iconClass: 'el-icon-fa-database',
        children: [
          {
            path: 'stat',
            name: 'apiStat',
            title: '统计',
            component: ApiStatComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          },
          {
            path: 'detail',
            name: 'apiDetail',
            title: '明细',
            component: ApiDetailComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'perf',
        component: Abstract,
        name: 'perf',
        title: '性能',
        iconClass: 'el-icon-fa-percent',
        children: [
          // {
          //   path: 'stat',
          //   name: 'perfStat',
          //   title: '统计',
          //   component: PerfStatComp,
          //   imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          // },
          {
            path: 'detail',
            name: 'perfDetail',
            title: '明细',
            component: PerfDetailComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'help',
        component: Help,
        name: 'help',
        title: '帮助',
        iconClass: 'el-icon-fa-question-circle'
      }
    ]
  },
  {
    path: '*',
    redirect: { path: '/404' }
  }
];

const menuCount = routes.length;

addMetaTitle(routes);
routes[menuCount - 2].children.forEach((route) => {
  if (route.children) {
    if (!route.meta) route.meta = {};
    route.meta.children = route.children;
  }
});

function addMetaTitle(arr) {
  if (Array.isArray(arr)) {
    arr.forEach((a) => {
      if (!a.meta) a.meta = {};
      if (a.title) a.meta.title = a.title;
      if (Array.isArray(a.children)) addMetaTitle(a.children);
    });
  }
}

export default routes;
