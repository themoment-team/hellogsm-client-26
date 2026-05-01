'use client';

import { useEffect } from 'react';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  FormState,
} from 'react-hook-form';

import { SexValueEnum, Step1FormType } from '@repo/types';
import { cn } from '@repo/utils';

import { UploadPhoto, RadioButton, CustomFormItem } from '../../';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn';

interface Step1RegisterProps {
  phoneNumber: string;
  register: UseFormRegister<Step1FormType>;
  setValue: UseFormSetValue<Step1FormType>;
  watch: UseFormWatch<Step1FormType>;
  trigger: UseFormTrigger<Step1FormType>;
  formState: FormState<Step1FormType>;
  showError: boolean;
}

const BIRTH_YEARS = Array.from({ length: 20 }, (_, i) => 2015 - i);
const BIRTH_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const BIRTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const Step1Register = ({
  phoneNumber,
  register,
  setValue,
  watch,
  trigger,
  formState: { errors },
  showError,
}: Step1RegisterProps) => {
  const daumPostCode = useDaumPostcodePopup();

  const birth = watch('birth') || '';
  const [birthYear, birthMonth, birthDay] = birth.split('-');

  const sexList = [
    { name: '남자', value: SexValueEnum.MALE },
    { name: '여자', value: SexValueEnum.FEMALE },
  ];

  const regionMap: Record<string, string> = {
    서울: '서울특별시',
    부산: '부산광역시',
    대구: '대구광역시',
    인천: '인천광역시',
    광주: '광주광역시',
    대전: '대전광역시',
    울산: '울산광역시',
    세종: '세종특별자치시',
    경기: '경기도',
    강원: '강원특별자치도',
    충북: '충청북도',
    충남: '충청남도',
    전북: '전북특별자치도',
    전남: '전라남도',
    경북: '경상북도',
    경남: '경상남도',
    제주: '제주특별자치도',
  };

  const handleDaumPostCodePopupComplete = ({ address }: Address) => {
    const [region, ...rest] = address.split(' ');
    const formattedRegion = regionMap[region ?? ''] ?? region ?? '';
    const formattedAddress = [formattedRegion, ...rest].join(' ');

    setValue('address', formattedAddress, { shouldValidate: true, shouldDirty: true });
  };

  const handleZipCodeButtonClick = () =>
    daumPostCode({
      popupTitle: 'Hello, GSM 2024',
      onComplete: handleDaumPostCodePopupComplete,
    });

  const handleBirthYearChange = (year: string) => {
    const month = birthMonth || '01';
    const day = birthDay || '01';
    setValue('birth', `${year}-${month}-${day}`, { shouldValidate: true, shouldDirty: true });
  };

  const handleBirthMonthChange = (month: string) => {
    const year = birthYear || '2000';
    const day = birthDay || '01';
    setValue('birth', `${year}-${month.padStart(2, '0')}-${day}`, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleBirthDayChange = (day: string) => {
    const year = birthYear || '2000';
    const month = birthMonth || '01';
    setValue('birth', `${year}-${month}-${day.padStart(2, '0')}`, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    if (!showError) return;

    const validateForm = async () => {
      await trigger();
    };

    validateForm();
  }, [showError]);

  return (
    <div
      className={cn('flex', 'w-full', 'h-[28.75rem]', 'flex-col', 'items-start', 'justify-between')}
    >
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-[0.125rem]')}>
        <h1 className={cn('text-gray-900', 'text-[1.25rem]/[1.75rem]', 'font-semibold')}>
          기본 정보를 입력해 주세요.
        </h1>
        <p className={cn('text-gray-600', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
          전화번호를 제외한 인적사항을 수정할 수 있습니다.
        </p>
      </div>

      <div className={cn('flex', 'items-end', 'gap-[3rem]')}>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-[2rem]')}>
          <UploadPhoto setValue={setValue} watch={watch} errors={errors} showError={showError} />
          <CustomFormItem text={'이름'} className={cn('gap-1')} required={true} fullWidth={true}>
            <Input
              {...register('name')}
              placeholder="이름을 입력해 주세요"
              width="full"
              variant={showError && errors.name ? 'error' : null}
            />
          </CustomFormItem>
          <CustomFormItem
            text={'생년월일'}
            className={cn('gap-1')}
            required={true}
            fullWidth={true}
          >
            <div className={cn('flex', 'w-full', 'justify-between')}>
              <Select value={birthYear || ''} onValueChange={handleBirthYearChange}>
                <SelectTrigger
                  className={cn('w-[9.3785rem]', showError && errors.birth && '!border-red-600')}
                >
                  <SelectValue placeholder="연도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>연도 선택</SelectLabel>
                    {BIRTH_YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={birthMonth ? Number(birthMonth).toString() : ''}
                onValueChange={handleBirthMonthChange}
              >
                <SelectTrigger
                  className={cn('w-[9.3785rem]', showError && errors.birth && '!border-red-600')}
                >
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>월 선택</SelectLabel>
                    {BIRTH_MONTHS.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month}월
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={birthDay ? Number(birthDay).toString() : ''}
                onValueChange={handleBirthDayChange}
              >
                <SelectTrigger
                  className={cn('w-[9.3785rem]', showError && errors.birth && '!border-red-600')}
                >
                  <SelectValue placeholder="일 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>일 선택</SelectLabel>
                    {BIRTH_DAYS.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}일
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CustomFormItem>
        </div>

        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-10')}>
          <RadioButton
            title={'성별'}
            list={sexList}
            required={true}
            selectedValue={watch('sex') || ''}
            handleOptionClick={(value) =>
              setValue('sex', value as 'MALE' | 'FEMALE', {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={showError && !!errors.sex}
          />

          <div className={cn('flex', 'flex-col', 'items-start', 'gap-[0.375rem]', 'w-full')}>
            <CustomFormItem
              text={'주소지'}
              className={cn('gap-1')}
              required={true}
              fullWidth={true}
            >
              <div className={cn('w-full', 'flex', 'gap-2')}>
                <Input
                  placeholder={'주소를 입력해 주세요'}
                  width="full"
                  disabled
                  {...register('address')}
                  variant={showError && errors.address ? 'error' : null}
                />

                <Button onClick={handleZipCodeButtonClick}>주소 찾기</Button>
              </div>
            </CustomFormItem>
            <Input
              placeholder="상세주소"
              width="full"
              {...register('detailAddress')}
              variant={showError && errors.detailAddress ? 'error' : null}
            />
          </div>

          <CustomFormItem
            text={'휴대폰 번호'}
            className={cn('gap-1')}
            required={true}
            fullWidth={true}
          >
            <Input placeholder={phoneNumber} disabled width="full" />
          </CustomFormItem>
        </div>
      </div>
    </div>
  );
};

export default Step1Register;
