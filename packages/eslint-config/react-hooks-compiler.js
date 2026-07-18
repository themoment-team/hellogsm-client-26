/**
 * react-hooks v7이 도입한 React Compiler 진단 룰들.
 *
 * Stage 2(flat config 전환)에서 전환과 코드 수정을 격리하기 위해 전부 warn으로
 * 강등했다가, Stage 4에서 위반 0건 룰 11종을 error 승격, Stage 5에서 위반 코드
 * 수정(watch→useWatch·getValues, 파생 상태 전환, 컴포넌트 호이스팅) 후 잔여
 * 3종도 error 승격해 14종 전부 error가 됐다. 정당한 예외(외부 저장소 마운트
 * 복원 등)는 해당 지점에 eslint-disable + 사유 주석으로 관리한다.
 * rules-of-hooks(error)/exhaustive-deps(warn)는 v4 시절과 동일 심각도 유지.
 */
export const reactHooksCompilerRules = {
  'react-hooks/static-components': 'error',
  'react-hooks/use-memo': 'error',
  'react-hooks/preserve-manual-memoization': 'error',
  'react-hooks/incompatible-library': 'error',
  'react-hooks/immutability': 'error',
  'react-hooks/globals': 'error',
  'react-hooks/refs': 'error',
  'react-hooks/set-state-in-effect': 'error',
  'react-hooks/error-boundaries': 'error',
  'react-hooks/purity': 'error',
  'react-hooks/set-state-in-render': 'error',
  'react-hooks/unsupported-syntax': 'error',
  'react-hooks/config': 'error',
  'react-hooks/gating': 'error',
};
