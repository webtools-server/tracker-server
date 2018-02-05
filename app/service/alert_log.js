/**
 * 告警日志service
 */

const { PAGE_NUM } = require('../common/config');

module.exports = (app) => {
  class AlertLogService extends app.Service {
    * createOne(data) {
      return yield this.ctx.model.AlertLog.create(data);
    }

    * findAndCountAll(where, offset, limit, order) {
      const defaultOrder = [['id', 'DESC']];

      return yield this.ctx.model.AlertLog.findAndCountAll({
        where,
        offset,
        limit: limit || PAGE_NUM,
        order: order || defaultOrder
      });
    }

    * deleteOneById(id) {
      return yield this.ctx.model.AlertLog.destroy({ where: { id } });
    }
  }
  return AlertLogService;
};
