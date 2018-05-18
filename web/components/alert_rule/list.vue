<template>
  <el-table
    border
    :data="lists"
    style="width: 100%">
    <el-table-column prop="type" :formatter="(row) => ruleTypeLabel[row.type]" label="规则类型" width="100">
    </el-table-column>
    <el-table-column prop="title" label="规则名称" width="160">
    </el-table-column>
    <el-table-column prop="minutes" label="最近N分钟" width="120">
    </el-table-column>
    <el-table-column prop="field_name" :formatter="getFieldsName" label="字段名称" width="130">
    </el-table-column>
    <el-table-column prop="field_action" :formatter="(row) => ruleActionLabel[row.field_action]" label="字段运算" width="100">
    </el-table-column>
    <el-table-column prop="field_value" label="字段值" width="100">
    </el-table-column>
    <el-table-column prop="stat_type" :formatter="(row) => statTypeLabel[row.stat_type]" label="统计类型" width="100">
    </el-table-column>
    <el-table-column prop="stat_action" :formatter="(row) => ruleActionLabel[row.stat_action]" label="统计运算" width="100">
    </el-table-column>
    <el-table-column prop="stat_value" label="统计值" width="100">
    </el-table-column>
    <el-table-column :context="_self" inline-template label="操作">
      <div>
        <el-button type="info" size="small" @click="handleClickEdit($index, row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleClickDelete($index, row)">删除</el-button>
      </div>
    </el-table-column>
  </el-table>
</template>
<script>
import * as util from '../../utils/util';

// action: delete,edit
export default {
  props: {
    lists: {
      type: Array,
      default: []
    },
    fields: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // value
      originRuleType: {
        error: {},
        api: {},
        perf: {}
      },
      // label
      ruleTypeLabel: {},
      fieldsNameLabel: {},
      errorFieldsNameLabel: {},
      apiFieldsNameLabel: {},
      perfFieldsNameLabel: {},
      ruleActionLabel: {},
      statTypeLabel: {}
    };
  },
  methods: {
    normalizeDataByFields(data) {
      const fields = data || this.fields;
      if (util.isEmptyObject(fields)) return;
      // type
      this.originRuleType = fields.type.ruleType;
      // get label
      this.ruleTypeLabel = this.getLabelByValue(this.originRuleType);
      this.errorFieldsNameLabel = this.getLabelByValue(fields.field.error);
      this.apiFieldsNameLabel = this.getLabelByValue(fields.field.api);
      this.perfFieldsNameLabel = this.getLabelByValue(fields.field.perf);
      this.ruleActionLabel = this.getLabelByValue(fields.action);
      this.statTypeLabel = this.getLabelByValue(fields.type.statType);
    },
    getLabelByValue(fields) {
      return Object.keys(fields).reduce((obj, field) => {
        obj[fields[field].value] = fields[field].name;
        return obj;
      }, {});
    },
    getFieldsName(row) {
      const typeStr = String(row.type);
      switch (typeStr) {
        case this.originRuleType.error.value:
          return this.errorFieldsNameLabel[row.field_name];
        case this.originRuleType.api.value:
          return this.apiFieldsNameLabel[row.field_name];
        case this.originRuleType.perf.value:
          return this.perfFieldsNameLabel[row.field_name];
        default:
          return '';
      }
    },
    handleClickEdit(index, row) {
      this.$emit('edit', index, row);
    },
    handleClickDelete(index, row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$emit('delete', index, row);
      }).catch(() => {});
    }
  },
  watch: {
    fields(val) {
      this.normalizeDataByFields(val);
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


