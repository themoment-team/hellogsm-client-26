'use client';

import { useEffect } from 'react';

import { XIcon } from 'lucide-react';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  get,
} from 'react-hook-form';
import { AchievementType, Step4FormType } from 'types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/components/ui';
import { GENERAL_SUBJECTS, GENERAL_SCORE_VALUES, ACHIEVEMENT_FIELD_LIST } from 'shared/constants';
import { cn } from 'shared/lib/utils';

const defaultSubjectLength = GENERAL_SUBJECTS.length;

interface FreeGradeFormProps {
  subjectArray: string[];
  control: Control<Step4FormType>;
  setValue: UseFormSetValue<Step4FormType>;
  register: UseFormRegister<Step4FormType>;
  watch: UseFormWatch<Step4FormType>;
  handleDeleteSubjectClick: (idx: number) => void;
  errors: FieldErrors<Step4FormType>;
  achievementList: AchievementType[];
  isGraduate: boolean;
  showError: boolean;
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

const FreeGradeForm = ({
  subjectArray,
  setValue,
  register,
  watch,
  handleDeleteSubjectClick,
  errors,
  achievementList,
  isGraduate,
  showError,
  getValues,
  validateForm,
}: FreeGradeFormProps) => {
  useEffect(() => {
    setTimeout(
      () =>
        ACHIEVEMENT_FIELD_LIST.forEach((field) => {
          const hasField = achievementList.some((freeGrade) => freeGrade.field === field);
          if (hasField) {
            setValue(field, watch(field) || []);
          } else {
            setValue(field, null);
          }
        }),
      0,
    );
  }, []);

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
        ])}
      >
        <h1 className={cn([...itemStyle, 'w-[6.75rem]'])}>과목명</h1>
        <div className={cn('flex')}>
          {achievementList.map(({ title }) => (
            <h1
              key={title}
              className={cn([...itemStyle, isGraduate ? 'w-[9.34rem]' : 'w-[12.46rem]'])}
            >
              {title}
            </h1>
          ))}
        </div>
      </div>
      {subjectArray.map((subject, idx) => {
        const dynamicIndex = idx - defaultSubjectLength;

        const newSubjectHasError = Boolean(get(errors, `newSubjects.${dynamicIndex}`));
        const isNewSubjectError = newSubjectHasError && showError && '!border-red-600';
        return (
          <div
            key={subject}
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
                <h1 className={cn([...itemStyle, 'w-full'])}>{subject}</h1>
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
            <div className={cn('flex')}>
              {achievementList.map(({ field }) => {
                const score = watch(`${field}.${idx}`);

                const subjectHasError = score === undefined || score === null;

                const isSubjectError = subjectHasError && showError && '!border-red-600';
                return (
                  <div key={field} className={cn([...itemStyle, 'mx-4'])}>
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
                      defaultValue={Number.isInteger(score) ? String(score) : ''}
                    >
                      <SelectTrigger
                        className={cn(
                          isGraduate ? 'w-[7.34375rem]' : 'w-[10.46rem]',
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
                        <SelectValue placeholder="성적 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENERAL_SCORE_VALUES.map(({ name, value }) => (
                          <SelectItem value={String(value)} key={value}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default FreeGradeForm;
