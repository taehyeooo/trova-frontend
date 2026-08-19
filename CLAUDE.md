# Trova Web

Trova 백엔드(별도 레포, Spring Boot)의 API를 호출하는 웹 클라이언트입니다.
모바일 앱(React Native)은 MVP 검증 후 별도로 시작합니다.

## 기술 스택

- Next.js (App Router)
- 배포: Vercel
- 지도: 카카오맵 JS SDK
- 스타일링: Tailwind CSS

## 개발 원칙

- 백엔드 API가 아직 준비 안 된 기능은 mock 함수로 구조만 먼저 잡고,
  실제 fetch 연동은 별도로 표시해둘 것 (`// TODO: connect real API`)
- 컴포넌트는 최대한 작게 분리, 재사용 가능한 단위로 작성

## 화면 구성

1. 홈: URL 입력 폼 + 목록/지도 토글
2. 처리 대기열: 상태(대기중/처리중/완료/실패) 폴링 표시
3. 장소 상세: 추출 정보 + 원본 링크 + 지도
4. 로그인/설정 (카카오 또는 구글 소셜 로그인 중 택1로 시작)

## SavedPlace 타입 (백엔드와 동일하게 유지)

```ts
type SavedPlace = {
  id: string;
  sourceUrl: string;
  sourcePlatform: "INSTAGRAM" | "YOUTUBE";
  placeName: string;
  region: string;
  latitude: number;
  longitude: number;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  createdAt: string;
};
```

## 백엔드 API 스펙

- `POST /api/shares` `{ url: string }`
- `GET /api/places`
- `GET /api/places/{id}`
- `DELETE /api/places/{id}`
- `GET /api/places/pending`

## 코드 스타일

- TypeScript strict 모드 사용
- API 호출 함수는 `lib/api/` 아래에 모아서 관리 (컴포넌트에 직접 fetch 작성 금지)
- 커밋 전 실행할 것: `npm run lint && npm run build`

## 하지 말 것

- 백엔드 로직(장소 추출, STT 등)을 프론트에서 직접 구현하지 말 것
- 이 레포에 Spring Boot나 서버 코드를 포함하지 말 것

## Git 컨벤션 (백엔드 레포와 동일하게 적용)

- 브랜치명: `타입/#이슈번호-내용` (예: `feat/#12-map-api`)
- 커밋 메시지: `타입: 작업 내용` 형식만 사용 (예: `feat: 지도 API 연동`).
  타입은 `feat`/`fix`/`docs`/`style`/`refactor`/`chore`/`perf`/`test` 중 하나.
- PR 본문에 `Closes #이슈번호` 포함.
- **커밋 작성자는 오직 사용자로만 표시되어야 함.** 커밋 메시지에
  "Generated with Claude Code", "Co-Authored-By: Claude" 같은 AI 서명이나
  트레일러, 이모지를 절대 추가하지 말 것. `git commit -m "타입: 내용"`
  형식 외에 다른 텍스트를 붙이지 않음. 예외 없이 이 레포의 모든 커밋에 적용.
