'use client';

import { XIcon } from 'lucide-react';
import { useEffect } from 'react';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  get,
  useWatch,
} from 'react-hook-form';

import { ACHIEVEMENT_FIELD_LIST, GENERAL_SCORE_VALUES, GENERAL_SUBJECTS } from '@repo/constants';
import { AchievementType, FreeSemesterValueEnum, SemesterIdType, Step4FormType } from '@repo/types';
import { cn } from '@repo/utils';

import { PinIcon } from '../../../icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shadcn';

const defaultSubjectLength = GENERAL_SUBJECTS.length;

interface FreeSemesterFormProps {
  subjectArray: string[];
  subjectKeys: string[];
  setValue: UseFormSetValue<Step4FormType>;
  register: UseFormRegister<Step4FormType>;
  control: Control<Step4FormType>;
  handleDeleteSubjectClick: (idx: number) => void;
  freeSemester: FreeSemesterValueEnum | null;
  achievementList: AchievementType[];
  isGraduate: boolean;
  showError: boolean;
  errors: FieldErrors<Step4FormType>;
  getValues: UseFormGetValues<Step4FormType>;
  validateForm: () => void;
}

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

const freeSemesterButtonStyle = [
  'border-[0.0625rem]',
  'py-[0.25rem]',
  'px-[0.625rem]',
  'rounded-[6.25rem]',
  'text-sm',
  'font-medium',
  'leading-5',
  'text-slate-400',
  'border-slate-200',
  'flex',
  'items-center',
  'gap-[0.38rem]',
];

const freeSemesterToAchievementField: Record<FreeSemesterValueEnum, SemesterIdType> = {
  [FreeSemesterValueEnum['1-1']]: 'achievement1_1',
  [FreeSemesterValueEnum['1-2']]: 'achievement1_2',
  [FreeSemesterValueEnum['2-1']]: 'achievement2_1',
  [FreeSemesterValueEnum['2-2']]: 'achievement2_2',
  [FreeSemesterValueEnum['3-1']]: 'achievement3_1',
  [FreeSemesterValueEnum['3-2']]: 'achievement3_2',
};

