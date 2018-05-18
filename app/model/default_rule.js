/**
 * 默认规则model
 */

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  const DefaultRule = app.model.define('DefaultRule', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: INTEGER,
      comment: '规则类型'
    },
    title: {
      type: STRING,
      comment: '规则名称'
    },
    minutes: {
      type: INTEGER,
      defaultValue: 5
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
    tableName: 'default_rule',
    comment: '默认规则表'
  });

  return DefaultRule;
};
