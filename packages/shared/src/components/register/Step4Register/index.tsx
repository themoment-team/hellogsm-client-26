/* eslint-disable @typescript-eslint/naming-convention */
'use client';

import { useEffect, useState } from 'react';

import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormUnregister,
  UseFormWatch,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormGetValues,
  get,
} from 'react-hook-form';
import {
  AchievementType,
  FreeSemesterValueEnum,
  LiberalSystemValueEnum,
  Step4FormType,
} from 'types';
import { GraduationTypeValueEnum } from 'types';

import {
  ArtPhysicalForm,
  FormController,
  FreeGradeForm,
  FreeSemesterForm,
  Input,
  LiberalSystemSwitch,
  NonSubjectForm,
} from 'shared/components';
import { GENERAL_SUBJECTS } from 'shared/constants';
import { cn } from 'shared/lib/utils';
import { getArtPhysicalIndexArray } from 'shared/utils/artPhysicalUtils';

const formWrapper = [
  'flex',
  'flex-col',
  'gap-[0.75rem]',
  'text-slate-900',
  'text-lg',
  'font-semibold',
  'leading-7',
  'w-full',
];

const widthConvertor: { [key: string]: string } = {
  freeGrade_GRADUATION: 'w-[42.9375rem]',
  freeGrade_CANDIDATE: 'w-[35.4375rem]',
  freeSemester_GRADUATION: 'w-[43.4375rem]',
  freeSemester_CANDIDATE: 'w-[36.1em]',
};

const freeGradeCandidateArray = [
  { title: '2학년 1학기', field: 'achievement2_1' },
  { title: '2학년 2학기', field: 'achievement2_2' },
  { title: '3학년 1학기', field: 'achievement3_1' },
] as const;

const freeGradeGraduateArray = [
  { title: '2학년 1학기', field: 'achievement2_1' },
  { title: '2학년 2학기', field: 'achievement2_2' },
  { title: '3학년 1학기', field: 'achievement3_1' },
  { title: '3학년 2학기', field: 'achievement3_2' },
] as const;

const freeSemesterCandidateArray = [
  {
    title: '1학년 1학기',
    field: 'achievement1_1',
    value: FreeSemesterValueEnum['1-1'],
  },
  {
    title: '1학년 2학기',
    field: 'achievement1_2',
    value: FreeSemesterValueEnum['1-2'],
  },
  {
    title: '2학년 1학기',
    field: 'achievement2_1',
    value: FreeSemesterValueEnum['2-1'],
  },
  {
    title: '2학년 2학기',
    field: 'achievement2_2',
    value: FreeSemesterValueEnum['2-2'],
  },
  {
    title: '3학년 1학기',
    field: 'achievement3_1',
    value: FreeSemesterValueEnum['3-1'],
  },
] as const;

const freeSemesterGraduateArray = [
  {
    title: '2학년 1학기',
    field: 'achievement2_1',
    value: FreeSemesterValueEnum['2-1'],
  },
  {
    title: '2학년 2학기',
    field: 'achievement2_2',
    value: FreeSemesterValueEnum['2-2'],
  },
  {
    title: '3학년 1학기',
    field: 'achievement3_1',
    value: FreeSemesterValueEnum['3-1'],
  },
  {
    title: '3학년 2학기',
    field: 'achievement3_2',
    value: FreeSemesterValueEnum['3-2'],
  },
] as const;

interface Step4RegisterProps {
  type?: 'client' | 'admin' | 'calculate';
  graduationType: GraduationTypeValueEnum;
  register: UseFormRegister<Step4FormType>;
  unregister: UseFormUnregister<Step4FormType>;
  setValue: UseFormSetValue<Step4FormType>;
  watch: UseFormWatch<Step4FormType>;
  trigger: UseFormTrigger<Step4FormType>;
  getValues: UseFormGetValues<Step4FormType>;
  control: Control<Step4FormType>;
  formState: UseFormStateReturn<Step4FormType>;
  isGED: boolean;
  isCandidate: boolean;
  isGraduate: boolean;
  showError: boolean;
  clearStepError: () => void;
}

