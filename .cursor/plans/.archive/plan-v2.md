# 나만의 일기장 — 개발 계획

> **이전 버전**: `.cursor/plans/archive/plan-v1.md`  
> **참조 문서**: `spec.md` (제품 명세) · `api-spec.md` (데이터 흐름)  
> **프로젝트 위치**: `frontend/` 폴더  
> 완료한 항목은 `- [ ]` → `- [x]` 로 바꾼다.

---

## 진행 규칙

1. **각 섹션 완성 후 반드시 멈추고**, 다음 진행 여부를 사용자에게 물어본다.
2. **1단계(목업)가 완전히 끝나기 전에는 2단계로 절대 넘어가지 않는다.**
3. 0단계 → 1단계(A~J 순서) → 2단계(A~E 순서) 로 진행한다.

---

## 0단계 — 프로젝트 초기 셋업

**스택**: Next.js App Router + TypeScript + Tailwind CSS + Supabase  
**프로젝트 폴더**: `frontend/`

### 0-A. Next.js 프로젝트 생성

- [ ] `frontend/` 폴더에 `create-next-app` 실행 (App Router, TypeScript, Tailwind 선택)
- [ ] `frontend/` 안에서 `npm run dev` 로 로컬 실행 확인
- [ ] 기본 `app/layout.tsx` · `app/page.tsx` 렌더링 정상 확인

### 0-B. 폴더 구조 뼈대

- [ ] `app/(auth)/` 라우트 그룹 폴더 생성
- [ ] `app/(main)/` 라우트 그룹 폴더 생성
- [ ] `app/(main)/entries/` 폴더 생성
- [ ] `app/(main)/entries/[id]/` 폴더 생성
- [ ] `app/(main)/entries/[id]/edit/` 폴더 생성
- [ ] `app/(main)/entries/new/` 폴더 생성
- [ ] `lib/` 폴더 생성 (유틸·타입·mock 데이터용)
- [ ] `components/` 폴더 생성 (공통 컴포넌트용)

### 0-C. 환경 변수 준비

- [ ] `frontend/.env.local` 생성 — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 키만 빈 값으로 둔다 (2단계에서 채움)
- [ ] `frontend/.env.example` 생성 — 키 이름만 적어 참고용으로 커밋
- [ ] `.gitignore`에 `.env.local` 포함 확인

### 0-D. 패키지 설치

- [ ] `@supabase/supabase-js` 설치
- [ ] `@supabase/ssr` 설치

### 0-E. 전역 레이아웃 기본 설정

- [ ] `app/layout.tsx` — HTML lang, 폰트, Tailwind globals.css import 확인
- [ ] 빌드 에러 없이 정상 실행 확인

> **섹션 완료 → 멈추고 확인**

---

## 1단계 — 목업 (Mock Data로 전체 플로우)

> **핵심 규칙**  
> - Supabase 연동 **없이** `mockData.ts`의 하드코딩 데이터만 사용한다.  
> - 모든 화면을 **클릭해서 플로우를 확인**할 수 있는 수준으로 구현한다.  
> - `spec.md`를 기준으로 섹션을 구성한다.  
> - **1단계가 완전히 끝나기 전에는 2단계로 넘어가지 않는다.**

### 섹션 1-A: 타입 정의 + Mock 데이터

- [ ] `lib/types.ts` — `Entry` 타입 정의 (`id`, `user_id`, `title`, `content`, `date`, `created_at`)
- [ ] `lib/types.ts` — `User` 타입 정의 (`id`, `email`)
- [ ] `lib/mockData.ts` — `Entry` 샘플 데이터 10건 하드코딩 (제목·본문·날짜 다양하게)
- [ ] `lib/mockData.ts` — `mockCurrentUser` 객체 (고정 UUID + 이메일)
- [ ] `lib/mockAuth.ts` — `isLoggedIn()`, `login()`, `logout()` 등 로그인 상태를 흉내내는 함수 (localStorage 또는 단순 변수)

> **섹션 완료 → 멈추고 확인**

### 섹션 1-B: 인증 화면 목업 (US-1)

