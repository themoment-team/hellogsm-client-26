# T1 런타임 측정 결과

- 측정일: 2026-07-08 / 커밋: `51716fb0` (HEAD, bg/react-scan-setup) / 브라우저: Chrome 149
- 전원: **리렌더 = (전원 무관, 결정론적) / INP = 배터리(방전 중)에서 재측정**. 최초 INP는 AC(충전기) 연결
  상태로 측정돼 프로토콜(배터리 필수) 위반 → 무효 처리하고 배터리에서 재측정함. T2도 반드시 배터리 조건으로.
- 측정 환경(⚠️ 프로토콜 편차): **시크릿 창 아님 · 확장 프로그램 off 아님.** Claude in Chrome 확장으로 브라우저를
  자동 제어했으므로 확장이 켜진 일반 창에서 측정됨(확장 자체 오버헤드가 INP에 포함될 수 있음). 이 자동 계측은
  확장이 필수라 "시크릿 + 확장 전부 off" 조건을 만족시킬 수 없음 → **T2도 동일 환경(확장 on, 일반 창)으로 맞추거나**,
  엄밀히 하려면 T1·T2 모두 사람이 수동으로 시크릿+확장 off에서 INP를 재측정해야 함.
- 계측: bg/react-scan-setup의 계측 커밋 `51716fb0` "chore: react-scan·Web Vitals 계측 코드 추가" (react-scan 0.5.7)
- 상태: **완료 — 리렌더 S1·S2·S3 / INP S1·S2·S3 (INP는 모두 배터리 재측정)**

## 측정 방법 (중요 — T2도 동일하게)

가이드의 "react-scan 툴바를 눈으로 읽기" 대신, **더 정확하고 재현 가능한 프로그래매틱 계측**을 사용했다.
React DevTools 훅(`__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot`)을 감싸, 커밋마다 현재 fiber
트리를 순회하며 react-scan/bippy와 **동일한 판정 로직**(`didFiberRender`: FunctionComponent/ClassComponent/
ForwardRef/MemoComponent는 `flags & PerformedWork`, 그 외는 alternate props/state/ref 변경)으로 실제
리렌더된 컴포넌트를 이름별로 집계한다. 스크립트는 이 파일 맨 아래 부록에 있다.

검증:
- 값 변화 없는 방향키 5회 → 집계 0 (커밋 없으면 0, stale flag 재집계 없음 확인)
- 단일 키입력 → 폼 전체 ~1.5k 리렌더 관측, 값 변화 없는 입력과 명확히 구분됨
- 자동 입력이라 **결정론적**: S1은 5회 완전 동일, S2 핵심 지표도 5회 동일

> 리셋은 페이지 새로고침 대신 `__mcReset()`(카운터 0으로) + 필드/모달 상태 초기화로 수행(가이드의
> "새로고침으로 카운트 리셋"과 동등). dev StrictMode 하에서 onCommitFiberRoot는 커밋당 1회 호출되므로
> 이중 계산되지 않는다(값은 "리렌더 커밋 수" 기준). T1↔T2 동일 조건이므로 비교 유효.

## 리렌더 (dev, react-scan 계측)

| 시나리오 | 대상 컴포넌트 | 1회 | 2회 | 3회 | 4회 | 5회 | 중앙값 |
|---|---|---|---|---|---|---|---|
| S1 타이핑(20자) | Step1Register | 21 | 21 | 21 | 21 | 21 | **21** |
| S1 타이핑(20자) | StepWrapper | 20 | 20 | 20 | 20 | 20 | **20** |
| S1 타이핑(20자) | Input (합계) | 84 | 84 | 84 | 84 | 84 | **84** |
| S1 타이핑(20자) | 폼 전체(전 컴포넌트 합) | 16043 | 16043 | 16043 | 16043 | 16043 | **16043** |
| S2 모달 열닫(10회) | ClientModals | 20 | 20 | 20 | 20 | 20 | **20** |
| S2 모달 열닫(10회) | Header (모달 외부) | 0 | 0 | 0 | 0 | 0 | **0** |
| S2 모달 열닫(10회) | 페이지 전체(전 컴포넌트 합) | 11824 | 10712 | 10712 | 10712 | 10712 | **10712** |
| S3 필터링 | MainPage | 9 | 7 | 7 | 7 | 7 | **7** |
| S3 필터링 | FilterBar | 9 | 7 | 7 | 7 | 7 | **7** |
| S3 필터링 | ApplicantTR(행) | 58 | 35 | 35 | 35 | 35 | **35** |
| S3 필터링 | Pagination | 9 | 7 | 7 | 7 | 7 | **7** |
| S3 필터링 | 전체(전 컴포넌트 합) | 7516 | 6348 | 6348 | 6348 | 6348 | **6348** |

### S1 참고 (상위 리렌더 컴포넌트, 20자 타이핑 1회 기준)

