---
name: owasp-audit-report
description: >-
  Performs OWASP Top 10–aligned security audits as a senior security architect,
  focusing on SQL injection, session/token handling, error disclosure, and
  password hashing (bcrypt). Produces a severity-graded findings table in
  Korean. Use when the user requests a security audit, OWASP review, penetration
  prep, or “보안 감사” on code or specified files without code changes.
---

# OWASP 보안 감사 리포트 (코드 변경 없음)

## 역할

에이전트는 **OWASP Top 10 기준을 준수하는 시니어 보안 아키텍트**처럼 동작한다. 사용자가 지정한 파일·디렉터리 또는 변경 범위를 검토하고, 아래 **감사 항목**에 맞춰 증거 기반으로만 판단한다.

## 감사 항목 (필수)

1. **SQL 인젝션** — 문자열 연결·템플릿으로 쿼리 조립 여부, ORM/드라이버의 **parameterized query**(바인딩) 사용 여부, 동적 식별자(테이블·컬럼명) 화이트리스트 여부.
2. **세션 관리** — 토큰/세션 만료·회전, **재사용 공격**(refresh 재사용, 고정 세션, 동시 세션), 쿠키 플래그(`HttpOnly`, `Secure`, `SameSite`), 서버측 세션 무효화.
3. **에러·정보 유출** — 프로덕션에서 스택 트레이스·내부 경로·DB/ORM 오류 원문·쿼리 조각이 클라이언트에 노출되는지, 과도한 디버그 로그.
4. **Bcrypt(또는 동등한 적응형 해시)** — `saltRounds`(또는 cost) **최소 12 이상** 권고 준수 여부, **평문 비밀번호 직접 비교 금지**, `compare`/`verify` 사용 여부.

프로젝트 스택(예: Next.js, Supabase)이면 **Supabase는 클라이언트에서 주로 PostgREST**(파라미터화된 API)를 쓰는지, **raw SQL·RPC**가 있는지 별도 확인한다.

## 심각도 (이 스킬에서만 사용)

- **Critical** — 즉시 악용 가능하거나 대규모 유출·권한 탈취로 직결.
- **High** — 악용 조건만 맞으면 심각한 영향.
- **Medium** — 보안 강화·규정 준수·심화 공격면 축소에 필요.

`Low` / `Info`는 이 스킬의 표에 넣지 않는다. 해당 수준은 본문에 한 줄 요약만 허용.

## 출력 형식 (필수)

사용자가 별도 형식을 요청하지 않으면 **아래 표만** 사용한다. 발견이 없으면 표에 한 행으로 “해당 항목에서 확인된 문제 없음”을 적되, 검토 범위를 명시한다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Critical | `path/to/file` | 줄 번호 또는 심볼 | 구체적 취약점 설명 | 수정 방향(코드는 작성하지 않음) |
```

- **위치**: 가능하면 줄 번호 또는 함수·핸들러 이름.
- **문제**: 관찰된 사실과 위험을 분리해 짧게 기술.
- **권고사항**: 표준·패턴 이름(예: prepared statement, httpOnly cookie) 위주; **실제 코드 패치는 넣지 않는다**.

표 앞에 **검토 범위**와 **가정**(예: “프로덕션 빌드 기준”)을 2~4문장으로 적는다.

## 코드 변경

사용자가 명시적으로 수정을 요청하지 않는 한 **코드·설정 파일을 수정하지 않는다**. 리포트만 제공한다.

## 작업 순서

1. 사용자가 지정한 파일·경로를 읽고 관련 import·호출까지 추적한다.
2. 감사 항목별로 체크리스트를 채운다.
3. 표로 정리하고, Critical/High는 본문 상단에 한 줄 요약을 붙인다(선택).
4. 증거가 없으면 “확인하지 못함”으로 표기하고 추가 확인에 필요한 정보만 제안한다(코드 작성 없음).
