/**
 * 告警规则service
 */

module.exports = (app) => {
  class AlertRuleService extends app.Service {
    * createOne(data) {
      return yield this.ctx.model.AlertRule.create(data);
    }

    * findAll(where) {
      return yield this.ctx.model.AlertRule.findAll({
        where,
        order: [['id', 'DESC']]
      });
    }

    * updateOneById(id, data) {
      try {
        yield this.ctx.model.AlertRule.update(data, { where: { id } });
        return data;
      } catch (e) {
        return e;
      }
    }

    * deleteOneById(id) {
      return yield this.ctx.model.AlertRule.destroy({ where: { id } });
    }
  }
  return AlertRuleService;
};
