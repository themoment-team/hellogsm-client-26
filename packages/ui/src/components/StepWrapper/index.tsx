'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  usePatchPersonalInfo,
  usePatchPersonalInfoByMemberId,
  usePostMockScore,
  usePostMyOneseo,
  usePostTempStorage,
  usePutMyOneseo,
  usePutOneseoByMemberId,
} from '@repo/api/hooks';
import { oneseoQueryKeys } from '@repo/api/lib';
import { ARTS_PHYSICAL_SUBJECTS, GENERAL_SUBJECTS } from '@repo/constants';
import { useModalStore } from '@repo/store';
import {
  GEDAchievementType,
  GetMyOneseoType,
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  MiddleSchoolAchievementType,
  MyMemberInfoType,
  PatchPersonalInfoType,
  PostOneseoType,
  RelationshipWithGuardianValueEnum,
  Step1FormType,
  step1Schema,
  Step2FormType,
  step2Schema,
  Step3FormType,
  step3Schema,
  Step4FormType,
  step4Schema,
  StepEnum,
} from '@repo/types';
import { cn, extractClassroomAndNumber, sendGAEvent } from '@repo/utils';

import { CloseIcon, InfoIcon } from '../../icons';
import ConfirmBar from '../ConfirmBar';
import EditBar from '../EditBar';
import { Step1Register, Step2Register, Step3Register, Step4Register } from '../register';
import StepBar from '../StepBar';

/** step 4에서 마지막 입력 이후 이 시간만큼 입력이 없으면 자동으로 임시저장한다 */
const IDLE_AUTO_SAVE_DELAY = 2 * 60 * 1000;

interface StepWrapperProps {
  data: GetMyOneseoType | undefined;
  info?: MyMemberInfoType;
  step: StepEnum;
  memberId?: number;
  type: 'client' | 'admin';
  isModifyApproved?: boolean;
}

