import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import { ApplicantTR } from 'admin/components';

import { EditabilityType, OneseoListType, OneseoType } from 'types/oneseo';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Admin/ApplicantTR',
  component: ApplicantTR,
} satisfies Meta<typeof ApplicantTR>;

export default meta;
type Story = StoryObj<typeof meta>;

interface ApplicationTRProps extends OneseoType {
  editableData: EditabilityType | undefined;
  oneseoRefetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<OneseoListType, Error>>;
  editableRefetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<EditabilityType, Error>>;
  is역량검사처리기간: boolean;
  is심층면접처리기간: boolean;
}

const oneseoFakeRefetch: (options?: any) => any = async (options) => {
  return {
    data: undefined as unknown as OneseoListType,
    error: undefined as unknown as Error,
    isLoading: false,
    isError: false,
    status: 'idle',
  };
};

const editableFakeRefetch: (options?: any) => any = async (options) => {
  return {
    data: undefined as unknown as EditabilityType,
    error: undefined as unknown as Error,
    isLoading: false,
    isError: false,
    status: 'idle',
  };
};

const MockData: ApplicationTRProps = {
  memberId: 0,
  submitCode: '',
  realOneseoArrivedYn: 'YES',
  name: '홍길동',
  screening: 'GENERAL',
  schoolName: '',
  phoneNumber: '010 1234 5678',
  guardianPhoneNumber: '010 1234 5678',
  schoolTeacherPhoneNumber: '010 1234 5678',
  firstTestPassYn: 'YES',
  competencyEvaluationScore: 100,
  interviewScore: 100,
  secondTestPassYn: 'YES',
  examinationNumber: 1101,
  oneseoRefetch: oneseoFakeRefetch,
  entranceIntentionYn: 'YES',
  editableData: { oneseoEditability: true },
  editableRefetch: editableFakeRefetch,
  is역량검사처리기간: true,
  is심층면접처리기간: true,
};

export const Primary: Story = {
  args: MockData,
};
