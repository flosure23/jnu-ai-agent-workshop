# Next.js·TypeScript 유지보수 점검

검토 범위는 워크스페이스 내 Next.js 앱(`frontend/`)의 `app/`, `components/`, `lib/`, `middleware.ts`이며, 루트의 `hello.js` 등 프론트 외 파일은 제외했다. 코드는 읽기 전용으로만 검토했으며, 런타임 동작·테스트 실행은 수행하지 않았다. App Router·Supabase 클라이언트 패턴은 전반적으로 일관되나, 폼·쿼리·타입 경계에서 중복과 단일 모듈 과밀도가 눈에 띈다.

| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `frontend/app/(main)/entries/new/page.tsx`, `frontend/app/(main)/entries/[id]/edit/page.tsx` | 전역·`handleSubmit` | 제목·날짜·본문 필드, Tailwind `fieldClass`/`textareaClass`, 유효성(제목·본문 필수), Supabase insert/update·토스트·라우팅 흐름이 거의 동일하게 복제됨. 한쪽만 고치면 불일치·버그 위험. | 공통 `EntryForm` 컴포넌트 또는 공통 훅(초기값·제출 분기만 props로)으로 추출하고, 스타일 문자열은 한 모듈로 모은다. |
| 2 | High | `frontend/app/(main)/entries/[id]/page.tsx`, `frontend/app/(main)/entries/[id]/edit/page.tsx` | `load`, 로딩·에러·404 JSX | 동일한 `getUser` → `entries` 단건 `select`·`maybeSingle`·에러/미존재 분기·스피너·목록 링크 UI가 중복. 유지보수 시 두 파일을 동시에 수정해야 함. | `lib/entries-queries.ts`의 `fetchEntryById`를 실제로 사용하거나, 서버 Route/공통 비동기 헬퍼로 로드를 한 곳에 두고 페이지는 표현만 담당하게 한다. |
| 3 | Medium | `frontend/components/SearchBar.tsx`, `frontend/app/(main)/entries/page.tsx` | `useEffect` 디바운스 각각 ~300ms | 검색 입력은 SearchBar 내부에서 `onSearch`를 디바운스하고, 부모는 `searchQuery`→`debouncedSearch`로 다시 디바운스함. 이중 지연·상태 이중화로 의도 파악이 어렵고 레이턴시만 늘 수 있음. | 디바운스는 한 레이어(보통 자식 또는 부모 한쪽)만 담당하도록 정리한다. |
| 4 | Medium | `frontend/app/(auth)/*/page.tsx` | `inputClass` 및 폼 레이아웃 | 로그인·회원가입·비밀번호 찾기·재설정에서 동일한 입력 필드 스타일 상수와 카드형 폼 골격이 반복됨. | `AuthInput`, `AuthCard` 등 작은 프리젠테이션 컴포넌트로 공통화한다. |
| 5 | Medium | `frontend/lib/types.ts`, `frontend/lib/entries-queries.ts`, 목록·상세 페이지 | `Entry` vs `EntryRow`, `as Entry` | DB 스키마 기반 `EntryRow`와 수동 `Entry` 인터페이스가 병존하고, `fetchEntriesPage` 결과에 `as Entry[]` 등 단언이 붙음. 스키마 변경 시 타입과 런타임이 어긋날 여지. | `Entry`를 `EntryRow` 별칭으로 통일하거나, 생성된 `Database` 타입을 단일 진실 공급원으로 삼아 단언을 제거한다. |
| 6 | Medium | `frontend/app/(main)/entries/[id]/edit/page.tsx` | `EditEntryPage` 전체(약 230줄 근처) | 한 컴포넌트에 데이터 로드, 404/에러 UI, 폼 상태, 클라이언트 검증, Supabase 업데이트, 내비게이션이 몰려 있어 단일 책임·테스트·리뷰 부담이 큼. | 로딩/에러/폼을 하위 컴포넌트로 분리하거나, 데이터 패칭 레이어를 훅·서버 경계로 나눈다. |
| 7 | Medium | `frontend/app/**/*.tsx`(다수) | 파일 상단 `"use client"` | 일기·인증 대부분의 페이지가 전부 클라이언트 컴포넌트. 확장 시 번들·경계 이해 비용이 커질 수 있음(성능과 별개로 구조 복잡도). | 정적·서버에서 가능한 부분은 RSC로 두고, 폼·토스트 등 상호작용만 클라이언트 섬으로 좁히는 방향을 검토한다. |
| 8 | Low | `frontend/lib/entries-queries.ts` | `fetchEntryById` | export만 존재하고 저장소 내 다른 파일에서 import되지 않음(죽은 API). | 사용하도록 연결하거나 export를 제거해 공개 표면을 줄인다. |
| 9 | Low | `frontend/lib/types.ts` | `User` 인터페이스 | 정의만 있고 참조처가 없음. | 사용 계획이 없으면 제거하고, 필요 시 Supabase `User` 타입 등으로 대체한다. |
| 10 | Low | `frontend/components/EntryCard.tsx` | import 구문 | 값 전용 타입인데 `import { Entry }`로 값 import 형태를 씀(동작은 동일하나 TS/번들 관점에서 `import type`이 명확). | `import type { Entry }`로 통일해 의도를 드러낸다. |
