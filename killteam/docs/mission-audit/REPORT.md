# 미션 데이터 대조 결과 · 2026-10-14

공식 다운로드 페이지의 검색 API(POST `/api/search/downloads/`)로 Approved Ops 검색 결과를 확인했다. 다운로드 메타데이터는 `official-downloads.json`에 보관했다. 공식 Update Log와 Tournament Companion의 업데이트 날짜는 모두 2026-08-26이다. 기존에 검색된 2025/2026년 5월 PDF가 아닌 현재 다운로드 주소로 대조했다.

## 가져온 자료

- 커뮤니티 후보: ArturoBianchi/kt-op-2025, `vue-project/src/properties/op/crit-tac-kill-op.json`
- 고정 파일 커밋: `0d5e0b370a41e4f2cc519f20ad2e853fcbd1efdb` (2026-08-17)
- 이탈리아어 후보 원본: `data-original/missions/italian-candidate.json`
- 공식 업데이트: `approved-update-2026-08.pdf` 및 추출 TXT
- 공식 Companion: `companion-2026-08.pdf` 및 추출 TXT
- 앱용 정규화 목록: `public/data/missions.json`

커뮤니티 후보는 앱에 원문 전체를 그대로 재배포하지 않았다. 저장소의 명시적 라이선스는 확인되지 않았다. 앱의 확인된 영어 본문은 공식 업데이트에서 추출하며 출처를 표시한다. 카드별 한국어는 원문을 대조한 번역 초안이다. 공식 영어로 검증하지 못한 이탈리아어 카드 본문은 로컬 후보로만 보관한다.

## 확인한 차이

| 카드 | 후보 문제 | 반영 |
|---|---|---|
| Flank | 이전 TP에도 통제하면 매 TP 2VP로 기술 | TP4에서 TP3 통제 조건을 충족할 때만 2VP로 수정 |
| Dominate | 적 Wounds 12+의 2토큰 조건 누락 | 해당 조건과 전장 내 살아 있는 모델 조건 반영 |
| Martyrs | 부활 모델이 다시 전투불능일 때 중복 토큰 방지 누락 | 오퍼레이티브당 최초 전투불능만 반영 |
| Envoy | Kill Op에서 무시되는 오퍼레이티브 제외 누락 | 제외 조건 반영 |
| Sweep & Clear | 득점 문구가 현재 공식 업데이트와 다름 | 적용 보류. 공식 최신 PDF의 Additional Rules 문장도 불완전하여 임의 복원하지 않음 |

## 검증 범위

22개 목록: Crit 9, Tac 12, Kill 1. Crit 9의 이름과 번호는 공식 Companion의 그룹 목록으로 확인했다. Tac/Kill의 미검증 항목 이름은 커뮤니티 후보를 정규화한 것이다.

공식 본문 대조 7개:

- Crit: Stake Claim, Energy Cells
- Tac: Flank, Retrieval, Martyrs, Envoy, Dominate

나머지 15개는 `catalog-only`. 게임 조건/득점 본문을 창작하거나 이탈리아어 후보를 영어 원문으로 표시하지 않는다. Kill 등급 자동 계산과 Primary 자동 가산도 완전한 공식 본문 대조 전까지 구현하지 않았다.

연습 뽑기는 본문 대조가 완료된 Crit 2개만 사용한다. 전체 Approved Ops 덱 생성, 맵 자동 생성, 공식 득점 자동 판정은 미구현이다. 공유 Crit의 이름 선택은 가능하지만 미검증 항목은 카드/공식 앱 참고를 표시한다. Tac는 아키타입으로 제한하고 본문 검증 완료 항목만 선택 가능하다.

## 화면과 상태

미션 화면 안에서 데이터시트를 펼친다. 데스크톱은 2열, 모바일은 1열. 고정 검색 패널은 페이지 이동 없이 결과와 데이터시트를 보여준다. 게임은 선택 당시 로스터 스냅샷, 미션 ID, 비공개 표시, TP, 양측 수동 CP/VP, 메모를 로컬에 저장한다. 수치와 미션 변경은 되돌릴 수 있으나 메모 편집은 별도 되돌리기 기록을 생성하지 않는다. 로스터를 바꾸면 초기화 확인을 요청한다. CP 자동 지급·플로이 자동 차감·운드 추적은 이 변경의 범위가 아니다.

미션 카탈로그는 오프라인 캐시 목록에도 포함된다. 실제 브라우저 UI 자동화는 기존 환경 오류로 미검증이다.

## 한국어 초안 보완 · 2026-10-15

기존 공식 대조 7개는 유지했다. 나머지 15개에는 pinned-candidate.json의 이탈리아어 커뮤니티 본문을 기반으로 koreanDraft, sourceText, sourceLanguage=it를 추가했다. 이들은 catalog-only 상태와 빈 english를 유지하므로 공식 검증 완료로 승격되지 않는다. 원문에서 발견된 행동명 불일치 및 Sweep & Clear 공식 문장 불완전 문제는 번역 화면에 명시했다. Kill Op의 5~14명 등급표도 원문대로 보존했다. 미션 목록·전투 패널·검색에서 한국어 초안을 표시하며 공식 영문과 이탈리아어 출처를 구별한다.
