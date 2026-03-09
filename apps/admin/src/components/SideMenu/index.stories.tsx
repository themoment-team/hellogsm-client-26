import SideMenu from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Admin/SideMenu',
  component: SideMenu,
} satisfies Meta<typeof SideMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    testResultTag: 'ALL',
    setTestResultTag: () => {},
  },
};
