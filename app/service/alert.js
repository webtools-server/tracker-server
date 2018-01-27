/**
 * 告警service
 */

const { TRACKER_TYPE } = require('../common/enum');
const comAction = require('../data/action');

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

    runRule(data, rule) {
      const actionEnum = comAction.actionEnum;
      // 字段值
      const fieldValue = data[rule.field_name];
      if (fieldValue === undefined) {
        return false;
      }

      // to string
      const fieldValueStr = String(fieldValue);
      const ruleFieldValueStr = String(rule.field_value);

      switch (String(rule.field_action)) {
        case actionEnum.lt: // 小于
          return fieldValueStr < ruleFieldValueStr;
        case actionEnum.lte: // 小于等于
          return fieldValueStr <= ruleFieldValueStr;
        case actionEnum.gt: // 大于
          return fieldValueStr > ruleFieldValueStr;
        case actionEnum.gte: // 大于等于
          return fieldValueStr >= ruleFieldValueStr;
        case actionEnum.eq: // 等于
          return fieldValueStr === ruleFieldValueStr;
        case actionEnum.neq: // 不等于
          return fieldValueStr !== ruleFieldValueStr;
        case actionEnum.ct: // 包含
          return fieldValueStr.indexOf(ruleFieldValueStr) > -1;
        case actionEnum.nct: // 不包含
          return fieldValueStr.indexOf(ruleFieldValueStr) === -1;
        default: return false;
      }
    }

    getHitRule(rules, result) {
      const actionEnum = comAction.actionEnum;
      const hitRule = {};

      // const
      const STAT_TYPE = {
        TOTAL: 1,
        RATIO: 2
      };

      for (const k in rules) {
        const currRule = result[k];
        if (currRule) {
          hitRule[k] = rules[k].filter((rule) => {
            const ruleCalcValue = currRule[rule.id];
            if (ruleCalcValue === undefined) {
              return false;
            }

            // 数值
            let num = 0;
            // 统计类型
            switch (rule.stat_type) {
              case STAT_TYPE.TOTAL:
                num = ruleCalcValue;
                break;
              case STAT_TYPE.RATIO:
                num = Math.round((ruleCalcValue / MAX_LIMIT) * 100);
                break;
              default:
                return false;
            }

            num = String(num);
            switch (String(rule.stat_action)) {
              case actionEnum.lt: // 小于
                return num < rule.stat_value;
              case actionEnum.lte: // 小于等于
                return num <= rule.stat_value;
              case actionEnum.gt: // 大于
                return num > rule.stat_value;
              case actionEnum.gte: // 大于等于
                return num >= rule.stat_value;
              case actionEnum.eq: // 等于
                return num === rule.stat_value;
              case actionEnum.neq: // 不等于
                return num !== rule.stat_value;
              case actionEnum.ct: // 包含
                return num.indexOf(rule.stat_value) > -1;
              case actionEnum.nct: // 不包含
                return num.indexOf(rule.stat_value) === -1;
              default: return false;
            }
          });
        }
      }
      return hitRule;
    }

    * calcAlertRule() {
      const defaultOrder = [['id', 'DESC']];
      // 获取项目
      const projects = yield this.ctx.model.Project.findAll({
        order: defaultOrder
      });
      if (Array.isArray(projects)) {
        const ruleResult = {};

        // 过滤没有设置告警联系人的记录
        const alertProject = projects.filter(project => project.alert_user);
        // 获取规则对象
        const alertRule = yield alertProject.reduce((obj, project) => {
          obj[project.pid] = this.ctx.model.AlertRule.findAll({ where: { pid: project.pid } });
          ruleResult[project.pid] = {};
          return obj;
        }, {});
        // 错误数据
        const errorData = yield this.getDataByType(TRACKER_TYPE.ERROR);
        // 执行错误类型规则
        errorData.list.forEach((ed) => {
          for (const k in alertRule) {
            const currProj = alertRule[k];

            currProj.filter(r => r.type == TRACKER_TYPE.ERROR).forEach((rule) => {
              const res = this.runRule(ed, rule);
              if (res) {
                if (ruleResult[k][rule.id] === undefined) {
                  ruleResult[k][rule.id] = 1;
                } else {
                  ruleResult[k][rule.id]++;
                }
              }
            });
          }
        });
        // 接口数据
        const apiData = yield this.getDataByType(TRACKER_TYPE.API);
        // 执行接口类型规则
        apiData.list.forEach((ed) => {
          for (const k in alertRule) {
            const currProj = alertRule[k];

            currProj.filter(r => r.type == TRACKER_TYPE.API).forEach((rule) => {
              const res = this.runRule(ed, rule);
              if (res) {
                if (ruleResult[k][rule.id] === undefined) {
                  ruleResult[k][rule.id] = 1;
                } else {
                  ruleResult[k][rule.id]++;
                }
              }
            });
          }
        });
        // 获取命中规则
        const hitRule = this.getHitRule(alertRule, ruleResult);
        // 发送告警
        yield this.sendAlertMsg(hitRule);

        return {
          hitRule,
          // ruleResult,
          // alertRule,
          // errorData
        };
      }
      return {};
    }

    * sendAlertMsg(hitRule) {
      for (const k in hitRule) {
        const currRule = hitRule[k];
        if (Array.isArray(currRule) && currRule.length > 0) {
          yield this.ctx.service.sendMsg.send(
            'canye.wu@jyblife.com',
            `项目${k}命中${currRule.length}条告警规则`,
            JSON.stringify(currRule)
          );
        }
      }
    }
  }
  return AlertService;
};
