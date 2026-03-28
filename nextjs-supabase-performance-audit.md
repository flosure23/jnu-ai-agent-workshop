# Next.js·Supabase 성능 감사 보고서

검토 범위는 `frontend/` 이하의 App Router 앱(`app/`, `components/`, `lib/`, `middleware.ts`)이다. 의존성은 React·Next·Supabase·Tailwind 중심으로 무거운 차트·에디터 라이브러리는 없다. 일기 목록은 `fetchEntriesPage` 한 번의 range 쿼리로 가져오며, 목록 항목마다 상세 API를 N번 호출하는 패턴은 관찰되지 않았다.

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `middleware.ts`, `components/GNB.tsx`, `app/(main)/entries/page.tsx`, `app/(main)/entries/[id]/page.tsx`, `app/(main)/entries/[id]/edit/page.tsx`, `app/(main)/entries/new/page.tsx`, 기타 auth 호출부 | `getUser()` / `auth.getUser()` | 미들웨어가 보호 경로마다 세션을 검증한 뒤, 클라이언트 GNB 마운트 시와 각 페이지 `load`/제출 시에도 반복적으로 `getUser`를 호출한다. 동일 사용자·동일 탭에서 인증 확인 네트워크·토큰 검증 비용이 누적된다. | 서버에서 한 번 확정한 사용자 정보를 레이아웃/서버 컴포넌트로 내려주거나, Supabase 클라이언트 단일 인스턴스·세션 구독으로 클라이언트 측 호출을 합치는 방향을 검토한다. |
| 2 | High | `app/(main)/entries/**/*.tsx` (목록·상세·신규·수정) | 파일 상단 `"use client"` | 일기 데이터 페칭이 전부 클라이언트에서 이루어져 초기 HTML에 데이터가 없고, 하이드레이션·클라이언트 번들이 커진다. `fetch`/`unstable_cache` 등 서버 캐시·스트리밍 이점을 쓰기 어렵다. | 가능한 구간은 Server Component에서 `lib/supabase/server`로 조회하고, 상호작용만 클라이언트로 분리하는 경계를 재설계한다. |
| 3 | Medium | `lib/entries-queries.ts`, `app/(main)/entries/[id]/page.tsx`, `app/(main)/entries/[id]/edit/page.tsx` | `.select("*")` | PostgREST 응답에 `user_id`, `created_at` 등 UI에 불필요한 컬럼이 섞일 수 있다. 현재 `entries` 스키마가 작아 체감은 작을 수 있으나 패턴은 확장 시 페이로드·인덱스 비용을 키운다. | 목록·카드에는 `id,title,date,content` 등 필요한 컬럼만 명시하고, 상세·수정 화면도 화면 단계별로 최소 집합을 선택한다. |
| 4 | Medium | `components/SearchBar.tsx`, `app/(main)/entries/page.tsx` | `useEffect` 디바운스(각 약 300ms) | 검색어가 SearchBar에서 한 번 디바운스된 뒤 부모에서 `searchQuery`→`debouncedSearch`로 또 디바운스되어, 반응 지연이 중첩되고 타이머·상태 업데이트가 이중으로 돈다. | 디바운스는 한 레이어(자식 또는 부모 한쪽)만 두거나, 동일 지연 값을 공유해 단일 타이머로 합친다. |
| 5 | Medium | `components/Toast.tsx` | `ToastContext.Provider value={{ showToast }}` | 매 렌더마다 새 객체 참조가 들어가 컨텍스트 소비자가 불필요하게 갱신될 수 있다. 토스트 목록 상태 변경 시에도 전역 트리 갱신 범위가 넓어질 여지가 있다. | `value`를 `useMemo`로 안정화하거나, 토스트 상태만 별도 컨텍스트로 분리한다. |
| 6 | Medium | `app/(main)/entries/[id]/page.tsx` | `ConfirmModal`에 `onCancel={() => setShowDelete(false)}` | 부모가 렌더될 때마다 새 함수 참조가 전달되고, `ConfirmModal`의 `useEffect(..., [open, onCancel])`가 열린 상태에서 리스너를 반복 등록·해제할 수 있다. | `onCancel`을 `useCallback`으로 고정하거나, 모달 내부에서 취소 시 부모 상태만 알리는 안정적인 콜백 패턴을 쓴다. |
| 7 | Medium | `app/(main)/entries/page.tsx` 등 | 클라이언트 `useState` + 수동 `load` | SWR·React Query·서버 캐시 없이 페이지·탭 이동 시마다 동일 데이터를 매번 네트워크로 가져올 수 있다. | 짧은 `staleTime`이라도 클라이언트 캐시를 두거나, 서버 컴포넌트 캐시와 병행한다. |
| 8 | Medium | `components/EntryCard.tsx` | 컴포넌트 본문 | 목록이 커지면 부모 `load` 중 스켈레톤→본문 전환 시 카드 전체가 매번 재조정될 수 있다. 현재 페이지 크기 10으로 영향은 제한적이다. | 항목 수가 늘면 `React.memo`와 안정적인 `key` 유지로 리스트 갱신 비용을 줄인다. |

## 범위 외·관찰

- **이미지**: `<img>` / `next/image` 사용처가 없어 LCP·CLS 관련 이미지 이슈는 해당 없음.
- **폰트**: `app/layout.tsx`에서 `next/font/google`(Geist) 사용, `globals.css`는 Tailwind·테마 위주로 과도한 웹폰트 `@import`는 없음.
- **번들**: 차트·리치 에디터 등 코드 스플릿 후보 라이브러리가 의존성에 없어 `next/dynamic` 미적용은 현 단계에서 우선순위가 낮다.

---

*본 문서는 `.cursor/skills/nextjs-supabase-performance-audit/SKILL.md` 절차에 따른 관찰 기반 감사이며, 코드 변경은 포함하지 않는다.*
