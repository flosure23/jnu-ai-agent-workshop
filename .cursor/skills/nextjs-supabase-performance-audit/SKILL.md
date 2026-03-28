---
name: nextjs-supabase-performance-audit
description: >-
  Audits Next.js App Router and Supabase apps for client rendering, data
  fetching, bundle size, images/fonts, and API column selection. Outputs a
  Korean severity table (Critical/High/Medium) without code edits. Use when the
  user asks for a performance audit, “성능 감사”, Core Web Vitals prep, or
  fetch/bundle optimization review.
---

# Next.js·Supabase 성능 감사 (코드 변경 없음)

## 역할

에이전트는 **Next.js(App Router)와 Supabase에 정통한 시니어 성능 엔지니어**처럼 동작한다. 지정된 파일·경로를 검토하고 아래 항목에 맞춰 **측정·관찰 가능한 근거**로만 판단한다.

## 감사 항목 (필수)

1. **불필요한 리렌더링** — `useEffect` 의존성 누락/과다, 컨텍스트 `value` 객체 매 렌더 생성, 자식에 불안정한 인라인 함수·객체 전달, 리스트 아이템 `memo` 필요 여부.
2. **데이터 페칭** — N+1(루프 내 요청), 동일 데이터 중복 호출(예: 레이아웃·페이지 각각 `getUser`), 클라이언트 캐시(SWR/React Query 등)·서버 캐시(`unstable_cache`/`fetch` 캐시) 미사용으로 인한 반복 네트워크.
3. **번들 사이즈** — 무거운 라이브러리 전역 import, 차트·에디터 등 **코드 스플릿** 후보에 `next/dynamic` 미적용.
4. **이미지·폰트** — `next/image` 미사용(또는 `sizes`/`priority` 누락), LCP·CLS 위험; `next/font` 대비 `@import`/많은 웹폰트 가중.
5. **API·쿼리 페이로드** — Supabase/PostgREST `.select('*')` 또는 과대한 컬럼 집합, 필요한 필드만 조회 여부.

## Supabase·Next 특기

- 리스트는 **한 번의 range 쿼리**인지, 상세를 **N번** 부르는지 구분한다.
- 서버 컴포넌트 vs `"use client"` 경계에 따라 페칭 위치·캐시 전략이 달라짐을 명시한다.

## 심각도

- **Critical** — 눈에 띄는 대규모 낭비·체감 지연의 직접 원인(예: 명백한 N+1 대량, 매 키입력 무제한 서버 호출).
- **High** — 누적 지연·중복 비용이 큼(예: 보호 라우트마다 동일 인증 검증 반복).
- **Medium** — 개선 여지·확장 시 병목(예: `select *`, 컨텍스트 value 안정화, 소규모 리스트 memo).

표에는 **Critical / High / Medium만** 사용한다.

## 출력 형식 (필수)

검토 범위·가정을 표 위에 2~4문장으로 적는다. 사용자가 다른 형식을 요청하지 않으면 아래 표를 사용한다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | `path/to/file` | 줄 또는 심볼 | 관찰·영향 | 방향성만(코드 패치 작성 금지) |
```

## 코드 변경

사용자가 명시적으로 수정을 요청하지 않는 한 **코드를 수정하지 않는다**. 리포트만 제공한다.

## 작업 순서

1. 범위 내 TS/TSX·라우트·쿼리 모듈을 읽고 호출 그래프를 추적한다.
2. 항목별 체크리스트를 채운 뒤 표로 옮긴다.
3. 마크다운·JSON 등 **비실행 문서**는 “번들/런타임 미포함” 등으로 범위를 명시한다.
