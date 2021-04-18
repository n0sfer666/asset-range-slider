module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:fsd/all',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'import',
    '@typescript-eslint',
  ],
  rules: {
    'no-console': ['off'],
    'import/extensions': ['off'],
    'no-unused-vars': ['off'],
    'no-undef': ['off'],
    'func-names': ['off'],
    'class-methods-use-this': ['off'],
    'prefer-destructuring': ['error', {
      array: false,
      object: true,
    }, {
      enforceForRenamedProperties: false,
    }],
  },
};