const FreeSemesterForm = ({
  register,
  subjectArray,
  subjectKeys,
  setValue,
  control,
  handleDeleteSubjectClick,
  freeSemester,
  achievementList,
  isGraduate,
  errors,
  showError,
  getValues,
  validateForm,
}: FreeSemesterFormProps) => {
  // 렌더 중 구독은 watch() 대신 useWatch 사용 (React Compiler 호환)
  // 훅은 map 안에서 호출할 수 없으므로 학기별 배열 전체를 한 번 구독하고 인덱싱한다
  const achievements = useWatch({ control, name: ACHIEVEMENT_FIELD_LIST });

  // 표 전체 폭은 44.25rem(708px) 고정 — 과목명 6.75rem + 학기 영역 37.5rem
  // 학기 열은 37.5rem을 학기 수로 나눈 값이다 (졸업자 6학기, 재학생 5학기)
  const columnWidth = isGraduate ? 'w-[6.25rem]' : 'w-[7.5rem]';

  useEffect(() => {
    setTimeout(
      () =>
        ACHIEVEMENT_FIELD_LIST.forEach((field) => {
          if (
            achievementList.some((freeGrade) => freeGrade.field === field) &&
            !(freeSemester && field === freeSemesterToAchievementField[freeSemester])
          ) {
            setValue(field, getValues(field) || []);
          } else {
            setValue(field, null);
          }
        }),
      0,
    );
  }, []);

  useEffect(() => {
    achievementList.forEach(({ field }) => {
      if (freeSemester && field === freeSemesterToAchievementField[freeSemester]) {
        setValue(field, null);
      } else {
        setValue(field, getValues(field) || undefined!);
      }
    });
  }, [freeSemester]);

  useEffect(() => {
    if (!showError) return;
    validateForm();
  }, [showError]);

  return (
    <div className={cn('flex', 'flex-col')}>
      <div
        className={cn([
          ...rowStyle,
          'bg-zinc-50',
          'rounded-t-[0.375rem]',
          'h-[3rem]',
          'border-t-[0.0625rem]',
          'justify-between',
        ])}
      >
        <h1 className={cn([...itemStyle, 'w-[6.75rem]'])}>과목명</h1>
        <div className={cn('flex')}>
          {achievementList.map(({ title }) => (
            <h1 key={title} className={cn([...itemStyle, columnWidth])}>
              {title}
            </h1>
          ))}
        </div>
      </div>

      <div className={cn([...rowStyle, 'bg-white', 'h-[3.5rem]'])}>
        <h1 className={cn([...itemStyle, 'w-[6.75rem]'])}>자유학기제</h1>
        <div className={cn('flex')}>
          {achievementList.map(({ value, field }) => (
            <div key={field} className={cn([...itemStyle, columnWidth])}>
              {freeSemester === value ? (
                <button
                  className={cn([
                    ...freeSemesterButtonStyle,
                    'border-emerald-500',
                    'text-emerald-500',
                  ])}
                  type="button"
                  onClick={() => {
                    setValue('freeSemester', null);
                    validateForm();
                  }}
                >
                  <PinIcon type="ON" />
                  on
                </button>
              ) : (
                <button
                  className={cn([
                    ...freeSemesterButtonStyle,
                    showError && errors.freeSemester && !isGraduate && '!border-red-600',
                  ])}
                  type="button"
                  onClick={() => {
                    setValue('freeSemester', value!);
                    validateForm();
                  }}
                >
                  <PinIcon type="OFF" />
                  off
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {subjectArray.map((subject, idx) => {
        const dynamicIndex = idx - defaultSubjectLength;

        const newSubjectHasError = Boolean(get(errors, `newSubjects.${dynamicIndex}`));
        const isNewSubjectError = newSubjectHasError && showError && '!border-red-600';
        return (
          <div
            key={subjectKeys[idx] ?? idx}
            className={cn([
              ...rowStyle,
              'bg-white',
              'h-[3.5rem]',
              'relative',
              idx === subjectArray.length - 1 && 'rounded-b-[0.375rem]',
            ])}
          >
            <div className={cn('h-full', 'w-[6.75rem]', 'flex', 'items-center', 'justify-center')}>
              {idx < defaultSubjectLength ? (
                <h1 className={cn([...itemStyle, 'w-full', 'w-[6.75rem]'])}>{subject}</h1>
              ) : (
                <input
                  type="text"
                  className={cn(
                    'w-[5.25rem]',
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
                    isNewSubjectError,
                  )}
                  {...register(`newSubjects.${idx - defaultSubjectLength}`)}
                />
              )}
            </div>
            <div className={cn('flex', 'items-center')}>
              {achievementList.map(({ value, field }) => {
                const score = achievements[ACHIEVEMENT_FIELD_LIST.indexOf(field)]?.[idx];

                const subjectHasError = score === undefined || score === null;
                const isSubjectError = subjectHasError && showError && '!border-red-600';

                return (
                  <div key={field} className={cn([...itemStyle, columnWidth])}>
                    {freeSemester === value ? (
                      <div
                        className={cn(
                          'px-[0.25rem]',
                          'py-[0.125rem]',
                          'text-gray-500',
                          'text-sm',
                          'font-medium',
                          'leading-5',
                          'rounded-[0.25rem]',
                          'bg-gray-100',
                        )}
                      >
                        자유학기제
                      </div>
                    ) : (
                      <div className={cn(columnWidth, 'flex', 'justify-center')}>
                        <Select
                          onValueChange={(value) => {
                            const prev = getValues(field) || [];
                            const next = [...prev];

                            while (next.length <= idx) {
                              next.push(undefined!);
                            }

                            next[idx] = Number(value);

                            setValue(field, next, { shouldDirty: true, shouldValidate: true });
                          }}
                          value={Number.isInteger(score) ? String(score) : ''}
                        >
                          <SelectTrigger
                            className={cn(
                              'w-[5.475rem]',
                              'h-[2rem]',
                              'text-sm',
                              'font-normal',
                              'leading-5',
                              'bg-white',
                              'data-[placeholder]:text-slate-500',
                              'text-slate-900',
                              'px-[0.5rem]',
                              'border-slate-300',
                              isSubjectError,
                            )}
                          >
                            <SelectValue placeholder="성적 입력" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENERAL_SCORE_VALUES.map(({ name, value }, idx) => (
                              <SelectItem value={String(value)} key={idx}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {idx >= defaultSubjectLength && (
              <button
                className={cn('absolute', 'right-[-1.97rem]')}
                onClick={() => handleDeleteSubjectClick(idx)}
              >
                <XIcon className={cn('stroke-slate-300', 'w-[1rem]', 'hover:stroke-slate-500')} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FreeSemesterForm;
