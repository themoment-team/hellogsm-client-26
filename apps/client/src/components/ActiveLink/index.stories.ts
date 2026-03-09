import ActiveLink from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ActiveLink> = {
  title: 'Client/ActiveLink',
  component: ActiveLink,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActiveLink>;

export const Primary: Story = {
  args: {
    href: '/',
    children: '링크',
    activeClassName: 'text-red-500',
    className: 'text-blue-500',
  },
};
