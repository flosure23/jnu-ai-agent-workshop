# 나만의 일기장 (frontend)

이 디렉터리가 Next.js 앱 루트입니다. **Vercel**에 연결할 때 저장소 루트가 아니라 **Root Directory = `frontend`** 로 지정하세요.

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

환경 변수 키 이름은 `.env.example`을 보고, 값은 `.env.local`에만 두세요.

## 배포

**Vercel / Supabase URL 설정 / 환경 변수 / 스모크 테스트**는 저장소 루트 [`../README.md`](../README.md) 의 **「Vercel 배포」** 섹션을 따르세요.

## 스택

Next.js (App Router), TypeScript, Tailwind CSS, Supabase — 자세한 규칙은 상위 디렉터리의 `AGENTS.md`를 참고하세요.
