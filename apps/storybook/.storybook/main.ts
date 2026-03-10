import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../apps/client/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../apps/admin/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/shared/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: "../../admin/next.config.js",
    },
  },
  staticDirs: ["../../admin/public", "../../client/public", "../../../packages/shared/public"],
  babel: async (config) => ({
    ...config,
    presets: [
      [
        "next/babel",
        {
          "preset-react": {
            runtime: "automatic",
            importSource: "@emotion/react",
          },
        },
      ],
    ],
  }),
};
export default config;