키 하나 칠 때마다 폼 전체가 리렌더됨(T1 베이스라인). SelectItem 2646, Primitive.div 1638,
Primitive.span 1512, SelectItemProvider/SelectCollectionItemSlot/SelectItemIndicator/SelectItemText 각 1323 등.
→ 메모이제이션 부재로 입력마다 전체 Select 옵션 리스트까지 재렌더. React Compiler 적용(T2) 시 개선 기대 포인트.

### S2 참고

모달 열닫 시 **Header 등 모달 외부는 리렌더 0** (zustand 구독 격리 양호). 다만 모달 내부
radix Dialog 계열(Presence, Dialog, AlertDialogContent 등)이 토글당 ~590회 리렌더되어 전체 churn은 큼.

### S3 참고 (검색"김"→전형 일반전형→제출여부 제출완료→페이지2 시퀀스 1회 기준)

필터 하나 변경 시에도 테이블 전체가 반복 리렌더됨: TableCell ~420, TableHead ~372, Button ~263,
SelectItem ~231 등. ApplicantTR(행) 35회 → 표시 행이 1개여도 시퀀스 동안 행 컴포넌트가 반복 재렌더.
필터/테이블 메모이제이션 부재 → React Compiler(T2) 개선 기대 포인트.

## INP (prod, CPU 쓰로틀링 없음)

react-scan을 끈 prod 빌드(`NEXT_PUBLIC_PERF_LOG=true`, `NEXT_PUBLIC_REACT_SCAN=''`, `pnpm build --force`)에서 측정.
지표는 `PerformanceObserver('event', durationThreshold:0)`로 잡은 **상호작용 이벤트 지연 최댓값(ms)** (INP 근사).
CPU 4x slowdown은 **미적용**(옵션 B) — 값은 낙관적이나 T1↔T2 동일 조건이면 비교 유효.

> **주(primary) 지표 선언**: T1↔T2 비교의 기준값은 **이벤트 지연 최댓값(아래 표, ms)**. 앱 자체 web-vitals
> INP(`window.__vitals` / `[Web Vitals] INP`)는 **보조 지표**(백분위·그룹화 방식이 달라 값이 더 낮게 나옴).
> T2 작성 시 반드시 "이벤트 지연 최댓값"끼리 비교할 것. (web-vitals INP는 세션 누적/그룹화라 자동화 반복 측정에서
> 신뢰도가 낮아 대표값으로 쓰지 않음.)

| 시나리오 | 1회 | 2회 | 3회 | 4회 | 5회 | 중앙값(주지표) | 전원 |
|---|---|---|---|---|---|---|---|
| S1 타이핑(20자) | 560 | 656 | 744 | 672 | 632 | **656** | 배터리 |
| S2 모달 열기 | 80 | 80 | 80 | 64 | 56 | **80** | 배터리 |
| S3 필터링 | 136 | 80 | 80 | 104 | 104 | **104** | 배터리 |

> **S1·S2·S3 모두 배터리에서 확정 측정 완료.** 참고: 배터리(CPU 스로틀링)에서 값이 크게 오름 —
> S1 AC 440 → 배터리 656ms, S3 AC 56 → 배터리 104ms (배터리 조건 통제의 중요성 실증).
> S2는 로그인 모달이 AlertDialog라 "다음에" 클릭 시 페이지가 이동함 → **열기 상호작용 지연만** 측정(닫기 제외).

- **S1 = 656ms (배터리)**: 키 입력 한 번 처리에 ~0.66초. 폼 전체 리렌더(리렌더 표 참조)가 원인.
  Chrome 기준 500ms 초과 = "나쁨" → S1은 나쁨 구간. React Compiler(T2) 최우선 개선 대상.
  (AC에서는 440ms였음 — 배터리 CPU 스로틀링으로 값이 크게 오름 = 배터리 통제의 중요성 실증)
- **S2 = 80ms (배터리)**: 로그인 모달 "열기" 상호작용 지연. "좋음" 영역. 모달 열기는 폼 타이핑보다 훨씬 가벼움.
- **S3 = 104ms (배터리)**: admin 테이블 데이터가 적어(5행, 1페이지) "좋음" 영역. 다만 리렌더 수(ApplicantTR 35 등)는
  커서 데이터가 많아지면 INP 악화 가능 — T2에서 리렌더 감소분이 INP 여유로 이어질지 확인 필요.
- 한글 IME 조합입력은 `interactionId`가 부여되지 않아(조합 이벤트 제외) interactionId 기반 집계가 부정확 →
  이벤트 지연 최댓값을 사용. S3의 필터 클릭은 조합이 아니라 interactionId 기준과 이벤트 최댓값이 일치.
- 앱 자체 web-vitals 로거(`window.__vitals`, `[Web Vitals] INP`)도 활성(client·admin 모두 PerfTools 존재).
  보조 지표로만 참고(세션 누적/백분위 방식이라 자동 반복 측정에서 이벤트 최댓값보다 신뢰도 낮음).
