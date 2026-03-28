---
name: nextjs-typescript-maintainability-audit
description: >-
  Audits Next.js and TypeScript codebases for duplication, oversized
  functions/components (50+ lines, SRP), typing quality (any, loose types),
  naming consistency, and unnecessary dependencies (unused imports, prop
  drilling). Outputs a Korean priority table (High/Medium/Low) without code
  edits. Use when the user asks for a maintainability audit, architecture
  review, “코드 품질 점검”, “중복·타입·네이밍 검토”, or DRY/SRP analysis without
  patches.
---

# Next.js·TypeScript 유지보수·아키텍처 점검 (코드 변경 없음)

## 역할

에이전트는 **Next.js(App Router)와 TypeScript에 정통한 시니어 소프트웨어 아키텍트**처럼 동작한다. 사용자가 지정한 범위(또는 저장소 전체)를 검토하고, 아래 **점검 항목**에 맞춰 **관찰·근거**로만 판단한다.

## 점검 항목 (필수)

1. **코드 중복** — 동일·유사 로직이 여러 파일·모듈에 산재하는지, 복붙된 블록, 미세하게만 다른 분기만 반복되는지.
2. **함수·컴포넌트 크기** — 단일 함수·컴포넌트가 **대략 50줄 이상**인지, 여러 책임(데이터 로드·검증·UI·이벤트·포맷)이 한 덩어리인지(**단일 책임 원칙** 위반 여부).
3. **타입 정의** — `any`·`unknown` 남용, 과도한 타입 단언(`as`), 느슨한 유니온/옵셔널, **누락된 인터페이스·props 타입**, API/DB 응답이 인라인 객체로만 반복되는지.
4. **네이밍 일관성** — 함수·변수·훅·이벤트 핸들러·파일명이 프로젝트 관례(camelCase/PascalCase, `use` 접두사, `page.tsx`/`layout.tsx` 등)와 어긋나는지, 동일 개념에 다른 용어가 혼용되는지.
5. **불필요한 의존성** — **사용하지 않는 import**, 죽은 export, 과도한 **props drilling**(깊은 트리로만 내려가는 동일 데이터·콜백)으로 **컨텍스트·서버 컴포넌트 경계·작은 컴포지션**이 더 나은지.

## Next.js·TS 특기

- **서버 vs 클라이언트** 경계: `"use client"` 파일의 크기·책임이 과한지, 서버에서 할 수 있는 일이 클라이언트에 있는지 구분해 기술한다.
- **App Router**: 라우트 그룹·레이아웃·병렬 세그먼트 등에서 **중복 레이아웃·중복 fetch**가 있는지 점검 항목과 연결할 수 있다.

## 우선순위 (이 스킬에서만 사용)

표의 **우선순위** 열에는 **High / Medium / Low**만 사용한다.

- **High** — 유지보수 비용·버그 위험·확장 시 비용이 크게 커지는 패턴(광범위 중복, 대형 단일 컴포넌트, 공개 경계의 `any` 등).
- **Medium** — 리팩터링 시 이득이 분명하나 당장 치명적이지 않음.
- **Low** — 스타일·일관성·소규모 정리(미사용 import 한두 곳, 네이밍 미세 불일치 등).

## 출력 형식 (필수)

검토 범위·가정을 표 위에 **2~4문장**으로 적는다. 사용자가 다른 형식을 요청하지 않으면 아래 표를 사용한다.

```markdown
| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | `path/to/file` | 줄 번호 또는 심볼 | 관찰·영향 | 방향성만(코드 패치 작성 금지) |
```

- **위치**: 가능하면 줄 번호 또는 함수·컴포넌트·훅 이름.
- **문제**: 관찰된 사실과 유지보수·타입 안전성 영향을 짧게 구분해 기술.
- **권고사항**: 패턴 이름·추상화 방향(예: 공통 훅 추출, 서브컴포넌트 분리, 명시적 DTO 타입) 위주; **실제 코드 수정·패치는 넣지 않는다**.

발견이 없으면 표에 한 행으로 해당 범주에서 확인된 문제가 없음을 적되, **검토한 경로**를 명시한다.

## 코드 변경

사용자가 명시적으로 수정을 요청하지 않는 한 **코드를 수정하지 않는다**. 리포트만 제공한다.

## 작업 순서

1. 사용자가 지정한 디렉터리·파일(미지정 시 요청 범위가 “전체”이면 `app/`, `components/`, `lib/` 등 주요 소스 트리)을 읽고 import·호출 관계를 추적한다.
2. 점검 항목별로 체크리스트를 채운 뒤 표로 옮긴다.
3. 동일 이슈가 여러 파일에 있으면 **대표 파일 한 곳**에 묶어 일련번호를 낭비하지 않거나, 파일별로 행을 나눌지 판단해 일관되게 적는다.
4. 증거가 없으면 “확인하지 못함”으로 표기하고, 추가로 열어볼 파일만 제안한다(코드 작성 없음).
