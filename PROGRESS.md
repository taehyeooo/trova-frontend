# Progress Log

작업이 끝날 때마다 아래 형식으로 추가할 것. 다음 세션에서 이 파일만 읽고
전체 맥락을 파악할 수 있어야 함.

---

## 2026-08-19 프로젝트 세팅 (1단계)

**한 것:**
- `create-next-app`으로 초기화 (App Router, TypeScript, Tailwind, `src/` 디렉토리, `@/*` alias)
- `src/lib/types.ts`에 `SavedPlace` 타입 정의 (CLAUDE.md 스펙 그대로)
- `src/lib/api/mock.ts`에 5개 mock API 함수 작성: `createShare`, `getPlaces`, `getPlace`, `deletePlace`, `getPendingPlaces` — 각 함수는 500ms 지연 후 응답 (실제 네트워크처럼 동작해야 로딩 UI를 제대로 테스트할 수 있어서)
- `npm run lint && npm run build` 통과 확인

**왜 이렇게 했는지:**
- `src/` 디렉토리 사용 — 레포 루트를 CLAUDE.md/TODO.md/PROGRESS.md 같은 문서와 소스 코드로 분리해서 깔끔하게 유지
- mock 함수 위치를 미리 실제 API 함수가 들어갈 `lib/api/` 아래로 잡아서, 3단계에서 fetch로 교체할 때 import 경로가 안 바뀌게 함
- `components/` 폴더는 아직 안 만듦 — git이 빈 폴더를 추적하지 않아서, 2단계에서 첫 컴포넌트 만들 때 자연스럽게 생성

**막힌 것 / 다음에 주의할 것:**
- `create-next-app`이 기존 `.md` 파일들과 충돌해서 초기화 전에 잠시 밖으로 옮겼다가 되돌림 (내용 변경 없음)
- `GET /api/places/pending`이 정확히 어떤 status를 반환하는지 CLAUDE.md에 명시가 없어서, 일단 PENDING/PROCESSING만 mock으로 반환하게 해둠 — 3단계에서 백엔드와 확인 필요
- Next.js 16.3.1이 설치됐는데, `next dev` 실행 시 생성되는 `AGENTS.md`가 "이 버전은 기존 Next.js와 API/구조가 다를 수 있다"고 경고함 — 2단계에서 라우팅/데이터 페칭 코드 짤 때 `node_modules/next/dist/docs/`의 최신 문서를 먼저 확인할 것

---

## 2026-08-19 소셜 로그인 연동 + 디자인 시스템 적용 (2단계 일부)

**한 것:**
- 백엔드(trova-backend, PR #1)의 세션 쿠키 기반 Google/Kakao 소셜 로그인을 실제로 연동: `lib/api/auth.ts`(진짜 fetch, mock 아님) + `lib/auth/AuthContext.tsx`(클라이언트 사이드 로그인 상태 관리)
- `/login` 화면 — 카카오 우선(브랜드 컬러 `#FEE500`) + 구글 보조 + 이메일 로그인은 접힌 상태(백엔드 미지원이라 UI만, disabled)
- 헤더에 `AuthStatus` 컴포넌트로 로그인/로그아웃 상태 상시 표시
- 홈 화면을 히어로(URL 인풋 + "장소 추출하기") 중심으로 완전히 교체, mock `createShare` 연동
- `/places` 저장 목록 화면 — 카드 리스트, `CategoryBadge`(아이템당 코랄 포인트 1개로 제한), 좌표/타임스탬프는 모노스페이스 폰트로 구분
- 디자인 토큰(`--color-bg/ink/accent` 등) 반영, Pretendard(한글) + IBM Plex Mono(숫자/메타) 폰트 적용, 앱 아이콘을 `app/icon.svg`(파비콘) + `public/trova-icon.svg`(헤더 로고)로 반영
- `SavedPlace` 타입에 `category` 필드 추가 (mock 전용, 실제 API 응답 형태를 예상해서 미리 반영)
- 백엔드+프론트 로컬 서버를 실제로 같이 띄워서(백엔드 8080, 프론트 3001) 크로스 오리진 세션 쿠키 흐름 에러 없이 동작 확인
- `npm run lint && npm run build` 통과 확인

**왜 이렇게 했는지:**
- 로컬 3000번 포트가 이미 다른 프로젝트(Grafana)에서 쓰이고 있어서, 프론트를 3001로 띄우고 백엔드 `FRONTEND_URL`도 함께 맞춤 — 로컬 개발 시 매번 이 포트 조합을 기억해야 함
- SavedPlace/ProcessingJob API가 아직 백엔드에 없어서, 이번 작업 범위는 로그인 연동 + 디자인 시스템 적용 + 기존 mock 화면(홈/목록)에 디자인만 입히는 것으로 한정. 지도 토글/상세/대기열은 다음 단계
- 컬러 사용 규칙(코랄은 화면의 10% 이내, 리스트 아이템당 아이콘 하나로 제한)을 컴포넌트 레벨에서 강제하기 위해 `CategoryBadge`를 별도 컴포넌트로 분리 — 재사용할 때마다 규칙이 자동으로 지켜지도록

**막힌 것 / 다음에 주의할 것:**
- 지금까지의 모든 프론트 코드(1단계 create-next-app 스캐폴딩 포함)가 실제로는 한 번도 커밋된 적이 없었음 — `git log`에 "Initial commit"(README.md 한 줄)만 있었음. 이번에 `feat/social-login-ui` 브랜치로 처음 커밋함
- 실제 로그인은 백엔드 쪽(trova-backend)에서 구글/카카오 둘 다 실계정으로 검증 완료. 프론트에서는 버튼 href/CORS/세션 쿠키 흐름까지만 확인했고, 브라우저로 끝까지 눌러서 헤더에 닉네임 뜨는 것까지는 다음에 확인 필요
- 프로필 이미지가 없는 카카오 계정은 카카오 기본 프로필 이미지 URL이 내려옴 — 프론트에서 별도 처리 안 해도 되는지 확인 필요 (일단은 그냥 `<img>`로 사용)

---

## [날짜] 작업 제목

**한 것:**
- (완료한 작업 요약, 2~3줄)

**왜 이렇게 했는지:**
- (핵심 결정 이유. 예: "지도는 카카오맵 SDK로 — 국내 장소 정확도 우선")

**막힌 것 / 다음에 주의할 것:**
- (있으면 기록, 없으면 생략)

---
