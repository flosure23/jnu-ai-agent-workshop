---
name: 나만의 일기장 개발계획
overview: 0단계(초기 셋업) → 1단계(Mock 목업, 섹션 A~J) → 2단계(Supabase 실제 연동, 섹션 A~E) 순서로 진행. 각 섹션 완료 후 멈추고 확인하며, 1단계 완료 전 2단계 진입 금지.
todos:
  - id: stage-0a
    content: "0-A: frontend/ 폴더에 Next.js 프로젝트 생성 + 실행 확인"
    status: completed
  - id: stage-0b
    content: "0-B: 폴더 구조 뼈대 (auth, main, entries, lib, components)"
    status: completed
  - id: stage-0c
    content: "0-C: 환경 변수 준비 (.env.local, .env.example, .gitignore)"
    status: completed
  - id: stage-0d
    content: "0-D: 패키지 설치 (@supabase/supabase-js, @supabase/ssr)"
    status: completed
  - id: stage-0e
    content: "0-E: 전역 레이아웃 기본 설정 + 빌드 확인"
    status: completed
  - id: stage-1a
    content: "1-A: 타입 정의 (Entry, User) + mockData 10건 + mockAuth"
    status: completed
  - id: stage-1b
    content: "1-B: 인증 화면 목업 (login, signup, forgot, reset)"
    status: completed
  - id: stage-1c
    content: "1-C: 메인 레이아웃 + GNB 목업 (반응형)"
    status: completed
  - id: stage-1d
    content: "1-D: 일기 목록 목업 (카드, 정렬, 페이지네이션 10건, 빈 상태, 로딩)"
    status: completed
  - id: stage-1e
    content: "1-E: 일기 상세 목업 (제목/날짜/본문, 수정/삭제, 404)"
    status: completed
  - id: stage-1f
    content: "1-F: 일기 작성 목업 (폼, 유효성, mock 저장)"
    status: completed
  - id: stage-1g
    content: "1-G: 일기 수정 목업 (기존 값, 유효성, mock 수정)"
    status: completed
  - id: stage-1h
    content: "1-H: 일기 삭제 목업 (ConfirmModal, mock 삭제)"
    status: completed
  - id: stage-1i
    content: "1-I: 검색 목업 (SearchBar, 디바운스, 클라이언트 필터)"
    status: completed
  - id: stage-1j
    content: "1-J: 공통 UI 마무리 (Toast, loading/error, 전체 플로우 테스트)"
    status: completed
  - id: stage-2a
    content: "2-A: Supabase DB 설정 (entries 테이블, env, 클라이언트, 타입 생성)"
    status: completed
  - id: stage-2b
    content: "2-B: 인증 연동 (mock -> Supabase Auth, 세션 체크)"
    status: completed
  - id: stage-2c
    content: "2-C: 일기 CRUD 연동 (mock -> Supabase DB)"
    status: completed
  - id: stage-2d
    content: "2-D: 검색 연동 (클라이언트 필터 -> Supabase ilike)"
    status: completed
  - id: stage-2e
    content: "2-E: 최종 통합 테스트 (전체 플로우 실제 검증)"
    status: completed
isProject: false
---

# 나만의 일기장 -- 개발 계획

> **이전 버전**: `.cursor/plans/archive/plan-v1.md`
> **참조 문서**: `spec.md` (제품 명세), `api-spec.md` (데이터 흐름)
> **프로젝트 위치**: `frontend/` 폴더

## 진행 규칙

1. **각 섹션 완성 후 반드시 멈추고**, 다음 진행 여부를 사용자에게 물어본다.
2. **1단계(목업)가 완전히 끝나기 전에는 2단계로 절대 넘어가지 않는다.**
3. 0단계 -> 1단계(A~~J 순서) -> 2단계(A~~E 순서) 로 진행한다.

---

## 0단계 -- 프로젝트 초기 셋업

**스택**: Next.js App Router + TypeScript + Tailwind CSS + Supabase
**프로젝트 폴더**: `frontend/`

### 0-A. Next.js 프로젝트 생성

- `frontend/` 폴더에 `create-next-app` 실행 (App Router, TypeScript, Tailwind 선택)
- `frontend/` 안에서 `npm run dev` 로 로컬 실행 확인
- 기본 `app/layout.tsx`, `app/page.tsx` 렌더링 정상 확인

### 0-B. 폴더 구조 뼈대

- `app/(auth)/`, `app/(main)/`, `app/(main)/entries/`, `app/(main)/entries/[id]/`, `app/(main)/entries/[id]/edit/`, `app/(main)/entries/new/` 폴더 생성
- `lib/` 폴더 생성 (유틸, 타입, mock 데이터용)
- `components/` 폴더 생성 (공통 컴포넌트용)

### 0-C. 환경 변수 준비

- `frontend/.env.local` 생성 (키만, 빈 값 -- 2단계에서 채움)
- `frontend/.env.example` 생성 (참고용 커밋)
- `.gitignore`에 `.env.local` 포함 확인

### 0-D. 패키지 설치

- `@supabase/supabase-js`, `@supabase/ssr` 설치

### 0-E. 전역 레이아웃 기본 설정

- `app/layout.tsx` -- HTML lang, 폰트, Tailwind globals.css import 확인
- 빌드 에러 없이 정상 실행 확인

---

## 1단계 -- 목업 (Mock Data로 전체 플로우)

