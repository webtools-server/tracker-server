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
        <el-button type="primary" @click="handleSearch()">搜索</el-button>
        <el-button type="success" @click="handleCreate()">新建项目</el-button>
      </div>
      <!-- filters end -->

      <!-- table start  -->
      <el-table :data="list" ref="table" style="width: 100%" element-loading-text="拼命加载中"
        stripe
        v-loading="loading">
        <el-table-column prop="pid" label="产品ID"></el-table-column>
        <el-table-column prop="title" label="产品名称"></el-table-column>
        <el-table-column prop="timestamp" label="修改时间" :formatter="formatDate"></el-table-column>
        <el-table-column :context="_self" inline-template label="操作">
          <div>
            <el-button type="info" size="small" @click="handleEdit($index, row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete($index, row)">删除</el-button>
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
import * as api from '../../api';
import moment from 'moment';

export default {
  data() {
    return {
      firstPage: 1,
      list: [],
      total: 0,
      page: 1,
      pageSize: 0,
      loading: true,
      filters: {
        pid: ''
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

    handleSearch() {
      this.redirect();
    },

    handleCreate() {
      this.$router.push({ path: '/project/create' });
    },

    handleEdit(index, row) {
      this.$router.push({ path: `/project/create`, query: { pid: row.pid } });
    },

    handleDelete(index, row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        api.deleteProject(row.pid).then((res) => {
          if (res.code !== 0) {
            this.$message({ message: res.msg, type: 'error' });
          } else {
            this.fetchData();
          }
        });
      }).catch(() => {});
    },

    handleCurrentChange(val) {
      const prevPage = parseInt(this.$route.query.page, 10) || this.firstPage;
      if (prevPage !== val) {
        this.redirect(val);
      }
    },

    redirect(val) {
      this.$router.push({
        name: this.$route.name,
        query: Object.assign({}, this.filters, { page: val || this.firstPage })
      });
      window.scrollTo(0, 0);
    },

    fetchData() {
      const query = this.$route.query;
      const queryKeys = Object.keys(query);

      // 根据querystring给filters赋值
      queryKeys.forEach((f) => {
        this.filters[f] = query[f] || ''
      });

      // 如果query为空，清空filters
      if (!queryKeys.length) {
        Object.keys(this.filters).forEach(f => this.filters[f] = '');
      }

      // param: page
      const page = parseInt(query.page, 10) || this.firstPage;

      this.loading = true;
      api.queryProject({
        page,
        pid: this.filters.pid
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
