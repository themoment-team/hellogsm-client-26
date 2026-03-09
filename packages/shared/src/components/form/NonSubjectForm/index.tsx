'use client';

import { useEffect } from 'react';

import { FieldErrors, UseFormRegister, UseFormTrigger, get, Path } from 'react-hook-form';
import { Step4FormType } from 'types';

import { cn } from 'shared/lib/utils';

interface NonSubjectFormProps {
  register: UseFormRegister<Step4FormType>;
  trigger: UseFormTrigger<Step4FormType>;
  errors: FieldErrors<Step4FormType>;
  isFreeGrade: boolean;
  isGraduate: boolean;
  showError: boolean;
  validateForm: () => void;
}

const nonSubjectArray = [
  {
    grade: 1,
    registerIndexList: [0, 0, 3, 6, 0],
  },
  {
    grade: 2,
    registerIndexList: [1, 1, 4, 7, 1],
  },
  {
    grade: 3,
    registerIndexList: [2, 2, 5, 8, 2],
  },
] as const;

const nonSubjectTitleArray = ['결석', '지각', '조퇴', '결과', '봉사활동(시간)'] as const;

const volunteerTimeIndex = nonSubjectTitleArray.length - 1;

const itemStyle = [
  'h-full',
  'flex',
  'justify-center',
  'items-center',
  'text-sm',
  'font-semibold',
  'leading-6',
  'text-zinc-500',
];

const rowStyle = [
  'flex',
  'w-full',
  'justify-between',
  'border-x-[0.0625rem]',
  'border-b-[0.0625rem]',
  'border-zinc-200',
  'items-center',
];

const NonSubjectForm = ({
  register,
  trigger,
  errors,
  isFreeGrade,
  isGraduate,
  showError,
  validateForm,
}: NonSubjectFormProps) => {
  useEffect(() => {
    if (!showError) return;

    validateForm();
  }, [showError]);

  return (
    <div className={cn('flex', 'flex-col', 'w-full')}>
      <div
        className={cn([
          ...rowStyle,
          'bg-zinc-50',
          'rounded-t-[0.375rem]',
          'h-[3rem]',
          'border-t-[0.0625rem]',
        ])}
      >
        <h1 className={cn([...itemStyle, 'w-[6.75rem]'])}>학년</h1>
        <div className={cn('flex')}>
          {nonSubjectTitleArray.map((title, idx) => (
            <h1
              key={title}
              className={cn([
                ...itemStyle,
                idx === volunteerTimeIndex
                  ? isFreeGrade || isGraduate
                    ? 'w-[14.895625rem]'
                    : 'w-[14.875rem]'
                  : 'w-[5.625rem]',
              ])}
            >
              {title}
            </h1>
          ))}
        </div>
      </div>
      {nonSubjectArray.map(({ grade, registerIndexList }, index) => (
        <div
          key={grade}
          className={cn([
            ...rowStyle,
            'bg-white',
            'h-[3.5rem]',
            index === nonSubjectArray.length - 1 && 'rounded-b-[0.375rem]',
          ])}
        >
          <div className={cn('h-full', 'flex', 'items-center', 'justify-center')}>
            <h1 className={cn([...itemStyle, 'w-[3.75rem]'])}>{grade}</h1>
          </div>
          <div className={cn('flex')}>
            {registerIndexList.map((registerIndex, idx) => {
              const fieldPath: Path<Step4FormType> = (
                idx === 0
                  ? `absentDays.${registerIndex}`
                  : idx === 1 || idx === 2 || idx === 3
                    ? `attendanceDays.${registerIndex}`
                    : `volunteerTime.${registerIndex}`
              ) as Path<Step4FormType>;

              const hasError = Boolean(get(errors, fieldPath)) && showError;
              return (
                <div
                  key={idx}
                  className={cn([
                    ...itemStyle,
                    'px-[0.75rem]',
                    idx === volunteerTimeIndex
                      ? isFreeGrade || isGraduate
                        ? 'w-[14.895625rem]'
                        : 'w-[14.875rem]'
                      : 'w-[5.625rem]',
                  ])}
                >
                  <input
                    {...register(fieldPath, { valueAsNumber: true })}
                    type="number"
                    className={cn(
                      'w-full',
                      'h-[2rem]',
                      'text-center',
                      'placeholder:text-slate-400',
                      'text-slate-900',
                      'border-[0.0625rem]',
                      'border-slate-300',
                      'rounded-md',
                      'text-[0.875rem]',
                      'font-normal',
                      'leading-[1.25rem]',
                      'appearance-none',
                      {
                        '!border-red-600': hasError,
                      },
                    )}
                    placeholder={idx === volunteerTimeIndex ? '시간 입력' : '입력'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NonSubjectForm;
