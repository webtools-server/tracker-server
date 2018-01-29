/**
 * 告警service
 */

const { TRACKER_TYPE } = require('../common/enum');
const comAction = require('../data/action');
const dataType = require('../data/type');

const MAX_LIMIT = 100;

module.exports = (app) => {
  class AlertService extends app.Service {
    /**
     * 根据类型获取数据
     * @param {String} type
     */
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

    /**
     * 数据处理
     * @param {Object} jsondata
     */
    normalizeData(jsondata = {}) {
      return !jsondata.error ? { total: jsondata.total, list: jsondata.list } : { total: 0, list: [] };
    }

    /**
     * 执行规则
     * @param {Object} data
     * @param {Object} rule
     */
    runRule(data, rule) {
      // 字段值
      const fieldValue = data[rule.field_name];
      if (fieldValue === undefined) {
        return false;
      }
      return this.useAction(rule.field_action, fieldValue, rule.field_value);
    }

    /**
     * 执行运算
     * @param {String|Number} ruleAction 规则运算
     * @param {String|Number} fieldValue 字段值
     * @param {String|Number} ruleFieldValue 规则字段值
     */
    useAction(ruleAction, fieldValue, ruleFieldValue) {
      const actionEnum = comAction.actionEnum;
      // to string
      const fieldValueStr = String(fieldValue);
      const ruleFieldValueStr = String(ruleFieldValue);

      switch (String(ruleAction)) {
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

    /**
     * 获取命中规则
     * @param {Object} rules 所有项目规则
     * @param {Object} result 结果
     */
    getHitRule(rules, result) {
      const hitRule = {};
      const ruleType = dataType.ruleType;

      for (const k in rules) {
        const currRule = result[k];
        if (currRule) {
          hitRule[k] = rules[k].filter((rule) => {
            const ruleCalcValue = currRule[rule.id];
            if (ruleCalcValue === undefined) {
              return false;
            }

            const statTypeStr = String(rule.stat_type);
            // 数值
            let num = 0;
            // 统计类型
            switch (statTypeStr) {
              case ruleType.total.value: // 总数
                num = ruleCalcValue;
                break;
              case ruleType.ratio.value: // 比例
                num = Math.round((ruleCalcValue / MAX_LIMIT) * 100);
                break;
              default:
                return false;
            }
            return this.useAction(rule.stat_action, num, rule.stat_value);
          });
        }
      }
      return hitRule;
    }

    /**
     * 在数据中执行规则
     * @param {String} trackerType tracker类型
     * @param {Object} alertRule 告警规则
     * @param {Object} ruleResult 规则执行结果
     */
    * runRuleInData(trackerType, alertRule, ruleResult) {
      // 数据
      const dataCollection = yield this.getDataByType(trackerType);
      // 执行类型规则
      dataCollection.list.forEach((ed) => {
        for (const k in alertRule) {
          const currProj = alertRule[k];

          currProj.filter(r => r.type == trackerType).forEach((rule) => {
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
    }

    /**
     * 计算告警规则
     */
    * calcAlertRule() {
      try {
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
          // 执行错误类型规则
          yield this.runRuleInData(TRACKER_TYPE.ERROR, alertRule, ruleResult);
          // 执行接口类型规则
          yield this.runRuleInData(TRACKER_TYPE.API, alertRule, ruleResult);
          // 执行性能类型规则
          yield this.runRuleInData(TRACKER_TYPE.PERF, alertRule, ruleResult);
          // 获取命中规则
          const hitRule = this.getHitRule(alertRule, ruleResult);
          // 发送告警
          yield this.sendAlertMsg(hitRule);
          return { hitRule };
        }
        return {};
      } catch (e) {
        return e;
      }
    }

    /**
     * 发送告警信息
     * @param {Object} hitRule 命中的规则
     */
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
