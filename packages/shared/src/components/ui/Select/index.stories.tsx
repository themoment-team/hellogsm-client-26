import { SelectExample } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SelectExample> = {
  title: 'Shared/Select',
  component: SelectExample,
};

export default meta;

type Story = StoryObj<typeof SelectExample>;

export const example: Story = {};
