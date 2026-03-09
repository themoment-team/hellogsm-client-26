/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  GEDAchievementType,
  GetMyOneseoType,
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  MiddleSchoolAchievementType,
  MyMemberInfoType,
  PostOneseoType,
  RelationshipWithGuardianValueEnum,
  Step1FormType,
  Step2FormType,
  Step3FormType,
  Step4FormType,
  StepEnum,
} from 'types';

import { CloseIcon, InfoIcon } from 'shared/assets';
import {
  ConfirmBar,
  EditBar,
  Step1Register,
  Step2Register,
  Step3Register,
  Step4Register,
  StepBar,
} from 'shared/components';
import { ARTS_PHYSICAL_SUBJECTS, GENERAL_SUBJECTS } from 'shared/constants';
import { cn } from 'shared/lib/utils';
import { step1Schema, step2Schema, step3Schema, step4Schema } from 'shared/schemas';
import { useModalStore } from 'shared/stores';
import { extractClassroomAndNumber } from 'shared/utils';

import {
  usePostMockScore,
  usePostMyOneseo,
  usePostTempStorage,
  usePutOneseoByMemberId,
} from 'api/hooks';

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

  const name = isClient ? info!.name : data!.privacyDetail.name;
  const birth = isClient ? info!.birth : data!.privacyDetail.birth;
  const sex = isClient ? info!.sex : data!.privacyDetail.sex;
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
    const { profileImg, address, detailAddress } = step1UseForm.watch();
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
                  ? freeSemester ?? ''
                  : freeSemester,
            generalSubjects: [...GENERAL_SUBJECTS],
            artsPhysicalSubjects: [...ARTS_PHYSICAL_SUBJECTS],
          },

      step: isTemp ? Number(step) : undefined,
    };

    return body;
  };

  const handleOneseoSubmitButtonClick = () => {
    const body = getOneseo();

    postMyOneseo(body);
  };

  const handleTemporarySaveButtonClick = () => {
    const body = getOneseo(true);

    postTempStorage(body);
  };

  const handleOneseoEditButtonClick = () => {
    const body = getOneseo();

    putOneseoByMemberId(body);
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
                name={name}
                birth={birth}
                sex={sex}
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
