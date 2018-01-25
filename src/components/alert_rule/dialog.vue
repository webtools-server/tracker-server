<template>
  <el-dialog class="dialog-alert-rule" :title="isCreate ? '添加规则' : '编辑规则'" v-model="visible" :close-on-click-modal="false" :show-close="false">
    <el-form :rules="validRules" :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="规则名称" prop="title">
        <el-input v-model="ruleForm.title" auto-complete="off" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则类型" prop="type">
        <el-select v-model="ruleForm.type" clearable placeholder="请选择">
          <el-option v-for="item in ruleType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段名称" prop="fieldName">
        <el-select v-model="ruleForm.fieldName" clearable placeholder="请选择">
          <el-option class="clearfix" v-for="item in fieldsName" :key="item.value" :label="item.label" :value="item.value">
            <span class="ui-fl-l">{{item.label}}</span>
            <span class="ui-fl-r field-value">{{item.value}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段运算" prop="fieldAction">
        <el-select v-model="ruleForm.fieldAction" clearable placeholder="请选择">
          <el-option v-for="item in fieldsAction" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段值" prop="fieldValue">
        <el-input v-model="ruleForm.fieldValue" auto-complete="off" placeholder="请输入字段值"></el-input>
      </el-form-item>
      <el-form-item label="统计类型" prop="statType">
        <el-select v-model="ruleForm.statType" clearable placeholder="请选择">
          <el-option v-for="item in statType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计运算" prop="statAction">
        <el-select v-model="ruleForm.statAction" clearable placeholder="请选择">
          <el-option v-for="item in statAction" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计值" prop="statValue">
        <el-input v-model="ruleForm.statValue" auto-complete="off" placeholder="请输入统计值"></el-input>
      </el-form-item>
    </el-form>
    <div class="rule-desc">
      <span class="rule-desc-label ui-fl-l">规则描述：</span>
      <span class="rule-desc-content ui-fl-l">
        <span class="color-ff0000">{{project.pid}}</span>
        <span>的</span>
        <span class="color-ff0000">{{fieldRuleType[ruleForm.type] || '{type}'}}</span>
        <span>上报记录中</span>
        <span class="color-ff0000">
          {{fieldFieldsName[ruleForm.fieldName] || '{fieldName}'}}
          {{fieldFieldsAction[ruleForm.fieldAction] || '{fieldAction}'}}
          {{ruleForm.fieldValue || '{fieldValue}'}}
        </span>
        <span>的</span>
        <span class="color-ff0000">
          {{fieldStatType[ruleForm.statType] || '{statType}'}}
          {{fieldStatAction[ruleForm.statAction] || '{statAction}'}}
          {{ruleForm.statValue || '{statValue}'}}
        </span>
      </span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClickCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  RULE_TYPE,
  FIELDS_NAME,
  FIELDS_ACTION,
  STAT_TYPE,
  STAT_ACTION,
  fieldRuleType,
  fieldFieldsName,
  fieldFieldsAction,
  fieldStatType,
  fieldStatAction
} from './field';

// emit: close, post
// props: visible, rule
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    isCreate: {
      type: Boolean,
      default: true
    },
    rule: {
      type: Object,
      default: {}
    },
    project: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      ruleType: RULE_TYPE,
      fieldsName: FIELDS_NAME,
      fieldsAction: FIELDS_ACTION,
      statType: STAT_TYPE,
      statAction: STAT_ACTION,
      fieldRuleType,
      fieldFieldsName,
      fieldFieldsAction,
      fieldStatType,
      fieldStatAction,
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
      validRules: {
        title: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择规则类型', trigger: 'change' }
        ],
        fieldName: [
          { required: true, message: '请选择字段名称', trigger: 'change' }
        ],
        fieldAction: [
          { required: true, message: '请选择字段运算', trigger: 'change' }
        ],
        fieldValue: [
          { required: true, message: '请输入字段值', trigger: 'blur' }
        ],
        statType: [
          { required: true, message: '请选择统计类型', trigger: 'change' }
        ],
        statAction: [
          { required: true, message: '请选择统计运算', trigger: 'change' }
        ],
        statValue: [
          { required: true, message: '请输入统计值', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    Object.assign(this.ruleForm, this.rule);
  },
  methods: {
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return false;
        this.$emit('post', Object.assign({}, this.ruleForm), this.isCreate);
        this.resetValue();
      });
    },
    handleClickCancel () {
      this.$emit('close', this);
      this.resetValue();
    },
    resetValue() {
      this.$refs.ruleForm.resetFields();
      Object.keys(this.ruleForm).forEach(rule => this.ruleForm[rule] = '');
    }
  },
  watch: {
    rule(val) {
      Object.assign(this.ruleForm, val);
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-alert-rule {
  .el-form {
    width: 400px;
  }

  .el-select {
    width: 100%;
  }

  .rule-desc {
    font-weight: bold;
    overflow: hidden;
  }

  .rule-desc-label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .rule-desc-content {
    width: 480px;
  }
}
.field-value {
  color: #8492a6;
  font-size: 13px;
}
.el-select-dropdown__item.selected {
  .field-value {
    color: #fff;
  }
}
</style>
