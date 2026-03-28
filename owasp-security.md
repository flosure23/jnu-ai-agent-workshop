# OWASP 보안 감사 리포트

**Critical/High 요약:** 로그인 후 이동 경로로 쿼리 파라미터 `next`를 그대로 쓰는데, `//`로 시작하는 값이 `startsWith("/")` 검사를 통과해 프로토콜 상대 URL로 외부 사이트 이동(피싱 등)이 가능할 수 있습니다.

## 검토 범위 및 가정

검토 대상은 `frontend/` 디렉터리의 Next.js App Router 애플리케이션과 Supabase(`@supabase/ssr`, `@supabase/supabase-js`) 연동 코드입니다. 루트의 `hello.js`는 본 앱 배포 경로에 포함되지 않는 샘플로 보고 제외했습니다. 데이터 접근은 코드상 PostgREST 기반 클라이언트(`.from`, `.eq`, `.insert` 등)만 확인되었고, 서버 측에서의 Supabase Auth 비밀번호 해시 파라미터(cost 등)는 호스트 설정이라 소스만으로는 검증하지 못했습니다.

## 결과 표

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `frontend/app/(auth)/login/page.tsx` | `LoginForm`, `handleSubmit`, `nextPath`·`router.push` | `searchParams.get("next")` 값이 `//example.com`처럼 프로토콜 상대 URL이면 `String.prototype.startsWith("/")`가 참이 되어 `router.push`로 타 도메인 이동이 가능할 수 있음(피싱·세션 혼동과 연계). | 동일 출처 상대 경로만 허용(예: 단일 `/`로 시작하고 두 번째 문자가 `/`가 아닌지 검사), 또는 허용 경로 화이트리스트·정규화 후 사용. |
| 2 | Medium | `frontend/middleware.ts` | `middleware`, `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` 누락 분기 | 환경 변수가 없으면 `createServerClient` 및 `getUser()` 없이 `NextResponse.next()`만 반환되어, 미들웨어 기준 보호 경로(`/entries`)에 대한 로그인 강제가 수행되지 않음(배포 오류 시 인증 우회 가능). | 설정 누락 시 `503` 또는 로그인 강제 실패 등 **fail-closed** 처리; 배포 전 환경 변수 검증. |
| 3 | Medium | `frontend/app/error.tsx`, `frontend/app/(auth)/login/page.tsx`, `signup/page.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx`, `frontend/app/(main)/entries/page.tsx`, `entries/new/page.tsx`, `entries/[id]/page.tsx`, `entries/[id]/edit/page.tsx` | 각 UI의 `error.message` / `signError.message` / `*.message` 표시 | Supabase·PostgREST 오류 메시지와 `error.tsx`의 `error.message`를 사용자에게 그대로 노출하면, 환경·스키마·정책 단서가 유출될 수 있음(프로덕션에서 정보 유출·공격 면적 확대). | 프로덕션에서는 일반화된 사용자 메시지와 내부 로그 분리; 서버/클라이언트 공통 에러 매핑 패턴 적용. |
| 4 | Medium | `frontend/app/(auth)/signup/page.tsx`, `reset-password/page.tsx` | 비밀번호 길이 검증 | 클라이언트에서만 최소 6자 규칙을 적용; OWASP 관점의 강한 비밀번호 정책 및 적응형 해시는 Supabase Auth 설정·서버 정책에 의존하며, 앱 단만으로는 충분하지 않을 수 있음. | Supabase 대시보드·Auth 정책에서 최소 길이·복잡도·브루트포스 완화 등을 설정하고, 가능하면 서버 측 검증과 일치시킬 것. |

## SQL 인젝션 (항목 보충)

**해당 항목에서 확인된 문제 없음(검토 범위: `frontend/` TS/TSX).** 문자열로 SQL을 조립하는 코드나 `.rpc` raw SQL 호출은 없고, 데이터 접근은 Supabase 클라이언트(`.from` / `.eq` / `.insert` 등)로 이루어집니다. 검색용 `.or`의 `ilike` 패턴에는 `escapeIlike`로 `%`·`_`·`\` 이스케이프가 적용되어 있습니다. PostgREST·RLS는 인프라에서 주기적으로 점검하는 것이 좋습니다.

## 세션 관리 (항목 보충)

세션·토큰 저장·갱신은 Supabase Auth 및 `@supabase/ssr` 쿠키 어댑터에 위임되어 있으며, 앱 코드에서 쿠키 `HttpOnly`/`Secure`/`SameSite`를 직접 지정하지는 않습니다(라이브러리·호스트 기본값에 따름). 로그아웃은 `signOut()` 호출로 처리됩니다. `app/auth/callback/route.ts`의 `next`는 `origin`과 결합되는 서버 리다이렉트라 클라이언트 `router.push`와는 패턴이 다르나, 동일 출처 경로만 허용하는 편이 일관됩니다.

## Bcrypt·해싱 (항목 보충)

애플리케이션 코드에 bcrypt·`compare`/`verify`·salt cost 설정이 없으며, 비밀번호는 Supabase Auth가 처리하는 구성으로 보입니다. 표 4행과 같이 클라이언트 최소 길이만 있는 점은 정책 측면에서 보완 여지가 있습니다.

## 기타 (표 외 한 줄)

- **Low/Info:** 루트 `hello.js`는 콘솔 출력용 샘플이며 프로덕션 프론트 번들과 무관하면 별도 위험도가 낮습니다. 프론트엔드 소스에 `console.log` 등 디버그 출력은 검색 범위에서 발견되지 않았습니다.
