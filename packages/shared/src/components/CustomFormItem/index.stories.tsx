import { Input } from 'shared/components';

import FormItem from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FormItem> = {
  title: 'Shared/CustomFormItem',
  component: FormItem,
};

export default meta;

type Story = StoryObj<typeof FormItem>;

export const Primary: Story = {
  args: {
    text: '이름',
    className: 'gap-1',
    children: <Input placeholder="이름 입력" />,
  },
};

export const Required: Story = {
  args: {
    text: '이름',
    className: 'gap-1',
    required: true,
    children: <Input placeholder="이름 입력" />,
  },
};
