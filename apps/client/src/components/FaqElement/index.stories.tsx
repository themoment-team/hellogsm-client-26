import FaqElement from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FaqElement> = {
  title: 'Client/FaqElement',
  component: FaqElement,
  args: {
    title: '최종합격하려면 중학교 내신 성적이 몇 %가 되어야 하나요?',
    content:
      '지원자들의 상황이 매년 달라지기 때문에 합격을 전제로 한 정확한 커트라인은 예측할 수 없습니다. 다만 중학교 내신 20~30% 정도는 합격권이라고 생각하시면 됩니다.2차에서 내신성적 50%와 역량검사 50%로 이루어지기 때문에 역량검사 점수에 따라 등수가 바뀌기도 합니다.',
    keyword: '최종',
  },
};

export default meta;

type Story = StoryObj<typeof FaqElement>;

export const Primary: Story = {};
