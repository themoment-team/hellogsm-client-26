import {
  DesireMajorValueEnum,
  FreeSemesterValueEnum,
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  MockScoreType,
  RelationshipWithGuardianValueEnum,
  ScreeningValueEnum,
} from 'types';

export type ScreeningType = 'GENERAL' | 'SPECIAL' | 'EXTRA_VETERANS' | 'EXTRA_ADMISSION';

export type MajorType = 'SW' | 'AI' | 'IOT';

export type TestResultType = 'ALL' | 'FIRST_PASS' | 'FINAL_PASS' | 'FALL';

export type GraduationType = 'CANDIDATE' | 'GRADUATE' | 'GED';

export type FreeSemesterType = '1-1' | '1-2' | '2-1' | '2-2' | '3-1' | '3-2' | null;

export type LiberalSystemType = '자유학년제' | '자유학기제';

export type SexType = 'MALE' | 'FEMALE';

export type YesNo = 'YES' | 'NO';

export enum ScreeningEnum {
  GENERAL = '일반전형',
  SPECIAL = '특별전형',
  EXTRA_VETERANS = '국가보훈',
  EXTRA_ADMISSION = '특례입학',
}

export enum GraduationEnum {
  CANDIDATE = '졸업예정',
  GRADUATE = '졸업',
  GED = '검정고시',
}

export enum MajorEnum {
  SW = '소프트웨어개발과',
  IOT = '스마트IoT과',
  AI = '인공지능(AI)과',
}

export enum SexEnum {
  MALE = '남자',
  FEMALE = '여자',
}

export type AchievementGradeType =
  | 'achievement1_1'
  | 'achievement1_2'
  | 'achievement2_1'
  | 'achievement2_2'
  | 'achievement3_1'
  | 'achievement3_2';

export const achievementGradeValues = [
  'achievement1_1',
  'achievement1_2',
  'achievement2_1',
  'achievement2_2',
  'achievement3_1',
  'achievement3_2',
] as const;

export enum MajorEnum {
  소프트웨어개발과 = 'SW',
  인공지능과 = 'AI',
  스마트IOT과 = 'IOT',
}

export interface MiddleSchoolAchievementType {
  achievement1_1: number[];
  achievement1_2: number[];
  achievement2_1: number[];
  achievement2_2: number[];
  achievement3_1: number[];
  achievement3_2: number[];
  newSubjects: string[] | undefined;
  artsPhysicalAchievement: number[];
  absentDays: number[];
  attendanceDays: number[];
  volunteerTime: number[];
  liberalSystem: LiberalSystemValueEnum | null;
  freeSemester: FreeSemesterValueEnum | null | '';
  generalSubjects: string[];
  artsPhysicalSubjects: string[];
}

export interface GEDAchievementType {
  gedAvgScore: number;
}

export interface DesireMajorsType {
  firstDesiredMajor: DesireMajorValueEnum;
  secondDesiredMajor: DesireMajorValueEnum;
  thirdDesiredMajor: DesireMajorValueEnum;
}

export interface PrivacyDetailType {
  name: string;
  sex: SexType;
  birth: string;
  phoneNumber: string;
  graduationType: GraduationTypeValueEnum;
  address: string;
  detailAddress: string;
  guardianName: string;
  guardianPhoneNumber: string;
  relationshipWithGuardian: RelationshipWithGuardianValueEnum | string;
  schoolName: string;
  schoolAddress: string;
  studentNumber: string;
  graduationDate: string;
  year: string;
  month: string;
  schoolTeacherName: string;
  schoolTeacherPhoneNumber: string;
  profileImg: string;
}

export interface PostOneseoType {
  guardianName?: string;
  guardianPhoneNumber?: string;
  relationshipWithGuardian?: string;
  profileImg?: string;
  address?: string;
  detailAddress?: string;
  graduationType?: GraduationTypeValueEnum;
  schoolTeacherName?: string;
  schoolTeacherPhoneNumber?: string;
  firstDesiredMajor?: DesireMajorValueEnum;
  secondDesiredMajor?: DesireMajorValueEnum;
  thirdDesiredMajor?: DesireMajorValueEnum;
  middleSchoolAchievement?: MiddleSchoolAchievementType | GEDAchievementType;
  schoolName?: string;
  schoolAddress?: string;
  studentNumber?: string;
  graduationDate?: string;
  screening?: ScreeningValueEnum;
  step?: number;
}

export interface GeneralSubjectsScoreDetailType {
  score1_1: number | null;
  score1_2: number | null;
  score2_1: number | null;
  score2_2: number | null;
  score3_1: number | null;
  score3_2: number | null;
}

export interface ArtsPhysicalSubjectsScoreDetailType {
  score1_1: number;
  score1_2: number;
  score2_1: number;
  score2_2: number;
  score3_1: number;
  score3_2: number;
}

export interface CalculatedScoreType extends MockScoreType {
  generalSubjectsScoreDetail: GeneralSubjectsScoreDetailType;
  artsPhysicalSubjectsScoreDetail: ArtsPhysicalSubjectsScoreDetailType;
}

export interface GetMyOneseoType {
  oneseoId: number;
  submitCode: string;
  wantedScreening: ScreeningValueEnum;
  desiredMajors: DesireMajorsType;
  privacyDetail: PrivacyDetailType;
  middleSchoolAchievement: MiddleSchoolAchievementType &
    GEDAchievementType & {
      absentDaysCount: number;
      artsPhysicalSubjects: string[];
      generalSubjects: string[];
    };
  calculatedScore: CalculatedScoreType;
  step: number | null;
}

export interface OneseoStatusType {
  oneseo: GetMyOneseoType;
}

export interface OneseoType {
  memberId: number;
  submitCode: string | null;
  realOneseoArrivedYn: YesNo;
  entranceIntentionYn: YesNo;
  name: string | null;
  screening: ScreeningType;
  schoolName: string | null;
  phoneNumber: string;
  guardianPhoneNumber: string;
  schoolTeacherPhoneNumber: string;
  firstTestPassYn: YesNo | null;
  competencyEvaluationScore: number | null;
  interviewScore: number | null;
  secondTestPassYn: YesNo | null;
  examinationNumber: number | null;
}

export interface OneseoListType {
  info: { totalPages: number; totalElements: number };
  oneseos: OneseoType[];
}

export interface TicketType {
  memberName: string;
  memberBirth: string;
  profileImg: string;
  schoolName: string;
  appliedScreening: ScreeningType;
  oneseoSubmitCode: string;
  examinationNumber: string;
}

export interface EditabilityType {
  oneseoEditability: boolean;
}
