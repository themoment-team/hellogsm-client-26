import { GraduationType } from '@repo/types';

export const exampleQueryKeys = {
  getExampleData: () => ['example'],
} as const;

export const oneseoQueryKeys = {
  postTempStorage: () => ['post', 'temp', 'oneseo', 'storage'],
  postMyOneseo: () => ['post', 'my', 'oneseo'],
  putMyOneseo: () => ['put', 'my', 'oneseo'],
  postMockScore: (type: GraduationType) => ['mock', 'oneseo', 'score', type],
  putOneseoByMemberId: (memberId: number) => ['put', 'oneseo', memberId],
  postImage: () => ['post', 'certification', 'image'],
  getSearchedOneseoList: (
    page: number,
    size: number,
    testResultTag: string,
    screeningTag?: string,
    isSubmitted?: string,
    keyword?: string,
    status?: string,
  ) => ['oneseo', 'list', page, size, testResultTag, screeningTag, isSubmitted, keyword, status],
  patchArrivedStatus: (memberId: number) => ['patch', 'arrivedStatus', memberId],
  patchAgreeDocStatus: (memberId: number) => ['patch', 'agreeDocStatus', memberId],
  patchCompetencyScore: (memberId: number) => ['patch', 'competencyScore', memberId],
  patchInterviewScore: (memberId: number) => ['patch', 'interviewScore', memberId],
  getAdmissionTickets: () => ['tickets'],
  getMyOneseo: (preview?: boolean) => ['get', 'my', 'oneseo', preview],
  getEditability: () => ['get', 'my', 'editability'],
  postExcel: () => ['post', 'excel'],
  postOneseoModifyRequest: () => ['post', 'oneseo', 'modify', 'request'],
  patchOneseoApproval: (memberId: number) => ['patch', 'oneseo', 'approval', memberId],
  patchPersonalInfo: () => ['patch', 'personal', 'info'],
  patchPersonalInfoByMemberId: (memberId: number) => ['patch', 'personal', 'info', memberId],
} as const;

export const memberQueryKeys = {
  getMyMemberInfo: () => ['member', 'my'],
  getMyAuthInfo: () => ['member', 'my', 'auth'],
  getMyFirstTestResultInfo: () => ['member', 'first', 'result'],
  getMySecondTestResultInfo: () => ['member', 'second', 'result'],
  getCheckDuplicate: (phoneNumber: string) => ['member', 'duplicate', 'check', phoneNumber],
};

export const operationQueryKeys = {
  getOperation: () => ['operation', 'status'],
  postFirstResult: () => ['operation', 'first', 'result'],
  postSecondResult: () => ['operation', 'second', 'result'],
};
