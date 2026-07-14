module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 200],
    'subject-full-stop': [0],
  },
};
