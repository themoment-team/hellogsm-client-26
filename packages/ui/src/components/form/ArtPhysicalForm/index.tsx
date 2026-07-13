'use client';

import { useEffect } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import {
  ART_PHYSICAL_SCORE_VALUES,
  getArtPhysicalArray,
  getArtPhysicalIndexArray,
} from '@repo/constants';
import { GraduationTypeValueEnum, Step4FormType, FreeSemesterValueEnum } from '@repo/types';
import { cn } from '@repo/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shadcn';

interface ArtPhysicalFormProps {
  freeSemester: FreeSemesterValueEnum | null;
  setValue: UseFormSetValue<Step4FormType>;
  watch: UseFormWatch<Step4FormType>;
  isFreeGrade: boolean;
  isFreeSemester: boolean;
  isGraduate: boolean;
  graduationType: GraduationTypeValueEnum.CANDIDATE | GraduationTypeValueEnum.GRADUATE;
  showError: boolean;
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

const getFreeSemesterIndices = (semester: FreeSemesterValueEnum | null, isGraduate: boolean) => {
  if (!semester) return [];
  const semesterParts = semester.split('-');
  const grade = Number(semesterParts[0]);
  const sem = Number(semesterParts[1]);
  if (!Number.isFinite(grade) || !Number.isFinite(sem)) return [];

  // 재학생: 1학년부터 시작 (grade - 1), 졸업자: 2학년부터 시작 (grade - 2)
  const gradeOffset = isGraduate ? 2 : 1;
  const semesterNumber = (grade - gradeOffset) * 2 + (sem - 1);

  if (semesterNumber < 0) return []; // 유효하지 않은 학기
  return [semesterNumber * 3, semesterNumber * 3 + 1, semesterNumber * 3 + 2];
};

const ArtPhysicalForm = ({
  freeSemester,
  setValue,
  isFreeGrade,
  isFreeSemester,
  isGraduate,
  graduationType,
  watch,
  showError,
}: ArtPhysicalFormProps) => {
  const artPhysicalArray = getArtPhysicalArray({
    graduationType,
    isFreeSemester,
    isFreeGrade,
  });

  const artPhysicalIndexArray = getArtPhysicalIndexArray({
    graduationType,
    isFreeSemester,
    isFreeGrade,
  });

  const disabledIndices = isFreeSemester ? getFreeSemesterIndices(freeSemester, isGraduate) : [];

  useEffect(() => {
    if (!isFreeSemester) return;
    const indices = getFreeSemesterIndices(freeSemester, isGraduate);
    indices.forEach((index) => {
      setValue(`artsPhysicalAchievement.${index}`, 0);
    });
  }, [freeSemester, isFreeSemester, isGraduate, setValue]);

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
        <h1 className={cn([...itemStyle, 'w-[6.75rem]'])}>과목명</h1>
        <div className={cn('flex')}>
          {artPhysicalArray.map((title) => (
            <h1
              key={title}
              className={cn([
                ...itemStyle,
                isGraduate ? 'w-[9.34rem]' : isFreeGrade ? 'w-[12.46rem]' : 'w-[7.47rem]',
              ])}
            >
              {title}
            </h1>
          ))}
        </div>
      </div>
      {artPhysicalIndexArray.map(({ subject, registerIndexList }, index) => (
        <div
          key={subject}
          className={cn([
            ...rowStyle,
            'bg-white',
            'h-[3.5rem]',
            index === artPhysicalIndexArray.length - 1 && 'rounded-b-[0.375rem]',
          ])}
        >
          <div className={cn('h-full', 'w-[6.75rem]', 'flex', 'items-center', 'justify-center')}>
            <h1 className={cn([...itemStyle, 'w-full'])}>{subject}</h1>
          </div>
          <div className={cn('flex')}>
            {registerIndexList.map((registerIndex) => {
              const score = watch(`artsPhysicalAchievement.${registerIndex}`);
              const isDisabled = disabledIndices.includes(registerIndex);

              return (
                <div
                  key={registerIndex}
                  className={cn([
                    ...itemStyle,
                    isGraduate ? 'w-[9.34rem]' : isFreeGrade ? 'w-[12.46rem]' : 'w-[7.47rem]',
                  ])}
                >
                  {isDisabled ? (
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
                    <Select
                      onValueChange={(value) =>
                        setValue(`artsPhysicalAchievement.${registerIndex}`, Number(value))
                      }
                      value={score !== undefined && score !== null ? String(score) : ''}
                    >
                      <SelectTrigger
                        className={cn([
                          'h-[2rem]',
                          'text-sm',
                          'font-normal',
                          'leading-5',
                          'bg-white',
                          'data-[placeholder]:text-slate-500',
                          'text-slate-900',
                          'px-[0.5rem]',
                          'border-slate-300',
                          isGraduate ? 'w-[7.34rem]' : isFreeGrade ? 'w-[10.46rem]' : 'w-[5.47rem]',
                          watch(`artsPhysicalAchievement.${registerIndex}`) === undefined &&
                            showError &&
                            '!border-red-600',
                        ])}
                      >
                        <SelectValue placeholder="성적 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ART_PHYSICAL_SCORE_VALUES.map(({ name, value }) => (
                          <SelectItem value={String(value)} key={value}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtPhysicalForm;