> Supabase 연동 없이 `mockData.ts`의 하드코딩 데이터만 사용.
> 모든 화면을 클릭해서 플로우를 확인할 수 있는 수준으로 구현.
> `spec.md`를 기준으로 섹션 구성.
> **1단계가 완전히 끝나기 전에는 2단계로 넘어가지 않는다.**

### 섹션 1-A: 타입 정의 + Mock 데이터

- `lib/types.ts` -- Entry, User 타입 정의
- `lib/mockData.ts` -- Entry 샘플 10건 + mockCurrentUser
- `lib/mockAuth.ts` -- isLoggedIn, login, logout 함수 (localStorage 또는 단순 변수)

### 섹션 1-B: 인증 화면 목업 (US-1)

- `(auth)/layout.tsx` -- GNB 없는 인증 전용 레이아웃 (센터 정렬)
- `login/page.tsx` -- 이메일/비밀번호 폼, 로그인 버튼(mock), 비밀번호 찾기/회원가입 링크
- `signup/page.tsx` -- 이메일/비밀번호 폼, 유효성 검사, 에러 메시지, 로그인으로 링크
- `forgot-password/page.tsx` -- 이메일 입력 + "메일 발송" 버튼 + 안내 텍스트
- `reset-password/page.tsx` -- 새 비밀번호 입력 + 완료 안내

### 섹션 1-C: 메인 레이아웃 + GNB 목업

- `(main)/layout.tsx` -- mock 인증 가드 + GNB 포함
- `components/GNB.tsx` -- 로고, 새 일기, 로그아웃, 반응형(데스크톱/모바일)

### 섹션 1-D: 일기 목록 목업 (US-5)

- `entries/page.tsx` -- mockData, date DESC 정렬, 카드 목록, 페이지네이션(10건), 빈 상태, 로딩
- `components/EntryCard.tsx` -- 카드 컴포넌트 (제목, 날짜, 본문 미리보기)

### 섹션 1-E: 일기 상세 목업 (US-6)

- `entries/[id]/page.tsx` -- 제목/날짜/본문, 수정/삭제 버튼, 목록으로 링크, 404, 로딩

### 섹션 1-F: 일기 작성 목업 (US-2)

- `entries/new/page.tsx` -- 제목/본문/날짜 폼, 유효성 검사, 저장(mock), 성공 시 목록 이동

### 섹션 1-G: 일기 수정 목업 (US-3)

- `entries/[id]/edit/page.tsx` -- 기존 값 채운 폼, 유효성, 수정(mock), 취소

### 섹션 1-H: 일기 삭제 목업 (US-4)

- `components/ConfirmModal.tsx` -- 공통 확인 모달
- 상세 삭제 버튼 -> 모달 -> mock 삭제 -> 목록 이동

### 섹션 1-I: 검색 목업 (US-7)

- `components/SearchBar.tsx` -- 검색 input, 300ms 디바운스
- 목록 상단 배치, mockData 클라이언트 필터링, 결과 없음 UI

### 섹션 1-J: 공통 UI 마무리

- `components/Toast.tsx` -- 토스트 공통 컴포넌트
- `loading.tsx`, `error.tsx` 배치
- GNB 반응형 확인
- 전체 플로우 테스트 (가입->로그인->작성->목록->상세->수정->삭제->검색->로그아웃)

---

## 2단계 -- 실제 구현 (Supabase 연동)

> 1단계 목업 완전 검증 후에만 시작.
> Supabase MCP 사용, 프로젝트명 `vibe-tutorial`.
> `api-spec.md` 자료구조 기준.

### 섹션 2-A: Supabase 프로젝트 + DB 설정

- MCP로 프로젝트 확인, `entries` 테이블 생성 (spec.md 스키마)
- `.env.local` 실제 값 채우기 (MCP `get_project_url`, `get_publishable_keys`)
- `lib/supabase/client.ts`, `server.ts` 생성
- MCP `generate_typescript_types` -> `lib/database.types.ts`
- 대시보드: Confirm email OFF, Site URL, Redirect URLs 등록

### 섹션 2-B: 인증 연동 (US-1 실제)

- mockAuth -> Supabase Auth 교체 (signUp, signInWithPassword, signOut, resetPasswordForEmail, updateUser)
- auth/callback 라우트 (필요 시)
- mock 인증 가드 -> 실제 세션 체크 (`getUser()`)
- 실제 회원가입/로그인/로그아웃 테스트

### 섹션 2-C: 일기 CRUD 연동 (api-spec.md 기준)

- 작성: mock -> `supabase.from('entries').insert()`
- 목록: mock -> `.select().eq('user_id').order('date').range()`
- 상세: mock -> `.select().eq('id').eq('user_id').single()`
- 수정: mock -> `.update().eq('id').eq('user_id')`
- 삭제: mock -> `.delete().eq('id').eq('user_id')`
- 에러 응답 -> 토스트 연결 확인

### 섹션 2-D: 검색 연동 (US-7 실제)

- 클라이언트 필터 -> Supabase `ilike` 교체
- user_id 필터, date DESC, range, 디바운스 유지

### 섹션 2-E: 최종 통합 테스트

- 실제 가입 -> 로그인 -> 작성 -> 목록 -> 상세 -> 수정 -> 삭제 -> 검색 -> 로그아웃 -> 인증 가드 -> 비밀번호 재설정

> **2단계 전체 완료 -> MVP 완성**

---

## (보류) 배포

> MVP는 로컬 확인으로 마무리. 나중에 배포할 때 참고.

- Vercel 등에 연결
- 환경 변수 호스팅 등록
- Supabase Site URL / Redirect URLs에 운영 도메인 추가

