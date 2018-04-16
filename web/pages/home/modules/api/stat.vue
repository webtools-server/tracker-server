<template lang="html">
  <div class="list-wrap">

    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner">
      <!-- filters start -->
      <div class="filters" @keyup.enter="handleSearch">
        <!-- <div class="filter">
          时间：
          <el-radio-group v-model="daterange">
            <el-radio-button label="今天"></el-radio-button>
            <el-radio-button label="昨天"></el-radio-button>
            <el-radio-button label="最近7天"></el-radio-button>
            <el-radio-button label="最近30天"></el-radio-button>
          </el-radio-group>
        </div> -->
        <div class="filter">
          对比时间段：
          <el-date-picker type="datetimerange" placeholder="选择时间范围" style="width:250px" v-model="filters.startEndTime"></el-date-picker>
        </div>
        <div class="filter">
          产品ID：
          <tk-project-select v-model="filters.pid"></tk-project-select>
        </div>
        <div class="filter">
          平台：
          <el-input placeholder="平台" v-model="filters.platform"></el-input>
        </div>
        <div class="filter">
          网络类型：
          <el-input placeholder="网络类型" v-model="filters.network"></el-input>
        </div>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </div>
      <!-- filters end -->

      <!-- chart start -->
      <div class="chart-main">
        <div id="line-chart"></div>
      </div>
      <!-- chart end -->

      <!-- table start  -->
      <el-table :data="list" ref="table" style="width: 100%" element-loading-text="拼命加载中"
        stripe
        v-loading="loading">
        <el-table-column prop="url" width="250" label="接口地址"></el-table-column>
        <el-table-column prop="cmd" width="100" label="命令字"></el-table-column>
        <el-table-column prop="responseTotal" :label="apiFields.responseTotal"></el-table-column>
        <el-table-column prop="timeoutCount" :label="apiFields.timeoutCount"></el-table-column>
        <el-table-column prop="statusCodeCount" :label="apiFields.statusCodeCount"></el-table-column>
        <el-table-column prop="apiCodeCount" :label="apiFields.apiCodeCount"></el-table-column>
        <el-table-column prop="averageResponseTime" :label="apiFields.averageResponseTime"></el-table-column>
        <el-table-column prop="slowResponseTime" :label="apiFields.slowResponseTime"></el-table-column>
        <el-table-column :context="_self" width="100" inline-template label="操作">
          <div>
            <el-button type="info" size="small" @click="handleView($index, row)">明细</el-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- table end  -->

      <!-- pagination start  -->
      <div class="pagination-wrapper" v-show="!loading">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- pagination end  -->
    </div>
  </div>
</template>

<script>
import '../../../../assets/sass/list.scss';

import * as api from '@/api';
import { apiFields } from '@/utils/fields_map';
import echarts from 'echarts';
import moment from 'moment';

export default {
  data() {
    return {
      apiFields,
      lineChart: null,
      chartData: [], // 图表数据
      firstPage: 1,
      list: [],
      total: 0,
      page: 1,
      pageSize: 0,
      loading: true,
      daterange: '',
      filters: {
        platform: '',
        pid: '',
        network: '',
        startEndTime: ''
      }
    };
  },

  watch: {
    '$route': 'fetchData'
  },

  methods: {
    formatDate(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },

    handleView($index, row) {
      this.$router.push({
        name: 'apiDetail',
        query: { body: row.cmd }
      });
    },

    handleSearch() {
      this.redirect();
    },

    handleCurrentChange(val) {
      const prevPage = parseInt(this.$route.query.page, 10) || this.firstPage;
      if (prevPage !== val) {
        this.redirect(val);
      }
    },

    redirect(val) {
      const filtersStartEndTime = this.filters.startEndTime;
      const startTime = Array.isArray(filtersStartEndTime) ? filtersStartEndTime[0].getTime() : '';
      const endTime = Array.isArray(filtersStartEndTime) ? filtersStartEndTime[1].getTime() : '';
      let startEndTime = '';

      if (startTime && endTime) {
        startEndTime = [startTime, endTime].join(',');
      }

      this.$router.push({
        name: this.$route.name,
        query: Object.assign({}, this.filters, { page: val || this.firstPage, startEndTime })
      });
      window.scrollTo(0, 0);
    },

    fetchData() {
      const query = this.$route.query;
      const queryKeys = Object.keys(query);
      let startTime = '';
      let endTime = '';

      // 根据querystring给filters赋值
      queryKeys.forEach((f) => {
        // param: time
        if (f === 'startEndTime' && query[f]) {
          const arr = query[f].split(',');

          startTime = arr[0];
          endTime = arr[1];
          this.filters.startEndTime = [new Date(Number(arr[0])), new Date(Number(arr[1]))];
        } else {
          this.filters[f] = query[f] || ''
        }
      });

      // 如果query为空，清空filters
      if (!queryKeys.length) {
        Object.keys(this.filters).forEach(f => this.filters[f] = '');
      }

      // param: page
      const page = parseInt(query.page, 10) || this.firstPage;
      const commonParams = {
        platform: this.filters.platform,
        pid: this.filters.pid,
        network: this.filters.network,
        startTime: startTime,
        endTime: endTime
      };

      api.queryStatByTime(commonParams).then((res) => {
        if (res.code === 0) {
          this.chartData = res.data;
          this.setChartOption(
            this.chartData,
            [
              'responseTotal',
              'timeoutCount',
              'statusCodeCount',
              'apiCodeCount'
            ]
          );
        }
      });

      this.loading = true;
      api.fetchApiStatList({
        ...commonParams, page
      }).then((res) => {
        // lazy render data
        this.list = res.data.list;
        this.total = res.data.total;
        this.page = page;
        this.pageSize = res.data.pageSize;
        this.loading = false;
      });
    },

    setChartOption(chartData = [], legend = []) {
      const xAxis = chartData.map(d => d.xAxis);

      this.lineChart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legend.map(l => apiFields[l] || '')
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: legend.map(l => {
          return {
            name: apiFields[l],
            type: 'line',
            smooth: true,
            data: chartData.map(d => d[l])
          };
        })
      });
    }
  },

  mounted() {
    //  折线图
    this.lineChart = echarts.init(document.getElementById('line-chart'));
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
  #line-chart {
    height: 350px;
    margin-bottom: 25px;
  }
</style>
