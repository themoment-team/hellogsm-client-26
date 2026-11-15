'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormUnregister,
  UseFormTrigger,
  UseFormGetValues,
  get,
  useFormState,
  useWatch,
} from 'react-hook-form';

import {
  ACHIEVEMENT_FIELD_LIST,
  clearFreeSemesterArtsPhysical,
  GENERAL_SUBJECTS,
  getFreeSemesterArtsPhysicalIndices,
} from '@repo/constants';
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

import { mapOcrAchievementFields } from './mapOcrAchievementFields';
import { reorderAttendanceDaysForForm } from './reorderAttendanceDaysForForm';

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

  // formState를 props로 받으면 부모의 {...step4UseForm} 스프레드가 메모이즈되어 첫 렌더
  // 값에 고정된다 — 컴포넌트 안에서 직접 구독한다 (React Compiler 호환)
  const { errors } = useFormState({ control });

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

  const validateForm = async () => {
    await trigger();
  };

  // 예체능의 자유학기 칸(과목 3개)은 화면에 '자유학기제'로만 보이므로 0으로 맞춘다
  const clearFreeSemesterArtsPhysicalCells = (nextFreeSemester: FreeSemesterValueEnum | null) => {
    getFreeSemesterArtsPhysicalIndices(nextFreeSemester).forEach((index) => {
      setValue(`artsPhysicalAchievement.${index}`, 0);
    });
  };

  // 자유학기 지정이 바뀌면 그 학기의 성적 열은 비우고(null), 나머지 학기 열은 비어 있던(null)
  // 값을 입력 전 상태(undefined)로 되돌린 뒤 예체능 자유학기 칸을 맞춘다. 자유학기 지정이
  // 바뀌는 이벤트(자유학기 on/off 버튼, OCR 적용)에서 호출한다.
  const applyFreeSemesterSelection = (nextFreeSemester: FreeSemesterValueEnum | null) => {
    const freeSemesterAchievementList = isCandidate
      ? freeSemesterCandidateArray
      : freeSemesterGraduateArray;

    freeSemesterAchievementList.forEach(({ field, value }) => {
      if (value === nextFreeSemester) {
        setValue(field, null);
      } else {
        setValue(field, getValues(field) || undefined!);
      }
    });

    clearFreeSemesterArtsPhysicalCells(nextFreeSemester);
  };

  const handleFreeSemesterChange = (nextFreeSemester: FreeSemesterValueEnum | null) => {
    const prevFreeSemester = getValues('freeSemester');

    setValue('freeSemester', nextFreeSemester);
    if (prevFreeSemester !== nextFreeSemester) applyFreeSemesterSelection(nextFreeSemester);

    validateForm();
  };

  // 자유학년제/자유학기제 전환 — 두 모드는 예체능 성적의 칸 배치가 달라 이전 모드의 값을 지운다.
  // 학기 열 초기화는 새로 나타나는 FreeGradeForm/FreeSemesterForm이 mount 시 한다.
  const handleLiberalSystemChange = (nextLiberalSystem: LiberalSystemValueEnum) => {
    const isLiberalSystemChanged = getValues('liberalSystem') !== nextLiberalSystem;

    setValue('liberalSystem', nextLiberalSystem);
    if (nextLiberalSystem === LiberalSystemValueEnum.FREE_GRADE) setValue('freeSemester', null);

    if (!isLiberalSystemChanged) return;

    setValue('artsPhysicalAchievement', null);
    clearStepError();
  };

  const handleApplyOcrAchievement = (achievement: SchoolRecordExtractionAchievementType) => {
    const prevLiberalSystem = getValues('liberalSystem');
    const prevFreeSemester = getValues('freeSemester');

    // OCR이 liberalSystem을 바꿔도 예체능 성적은 새 모드에 맞게 같이 내려오므로,
    // LiberalSystemSwitch를 눌렀을 때(handleLiberalSystemChange)와 달리 지우지 않는다
    if (achievement.liberalSystem) {
      setValue('liberalSystem', achievement.liberalSystem);
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

    // 서버 추출 결과는 이번 전형에서 쓰지 않는 학기까지 값을 채워 보낼 수 있다. 실제로
    // 자유학년제 생기부의 1학년은 성취도가 P(이수)로 찍히는데 이게 0('없음')으로 내려와,
    // 자유학년제인데도 1-1·1-2가 전부 0인 채로 제출되어 성적 계산이 틀어졌다. 학기 열을
    // 비우는 초기화(FreeGradeForm/FreeSemesterForm)는 mount 시 한 번만 돌기 때문에,
    // 이미 해당 모드에 들어와 있는 상태에서 OCR을 적용하면 되돌려 주는 곳이 없다.
    // 그래서 여기서 직접 쓰지 않는 학기를 null로 못박는다.
    //
    // 기준이 되는 전형 값은 이 함수가 방금 setValue한 OCR 결과를 우선한다 — 렌더 시점에
    // 계산된 achievementList는 아직 OCR 이전 값이라 여기서는 쓸 수 없다.
    // OCR이 인식하지 못한 칸은 null로 내려오는데, 기존 검증 로직이 null을 '입력 필요' 오류로
    // 표시해 주므로 이 값을 그대로 반영하는 것만으로 검수 표시를 겸할 수 있다.
    const ocrLiberalSystem = achievement.liberalSystem ?? getValues('liberalSystem');
    const ocrFreeSemester = achievement.freeSemester ?? getValues('freeSemester');
    const mappedAchievementFields = mapOcrAchievementFields(achievement, {
      liberalSystem: ocrLiberalSystem,
      graduationType,
      freeSemester: ocrFreeSemester,
    });
    ACHIEVEMENT_FIELD_LIST.forEach((field) => {
      setValue(field, mappedAchievementFields[field] as Step4FormType[typeof field]);
    });
    // 예체능의 자유학기 칸은 화면에 '자유학기제'로만 보이므로 0이어야 한다. 이 칸을 0으로
    // 맞추는 처리(clearFreeSemesterArtsPhysicalCells)는 자유학기 지정이 바뀔 때만 돌아,
    // 자유학기를 정한 뒤 OCR을 적용하면 OCR 값이 보이지 않는 채로 남는다. 제출 직전 정규화와
    // 별개로 폼 상태도 화면과 맞춰 둔다.
    setValue(
      'artsPhysicalAchievement',
      (achievement.artsPhysicalAchievement
        ? clearFreeSemesterArtsPhysical({
            artsPhysicalAchievement: achievement.artsPhysicalAchievement,
            liberalSystem: ocrLiberalSystem,
            freeSemester: ocrFreeSemester,
          })
        : null) as Step4FormType['artsPhysicalAchievement'],
    );
    setValue('absentDays', achievement.absentDays as Step4FormType['absentDays']);
    setValue(
      'attendanceDays',
      reorderAttendanceDaysForForm(achievement.attendanceDays) as Step4FormType['attendanceDays'],
    );
    setValue('volunteerTime', achievement.volunteerTime as Step4FormType['volunteerTime']);

    // 자유학기 지정이 바뀌었으면 자유학기 열과 예체능 칸을 맞춘다. 모드가 자유학기제로 바뀐
    // 경우의 학기 열 초기화는 새로 나타나는 FreeSemesterForm이 mount 시 하므로 예체능 칸만 맞춘다.
    const nextLiberalSystem = getValues('liberalSystem');
    const nextFreeSemester = getValues('freeSemester');
    const isLiberalSystemChanged = nextLiberalSystem !== prevLiberalSystem;

    if (nextLiberalSystem === LiberalSystemValueEnum.FREE_SEMESTER) {
      if (isLiberalSystemChanged) {
        clearFreeSemesterArtsPhysicalCells(nextFreeSemester);
      } else if (nextFreeSemester !== prevFreeSemester) {
        applyFreeSemesterSelection(nextFreeSemester);
      }
    }

    if (isLiberalSystemChanged) clearStepError();

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
      // 저장된 값의 예체능 자유학기 칸이 0이 아닐 수 있어 진입 시 한 번 맞춘다
      if (getValues('liberalSystem') === LiberalSystemValueEnum.FREE_SEMESTER) {
        clearFreeSemesterArtsPhysicalCells(getValues('freeSemester'));
      }
      setValue('liberalSystem', getValues('liberalSystem') || LiberalSystemValueEnum.FREE_GRADE);
    }

    const newSubject = getValues('newSubjects');

    if (newSubject && newSubject.length) {
      newSubject.forEach((subjectName) => handleAddSubjectClick(subjectName));
    }
  }, []);

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
                  (Boolean(get(errors, 'gedAvgScore')) || gedAvgScore === undefined) && showError
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
                  onLiberalSystemChange={handleLiberalSystemChange}
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
                        errors={errors}
                        handleDeleteSubjectClick={handleDeleteSubjectClick}
                        isGraduate={isGraduate}
                        showError={showError}
                        getValues={getValues}
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
                        errors={errors}
                        handleDeleteSubjectClick={handleDeleteSubjectClick}
                        freeSemester={freeSemester}
                        isGraduate={isGraduate}
                        showError={showError}
                        getValues={getValues}
                        onFreeSemesterChange={handleFreeSemesterChange}
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
                      errors={errors}
                      showError={showError}
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
