'use client';

import { useEffect } from 'react';
import {
  Control,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  useFormState,
  useWatch,
} from 'react-hook-form';

import { CURRENT_YEAR, NEXT_YEAR } from '@repo/constants';
import {
  DesireMajorValueEnum,
  GraduationTypeValueEnum,
  ScreeningValueEnum,
  Step2FormType,
} from '@repo/types';
import { cn } from '@repo/utils';

import { CustomFormItem, RadioButton, SearchDialog } from '../../';
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn';

interface Step2RegisterProps {
  setValue: UseFormSetValue<Step2FormType>;
  control: Control<Step2FormType>;
  getValues: UseFormGetValues<Step2FormType>;
  reset: UseFormReset<Step2FormType>;
  showError: boolean;
}

type MajorFieldType = 'firstDesiredMajor' | 'secondDesiredMajor' | 'thirdDesiredMajor';

const graduationTypeList = [
  { name: '졸업자', value: GraduationTypeValueEnum.GRADUATE },
  { name: '졸업예정', value: GraduationTypeValueEnum.CANDIDATE },
  { name: '검정고시', value: GraduationTypeValueEnum.GED },
] as const;

const majorList = [
  { name: '소프트웨어개발과', value: DesireMajorValueEnum.SW },
  { name: '스마트IoT과', value: DesireMajorValueEnum.IOT },
  { name: '인공지능(AI)과', value: DesireMajorValueEnum.AI },
] as const;

const screeningList = [
  { name: '일반전형', value: ScreeningValueEnum.GENERAL },
  { name: '사회통합전형', value: ScreeningValueEnum.SPECIAL },
  { name: '국가보훈대상자', value: ScreeningValueEnum.EXTRA_VETERANS },
  { name: '특례입학대상자', value: ScreeningValueEnum.EXTRA_ADMISSION },
] as const;

const majorIntroductions = [
  {
    name: '소프트웨어개발과',
    description: 'C, C++, JAVA, 모바일 등',
  },
  {
    name: '스마트IoT(Internet of Things)과',
    description: '리눅스, 라즈베리파이, 아두이노, 하드웨어 등',
  },
  {
    name: '인공지능(AI)과',
    description: '빅데이터, 사물인터넷, 머신러닝, 딥러닝 등',
  },
] as const;

