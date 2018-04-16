<template lang="html">
  <div class="dashboard-main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="错误数据" name="error">
        <chart v-if="activeName === 'error'" :chart-id="chartID" :chart-name="chartName" :chart-type="chartType" :stat-day="errorStat.day" :stat-hour="errorStat.hour" :stat-dim="errorStat.dim"></chart>
      </el-tab-pane>
      <el-tab-pane label="接口数据" name="api">
        <chart v-if="activeName === 'api'" :chart-id="chartID" :chart-name="chartName" :chart-type="chartType" :stat-day="apiStat.day" :stat-hour="apiStat.hour" :stat-dim="apiStat.dim"></chart>
      </el-tab-pane>
      <!--
      <el-tab-pane label="性能数据" name="perf">
        <chart v-if="activeName === 'perf'" :chart-id="chartID" :chart-name="chartName" :chart-type="chartType"></chart>
      </el-tab-pane>
      -->
    </el-tabs>
  </div>
</template>

<script>
import Chart from './chart.vue';
import * as api from '@/api';
import helper from '@/utils/helper';

export default {
  data() {
    return {
      activeName: 'error',
      chartID: 'db-error-chart',
      chartName: '脚本错误数',
      chartType: helper.getTrackerType('error'),
      errorStat: {
        day: [],
        hour: [],
        dim: {}
      },
      apiStat: {
        day: [],
        hour: [],
        dim: {}
      }
    };
  },
  components: {
    chart: Chart
  },
  methods: {
    renderError() {
      this.chartID = 'db-error-chart';
      this.chartName = '脚本错误数';
      this.chartType = helper.getTrackerType('error');
      api.errorStatByDay().then(res => this.errorStat.day = res.data);
      api.errorStatByHour().then(res => this.errorStat.hour = res.data);
      api.errorStatByDim().then(res => this.errorStat.dim = res.data);
    },
    renderApi() {
      this.chartID = 'db-api-chart';
      this.chartName = '接口异常数';
      this.chartType = helper.getTrackerType('api');
      api.apiStatByDay().then(res => this.apiStat.day = res.data);
      api.apiStatByHour().then(res => this.apiStat.hour = res.data);
      api.apiStatByDim().then(res => this.apiStat.dim = res.data);
    },
    renderPerf() {
      this.chartID = 'db-perf-chart';
      this.chartName = '性能数据';
      this.chartType = helper.getTrackerType('perf');
    },
    handleClick(tab, event) {
      switch (tab.name) {
        case 'error': {
          this.renderError();
          break;
        }
        case 'api': {
          this.renderApi();
          break;
        }
        case 'perf': {
          this.renderPerf();
          break;
        }
      }
    }
  },
  created() {
    this.renderError();
  }
};
</script>

<style lang="scss" scoped>

</style>
