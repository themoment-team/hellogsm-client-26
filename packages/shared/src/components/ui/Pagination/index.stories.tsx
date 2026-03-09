import { PaginationExample } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PaginationExample> = {
  title: 'Shared/Pagination',
  component: PaginationExample,
};

export default meta;

type Story = StoryObj<typeof PaginationExample>;

export const Primary: Story = {};
