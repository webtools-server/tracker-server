<template lang="html">
  <el-select v-model="pid" @change="handleChange" placeholder="请选择">
    <el-option
      v-for="item in list"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import * as api from '../api';

export default {
  name: 'tk-project-select',

  props: {
    value: [String, Number]
  },

  data() {
    return {
      pid: this.value,
      list: []
    };
  },

  watch: {
    'value'(val, oldValue) {
      if (val !== this.pid) {
        this.pid = val;
      }
    }
  },

  methods: {
    handleChange(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },

  created() {
    api.queryProject({ all: '666' }).then((res) => {
      if (res.code === 0) {
        this.list = res.data.list.map((item) => {
          return { label: item.pid, value: item.pid };
        });
      }
    });
  },

  mounted() {

  }
};
</script>

<style lang="scss">

</style>
