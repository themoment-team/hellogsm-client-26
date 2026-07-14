# Stage 2 flat config 전환 — 룰 동등성(파리티) 검증 결과

- 방법: 전환 전(ESLint 8.57.1 + .eslintrc.cjs)과 후(ESLint 9.39.4 + flat config)에
  동일한 `eslint src --format json` 스냅샷을 떠서 `pkg|file:line:col|rule` 정렬 리스트를 diff.
- 결과: **사라진 진단 0건** (기존 24건 전부 유지) → 룰이 조용히 꺼진 것 없음.
- 신규 10건: 전부 react-hooks 4.6.2→7.1.1 메이저 업의 컴파일러 진단 (의도된 추가, warn 강등 상태)
  - react-hooks/set-state-in-effect × 5
  - react-hooks/incompatible-library × 4 (RHF watch() 등)
  - react-hooks/static-components × 1
- 부수 발견: ESLint 9의 reportUnusedDisableDirectives 기본 활성화로 미사용 disable 주석
  14건 발견 → --fix로 제거(별도 커밋). 이 항목들은 최종 after 스냅샷에는 없음.
- 원본: before/ after/ 디렉토리의 JSON + summary.txt, diff는 parity-diff.txt
