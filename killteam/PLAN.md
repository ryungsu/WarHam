# 분석 및 구현 계획

## 기존 40K 앱

상위 저장소는 `ryungsu/WarHam`이며 기존 앱은 `index.html`, `styles.css`, 약 111KB의 `app.js`, 용어집, Google Sheets 번역 파이프라인으로 구성된 정적 앱이다. React 프로젝트나 오퍼레이티브 편집용 구조는 없다. 입력한 외부 편성표를 해석하는 현재 도메인 모델은 Kill Team 빌더에 직접 맞지 않는다.

재사용: CSS 색상 변수(`#101311`, `#1a201d`, `#b7db88`), 녹색 카드, 능력치 요약, 접이식 설명, 키워드 팝업, 로컬 저장 패턴. Kill Team에서 제외: BSData XML 파서, 40K 단계·CP·미션·운드 추적. 원래 앱 파일은 수정하지 않았다.

## JSON 분석

`kt24_v4.json`의 루트는 팀 배열. 실제 필드명은 `killteamName`이다. `opTypes`에는 능력치, `weapons[].profiles`, `abilities`, 챕터 전술 `options`가 있고 팀에는 `composition`, `ploys`, `equipments`가 있다. 무장 선택·중복 제한은 기계적으로 선언되어 있지 않고 영문 composition에 있다. 플로이는 S=전략, T/F=교전. 공용 수류탄은 한 장비를 여러 레코드로 표현하므로 한 슬롯당 두 개 조합으로 정규화했다.

영문 원본은 `data-original/teams.json`, 출처 해시는 `public/data/version.json`, 정규화된 조회 데이터는 `public/data/teams.json`, 번역은 `src/translations.ts`, 편성 규칙은 `src/rules.ts`에 분리했다. 임의 문자열 effect 코드를 실행하지 않는다.

## 구현 순서 및 결과

1. 독립 React + TypeScript + Vite 앱을 기존 저장소의 killteam 폴더에 추가.
2. 우선 지원 두 팀만 추출하고 데이터 출처·버전·해시 기록.
3. 실제 무기 ID에 연결된 합법 무장 조합 및 공식 PDF 편성표 대조.
4. 홈 → 빌더 → 로스터 상세 → 데이터시트 흐름, 하단 탐색, 좌우 이동·스와이프.
5. 능력·전술·플로이·장비 탭과 규칙 팝업, 한/영 전환, 통합 검색.
6. 로컬 자동 저장, 백업·복원 형식 검증.
7. 프로덕션 자산 해시 기반 서비스 워커, 설치 아이콘·manifest, 오프라인 자산 캐시.
8. 타입 검사, 빌드, 편성 회귀 테스트. 브라우저 자동화는 환경 오류로 미검증.

## 편성 기준

Angels: 리더 1명 + 나머지 5명. Warrior 외 중복 불가. Eliminator Sniper와 Heavy Intercessor Gunner 합계 1명. Assault Sergeant의 plasma pistol은 chainsword만 허용. 주/보조 전술 2개와 해당 서전트의 Chapter Veteran 추가 전술을 저장.

Scouts: Sergeant 1명 + 나머지 8명. Warrior 외 각 목록 항목 1회. Heavy Gunner는 heavy bolter 1명, missile launcher 1명을 함께 편성할 수 있지만 같은 중화기를 중복할 수 없다.

장비는 서로 다른 4개까지. 각 수류탄 범주는 한 조합만 선택. 미완성 로스터도 저장 가능하며 오류를 계속 표시한다. 판정은 선택 조합의 합법성이고 캠페인·토너먼트 간 전술 유지까지 검증하지 않는다.

공식 대조: Angels July 2025 PDF, Scouts October 2025 PDF. 다운로드 당시 최신 공식 밸런스와 완전한 일치가 확인되었다고 주장하지 않는다. 커뮤니티 스냅샷과 공식 최신 자료는 배포 전/플레이 전 업데이트 대조가 필요하다.

## 참고 앱에서 반영한 흐름

KTDash의 팀 중심 데이터 구조와 로스터 저장, KTDojo의 편성 중 검증 노출, KT Codex의 데이터카드·키워드 즉시 조회를 참고했다. 실제 화면 자산이나 코드는 복제하지 않았다.

## Git 판단

소스 개발에는 새 GitHub 저장소가 필수는 아니다. 현재 저장소에서 독립 폴더로 관리할 수 있다. 별도 릴리스·이슈·접근 권한이 필요해질 때 분리하면 된다. Sites 배포용 소스 체크아웃은 기존 WarHam Git과 분리해 준비하며 원래 remote/branch는 변경하지 않는다.

## 다음 개발 우선순위

1. 실제 모바일·설치·비행기 모드 QA 및 사용자 용어 번역 검수.
2. 공식 업데이트와 JSON 차이 검출, 특정 스냅샷·번역 키가 달라질 때 변경 목록 제공.
3. 로스터별 메모, 즐겨찾기, 인쇄용 카드(요청 시 추가).
4. 지원 팀 확대를 위한 선언형 편성 스키마. 서버 동기화·계정은 이후 단계.

AR, 미션, 운드, VP 추적은 1차 범위 밖이다.
