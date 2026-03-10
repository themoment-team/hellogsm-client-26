import { getKoreanDate } from 'shared/utils';

export const RECRUITMENT_PERIOD = {
  startDate: '2024.10.10.',
  endDate: '오전 9시 ~ 5시',
} as const;

// TODO 정확한 날짜 확인 후 수정
export const 역량검사일자 = '2025-10-31';
export const 심층면접일자 = '2025-11-01';
export const 역량검사시험기간 = '2025. 10. 31.(금) 14:00 ~ 16:30';
export const 심층면접시험기간 = '2025. 11. 01.(토) 09:00 ~ 16:30';

// TODO 정확한 날짜 확인 후 수정
export const visionCampDate = {
  startDate: '2026. 01. 14.(수)',
  endDate: '2026. 01. 16.(금)',
};

// TODO 정확한 날짜 확인 후 수정
export const passedMemberAnnounceDate = '2025. 11. 05.(수) 10:00';
export const passedMemberSubmitDate = {
  startDate: '2025. 11. 1.(수)',
  endDate: '2025. 11. 6.(월)',
};
export const CURRENT_YEAR = getKoreanDate().getFullYear();
export const NEXT_YEAR = CURRENT_YEAR + 1;
