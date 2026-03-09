'use client';

import { useState } from 'react';

import { cn } from 'shared/lib/utils';
import { scrollToElement } from 'shared/utils';

const formArray = ['일반교과', '예체능 교과', '비교과'] as const;

type FormType = '일반교과' | '예체능 교과' | '비교과';

interface FormControllerProps {
  className?: string;
}

const formTypeToElementId = {
  일반교과: '#generalSubject',
  '예체능 교과': '#artPhysicalSubject',
  비교과: '#nonSubject',
};

const FormController = ({ className }: FormControllerProps) => {
  const [isSelected, setIsSelected] = useState<FormType | null>(null);

  const handleButtonClick = (formName: FormType) => {
    setIsSelected(formName);

    scrollToElement(formTypeToElementId[formName]);
  };

  return (
    <div className={cn(['flex', 'flex-col', className])}>
      <div className={cn('flex', 'flex-col', 'gap-[0.125rem]', 'sticky', 'top-[7rem]', 'h-fit')}>
        {formArray.map((formName) => (
          <button
            onClick={() => handleButtonClick(formName)}
            className={cn([
              'flex',
              'w-30',
              'text-sm',
              'leading-5',
              'gap-2',
              'rounded-md',
              'px-3',
              'py-2',
              'items-center',
              isSelected === formName
                ? ['font-medium', 'bg-blue-50', 'text-blue-600']
                : ['font-normal', 'bg-transparent', 'text-slate-400'],
            ])}
            key={formName}
          >
            <div
              className={cn([
                [
                  'w-2',
                  'h-2',
                  'rounded-full',
                  isSelected === formName ? 'bg-blue-500' : 'bg-slate-200',
                ],
              ])}
            ></div>
            {formName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormController;