- [ ] `app/(auth)/layout.tsx` — GNB 없는 인증 전용 레이아웃 (화면 중앙 카드 형태, 전역 CSS 참고)
- [ ] `app/(auth)/login/page.tsx` — 이메일 input
- [ ] `app/(auth)/login/page.tsx` — 비밀번호 input
- [ ] `app/(auth)/login/page.tsx` — "로그인" 버튼 (mock: 콘솔 로그 + entries 목록으로 이동)
- [ ] `app/(auth)/login/page.tsx` — "비밀번호 찾기" 링크 → `/forgot-password`
- [ ] `app/(auth)/login/page.tsx` — "회원가입" 링크 → `/signup`
- [ ] `app/(auth)/signup/page.tsx` — 이메일 input
- [ ] `app/(auth)/signup/page.tsx` — 비밀번호 input
- [ ] `app/(auth)/signup/page.tsx` — 유효성 검사 UI (이메일 형식, 비밀번호 6자 이상)
- [ ] `app/(auth)/signup/page.tsx` — "회원가입" 버튼 (mock: 콘솔 로그 + 로그인 페이지로 이동)
- [ ] `app/(auth)/signup/page.tsx` — 에러 메시지 표시 자리 (중복 이메일 등)
- [ ] `app/(auth)/signup/page.tsx` — "로그인으로" 링크
- [ ] `app/(auth)/forgot-password/page.tsx` — 이메일 input + "메일 발송" 버튼
- [ ] `app/(auth)/forgot-password/page.tsx` — 제출 후 "메일을 확인하세요" 안내 텍스트
- [ ] `app/(auth)/reset-password/page.tsx` — 새 비밀번호 input + "변경" 버튼
- [ ] `app/(auth)/reset-password/page.tsx` — 변경 완료 후 로그인 페이지로 이동 안내

> **섹션 완료 → 멈추고 확인**

### 섹션 1-C: 메인 레이아웃 + GNB 목업

- [ ] `app/(main)/layout.tsx` — mock 인증 가드 (항상 로그인 상태로 통과, 나중에 교체)
- [ ] `components/GNB.tsx` — 로고 (텍스트 or 아이콘, 클릭 시 목록으로)
- [ ] `components/GNB.tsx` — "새 일기" 버튼 → `/entries/new`
- [ ] `components/GNB.tsx` — "로그아웃" 버튼 (mock: 로그인 페이지로 이동)
- [ ] `components/GNB.tsx` — 데스크톱: 가로 네비게이션
- [ ] `components/GNB.tsx` — 모바일: 반응형 축소 (햄버거 메뉴 또는 간소화)
- [ ] `app/(main)/layout.tsx` — GNB 포함한 레이아웃 렌더링 확인

> **섹션 완료 → 멈추고 확인**

### 섹션 1-D: 일기 목록 목업 (US-5)

- [ ] `app/(main)/entries/page.tsx` — mockData import 후 `date DESC` 정렬 표시
- [ ] `components/EntryCard.tsx` — 카드 컴포넌트 (제목, 날짜 `YYYY-MM-DD`, 본문 미리보기 2~3줄 truncate)
- [ ] `app/(main)/entries/page.tsx` — 카드 목록 렌더링
- [ ] `app/(main)/entries/page.tsx` — 카드 클릭 시 `/entries/[id]`로 이동
- [ ] `app/(main)/entries/page.tsx` — 페이지네이션 UI (이전/다음 버튼, 현재 페이지 표시)
- [ ] `app/(main)/entries/page.tsx` — 페이지네이션 동작 (한 페이지 10건, mock 데이터 기준)
- [ ] `app/(main)/entries/page.tsx` — 빈 상태 UI ("첫 일기를 작성해보세요" + 작성 버튼)
- [ ] `app/(main)/entries/page.tsx` — 로딩 상태 UI (스켈레톤 카드 또는 스피너)

> **섹션 완료 → 멈추고 확인**

### 섹션 1-E: 일기 상세 목업 (US-6)

- [ ] `app/(main)/entries/[id]/page.tsx` — mockData에서 `id`로 한 건 조회
- [ ] `app/(main)/entries/[id]/page.tsx` — 제목 표시
- [ ] `app/(main)/entries/[id]/page.tsx` — 날짜 표시
- [ ] `app/(main)/entries/[id]/page.tsx` — 본문 전체 표시
- [ ] `app/(main)/entries/[id]/page.tsx` — "수정" 버튼 → `/entries/[id]/edit`
- [ ] `app/(main)/entries/[id]/page.tsx` — "삭제" 버튼 (동작은 1-H에서 연결)
- [ ] `app/(main)/entries/[id]/page.tsx` — "목록으로" 링크 → `/entries`
- [ ] `app/(main)/entries/[id]/page.tsx` — 없는 id 접근 시 404 UI ("일기를 찾을 수 없습니다")
- [ ] `app/(main)/entries/[id]/page.tsx` — 로딩 상태 표시

> **섹션 완료 → 멈추고 확인**

### 섹션 1-F: 일기 작성 목업 (US-2)

- [ ] `app/(main)/entries/new/page.tsx` — 제목 input
- [ ] `app/(main)/entries/new/page.tsx` — 본문 textarea
- [ ] `app/(main)/entries/new/page.tsx` — 날짜 input (기본값: 오늘)
- [ ] `app/(main)/entries/new/page.tsx` — 유효성 검사 (제목 필수, 본문 필수)
- [ ] `app/(main)/entries/new/page.tsx` — 유효성 실패 시 각 필드 아래 에러 메시지
- [ ] `app/(main)/entries/new/page.tsx` — "저장" 버튼 (mock: 콘솔 로그)
- [ ] `app/(main)/entries/new/page.tsx` — 저장 성공 시 목록 페이지로 이동
- [ ] `app/(main)/entries/new/page.tsx` — 성공 알림 자리 (토스트는 1-J에서 공통화)

