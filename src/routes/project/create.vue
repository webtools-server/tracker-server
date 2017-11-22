<template>
  <div id="big-form">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner" @keyup.enter="handleSubmit">
      <el-form :rules="rules" ref="form" :model="form" label-width="100px">
        <el-form-item label="产品ID" prop="pid">
           <el-input :disabled="!isCreate" placeholder="请输入产品ID" v-model="form.pid"></el-input>
        </el-form-item>

        <el-form-item label="产品名称" prop="title">
           <el-input placeholder="请输入产品名称" v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="超时响应时间" prop="apiThreshold">
           <el-input placeholder="请输入超时响应时间(ms)" v-model="form.apiThreshold"></el-input>
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

const API_THRESHOLD = 3000;

export default {
  data() {
    return {
      form: {
        pid: '',
        title: '',
        apiThreshold: API_THRESHOLD
      },
      rules: {
        pid: [
          { required: true, message: '请输入产品ID', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      isCreate: true
    };
  },
  created() {
    const qs = this.$route.query;

    // 如果pid有值，则是编辑
    if (qs.pid) {
      this.isCreate = false;
      api.queryProject(qs.pid).then((res) => {
        if (res.code !== 0) {
          this.$message({ message: res.msg, type: 'error' });
          this.$router.push({ path: '/project/list' });
        } else {
          const resData = res.data;

          this.form.pid = resData.pid;
          this.form.title = resData.title;
          this.form.apiThreshold = resData.api_threshold;
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
          const qs = this.$route.query;
          const apiMethod = qs.pid ? api.saveProject(qs.pid, this.form) : api.createProject(this.form);

          apiMethod.then((res) => {
            if (res.code === 0) {
              this.$message({ message: '提交成功', type: 'success' });
              this.$router.push({ path: '/project/list' });
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
