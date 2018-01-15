/**
 * project
 */

const util = require('../../common/util');
const { RET_CODE } = require('../../common/enum');
const { PAGE_NUM } = require('../../common/config');

module.exports = (app) => {
  class ProjectController extends app.Controller {
    * createOne() {
      const ctx = this.ctx;
      const { pid, title, apiThreshold, slowResponseTime } = ctx.request.body;

      if (!pid || !title) {
        ctx.body = { code: RET_CODE.ERROR, msg: 'pid或者title不能为空' };
        return;
      }

      const result = yield ctx.service.project.createOne({
        pid,
        title,
        api_threshold: apiThreshold,
        slow_response_time: slowResponseTime,
        owner: ctx.session.username
      });

      if (!util.isError(result)) {
        ctx.body = { code: RET_CODE.OK, data: result };
      } else {
        ctx.body = { code: RET_CODE.ERROR, msg: result.toString() };
      }
    }

    * query() {
      const ctx = this.ctx;
      const pid = ctx.params.pid || '';

      if (pid) {
        const result = yield ctx.service.project.findOneByPid(pid);
        ctx.body = result ? { code: RET_CODE.OK, data: result } : { code: RET_CODE.ERROR, msg: `${pid}不存在` };
      } else {
        const page = parseInt(ctx.query.page, 10) || 1;
        const all = ctx.query.all || '';
        const spid = ctx.query.pid;

        // 如果all参数有值，返回所有数据
        if (all) {
          const result = yield ctx.service.project.findAndCountAll(!!all);

          ctx.body = {
            code: RET_CODE.OK,
            data: {
              total: result.count,
              list: result.rows
            }
          };
        } else {
          const result = yield ctx.service.project.findAndCountAll({
            pid: { $like: `%${spid}%` }
          }, (page - 1) * PAGE_NUM);

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
    }

    * deleteOne() {
      const ctx = this.ctx;
      const result = yield ctx.service.project.deleteOneByPid(ctx.params.pid);

      ctx.body = { code: RET_CODE.OK, data: { rows: result } };
    }

    * putOne() {
      const ctx = this.ctx;
      const { pid, title, apiThreshold, slowResponseTime } = ctx.request.body;

      if (!pid || !title) {
        ctx.body = { code: RET_CODE.ERROR, msg: 'pid或者title不能为空' };
        return;
      }

      const result = yield ctx.service.project.updateOneByPid(
        ctx.params.pid,
        {
          pid,
          title,
          api_threshold: apiThreshold,
          slow_response_time: slowResponseTime
        }
      );

      if (!util.isError(result)) {
        ctx.body = { code: RET_CODE.OK, data: result };
      } else {
        ctx.body = { code: RET_CODE.ERROR, msg: result.toString() };
      }
    }
  }

  return ProjectController;
};
