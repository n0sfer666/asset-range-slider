module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:import/typescript',
    'plugin:fsd/all',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: [
    'import',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    'prefer-destructuring': ['error', { 'object': true, 'array': false }],
  },
};
