import type { Config } from 'tailwindcss';

import sharedConfig from '@repo/tailwind-config/tailwind';

const config: Config = {
  ...sharedConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme?.extend,
      backgroundImage: {
        slash: "url('/images/slash.svg')",
        backslash: "url('/images/back-slash.svg')",
      },
    },
  },
};

export default config;
