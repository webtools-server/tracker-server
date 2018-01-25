<template>
  <div class="project-alert">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner">
      <div class="desc-list">
        <div class="desc-list-title">项目信息：</div>
        <el-row>
          <el-col :span="12">
            <span>产品ID：</span><span>{{projectData.pid}}</span>
          </el-col>
          <el-col :span="12">
            <span>产品名称：</span><span>{{projectData.title}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="el-divider"></div>
      <div class="desc-list">
        <div class="desc-list-title">规则配置：<el-button type="success" size="mini" @click="handleAddRule">添加规则</el-button></div>
        <el-row>
          <el-col :span="24">
            <alert-rule-list
              :lists="tableData"
              @edit="handleAlertRuleListEdit"
              @delete="handleAlertRuleListDelete"
            ></alert-rule-list>
          </el-col>
        </el-row>
      </div>
      <div class="el-divider"></div>
      <div class="desc-list">
        <div class="desc-list-title">联系人：</div>
        <el-row>
          <el-col :span="5">
            <el-select
              v-model="alertUser"
              multiple
              filterable
              remote
              placeholder="请输入用户名"
              :loading="loading">
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAlertUserSubmit">保存</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- dialog -->
    <alert-rule-dialog
      :visible="dialogRuleVisible"
      :isCreate="isCreate"
      :rule="ruleForm"
      :project="projectData"
      @close="dialogRuleVisible = false"
      @post="handleDialogPost"
    ></alert-rule-dialog>
  </div>
</template>

<script>
import * as api from '../../api';
import AlertRuleDialog from 'components/alert_rule/dialog.vue';
import AlertRuleList from 'components/alert_rule/list.vue';

export default {
  components: {
    AlertRuleDialog,
    AlertRuleList
  },
  data() {
    return {
      dialogRuleVisible: false,
      projectData: {
        pid: '',
        title: ''
      },
      ruleForm: {
        type: '',
        title: '',
        fieldName: '',
        fieldAction: '',
        fieldValue: '',
        statType: '',
        statAction: '',
        statValue: ''
      },
      rules: {
        pid: [
          { required: true, message: '请输入产品ID', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      isCreate: true,
      alertUser: [],
      userList: [],
      loading: false,
      tableData: []
    };
  },
  created() {
    const params = this.$route.params;
    const pid = params.pid;

    // 如果pid有值
    if (pid) {
      Promise.all([
        api.queryProject(pid),
        api.queryAlertRuleByPid(pid),
        api.fetchUserList({ all: 666 })
      ]).then((res) => {
        const project = res[0];
        const alertRule = res[1];
        const userList = res[2];

        if (project.code !== 0) {
          this.showErrorMsg(project.msg);
          return;
        }

        if (alertRule.code !== 0) {
          this.showErrorMsg(alertRule.msg);
          return;
        }

        if (userList.code !== 0) {
          this.showErrorMsg(userList.msg);
          return;
        }
        // 项目
        this.projectData.pid = project.data.pid;
        this.projectData.title = project.data.title;
        // 告警列表
        const alertUser = project.data.alert_user ? project.data.alert_user.split(',') : [];
        this.alertUser = alertUser.map(u => parseInt(u, 10));
        // 告警规则列表
        this.tableData = alertRule.data;
        // 用户列表
        this.userList = userList.data.list.map((item) => {
          return {
            label: item.username,
            value: item.id
          };
        });
      });

      this.fetchAlertRuleList(params.pid);
    } else {
      this.showErrorMsg('项目ID不存在');
    }
  },
  methods: {
    showErrorMsg(msg) {
      this.$message({ message: msg, type: 'error' });
      this.$router.push({ path: '/project/list' });
    },

    /**
     * 查询告警规则
     * @param {String} pid
     */
    fetchAlertRuleList(pid) {
      api.queryAlertRuleByPid(pid).then((res) => {
        if (res.code !== 0) {
          this.showErrorMsg(res.msg);
          return;
        }
        this.tableData = res.data;
      });
    },

    /**
     * 添加规则按钮
     */
    handleAddRule() {
      const ruleForm = {};
      this.isCreate = true;
      Object.keys(this.ruleForm).forEach(rule => ruleForm[rule] = '');
      this.ruleForm = ruleForm;
      this.dialogRuleVisible = true;
    },

    /**
     * dialog提交
     */
    handleDialogPost(data, isCreate) {
      const pid = this.projectData.pid;
      const apiMethod = isCreate ? api.createAlertRule(data) : api.saveAlertRule(data.id, data);

      Object.assign(data, { pid });
      apiMethod.then((res) => {
        if (res.code === 0) {
          this.$message({ message: '提交成功', type: 'success' });
          this.fetchAlertRuleList(pid);
          this.dialogRuleVisible = false;
        } else {
          this.$message({ message: res.msg, type: 'error' });
        }
      });
    },

    /**
     * 告警规则列表编辑
     */
    handleAlertRuleListEdit(index, row) {
      this.isCreate = false;
      // form
      this.ruleForm = {
        id: row.id,
        type: row.type.toString(),
        title: row.title,
        fieldName: row.field_name.toString(),
        fieldAction: row.field_action.toString(),
        fieldValue: row.field_value,
        statType: row.stat_type.toString(),
        statAction: row.stat_action.toString(),
        statValue: row.stat_value
      };
      // dialog visible
      this.dialogRuleVisible = true;
    },

    /**
     * 告警规则列表删除
     */
    handleAlertRuleListDelete(index, row) {
      api.deleteAlertRule(row.id).then((res) => {
        if (res.code !== 0) {
          this.$message({ message: res.msg, type: 'error' });
        } else {
          this.fetchAlertRuleList(this.projectData.pid);
        }
      });
    },

    /**
     * 告警联系人
     */
    handleAlertUserSubmit() {
      api.saveAlertRuleUser(this.projectData.pid, {
        alertUser: this.alertUser.join(',')
      }).then((res) => {
        if (res.code !== 0) {
          this.showErrorMsg(res.msg);
        } else {
          this.$message({ message: '提交成功', type: 'success' });
        }
      });
    }
  },
  computed: {

  }
};
</script>

<style lang="scss" scoped>
.project-alert {
  .el-divider {
    position: relative;
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    background-color: #e8e8e8;
  }

  .desc-list {
    margin-bottom: 24px;

    .desc-list-title {
      font-size: 16px;
      color: rgba(0,0,0,.85);
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
}
</style>
