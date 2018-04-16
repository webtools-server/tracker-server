/**
 * 路由
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import Abstract from './modules/common/abstract.vue';
import NotFound from './modules/common/404.vue';
import Help from './modules/help/index.vue';

import ErrorDetailComp from './modules/error/detail.vue';
import ApiStatComp from './modules/api/stat.vue';
import ApiDetailComp from './modules/api/detail.vue';
import PerfDetailComp from './modules/perf/detail.vue';

import Dashboard from './modules/dashboard/index.vue';

import ProjectList from './modules/project/list.vue';
import ProjectCreate from './modules/project/create.vue';
import ProjectAlert from './modules/project/alert.vue';
import ProjectAlertLog from './modules/project/alert_log.vue';
import ProjectDefaultAlert from './modules/project/default_rule.vue';

import UserList from './modules/user/list.vue';
import UserCreate from './modules/user/create.vue';
import UserChangePwd from './modules/user/changepwd.vue';

Vue.use(VueRouter);

const root = Vue.component('root', {
  template: '<router-view></router-view>'
});

const defaultImgUrl = 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg';

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
            hidden: true,
            component: ProjectCreate,
            imgUrl: defaultImgUrl
          },
          {
            path: 'list',
            component: ProjectList,
            name: 'projectList',
            title: '项目列表',
            imgUrl: defaultImgUrl
          },
          {
            path: 'defaultRule',
            component: ProjectDefaultAlert,
            name: 'ProjectDefaultAlert',
            title: '默认规则',
            imgUrl: defaultImgUrl
          },
          {
            path: 'log',
            component: ProjectAlertLog,
            name: 'projectAlertLog',
            title: '告警日志',
            imgUrl: defaultImgUrl
          },
          {
            path: 'alert/:pid',
            component: ProjectAlert,
            name: 'projectAlert',
            title: '告警',
            hidden: true,
            imgUrl: defaultImgUrl
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
            imgUrl: defaultImgUrl
          },
          {
            path: 'edit/:id',
            name: 'userEdit',
            title: '编辑',
            component: UserCreate,
            hidden: true,
            imgUrl: defaultImgUrl
          },
          {
            path: 'list',
            component: UserList,
            name: 'userList',
            title: '列表',
            imgUrl: defaultImgUrl
          },
          {
            path: 'changepwd/:id',
            component: UserChangePwd,
            name: 'UserChangePwd',
            title: '修改密码',
            hidden: true,
            imgUrl: defaultImgUrl
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
          //   imgUrl: defaultImgUrl
          // },
          {
            path: 'detail',
            name: 'errorDetail',
            title: '明细',
            component: ErrorDetailComp,
            imgUrl: defaultImgUrl
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
            imgUrl: defaultImgUrl
          },
          {
            path: 'detail',
            name: 'apiDetail',
            title: '明细',
            component: ApiDetailComp,
            imgUrl: defaultImgUrl
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
          //   imgUrl: defaultImgUrl
          // },
          {
            path: 'detail',
            name: 'perfDetail',
            title: '明细',
            component: PerfDetailComp,
            imgUrl: defaultImgUrl
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

const router = new VueRouter({
  routes,
  mode: 'hash',
  linkActiveClass: 'active'
});

export default router;
