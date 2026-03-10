import { Button } from 'shared';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/Test',
  component: Button,
  //   argTypes: {
  //     children: { control: "text", defaultValue: "Button" },
  //     variant: { control: "select" },
  //     onClick: { action: "clicked", type: "function" },
  //   },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Test',
  },
};
