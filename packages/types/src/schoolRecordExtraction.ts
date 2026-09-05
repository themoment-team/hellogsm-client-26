import { FreeSemesterValueEnum, GraduationTypeValueEnum, LiberalSystemValueEnum } from './value';

export type SchoolRecordExtractionSourceType = 'TEXT_LAYER' | 'OCR';

export interface SchoolRecordExtractionRequestType {
  rawText: string;
  pageCount?: number;
  hasTextLayer?: boolean;
  source: SchoolRecordExtractionSourceType;
  recognitionConfidence?: number;
  graduationType: GraduationTypeValueEnum.CANDIDATE | GraduationTypeValueEnum.GRADUATE;
  liberalSystem?: LiberalSystemValueEnum;
}

/** OCR/텍스트 인식에 실패한 칸은 null로 내려온다 */
export type NullableScoreArray = (number | null)[] | null;

export interface SchoolRecordExtractionAchievementType {
  achievement1_1: NullableScoreArray;
  achievement1_2: NullableScoreArray;
  achievement2_1: NullableScoreArray;
  achievement2_2: NullableScoreArray;
  achievement3_1: NullableScoreArray;
  achievement3_2: NullableScoreArray;
  generalSubjects: string[];
  newSubjects: string[];
  artsPhysicalSubjects: string[];
  artsPhysicalAchievement: NullableScoreArray;
  absentDays: NullableScoreArray;
  attendanceDays: NullableScoreArray;
  volunteerTime: NullableScoreArray;
  liberalSystem: LiberalSystemValueEnum | null;
  freeSemester: FreeSemesterValueEnum | null;
}

export interface SchoolRecordExtractionWarningType {
  field: string;
  index?: number;
  rawText?: string;
  type: string;
  message: string;
}

export interface SchoolRecordExtractionMetaType {
  confidence: number;
  hasTextLayer: boolean;
  source: SchoolRecordExtractionSourceType;
  pageCount: number;
  unrecognizedSubjects: string[];
  missingSemesters: string[];
  warnings: SchoolRecordExtractionWarningType[];
}

export interface SchoolRecordExtractionResponseType {
  achievement: SchoolRecordExtractionAchievementType;
  meta: SchoolRecordExtractionMetaType;
}

/** 생기부 PDF를 S3에 직접 업로드하기 위한 presigned URL 발급 응답 */
export interface SchoolRecordOcrUploadUrlResponseType {
  uploadUrl: string;
  objectKey: string;
}

/** S3에 업로드된 생기부 PDF의 objectKey를 Next.js API Route(kordoc)에 전달 */
export interface SchoolRecordOcrRequestType {
  objectKey: string;
}

/** 생기부 PDF를 Next.js API Route(kordoc)에서 인식한 결과 */
export interface SchoolRecordOcrResponseType {
  rawText: string;
  unrecognizedSubjectBlobs: string[];
  hasTextLayer: boolean;
  source: SchoolRecordExtractionSourceType;
  pageCount: number;
}