const Step4Register = ({
  register,
  setValue,
  control,
  watch,
  trigger,
  formState,
  unregister,
  getValues,
  type,
  graduationType,
  isGED,
  isCandidate,
  isGraduate,
  showError,
  clearStepError,
}: Step4RegisterProps) => {
  const [subjectArray, setSubjectArray] = useState<string[]>([...GENERAL_SUBJECTS]);
  const defaultSubjectLength = GENERAL_SUBJECTS.length;

  const isCalculate = type === 'calculate';
  const isFreeSemester = watch('liberalSystem') === LiberalSystemValueEnum.FREE_SEMESTER;
  const isFreeGrade = watch('liberalSystem') === LiberalSystemValueEnum.FREE_GRADE;

  const achievementList: AchievementType[] = isFreeSemester
    ? isCandidate
      ? [...freeSemesterCandidateArray]
      : [...freeSemesterGraduateArray]
    : isCandidate
      ? [...freeGradeCandidateArray]
      : [...freeGradeGraduateArray];

  const handleDeleteSubjectClick = (idx: number) => {
    const filteredSubjects = subjectArray.filter((_, i) => i !== idx);
    unregister(`newSubjects.${idx - defaultSubjectLength}`);
    unregister(`achievement1_1.${idx}`, undefined);
    unregister(`achievement1_2.${idx}`, undefined);
    unregister(`achievement2_1.${idx}`, undefined);
    unregister(`achievement2_2.${idx}`, undefined);
    unregister(`achievement3_1.${idx}`, undefined);
    unregister(`achievement3_2.${idx}`, undefined);
    setSubjectArray(filteredSubjects);

    const newSubjects = watch('newSubjects');
    const score1_1 = watch('achievement1_1');
    const score1_2 = watch('achievement1_2');
    const score2_1 = watch('achievement2_1');
    const score2_2 = watch('achievement2_2');
    const score3_1 = watch('achievement3_1');
    const score3_2 = watch('achievement3_2');

    setValue(
      'newSubjects',
      newSubjects && newSubjects.filter((_, i) => idx - defaultSubjectLength !== i),
    ); // newSubjects 배열에서 인덱스가 N인 값 제거
    setValue('achievement1_1', score1_1 && score1_1.filter((_, i) => i !== idx));
    setValue('achievement1_2', score1_2 && score1_2.filter((_, i) => i !== idx));
    setValue('achievement2_1', score2_1 && score2_1.filter((_, i) => i !== idx));
    setValue('achievement2_2', score2_2 && score2_2.filter((_, i) => i !== idx));
    setValue('achievement3_1', score3_1 && score3_1.filter((_, i) => i !== idx));
    setValue('achievement3_2', score3_2 && score3_2.filter((_, i) => i !== idx)); // score3_2 배열에서 인덱스가 기본과목.length + index인 값 제거 (삭제 버튼 클릭한 인덱스 제거)
  };

  const handleAddSubjectClick = (subjectName?: string) => {
    const newSubject = subjectName
      ? subjectName
      : `추가과목 ${subjectArray.length - defaultSubjectLength}`;
    setSubjectArray((prev) => [...prev, newSubject]);

    if (watch('liberalSystem') === LiberalSystemValueEnum.FREE_GRADE) {
      achievementList.forEach(({ field }) =>
        setValue(`${field}.${subjectArray.length}`, watch(`${field}.${subjectArray.length}`)),
      );
    } else {
      achievementList.forEach(
        ({ field, value }) =>
          value !== watch('freeSemester') &&
          setValue(`${field}.${subjectArray.length}`, watch(`${field}.${subjectArray.length}`)),
      );
    }
  };

  useEffect(() => {
    if (isGED) {
      setValue('liberalSystem', null);
      setValue('achievement1_1', null);
      setValue('achievement1_2', null);
      setValue('achievement2_1', null);
      setValue('achievement2_2', null);
      setValue('achievement3_1', null);
      setValue('achievement3_2', null);
      setValue('artsPhysicalAchievement', null);
      setValue('absentDays', null);
      setValue('attendanceDays', null);
      setValue('volunteerTime', null);
      setValue('freeSemester', null);
    } else {
      setValue('gedAvgScore', null);
      setValue('liberalSystem', watch('liberalSystem') || LiberalSystemValueEnum.FREE_GRADE);
    }

    const newSubject = watch('newSubjects');

    if (newSubject && newSubject.length) {
      newSubject.forEach((subjectName) => handleAddSubjectClick(subjectName));
    }
  }, []);

  useEffect(() => {
    if (isGED) return;
    const allIndexArray = getArtPhysicalIndexArray({
      graduationType,
      isFreeSemester,
      isFreeGrade,
    });

    const validIndexes = allIndexArray.flatMap(
      (item: { registerIndexList: readonly number[] }) => item.registerIndexList,
    );
    const currentValues = watch('artsPhysicalAchievement') ?? [];

    const newValues = currentValues.map((value, index) =>
      validIndexes.includes(index) ? value : null,
    );

    setValue(
      'artsPhysicalAchievement',
      newValues.filter((v): v is number => v !== null),
    );
  }, [isFreeSemester, isGED]);

  useEffect(() => {
    if (clearStepError) clearStepError();
  }, [isFreeGrade, isFreeSemester]);

  const validateForm = async () => {
    await trigger();
  };

  useEffect(() => {
    if (!showError) return;

    validateForm();
  }, [showError]);

  return (
    <>
      <div className={cn(['w-[66.5rem]', 'flex', 'flex-col', type === 'admin' && 'pb-20'])}>
        <h1
          className={cn(
            'text-[1.25rem]',
            'font-normal',
            'font-semibold',
            'leading-[1.75rem]',
            'tracking-[-0.00625rem]',
            'text-gray-900',
          )}
        >
          {isCalculate ? '모의 성적 계산하기' : '성적을 입력해 주세요.'}
        </h1>
        <p
          className={cn(
            'text-sm',
            'font-normal',
            'leading-5',
            'text-gray-600',
            'mt-[0.125rem]',
            'mb-[2rem]',
          )}
        >
          {isCalculate
            ? '성적을 정확히 입력해 주세요.'
            : '계산을 위해 지원자님의 정확한 성적을 입력해주세요.'}
        </p>
        {graduationType === GraduationTypeValueEnum.GED ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={cn('w-[18.75rem]', 'flex', 'flex-col', 'gap-1')}>
              <p className={cn('text-slate-900', 'text-[0.875rem]/[1.25rem]')}>
                검정고시 평균 점수 <span className={cn('text-red-600')}>*</span>
              </p>
              <Input
                type="text"
                {...register('gedAvgScore', {
                  setValueAs: (v) => {
                    const num = Number(v);
                    return !num ? undefined : num;
                  },
                })}
                placeholder="평균 점수 입력"
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const input = e.currentTarget;
                  input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                }}
                variant={
                  (Boolean(get(formState.errors, 'gedAvgScore')) ||
                    watch('gedAvgScore') === undefined) &&
                  showError
                    ? 'error'
                    : null
                }
              />
            </div>
          </form>
        ) : (
          <div
            className={cn(
              'flex',
              'h-lvh',
              'justify-center',
              'bg-white',
              'w-full',
              'h-fit',
              'gap-[2.5rem]',
            )}
          >
            <FormController className={cn('mt-[5.625rem]')} />
            <form
              onSubmit={(e) => e.preventDefault()}
              className={cn('flex', 'flex-col', 'items-center')}
            >
              <LiberalSystemSwitch
                isFreeGrade={isFreeGrade}
                isFreeSemester={isFreeSemester}
                setValue={setValue}
                className={cn('mb-[3rem]')}
              />
              <div
                className={cn(
                  'flex',
                  'flex-col',
                  'gap-[2.5rem]',
                  'items-center',
                  widthConvertor[`${watch('liberalSystem')}_${graduationType}`],
                )}
              >
                <div className={cn([...formWrapper])}>
                  <div className={cn('flex', 'justify-between', 'items-center')}>일반교과 성적</div>
                  {isFreeGrade && (
                    <FreeGradeForm
                      achievementList={achievementList}
                      register={register}
                      setValue={setValue}
                      subjectArray={subjectArray}
                      watch={watch}
                      control={control}
                      errors={formState.errors}
                      handleDeleteSubjectClick={handleDeleteSubjectClick}
                      isGraduate={isGraduate}
                      showError={showError}
                      getValues={getValues}
                      validateForm={validateForm}
                    />
                  )}
                  {isFreeSemester && (
                    <FreeSemesterForm
                      achievementList={achievementList}
                      register={register}
                      setValue={setValue}
                      subjectArray={subjectArray}
                      watch={watch}
                      errors={formState.errors}
                      handleDeleteSubjectClick={handleDeleteSubjectClick}
                      freeSemester={watch('freeSemester')}
                      isGraduate={isGraduate}
                      showError={showError}
                      getValues={getValues}
                      validateForm={validateForm}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleAddSubjectClick()}
                    className={cn(
                      'text-sm',
                      'font-semibold',
                      'leading-6',
                      'text-[#0F172A]',
                      'h-[2.5rem]',
                      'w-full',
                      'flex',
                      'items-center',
                      'justify-center',
                      'rounded-md',
                      'border-[0.0625rem]',
                      'border-slate-200',
                    )}
                  >
                    + 과목 추가하기
                  </button>
                </div>
                <div id="artPhysicalSubject" className={cn([...formWrapper])}>
                  예체능 교과 성적
                  <ArtPhysicalForm
                    graduationType={graduationType}
                    setValue={setValue}
                    watch={watch}
                    isFreeGrade={isFreeGrade}
                    isFreeSemester={isFreeSemester}
                    isGraduate={isGraduate}
                    showError={showError}
                  />
                </div>
                <div id="nonSubject" className={cn([...formWrapper])}>
                  <div className={cn('w-full', 'flex', 'justify-between')}>
                    비교과 내용
                    <div
                      className={cn(
                        'flex',
                        'items-center',
                        'justify-center',
                        'gap-1',
                        'text-red-600',
                        'text-[0.75rem]/[1.25rem]',
                        'font-semibold',
                      )}
                    >
                      <p>*</p>
                      <p>9월 30일까지의 미인정 결석·지각·조퇴·결과 및 봉사시간 입력</p>
                    </div>
                  </div>
                  <NonSubjectForm
                    register={register}
                    trigger={trigger}
                    errors={formState.errors}
                    isFreeGrade={isFreeGrade}
                    isGraduate={isGraduate}
                    showError={showError}
                    validateForm={validateForm}
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Step4Register;
