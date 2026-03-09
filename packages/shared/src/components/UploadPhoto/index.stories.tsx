import UploadPhoto from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UploadPhoto> = {
  title: 'Shared/UploadPhoto',
  component: UploadPhoto,
};

export default meta;

type Story = StoryObj<typeof UploadPhoto>;

export const Primary: Story = {};