> **섹션 완료 → 멈추고 확인**

### 섹션 1-G: 일기 수정 목업 (US-3)

- [ ] `app/(main)/entries/[id]/edit/page.tsx` — mockData에서 기존 값 불러와 폼에 채우기
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — 제목 input (기존 값)
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — 본문 textarea (기존 값)
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — 날짜 input (기존 값)
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — 유효성 검사 (작성과 동일)
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — "수정" 버튼 (mock: 콘솔 로그)
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — 성공 시 상세 페이지로 이동
- [ ] `app/(main)/entries/[id]/edit/page.tsx` — "취소" → 상세 페이지로 돌아가기

> **섹션 완료 → 멈추고 확인**

### 섹션 1-H: 일기 삭제 목업 (US-4)

- [ ] `components/ConfirmModal.tsx` — 공통 확인 모달 컴포넌트 (제목, 메시지, 확인/취소 버튼)
- [ ] 상세 페이지 삭제 버튼 클릭 → 확인 모달 열기
- [ ] 모달: "정말 삭제하시겠습니까?" 메시지
- [ ] 모달 "확인" → mock 삭제 처리 (콘솔 로그) → 목록으로 이동
- [ ] 모달 "취소" → 모달 닫기
- [ ] 성공 알림 자리 (토스트는 1-J에서)

> **섹션 완료 → 멈추고 확인**

### 섹션 1-I: 검색 목업 (US-7)

- [ ] `components/SearchBar.tsx` — 검색 input 컴포넌트
- [ ] `app/(main)/entries/page.tsx` — 목록 상단에 SearchBar 배치
- [ ] 입력 시 **300ms 디바운스** 적용
- [ ] mockData에서 **제목 + 본문** 키워드 필터링 (클라이언트 사이드)
- [ ] 필터 결과를 목록에 반영 (카드 목록 업데이트)
- [ ] 검색 결과 없음 UI ("검색 결과가 없습니다")
- [ ] 검색어 지우면 전체 목록 복원

> **섹션 완료 → 멈추고 확인**

### 섹션 1-J: 공통 UI 마무리

- [ ] `components/Toast.tsx` — 토스트 공통 컴포넌트 (성공: 초록, 실패: 빨강, 자동 닫힘)
- [ ] 토스트를 작성·수정·삭제 성공/실패 지점에 연결
- [ ] `app/(main)/entries/loading.tsx` — 목록 로딩 UI
- [ ] `app/(main)/entries/[id]/loading.tsx` — 상세 로딩 UI
- [ ] `app/(main)/entries/error.tsx` — 에러 UI
- [ ] GNB 반응형 최종 확인 (모바일/데스크톱)
- [ ] **전체 플로우 테스트**: 회원가입 → 로그인 → 새 일기 작성 → 목록 확인 → 상세 보기 → 수정 → 삭제 → 검색 → 로그아웃

> **1단계 전체 완료 확인 → 2단계 진행 여부 결정**

---

## 2단계 — 실제 구현 (Supabase 연동)

> **전제**: 1단계 목업 플로우가 **완전히 검증**된 후에만 시작한다.  
> **Supabase 작업**: **Supabase MCP** 사용, 프로젝트명 **`vibe-tutorial`**.  
> **기준 문서**: `api-spec.md`의 자료구조.

### 섹션 2-A: Supabase 프로젝트 + DB 설정

- [ ] Supabase MCP로 프로젝트 확인 (프로젝트명: `vibe-tutorial`)
- [ ] MCP `apply_migration`으로 `entries` 테이블 생성 (`spec.md` DB 스키마 참조)
  - `id` uuid PK default `gen_random_uuid()`
  - `user_id` uuid FK → `auth.users` NOT NULL
  - `title` text NOT NULL
  - `content` text NOT NULL
  - `date` date NOT NULL default `CURRENT_DATE`
  - `created_at` timestamptz default `now()`
- [ ] MCP `list_tables`로 테이블 생성 확인
- [ ] `frontend/.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 실제 값 채우기 (MCP `get_project_url`, `get_publishable_keys` 활용)
- [ ] `lib/supabase/client.ts` — 브라우저용 Supabase 클라이언트 생성
- [ ] `lib/supabase/server.ts` — 서버용 Supabase 클라이언트 생성
- [ ] MCP `generate_typescript_types`로 타입 파일 생성 → `lib/database.types.ts`
- [ ] Supabase 대시보드: **"Confirm email" OFF**
- [ ] Supabase 대시보드: **Site URL** = `http://localhost:3000`
- [ ] Supabase 대시보드: **Redirect URLs**에 `http://localhost:3000/reset-password` 등 등록

