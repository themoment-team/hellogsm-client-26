import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { baseConfig } from './base.js';
import { reactHooksCompilerRules } from './react-hooks-compiler.js';

/** @type {import("eslint").Linter.Config[]} */
export const reactInternalConfig = [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      ...reactHooksCompilerRules,
    },
  },
];

export default reactInternalConfig;
