'use client';

import type { AxiosError } from 'axios';

import { toast } from 'react-toastify';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from 'shared/components';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

import { useGetOperation, usePostFirstResult, usePostSecondResult } from 'api/hooks';

const AdminModals = () => {
  const {
    documentSubmissionChangeModal,
    setDocumentSubmissionChangeModal,
    admissionAgreementChangeModal,
    setAdmissionAgreementChangeModal,
    applicationModificationNotPossibleModal,
    setApplicationModificationNotPossibleModal,
    firstResultAnnouncementModal,
    setFirstResultAnnouncementModal,
    secondResultAnnouncementModal,
    setSecondResultAnnouncementModal,
  } = useModalStore();

  const { refetch: operationRefetch } = useGetOperation();

  const { mutate: postFirstResult } = usePostFirstResult({
    onSuccess: () => {
      operationRefetch();
      toast.success('1차 결과가 성공적으로 발표되었습니다!');
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      const serverMessage = axiosError.response?.data?.message;
      toast.error(serverMessage ?? '1차 결과 발표 중 오류가 발생했습니다.');
    },
  });

  const { mutate: postSecondResult } = usePostSecondResult({
    onSuccess: () => {
      operationRefetch();
      toast.success('2차 결과가 성공적으로 발표되었습니다!');
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      const serverMessage = axiosError.response?.data?.message;
      toast.error(serverMessage ?? '2차 결과 발표 중 오류가 발생했습니다.');
    },
  });

  return (
    <>
      <AlertDialog open={documentSubmissionChangeModal.isOpen}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>서류 제출 여부를 변경하시겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentSubmissionChangeModal(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={documentSubmissionChangeModal.onConfirm}>
              변경하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={admissionAgreementChangeModal.isOpen}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>입학동의서 제출 여부를 변경하시겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdmissionAgreementChangeModal(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={admissionAgreementChangeModal.onConfirm}>
              변경하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={applicationModificationNotPossibleModal.isOpen}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>원서 수정을 할 수 없는 기간입니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApplicationModificationNotPossibleModal(false)}>
              닫기
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={firstResultAnnouncementModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              확인 버튼 클릭시 전체 지원자들에게 합격, 불합격 여부가 공개됩니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setFirstResultAnnouncementModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setFirstResultAnnouncementModal(false);
                postFirstResult();
              }}
            >
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={secondResultAnnouncementModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              확인 버튼 클릭시 전체 지원자들에게 합격, 불합격 여부가 공개됩니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setSecondResultAnnouncementModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setSecondResultAnnouncementModal(false);
                postSecondResult();
              }}
            >
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminModals;
