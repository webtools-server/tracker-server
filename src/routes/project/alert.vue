<template>
  <div id="big-form">
    <!-- breadcrumb start  -->
    <db-breadcrumb></db-breadcrumb>
    <!-- breadcrumb end  -->

    <div class="db-content-inner">
      <div class="desc-list">
        <div class="desc-list-title">项目信息：</div>
        <el-row>
          <el-col :span="12">
            <span>产品ID：</span><span>{{form.pid}}</span>
          </el-col>
          <el-col :span="12">
            <span>产品名称：</span><span>{{form.title}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="el-divider"></div>
      <div class="desc-list">
        <div class="desc-list-title">规则配置：<el-button type="success" size="mini">添加规则</el-button></div>
        <el-row>
          <el-col :span="24">
            <el-table
              border
              :data="tableData"
              style="width: 100%">
              <el-table-column prop="type" label="规则类型" width="100">
              </el-table-column>
              <el-table-column prop="title" label="规则名称" width="160">
              </el-table-column>
              <el-table-column prop="fieldName" label="字段名称" width="130">
              </el-table-column>
              <el-table-column prop="fieldAction" label="字段运算" width="100">
              </el-table-column>
              <el-table-column prop="fieldValue" label="字段值" width="100">
              </el-table-column>
              <el-table-column prop="statType" label="统计类型" width="100">
              </el-table-column>
              <el-table-column prop="statAction" label="统计运算" width="100">
              </el-table-column>
              <el-table-column prop="statValue" label="统计值" width="100">
              </el-table-column>
              <el-table-column :context="_self" inline-template label="操作">
                <div>
                  <el-button type="info" size="small">编辑</el-button>
                  <el-button type="danger" size="small">删除</el-button>
                </div>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="el-divider"></div>
      <div class="desc-list">
        <div class="desc-list-title">联系人：</div>
        <el-row>
          <el-col :span="24">
            <el-select
              v-model="value9"
              multiple
              filterable
              remote
              placeholder="请输入用户名"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-button type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api';

const API_THRESHOLD = 3000;
const SLOW_RESPONSE_TIME = 10000;

export default {
  data() {
    return {
      form: {
        pid: '',
        title: '',
        apiThreshold: API_THRESHOLD,
        slowResponseTime: SLOW_RESPONSE_TIME
      },
      rules: {
        pid: [
          { required: true, message: '请输入产品ID', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      isCreate: true,
      options4: [],
      value9: [],
      list: [],
      loading: false,
      states: ["Alabama", "Alaska", "Arizona",
      "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida",
      "Georgia", "Hawaii", "Idaho", "Illinois",
      "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland",
      "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana",
      "Nebraska", "Nevada", "New Hampshire",
      "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio",
      "Oklahoma", "Oregon", "Pennsylvania",
      "Rhode Island", "South Carolina",
      "South Dakota", "Tennessee", "Texas",
      "Utah", "Vermont", "Virginia",
      "Washington", "West Virginia", "Wisconsin",
      "Wyoming"],
      tableData: [{
        title: '规则1',
        type: 1,
        fieldName: '网络类型',
        fieldAction: '等于',
        fieldValue: '3G',
        statType: '总数',
        statAction: '大于等于',
        statValue: '100'
      }, {
        title: '规则2',
        type: 1,
        fieldName: '状态码',
        fieldAction: '大于等于',
        fieldValue: '400',
        statType: '比例',
        statAction: '大于',
        statValue: '30'
      }]
    };
  },
  created() {
    const qs = this.$route.query;

    // 如果pid有值，则是编辑
    if (qs.pid) {
      this.isCreate = false;
      api.queryProject(qs.pid).then((res) => {
        if (res.code !== 0) {
          this.$message({ message: res.msg, type: 'error' });
          this.$router.push({ path: '/project/list' });
        } else {
          const resData = res.data;

          this.form.pid = resData.pid;
          this.form.title = resData.title;
          this.form.apiThreshold = resData.api_threshold;
          this.form.slowResponseTime = resData.slow_response_time;
        }
      });
    }
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    // event
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        } else {
          const qs = this.$route.query;
          const apiMethod = qs.pid ? api.saveProject(qs.pid, this.form) : api.createProject(this.form);

          apiMethod.then((res) => {
            if (res.code === 0) {
              this.$message({ message: '提交成功', type: 'success' });
              this.$router.push({ path: '/project/list' });
            } else {
              this.$message({ message: res.msg, type: 'error' });
            }
          });
        }
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    }
  },
  computed: {

  }
};
</script>

<style lang="scss" scoped>
#big-form {
  .el-form {
    width: 400px;
  }

  .el-divider {
    position: relative;
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    background-color: #e8e8e8;
  }

  .desc-list {
    margin-bottom: 24px;

    .desc-list-title {
      font-size: 16px;
      color: rgba(0,0,0,.85);
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
}
</style>
