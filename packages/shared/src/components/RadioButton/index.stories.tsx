import RadioButton from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RadioButton> = {
  title: 'Client/RadioButton',
  component: RadioButton,
  args: {
    title: '성별',
    options: ['남자', '여자'],
  },
};

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Primary: Story = {
  args: {
    required: false,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    required: true,
    disabled: true,
    disabledOption: '남자',
  },
};
