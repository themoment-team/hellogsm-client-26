const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['dist/**', 'node_modules/**', 'build/**'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'turbo', '@cspell', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@repo/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'no-console': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'turbo/no-undeclared-env-vars': 'warn',
    '@cspell/spellchecker': [
      'error',
      {
        configFile: path.resolve(__dirname, '../../cspell.config.yaml'),
      },
    ],
  },
};
