/**
 * 性能统计service
 */

const util = require('../common/util');

module.exports = (app) => {
  class PerfStatService extends app.Service {
    * query(sqlObj) {
      const jsondata = yield this.ctx.service.tracker.query(sqlObj);
      return {
        error: jsondata.error,
        total: jsondata.hits.total,
        list: jsondata.hits.hits.map((d) => {
          const curr = d._source.op_params;
          const comC1 = util.str2Obj(curr.c1);

          Object.keys(comC1).forEach((c1) => {
            curr[`c_${c1}`] = comC1[c1];
          });
          curr.common = {
            c1: comC1,
            c2: util.str2Obj(curr.c2),
            c3: util.str2Obj(curr.c3)
          };
          return curr;
        })
      };
    }
  }
  return PerfStatService;
};
