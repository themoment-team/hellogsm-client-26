/* eslint-disable @typescript-eslint/naming-convention */
'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePostMockScore } from 'api';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Button, ComputerRecommendedPage, Step4Register, step4Schema } from 'shared';
import {
  GEDAchievementType,
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  MiddleSchoolAchievementType,
  Step4FormType,
  StepEnum,
} from 'types';

import { ARTS_PHYSICAL_SUBJECTS, GENERAL_SUBJECTS } from 'shared/constants';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

const graduationArray = [
  { text: '졸업 예정', value: GraduationTypeValueEnum.CANDIDATE, img: '/images/candidate.png' },
  { text: '졸업자', value: GraduationTypeValueEnum.GRADUATE, img: '/images/graduate.png' },
  { text: '검정고시', value: GraduationTypeValueEnum.GED, img: '/images/ged.png' },
];

const CalculatePage = () => {
  const { setScoreCalculationCompleteModal } = useModalStore();

  const step4UseForm = useForm<Step4FormType>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      liberalSystem: LiberalSystemValueEnum.FREE_SEMESTER,
      freeSemester: null,
    },
  });

  const [graduationType, setGraduationType] = useState<GraduationTypeValueEnum | null>(null);
  const [errorStep, setErrorStep] = useState<StepEnum | null>(null);
  const isCandidate = graduationType === GraduationTypeValueEnum.CANDIDATE;
  const isGED = graduationType === GraduationTypeValueEnum.GED;
  const isGraduate = graduationType === GraduationTypeValueEnum.GRADUATE;
  const isStep4Success = step4Schema.safeParse(step4UseForm.watch()).success;

  const { mutate: postMockScore } = usePostMockScore(graduationType!, {
    onSuccess: (data) => {
      setScoreCalculationCompleteModal(true, data, 'mock');
    },
  });

  const handleCalculateButtonClick = () => {
    const {
      liberalSystem,
      achievement1_1,
      achievement1_2,
      achievement2_1,
      achievement2_2,
      achievement3_1,
      achievement3_2,
      newSubjects,
      artsPhysicalAchievement,
      absentDays,
      attendanceDays,
      volunteerTime,
      freeSemester,
      gedAvgScore,
    } = step4UseForm.watch();

    const body: MiddleSchoolAchievementType | GEDAchievementType = isGED
      ? {
          gedAvgScore: gedAvgScore!,
        }
      : {
          liberalSystem: liberalSystem,
          achievement1_1: achievement1_1!,
          achievement1_2: achievement1_2!,
          achievement2_1: achievement2_1!,
          achievement2_2: achievement2_2!,
          achievement3_1: achievement3_1!,
          achievement3_2: achievement3_2!,
          newSubjects: newSubjects,
          artsPhysicalAchievement: artsPhysicalAchievement!,
          absentDays: absentDays!,
          attendanceDays: attendanceDays!,
          volunteerTime: volunteerTime!,
          freeSemester: freeSemester || '',
          generalSubjects: [...GENERAL_SUBJECTS],
          artsPhysicalSubjects: [...ARTS_PHYSICAL_SUBJECTS],
        };

    postMockScore(body);
  };

  const handleCalculateStepError = () => {
    setErrorStep(StepEnum.FOUR);
  };

  const clearStepError = () => {
    setErrorStep(null);
  };

  const handleCalculateClick = () => {
    if (isStep4Success) {
      handleCalculateButtonClick();
    } else {
      handleCalculateStepError();
    }
  };

  return (
    <>
      <ComputerRecommendedPage type="calculate" />
      {graduationType ? (
        <div className={cn('mdx:flex', 'justify-center', 'rounded-[1.25rem]', 'hidden')}>
          <div className={cn('mb-[3.56rem]', 'bg-white', 'mt-[3.56rem]', 'rounded-[1.25rem]')}>
            <header
              className={cn(
                'w-266',
                'flex',
                'justify-end',
                'px-7',
                'h-[4.25rem]',
                'items-center',
                'rounded-t-[1.25rem]',
                'gap-2',
                'border-b-[0.0625rem]',
                'border-gray-100',
              )}
            >
              <Button onClick={() => setGraduationType(null)} variant="ghost">
                이전
              </Button>
              <Button
                form="scoreForm"
                type="submit"
                variant={isStep4Success ? 'next' : 'submit'}
                onClick={handleCalculateClick}
              >
                내 성적 계산하기
              </Button>
            </header>
            <div className={cn('p-8', 'pt-6', 'pb-10')}>
              <Step4Register
                graduationType={graduationType}
                isCandidate={isCandidate}
                isGED={isGED}
                isGraduate={isGraduate}
                type="calculate"
                {...step4UseForm}
                showError={errorStep === StepEnum.FOUR}
                clearStepError={clearStepError}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={cn('mdx:flex', 'w-full', 'justify-center', 'mt-48', 'hidden')}>
          <div className={cn('flex', 'flex-col', 'items-center', 'gap-10')}>
            <h1 className={cn('text-[1.5rem]/[2rem]', 'text-gray-900', 'font-semibold')}>
              모의 성적 계산을 위한 지원자 유형을 선택해 주세요.
            </h1>
            <div className={cn('flex', 'gap-5', 'w-[39.4375rem]')}>
              {graduationArray.map(({ text, value, img }) => (
                <button
                  key={value}
                  className={cn(
                    'h-28',
                    'pt-5',
                    'pl-5',
                    'w-[12.3125rem]',
                    'bg-white',
                    'rounded-xl',
                    'flex',
                    'flex-col',
                    'justify-between',
                  )}
                  onClick={() => setGraduationType(value)}
                >
                  <h1
                    className={cn(
                      'text-[1rem]/[1.5rem]',
                      'text-gray-800',
                      'font-semibold',
                      'text-start',
                    )}
                  >
                    {text}
                  </h1>
                  <Image
                    src={img}
                    width={56}
                    height={56}
                    alt={text}
                    className={cn('ml-[5.81rem]')}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalculatePage;
