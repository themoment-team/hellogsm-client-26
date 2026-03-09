import { Header } from 'client/components';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Header> = {
  title: 'Client/Header',
  component: Header,
  args: { isServerHealthy: true },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const 서버_활성화_상태: Story = {};

export const 서버_비활성화_상태: Story = {
  args: { isServerHealthy: false },
};
