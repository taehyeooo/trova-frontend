# TODO

작업 진행하면서 계속 갱신할 것. 완료 시 [x] 체크. 새로 파악된 작업은
적절한 단계 아래에 추가.

## 1단계: 프로젝트 세팅
- [x] Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind)
- [x] 폴더 구조 잡기 (app/, components/, lib/api/) — components/는 2단계에서 첫 컴포넌트 만들 때 생성
- [x] SavedPlace 타입 정의 (CLAUDE.md 참고)
- [x] mock API 함수 작성 (lib/api/mock.ts) — 백엔드 준비 전까지 사용

## 2단계: 화면 구현 (mock 데이터 기준)
- [x] 디자인 시스템 반영 (trova-color-tokens.md 기준 컬러, Pretendard/IBM Plex Mono 폰트, 앱 아이콘)
- [x] 로그인 화면 — 카카오 우선/구글 보조, 이메일 로그인은 접힌 상태로 UI만 (백엔드 미지원)
- [x] 로그인 상태 관리 (AuthContext, 실제 백엔드 `/api/auth/me` `/api/auth/logout` 연동 완료 — mock 아님)
- [x] 홈 화면: URL 입력 폼 (히어로, mock createShare 연동)
- [x] 저장 목록 화면 (`/places`) — 카드 리스트, 카테고리 배지, mock getPlaces 연동
- [ ] 홈 화면: 목록/지도 토글
- [ ] 카카오맵 SDK 연동, 핀 표시
- [ ] 처리 대기열 화면 (상태 폴링 UI, 지금은 mock으로)
- [ ] 장소 상세 화면

## 3단계: 실제 백엔드 연동
- [ ] SavedPlace에 `category` 필드 추가함(프론트 mock만) — 백엔드 SavedPlace 엔티티/파이프라인 출력과 맞는지 확인 필요
- [ ] mock 함수를 실제 fetch 호출로 교체 (`// TODO: connect real API` 찾아서)
- [ ] `GET /api/places/pending`이 정확히 어떤 status를 반환하는지 백엔드와 확인 (지금은 PENDING/PROCESSING만 mock)
- [ ] CORS 이슈 확인
- [ ] 로딩/에러 상태 처리

## 4단계: 배포
- [ ] Vercel 배포 연결
- [ ] 환경변수 설정 (API URL, 카카오맵 키 등)

## 백로그 (지금 안 함)
- [ ] 지오펜싱 알림 (웹에서는 구현 불가 영역)
- [ ] 일정 자동 생성
