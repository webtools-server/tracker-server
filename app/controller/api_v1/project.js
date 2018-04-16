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
      const defaultAlertRule = ctx.request.body.defaultAlertRule || '';

      if (!pid || !title) {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: 'pid或者title不能为空'
        };
        return;
      }

      const result = yield ctx.service.project.createOne({
        pid,
        title,
        api_threshold: apiThreshold,
        slow_response_time: slowResponseTime,
        owner: ctx.session.username,
        default_alert_rule: defaultAlertRule
      });

      if (!util.isError(result)) {
        // 把默认规则添加到告警规则
        const defaultAlertRuleRows = yield ctx.service.defaultRule.findById(defaultAlertRule.split(','));
        yield ctx.service.alertRule.bulkCreate(defaultAlertRuleRows.map((row) => {
          return {
            pid,
            type: row.type,
            title: row.title,
            field_name: row.field_name,
            field_action: row.field_action,
            field_value: row.field_value,
            stat_type: row.stat_type,
            stat_action: row.stat_action,
            stat_value: row.stat_value
          };
        }));

        ctx.body = {
          code: RET_CODE.OK,
          data: result
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: result.toString()
        };
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
      const { pid, title, apiThreshold, slowResponseTime, defaultAlertRule } = ctx.request.body;

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
          slow_response_time: slowResponseTime,
          default_alert_rule: defaultAlertRule || ''
        }
      );

      if (!util.isError(result)) {
        ctx.body = { code: RET_CODE.OK, data: result };
      } else {
        ctx.body = { code: RET_CODE.ERROR, msg: result.toString() };
      }
    }

    /**
     * 修改告警用户列表
     */
    * putAlertUser() {
      const ctx = this.ctx;
      const { alertUser } = ctx.request.body;
      const result = yield ctx.service.project.updateOneByPid(
        ctx.params.pid,
        { alert_user: alertUser || '' }
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
