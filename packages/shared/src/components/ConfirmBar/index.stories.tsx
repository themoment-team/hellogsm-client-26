import ConfirmBar from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ConfirmBar> = {
  title: 'Shared/ConfirmBar',
  component: ConfirmBar,
};

export default meta;

type Story = StoryObj<typeof ConfirmBar>;

export const Primary: Story = {};
