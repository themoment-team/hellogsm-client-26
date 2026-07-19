/**
 * 전형 일정 (화면 표기용 단일 소스)
 *
 * 백엔드 서버는 서비스 운영 기간에만 켜두고 그 외 기간에는 내려두기 때문에,
 * 서버(`/date` API)가 없어도 화면에 일정을 노출할 수 있도록 프론트에서 하드코딩으로 관리합니다.
 *
 * ⚠️ 매년 신입생 모집 일정이 바뀔 때는 "이 파일만" 수정하면 client·admin 전 화면에 반영됩니다.
 *    한 이벤트를 여러 화면이 서로 다른 포맷으로 노출하므로, 갱신 시 해당 이벤트 블록의
 *    모든 값을 함께 수정하세요. (포맷이 화면마다 다른 것은 기존 디자인을 유지하기 위함입니다.)
 */
export const ADMISSION_SCHEDULE = {
  /** 원서 접수 기간 */
  submission: {
    /** 메인 히어로·모집 안내 표기 (client Section1 / Section3) */
    startLabel: '2025.10.20. (월) 오전 9시',
    endLabel: '2025.10.23. (목) 오후 4시 30분',
    /** 모집절차 스텝 표기 (client Section2) — 시작/종료 라벨 분리 노출 */
    stepStart: '2025. 10. 20.(월)~',
    stepEnd: '23.(목) 09:00 ~ 16:30',
  },

  /** 1차 전형 합격자 발표 */
  firstAnnouncement: {
    /** 모집절차 스텝 표기 (client Section2) */
    step: '2025. 10. 28.(화) 10:00',
  },

  /** 2차 전형 — 역량검사 */
  competencyEvaluation: {
    /** ISO 날짜 (로직/판별용) */
    date: '2025-10-31',
    /** 수험표 표기 (admin TicketPage) */
    period: '2025. 10. 31.(금) 14:00 ~ 16:30',
    /** 모집절차 스텝 표기 (client Section2) */
    step: '2025. 10. 31.(금) 14:00-16:30',
    /** 확인서 발급일 표기 (admin TicketPage) */
    issueDateLabel: '2025년 10월 31일',
  },

  /** 2차 전형 — 심층면접 */
  inDepthInterview: {
    /** ISO 날짜 (로직/판별용) */
    date: '2025-11-01',
    /** 수험표 표기 (admin TicketPage) */
    period: '2025. 11. 01.(토) 09:00 ~ 16:30',
    /** 모집절차 스텝 표기 (client Section2) */
    step: '2025. 11. 1.(토) 09:00-16:30',
  },

  /** 최종 합격자 발표 */
  finalAnnouncement: {
    /** 수험표 표기 (admin TicketPage) */
    label: '2025. 11. 05.(수) 10:00',
    /** 모집절차 스텝 표기 (client Section2) */
    step: '2025. 11. 5.(수) 10:00',
  },

  /** 합격자 등록(서류 제출) */
  registration: {
    /** 모집절차 스텝 표기 (client Section2) — 시작/종료/비고 분리 노출 */
    stepStart: '2025. 11. 5.(수) ~',
    stepEnd: '11. 10.(월) 16:30',
    stepNote: '(건강검진 관련서류 제출: 11. 10.(월) 16:30까지)',
    /** 수험표 표기 (admin TicketPage) */
    ticketPeriod: '2025. 11. 05.(수)~ 11. 10.(월) 16:30',
  },

  /** 비전캠프 */
  visionCamp: {
    /** admin TicketPage */
    start: '2026. 01. 14.(수)',
    end: '2026. 01. 16.(금)',
  },
} as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const NEXT_YEAR = CURRENT_YEAR + 1;
