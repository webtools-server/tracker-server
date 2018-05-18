<template>
  <el-dialog class="dialog-alert-rule" :title="isCreate ? '添加规则' : '编辑规则'" v-model="visible" :close-on-click-modal="false" :show-close="false">
    <el-form :rules="validRules" :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="规则名称" prop="title">
        <el-input v-model="ruleForm.title" auto-complete="off" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则类型" prop="type">
        <el-row>
          <el-col :span="18">
            <el-select v-model="ruleForm.type" placeholder="请选择">
              <el-option v-for="item in ruleType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-button @click="showField">字段</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 字段名称 start -->
      <el-form-item v-if="ruleForm.type === originRuleType.error.value" label="字段名称" prop="fieldName">
        <el-select v-model="ruleForm.fieldName" placeholder="请选择">
          <el-option class="clearfix" v-for="item in errorFieldsName" :key="item.value" :label="item.label" :value="item.value">
            <span class="ui-fl-l">{{item.label}}</span>
            <span class="ui-fl-r field-value">{{item.value}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.type === originRuleType.api.value" label="字段名称" prop="fieldName">
        <el-select v-model="ruleForm.fieldName" placeholder="请选择">
          <el-option class="clearfix" v-for="item in apiFieldsName" :key="item.value" :label="item.label" :value="item.value">
            <span class="ui-fl-l">{{item.label}}</span>
            <span class="ui-fl-r field-value">{{item.value}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.type === originRuleType.perf.value" label="字段名称" prop="fieldName">
        <el-select v-model="ruleForm.fieldName" placeholder="请选择">
          <el-option class="clearfix" v-for="item in perfFieldsName" :key="item.value" :label="item.label" :value="item.value">
            <span class="ui-fl-l">{{item.label}}</span>
            <span class="ui-fl-r field-value">{{item.value}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最近N分钟" prop="minutes">
        <el-input v-model="ruleForm.minutes" auto-complete="off" placeholder="输入最近N分钟"></el-input>
      </el-form-item>
      <!-- 字段名称 end -->
      <el-form-item label="字段运算" prop="fieldAction">
        <el-select v-model="ruleForm.fieldAction" placeholder="请选择">
          <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段值" prop="fieldValue">
        <el-input v-model="ruleForm.fieldValue" auto-complete="off" placeholder="请输入字段值"></el-input>
      </el-form-item>
      <el-form-item label="统计类型" prop="statType">
        <el-select v-model="ruleForm.statType" placeholder="请选择">
          <el-option v-for="item in statType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计运算" prop="statAction">
        <el-select v-model="ruleForm.statAction" placeholder="请选择">
          <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计值" prop="statValue">
        <el-input v-model="ruleForm.statValue" auto-complete="off" placeholder="请输入统计值"></el-input>
      </el-form-item>
    </el-form>
    <div class="rule-desc">
      <span class="rule-desc-label ui-fl-l">规则描述：</span>
      <span class="rule-desc-content ui-fl-l">
        <template v-if="project">
          <span class="color-ff0000">{{project.pid ? project.pid : '---'}}</span>
          <span>的</span>
        </template>
        <span class="color-ff0000">{{ruleTypeLabel[ruleForm.type] || '{type}'}}</span>
        <span>上报记录中</span>
        <span class="color-ff0000">
          {{fieldsNameLabel[ruleForm.fieldName] || '{fieldName}'}}
          {{ruleActionLabel[ruleForm.fieldAction] || '{fieldAction}'}}
          {{ruleForm.fieldValue || '{fieldValue}'}}
        </span>
        <span>的</span>
        <span class="color-ff0000">
          {{statTypeLabel[ruleForm.statType] || '{statType}'}}
          {{ruleActionLabel[ruleForm.statAction] || '{statAction}'}}
          {{ruleForm.statValue || '{statValue}'}}
        </span>
      </span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClickCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from '../../api/index';
import * as util from '../../utils/util';
import syntaxHighlight from '../../utils/highlight';

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
      default: () => {}
    },
    project: {
      type: Object,
      default: () => {}
    },
    fields: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // value
      originRuleType: {
        error: {},
        api: {},
        perf: {}
      },
      ruleType: [],
      errorFieldsName: [],
      apiFieldsName: [],
      perfFieldsName: [],
      ruleAction: [],
      statType: [],
      currentFieldData: {}, // 当前类型的字段数据
      fieldsAllData: {}, // 字段数据
      // label
      ruleTypeLabel: {},
      fieldsNameLabel: {},
      errorFieldsNameLabel: {},
      apiFieldsNameLabel: {},
      perfFieldsNameLabel: {},
      ruleActionLabel: {},
      statTypeLabel: {},
      originRuleForm: {}, // 原来的ruleForm
      ruleForm: {
        type: '',
        title: '',
        minutes: '5',
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
        minutes: [
          { required: true, message: '输入最近N分钟，必须为正整数', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '必须为正整数', trigger: 'blur' }
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
    this.originRuleForm = Object.assign({}, this.ruleForm);
    this.normalizeDataByFields();
    api.getFieldsData().then((res) => {
      if (res.code === 0) {
        this.fieldsAllData = res.data;
      }
    });
    Object.assign(this.ruleForm, this.rule);
  },
  methods: {
    showField() {
      const h = this.$createElement;
      this.$msgbox({
        title: '字段详情',
        lockScroll: false,
        customClass: 'field-detail-message-box',
        message: h('pre', {
          staticClass: 'hl-pre',
          domProps: {
            innerHTML: this._s(this.highlight(this.currentFieldData))
          }
        })
      });
    },
    highlight(json) {
      return syntaxHighlight(json);
    },
    normalizeDataByFields(data) {
      const fields = data || this.fields;
      if (util.isEmptyObject(fields)) return;
      // type
      this.originRuleType = fields.type.ruleType;
      this.ruleType = this.normalizeData(this.originRuleType);
      // field
      this.errorFieldsName = this.normalizeData(fields.field.error);
      this.apiFieldsName = this.normalizeData(fields.field.api);
      this.perfFieldsName = this.normalizeData(fields.field.perf);
      // action
      this.ruleAction = this.normalizeData(fields.action);
      // statType
      this.statType = this.normalizeData(fields.type.statType);

      // get label
      this.ruleTypeLabel = util.getLabelByValue(this.ruleType);
      this.errorFieldsNameLabel = util.getLabelByValue(this.errorFieldsName);
      this.apiFieldsNameLabel = util.getLabelByValue(this.apiFieldsName);
      this.perfFieldsNameLabel = util.getLabelByValue(this.perfFieldsName);
      this.ruleActionLabel = util.getLabelByValue(this.ruleAction);
      this.statTypeLabel = util.getLabelByValue(this.statType);
    },
    normalizeData(originData) {
      return Object.keys(originData).map((d) => {
        const currentValue = originData[d];
        return {
          label: currentValue.name,
          value: currentValue.value
        };
      });
    },
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
      this.ruleForm = Object.assign({}, this.originRuleForm);
    }
  },
  watch: {
    fields(val) {
      this.normalizeDataByFields(val);
    },
    rule(val) {
      Object.assign(this.ruleForm, val);
    },
    'ruleForm.type'(val, oldVal) {
      if (oldVal) {
        this.ruleForm.fieldName = '';
      }
      switch (val) {
        case this.originRuleType.error.value:
          this.currentFieldData = this.fieldsAllData.error;
          this.fieldsNameLabel = this.errorFieldsNameLabel;
          break;
        case this.originRuleType.api.value:
          this.currentFieldData = this.fieldsAllData.api;
          this.fieldsNameLabel = this.apiFieldsNameLabel;
          break;
        case this.originRuleType.perf.value:
          this.currentFieldData = this.fieldsAllData.perf;
          this.fieldsNameLabel = this.perfFieldsNameLabel;
          break;
        default:
          this.currentFieldData = {};
          this.fieldsNameLabel = {};
          break;
      }
    }
  }
}
</script>
<style lang="scss">
.field-detail-message-box {
  width: 80%;

  .el-message-box__content {
    padding: 10px 20px;
  }

  .hl-pre {
    max-height: 400px;
  }
}

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
