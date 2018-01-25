<template>
  <el-table
    border
    :data="lists"
    style="width: 100%">
    <el-table-column prop="type" :formatter="(row) => fieldRuleType[row.type]" label="规则类型" width="100">
    </el-table-column>
    <el-table-column prop="title" label="规则名称" width="160">
    </el-table-column>
    <el-table-column prop="field_name" :formatter="(row) => fieldFieldsName[row.field_name]" label="字段名称" width="130">
    </el-table-column>
    <el-table-column prop="field_action" :formatter="(row) => fieldFieldsAction[row.field_action]" label="字段运算" width="100">
    </el-table-column>
    <el-table-column prop="field_value" label="字段值" width="100">
    </el-table-column>
    <el-table-column prop="stat_type" :formatter="(row) => fieldStatType[row.stat_type]" label="统计类型" width="100">
    </el-table-column>
    <el-table-column prop="stat_action" :formatter="(row) => fieldStatAction[row.stat_action]" label="统计运算" width="100">
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
import {
  fieldRuleType,
  fieldFieldsName,
  fieldFieldsAction,
  fieldStatType,
  fieldStatAction
} from './field';

// action: delete,edit
export default {
  props: {
    lists: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      fieldRuleType,
      fieldFieldsName,
      fieldFieldsAction,
      fieldStatType,
      fieldStatAction
    };
  },
  methods: {
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
  }
}
</script>
<style lang="scss" scoped>

</style>


