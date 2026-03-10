import { Input } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Full: Story = {
  args: {
    width: 'full',
    placeholder: 'test',
  },
};

export const Medium: Story = {
  args: {
    width: 'medium',
    placeholder: 'test',
  },
};

export const Search: Story = {
  args: {
    width: 'large',
    placeholder: '검색어를 입력하세요.',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
          stroke="#71717A"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.75 15.75L12.4875 12.4875"
          stroke="#71717A"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const Blue: Story = {
  args: {
    width: 'large',
    placeholder: '검색어를 입력하세요.',
    variant: 'blueOutline',
  },
};

export const Error: Story = {
  args: {
    width: 'large',
    placeholder: '검색어를 입력하세요.',
    variant: 'blueOutline',
    errorMessage: '인증번호를 확인해 주세요.',
  },
};

export const Success: Story = {
  args: {
    width: 'large',
    placeholder: '검색어를 입력하세요.',
    variant: 'blueOutline',
    successMessage: '번호 인증이 완료되었습니다.',
  },
};
