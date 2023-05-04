module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint-config-airbnb-base'],
  rules: {
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
  },
};
