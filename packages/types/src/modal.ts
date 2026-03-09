import { MockScoreType } from 'types';

export interface SimpleModal {
  isOpen: boolean;
}

export interface ConfirmModal extends SimpleModal {
  onConfirm: () => void;
}

export interface LoginModal extends SimpleModal {
  isMain: boolean;
}

export interface ResultModal extends SimpleModal {
  isFirstTest: boolean;
}

export interface ScoreModal extends SimpleModal {
  data: MockScoreType | null;
  type: 'score' | 'mock';
}

export interface ApplicationModal extends SimpleModal {
  type: 'client' | 'admin';
}

export interface AdminModals {
  documentSubmissionChangeModal: ConfirmModal;
  admissionAgreementChangeModal: ConfirmModal;
  applicationModificationNotPossibleModal: SimpleModal;
  firstResultAnnouncementModal: SimpleModal;
  secondResultAnnouncementModal: SimpleModal;
}

export interface ClientModals {
  loginRequiredModal: LoginModal;
  resultAnnouncementPeriodModal: ResultModal;
  devServerNoticeModal: SimpleModal;
  testPeriodNoticeModal: SimpleModal;
  verificationCodeSendErrorModal: SimpleModal;
  signupSuccessModal: SimpleModal;
  signupErrorModal: SimpleModal;
  phoneNumberDuplicateModal: ConfirmModal;
  applicationPeriodModal: SimpleModal;
  oneseoNotSubmittedModal: SimpleModal;
  resultNotAnnouncedModal: SimpleModal;
}

export interface SharedModals {
  systemInspectionModal: SimpleModal;
  scoreCalculationCompleteModal: ScoreModal;
  applicationSubmitModal: ApplicationModal;
  imageUploadSizeLimitModal: SimpleModal;
}

export interface ModalActions {
  setDocumentSubmissionChangeModal: (isOpen: boolean, onConfirm?: () => void) => void;
  setAdmissionAgreementChangeModal: (isOpen: boolean, onConfirm?: () => void) => void;
  setApplicationModificationNotPossibleModal: (isOpen: boolean) => void;
  setFirstResultAnnouncementModal: (isOpen: boolean) => void;
  setSecondResultAnnouncementModal: (isOpen: boolean) => void;

  setLoginRequiredModal: (isOpen: boolean, isMain?: boolean) => void;
  setResultAnnouncementPeriodModal: (isOpen: boolean, isFirstTest?: boolean) => void;
  setDevServerNoticeModal: (isOpen: boolean) => void;
  setTestPeriodNoticeModal: (isOpen: boolean) => void;
  setVerificationCodeSendErrorModal: (isOpen: boolean) => void;
  setSignupSuccessModal: (isOpen: boolean) => void;
  setSignupErrorModal: (isOpen: boolean) => void;
  setPhoneNumberDuplicateModal: (isOpen: boolean, onConfirm?: () => void) => void;
  setApplicationPeriodModal: (isOpen: boolean) => void;
  setOneseoNotSubmittedModal: (isOpen: boolean) => void;
  setResultNotAnnouncedModal: (isOpen: boolean) => void;

  setSystemInspectionModal: (isOpen: boolean) => void;
  setScoreCalculationCompleteModal: (
    isOpen: boolean,
    data?: MockScoreType | null,
    type?: 'score' | 'mock',
  ) => void;
  setApplicationSubmitModal: (isOpen: boolean, type?: 'client' | 'admin') => void;
  setImageUploadSizeLimitModal: (isOpen: boolean) => void;
}

export interface ModalStore extends AdminModals, ClientModals, SharedModals, ModalActions {}
