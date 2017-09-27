import Vue from 'vue';
import Abstract from 'routes/common/abstract.vue';
import NotFound from 'routes/common/404.vue';

// list with filters page
import ErrorComp from 'routes/list/error.vue';
import BigForm from 'routes/form/big-form.vue';
import Login from 'routes/login/login.vue';
import chart from 'routes/chart/chart.vue';

const root = Vue.component('root', {
  template: '<router-view></router-view>'
});

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: root,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'chart',
        component: chart,
        name: '仪表盘',
        iconClass: 'el-icon-document'
      },
      {
        path: 'list',
        component: Abstract,
        name: '数据列表',
        iconClass: 'el-icon-message',
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
            component: ErrorComp,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'help',
        component: chart,
        name: '帮助',
        iconClass: 'el-icon-document'
      },
      // {
      //   path: 'form',
      //   component: Abstract,
      //   name: '表单',
      //   iconClass: 'el-icon-document',
      //   children: [
      //     {
      //       path: 'big-form',
      //       name: '简历管理',
      //       component: BigForm,
      //       imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
      //     }
      //   ]
      // }
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
