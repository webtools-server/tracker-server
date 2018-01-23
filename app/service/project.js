/**
 * project service
 */

const util = require('../common/util');
const { PAGE_NUM } = require('../common/config');

module.exports = (app) => {
  class ProjectService extends app.Service {
    * createOne(data) {
      const proj = yield this.findOneByPid(data.pid);
      if (proj) {
        return new Error(`${data.pid}已经存在`);
      }
      return yield this.ctx.model.Project.create(data);
    }

    * findOneByPid(pid) {
      return (yield this.ctx.model.Project.findOne({ where: { pid } }));
    }

    * findAndCountAll(where, offset, limit, order) {
      const defaultOrder = [['id', 'DESC']];

      // 如果第一个参数为布尔值，返回所有数据
      if (util.isBoolean(where)) {
        return yield this.ctx.model.Project.findAndCountAll({ order: defaultOrder });
      }

      if (!util.isObject(where)) {
        order = limit;
        limit = offset;
        offset = where || 0;
        where = {};
      }

      return yield this.ctx.model.Project.findAndCountAll({
        where,
        offset,
        limit: limit || PAGE_NUM,
        order: order || defaultOrder
      });
    }

    * updateOneByPid(pid, data) {
      const proj = yield this.findOneByPid(pid);
      const newProj = yield this.findOneByPid(data.pid);

      if (newProj && pid !== newProj.pid) {
        return new Error(`${data.pid}已经存在`);
      }

      if (!proj) {
        return new Error(`${pid}不存在`);
      }

      try {
        yield this.ctx.model.Project.update(data, { where: { pid } });
        return data;
      } catch (e) {
        return e;
      }
    }

    * deleteOneByPid(pid) {
      return yield this.ctx.model.Project.destroy({ where: { pid } });
    }
  }

  return ProjectService;
};
