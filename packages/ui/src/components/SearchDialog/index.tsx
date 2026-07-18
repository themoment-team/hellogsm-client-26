'use client';

import { useState, useEffect, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { useDebounce } from '@repo/hooks';
import { Step2FormType } from '@repo/types';
import { cn } from '@repo/utils';

import { SearchElements } from '../';
import { SearchIcon } from '../../icons';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
} from '../../shadcn';

interface SearchDialogProps {
  setValue: UseFormSetValue<Step2FormType>;
}

interface SchoolType {
  SCHUL_NM: string;
  // eslint-disable-next-line @cspell/spellchecker
  ORG_RDNMA: string;
}

const SearchDialog = ({ setValue }: SearchDialogProps) => {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  // 학교 선택 직후의 debounce 사이클 1회를 건너뛰기 위한 플래그 — 렌더에 쓰이지 않으므로 ref
  const isSelectingRef = useRef(false);

  const debouncedKeyword = useDebounce(keyword, 400);

  const getSchools = async () => {
    if (debouncedKeyword.trim() === '') {
      setSchools([]);
      return;
    }

    const response = await fetch(
      new URL(
        `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.NEXT_PUBLIC_NEIS_API_KEY}&Type=json&SCHUL_NM=${keyword}&SCHUL_KND_SC_NM='중학교'`,
      ),
      {
        method: 'GET',
      },
    );

    const data = await response.json();

    const rows = data?.schoolInfo?.[1]?.row || [];

    setSchools(rows);
  };

  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    // 빈 키워드 처리는 getSchools 내부에서 수행 (setSchools([]) 후 조기 반환)
    void getSchools();
  }, [debouncedKeyword]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSchoolSelect = (school: SchoolType) => {
    setKeyword(school.SCHUL_NM);
    setSchools([]);
    isSelectingRef.current = true;
    setValue('schoolName', school.SCHUL_NM, { shouldValidate: true, shouldDirty: true });
    // eslint-disable-next-line @cspell/spellchecker
    setValue('schoolAddress', school.ORG_RDNMA, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="next">학교 찾기</Button>
      </DialogTrigger>
      <DialogContent className={cn('w-fit', 'p-0', 'rounded-lg')} showCloseIcon={false}>
        <DialogTitle className={cn('sr-only')}>학교 찾기</DialogTitle>
        <div
          className={cn(
            'w-[29.5rem]',
            'flex',
            'p-6',
            'flex-col',
            'items-start',
            'gap-6',
            'shadow-lg',
          )}
        >
          <div className={cn('flex', 'w-full', 'flex-col', 'items-start', 'gap-4', 'relative')}>
            <p className={cn('text-zinc-950', 'text-[1.125rem]/[1.75rem]', 'font-semibold')}>
              내 중학교 찾기
            </p>
            <Input
              width="full"
              placeholder="학교명 검색"
              icon={<SearchIcon />}
              value={keyword}
              onChange={handleKeywordChange}
            />
            <SearchElements schools={schools} onSelectSchool={handleSchoolSelect} />
          </div>
          <div className={cn('flex', 'w-full', 'justify-end', 'items-center')}>
            {keyword.length === 0 ? (
              <Button variant="submit">확인</Button>
            ) : (
              <DialogClose asChild>
                <Button variant="next">확인</Button>
              </DialogClose>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
