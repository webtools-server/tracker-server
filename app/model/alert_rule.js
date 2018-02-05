/**
 * 告警规则model
 */

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  const AlertRule = app.model.define('AlertRule', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: STRING,
      comment: '产品ID'
    },
    type: {
      type: INTEGER,
      comment: '规则类型'
    },
    title: {
      type: STRING,
      comment: '规则名称'
    },
    field_name: {
      type: STRING,
      comment: '字段名称'
    },
    field_action: {
      type: INTEGER,
      comment: '字段运算'
    },
    field_value: {
      type: STRING,
      comment: '字段值'
    },
    stat_type: {
      type: INTEGER,
      comment: '统计类型'
    },
    stat_action: {
      type: INTEGER,
      comment: '统计运算'
    },
    stat_value: {
      type: STRING,
      comment: '统计值'
    }
  }, {
    tableName: 'alert_rule',
    comment: '告警规则表'
  });

  return AlertRule;
};