const Step2Register = ({ setValue, control, getValues, reset, showError }: Step2RegisterProps) => {
  // formState를 props로 받으면 부모의 {...step2UseForm} 스프레드가 메모이즈되어 첫 렌더
  // 값에 고정된다 — 컴포넌트 안에서 직접 구독한다 (React Compiler 호환)
  const { errors } = useFormState({ control });

  const majorFieldList: MajorFieldType[] = [
    'firstDesiredMajor',
    'secondDesiredMajor',
    'thirdDesiredMajor',
  ];

  // 렌더 중 구독은 watch() 대신 useWatch 사용 (React Compiler 호환)
  // schoolName은 register()로 연결하지 않는다 — 지망 학과 변경 시의 reset()이 RHF 필드
  // 참조를 비우는데, 메모이즈된 register() 호출은 다시 실행되지 않아 이후 setValue가
  // input에 반영되지 않는다. 표시 전용 입력이므로 구독한 값을 그대로 넘긴다.
  const schoolName = useWatch({ control, name: 'schoolName' });
  const graduationDate = useWatch({ control, name: 'graduationDate' });
  const graduationType = useWatch({ control, name: 'graduationType' });
  const screening = useWatch({ control, name: 'screening' });
  const classroom = useWatch({ control, name: 'classroom' });
  const number = useWatch({ control, name: 'number' });
  const firstDesiredMajor = useWatch({ control, name: 'firstDesiredMajor' });
  const secondDesiredMajor = useWatch({ control, name: 'secondDesiredMajor' });
  const thirdDesiredMajor = useWatch({ control, name: 'thirdDesiredMajor' });

  const majorValueMap: Record<MajorFieldType, DesireMajorValueEnum | undefined | null> = {
    firstDesiredMajor,
    secondDesiredMajor,
    thirdDesiredMajor,
  };

  const year = graduationDate.split('-')[0];
  const month = graduationDate.split('-')[1];

  const isCandidate = graduationType === GraduationTypeValueEnum.CANDIDATE;
  const isGED = graduationType === GraduationTypeValueEnum.GED;

  const START_YEAR = isCandidate ? NEXT_YEAR : CURRENT_YEAR;
  const PERMIT_YEAR = isCandidate ? 1 : 5;

  const FIXED_GRADE = 3;

  useEffect(() => {
    if (!isGED && classroom && number) {
      const classroomNum = parseInt(classroom);
      const numberNum = parseInt(number);

      if (classroomNum >= 1 && classroomNum <= 12 && numberNum >= 1 && numberNum <= 30) {
        const newStudentNumber = `${FIXED_GRADE}${classroomNum.toString().padStart(2, '0')}${numberNum.toString().padStart(2, '0')}`;
        setValue('studentNumber', newStudentNumber);
      }
    }
  }, [classroom, number, isGED, setValue]);

  const handleGraduationTypeOptionClick = (value: GraduationTypeValueEnum) => {
    setValue('graduationType', value);

    if (value === GraduationTypeValueEnum.GED) {
      setValue('schoolName', null);
      setValue('schoolAddress', null);
      setValue('studentNumber', null);
      setValue('classroom', '');
      setValue('number', '');
    } else if (!getValues('schoolName')) {
      setValue('schoolName', '');
      setValue('schoolAddress', '');
      setValue('studentNumber', '');
      setValue('classroom', '');
      setValue('number', '');
    }

    setValue('graduationDate', '0000-00');
  };

  const handleYearSelectChange = (year: string) => {
    setValue('graduationDate', `${year}-${month}`);
  };

  const handleMonthSelectChange = (month: string) => {
    const paddedMonth = month.padStart(2, '0');

    setValue('graduationDate', `${year}-${paddedMonth}`);
  };

  const handleDesiredMajorChange = (fieldName: MajorFieldType, value: DesireMajorValueEnum) => {
    switch (fieldName) {
      case 'firstDesiredMajor':
        setValue('firstDesiredMajor', value);
        reset(
          { ...getValues(), secondDesiredMajor: undefined, thirdDesiredMajor: undefined },
          { keepErrors: true, keepIsSubmitted: true },
        );

        return;

      case 'secondDesiredMajor':
        setValue('secondDesiredMajor', value);
        reset(
          { ...getValues(), thirdDesiredMajor: undefined },
          { keepErrors: true, keepIsSubmitted: true },
        );

        return;

      case 'thirdDesiredMajor':
        setValue('thirdDesiredMajor', value);

        return;
    }
  };

  // 연/월 에러 상태 체크
  const hasYearError = showError && (!year || year === '0000');
  const hasMonthError = showError && (!month || month === '00');

  const hasClassroomError = showError && classroom === '';
  const hasNumberError = showError && number === '';

  const hasFirstMajorError =
    showError &&
    errors.firstDesiredMajor &&
    (firstDesiredMajor === undefined || firstDesiredMajor === null);
  const hasSecondMajorError =
    showError &&
    errors.secondDesiredMajor &&
    (secondDesiredMajor === undefined || secondDesiredMajor === null);
  const hasThirdMajorError =
    showError &&
    errors.thirdDesiredMajor &&
    (thirdDesiredMajor === undefined || thirdDesiredMajor === null);

  useEffect(() => {
    if (!isGED && getValues('schoolName') === null) {
      setValue('schoolName', '');
      setValue('schoolAddress', '');
    }
  }, []);

  return (
    <div className={cn('flex', 'w-full', 'flex-col', 'items-start', 'gap-10')}>
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-[0.125rem]')}>
        <h1 className={cn('text-gray-900', 'text-[1.25rem]/[1.75rem]', 'font-semibold')}>
          지원 정보를 입력해 주세요.
        </h1>
        <p className={cn('text-gray-600', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
          회원가입 시 입력한 기본 정보가 노출됩니다.
        </p>
      </div>

      <div className={cn('flex', 'items-start', 'gap-12')}>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-10')}>
          <RadioButton<GraduationTypeValueEnum>
            title={'지원자 유형'}
            list={[...graduationTypeList]}
            selectedValue={graduationType}
            handleOptionClick={handleGraduationTypeOptionClick}
            error={showError}
            required
          />

          <div className={cn('flex', 'flex-col', 'gap-3', 'w-full', 'justify-between')}>
            <CustomFormItem
              text={isGED ? '검정고시 합격일' : '출신 중학교 & 졸업일'}
              className={cn('gap-1')}
              required
              fullWidth
            >
              {!isGED && (
                <div className={cn('flex', 'gap-2')}>
                  <Input
                    placeholder="내 중학교 찾기"
                    width="full"
                    disabled={true}
                    readOnly
                    value={schoolName ?? ''}
                    variant={showError && errors.schoolName ? 'error' : null}
                  />
                  <SearchDialog setValue={setValue} />
                </div>
              )}
              <div className={cn('flex', 'w-full', 'justify-between')}>
                <Select value={year === '0000' ? '' : year} onValueChange={handleYearSelectChange}>
                  <SelectTrigger
                    className={cn('w-[14.6785rem]', {
                      '!border-red-600': hasYearError,
                    })}
                  >
                    <SelectValue placeholder="연도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>연도 선택</SelectLabel>
                      {Array.from(
                        { length: PERMIT_YEAR + 1 },
                        (_, index) => START_YEAR - index,
                      ).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={month === '00' ? '' : Number(month).toString()}
                  onValueChange={handleMonthSelectChange}
                >
                  <SelectTrigger
                    className={cn('w-[14.6785rem]', {
                      '!border-red-600': hasMonthError,
                    })}
                  >
                    <SelectValue placeholder="월 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>월 선택</SelectLabel>
                      {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}월
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CustomFormItem>
            {!isGED && (
              <CustomFormItem text="학년/반/번호" className={cn('gap-1')} required fullWidth>
                <div className={cn('flex', 'w-full', 'justify-between')}>
                  <Select>
                    <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                      <SelectValue placeholder={`${FIXED_GRADE}학년`} />
                    </SelectTrigger>
                  </Select>
                  <Select
                    value={classroom || ''}
                    onValueChange={(value) => setValue('classroom', value)}
                  >
                    <SelectTrigger
                      className={cn('w-[9.3785rem]', {
                        '!border-red-600': hasClassroomError,
                      })}
                    >
                      <SelectValue placeholder="반 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>반 선택</SelectLabel>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                          <SelectItem key={c} value={c.toString()}>
                            {c}반
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select value={number || ''} onValueChange={(value) => setValue('number', value)}>
                    <SelectTrigger
                      className={cn('w-[9.3785rem]', {
                        '!border-red-600': hasNumberError,
                      })}
                    >
                      <SelectValue placeholder="번호 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>번호 선택</SelectLabel>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}번
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CustomFormItem>
            )}
          </div>
        </div>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-10')}>
          <RadioButton<ScreeningValueEnum>
            title={'전형'}
            list={[...screeningList]}
            required
            selectedValue={screening}
            handleOptionClick={(value) => setValue('screening', value)}
            error={showError}
          />
          <div className={cn('flex', 'flex-col', 'gap-7', 'w-full')}>
            <div className={cn('flex', 'flex-col', 'items-start', 'gap-1.5', 'w-full')}>
              <CustomFormItem
                text={'지원학과'}
                className={cn('gap-1')}
                required={true}
                fullWidth={true}
              >
                <div className={cn('flex', 'w-full', 'justify-between')}>
                  {majorFieldList.map((fieldName, index) => {
                    const desiredSequence = index + 1;
                    const selectedValues = [
                      desiredSequence > 1 && firstDesiredMajor,
                      desiredSequence > 2 && secondDesiredMajor,
                    ].filter((value) => typeof value === 'string');
                    const filteredMajorList = majorList.filter(
                      ({ value }) => !selectedValues.includes(value),
                    );

                    return (
                      <Select
                        key={fieldName}
                        value={majorValueMap[fieldName] || ''}
                        onValueChange={(value) =>
                          // TODO string 값으로 와서 결국 한번더 검사해주는 로직을 작성해야함
                          (value === DesireMajorValueEnum.SW ||
                            value === DesireMajorValueEnum.IOT ||
                            value === DesireMajorValueEnum.AI) &&
                          handleDesiredMajorChange(fieldName, value)
                        }
                      >
                        <SelectTrigger
                          className={cn('w-[9.3785rem]', {
                            '!border-red-600':
                              desiredSequence === 1
                                ? hasFirstMajorError
                                : desiredSequence === 2
                                  ? hasSecondMajorError
                                  : hasThirdMajorError,
                          })}
                        >
                          <SelectValue placeholder={`${desiredSequence}지망`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{`${desiredSequence}지망 선택`}</SelectLabel>
                            {filteredMajorList.map(({ name, value }) => (
                              <SelectItem key={name} value={value}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  })}
                </div>
              </CustomFormItem>
            </div>
            <div
              className={cn(
                'flex',
                'flex-col',
                'w-full',
                'h-[5.75rem]',
                'justify-center',
                'items-center',
                'bg-slate-100',
                'rounded-md',
              )}
            >
              <ul
                className={cn(
                  'flex',
                  'flex-col',
                  'items-start',
                  'w-[26.5rem]',
                  'gap-1',
                  'list-disc',
                )}
              >
                {majorIntroductions.map(({ name, description }, index) => (
                  <li key={index} className={cn('text-slate-600', 'text-[0.75rem]/[1.125rem]')}>
                    <span className={cn('font-semibold')}>{name}</span>
                    <span className={cn('font-normal')}> - {description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Register;
