import { DialogExample } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DialogExample> = {
  title: 'Shared/Dialog',
  component: DialogExample,
};

export default meta;

type Story = StoryObj<typeof DialogExample>;

export const Google: Story = {};
