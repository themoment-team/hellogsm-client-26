const path = require('path');

require('@rushstack/eslint-patch/modern-module-resolution');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: [
    'react',
    'react-refresh',
    'jsx-a11y',
    'unused-imports',
    'sort-exports',
    'no-relative-import-paths',
    'import',
    'prettier',
  ],
  extends: [
    '@rushstack/eslint-config/profile/web-app',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:@cspell/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: '18',
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
        ],
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-dom', group: 'external', position: 'before' },
          { pattern: '@tanstack/react-query', group: 'external', position: 'before' },
          { pattern: 'axios', group: 'external', position: 'before' },
          { pattern: 'tailwindcss', group: 'external', position: 'before' },
          { pattern: 'admin/**', group: 'internal', position: 'before' },
          { pattern: 'client/**', group: 'internal', position: 'before' },
          { pattern: 'shared/**', group: 'internal', position: 'before' },
          { pattern: 'api/**', group: 'internal', position: 'before' },
          { pattern: 'tailwind-config/**', group: 'internal', position: 'before' },
          { pattern: 'types/**', group: 'internal', position: 'before' },
          { pattern: './**', group: 'sibling', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'unused-imports/no-unused-imports-ts': 'error',
    'no-console': 'error',
    'no-restricted-imports': ['error', { patterns: ['../'] }],

    'react/no-unknown-property': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/alt-text': ['warn', { elements: ['img'] }],
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',

    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@rushstack/typedef-var': 'off',
    'no-unused-vars': 'off',

    '@cspell/spellchecker': [
      'error',
      {
        configFile: path.resolve(__dirname, 'cspell-ignore.yaml'),
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'], // 필요에 따라 경로 수정
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
    {
      files: ['**/style.ts', '**/*.stories.tsx'],
      rules: {
        'sort-exports/sort-exports': 'off',
      },
    },
  ],
};
