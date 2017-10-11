<template lang="html">
  <div class="dashboard-main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="错误数据" name="error">
        <chart v-if="activeName === 'error'" :chart-id="chartID" :chart-name="chartName" :chart-type="chartType"></chart>
      </el-tab-pane>
      <el-tab-pane label="接口数据" name="api">
        <chart v-if="activeName === 'api'" :chart-id="chartID" :chart-name="chartName" :chart-type="chartType"></chart>
      </el-tab-pane>
      <el-tab-pane label="性能数据" name="perf">
        <chart v-if="activeName === 'perf'" :chart-id="chartID" :chart-name="chartName" :chart-type="chartType"></chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Chart from './chart.vue';
import * as api from '../../api';
import helper from '../../utils/helper';

export default {
  data() {
    return {
      activeName: 'error',
      chartID: 'db-error-chart',
      chartName: '脚本错误数',
      chartType: helper.getTrackerType('error')
    };
  },
  components: {
    chart: Chart
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case 'error': {
          this.chartID = 'db-error-chart';
          this.chartName = '脚本错误数';
          this.chartType = helper.getTrackerType('error');
          break;
        }
        case 'api': {
          this.chartID = 'db-api-chart';
          this.chartName = '接口异常数';
          this.chartType = helper.getTrackerType('api');
          break;
        }
        case 'perf': {
          this.chartID = 'db-perf-chart';
          this.chartName = '性能数据';
          this.chartType = helper.getTrackerType('perf');
          break;
        }
      }
    }
  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped>

</style>
