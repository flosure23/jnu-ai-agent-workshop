# vibe-project — 나만의 일기장

Next.js 앱은 **`frontend/`** 디렉터리에 있습니다. 로컬 실행: `cd frontend` 후 `npm install`, `npm run dev`.

---

## Vercel 배포 (최소 설정)

### 1) Vercel 프로젝트 설정

GitHub 등으로 이 저장소를 연결한 뒤:

| 항목 | 값 |
|------|-----|
| **Root Directory** | `frontend` ← 저장소 루트가 아니라 하위 앱을 지정해야 합니다. |
| **Framework Preset** | Next.js |
| **Build Command** | 기본값 (`npm run build` 등) 그대로 |
| **Output Directory** | 기본값 그대로 (Next.js가 처리) |

### 2) Vercel 환경 변수

**Project Settings → Environment Variables**에서 아래 키를 등록합니다. **Production**과 **Preview**(필요 시 **Development**) 각각에 동일 키를 넣을 수 있습니다.

| 변수 이름 | 설명 |
|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon(공개) 키**만 사용 |

실제 값은 코드나 Git에 넣지 말고 Vercel 대시보드에서만 설정합니다. 키 이름만 보려면 `frontend/.env.example`을 참고하세요.

**금지:** 서비스 롤(service role) 키를 `NEXT_PUBLIC_` 접두사로 두거나 브라우저/클라이언트 번들에 넣지 마세요.

### 3) Supabase — Authentication → URL Configuration

배포 후 반드시 [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 → **Authentication** → **URL Configuration**에서 다음을 맞춥니다.

- **Site URL** (프로덕션 예시): `https://<vercel-프로젝트명>.vercel.app`  
  (커스텀 도메인을 쓰면 그 도메인으로 지정)

- **Redirect URLs**에 아래를 **허용 목록으로 추가** (한 줄에 하나씩 추가하는 형태는 대시보드 UI에 따름):

  - 프로덕션: `https://<vercel-프로젝트명>.vercel.app/**` 또는 문서에 안내된 형식으로 **콜백·재설정 경로** 포함  
    - 예: `https://<vercel-프로젝트명>.vercel.app/auth/callback`  
    - 예: `https://<vercel-프로젝트명>.vercel.app/reset-password`
  - 로컬: `http://localhost:3000/auth/callback`, `http://localhost:3000/reset-password` (및 필요 시 `http://localhost:3000/**`)

- **Vercel Preview 배포**: 팀 정책에 따라 프리뷰 URL마다 항목을 추가하거나, Supabase가 허용하는 경우 와일드카드 패턴을 사용합니다.  
  - Supabase 문서의 **Redirect URLs** 규칙을 확인한 뒤, 예를 들어 Preview용으로 `https://*.vercel.app/auth/callback` 같은 패턴이 **프로젝트에서 허용되는지** 검토하세요. 허용되지 않으면 배포될 때마다 해당 Preview URL을 수동으로 추가해야 할 수 있습니다.

- **MVP**: 이메일 확인을 끈 상태(Confirm email **OFF**)라면 가입 직후 로그인 흐름이 맞는지 한 번 확인하세요.

### 4) 배포 후 스모크 테스트

- 프로덕션 URL 접속 시 메인·로그인 화면이 정상 로드되는지 확인한다.
- 회원가입 또는 로그인이 되고, 로그인 후 일기 **목록** 페이지로 이동하는지 확인한다.
- 일기 **작성 → 저장 → 목록에 반영**이 되는지 확인한다.
- 일기 **상세 → 수정/삭제** 중 하나라도 동작하는지 확인한다.
- **로그아웃** 후 보호된 경로 접근 시 로그인으로 돌아가는지 확인한다.
- 브라우저 **개발자 도구 콘솔**에 치명적 에러가 없는지 본다.
- 비밀번호 재설정을 쓰는 경우, 메일의 링크가 **프로덕션 Redirect URL**과 일치하는지 확인한다.

---

## 문서·명세

제품·API·에이전트 규칙은 저장소 루트의 `spec.md`, `api-spec.md`, `AGENTS.md` 등을 참고하세요.
