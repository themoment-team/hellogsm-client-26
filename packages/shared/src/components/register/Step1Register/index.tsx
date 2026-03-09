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
import { SexType, SexValueEnum, Step1FormType } from 'types';

import {
  CustomFormItem,
  RadioButton,
  UploadPhoto,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
} from 'shared/components';
import { cn } from 'shared/lib/utils';

interface Step1RegisterProps {
  name: string;
  birth: string;
  sex: SexType;
  phoneNumber: string;
  register: UseFormRegister<Step1FormType>;
  setValue: UseFormSetValue<Step1FormType>;
  watch: UseFormWatch<Step1FormType>;
  trigger: UseFormTrigger<Step1FormType>;
  formState: FormState<Step1FormType>;
  showError: boolean;
}

const Step1Register = ({
  name,
  birth,
  sex,
  phoneNumber,
  register,
  setValue,
  watch,
  trigger,
  formState: { errors },
  showError,
}: Step1RegisterProps) => {
  const daumPostCode = useDaumPostcodePopup();

  // 개선 필요해보임
  const birthDate = birth ? new Date(birth) : null;
  const birthYear = birthDate ? birthDate.getFullYear() : '';
  const birthMonth = birthDate ? String(birthDate.getMonth() + 1).padStart(2, '0') : '';
  const birthDay = birthDate ? String(birthDate.getDate()).padStart(2, '0') : '';
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
    const formattedRegion = regionMap[region] ?? region;
    const formattedAddress = [formattedRegion, ...rest].join(' ');

    setValue('address', formattedAddress, { shouldValidate: true, shouldDirty: true });
  };

  const handleZipCodeButtonClick = () =>
    daumPostCode({
      popupTitle: 'Hello, GSM 2024',
      onComplete: handleDaumPostCodePopupComplete,
    });

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
          회원가입 시 입력한 기본 정보가 노출됩니다.
        </p>
      </div>

      <div className={cn('flex', 'items-end', 'gap-[3rem]')}>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-[2rem]')}>
          <UploadPhoto setValue={setValue} watch={watch} errors={errors} showError={showError} />
          <CustomFormItem text={'이름'} className={cn('gap-1')} required={true} fullWidth={true}>
            <Input placeholder={name} disabled={true} />
          </CustomFormItem>
          <CustomFormItem
            text={'생년월일'}
            className={cn('gap-1')}
            required={true}
            fullWidth={true}
          >
            <div className={cn('flex', 'w-full', 'justify-between')}>
              <Select>
                <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                  <SelectValue placeholder={birthYear} />
                </SelectTrigger>
              </Select>
              <Select>
                <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                  <SelectValue placeholder={birthMonth} />
                </SelectTrigger>
              </Select>
              <Select>
                <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                  <SelectValue placeholder={birthDay} />
                </SelectTrigger>
              </Select>
            </div>
          </CustomFormItem>
        </div>

        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-10')}>
          <RadioButton
            title={'성별'}
            list={sexList}
            required={true}
            disabled={true}
            selectedValue={sex}
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
