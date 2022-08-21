const { resolve } = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: resolve(__dirname),
      },
    },
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    'import/no-extraneous-dependencies': [
      'off',
      { devDependencies: ['sw.ts'] },
    ],
    'no-param-reassign': ['error', { props: false }],
    // typescript handled rules
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': [
      'error',
      { ts: 'never', json: 'always', vue: 'always', html: 'always' },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    'no-undef': 'off',
  },
  plugins: ['@typescript-eslint', 'vue'],
};
