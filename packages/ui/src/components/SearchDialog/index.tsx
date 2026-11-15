'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { preconnect } from 'react-dom';
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

const getSchools = async (keyword: string): Promise<SchoolType[]> => {
  const response = await fetch(
    new URL(
      `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.NEXT_PUBLIC_NEIS_API_KEY}&Type=json&SCHUL_NM=${encodeURIComponent(keyword)}&SCHUL_KND_SC_NM='중학교'`,
    ),
    {
      method: 'GET',
    },
  );

  const data = await response.json();

  return data?.schoolInfo?.[1]?.row || [];
};

const SearchDialog = ({ setValue }: SearchDialogProps) => {
  // 첫 학교 검색 요청 전에 학교 정보 API 서버와 연결을 미리 맺어 둠 (fetch가 CORS 요청이라 anonymous 연결로 맞춤)
  preconnect('https://open.neis.go.kr', { crossOrigin: 'anonymous' });

  const [keyword, setKeyword] = useState<string>('');
  // 학교를 고른 직후에는 그 이름으로 다시 검색하지 않도록 선택한 학교명을 기억
  const [selectedSchoolName, setSelectedSchoolName] = useState<string | null>(null);

  const debouncedKeyword = useDebounce(keyword, 400);

  const isSearchEnabled =
    debouncedKeyword.trim() !== '' &&
    keyword !== selectedSchoolName &&
    debouncedKeyword !== selectedSchoolName;

  const { data } = useQuery({
    queryKey: ['schoolInfo', debouncedKeyword],
    queryFn: () => getSchools(debouncedKeyword),
    enabled: isSearchEnabled,
    staleTime: Infinity,
    // 새 검색어 결과가 올 때까지 이전 목록을 유지 (기존 동작과 동일)
    placeholderData: keepPreviousData,
    retry: false,
  });

  const schools = isSearchEnabled ? (data ?? []) : [];

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSchoolSelect = (school: SchoolType) => {
    setKeyword(school.SCHUL_NM);
    setSelectedSchoolName(school.SCHUL_NM);
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
