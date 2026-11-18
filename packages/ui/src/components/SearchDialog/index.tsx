'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { preconnect } from 'react-dom';
import { UseFormSetValue } from 'react-hook-form';

import { useDebouncedCallback } from '@repo/hooks';
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
  // 실제로 검색할 검색어. 입력이 400ms 멈추면 반영하고, 학교를 고르면 비워서 목록을 닫음
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // 학교를 고를 때 보이던 목록. 다음 검색 결과가 오기 전까지 이 목록이 다시 보이지 않게 기억
  const [listAtSelection, setListAtSelection] = useState<SchoolType[] | undefined>(undefined);

  const searchKeywordDebounce = useDebouncedCallback(setSearchKeyword, 400);

  const isSearchEnabled = searchKeyword.trim() !== '';

  const { data, isPlaceholderData } = useQuery({
    queryKey: ['schoolInfo', searchKeyword],
    queryFn: () => getSchools(searchKeyword),
    enabled: isSearchEnabled,
    staleTime: Infinity,
    // 새 검색어 결과가 올 때까지 이전 목록을 유지 (기존 동작과 동일)
    placeholderData: keepPreviousData,
    retry: false,
  });

  const isListFromBeforeSelection = isPlaceholderData && data === listAtSelection;
  const schools = isSearchEnabled && !isListFromBeforeSelection ? (data ?? []) : [];

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    searchKeywordDebounce.run(e.target.value);
  };

  const handleSchoolSelect = (school: SchoolType) => {
    searchKeywordDebounce.cancel();
    setKeyword(school.SCHUL_NM);
    setSearchKeyword('');
    setListAtSelection(data);
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
