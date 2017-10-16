/**
 * sql query
 */

const { SQL_CONDITION_TYPE } = require('../common/enum');

/**
 * 根据传参获取查询条件
 * @param {Object} query
 * @param {Array} fields [{name: 'platform', type: 1}]
 */
function getConditionByQuery(query, fields) {
  return fields.reduce((arr, field) => {
    const currentField = query[field.name];

    if (currentField) {
      switch (field.type) {
        case SQL_CONDITION_TYPE.NORMAL: {
          arr.push([`op_params.${field.name}`, currentField]);
          break;
        }
        case SQL_CONDITION_TYPE.LIKE: {
          if (field.like) {
            arr.push([`op_params.${field.like}`, { $like: `%${(fields.prefix || '') + currentField}%` }]);
          } else {
            arr.push([`op_params.${field.name}`, { $like: `%${currentField}%` }]);
          }
          break;
        }
        case SQL_CONDITION_TYPE.GTE: {
          arr.push([`op_params.${field.compare}`, { $gte: currentField }]);
          break;
        }
        case SQL_CONDITION_TYPE.LTE: {
          arr.push([`op_params.${field.compare}`, { $lte: currentField }]);
          break;
        }
        default:
          break;
      }
    }
    return arr;
  }, []);
}

module.exports = {
  getConditionByQuery
};
