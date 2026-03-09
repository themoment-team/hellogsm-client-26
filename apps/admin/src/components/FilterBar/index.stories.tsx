import { FilterBar } from 'admin/components';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Admin/FilterBar',
  component: FilterBar,
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    keyword: '',
    setKeyword: () => {},
    isSubmitted: 'NO',
    setIsSubmitted: () => {},
    screeningTag: 'GENERAL',
    setScreeningTag: () => {},
    isAfterFirstResults: true,
    isAfterSecondResults: false,
  },
};
