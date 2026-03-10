import StoryTest from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Client/StoryTest',
  component: StoryTest,
} satisfies Meta<typeof StoryTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
