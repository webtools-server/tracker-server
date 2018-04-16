
// had enabled by egg
exports.static = true;

exports.validate = {
  enable: true,
  package: 'egg-validate'
};

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};

exports.viewJyb = {
  enable: true,
  package: '@jyb/egg-view-jyb',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
};
