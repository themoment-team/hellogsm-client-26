'use client';

import { useRef } from 'react';

import type { AxiosError } from 'axios';

import { useGetOperation, usePostExcel } from 'api';
import { toast } from 'react-toastify';

import { SearchIcon, FileIcon, CloverIcon, MedalIcon, UploadIcon } from 'admin/assets';

import { PrintIcon } from 'shared/assets';
import {
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Button,
  SelectLabel,
  SelectGroup,
} from 'shared/components';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

import { oneseoUrl } from 'api/libs';

import { YesNo, ScreeningType } from 'types/oneseo';

interface FilterBarProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  isSubmitted: YesNo | string;
  setIsSubmitted: React.Dispatch<React.SetStateAction<YesNo | string>>;
  screeningTag: ScreeningType | string;
  setScreeningTag: React.Dispatch<React.SetStateAction<ScreeningType | string>>;
  isAfterFirstResults: boolean;
  isAfterSecondResults: boolean;
}

const FilterBar = ({
  setKeyword,
  keyword,
  isSubmitted,
  setIsSubmitted,
  setScreeningTag,
  screeningTag,
  isAfterFirstResults,
  isAfterSecondResults,
}: FilterBarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setFirstResultAnnouncementModal, setSecondResultAnnouncementModal } = useModalStore();

  const { data: operationData, refetch: operationRefetch } = useGetOperation();

  const { mutate: postExcel, isPending } = usePostExcel({
    onSuccess: () => {
      operationRefetch();
      toast.success('Excel 업로드에 성공했습니다!');
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      const serverMessage = axiosError.response?.data?.message;
      toast.error(serverMessage ?? '오류가 발생했습니다.');
    },
  });

  const handleSubmittedChange = (value: string) => {
    if (value === 'YES' || value === 'NO') {
      setIsSubmitted(value);
      return;
    }
  };

  const handleScreeningTagChange = (value: string) => {
    if (value === 'GENERAL' || value === 'SPECIAL' || value === 'EXTRA') {
      setScreeningTag(value);
    }
  };

  const resetFilterData = () => {
    setIsSubmitted('');
    setScreeningTag('');
    setKeyword('');
  };

  const printExcel = () => {
    window.open(`/api${oneseoUrl.getExcel()}`);
  };

  const handlePrintButtonClick = () => {
    window.open('/print');
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleExcelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const isExcel = file?.name.toLowerCase().endsWith('.xlsx');

    if (!isExcel) {
      toast.error('Excel 파일(.xlsx)만 업로드 가능합니다.');
    } else if (file) {
      const formData = new FormData();
      formData.append('file', file);
      postExcel(formData);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className={cn('flex', 'items-center', 'justify-between', 'w-full')}>
        <div className={cn('flex', 'items-center')}>
          <Input
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            icon={<SearchIcon />}
            width="large"
            placeholder="지원자  명, 중학교 명, 지원자 휴대폰 번호 검색"
          />

          <div className={cn('w-px', 'h-6', 'bg-slate-200', 'mx-5')} />

          <div className={cn('flex', 'gap-2')}>
            <Select value={screeningTag} onValueChange={handleScreeningTagChange}>
              <SelectTrigger className={cn('w-[180px]')}>
                <SelectValue placeholder="전형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>전형선택</SelectLabel>
                  <SelectItem value="GENERAL">일반전형</SelectItem>
                  <SelectItem value="SPECIAL">특별전형</SelectItem>
                  <SelectItem value="EXTRA">정원 외 특별전형</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={isSubmitted} onValueChange={handleSubmittedChange}>
              <SelectTrigger className={cn('w-[180px]')}>
                <SelectValue placeholder="서류 제출 여부" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>서류 제출 여부</SelectLabel>
                  <SelectItem value="NO">제출 전</SelectItem>
                  <SelectItem value="YES">제출 완료</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={resetFilterData} variant="ghost" className={cn('text-slate-400')}>
              필터 초기화
            </Button>
          </div>
        </div>

        <div className={cn('flex', 'gap-2')}>
          <Button
            variant="outline"
            className={cn('border-slate-900', 'gap-2', 'hover:bg-slate-200')}
            disabled={
              operationData?.firstTestResultAnnouncementYn === 'YES' || !isAfterFirstResults
            }
            onClick={() => setFirstResultAnnouncementModal(true)}
          >
            <CloverIcon />
            1차 결과 발표
          </Button>
          <Button
            variant="outline"
            className={cn('border-slate-900', 'gap-2', 'hover:bg-slate-200')}
            disabled={
              operationData?.secondTestResultAnnouncementYn === 'YES' || !isAfterSecondResults
            }
            onClick={() => setSecondResultAnnouncementModal(true)}
          >
            <MedalIcon />
            2차 결과 발표
          </Button>
          <Button
            onClick={handlePrintButtonClick}
            className={cn('gap-2', 'bg-slate-900', 'hover:bg-slate-700')}
          >
            <PrintIcon />
            수험표 출력
          </Button>
          <Button
            onClick={printExcel}
            variant="outline"
            className={cn('border-slate-900', 'gap-2', 'hover:bg-slate-200')}
          >
            <FileIcon />
            Excel 다운
          </Button>
          <Button
            onClick={handleUploadButtonClick}
            variant="outline"
            className={cn('border-slate-900', 'gap-2', 'hover:bg-slate-200')}
            disabled={isPending}
          >
            <UploadIcon />
            {isPending ? 'Excel 업로드 중' : 'Excel 업로드'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleExcelFileChange}
              className={cn('hidden')}
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
