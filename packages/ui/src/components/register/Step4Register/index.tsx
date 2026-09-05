'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormUnregister,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormGetValues,
  get,
  useWatch,
} from 'react-hook-form';

import { ACHIEVEMENT_FIELD_LIST, GENERAL_SUBJECTS } from '@repo/constants';
import {
  AchievementType,
  FreeSemesterValueEnum,
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  SchoolRecordExtractionAchievementType,
  Step4FormType,
} from '@repo/types';
import { cn } from '@repo/utils';

import { FormController, LiberalSystemSwitch, SchoolRecordUploader } from '../../';
import { Input } from '../../../shadcn';
import { ArtPhysicalForm, FreeGradeForm, FreeSemesterForm, NonSubjectForm } from '../../form';

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

  // 행을 그릴 때 React key로 과목 "이름"(중복 가능)이나 배열 "위치"(삭제/재정렬 시 뒤 행이
  // 앞으로 당겨오며 값이 안 바뀐 것처럼 보이는 input 재사용 버그)를 쓰면 둘 다 문제가
  // 있었다. 그래서 각 행이 생성될 때 한 번 발급하고 그 행이 사라질 때까지 절대 안 바뀌는
  // 고유 key를 별도로 관리한다 — react-hook-form의 useFieldArray가 내부적으로 하는 것과
  // 같은 방식이다.
  const subjectKeyCounterRef = useRef(0);
  const nextSubjectKey = () => `subject-${(subjectKeyCounterRef.current += 1)}`;
  // 렌더 중에는 ref를 읽거나 쓰면 안 되므로, 처음 9개(일반교과 고정 과목)는 ref 없이
  // 정해진 이름으로 초기화한다 — 이후 추가되는 행만 nextSubjectKey()로 발급한다.
  const [subjectKeys, setSubjectKeys] = useState<string[]>(() =>
    GENERAL_SUBJECTS.map((_, index) => `general-${index}`),
  );

  // 렌더 중 구독은 watch() 대신 useWatch 사용 (React Compiler 호환)
  const liberalSystem = useWatch({ control, name: 'liberalSystem' });
  const freeSemester = useWatch({ control, name: 'freeSemester' });
  const gedAvgScore = useWatch({ control, name: 'gedAvgScore' });

  const isCalculate = type === 'calculate';
  const isFreeSemester = liberalSystem === LiberalSystemValueEnum.FREE_SEMESTER;
  const isFreeGrade = liberalSystem === LiberalSystemValueEnum.FREE_GRADE;

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
    setSubjectKeys((prev) => prev.filter((_, i) => i !== idx));

    // 이벤트 핸들러에서는 구독이 불필요 — getValues() 사용 (React Compiler 호환)
    const newSubjects = getValues('newSubjects');
    const score1_1 = getValues('achievement1_1');
    const score1_2 = getValues('achievement1_2');
    const score2_1 = getValues('achievement2_1');
    const score2_2 = getValues('achievement2_2');
    const score3_1 = getValues('achievement3_1');
    const score3_2 = getValues('achievement3_2');

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
    // subjectArray.length를 클로저에서 그대로 읽으면, 버튼을 연달아 눌러 리렌더가 아직
    // 안 끝난 사이에 두 번째 클릭이 들어왔을 때 똑같은 길이를 두 번 읽어버린다 — 그러면
    // "추가과목 N" 이름이 겹치는 것은 물론, achievement 배열에 값을 채워 넣는 인덱스도
    // 겹쳐서 두 번째 클릭이 첫 번째 클릭의 자리를 덮어써 버린다. setSubjectArray의
    // 함수형 업데이트 안에서 prev.length를 써야 매번 실제 최신 길이를 본다.
    setSubjectArray((prev) => {
      const newSubject = subjectName
        ? subjectName
        : `추가과목 ${prev.length - defaultSubjectLength}`;
      const newIndex = prev.length;

      if (getValues('liberalSystem') === LiberalSystemValueEnum.FREE_GRADE) {
        achievementList.forEach(({ field }) =>
          setValue(`${field}.${newIndex}`, getValues(`${field}.${newIndex}`)),
        );
      } else {
        achievementList.forEach(
          ({ field, value }) =>
            value !== getValues('freeSemester') &&
            setValue(`${field}.${newIndex}`, getValues(`${field}.${newIndex}`)),
        );
      }

      return [...prev, newSubject];
    });
    setSubjectKeys((prev) => [...prev, nextSubjectKey()]);
  };

  /**
   * 서버(MiddleSchoolRecordParser)가 내려주는 attendanceDays는 학년 단위로 묶여 있다
   * (index = (학년-1)*3 + [지각,조퇴,결과]). 그런데 이 폼(NonSubjectForm)과 제출된
   * 원서를 보여주는 ApplicationPrintPage/ExtracurricularTable은 항목 단위로 묶은
   * 배열을 쓴다(지각 3칸이 [0,1,2], 조퇴가 [3,4,5], 결과가 [6,7,8]). 이 둘을 그대로
   * 이어붙이면 학년2의 지각 자리에 학년1의 조퇴 값이 들어가는 식으로 값이 뒤섞인다.
   * 그래서 서버 배열을 폼이 기대하는 순서로 재배열한다.
   */
  const reorderAttendanceDaysForForm = (
    serverAttendanceDays: SchoolRecordExtractionAchievementType['attendanceDays'],
  ): SchoolRecordExtractionAchievementType['attendanceDays'] => {
    if (!serverAttendanceDays) return serverAttendanceDays;
    const reordered: (number | null)[] = new Array(9).fill(null);
    for (let grade = 1; grade <= 3; grade += 1) {
      for (let typeOffset = 0; typeOffset < 3; typeOffset += 1) {
        const serverIndex = (grade - 1) * 3 + typeOffset;
        const formIndex = typeOffset * 3 + (grade - 1);
        reordered[formIndex] = serverAttendanceDays[serverIndex] ?? null;
      }
    }
    return reordered;
  };

  const handleApplyOcrAchievement = (achievement: SchoolRecordExtractionAchievementType) => {
    if (achievement.liberalSystem) {
      setValue('liberalSystem', achievement.liberalSystem);
      // 아래 "전형(자유학기제/자유학년제) 변경 시 예체능 성적 초기화" effect는 사용자가
      // LiberalSystemSwitch를 직접 눌러 모드를 바꿨을 때 이전 모드의 값을 지우기 위한
      // 것이다. 그런데 OCR이 liberalSystem을 바꾸는 경우엔 artsPhysicalAchievement도
      // 이미 새 모드에 맞게 같이 내려오는데, 다음 렌더에서 그 effect가 "모드가 바뀌었다"고
      // 보고 이 값을 다시 null로 덮어써 자동 입력값이 사라지는 문제가 있었다. ref를
      // 새 모드 기준으로 미리 맞춰 두면 그 effect가 "모드가 안 바뀌었다"고 보고 초기화를
      // 건너뛴다 — 실제 사용자 조작으로 인한 모드 변경만 초기화 대상이 된다.
      prevIsFreeSemesterRef.current =
        achievement.liberalSystem === LiberalSystemValueEnum.FREE_SEMESTER;
      prevIsFreeGradeRef.current = achievement.liberalSystem === LiberalSystemValueEnum.FREE_GRADE;
    }
    if (achievement.freeSemester) {
      setValue('freeSemester', achievement.freeSemester);
    }

    // achievement1_1 등 성적 배열은 서버가 "이번 생기부에서 발견한 newSubjects 순서"를
    // 기준으로 인덱스를 매겨 내려준다. 그런데 예전 코드는 기존에 추가돼 있던 과목 행을
    // 지우지 않고 새 과목만 덧붙였다 — 그러면 화면의 행 순서(기존 과목 + 새 과목)와
    // 서버가 준 배열의 순서(이번 newSubjects만)가 어긋나서, 예전에 추가했던 과목 행에
    // 전혀 다른 과목의 점수가 잘못 표시되는 문제가 있었다(다른 생기부를 다시 OCR
    // 적용했을 때 특히 눈에 띔). 그래서 추가 과목 행은 이번 OCR 결과로 완전히
    // 교체한다.
    const ocrNewSubjects = achievement.newSubjects || [];
    const previousExtraCount = subjectArray.length - defaultSubjectLength;
    for (let i = previousExtraCount - 1; i >= 0; i -= 1) {
      unregister(`newSubjects.${i}`);
    }
    setSubjectArray([...GENERAL_SUBJECTS, ...ocrNewSubjects]);
    setSubjectKeys((prev) => [
      ...prev.slice(0, defaultSubjectLength),
      ...ocrNewSubjects.map(() => nextSubjectKey()),
    ]);
    setValue('newSubjects', ocrNewSubjects);

    // OCR이 인식하지 못한 칸은 null로 내려오는데, 기존 검증 로직이 null을 '입력 필요' 오류로
    // 표시해 주므로 이 값을 그대로 반영하는 것만으로 검수 표시를 겸할 수 있다.
    ACHIEVEMENT_FIELD_LIST.forEach((field) => {
      setValue(field, (achievement[field] ?? null) as Step4FormType[typeof field]);
    });
    setValue(
      'artsPhysicalAchievement',
      (achievement.artsPhysicalAchievement ?? null) as Step4FormType['artsPhysicalAchievement'],
    );
    setValue('absentDays', achievement.absentDays as Step4FormType['absentDays']);
    setValue(
      'attendanceDays',
      reorderAttendanceDaysForForm(achievement.attendanceDays) as Step4FormType['attendanceDays'],
    );
    setValue('volunteerTime', achievement.volunteerTime as Step4FormType['volunteerTime']);

    trigger();
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
      setValue('liberalSystem', getValues('liberalSystem') || LiberalSystemValueEnum.FREE_GRADE);
    }

    const newSubject = getValues('newSubjects');

    if (newSubject && newSubject.length) {
      newSubject.forEach((subjectName) => handleAddSubjectClick(subjectName));
    }
  }, []);

  const prevIsFreeSemesterRef = useRef(isFreeSemester);
  const prevIsFreeGradeRef = useRef(isFreeGrade);

  useEffect(() => {
    const modeChanged =
      prevIsFreeSemesterRef.current !== isFreeSemester ||
      prevIsFreeGradeRef.current !== isFreeGrade;

    prevIsFreeSemesterRef.current = isFreeSemester;
    prevIsFreeGradeRef.current = isFreeGrade;

    if (!modeChanged || isGED) return;

    setValue('artsPhysicalAchievement', null);
  }, [isFreeSemester, isFreeGrade, isGED, setValue]);

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
                  (Boolean(get(formState.errors, 'gedAvgScore')) || gedAvgScore === undefined) &&
                  showError
                    ? 'error'
                    : null
                }
              />
            </div>
          </form>
        ) : (
          <div className={cn('flex', 'flex-col', 'w-full')}>
            {type === 'client' && (
              <SchoolRecordUploader
                graduationType={graduationType}
                liberalSystem={liberalSystem ?? null}
                onApplyAchievement={handleApplyOcrAchievement}
              />
            )}
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
                    widthConvertor[`${liberalSystem}_${graduationType}`],
                  )}
                >
                  <div className={cn([...formWrapper])}>
                    <div className={cn('flex', 'justify-between', 'items-center')}>
                      일반교과 성적
                    </div>
                    {isFreeGrade && (
                      <FreeGradeForm
                        achievementList={achievementList}
                        register={register}
                        setValue={setValue}
                        subjectArray={subjectArray}
                        subjectKeys={subjectKeys}
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
                        subjectKeys={subjectKeys}
                        control={control}
                        errors={formState.errors}
                        handleDeleteSubjectClick={handleDeleteSubjectClick}
                        freeSemester={freeSemester}
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
                      control={control}
                      isFreeGrade={isFreeGrade}
                      isFreeSemester={isFreeSemester}
                      isGraduate={isGraduate}
                      showError={showError}
                      freeSemester={freeSemester}
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
                      showError={showError}
                      validateForm={validateForm}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Step4Register;
