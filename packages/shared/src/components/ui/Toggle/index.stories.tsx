import { Toggle } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Toggle> = {
  title: 'Shared/Toggle',
  component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {
  args: {
    children: 'test',
  },
};

export const Icon: Story = {
  args: {
    children: '제출 완료',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
          stroke="#94A3B8"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};