- **측정 창 조건**: INP는 상호작용 이벤트가 **화면에 보이는(visible) 탭**에서만 기록됨. 자동화 중 측정 탭이
  백그라운드/최소화되면 events=0 또는 지연 왜곡 발생 → 측정 창을 포그라운드로 유지해야 함(T2도 동일 주의).

## 특이사항

- **S3 조건 차이**: admin(localhost:3001)은 `NEXT_PUBLIC_REACT_SCAN`이 꺼진 상태로 실행됨. 단, 계측은
  react-scan이 아닌 DevTools 훅 기반이고 react-scan은 React 렌더를 유발하지 않으므로 카운트에 영향 없음.
  T2도 동일 훅 사용 시 비교 유효. (admin 로그인은 Google OAuth라 사용자가 직접 수행)
- **S3 데이터셋 (T2 필수 확인)**: 측정 시점 admin 전체 지원자 **5명 = 5행, 1페이지**
  (접수번호 B-1 / A-7 / A-6 / A-3 / A-1). 행 수가 ApplicantTR 카운트·INP에 직접 영향하므로 **T2 측정 전
  반드시 행 수가 동일한지(5행) 확인할 것.** stage 데이터가 바뀌었으면 행 수를 맞추거나 달라진 행 수를 명시해
  비교. 데이터가 적어 전체가 1페이지 → 4단계 "페이지2 이동"은 실질 no-op.
  rep1은 초기 warm-up 아웃라이어(58/9/9/9), rep2~5는 (35/7/7/7)로 안정 → 중앙값 채택.
- **S3 시퀀스**: 검색"김"(디바운스) → 전형=일반전형 → 제출여부=제출완료 → 페이지2(no-op) 순, 매 rep
  전 `필터 초기화`+검색어 clear로 베이스라인 복귀. 검색·필터는 stage 백엔드 비동기 호출이라 응답 타이밍에
  따라 소폭 변동 가능(그래서 5회 중앙값).
- **S1 계정 상태**: 지원자 계정(정연돈)으로 `/register?step=1` 접근 가능(수정 승인 상태). 접수기간 표시는
  2025.10.20~23(과거)이나 리다이렉트 없이 폼 로드됨. 타이핑은 로컬 상태만 변경(저장 안 함), 측정 후 이름 원복.
- **로그아웃 처리됨**: S2는 비로그인 상태가 필요해 client 계정을 로그아웃함. 재로그인은 사용자가 직접 해야 함.
- S1/S2 모두 자동 입력이라 결정론적. 5회 반복값이 사실상 동일(측정 노이즈 없음). S2 전체합만 1회차(11824)가
  초기 로드 churn 포함으로 소폭 높고 2~5회차는 10712로 안정.

## 부록 — 계측 스크립트 (T2에서 동일 사용)

각 페이지 로드 후 1회 설치. `__mcReset()`로 카운터 리셋, `window.__mc`가 {컴포넌트명: 리렌더 커밋 수}.

```js
(function(){
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook) return 'no hook';
  window.__mc = {};
  window.__mcReset = function(){ window.__mc = {}; return 'reset'; };
  const PW = 0b1;
  function getName(f){ const t=f.type; if(t==null)return null; if(typeof t==='string')return null;
    let n=t.displayName||t.name; if(!n&&t.render)n=t.render.displayName||t.render.name;
    if(!n&&t.type)n=t.type.displayName||t.type.name; return n||null; }
  function didRender(f){ const fl=f.flags!=null?f.flags:(f.effectTag||0);
    switch(f.tag){ case 0:case 1:case 11:case 15: return (fl&PW)===PW;
      default: if(!f.alternate)return true;
        return f.alternate.memoizedProps!==f.memoizedProps
          || f.alternate.memoizedState!==f.memoizedState
          || f.alternate.ref!==f.ref; } }
  function walk(f){ if(!f)return;
    if(f.tag===0||f.tag===1||f.tag===11||f.tag===15){ if(didRender(f)){ const n=getName(f);
      if(n) window.__mc[n]=(window.__mc[n]||0)+1; } }
    walk(f.child); walk(f.sibling); }
  if(!hook.__mcWrapped){ const orig=hook.onCommitFiberRoot; hook.__mcOrig=orig;
    hook.onCommitFiberRoot=function(id,root,pri){ try{walk(root&&root.current);}catch(e){window.__mcErr=String(e);}
      return orig?orig.apply(this,arguments):undefined; }; hook.__mcWrapped=true; }
  window.__mc={}; return 'installed';
})();
```

- S2 모달 토글은 fiber에서 zustand 액션 추출 후 구동:
  `store.setLoginRequiredModal(true/false)` (버튼 onClick과 동일 경로). 배칭 회피 위해 각 토글을
  별도 매크로태스크(`setTimeout`)로 분산. 백그라운드 탭은 setTimeout이 ~1s throttle되니 측정 탭을 포그라운드로.
