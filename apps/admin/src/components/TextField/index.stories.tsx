import { TextField } from 'admin/components';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextField> = {
  title: 'Admin/TextField',
  component: TextField,
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Primary: Story = {};
