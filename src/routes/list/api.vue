<template lang="html">
  <div class="list-wrap">

    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner">

      <!-- filters start -->
      <div class="filters" @keyup.enter="handleSearch">
        <div class="filter">
          产品ID：
          <el-input placeholder="产品ID" v-model="filters.pid"></el-input>
        </div>
        <div class="filter">
          平台：
          <el-input placeholder="平台" v-model="filters.platform"></el-input>
        </div>
        <div class="filter">
          网络类型：
          <el-input placeholder="网络类型" v-model="filters.network"></el-input>
        </div>
        <div class="filter">
          接口地址：
          <el-input placeholder="接口地址" v-model="filters.link"></el-input>
        </div>
        <div class="filter">
          请求方法：
          <el-select v-model="filters.method" placeholder="请选择">
            <el-option
              v-for="item in methods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter">
          请求内容：
          <el-input placeholder="请求内容" v-model="filters.body"></el-input>
        </div>
        <div class="filter">
          起止时间：
          <el-date-picker type="datetimerange" placeholder="选择时间范围" style="width:350px" v-model="filters.startEndTime"></el-date-picker>
        </div>
        <el-button type="primary" @click="handleSearch()">搜索</el-button>
      </div>
      <!-- filters end -->

      <!-- table start  -->
      <el-table :data="list" ref="table" style="width: 100%" element-loading-text="拼命加载中"
        stripe
        v-loading="loading">
        <el-table-column prop="pid" label="产品ID"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="platform" label="平台"></el-table-column>
        <el-table-column prop="network" width="100" label="网络类型"></el-table-column>
        <el-table-column prop="common.url" width="250" label="接口地址"></el-table-column>
        <el-table-column prop="common.method" width="150" label="请求方法"></el-table-column>
         <el-table-column prop="common.time" width="150" label="响应时间(ms)"></el-table-column>
        <el-table-column prop="timestamp" label="上报时间" :formatter="formatDate" width="180"></el-table-column>
        <el-table-column :context="_self" width="100" inline-template label="操作">
          <div>
            <el-button type="info" size="small" @click="handleView($index, row)">查看</el-button>
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

      <!-- view dialog start -->
      <el-dialog title="详情" v-model="viewDialog" size="large">
        <el-table class="ui-mb-30" :data="[details]">
          <el-table-column prop="pid" label="产品ID"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="platform" label="平台"></el-table-column>
          <el-table-column prop="network" label="网络类型"></el-table-column>
          <el-table-column prop="size" label="分辨率"></el-table-column>
          <el-table-column prop="in_app" width="200" :formatter="isInApp" label="是否加油宝APP内"></el-table-column>
          <el-table-column prop="cust_id" label="用户ID"></el-table-column>
          <el-table-column prop="uniq_id" label="唯一标识"></el-table-column>
          <el-table-column prop="timestamp" label="上报时间" :formatter="formatDate" width="180"></el-table-column>
        </el-table>
        <el-form :model="details" label-width="200px">
          <el-form-item label="引用：">
            <span class="txt-bw">{{details.referer}}</span>
          </el-form-item>
          <el-form-item label="页面链接：">
            <span class="txt-bw">{{details.link}}</span>
          </el-form-item>
          <el-form-item label="用户代理：">
            <span class="txt-bw">{{details.ua}}</span>
          </el-form-item>
          <el-form-item label="请求method：">
            <span class="txt-bw">{{details.common.method}}</span>
          </el-form-item>
          <el-form-item label="请求url：">
            <span class="txt-bw">{{details.common.url}}</span>
          </el-form-item>
          <el-form-item label="请求body：">
            <span class="txt-bw">{{details.common.body}}</span>
          </el-form-item>
          <el-form-item label="响应time：">
            <span class="txt-bw">{{details.common.time}}ms</span>
          </el-form-item>
          <el-form-item label="响应statusCode：">
            <span class="txt-bw">{{details.common.statusCode}}</span>
          </el-form-item>
          <el-form-item label="响应statusText：">
            <span class="txt-bw">{{details.common.statusText}}</span>
          </el-form-item>
          <el-form-item label="响应result：">
            <span class="txt-bw">{{details.common.result}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- view dialog end -->
    </div>
  </div>
</template>

<script>
import './list.scss';

import * as api from '../../api';
import moment from 'moment';
import * as sourceMap from '../../utils/sourcemap';

export default {
  data() {
    return {
      firstPage: 1,
      list: [],
      total: 0,
      page: 1,
      pageSize: 0,
      loading: true,
      viewDialog: false,
      filters: {
        platform: '',
        pid: '',
        network: '',
        link: '',
        method: '',
        body: '',
        startEndTime: ''
      },
      details: {
        common: {}
      },
      methods: [{
        value: 'get',
        label: 'GET'
      }, {
        value: 'post',
        label: 'POST'
      }, {
        value: 'put',
        label: 'PUT'
      }, {
        value: 'delete',
        label: 'DELETE'
      }, {
        value: 'options',
        label: 'OPTIONS'
      }]
    };
  },

  watch: {
    '$route': 'fetchData'
  },

  methods: {
    formatDate(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },

    isInApp(row, column, cellValue) {
      return String(!!cellValue);
    },

    handleView($index, row) {
      this.details = row;
      this.viewDialog = true;
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

      this.loading = true;
      api.fetchApiList({
        page,
        platform: this.filters.platform,
        pid: this.filters.pid,
        network: this.filters.network,
        link: this.filters.link,
        method: this.filters.method,
        body: this.filters.body,
        startTime: startTime,
        endTime: endTime
      }).then((res) => {
        // lazy render data
        this.list = res.data.list;
        this.total = res.data.total;
        this.page = page;
        this.pageSize = res.data.pageSize;
        this.loading = false;
      });
    }
  },

  mounted() {
    this.fetchData();
  }
};
</script>
