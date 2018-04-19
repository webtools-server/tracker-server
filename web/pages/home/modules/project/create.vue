<template>
  <div id="big-form">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner" @keyup.enter="handleSubmit">
      <el-form :rules="rules" ref="form" :model="form" label-width="140px">
        <el-form-item label="产品ID：" prop="pid">
          <el-input :disabled="!isCreate" placeholder="请输入产品ID" v-model="form.pid"></el-input>
          <dl class="product-tips" v-if="isCreate">
            <dt class="product-tips__title">命名规范：</dt>
            <dd class="product-tips__item">活动：act_[name]_[date]，例如：act_invite_201804</dd>
            <dd class="product-tips__item">产品：product_[name]_[date]，date可选，例如：product_baina</dd>
            <dd class="product-tips__item">其他：web_[name]_[date]，date可选，例如：web_risk</dd>
          </dl>
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

        <el-form-item label="联系人：" prop="alertUser">
          <el-select
            v-model="form.alertUser"
            multiple
            filterable
            remote
            placeholder="请输入用户名">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        defaultAlertRule: [],
        alertUser: []
      },
      defaultRules: [],
      userList: [],
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
    let it = [];

    // 如果pid有值，则是编辑
    if (qs.pid) {
      this.isCreate = false;
      it = [
        api.queryDefaultRule(),
        api.fetchUserList({ all: 666 }),
        api.queryProject(qs.pid)
      ];
    } else {
      it = [
        api.queryDefaultRule(),
        api.fetchUserList({ all: 666 })
      ];
    }

    Promise.all(it).then((result) => {
      const rules = result[0] || {};
      const userList = result[1] || {};
      const project = result[2];

      if (rules.code === 0) {
        this.defaultRules = rules.data;
      }

      if (userList.code === 0) {
        this.userList = userList.data.list.map((item) => {
          return {
            label: item.username,
            value: item.id
          };
        });
      }

      if (project) {
        if (project.code === 0) {
          const resData = project.data;

          this.form.pid = resData.pid;
          this.form.title = resData.title;
          this.form.apiThreshold = resData.api_threshold;
          this.form.slowResponseTime = resData.slow_response_time;
          this.form.defaultAlertRule = resData.default_alert_rule ? resData.default_alert_rule.split(',').map(rule => parseInt(rule, 10)) : [];
          this.form.alertUser = resData.alert_user ? resData.alert_user.split(',').map(user => parseInt(user, 10)) : [];
        } else {
          this.$message({ message: project.msg, type: 'error' });
          this.$router.push({ path: '/project/list' });
        }
      }
    });
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
            defaultAlertRule: (this.form.defaultAlertRule || []).join(','), // 处理下aletRule
            alertUser: (this.form.alertUser || []).join(',') // 处理下alertUser
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
    width: 600px;
  }
}

.db-content-inner {
  .el-checkbox {
    margin-right: 15px;
  }

  .el-checkbox+.el-checkbox {
    margin-left: 0;
    margin-right: 15px;
  }
}

.product-tips {
  font-size: 12px;
  color: #999;
  line-height: 1;
}

.product-tips__title {
  margin-bottom: 8px;
  font-weight: bold;
}

.product-tips__item {
  margin-bottom: 8px;
  margin-left: 10px;
}
</style>
