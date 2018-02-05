/**
 * alert_log
 */

const { RET_CODE } = require('../../common/enum');
const { PAGE_NUM } = require('../../common/config');

module.exports = (app) => {
  class AlertLogController extends app.Controller {
    * query() {
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const whereObj = {};
      const pid = ctx.query.pid || '';
      // 如果有产品ID
      if (pid) {
        whereObj.pid = pid;
      }
      // 获取数据
      const result = yield ctx.service.alertLog.findAndCountAll(whereObj, (page - 1) * PAGE_NUM);

      ctx.body = {
        code: RET_CODE.OK,
        data: {
          total: result.count,
          currPage: page,
          pageSize: PAGE_NUM,
          list: result.rows
        }
      };
    }
  }

  return AlertLogController;
};
