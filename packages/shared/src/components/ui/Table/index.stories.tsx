import { TableExample } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TableExample> = {
  title: 'Shared/Table',
  component: TableExample,
};

export default meta;

type Story = StoryObj<typeof TableExample>;

export const Primary: Story = {};
