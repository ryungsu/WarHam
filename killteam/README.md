# Kill Team · 작전 기록실

기존 40K 앱의 녹색 다크 UI를 재사용한 독립 React + TypeScript 모바일 PWA 프로토타입. 기존 앱은 그대로 유지됩니다.

## 실행

Node 22.6+ 및 pnpm이 필요합니다.

```powershell
cd killteam
pnpm install
pnpm dev
```

프로덕션/PWA 확인:

```powershell
pnpm test
pnpm build
pnpm preview
```

개발 모드에는 서비스 워커를 등록하지 않습니다. 오프라인 확인은 build → preview 후 온라인 최초 방문·캐시 완료를 기다린 뒤 진행하세요. PWA 설치는 HTTPS 또는 localhost 환경에서 가능합니다.

## 기능

- Angels of Death, Scout Squad 로스터 생성·복제·삭제·자동 저장
- 합법 무장 조합 선택, 리더·인원·전문병·상호 배타 제한 확인
- 챕터 전술 2개 및 서전트 추가 전술, 팀 장비·수류탄 조합 선택
- 선택한 무장의 데이터시트, 능력·전술·플로이·장비 탭
- 하단 네비게이션, 이전/다음·스와이프·바로가기
- 한국어/영문 전환, 번역 초안 표시·영문 펼치기
- 유닛·무기·능력·플로이·장비·무기 규칙 통합 검색
- 로스터 백업·복원(가져온 로스터는 새 ID로 추가)
- manifest, PNG 아이콘, 프로덕션 자산 서비스 워커

장비·전술의 조건부 효과는 원본 능력치에 자동 합산하지 않습니다. 표는 기본 데이터이며 해당 설명을 함께 확인하세요. 원문 외에 추가한 무기 규칙 팝업은 간단 참고 설명이며 공식 전체 규칙을 대체하지 않습니다.

## 데이터 및 검증 한계

출처: [vjosset/killteamjson](https://github.com/vjosset/killteamjson), `kt24_v4.json`, 2026-10-14 다운로드. 데이터 작성자에게 크레딧을 제공합니다. 영문 원본과 번역 초안은 분리합니다. SHA-256은 `public/data/version.json`에 기록되어 있습니다.

공식 팀 편성표는 [Warhammer Community](https://www.warhammer-community.com/en-gb/downloads/kill-team/)의 Angels July 2025 / Scouts October 2025 PDF와 대조했습니다. **현재 최신 공식 밸런스 전체와 일치한다는 보장은 아닙니다.** 번역은 AI 초안으로 검수가 필요합니다.

타입 검사·빌드 및 편성 회귀 테스트를 실행했습니다. 브라우저 자동 점검은 환경 오류로 실행하지 못해 실제 모바일 화면·설치·비행기 모드 동작은 미검증입니다.

구조·Git 판단·확장 제안은 [PLAN.md](PLAN.md)를 참고하세요. Sites hosting metadata는 `.openai/hosting.json`에 있습니다.

## 현재 완성된 확장 기능

- 공식 킬팀 스타일의 밝은 무장 표, 검정 헤더·주황 강조, 원거리/근접 SVG 아이콘
- 데이터시트 펼쳐보기, 전체 펼치기/접기, 스크롤 네비게이터
- 공식 팀 PDF에서 추출한 오퍼레이티브 모델 사진; 스카웃 서전트는 사용자 제공 카드 이미지
- 오른쪽에서 왼쪽으로 펼치는 검색 패널, 키보드 높이에 따른 패널 조절, 검색 입력 자동 확대 방지
- 최근 사용 로스터 6개 바로 불러오기
- 미션 화면에서 로스터 데이터시트 함께 조회, 양측 수동 CP/VP·TP·메모 저장 및 되돌리기
- 상황별 능력·플로이·전술·장비·선택 무장 특성 조회 (미션 화면)
- Approved Ops 2025 카드 목록 22개, 공식 2026-08 업데이트 본문을 대조한 7개 카드
- 검증된 Crit Op 2개만 사용하는 제한된 연습 뽑기; 미검증 카드의 본문과 자동 득점은 적용하지 않음

상황별 전투 보조를 로스터에서 서랍으로 여는 기능은 제안 단계이며 아직 구현되지 않았습니다. 상세 미션 데이터 대조 결과는 [검증 보고서](docs/mission-audit/REPORT.md)에 기록되어 있습니다.

배포 주소: https://killteam-field-reference.regalsugar7.chatgpt.site (소유자 비공개).

## 저장소 구성과 재현

Git에는 소스·잠금 파일·앱용 데이터·이미지·검증 TXT/문서를 포함합니다. `node_modules`, `dist`, `tmp`, 분석 중 내려받은 PDF/HTML/JS/PNG는 제외합니다. 다운로드 PDF의 주소는 검증 문서 및 앱 내 이미지 출처에 남아 있습니다. 로스터·게임 상태는 사용자 브라우저에 저장되며 저장소에 업로드되지 않습니다.

`scripts/import-missions.mjs`는 보관된 이탈리아어 후보 JSON과 공식 업데이트 추출 TXT에서 앱용 목록을 재생성합니다. `scripts/prepare-data.mjs`는 보관된 upstream JSON에서 지원 팀을 추출하고 수류탄 조합을 정규화합니다.

```powershell
node scripts/prepare-data.mjs
node scripts/import-missions.mjs
pnpm test
pnpm build
```

이미지는 `public/images/operatives/`에 있고 출처는 데이터시트와 `sources.json`에 표시합니다. GitHub 개발 브랜치와 Sites 배포 소스 저장소는 분리되어 있으며 이 브랜치를 push하는 것만으로 Sites가 자동 배포되지는 않습니다.
