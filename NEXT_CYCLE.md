# 40K 웹앱 다음 사이클 인수인계

작성: 2026-11-04 (Asia/Seoul)

## 사용자의 최신 지시

현재 개선본을 브랜치로 보관하고 새 브랜치에서 다음 작업을 진행하라고 요청함.
1. 합류 정보 연결 오류 수정.
2. 긴 로딩과 버튼 반응 지연 개선.
3. 다른 앱을 참조하여 로스터 생성의 장비·유닛 편집 UX 개선.
4. 필요한 추가 개선은 자율 진행.
이후 **5분 후 초기화 예정이므로 현재 진행 상황을 정리하고 다음 사이클로 넘길 문서를 만들라**고 지시함. 사용자가 직접 모델을 바꿀 예정. 여기서 새 채팅 생성이나 모델 전환을 실행하지 말 것.

## Git 상태 / 작업 범위

- 보관 브랜치: `codex/checkpoint-20261104`
- 보관 커밋: `9fbbb75` (`Preserve roster builder improvements and restored app state`)
- 현재 작업 브랜치: `codex/roster-ux-performance-20261104`
- 이 문서와 현재 개선 내용을 현재 브랜치에 중간 커밋으로 보관할 예정. `git log -2 --oneline`로 최종 커밋 확인.
- **원격 push 하지 않았음. 사용자는 로컬 확인 후 배포하는 흐름을 선호함.**
- 기존 unrelated untracked 자료: `killteam/`, `output/`, 번역 나머지 txt, 환불 상담 PNG들. 스테이징/삭제하지 말 것.
- .git 쓰기는 sandbox에서 막혀 `require_escalated`로 허용받아 브랜치/커밋 생성했음. 일반 파일 수정은 workspace 내 가능.
- AGENTS.md 검색에서 발견한 파일 없음. 다른 에이전트 생성은 사용자 지시 없음.

## 이번 사이클에서 반영한 코드

### 합류
- `app.js / parseRoster`: NewRecruit의 `Leading ...`, `Supporting ...`를 읽어 캐릭터의 대상과 Leader/Support 역할로 저장.
- `Attached to index: N` 확장 줄을 파싱. 1 기반 텍스트 -> 0 기반 인덱스. 같은 이름 분대가 여럿이어도 새 편집기 출력의 대상을 정확히 유지.
- `rosterAttachmentParents`: 명시 인덱스를 이름 검색보다 우선 사용. 기존 분대 -> 캐릭터 방향의 Attached to는 경호 분대를 host로 해석하는 동작 유지.
- `roster-builder-official-ui.js / builder-apply`: Attached to 이름/역할과 함께 대상 인덱스도 출력.
- 저장 로스터 편집 복원: `rosterAttachmentParents(parsed.units)`를 재사용하고 `_savedParsedIndex`와 편집기로 실제 로딩된 entry 인덱스 간 매핑을 통해 대상 복원. 누락된 유닛이 있어도 잘못된 분대를 가리키지 않게 함.
- 유닛 삭제 후 attachedTo 인덱스 감소/대상 삭제 시 null 처리.
- 대상 분대 아래에 합류 캐릭터별 작은 클릭 행을 추가. 캐릭터 본래 행의 합류 대상 표시도 유지.
- 합류 대상 선택 카드에 #인덱스를 표시하고 해제 버튼 제공.

