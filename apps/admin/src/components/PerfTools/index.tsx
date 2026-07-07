'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

declare global {
  interface Window {
    __vitals?: { name: string; value: number; rating: string }[];
  }
}

/**
 * T1↔T2 런타임 측정 전용 계측 컴포넌트 (docs/runtime-measurement-guide.md 참조).
 * 측정 브랜치에만 존재하며 마이그레이션 브랜치에는 포함하지 않는다.
 * - NEXT_PUBLIC_REACT_SCAN=true → react-scan 리렌더 시각화 (dev 측정용)
 * - NEXT_PUBLIC_PERF_LOG=true → Web Vitals(INP 등) 콘솔 로깅 (prod 측정용)
 * - 둘 다 미설정이면 no-op (react-scan은 런타임에 로드되지 않음)
 * ⚠️ 단, Turbopack이 react-scan 청크를 .next/static에 방출하므로
 *    이 브랜치의 빌드 산출물로 번들 크기를 측정하면 안 된다 (번들 측정은 마이그레이션 브랜치에서).
 */
const PerfTools = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_REACT_SCAN === 'true') {
      import('react-scan').then(({ scan }) => scan({ enabled: true }));
    }
  }, []);

  useReportWebVitals((metric) => {
    if (process.env.NEXT_PUBLIC_PERF_LOG !== 'true') return;
    window.__vitals = window.__vitals ?? [];
    window.__vitals.push({ name: metric.name, value: metric.value, rating: metric.rating });
    // eslint-disable-next-line no-console
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(1)} (${metric.rating})`);
  });

  return null;
};

export default PerfTools;
