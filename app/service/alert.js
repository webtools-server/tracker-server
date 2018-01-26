/**
 * 告警service
 */

const { TRACKER_TYPE } = require('../common/enum');

const MAX_LIMIT = 100;

module.exports = (app) => {
  class AlertService extends app.Service {
    * getDataByType(type) {
      const sqlObj = {
        where: [
          ['op_type', 'error'],
          ['op_params.t_type', type]
        ],
        limit: MAX_LIMIT,
        order: [['@timestamp', 'desc']]
      };

      switch (type) {
        case TRACKER_TYPE.ERROR: {
          const jsondata = yield this.ctx.service.error.query(sqlObj);
          return this.normalizeData(jsondata);
        }
        case TRACKER_TYPE.API: {
          const jsondata = yield this.ctx.service.api.query(sqlObj);
          return this.normalizeData(jsondata);
        }
        case TRACKER_TYPE.PERF: {
          const jsondata = yield this.ctx.service.perf.query(sqlObj);
          return this.normalizeData(jsondata);
        }
        default:
          return this.normalizeData();
      }
    }

    normalizeData(jsondata = {}) {
      return !jsondata.error ? { total: jsondata.total, list: jsondata.list } : { total: 0, list: [] };
    }

    * calcAlertRule() {
      const defaultOrder = [['id', 'DESC']];
      // 获取项目
      const projects = yield this.ctx.model.Project.findAll({
        order: defaultOrder
      });
      if (Array.isArray(projects)) {
        // 过滤没有设置告警联系人的记录
        const alertProject = projects.filter(project => project.alert_user);
        // 获取规则对象
        const alertRule = alertProject.reduce((obj, project) => {
          obj[project.pid] = this.ctx.model.AlertRule.findAll({ where: { pid: project.pid } });
          return obj;
        }, {});
        // 获取bi数据
        const errorData = yield this.getDataByType(TRACKER_TYPE.API);
        // return yield alertRule;
        return {
          alertRule: yield alertRule,
          errorData
        };
      }
      return {};
    }
  }
  return AlertService;
};
