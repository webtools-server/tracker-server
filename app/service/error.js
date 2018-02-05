/**
 * 错误统计service
 */

module.exports = (app) => {
  class ErrorStatService extends app.Service {
    * query(sqlObj) {
      // 过滤部分无用错误
      sqlObj.where = sqlObj.where.concat([
        ['op_params.c1', { $notLike: '%WeixinJSBridge%' }], // 过滤WeixinJSBridge
        ['op_params.c1', { $notLike: '%mmTrixJsClass%' }], // 过滤mmTrixJsClass
        ['op_params.c1', { $notLike: '%91,37%' }], // 过滤91,37
        ['op_params.c1', { $notLike: '%93,37%' }], // 过滤93,37
        ['op_params.c1', { $notLike: '%93,38%' }] // 过滤93,38
      ]);
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