### 로딩 / 응답
- 새 `app-data-cache.js`: IndexedDB JSON 저장. 6시간 내 캐시 우선, 만료 시 네트워크 시도, 전부 실패하면 30일 내 캐시 사용. 주소별 동시 요청 중복 제거. fetch 시 주소당 10초 제한과 미러 순차 시도.
- BSData, 40kdc, stratagem JSON 요청이 캐시 API를 사용하도록 연결. IDB 사용 불가 시 네트워크로 진행. IDB 열기는 800ms 제한.
- `findDataUnit` 결과를 동일 db.units 배열 내에서 캐싱. 수동 매칭 값, translations.size, v2LabelTranslations.size를 키에 포함. 동일 유닛을 무장/규칙/네비게이션 렌더링마다 다시 스캔하던 비용 감소.
- `loadRulesData` 같은 진영 동시 호출은 진행 중 promise를 기다리게 함. 기존의 단순 key 조기 return 때문에 로스터 편집기가 자료 완료 전에 넘어가는 경로를 줄임.
- 편집 중인 builder의 진영을 불러오는 동안, render()가 textarea의 이전 로스터 진영으로 자동 재로딩하지 않도록 guard 추가.
- 실제 모바일 속도 개선량은 측정하지 않았음. 숫자/배율을 주장하지 말 것.

### 편집 UI
- 모델 그룹 바로 아래에 그 모델의 교체 옵션을 포함시키고 같은 카드 안에 배치.
- 고정 기본 장비는 큰 disabled 체크박스 목록 대신 접을 수 있는 작은 정보 칩으로 표시. 칩을 누르면 기존 무기 상세 팝업 사용.
- 편집 상단에 `인원 · 무장 / 인헨스 / 합류` 이동 버튼 추가.
- 같은 유닛의 무장/인원을 바꿔도 편집 패널 scrollTop 유지. 다른 유닛을 열면 상단부터 표시.
- styles.css 마지막에 컴팩트 카드/합류 행/터치 영역 CSS 추가.
- index.html 새 캐시 스크립트를 app.js 앞에 defer로 추가, 바뀐 CSS/app/UI 스크립트 쿼리 버전 갱신.

## 검증 결과

실행 완료:
- `node --check app.js`
- `node --check app-data-cache.js`
- `node --check roster-builder-ui.js`
- `node --check roster-builder-official-ui.js`
- `node --test tests/roster-loading-attachments.test.cjs tests/roster-builder-wargear-policy.test.cjs`
- **19 pass / 0 fail**. 신규 6개는 Leading/Supporting, 중복 분대 대상 인덱스, 역방향 합류, 신선 캐시 네트워크 생략, offline/30일 초과, 동시 요청/미러 fallback을 확인. 기존 무장 회귀 13개 유지.

주의: 신규 parser 테스트는 VM에서 실제 parseRoster / rosterAttachmentParents를 추출하지만 장비 파싱과 findDataUnit은 최소 스텁을 사용. 실제 외부 BSData, 브라우저 DOM, IDB 동작을 모두 검증하는 테스트는 아님.

브라우저 확인 시도:
- `mcp__cua_repl.js`에서 로컬 파일 tab 접근 시 `failed to write kernel assets: 지정된 경로를 찾을 수 없습니다. (os error 3)` 발생.
- 따라서 실제 화면, 모바일 레이아웃, iOS Safari/PWA는 **미검증**. 확인했다고 말하지 말 것.
- computer-use SKILL.md 전체를 읽었으나 native Windows UI 사용은 아직 시작하지 않았음. 필요하면 해당 skill의 guidance/api/confirmations도 읽은 후 접근.

## 다음 사이클 우선 작업

