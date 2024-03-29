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

export default {
  data() {
    return {
      day: { el: null, title: '' },
      hour: { el: null, title: '' },
      platform: { el: null, title: '' },
      network: { el: null, title: '' }
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
    },
    statDay: {
      type: Array,
      default() { return []; }
    },
    statHour: {
      type: Array,
      default() { return []; }
    },
    statDim: {
      type: Object,
      default() { return {}; }
    }
  },
  watch: {
    statDay(val) {
      this.setChartBarOptions(this.day.el, this.day.title, val);
    },
    statHour(val) {
      this.setChartLineOptions(this.hour.el, this.hour.title, val);
    },
    statDim(val) {
      this.setChartPieOptions(this.platform.el, this.platform.title, val.platform);
      this.setChartPieOptions(this.network.el, this.network.title, val.network);
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
    this.day.el = echarts.init(document.querySelector(`#${this.chartID} .chart-count-date`));
    this.day.title = '按天统计（最新7天）';
    this.setChartBarOptions(this.day.el, this.day.title, this.statDay);

    // 按小时统计
    this.hour.el = echarts.init(document.querySelector(`#${this.chartID} .chart-count-hour`));
    this.hour.title = '按小时统计';
    this.setChartLineOptions(this.hour.el, this.hour.title, this.statHour);

    // 按维度统计
    this.platform.el = echarts.init(document.querySelector(`#${this.chartID} .chart-platform`));
    this.network.el = echarts.init(document.querySelector(`#${this.chartID} .chart-network`));
    this.platform.title = '平台';
    this.network.title = '网络类型';

    this.setChartPieOptions(this.platform.el, this.platform.title, []);
    this.setChartPieOptions(this.network.el, this.network.title, []);
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
