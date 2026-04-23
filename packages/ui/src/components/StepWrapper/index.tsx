/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  usePatchPersonalInfo,
  usePatchPersonalInfoByMemberId,
  usePostMockScore,
  usePostMyOneseo,
  usePostTempStorage,
  usePutOneseoByMemberId,
} from '@repo/api/hooks';
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
import { cn, extractClassroomAndNumber } from '@repo/utils';

import { CloseIcon, InfoIcon } from '../../icons';
import ConfirmBar from '../ConfirmBar';
import EditBar from '../EditBar';
import { Step1Register, Step2Register, Step3Register, Step4Register } from '../register';
import StepBar from '../StepBar';

interface StepWrapperProps {
  data: GetMyOneseoType | undefined;
  info?: MyMemberInfoType;
  step: StepEnum;
  memberId?: number;
  type: 'client' | 'admin';
}

const StepWrapper = ({ data, step, info, memberId, type }: StepWrapperProps) => {
  const { setScoreCalculationCompleteModal, setApplicationSubmitModal } = useModalStore();

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
  const graduationType = step2UseForm.watch('graduationType');

  const isClient = type === 'client';
  const isCandidate = graduationType === GraduationTypeValueEnum.CANDIDATE;
  const isGraduate = graduationType === GraduationTypeValueEnum.GRADUATE;
  const isGED = graduationType === GraduationTypeValueEnum.GED;
  const isStep4 = step === StepEnum.FOUR;

  const BASE_URL = isClient ? '/register' : `/edit/${memberId}`;

  const phoneNumber = isClient ? info!.phoneNumber : data!.privacyDetail.phoneNumber;

  const isStepSuccess = {
    '1': step1Schema.safeParse(step1UseForm.watch()).success,
    '2': step2Schema.safeParse(step2UseForm.watch()).success,
    '3': step3Schema.safeParse(step3UseForm.watch()).success,
    '4': step4Schema.safeParse(step4UseForm.watch()).success,
  };

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
    onSuccess: () => setApplicationSubmitModal(true, type),
  });

  const { mutate: putOneseoByMemberId } = usePutOneseoByMemberId(memberId!, {
    onSuccess: () => setApplicationSubmitModal(true, type),
  });

  const { mutate: postTempStorage } = usePostTempStorage(Number(step), {
    onSuccess: () =>
      toast.success('임시 저장 되었습니다.', {
        icon: InfoIcon,
        closeButton: (
          <button className={cn('cursor')} onClick={() => toast.dismiss()}>
            <CloseIcon />
          </button>
        ),
      }),
    onError: () => toast.error('임시 저장을 실패하였습니다.'),
  });

  const { mutate: postMockScore } = usePostMockScore(graduationType, {
    onSuccess: (data) => {
      setScoreCalculationCompleteModal(true, data, 'score');
    },
  });

  const getOneseo = (isTemp: boolean = false) => {
    const { profileImg, name, birth, sex, address, detailAddress } = step1UseForm.watch();
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
    } = step2UseForm.watch();
    const {
      guardianName,
      guardianPhoneNumber,
      relationshipWithGuardian,
      otherRelationshipWithGuardian,
      schoolTeacherName,
      schoolTeacherPhoneNumber,
    } = step3UseForm.watch();
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
    } = step4UseForm.watch();

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
    const { profileImg, name, birth, sex, address, detailAddress } = step1UseForm.watch();
    const { graduationType, schoolName, schoolAddress, studentNumber, graduationDate } =
      step2UseForm.watch();
    const {
      guardianName,
      guardianPhoneNumber,
      relationshipWithGuardian,
      otherRelationshipWithGuardian,
      schoolTeacherName,
      schoolTeacherPhoneNumber,
    } = step3UseForm.watch();

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
    await patchPersonalInfo(getPersonalInfo());
    postMyOneseo(getOneseo());
  };

  const handleTemporarySaveButtonClick = () => {
    const body = getOneseo(true);

    postTempStorage(body);
  };

  const handleOneseoEditButtonClick = async () => {
    await patchPersonalInfoByMemberId(getPersonalInfo());
    putOneseoByMemberId(getOneseo());
  };

  const handleCheckScoreButtonClick = () => {
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
    } = step4UseForm.watch();

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

  const prevStepRef = useRef<StepEnum>(step);

  useEffect(() => {
    const prevStep = prevStepRef.current;
    prevStepRef.current = step;

    if (
      prevStep === StepEnum.ONE &&
      step !== StepEnum.ONE &&
      isClient &&
      step1UseForm.formState.isDirty &&
      isStepSuccess[1]
    ) {
      patchPersonalInfo(getPersonalInfo());
    }
  }, [step]);

  useEffect(() => {
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
