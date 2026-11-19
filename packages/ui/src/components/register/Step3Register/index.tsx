'use client';

import { useEffect } from 'react';
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useFormState,
  useWatch,
} from 'react-hook-form';

import { RelationshipWithGuardianValueEnum, Step3FormType } from '@repo/types';
import { cn } from '@repo/utils';

import { CustomFormItem, RadioButton } from '../../';
import { Input } from '../../../shadcn';

interface Step3RegisterProps {
  register: UseFormRegister<Step3FormType>;
  setValue: UseFormSetValue<Step3FormType>;
  control: Control<Step3FormType>;
  getValues: UseFormGetValues<Step3FormType>;
  isCandidate: boolean;
  showError: boolean;
}
const relationshipWithGuardianList = [
  { name: '부', value: RelationshipWithGuardianValueEnum.FATHER },
  { name: '모', value: RelationshipWithGuardianValueEnum.MOTHER },
  { name: '기타 (직접입력)', value: RelationshipWithGuardianValueEnum.OTHER },
] as const;

const Step3Register = ({
  register,
  setValue,
  control,
  getValues,
  isCandidate,
  showError,
}: Step3RegisterProps) => {
  // formState를 props로 받으면 부모의 {...step3UseForm} 스프레드가 메모이즈되어 첫 렌더
  // 값에 고정된다 — 컴포넌트 안에서 직접 구독한다 (React Compiler 호환)
  const { errors } = useFormState({ control });

  // 렌더 중 구독은 watch() 대신 useWatch 사용 (React Compiler 호환)
  const relationshipWithGuardian = useWatch({ control, name: 'relationshipWithGuardian' });
  const otherRelationshipWithGuardian = useWatch({
    control,
    name: 'otherRelationshipWithGuardian',
  });

  const handleRelationshipWithGuardianOptionClick = (value: RelationshipWithGuardianValueEnum) => {
    if (value !== RelationshipWithGuardianValueEnum.OTHER) {
      setValue('otherRelationshipWithGuardian', null);
    }

    setValue('relationshipWithGuardian', value);
  };

  useEffect(() => {
    if (isCandidate) {
      setValue('schoolTeacherName', getValues('schoolTeacherName') ?? '');
      setValue('schoolTeacherPhoneNumber', getValues('schoolTeacherPhoneNumber') ?? '');
    }

    if (!isCandidate) {
      setValue('schoolTeacherName', null);
      setValue('schoolTeacherPhoneNumber', null);
    }
  }, []);

  return (
    <div className={cn('flex', 'w-full', 'flex-col', 'items-start', 'gap-10')}>
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-0.5')}>
        <h1 className={cn('text-gray-900', 'text-[1.25rem]/[1.75rem]', 'font-semibold')}>
          보호자 / 담임선생님 정보를 입력해 주세요.
        </h1>
        <p className={cn('text-gray-600', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
          회원가입 시 입력한 기본 정보가 노출됩니다.
        </p>
      </div>

      <div className={cn('flex', 'items-start', 'gap-12')}>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-8')}>
          <CustomFormItem
            text={'보호자 이름 / 휴대폰 번호'}
            className={cn('gap-1')}
            required
            fullWidth
          >
            <Input
              placeholder="보호자 이름 입력"
              width="full"
              {...register('guardianName')}
              variant={showError && errors.guardianName ? 'error' : null}
            />
            <Input
              placeholder="보호자 휴대폰 번호 입력 (하이픈 '-' 제외)"
              width="full"
              {...register('guardianPhoneNumber')}
              variant={showError && errors.guardianPhoneNumber ? 'error' : null}
            />
          </CustomFormItem>
          <div className={cn('flex', 'flex-col', 'gap-3')}>
            <RadioButton<RelationshipWithGuardianValueEnum>
              title={'보호자 관계'}
              list={[...relationshipWithGuardianList]}
              selectedValue={relationshipWithGuardian}
              handleOptionClick={handleRelationshipWithGuardianOptionClick}
              error={showError}
              required
            />
            {relationshipWithGuardian === RelationshipWithGuardianValueEnum.OTHER && (
              <Input
                placeholder="직접 입력"
                {...register('otherRelationshipWithGuardian')}
                variant={
                  showError &&
                  (errors.otherRelationshipWithGuardian || otherRelationshipWithGuardian === null)
                    ? 'error'
                    : null
                }
              />
            )}
          </div>
        </div>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-8')}>
          {isCandidate && (
            <CustomFormItem
              text={'담임선생님 이름 / 연락처'}
              className={cn('gap-1')}
              required
              fullWidth
            >
              <Input
                placeholder="담임선생님 이름 입력"
                width="full"
                {...register('schoolTeacherName')}
                variant={showError && errors.schoolTeacherName ? 'error' : null}
              />
              <Input
                placeholder="담임선생님 연락처 입력 (하이픈 '-' 제외)"
                width="full"
                {...register('schoolTeacherPhoneNumber')}
                variant={showError && errors.schoolTeacherPhoneNumber ? 'error' : null}
              />
            </CustomFormItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Register;
