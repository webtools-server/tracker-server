/**
 * 告警日志model
 */

module.exports = (app) => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const AlertLog = app.model.define('AlertLog', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: STRING,
      comment: '产品ID'
    },
    title: {
      type: STRING,
      comment: '日志标题'
    },
    desc: {
      type: TEXT,
      comment: '日志详情'
    }
  }, {
    tableName: 'alert_log',
    comment: '告警日志表'
  });

  return AlertLog;
};
