<template>
  <div id="big-form">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner" @keyup.enter="handleSubmit">
      <el-form :rules="rules" ref="form" :model="form" label-width="140px">
        <el-form-item label="产品ID：" prop="pid">
          <el-input :disabled="!isCreate" placeholder="请输入产品ID" v-model="form.pid"></el-input>
        </el-form-item>

        <el-form-item label="产品名称：" prop="title">
          <el-input placeholder="请输入产品名称" v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="超时响应时间：" prop="apiThreshold">
          <el-input placeholder="请输入超时响应时间(ms)" v-model="form.apiThreshold"></el-input>
        </el-form-item>

        <el-form-item label="最慢响应时间：" prop="slowResponseTime">
          <el-input placeholder="请输入最慢响应时间(ms)" v-model="form.slowResponseTime"></el-input>
        </el-form-item>

        <el-form-item v-if="isCreate" label="告警规则：" prop="alertRule">
          <el-checkbox-group v-model="form.defaultAlertRule">
            <el-checkbox
              v-for="(item, index) in defaultRules"
              :label="item.id"
              :key="index"
            >{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import * as api from '@/api';

const API_THRESHOLD = 3000;
const SLOW_RESPONSE_TIME = 10000;

export default {
  data() {
    return {
      checkList: ['a', 'c'],
      form: {
        pid: '',
        title: '',
        apiThreshold: API_THRESHOLD,
        slowResponseTime: SLOW_RESPONSE_TIME,
        defaultAlertRule: []
      },
      defaultRules: [],
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
      Promise.all([
        api.queryDefaultRule(),
        api.queryProject(qs.pid)
      ]).then((result) => {
        const rules = result[0];
        const project = result[1];

        if (rules.code === 0) {
          this.defaultRules = rules.data;
        }

        if (project.code === 0) {
          const resData = project.data;

          this.form.pid = resData.pid;
          this.form.title = resData.title;
          this.form.apiThreshold = resData.api_threshold;
          this.form.slowResponseTime = resData.slow_response_time;
          this.form.defaultAlertRule = resData.default_alert_rule ? resData.default_alert_rule.split(',').map(rule => parseInt(rule, 10)) : [];
        } else {
          this.$message({ message: res.msg, type: 'error' });
          this.$router.push({ path: '/project/list' });
        }
      });
    } else {
      api.queryDefaultRule().then((res) => {
        if (res.code === 0) {
          this.defaultRules = res.data;
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
          const formData = Object.assign({}, this.form, {
            defaultAlertRule: (this.form.defaultAlertRule || []).join(',') // 处理下aletRule
          });
          const apiMethod = qs.pid ? api.saveProject(qs.pid, formData) : api.createProject(formData);

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
    width: 500px;
  }
}
</style>