> **섹션 완료 → 멈추고 확인**

### 섹션 2-B: 인증 연동 (US-1 실제)

- [ ] `mockAuth.ts` → `supabase.auth.signUp()` 교체 (회원가입)
- [ ] 회원가입 에러 처리 (중복 이메일 등 → 에러 메시지)
- [ ] `mockAuth.ts` → `supabase.auth.signInWithPassword()` 교체 (로그인)
- [ ] 로그인 에러 처리 (잘못된 비밀번호 등)
- [ ] `mockAuth.ts` → `supabase.auth.signOut()` 교체 (로그아웃)
- [ ] `forgot-password` → `supabase.auth.resetPasswordForEmail()` 연결
- [ ] `reset-password` → `supabase.auth.updateUser()` 연결
- [ ] `auth/callback/route.ts` 생성 (Supabase 리다이렉트·해시 교환, 필요 시)
- [ ] `(main)/layout.tsx` — mock 인증 가드를 **실제 세션 체크**로 교체 (`supabase.auth.getUser()`)
- [ ] 비로그인 시 `/login`으로 리다이렉트 동작 확인
- [ ] 실제 회원가입 → 로그인 → 로그아웃 플로우 테스트

> **섹션 완료 → 멈추고 확인**

### 섹션 2-C: 일기 CRUD 연동 (api-spec.md 기준)

- [ ] 작성: mockData INSERT → `supabase.from('entries').insert()` 교체
  - `user_id` = `auth.getUser()` UUID
  - `title`, `content`, `date` 전송
  - 성공 시 토스트 + 목록 이동
  - 실패 시 에러 메시지
- [ ] 목록: mockData → `supabase.from('entries').select()` 교체
  - `.eq('user_id', 현재UUID)`
  - `.order('date', { ascending: false })`
  - `.range(시작, 끝)` 페이지네이션 (10건)
- [ ] 상세: mockData 단건 → `supabase.from('entries').select().eq('id', …).eq('user_id', …).single()` 교체
  - 없으면 404
- [ ] 수정: mock → `supabase.from('entries').update({ title, content, date }).eq('id', …).eq('user_id', …)` 교체
  - 성공/실패 토스트
- [ ] 삭제: mock → `supabase.from('entries').delete().eq('id', …).eq('user_id', …)` 교체
  - 확인 모달 → 성공 시 목록 이동 + 토스트
- [ ] 모든 CRUD에서 `user_id` 필터 적용 확인
- [ ] Supabase 에러 응답 (`error.message`) → 토스트·에러 메시지 연결 확인

> **섹션 완료 → 멈추고 확인**

### 섹션 2-D: 검색 연동 (US-7 실제)

- [ ] 클라이언트 필터 → Supabase `ilike` 교체
  - `.or('title.ilike.%키워드%,content.ilike.%키워드%')`
- [ ] `user_id` 필터 유지
- [ ] 정렬: `date DESC` 유지
- [ ] 페이지네이션: `.range()` 유지
- [ ] 디바운스 300ms 유지
- [ ] 검색 결과 없음 UI 동작 확인

> **섹션 완료 → 멈추고 확인**

### 섹션 2-E: 최종 통합 테스트

- [ ] 실제 회원가입 (새 이메일)
- [ ] 로그인
- [ ] 일기 작성 (3건 이상)
- [ ] 목록 확인 (정렬·페이지네이션)
- [ ] 상세 보기
- [ ] 일기 수정
- [ ] 일기 삭제 (모달 확인)
- [ ] 검색 (키워드 입력 → 결과 확인 → 결과 없음 확인)
- [ ] 로그아웃
- [ ] 비로그인 상태에서 `/entries` 접근 → 로그인으로 리다이렉트 확인
- [ ] 비밀번호 재설정 플로우 (찾기 → 메일 → 재설정)

> **2단계 전체 완료 → MVP 완성**

---

## (보류) 배포

> MVP는 **로컬 확인**으로 마무리한다. 나중에 배포할 때 아래를 참고.

- [ ] Vercel 등에 프로젝트 연결
- [ ] 환경 변수 호스팅에 등록
- [ ] Supabase 대시보드 Site URL · Redirect URLs에 운영 도메인 추가

---

## 빠른 참고

| 단계 | 참조 문서 |
|------|-----------|
| 0단계 (셋업) | `AGENTS.md` 프로젝트 규칙 |
| 1단계 (목업) | `spec.md` 유저 스토리·페이지 구조·공통 기능 |
| 2단계 (실제) | `api-spec.md` 데이터 흐름·필드·조건, `spec.md` DB 스키마 |

---

*이 파일은 진행 상황에 맞춰 체크박스를 업데이트하면 된다.*