const StepWrapper = ({ data, step, info, memberId, type, isModifyApproved }: StepWrapperProps) => {
  const { setScoreCalculationCompleteModal, setApplicationSubmitModal } = useModalStore();
  const queryClient = useQueryClient();

  const step1UseForm = useForm<Step1FormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(step1Schema),
    defaultValues: {
      profileImg: data?.privacyDetail.profileImg,
      name: type === 'client' ? info?.name : data?.privacyDetail.name,
      birth: type === 'client' ? info?.birth : data?.privacyDetail.birth,
      sex: (type === 'client' ? info?.sex : data?.privacyDetail.sex) as
        | 'MALE'
        | 'FEMALE'
        | undefined,
      address: data?.privacyDetail.address,
      detailAddress: data?.privacyDetail.detailAddress,
    },
  });

  const { classroom: initialClassroom, number: initialNumber } = extractClassroomAndNumber(
    data?.privacyDetail.studentNumber,
  );

  const step2UseForm = useForm<Step2FormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(step2Schema),
    defaultValues: {
      graduationType: data?.privacyDetail.graduationType,
      schoolName: data?.privacyDetail.schoolName,
      schoolAddress: data?.privacyDetail.schoolAddress,
      studentNumber: data?.privacyDetail.studentNumber,
      classroom: initialClassroom,
      number: initialNumber,
      graduationDate: data?.privacyDetail.graduationDate || '0000-00',
      screening: data?.wantedScreening,
      firstDesiredMajor: data?.desiredMajors.firstDesiredMajor,
      secondDesiredMajor: data?.desiredMajors.secondDesiredMajor,
      thirdDesiredMajor: data?.desiredMajors.thirdDesiredMajor,
    },
  });

  const step3UseForm = useForm<Step3FormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(step3Schema),
    defaultValues: {
      guardianName: data?.privacyDetail.guardianName || '',
      guardianPhoneNumber: data?.privacyDetail.guardianPhoneNumber || '',
      relationshipWithGuardian:
        data?.privacyDetail.relationshipWithGuardian === RelationshipWithGuardianValueEnum.FATHER ||
        data?.privacyDetail.relationshipWithGuardian === RelationshipWithGuardianValueEnum.MOTHER
          ? data?.privacyDetail.relationshipWithGuardian
          : (data?.privacyDetail.relationshipWithGuardian &&
              RelationshipWithGuardianValueEnum.OTHER) ||
            undefined,
      otherRelationshipWithGuardian: data?.privacyDetail.relationshipWithGuardian
        ? data?.privacyDetail.relationshipWithGuardian !==
            RelationshipWithGuardianValueEnum.FATHER &&
          data?.privacyDetail.relationshipWithGuardian !== RelationshipWithGuardianValueEnum.MOTHER
          ? data?.privacyDetail.relationshipWithGuardian
          : null
        : undefined,
      schoolTeacherName: data?.privacyDetail.schoolTeacherName,
      schoolTeacherPhoneNumber: data?.privacyDetail.schoolTeacherPhoneNumber,
    },
  });

  const step4UseForm = useForm<Step4FormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(step4Schema),
    defaultValues: {
      liberalSystem:
        data?.middleSchoolAchievement.liberalSystem || LiberalSystemValueEnum.FREE_SEMESTER,
      achievement1_1: data?.middleSchoolAchievement.achievement1_1 || undefined,
      achievement1_2: data?.middleSchoolAchievement.achievement1_2 || undefined,
      achievement2_1: data?.middleSchoolAchievement.achievement2_1 || undefined,
      achievement2_2: data?.middleSchoolAchievement.achievement2_2 || undefined,
      achievement3_1: data?.middleSchoolAchievement.achievement3_1 || undefined,
      achievement3_2: data?.middleSchoolAchievement.achievement3_2 || undefined,
      newSubjects: data?.middleSchoolAchievement.newSubjects || undefined,
      artsPhysicalAchievement: data?.middleSchoolAchievement.artsPhysicalAchievement || undefined,
      absentDays: data?.middleSchoolAchievement.absentDays || undefined,
      attendanceDays: data?.middleSchoolAchievement.attendanceDays || undefined,
      volunteerTime: data?.middleSchoolAchievement.volunteerTime || undefined,
      freeSemester: data?.middleSchoolAchievement.freeSemester || null,
      gedAvgScore: data?.middleSchoolAchievement.gedAvgScore || undefined,
    },
  });

  const [errorStep, setErrorStep] = useState<StepEnum | null>(null);

  const { push } = useRouter();
  // 렌더 중 구독은 watch() 대신 useWatch 사용 (React Compiler 호환)
  const graduationType = useWatch({ control: step2UseForm.control, name: 'graduationType' });

  const isClient = type === 'client';
  const isCandidate = graduationType === GraduationTypeValueEnum.CANDIDATE;
  const isGraduate = graduationType === GraduationTypeValueEnum.GRADUATE;
  const isGED = graduationType === GraduationTypeValueEnum.GED;
  const isStep4 = step === StepEnum.FOUR;

  const BASE_URL = isClient ? '/register' : `/edit/${memberId}`;

  const phoneNumber = isClient ? info!.phoneNumber : data!.privacyDetail.phoneNumber;

  const step1Values = useWatch({ control: step1UseForm.control });
  const step2Values = useWatch({ control: step2UseForm.control });
  const step3Values = useWatch({ control: step3UseForm.control });
  const step4Values = useWatch({ control: step4UseForm.control });

  const isStepSuccess = {
    '1': step1Schema.safeParse(step1Values).success,
    '2': step2Schema.safeParse(step2Values).success,
    '3': step3Schema.safeParse(step3Values).success,
    '4': step4Schema.safeParse(step4Values).success,
  };

  const isScoreComplete = Object.values(isStepSuccess).every((value) => value === true);

  const handleStepError = (step: StepEnum) => {
    setErrorStep((prev) => {
      if (prev === step) {
        setTimeout(() => setErrorStep(step), 0);
        return null;
      }
      return step;
    });
  };

  const clearStepError = () => {
    setErrorStep(null);
  };

  const { mutateAsync: patchPersonalInfo } = usePatchPersonalInfo();
  const { mutateAsync: patchPersonalInfoByMemberId } = usePatchPersonalInfoByMemberId(
    memberId ?? 0,
  );

  const { mutate: postMyOneseo } = usePostMyOneseo({
    onSuccess: () => {
      if (isClient) sendGAEvent('oneseo_submit', { is_modify: false });
      setApplicationSubmitModal(true, type);
      queryClient.invalidateQueries({ queryKey: oneseoQueryKeys.getMyOneseo() });
      queryClient.invalidateQueries({ queryKey: oneseoQueryKeys.getEditability() });
    },
  });

  const { mutate: modifyMyOneseo } = usePutMyOneseo({
    onSuccess: () => {
      if (isClient) sendGAEvent('oneseo_submit', { is_modify: true });
      setApplicationSubmitModal(true, type, isModifyApproved);
      queryClient.invalidateQueries({ queryKey: oneseoQueryKeys.getMyOneseo() });
      queryClient.invalidateQueries({ queryKey: oneseoQueryKeys.getEditability() });
    },
  });

  const { mutate: putOneseoByMemberId } = usePutOneseoByMemberId(memberId!, {
    onSuccess: () => {
      setApplicationSubmitModal(true, type, true);
      queryClient.invalidateQueries({ queryKey: oneseoQueryKeys.getMyOneseo() });
      queryClient.invalidateQueries({ queryKey: oneseoQueryKeys.getEditability() });
    },
  });

  const { mutate: postTempStorage } = usePostTempStorage(Number(step), {
    onSuccess: () => {
      if (isClient) sendGAEvent('oneseo_temp_save', { step: Number(step) });
      toast.success('임시 저장 되었습니다.', {
        icon: InfoIcon,
        closeButton: (
          <button className={cn('cursor')} onClick={() => toast.dismiss()}>
            <CloseIcon />
          </button>
        ),
      });
    },
    onError: () => toast.error('임시 저장을 실패하였습니다.'),
  });

  // 단계 이동 시 자동 저장 전용 — 성공 토스트 없이 조용히 저장한다
  const { mutate: autoSaveTempStorage } = usePostTempStorage(Number(step), {
    onError: () => toast.error('임시 저장을 실패하였습니다.'),
  });

  const { mutate: postMockScore } = usePostMockScore(graduationType, {
    onSuccess: (data) => {
      setScoreCalculationCompleteModal(true, data, 'score');
    },
  });

  const getOneseo = (isTemp: boolean = false) => {
    const { profileImg, name, birth, sex, address, detailAddress } = step1UseForm.getValues();
    const {
      graduationType,
      schoolName,
      schoolAddress,
      studentNumber,
      graduationDate,
      screening,
      firstDesiredMajor,
      secondDesiredMajor,
      thirdDesiredMajor,
    } = step2UseForm.getValues();
    const {
      guardianName,
      guardianPhoneNumber,
      relationshipWithGuardian,
      otherRelationshipWithGuardian,
      schoolTeacherName,
      schoolTeacherPhoneNumber,
    } = step3UseForm.getValues();
    const {
      liberalSystem,
      achievement1_1,
      achievement1_2,
      achievement2_1,
      achievement2_2,
      achievement3_1,
      achievement3_2,
      newSubjects,
      artsPhysicalAchievement,
      absentDays,
      attendanceDays,
      volunteerTime,
      freeSemester,
      gedAvgScore,
    } = step4UseForm.getValues();

    const body: PostOneseoType = {
      // step 1
      profileImg: profileImg || undefined,
      name: name || undefined,
      birth: birth || undefined,
      sex: sex || undefined,
      address: address || undefined,
      detailAddress: detailAddress || undefined,

      // step 2
      graduationType: graduationType || undefined,
      schoolName: schoolName || undefined,
      schoolAddress: schoolAddress || undefined,
      studentNumber: studentNumber || undefined,
      graduationDate:
        graduationDate.split('-')[0] !== '0000' && graduationDate.split('-')[1] !== '00'
          ? graduationDate
          : undefined,
      screening: screening || undefined,
      firstDesiredMajor: firstDesiredMajor || undefined,
      secondDesiredMajor: secondDesiredMajor || undefined,
      thirdDesiredMajor: thirdDesiredMajor || undefined,

      // step 3
      guardianName: guardianName || undefined,
      guardianPhoneNumber: guardianPhoneNumber || undefined,
      relationshipWithGuardian:
        (relationshipWithGuardian === RelationshipWithGuardianValueEnum.OTHER
          ? otherRelationshipWithGuardian
          : relationshipWithGuardian) || undefined,
      schoolTeacherName: schoolTeacherName || undefined,
      schoolTeacherPhoneNumber: schoolTeacherPhoneNumber || undefined,

      // step 4
      middleSchoolAchievement: isGED
        ? {
            gedAvgScore: gedAvgScore!,
          }
        : {
            liberalSystem: liberalSystem,
            achievement1_1: achievement1_1!,
            achievement1_2: achievement1_2!,
            achievement2_1: achievement2_1!,
            achievement2_2: achievement2_2!,
            achievement3_1: achievement3_1!,
            achievement3_2: achievement3_2!,
            newSubjects: newSubjects,
            artsPhysicalAchievement: artsPhysicalAchievement!,
            absentDays: absentDays!,
            attendanceDays: attendanceDays!,
            volunteerTime: volunteerTime!,
            freeSemester:
              liberalSystem === LiberalSystemValueEnum.FREE_GRADE
                ? null
                : graduationType === GraduationTypeValueEnum.GRADUATE
                  ? (freeSemester ?? '')
                  : freeSemester,
            generalSubjects: [...GENERAL_SUBJECTS],
            artsPhysicalSubjects: [...ARTS_PHYSICAL_SUBJECTS],
          },

      step: isTemp ? Number(step) : undefined,
    };

    return body;
  };

  const getPersonalInfo = (): PatchPersonalInfoType => {
    const { profileImg, name, birth, sex, address, detailAddress } = step1UseForm.getValues();
    const { graduationType, schoolName, schoolAddress, studentNumber, graduationDate } =
      step2UseForm.getValues();
    const {
      guardianName,
      guardianPhoneNumber,
      relationshipWithGuardian,
      otherRelationshipWithGuardian,
      schoolTeacherName,
      schoolTeacherPhoneNumber,
    } = step3UseForm.getValues();

    return {
      profileImg: profileImg!,
      name: name!,
      birth: birth!,
      sex: sex!,
      address: address!,
      detailAddress: detailAddress!,
      graduationType: graduationType!,
      schoolName: schoolName ?? null,
      schoolAddress: schoolAddress ?? null,
      studentNumber: studentNumber ?? null,
      graduationDate:
        graduationDate && graduationDate.split('-')[0] !== '0000' ? graduationDate : undefined,
      guardianName: guardianName!,
      guardianPhoneNumber: guardianPhoneNumber!,
      relationshipWithGuardian:
        (relationshipWithGuardian === RelationshipWithGuardianValueEnum.OTHER
          ? otherRelationshipWithGuardian
          : relationshipWithGuardian) ?? '',
      schoolTeacherName: schoolTeacherName ?? null,
      schoolTeacherPhoneNumber: schoolTeacherPhoneNumber ?? null,
    };
  };

  const handleOneseoSubmitButtonClick = async () => {
    // 제출 요청 중에 자동저장이 나가면 서버의 제출 완료 상태가 다시 작성 중으로
    // 되돌아간다. 요청을 보내기 전에 멈추고, 제출이 실패하면 되살린다.
    stopIdleTimer();

    await patchPersonalInfo(getPersonalInfo()).catch((error) => {
      resumeIdleTimer();
      throw error;
    });

    const body = getOneseo();

    if (isModifyApproved) {
      modifyMyOneseo(body, { onError: resumeIdleTimer });
    } else {
      postMyOneseo(body, { onError: resumeIdleTimer });
    }
  };

  // 직전에 임시저장을 요청한 payload — 동일한 내용의 중복 저장 요청을 걸러내는 데 사용.
  // 응답이 아니라 요청 시점에 갱신해야 아직 응답이 오지 않은 저장과의 중복까지 막을 수 있다.
  const lastSavedTempBodyRef = useRef<string | null>(null);

  const getTempStorage = () => {
    const body = getOneseo(true);

    return { body, key: JSON.stringify(body) };
  };

  // 저장에 실패하면 서버에 반영되지 않았으므로 키를 되돌려 다음 시도를 허용한다
  const rollbackLastSavedTempBody = () => {
    lastSavedTempBodyRef.current = null;
  };

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 최종 제출 이후에는 임시저장이 서버의 제출 완료 상태를 다시 작성 중으로 되돌리므로
  // 자동저장을 영구히 멈춘다. 제출 성공 모달이 떠도 이 화면은 그대로 남아 있다.
  const isIdleTimerStoppedRef = useRef(false);

  const clearIdleTimer = () => {
    if (idleTimerRef.current === null) return;

    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
  };

  // 지금 입력값을 기준으로 2분 타이머를 새로 건다. 대기 중이던 타이머는 여기서 버린다.
  const armIdleTimer = () => {
    if (!isClient || !isStep4 || isIdleTimerStoppedRef.current) return;

    clearIdleTimer();

    idleTimerRef.current = setTimeout(() => {
      idleTimerRef.current = null;
      handleAutoTempSave();
    }, IDLE_AUTO_SAVE_DELAY);
  };

  const stopIdleTimer = () => {
    isIdleTimerStoppedRef.current = true;
    clearIdleTimer();
  };

  // 제출이 끝내 실패했다면 아직 작성 중인 원서이므로 자동저장을 되살린다.
  // 플래그만 열어두면 타이머는 없는 채로 남는다 — 재장전은 입력이 바뀔 때만 일어나는데
  // 제출 실패 후 사용자가 폼을 더 건드리지 않으면 그 시점이 오지 않기 때문이다.
  const resumeIdleTimer = () => {
    isIdleTimerStoppedRef.current = false;
    armIdleTimer();
  };

  const handleTemporarySaveButtonClick = () => {
    // 버튼이 지금 저장하므로 대기 중인 자동저장 타이머는 불필요하다.
    // 이후 추가 입력이 있으면 타이머는 다시 2분으로 걸린다.
    clearIdleTimer();

    const { body, key } = getTempStorage();

    lastSavedTempBodyRef.current = key;

    postTempStorage(body, { onError: rollbackLastSavedTempBody });
  };

  const handleAutoTempSave = () => {
    const { body, key } = getTempStorage();

    if (lastSavedTempBodyRef.current === key) return;

    lastSavedTempBodyRef.current = key;

    autoSaveTempStorage(body, { onError: rollbackLastSavedTempBody });
  };

  // 직전에 관찰한 step 4 입력값 — 실제로 값이 바뀐 경우에만 타이머를 걸기 위해 사용.
  // 이 값이 없으면 step 4에 처음 도착한 시점이라 아직 사용자 입력이 없다는 뜻이다.
  const observedStep4ValuesRef = useRef<string | null>(null);

  useEffect(() => {
    // step 4를 벗어났거나 자동저장이 멈춘 상태면 대기 중인 타이머만 정리한다
    if (!isClient || !isStep4 || isIdleTimerStoppedRef.current) {
      clearIdleTimer();
      return;
    }

    const step4ValuesKey = JSON.stringify(step4Values);
    const hasEdited =
      observedStep4ValuesRef.current !== null && observedStep4ValuesRef.current !== step4ValuesKey;

    observedStep4ValuesRef.current = step4ValuesKey;

    // step 4 진입만으로는 타이머를 걸지 않는다 — 직전 '다음으로'가 이미 저장했다.
    // 값이 그대로인 알림(이미 선택된 값 재선택 등)이라면 대기 중인 타이머를 건드리지 않는다.
    if (!hasEdited) return;

    // 입력이 이어지면 armIdleTimer가 이전 타이머를 버리고 다시 2분을 센다
    armIdleTimer();
    // handleAutoTempSave는 렌더마다 새로 만들어지므로 의존성에 넣으면 타이머가
    // 매 렌더 초기화돼 만료되지 않는다. 입력 변화에만 반응해야 하므로 의도적으로 제외한다.
  }, [step4Values, isStep4, isClient]);

  // 타이머 정리는 언마운트 시에만 한다. 위 effect의 cleanup으로 두면 값이 바뀌지 않은
  // 재실행에서도 대기 중인 타이머가 취소되고, hasEdited가 false라 재장전되지 않는다.
  useEffect(() => clearIdleTimer, []);

  const handleOneseoEditButtonClick = async () => {
    await patchPersonalInfoByMemberId(getPersonalInfo());
    putOneseoByMemberId(getOneseo());
  };

  const handleCheckScoreButtonClick = () => {
    if (isClient) sendGAEvent('score_calculate_click', { step: Number(step) });

    const {
      liberalSystem,
      achievement1_1,
      achievement1_2,
      achievement2_1,
      achievement2_2,
      achievement3_1,
      achievement3_2,
      newSubjects,
      artsPhysicalAchievement,
      absentDays,
      attendanceDays,
      volunteerTime,
      freeSemester,
      gedAvgScore,
    } = step4UseForm.getValues();

    const body: MiddleSchoolAchievementType | GEDAchievementType = isGED
      ? {
          gedAvgScore: gedAvgScore!,
        }
      : {
          liberalSystem: liberalSystem,
          achievement1_1: achievement1_1!,
          achievement1_2: achievement1_2!,
          achievement2_1: achievement2_1!,
          achievement2_2: achievement2_2!,
          achievement3_1: achievement3_1!,
          achievement3_2: achievement3_2!,
          newSubjects: newSubjects,
          artsPhysicalAchievement: artsPhysicalAchievement!,
          absentDays: absentDays!,
          attendanceDays: attendanceDays!,
          volunteerTime: volunteerTime!,
          freeSemester: freeSemester || '',
          generalSubjects: [...GENERAL_SUBJECTS],
          artsPhysicalSubjects: [...ARTS_PHYSICAL_SUBJECTS],
        };

    postMockScore(body);
  };

  useEffect(() => {
    if (isClient) sendGAEvent('register_step_view', { step: Number(step) });
  }, [step, isClient]);

  const prevStepRef = useRef<StepEnum>(step);

  useEffect(() => {
    const prevStep = prevStepRef.current;
    prevStepRef.current = step;

    if (
      prevStep === StepEnum.ONE &&
      step !== StepEnum.ONE &&
      isClient &&
      step1UseForm.formState.isDirty &&
      isStepSuccess[1] &&
      isStepSuccess[2] &&
      isStepSuccess[3]
    ) {
      patchPersonalInfo(getPersonalInfo()).catch(() => {
        toast.error('인적사항 자동 저장에 실패하였습니다.');
      });
    }
  }, [step]);

  const handlePreviewPrint = async () => {
    if (!isScoreComplete) {
      handleStepError(StepEnum.FOUR);
      return;
    }
    if (isClient) sendGAEvent('oneseo_preview_click');
    await patchPersonalInfo(getPersonalInfo());
    postTempStorage(getOneseo(true), {
      onSuccess: () => push('/print?preview=true'),
    });
  };
  useEffect(() => {
    // 스텝 전환(URL 라우팅) 시 이전 스텝의 에러 표시 초기화 — 전환 진입점이
    // 라우터 경유라 이벤트 핸들러로 일원화 불가, effect 유지가 정당
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (errorStep !== step) clearStepError();

    if (step === StepEnum.TWO && !isStepSuccess[1]) push(`${BASE_URL}?step=1`);

    if (step === StepEnum.THREE && (!isStepSuccess[1] || !isStepSuccess[2]))
      push(`${BASE_URL}?step=2`);

    if (step === StepEnum.FOUR && (!isStepSuccess[1] || !isStepSuccess[2] || !isStepSuccess[3]))
      push(`${BASE_URL}?step=3`);
  }, [step, isStepSuccess, push, BASE_URL]);

  return (
    <>
      <div
        className={cn(
          'w-full',
          'h-full',
          'bg-slate-50',
          'pt-[3.56rem]',
          'mdx:flex',
          'hidden',
          'justify-center',
          'pb-[5rem]',
        )}
      >
        <div
          className={cn(
            'w-[66.5rem]',
            'flex',
            'flex-col',
            'bg-white',
            'rounded-[1.25rem]',
            'rounded-b-lg-[1.125rem]',
          )}
        >
          <StepBar
            step={step}
            baseUrl={BASE_URL}
            isStepSuccess={isStepSuccess}
            handleCheckScoreButtonClick={handleCheckScoreButtonClick}
            handleStepError={handleStepError}
            handlePreviewPrint={isClient ? handlePreviewPrint : undefined}
            handleAutoTempSave={isClient ? handleAutoTempSave : undefined}
          />
          <div
            className={cn(
              'flex',
              'justify-center',
              'w-full',
              'h-fit',
              'px-[2rem]',
              'py-[1.5rem]',
              'bg-white',
              'rounded-b-lg-[1.125rem]',
            )}
          >
            {step === StepEnum.ONE && (
              <Step1Register
                {...step1UseForm}
                phoneNumber={phoneNumber}
                showError={errorStep === StepEnum.ONE}
              />
            )}
            {step === StepEnum.TWO && (
              <Step2Register {...step2UseForm} showError={errorStep === StepEnum.TWO} />
            )}
            {step === StepEnum.THREE && (
              <Step3Register
                {...step3UseForm}
                isCandidate={isCandidate}
                showError={errorStep === StepEnum.THREE}
              />
            )}
            {step === StepEnum.FOUR && (
              <Step4Register
                {...step4UseForm}
                type={type}
                graduationType={graduationType}
                isGED={isGED}
                isCandidate={isCandidate}
                isGraduate={isGraduate}
                showError={errorStep === StepEnum.FOUR}
                clearStepError={clearStepError}
              />
            )}
          </div>
        </div>
      </div>
      {isClient ? (
        <ConfirmBar
          isStep4Success={isStepSuccess[4]}
          isStep4={isStep4}
          handleOneseoSubmitButtonClick={handleOneseoSubmitButtonClick}
          handleTemporarySaveButtonClick={handleTemporarySaveButtonClick}
          handleStepError={handleStepError}
          isModifyApproved={isModifyApproved}
        />
      ) : (
        <EditBar
          isStep4={isStep4}
          isStep4Success={isStepSuccess[4]}
          handleOneseoEditButtonClick={handleOneseoEditButtonClick}
          handleStepError={handleStepError}
        />
      )}
    </>
  );
};

export default StepWrapper;
