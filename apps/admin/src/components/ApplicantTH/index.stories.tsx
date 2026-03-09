import { ApplicantTH } from 'admin/components';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Admin/ApplicantTH',
  component: ApplicantTH,
} satisfies Meta<typeof ApplicantTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
