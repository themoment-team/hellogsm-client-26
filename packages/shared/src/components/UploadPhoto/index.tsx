'use client';

import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Step1FormType } from 'types';

import { UploadIcon } from 'shared/assets';
import { CustomFormItem } from 'shared/components';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

import { usePostImage } from 'api/hooks';

interface UploadPhotoProps {
  setValue: UseFormSetValue<Step1FormType>;
  watch: UseFormWatch<Step1FormType>;
  errors: FieldErrors<Step1FormType>;
  showError: boolean;
}

const UploadPhoto = ({ setValue, watch, errors, showError }: UploadPhotoProps) => {
  const { setImageUploadSizeLimitModal } = useModalStore();
  const profileImg = watch('profileImg');

  const { mutate: postImage, isSuccess } = usePostImage({
    onSuccess: ({ url }) => setValue('profileImg', url),
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size >= MAX_FILE_SIZE) {
      setImageUploadSizeLimitModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    postImage(formData);
  };

  return (
    <>
      <div className={cn('flex', 'items-end', 'gap-[0.5rem]')}>
        <div className={cn('flex', 'w-[8.75rem]', 'flex-col', 'items-start', 'gap-[0.25rem]')}>
          <CustomFormItem text={'증명사진'} required={true} className={cn('gap-1')}>
            <input
              className={cn('hidden')}
              type="file"
              id="file-input"
              multiple
              accept=".jpg, .jpeg, .png"
              onChange={handlePhotoUpload}
            />

            <label
              className={cn(
                'flex',
                'w-[8.75rem]',
                'h-[10rem]',
                'bg-[#F5F6F8]',
                'rounded-lg',
                errors.profileImg && showError && !isSuccess
                  ? 'border border-red-600'
                  : 'border-2 border-gray-200',
                'justify-center',
                'items-center',
                'gap-[0.625rem]',
                'cursor-pointer',
              )}
              htmlFor="file-input"
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Uploaded"
                  className={cn(
                    'w-[8.75rem]',
                    'h-[10rem]',
                    'object-cover',
                    'rounded-lg',
                    'h-[10rem]',
                    'w-[8.75rem]',
                  )}
                />
              ) : (
                <div
                  className={cn(
                    'flex',
                    'w-[2.8125rem]',
                    'flex-col',
                    'items-center',
                    'gap-[0.25rem]',
                  )}
                >
                  <UploadIcon />
                  <p className={cn('text-gray-400', 'text-[0.75rem]/[1.125rem]', 'font-normal')}>
                    사진 첨부
                  </p>
                </div>
              )}
            </label>
          </CustomFormItem>
        </div>
        <ul className={cn('text-slate-600', 'text-[0.75rem]/[1.125rem]', 'font-[400]')}>
          <li>&middot; 5MB 이하</li>
          <li>&middot; 3개월 이내의 3x4 cm 증명사진</li>
          <li>&middot; jpg, jpeg, png 형식</li>
        </ul>
      </div>
    </>
  );
};

export default UploadPhoto;
