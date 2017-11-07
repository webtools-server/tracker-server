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
        <div class="filter">
          页面链接：
          <el-input placeholder="页面链接" v-model="filters.link"></el-input>
        </div>
        <div class="middle-filter">
          过滤错误：
          <div class="ui-d-ib">
            <el-input placeholder="错误msg" v-model="filters.filterError">
              <el-select v-model="filters.filterType" slot="prepend" placeholder="请选择">
                <el-option label="包含" value="1"></el-option>
                <el-option label="不包含" value="2"></el-option>
              </el-select>
            </el-input>
          </div>
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
        <el-table-column prop="link" width="250" label="页面链接"></el-table-column>
        <el-table-column prop="c1" width="150" label="错误msg"></el-table-column>
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
          <el-form-item label="自定义字段1：">
            <span class="txt-bw">{{details.c1}}</span>
          </el-form-item>
          <el-form-item label="自定义字段2：">
            <span class="txt-bw">{{details.c2}}</span>
          </el-form-item>
          <el-form-item label="自定义字段3：">
            <span class="txt-bw">{{details.c3}}</span>
          </el-form-item>
        </el-form>

        <el-form ref="iptForm" :rules="rules" class="ipt-form-box" :model="maps" label-width="200px">
          <el-form-item label="sourcemap：" prop="link">
            <el-input v-model="maps.link" placeholder="sourcemap地址"></el-input>
          </el-form-item>
          <el-form-item label="行号：">
            <el-input class="small-ipt" v-model="maps.row" placeholder="行号"></el-input>
          </el-form-item>
          <el-form-item label="列号：">
            <el-input class="small-ipt" v-model="maps.col" placeholder="列号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleParse()">解 析</el-button>
            <el-button @click="viewDialog = false">取 消</el-button>
          </el-form-item>
        </el-form>

        <el-alert
          v-show="parseResult"
          title="解析结果"
          type="success"
          :description="parseResult">
        </el-alert>
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
        startEndTime: '',
        filterType: '',
        filterError: ''
      },
      details: {},
      maps: {
        link: '',
        row: 0,
        col: 0
      },
      rules: {
        link: [
          {required: true, message: '请输入sourcemap地址', trigger: 'blur'},
          {type: 'url', message: '格式不正确', trigger: 'blur'}
        ]
      },
      parseResult: ''
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
    handleParse() {
      this.$refs.iptForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          api.translate(this.maps).then((res) => {
            if (res.code === 0) {
              this.parseResult = JSON.stringify(res.data.origin, null, 2);
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }
          });
        }
      });
    },

    handleView($index, row) {
      this.details = row;
      this.maps = Object.assign({
        link: sourceMap.getURL(row.c2)
      }, sourceMap.getRowAndCol(row.c1, row.c3));
      this.parseResult = '';
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
      api.fetchErrorList({
        page,
        platform: this.filters.platform,
        pid: this.filters.pid,
        network: this.filters.network,
        link: this.filters.link,
        filterType: this.filters.filterType,
        filterError: this.filters.filterError,
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
