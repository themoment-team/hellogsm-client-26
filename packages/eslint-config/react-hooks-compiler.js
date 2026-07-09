/**
 * react-hooks v7이 도입한 React Compiler 진단 룰들.
 *
 * Stage 2(flat config 전환)에서는 전환 자체와 코드 수정을 격리하기 위해
 * 전부 warn으로 강등했고, Stage 4(React Compiler 적용)에서 위반 0건인 룰만
 * error로 승격했다. 위반이 남아 있는 3종은 코드 수정이 런타임 동작을 바꿀 수
 * 있어(특히 watch→useWatch) Stage 5에서 코드 수정 후 승격한다.
 * rules-of-hooks(error)/exhaustive-deps(warn)는 v4 시절과 동일 심각도 유지.
 */
export const reactHooksCompilerRules = {
  // Stage 5에서 코드 수정 후 error 승격 예정 (위반 1건)
  'react-hooks/static-components': 'warn',
  'react-hooks/use-memo': 'error',
  'react-hooks/preserve-manual-memoization': 'error',
  // Stage 5에서 RHF watch→useWatch 검토 후 error 승격 예정 (위반 4건)
  'react-hooks/incompatible-library': 'warn',
  'react-hooks/immutability': 'error',
  'react-hooks/globals': 'error',
  'react-hooks/refs': 'error',
  // Stage 5에서 코드 수정 후 error 승격 예정 (위반 5건)
  'react-hooks/set-state-in-effect': 'warn',
  'react-hooks/error-boundaries': 'error',
  'react-hooks/purity': 'error',
  'react-hooks/set-state-in-render': 'error',
  'react-hooks/unsupported-syntax': 'error',
  'react-hooks/config': 'error',
  'react-hooks/gating': 'error',
};
