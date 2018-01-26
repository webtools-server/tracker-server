/**
 * 错误统计service
 */

module.exports = (app) => {
  class ErrorStatService extends app.Service {
    * query(sqlObj) {
      const jsondata = yield this.ctx.service.tracker.query(sqlObj);
      return {
        error: jsondata.error,
        total: jsondata.hits.total,
        list: jsondata.hits.hits.map(d => d._source.op_params)
      };
    }
  }
  return ErrorStatService;
};