1. **현재 변경분 DOM/브라우저 실행부터 검증.** CUA 초기화 오류를 복구할 수 있는지 확인. 실제 파일 열기/새로고침, 오류 콘솔 가능하면 확인. 이미지/화면 못 봤으면 그렇다고 명시.
2. 합류 end-to-end: Titus -> Infernus, Lieutenant -> Assault Intercessors, Wardens -> Intercessors. 동일 이름 분대 2개, 앞 유닛 삭제, 대상 분대 삭제, 저장 -> 편집 -> 적용 -> 데이터 탭으로 왕복. 합류 소스 버프도 대상 무기에 계속 나오는지 확인.
3. 삭제 인덱스 보정 코드는 아직 신규 테스트 없음. helper로 추출해 의미 있는 회귀 테스트를 추가하는 것을 권장. 다른 예전 이벤트 핸들러들이 중첩되어 있으므로 capture/stopImmediatePropagation 실행 순서 확인.
4. 캐시의 IDB transaction read/write에도 짧은 timeout을 추가 검토. 현재 open만 제한되어 있고 transaction 자체가 멈추면 기다릴 수 있음. 캐시 용량 정리/갱신 안내 버튼도 아직 없음. 새 자료 갱신이 필요할 때 캐시 우회 방법을 제공할 것.
5. 로딩 병목 측정: 외부 네트워크 시간 vs adaptBsData/indexRuleDescriptions vs 전체 카드 innerHTML 재생성을 구분. 초기 로딩/같은 로스터 재열기/스트라타젬 탭/장비 한 번 변경의 시간을 실제 측정. 현재 memoization과 raw JSON cache만으로 전부 해결됐다고 하지 말 것.
6. 유닛 상세는 아직 화면 전체 고정 패널. 모델별 장비의 상호 배타 조건/모델 배정/기본 장비 복구가 실제로 편한지 화면을 보고 조정. 모델 B/C/D 개별 설정, 서전트 전용 옵션, per-five Scout 제한을 계속 지킬 것.
7. 합류 선택은 현재 모든 비캐릭터 대상을 보여줌. 데이터에 허용 대상이 있으면 필터/제약 조건을 연결하는 작업이 남음. 규칙을 추측해 강제하지 말 것.
8. 지금 코드의 여러 UI override 층(app.js -> roster-builder-ui.js -> official UI)을 한꺼번에 전면 재작성하지 말고, 회귀 테스트와 함께 단계적으로 정리.

## 기존 상태 복원 기능 점검도 필요

이전 턴에서 localStorage 앱 상태 보존을 구현했음 (`APP_STATE_KEY`, captureAppState, restoreAppStateView 등). 실제 iOS 검증 없음.
- validAppState가 version/rosterText만 확인하므로 openCards/stratagemDetails 등 손상된 필드의 타입 검증 보강 필요.
- restoreStoredScrollPosition은 activeCard가 있는 상태에서 다른 탭을 복원할 때 숨겨진 results 좌표를 사용할 수 있음. datasheets 탭일 때만 anchor 적용하도록 점검.
- builder 편집 초안 전체(모델·장비 structured data)는 자동 저장하지 않음. 현재 loaded roster 원문과 UI 일부만 저장. 초안 보존 범위는 추가 설계 필요.
- 검색 상태는 현재 builder 검색 입력만 있고, 스트라타젬 전용 검색 UI 자체는 없음. 사용자의 검색 상태 요구가 모두 만족됐다고 주장하지 말 것.

## 참고 자료 / 사용자 선호

- 사용자가 이전에 제공한 공식 앱 스크린샷: 역할별 + -> 채용 목록 -> 유닛 상세에서 서전트/일반 모델 구분, 장비/인헨스/합류 설정.
- NewRecruit 공식 변경 기록: https://www.newrecruit.eu/changelog (모델/서브유닛 stepper와 옵션 정리 참고).
- Battle Forge 공식 설명: https://www.warhammer-community.com/en-gb/articles/sp7tKzPf/warhammer-40000-app-update-how-battle-forge-works/
- 위 링크 검색으로 확인했으며 이번 사이클에서 타 앱에 로그인하거나 전체 UI를 직접 조작하지는 않았음. 그대로 완벽 복제했다고 하지 말 것.
- 모바일 우선, PC/폰 동일 구성, 가로 스크롤 없이 짧은 표기, 무기 정보 i 버튼, 원거리/근접 구분, 같은 무기 묶기, 한영 병기, 원문은 접기. CP 추적/체크리스트 불필요.
- 사용자는 승인 재질문보다 진행을 선호. 현재는 다음 사이클 인수인계까지 저장하는 것이 마지막 지시.
