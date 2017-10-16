/**
 * 性能数据api
 */

const moment = require('moment');
const query = require('../../common/query');
const util = require('../../common/util');
const { PAGE_NUM } = require('../../common/config');
const {
  SQL_CONDITION_TYPE,
  TRACKER_TYPE,
  RET_CODE
} = require('../../common/enum');

module.exports = (app) => {
  class PerfController extends app.Controller {
    /**
     * 按照维度统计
     */
    * statByDim() {
      const ctx = this.ctx;

      ctx.body = {
        code: RET_CODE.OK,
        data: yield ctx.service.tracker.getDim(TRACKER_TYPE.PERF, moment().format('YYYY.MM.DD'))
      };
    }

    /**
     * 性能数据查询
     */
    * query() {
      // ?page=1&timestamp=&platform=ios&pid=&network=&link=&startTime=&endTime=
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const whereArr = query.getConditionByQuery(
        ctx.query,
        [
          { name: 'platform', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'pid', type: SQL_CONDITION_TYPE.NORMAL },
          { name: 'network', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'link', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'startTime', compare: 'timestamp', type: SQL_CONDITION_TYPE.GTE },
          { name: 'endTime', compare: 'timestamp', type: SQL_CONDITION_TYPE.LTE }
        ]
      );

      const sqlObj = {
        where: [['op_type', 'error'], ['op_params.t_type', TRACKER_TYPE.PERF]].concat(whereArr),
        order: [['@timestamp', 'desc']],
        limit: PAGE_NUM,
        offset: (page - 1) * PAGE_NUM
      };

      const jsondata = yield ctx.service.tracker.query(sqlObj);

      // 如果没有错误
      if (!jsondata.error) {
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            total: jsondata.hits.total,
            currPage: page,
            pageSize: PAGE_NUM,
            list: jsondata.hits.hits.map((d) => {
              const curr = d._source.op_params;

              curr.common = {
                c1: util.str2Obj(curr.c1),
                c2: util.str2Obj(curr.c2),
                c3: util.str2Obj(curr.c3)
              };
              return curr;
            })
          }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: jsondata.error.type
        };
      }
    }
  }
  return PerfController;
};
