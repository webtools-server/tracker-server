<template>
  <div class="project-alert">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner">
      <div class="desc-list">
        <div class="desc-list-title">内置规则列表：<el-button type="success" size="mini" @click="handleAddRule">添加规则</el-button></div>
        <el-row>
          <el-col :span="24">
            <alert-rule-list
              :lists="tableData"
              :fields="fields"
              @edit="handleDefaultRuleListEdit"
              @delete="handleDefaultRuleListDelete"
            ></alert-rule-list>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- dialog -->
    <alert-rule-dialog
      :visible="dialogRuleVisible"
      :isCreate="isCreate"
      :rule="ruleForm"
      :fields="fields"
      @close="dialogRuleVisible = false"
      @post="handleDialogPost"
    ></alert-rule-dialog>
  </div>
</template>

<script>
import * as api from '@/api';
import AlertRuleDialog from '@/components/alert_rule/dialog.vue';
import AlertRuleList from '@/components/alert_rule/list.vue';

export default {
  components: {
    AlertRuleDialog,
    AlertRuleList
  },
  data() {
    return {
      dialogRuleVisible: false,
      fields: {},
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
      isCreate: true,
      loading: false,
      tableData: []
    };
  },
  created() {
    Promise.all([
      api.getFields(),
      api.queryDefaultRule()
    ]).then((res) => {
      const fields = res[0];
      const defaultRule = res[1];

      if (fields.code !== 0) {
        this.showErrorMsg(fields.msg);
        return;
      }

      if (defaultRule.code !== 0) {
        this.showErrorMsg(defaultRule.msg);
        return;
      }

      // 字段数据
      this.fields = fields.data;
      // 告警规则列表
      this.tableData = defaultRule.data;
    });

    this.fetchDefaultRuleList();
  },
  methods: {
    showErrorMsg(msg) {
      this.$message({ message: msg, type: 'error' });
    },

    /**
     * 查询告警规则
     */
    fetchDefaultRuleList() {
      api.queryDefaultRule().then((res) => {
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
      const apiMethod = isCreate ? api.createDefaultRule(data) : api.saveDefaultRule(data.id, data);
      apiMethod.then((res) => {
        if (res.code === 0) {
          this.$message({ message: '提交成功', type: 'success' });
          this.fetchDefaultRuleList();
          this.dialogRuleVisible = false;
        } else {
          this.$message({ message: res.msg, type: 'error' });
        }
      });
    },

    /**
     * 告警规则列表编辑
     */
    handleDefaultRuleListEdit(index, row) {
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
    handleDefaultRuleListDelete(index, row) {
      api.deleteDefaultRule(row.id).then((res) => {
        if (res.code !== 0) {
          this.$message({ message: res.msg, type: 'error' });
        } else {
          this.fetchDefaultRuleList();
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
