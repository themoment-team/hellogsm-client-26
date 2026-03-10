'use client';

import { ChevronIcon } from 'client/assets';

import { cn } from 'shared/lib/utils';

interface FaqProps {
  title: string;
  content: string;
  keyword: string;
  showContent: boolean;
  onToggle: () => void;
  isPageChanging: boolean;
}

const FaqElement = ({
  title,
  content,
  keyword,
  showContent,
  onToggle,
  isPageChanging,
}: FaqProps) => {
  const getHighlightedText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const lowerCaseText = text.toLowerCase();
    const lowerCaseKeyword = keyword.toLowerCase();

    let startIndex = 0;
    const result = [];
    while (true) {
      const index = lowerCaseText.indexOf(lowerCaseKeyword, startIndex);
      if (index === -1) break;

      result.push(text.substring(startIndex, index));
      result.push(
        <span key={index} className={cn('text-sky-500')}>
          {text.substring(index, index + keyword.length)}
        </span>,
      );
      startIndex = index + keyword.length;
    }
    result.push(text.substring(startIndex));

    return result;
  };

  return (
    <button
      className={cn(
        'flex',
        'w-full',
        'px-8',
        'py-[1.25rem]',
        'items-center',
        'bg-slate-50',
        'rounded-2xl',
        'flex-col',
      )}
      onClick={onToggle}
    >
      <div className={cn('flex', 'w-full', 'items-center', 'justify-between')}>
        <div className={cn('flex', 'items-center')}>
          <p
            className={cn(
              'text-sky-500',
              'text-[1rem]/[1.25rem]',
              'sm:text-[1.25rem]/[1.8125rem]',
              'font-bold',
              'mr-1',
            )}
          >
            Q.
          </p>
          <p
            className={cn(
              'text-slate-700',
              'text-[0.75rem]/[1rem]',
              'xs:text-[0.75rem]/[1.25rem]',
              'sm:text-[1.125rem]/[1.6875rem]',
              'font-semibold',
            )}
          >
            {getHighlightedText(title, keyword)}
          </p>
        </div>
        <div
          className={cn([
            'transition-transform duration-300',
            showContent ? 'rotate-180' : 'rotate-0',
          ])}
        >
          <ChevronIcon />
        </div>
      </div>

      <div
        className={cn([
          'w-full',
          'flex-col',
          'gap-4',
          'items-start',
          'overflow-hidden',
          'transition-[max-height, padding]',
          'duration-500',
          'ease-in-out',
          `${isPageChanging ? 'transition-none' : ''}`,
          showContent ? ['max-h-48', 'pt-4'] : ['max-h-0', 'pt-0'],
        ])}
      >
        <div
          className={cn([
            'w-full',
            'h-[0.05rem]',
            'bg-slate-300',
            'transition-all',
            'duration-500',
            'ease-in-out',
            showContent ? ['max-h-[0.05rem]', 'opacity-100'] : ['max-h-0', 'opacity-0'],
          ])}
        />
        <div
          className={cn(
            'text-slate-700',
            'text-[0.875rem]/[1.25rem]',
            'font-normal',
            'text-left',
            'pt-4',
          )}
          dangerouslySetInnerHTML={{ __html: content.replace(/\\"/g, '"') }}
        />
      </div>
    </button>
  );
};

export default FaqElement;
