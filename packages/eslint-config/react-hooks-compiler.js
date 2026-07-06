/**
 * react-hooks v7이 도입한 React Compiler 진단 룰들.
 *
 * Stage 2(flat config 전환)에서는 전환 자체와 코드 수정을 격리하기 위해
 * 전부 warn으로 강등한다. Stage 4(React Compiler 적용)에서 error 승격을 검토.
 * rules-of-hooks(error)/exhaustive-deps(warn)는 v4 시절과 동일 심각도 유지.
 */
export const reactHooksCompilerRulesAsWarn = {
  'react-hooks/static-components': 'warn',
  'react-hooks/use-memo': 'warn',
  'react-hooks/preserve-manual-memoization': 'warn',
  'react-hooks/incompatible-library': 'warn',
  'react-hooks/immutability': 'warn',
  'react-hooks/globals': 'warn',
  'react-hooks/refs': 'warn',
  'react-hooks/set-state-in-effect': 'warn',
  'react-hooks/error-boundaries': 'warn',
  'react-hooks/purity': 'warn',
  'react-hooks/set-state-in-render': 'warn',
  'react-hooks/unsupported-syntax': 'warn',
  'react-hooks/config': 'warn',
  'react-hooks/gating': 'warn',
};
