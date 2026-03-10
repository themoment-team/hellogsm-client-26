import type { Preview } from "@storybook/react";
import React from "react";
import "shared/styles/globals.css";
import { pretendardFont } from "../../../packages/shared/src/fonts/pretendard";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={pretendardFont.style}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
