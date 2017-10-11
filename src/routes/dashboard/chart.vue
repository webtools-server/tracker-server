<template lang="html">
  <div :id="chartID" class="chart-main">
    <el-row :gutter="24">
      <!-- 按天统计（最新7天） -->
      <el-col :span="12">
        <div class="grid-content">
          <div class="chart-count-date"></div>
        </div>
      </el-col>
      <!-- 按小时统计 -->
      <el-col :span="12">
        <div class="grid-content">
          <div class="chart-count-hour"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <!-- 按维度统计 -->
      <el-col :span="12">
        <div class="grid-content">
          <div class="chart-platform"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <div class="chart-network"></div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import echarts from 'echarts';
import * as api from '../../api';

export default {
  data() {
    return {
    };
  },
  props: {
    chartID: {
      type: String,
      default: 'db-chart'
    },
    chartName: {
      type: String,
      default: ''
    },
    chartType: {
      type: String,
      default: ''
    }
  },
  methods: {
    setChartBarOptions(ctx, title, data) {
      ctx.setOption({
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {},
        xAxis: {
          data: data.map(d => d.date)
        },
        yAxis: {},
        series: [{
          name: this.chartName,
          type: 'bar',
          data: data.map(d => d.count)
        }]
      });
    },
    setChartLineOptions(ctx, title, data) {
      ctx.setOption({
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map(d => d.time)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: this.chartName,
          type: 'line',
          smooth: true,
          data: data.map(d => d.count)
        }]
      });
    },
    setChartPieOptions(ctx, title, data) {
      //  饼图
      ctx.setOption({
        title: {
          text: title,
          left: 'center',
          top: 20,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: this.chartName,
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: data.sort((a, b) => {
              return a.value - b.value;
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      });
    }
  },
  mounted() {
    // 按天统计（最新7天）
    const chartCountDate = echarts.init(document.querySelector(`#${this.chartID} .chart-count-date`));
    const chartCountDateTitle = '按天统计（最新7天）';

    this.setChartBarOptions(chartCountDate, chartCountDateTitle, []);
    api.getCountByDate({ t_type: this.chartType }).then((res) => {
      this.setChartBarOptions(chartCountDate, chartCountDateTitle, res.data);
    });

    // 按小时统计
    const chartCountHour = echarts.init(document.querySelector(`#${this.chartID} .chart-count-hour`));
    const chartCountHourTitle = '按小时统计';

    this.setChartLineOptions(chartCountHour, chartCountHourTitle, []);
    api.getCountByHour({ t_type: this.chartType }).then((res) => {
      this.setChartLineOptions(chartCountHour, chartCountHourTitle, res.data);
    });

    // 按维度统计
    const chartPlatform = echarts.init(document.querySelector(`#${this.chartID} .chart-platform`));
    const chartNetwork = echarts.init(document.querySelector(`#${this.chartID} .chart-network`));
    const chartPlatformTitle = '平台';
    const chartNetworkTitle = '网络类型';

    this.setChartPieOptions(chartPlatform, chartPlatformTitle, []);
    this.setChartPieOptions(chartNetwork, chartNetworkTitle, []);
    api.getCountByDim({ t_type: this.chartType }).then((res) => {
      const jsondata = res.data;

      this.setChartPieOptions(chartPlatform, chartPlatformTitle, jsondata.platform);
      this.setChartPieOptions(chartNetwork, chartNetworkTitle, jsondata.network);
    });
  }
};
</script>

<style lang="scss" scoped>
  .chart-main {
    padding-top: 20px;
  }
  .el-row {
    margin-bottom: 25px;
  }
  .chart-count-date, .chart-count-hour, .chart-platform, .chart-network {
    height: 350px;
  }
</style>
