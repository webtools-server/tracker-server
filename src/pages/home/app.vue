<template>
  <section class="db">
    <template v-if="!$route.meta.hidden">
      <!-- header start  -->
      <header class="db-header">
        <router-link class="logo" :to="{path: '/'}">tracker</router-link>
        <div class="user-info" v-if="user.username">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link color-white">
              {{user.username}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="el-dropdown-link">
            <img class="avatar" :src="user.avatar">
          </span>
        </div>
      </header>
      <!-- header end  -->

      <!-- body start  -->
      <div class="db-body">

        <!-- menu start -->
        <aside class="db-menu-wrapper">
          <el-menu :default-active="activeMenu" theme="light" :unique-opened="uniqueOpened" class="db-menu-bar" router>
            <template v-for="(route) in $router.options.routes[$router.options.routes.length - 2].children">
              <template v-if="route.children && route.name">
                <el-submenu :index="route.name">
                  <template slot="title"><i :class="route.iconClass"></i>{{route.title}}</template>
                  <el-menu-item :index="cRoute.name" v-for="(cRoute, cIndex) in route.children" v-if="!cRoute.hidden" :route="cRoute">{{cRoute.title}}</el-menu-item>
                </el-submenu>
              </template>

              <template v-if="!route.children && route.name">
                <el-menu-item :index="route.name" :route="route"><i :class="route.iconClass"></i>{{route.title}}</el-menu-item>
              </template>
            </template>
          </el-menu>
        </aside>
        <!-- menu end -->

        <!-- content start -->
        <div class="db-content-wrapper">
          <section class="db-content">
            <router-view></router-view>
          </section>
        </div>
        <!-- content end -->
      </div>
      <!-- body end  -->
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </section>
</template>

<script>
import viewState from '../../utils/view_state';
import avatarImg from '../../assets/img/avatar.png'

export default {
  data() {
    return {
      user: {
        username: '',
        avatar: avatarImg
      },
      activeMenu: '',
      uniqueOpened: true
    };
  },
  created() {
    this.activeMenu = this.$route.name;
    this.user = Object.assign({}, this.user, viewState.user);
  },
  watch: {
    '$route'(to, from) {
      this.activeMenu = this.$route.name;
    }
  },
  methods: {
    logout() {
      this.$confirm('确定要注销吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        window.location.href = '/auth/logout';
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.db {
  .el-dropdown-menu {
    margin-top: 20px;
  }

  .avatar {
    border-radius: 50%;
  }

  .color-white {
    color: #fff;
  }

  // header
  .db-header {
    width: 100%;
    height: 60px;
    background: #324157;
    padding: 13px 20px;
    box-sizing: border-box;
    color: #ffffff;
    z-index: 99;
    position: fixed;
    left: 0;
    top: 0;

    .logo{
      font-size: 2.4rem;
    }

    .user-info {
      float: right;

      img {
        width: 25px;
        height: 25px;
        vertical-align: -7px;
        margin: 0 0 0 10px;
        cursor: pointer;
      }
    }
  }

  // body
  .db-body {

    // menu
    .db-menu-wrapper {
      position: fixed;
      left: 0;
      top: 60px;
      background: red;
      height: 100%;
      overflow: auto;
      z-index: 98;

      .db-menu-bar {
        height: 100%;
        flex-grow: 0;
        width: 200px;
      }
    }

    // content
    .db-content-wrapper {
      width: 100%;
      z-index: 97;
      box-sizing: border-box;
      padding: 60px 0px 0px 200px;

      .db-content {
        padding: 25px;

        .db-content-inner {
          padding: 30px 0px;
        }
      }
    }
  }
}
</style>
