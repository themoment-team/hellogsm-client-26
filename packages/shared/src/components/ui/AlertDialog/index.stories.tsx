import { AlertDialogExample } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AlertDialogExample> = {
  title: 'Shared/AlertDialog',
  component: AlertDialogExample,
};

export default meta;

type Story = StoryObj<typeof AlertDialogExample>;

export const Primary: Story = {};
