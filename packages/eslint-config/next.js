import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { baseConfig } from './base.js';
import { reactHooksCompilerRulesAsWarn } from './react-hooks-compiler.js';

/** @type {import("eslint").Linter.Config[]} */
export const nextJsConfig = [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    // @next/eslint-plugin-next는 아직 legacy 형태 preset만 제공하므로 수동 등록
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['\\.css$'] }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
      ...reactHooksCompilerRulesAsWarn,
    },
  },
];

export default nextJsConfig;
