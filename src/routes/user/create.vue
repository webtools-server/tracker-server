<template>
  <div id="big-form">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner" @keyup.enter="handleSubmit">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item label="用户名" prop="username">
           <el-input :disabled="!isCreate" placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item v-if="isCreate" label="密码" prop="password">
           <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
           <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="微信ID" prop="weixin">
           <el-input placeholder="请输入微信ID" v-model="form.weixin"></el-input>
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
      form: {
        username: '',
        password: '',
        email: '',
        weixin: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\w{6,20}$/, message: '6-20个字符，必须为字母和数字组成', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        weixin: [
          { required: true, message: '请输入微信ID', trigger: 'blur' }
        ]
      },
      isCreate: true
    };
  },
  created() {
    const params = this.$route.params;

    // 如果有ID，则是编辑
    if (params.id) {
      this.isCreate = false;
      api.queryUser(params.id).then((res) => {
        if (res.code !== 0) {
          this.$message({ message: res.msg, type: 'error' });
          this.$router.push({ path: '/user/list' });
        } else {
          const resData = res.data;

          this.form.username = resData.username;
          this.form.email = resData.email;
          this.form.weixin = resData.weixin;
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
          const params = this.$route.params;
          const apiMethod = params.id ? api.saveUser(params.id, this.form) : api.createUser(this.form);

          apiMethod.then((res) => {
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
