<template>
  <div id="big-form">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner" @keyup.enter="handleSubmit">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item label="用户名">
          <span>{{userInfo.username}}</span>
        </el-form-item>
        <el-form-item label="原始密码" prop="oldPassword">
           <el-input type="password" placeholder="请输入原始密码" v-model="form.oldPassword"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="password">
           <el-input type="password" placeholder="请输入新密码" v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="repeatPassword">
           <el-input type="password" placeholder="请再次输入新密码" v-model="form.repeatPassword"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import * as api from '../../api';

export default {
  data() {
    return {
      userInfo: {
        username: ''
      },
      form: {
        oldPassword: '',
        password: '',
        repeatPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          { pattern: /^\w{6,20}$/, message: '6-20个字符，必须为字母和数字组成', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\w{6,20}$/, message: '6-20个字符，必须为字母和数字组成', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else {
                if (this.form.repeatPassword !== '') {
                  this.$refs.form.validateField('repeatPassword');
                }
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        repeatPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { pattern: /^\w{6,20}$/, message: '6-20个字符，必须为字母和数字组成', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入新密码'));
              } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    const params = this.$route.params;
    if (params.id) {
      api.queryUser(params.id).then((res) => {
        if (res.code !== 0) {
          this.$message({ message: res.msg, type: 'error' });
          this.$router.push({ path: '/user/list' });
        } else {
          this.userInfo = res.data;
        }
      });
    }
  },
  methods: {
    // event
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        } else {
          api.changePwd(this.$route.params.id, this.form).then((res) => {
            if (res.code === 0) {
              this.$message({ message: '提交成功', type: 'success' });
              this.$router.push({ path: '/user/list' });
            } else {
              this.$message({ message: res.msg, type: 'error' });
            }
          });
        }
      });
    }
  },
  computed: {

  }
};
</script>

<style lang="scss" scoped>
#big-form {
  .el-form {
    width: 400px;
  }
}
</style>
