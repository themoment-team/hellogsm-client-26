'use client';

import { useEffect, useState } from 'react';

import { useGetEditability, useGetOneseoList } from '@repo/api/hooks';
import { useDebounce } from '@repo/hooks';
import { OneseoListType, ScreeningType, TestResultType, YesNo } from '@repo/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/shadcn';
import { cn } from '@repo/utils';

import { ApplicantTH, ApplicantTR, FilterBar, SideMenu } from '@/components';

interface MainPageProps {
  initialData: OneseoListType | undefined;
  isAfterFirstResults: boolean;
  isAfterSecondResults: boolean;
  is역량검사처리기간: boolean;
  is심층면접처리기간: boolean;
}

const flexColStyle = ['flex', 'flex-col'] as const;

const PER_PAGE = 10;
const DEFAULT_TEST_RESULT_TAG = 'ALL';

const testResultTypeConvertor: { [key: string]: string } = {
  ALL: '전체 지원자 관리',
  FIRST_PASS: '1차 전형 합격자 관리',
  FINAL_PASS: '최종 합격자 관리',
  FALL: '불합격자 관리',
};

const MainPage = ({
  initialData,
  isAfterFirstResults,
  isAfterSecondResults,
  is역량검사처리기간,
  is심층면접처리기간,
}: MainPageProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [keyword, setKeyword] = useState<string>('');
  const [testResultTag, setTestResultTag] = useState<TestResultType>(DEFAULT_TEST_RESULT_TAG);
  const [isSubmitted, setIsSubmitted] = useState<YesNo | string>('');
  const [screeningTag, setScreeningTag] = useState<ScreeningType | string>('');
  const [page, setPage] = useState<number>(0);

  const debouncedKeyword = useDebounce(keyword, 1000);

  const { data, refetch: oneseoRefetch } = useGetOneseoList(
    {
      page: page,
      size: PER_PAGE,
      testResultTag: testResultTag,
      screeningTag: screeningTag,
      isSubmitted: isSubmitted,
      keyword: debouncedKeyword,
    },
    {
      initialData: initialData,
    },
  );

  const { data: editableData, refetch: editableRefetch } = useGetEditability();

  const totalPages = data?.info.totalPages;

  const startPage = totalPages ? Math.max(0, Math.min(page, data.info.totalPages - 3)) : 0;

  const pageNumbers = totalPages
    ? Array.from(
        { length: Math.min(3, data.info.totalPages - startPage) },
        (_, i) => startPage + i + 1,
      )
    : [];

  useEffect(() => {
    oneseoRefetch();
  }, [debouncedKeyword, page, testResultTag, isSubmitted, screeningTag]);

  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, testResultTag, isSubmitted, screeningTag]);
  // 필터 조건이 변경 되었을때 1번부터 다시 시작

  return (
    <main
      className={cn([
        isOpen && 'ml-60',
        isOpen ? 'px-10' : 'pl-20 pr-10',
        'pt-[60px]',
        'pb-8',
        'bg-white',
      ])}
    >
      <SideMenu
        testResultTag={testResultTag}
        setTestResultTag={setTestResultTag}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className={cn([...flexColStyle, 'gap-8'])}>
        <h1 className={cn('text-gray-900', 'text-3xl', 'font-semibold')}>
          {testResultTypeConvertor[testResultTag]}
        </h1>
        <div className={cn([...flexColStyle, 'gap-5'])}>
          <FilterBar
            screeningTag={screeningTag}
            setScreeningTag={setScreeningTag}
            keyword={keyword}
            setKeyword={setKeyword}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            isAfterFirstResults={isAfterFirstResults}
            isAfterSecondResults={isAfterSecondResults}
          />
          <div
            className={cn(
              'border',
              'border-solid',
              'border-zinc-200',
              'w-full',
              'rounded-t-md',
              'overflow-hidden',
              'max-h-[calc(100vh-280px)]',
              'overflow-scroll',
            )}
          >
            <ApplicantTH />
            <div className={cn('bg-zinc-200', 'w-full', 'h-[1px]')} />
            {data?.oneseos &&
              data.oneseos.map((oneseo) => (
                <ApplicantTR
                  {...oneseo}
                  key={oneseo.memberId}
                  editableData={editableData}
                  oneseoRefetch={oneseoRefetch}
                  editableRefetch={editableRefetch}
                  is역량검사처리기간={is역량검사처리기간}
                  is심층면접처리기간={is심층면접처리기간}
                />
              ))}
          </div>

          {totalPages ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : 0))}
                  />
                </PaginationItem>
                {pageNumbers.map((pageNumber: number) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber - 1 === page}
                      onClick={() => setPage(pageNumber - 1)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) =>
                        prev < data.info.totalPages - 1 ? prev + 1 : data.info.totalPages - 1,
                      )
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : (
            <span className={cn('text-red-500')}>조회된 지원자 데이터가 없습니다.</span>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainPage;
