module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint', 'jest'
  ],
  rules: {
    'no-use-before-define': 0,
    'no-unused-vars': 'off',
    // note you must disable the base rule as it can report incorrect errors
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error']
  }
}
