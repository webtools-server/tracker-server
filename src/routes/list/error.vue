<template lang="html">
  <div id="ListWithFiltersPage">

    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner">

      <!-- filters start -->
      <div class="filters">
        <div class="filter">
          平台：
          <el-input placeholder="平台" v-model="filters.platform"></el-input>
        </div>
        <div class="filter">
          产品ID：
          <el-input placeholder="产品ID" v-model="filters.pid"></el-input>
        </div>
        <div class="filter">
          网络类型：
          <el-input placeholder="网络类型" v-model="filters.network"></el-input>
        </div>
        <div class="filter">
          链接：
          <el-input placeholder="链接" v-model="filters.link"></el-input>
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
        <el-table-column prop="network" label="网络类型"></el-table-column>
        <el-table-column prop="link" width="250" label="链接"></el-table-column>
        <el-table-column prop="c1" width="200" label="错误msg"></el-table-column>
        <el-table-column prop="timestamp" label="上报时间" :formatter="formatDate" width="180"></el-table-column>
        <el-table-column :context="_self" width="100" inline-template label="操作">
          <div>
            <el-button type="info" size="small" @click="handleEdit($index, row)">查看</el-button>
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

      <!-- edit dialog start -->
      <el-dialog title="编辑" v-model="editDialog" size="tiny">
        <el-form ref="editForm" :model="editForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="editForm.name" class="el-col-24"></el-input>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker class="el-col-24" type="datetime" placeholder="选择日期时间"
              v-model="editForm.time">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleEditSave()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- edit dialog end -->
    </div>
  </div>
</template>

<script>
import * as api from './../../api';
import moment from 'moment';

export default {
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      pageSize: 0,
      loading: true,
      editDialog: false,
      createDialog: false,
      filters: {
        platform: '',
        pid: '',
        network: '',
        link: '',
        startEndTime: ''
      },
      editForm: {
        id: '',
        name: '',
        time: ''
      },
      createForm: {
        name: '',
        time: '',
        address: ''
      }
    };
  },

  watch: {
    '$route': 'fetchData'
  },

  methods: {
    formatDate(row) {
      return moment(row.timestamp).format('YYYY-MM-DD HH:mm:ss');
    },
    handleEditSave() {
      editUser(this.editForm).then(() => {
        this.fetchData();
        this.editDialog = false;

        this.$message({
          message: '编辑成功',
          type: 'success'
        });
      });
    },

    handleSave() {
      addUser(this.createForm).then(() => {
        this.fetchData();
        this.createDialog = false;

        this.$message({
          message: '保存成功',
          type: 'success'
        });
      });
    },

    handleEdit($index, row) {
      this.editForm.id = row.id;
      this.editDialog = true;
    },

    handleDelete($index, row) {
      this.$confirm('是否删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser({
          id: row.id
        }).then(() => {
          this.fetchData();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },

    handleSearch() {
      this.redirect();
    },

    handleCurrentChange(val) {
      this.redirect(val);
    },

    redirect(val) {
      this.$router.push({
        name: this.$route.name,
        query: Object.assign({}, this.filters, { page: val })
      });
    },

    fetchData() {
      Object.keys(this.filters).forEach((f) => {
        this.filters[f] = this.$route.query[f] || ''
      });

      // param: page
      this.page = parseInt(this.filters.page, 10) || this.page;

      // param: start time and end end time
      const startTime = this.filters.startEndTime ? this.filters.startEndTime[0].getTime() : '';
      const endTime = this.filters.startEndTime ? this.filters.startEndTime[1].getTime() : '';
      const options = {
        page: this.page,
        platform: this.filters.platform,
        pid: this.filters.pid,
        network: this.filters.network,
        link: this.filters.link,
        startTime,
        endTime
      };

      this.loading = true;
      api.fetchList(options).then((res) => {
        // clear selection
        this.$refs.table.clearSelection();
        // lazy render data
        this.list = res.data.list;
        this.total = res.data.total;
        this.page = res.data.currPage;
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

<style lang="scss">
#ListWithFiltersPage {
  .filters {
    margin: 0 0 20px 0;
    border: 1px #efefef solid;
    padding: 10px;
    background: #f9f9f9;

    .filter {
      display: inline-block;
      width: auto;
      padding: 10px;
      border-radius: 5px;
      .el-select {
        display: inline-block;
      }
    }

    .el-input {
      width: 150px;
      display: inline-block;
    }
  }

  .pagination-wrapper {
    text-align: center;
    padding: 30px;
  }
}
</style>
