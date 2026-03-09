import TeamSection1 from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TeamSection1> = {
  title: 'Client/TeamPage/Section1',
  component: TeamSection1,
};

export default meta;

type Story = StoryObj<typeof TeamSection1>;

export const Primary: Story = {};
