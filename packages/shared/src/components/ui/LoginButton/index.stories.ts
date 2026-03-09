import { LoginButton } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoginButton> = {
  title: 'Shared/LoginButton',
  component: LoginButton,
};

export default meta;

type Story = StoryObj<typeof LoginButton>;

export const Google: Story = {
  args: {
    variant: 'google',
    children: 'Google 계정으로 로그인',
  },
};

export const Kakao: Story = {
  args: {
    variant: 'kakao',
    children: '카카오로 시작하기',
  },
};

export const Client: Story = {
  args: {
    variant: 'kakao',
    children: '카카오로 시작하기',
    className: 'w-[300px]',
  },
};
