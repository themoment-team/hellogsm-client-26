'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useModalStore } from '@repo/store';
import { cn } from '@repo/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '../../../shadcn';
import LoginDialog from '../../LoginDialog';

const ClientModals = () => {
  const {
    loginRequiredModal,
    setLoginRequiredModal,
    resultAnnouncementPeriodModal,
    setResultAnnouncementPeriodModal,
    devServerNoticeModal,
    setDevServerNoticeModal,
    testPeriodNoticeModal,
    setTestPeriodNoticeModal,
    verificationCodeSendErrorModal,
    setVerificationCodeSendErrorModal,
    signupSuccessModal,
    setSignupSuccessModal,
    signupErrorModal,
    setSignupErrorModal,
    phoneNumberDuplicateModal,
    setPhoneNumberDuplicateModal,
    applicationPeriodModal,
    setApplicationPeriodModal,
    oneseoNotSubmittedModal,
    setOneseoNotSubmittedModal,
    resultNotAnnouncedModal,
    setResultNotAnnouncedModal,
    oneseoModifyRequestModal,
    setOneseoModifyRequestModal,
  } = useModalStore();

  const { back } = useRouter();

  return (
    <>
      <AlertDialog
        open={loginRequiredModal.isOpen}
        onOpenChange={(isOpen) => setLoginRequiredModal(isOpen)}
      >
        <AlertDialogContent className={cn('w-[400px]')} onEscapeKeyDown={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <strong>
                {loginRequiredModal.isMain
                  ? '성적 조회를 하시려면 로그인을 진행해주세요'
                  : '로그인을 먼저 진행해주세요'}
              </strong>
              <br />
              <br />
              학부모/담임교사가 합격자 조회를 할 경우,
              <br />
              개인정보 보호를 위해 지원자 학생의 계정으로
              <br />
              로그인해야 합니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <LoginDialog />
            <AlertDialogAction onClick={!loginRequiredModal.isMain ? () => back() : undefined}>
              다음에
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resultAnnouncementPeriodModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              현재 {resultAnnouncementPeriodModal.isFirstTest ? '1차 합격' : '최종 합격'} 여부를
              조회할 수 없는 기간입니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link
                href={'/check-result'}
                onClick={() =>
                  setResultAnnouncementPeriodModal(false, resultAnnouncementPeriodModal.isFirstTest)
                }
              >
                확인
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={oneseoNotSubmittedModal.isOpen}>
        <AlertDialogContent className={cn('w-[410px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>합격자 조회는 원서를 작성한 지원자만 가능합니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href={'/check-result'} onClick={() => setOneseoNotSubmittedModal(false)}>
                확인
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={devServerNoticeModal.isOpen}
        onOpenChange={() => setDevServerNoticeModal(false)}
      >
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogTitle
            className={cn('flex', 'flex-col', 'text-center', 'gap-4', 'items-center')}
          >
            <p>현재 접속하신 주소는 개발환경입니다.</p>
            <p>아래 링크로 접속하여 원서를 작성해주세요.</p>
            <a
              href="https://www.hellogsm.kr"
              className={cn('text-blue-500', 'underline', 'w-fit')}
              rel="noreferrer"
            >
              www.hellogsm.kr
            </a>
          </AlertDialogTitle>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={testPeriodNoticeModal.isOpen}
        onOpenChange={() => setTestPeriodNoticeModal(false)}
      >
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogTitle
            className={cn('flex', 'flex-col', 'text-center', 'gap-4', 'items-center')}
          >
            <p>현재 테스트 기간입니다.</p>
            <p>일부 기능이 제한될 수 있습니다.</p>
          </AlertDialogTitle>
          <AlertDialogAction onClick={() => setTestPeriodNoticeModal(false)}>
            확인
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={verificationCodeSendErrorModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              인증번호 전송에 실패하였습니다. <br /> (인증번호는 최대 5번만 전송 가능합니다.)
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setVerificationCodeSendErrorModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={signupSuccessModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>회원가입에 성공했습니다!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setSignupSuccessModal(false);
                window.location.replace('/');
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={signupErrorModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>오류가 발생했습니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSignupErrorModal(false)}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={phoneNumberDuplicateModal.isOpen}>
        <AlertDialogContent className={cn('w-[520px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              같은 전화번호로 생성된 계정이 이미 존재합니다.
              <br />
              회원가입 시, 기존의 정보는 사라집니다. 진행하시겠습니까?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setPhoneNumberDuplicateModal(false)}>
              취소
            </Button>
            <AlertDialogAction onClick={phoneNumberDuplicateModal.onConfirm}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={applicationPeriodModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              1차 합격 결과 발표 이후에는 기존 회원 정보를 <br /> 삭제할 수 없습니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setApplicationPeriodModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resultNotAnnouncedModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              현재 합격자 발표가 아직 진행되지 않았습니다. <br /> 잠시 후 다시 확인해주세요.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setResultNotAnnouncedModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={oneseoModifyRequestModal.isOpen}>
        <AlertDialogContent className={cn('w-[520px]', 'gap-2')}>
          <AlertDialogHeader>
            <AlertDialogTitle>원서 수정을 요청하시겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            최종 제출 후에는 원서 수정이 원칙적으로 불가능하며, 관리자 승인 시에만 수정이
            가능합니다. 수정 권한 요청은 9시부터 16시 사이까지 가능합니다.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setOneseoModifyRequestModal(false)}>
              취소
            </Button>
            <AlertDialogAction onClick={oneseoModifyRequestModal.onConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientModals;
