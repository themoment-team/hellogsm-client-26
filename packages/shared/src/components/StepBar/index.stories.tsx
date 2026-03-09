import StepBar from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof StepBar> = {
  title: 'Shared/StepBar',
  component: StepBar,
};

export default meta;

type Story = StoryObj<typeof StepBar>;

export const Primary: Story = {};
