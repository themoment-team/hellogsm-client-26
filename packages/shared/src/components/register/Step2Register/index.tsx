'use client';

import { useEffect } from 'react';

import {
  FormState,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import {
  DesireMajorValueEnum,
  GraduationTypeValueEnum,
  ScreeningValueEnum,
  Step2FormType,
} from 'types';

import { RadioButton, SearchDialog } from 'shared/components';
import {
  Input,
  CustomFormItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from 'shared/components';
import { CURRENT_YEAR, NEXT_YEAR } from 'shared/constants';
import { cn } from 'shared/lib/utils';

interface Step2RegisterProps {
  register: UseFormRegister<Step2FormType>;
  setValue: UseFormSetValue<Step2FormType>;
  watch: UseFormWatch<Step2FormType>;
  reset: UseFormReset<Step2FormType>;
  trigger: UseFormTrigger<Step2FormType>;
  formState: FormState<Step2FormType>;
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

const Step2Register = ({
  register,
  setValue,
  watch,
  reset,
  trigger,
  formState: { errors },
  showError,
}: Step2RegisterProps) => {
  const majorFieldList: MajorFieldType[] = [
    'firstDesiredMajor',
    'secondDesiredMajor',
    'thirdDesiredMajor',
  ];

  const year = watch('graduationDate').split('-')[0];
  const month = watch('graduationDate').split('-')[1];
  const classroom = watch('classroom');
  const number = watch('number');

  const isCandidate = watch('graduationType') === GraduationTypeValueEnum.CANDIDATE;
  const isGED = watch('graduationType') === GraduationTypeValueEnum.GED;

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
    } else if (!watch('schoolName')) {
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
          { ...watch(), secondDesiredMajor: undefined, thirdDesiredMajor: undefined },
          { keepErrors: true, keepIsSubmitted: true },
        );

        return;

      case 'secondDesiredMajor':
        setValue('secondDesiredMajor', value);
        reset(
          { ...watch(), thirdDesiredMajor: undefined },
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
    (watch('firstDesiredMajor') === undefined || watch('firstDesiredMajor') === null);
  const hasSecondMajorError =
    showError &&
    errors.secondDesiredMajor &&
    (watch('secondDesiredMajor') === undefined || watch('secondDesiredMajor') === null);
  const hasThirdMajorError =
    showError &&
    errors.thirdDesiredMajor &&
    (watch('thirdDesiredMajor') === undefined || watch('thirdDesiredMajor') === null);

  useEffect(() => {
    if (!isGED && watch('schoolName') === null) {
      setValue('schoolName', '');
      setValue('schoolAddress', '');
    }
  }, []);

  useEffect(() => {
    if (!showError) return;

    const validateForm = async () => {
      await trigger();
    };

    validateForm();
  }, [showError]);

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
            selectedValue={watch('graduationType')}
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
                    {...register('schoolName')}
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
            selectedValue={watch('screening')}
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
                      desiredSequence > 1 && watch('firstDesiredMajor'),
                      desiredSequence > 2 && watch('secondDesiredMajor'),
                    ].filter((value) => typeof value === 'string');
                    const filteredMajorList = majorList.filter(
                      ({ value }) => !selectedValues.includes(value),
                    );

                    return (
                      <Select
                        key={fieldName}
                        value={watch(fieldName) || ''}
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
