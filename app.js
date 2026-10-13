const example = `+++++++++++++++++++++++++++++++++++++++++++++++
- FACTION KEYWORD: Imperium - Adeptus Astartes - Ultramarines
- TOTAL ARMY POINTS: 910pts
- WARLORD: Char1: Captain Titus
- NUMBER OF UNITS: 9
Char1: 1x Captain Titus (100 포인트): 사령관, 명장제조 체인소드, Bolt pistol, Master-crafted Bolter
Char2: 1x Lieutenant (45 포인트): Close combat weapon, Bolt pistol, Master-crafted bolter
Supporting Intercessor Squad
10x Assault Intercessor Squad (150 포인트)
• 1x 강습 인터세서 서전트: Heavy Bolt Pistol, Astartes Chainsword
• 9x Assault Intercessors: 9 with Astartes Chainsword, Heavy Bolt Pistol
5x Intercessor Squad (80 포인트)
• 1x 인터세서 서전트: Bolt pistol, 볼트 소총, Close combat weapon
• 4x 인터세서: 4 with 볼트 소총, Bolt pistol, Close combat weapon
Attached to Lieutenant
1x Ballistus Dreadnought (150 포인트): Armoured Feet, Ballistus Lascannon, Ballistus Missile Launcher, Twin Storm Bolter
1x Brutalis Dreadnought (150 포인트): Twin Icarus ironhail heavy stubber, Brutalis Bolt Rifles, Brutalis Fists, Twin heavy bolter
5x Infernus Squad (85 포인트)
• 4x Infernus Marines: 4 with 파이어블라스터, Bolt pistol, Close combat weapon
• 1x Infernus Sergeant: 파이어블라스터, Bolt pistol, Close combat weapon
5x Infernus Squad (85 포인트)
• 4x Infernus Marines: 4 with 파이어블라스터, Bolt pistol, Close combat weapon
• 1x Infernus Sergeant: 파이어블라스터, Bolt pistol, Close combat weapon
5x Scout Squad (65 포인트)
• 1x Scout Sergeant: Bolt pistol, Close combat weapon, 볼트건
• 4x Scouts: 4 with 볼트건, Bolt pistol, Close combat weapon`;

const translations = new Map([
  ["Imperium", "인류제국"], ["Adeptus Astartes", "아뎁투스 아스타르테스"], ["Ultramarines", "울트라마린"],
  ["Captain Titus", "캡틴 티투스"], ["Lieutenant Titus", "루테넌트 티투스"], ["Lieutenant", "루테넌트"], ["Assault Intercessor Squad", "강습 인터세서 분대"],
  ["Intercessor Squad", "인터세서 분대"], ["Ballistus Dreadnought", "발리스투스 드레드노트"],
  ["Brutalis Dreadnought", "브루탈리스 드레드노트"], ["Infernus Squad", "인페르누스 분대"], ["Scout Squad", "스카웃 분대"],
  ["Bolt pistol", "볼트 피스톨"], ["Heavy Bolt Pistol", "헤비 볼트 피스톨"], ["Astartes Chainsword", "아스타르테스 체인소드"],
  ["Close combat weapon", "근접 무기"], ["Master-crafted Bolter", "명장제 볼터"], ["Master-crafted bolter", "명장제 볼터"],
  ["Armoured Feet", "장갑 발"], ["Ballistus Lascannon", "발리스투스 라스캐논"], ["Ballistus Missile Launcher", "발리스투스 미사일 발사기"],
  ["Twin Storm Bolter", "트윈 스톰 볼터"], ["Brutalis Bolt Rifles", "브루탈리스 볼트 라이플"], ["Brutalis Fists", "브루탈리스 피스트"],
  ["Twin heavy bolter", "트윈 헤비 볼터"], ["Twin Icarus ironhail heavy stubber", "트윈 이카루스 아이언헤일 헤비 스터버"], ["Bolt rifle", "볼트 라이플"], ["Boltgun", "볼트건"],
  ["Titus","티투스"],["Infantry","인팬트리"],["Character","캐릭터"],["Epic Hero","에픽 히어로"],["Imperium","인류제국"],["Tacticus","택티쿠스"],["Grenades","그레네이드"],["Captain","캡틴"],["Faction","진영"],["Leader","지휘관"],["Feel No Pain","고통 경감"]
]);
const statTranslations = new Map([["M","이동"],["T","내구"],["Sv","방어"],["W","운드"],["LD","리더십"],["OC","목표 장악"],["InSv","무적 방어"],["Range","사거리"],["A","공격 횟수"],["BS","탄도 기술"],["WS","무기 기술"],["S","힘"],["AP","관통력"],["D","피해"],["Keywords","특수 규칙"],["Description","설명"],["Abilities","능력"]]);
const profileTypeTranslations = new Map([["Unit","유닛 능력치"],["Model","모델 능력치"],["Ranged Weapons","원거리 무기"],["Melee Weapons","근접 무기"],["Abilities","능력"],["Wargear","장비"]]);
const abilityTranslations = new Map([
  ["Press the Attack","공세"], ["Honour of Ultramar","울트라마르의 명예"], ["Leader","지휘관"], ["Support","지원"],
  ["Shock Assault","충격 강습"], ["Objective Secured","목표 확보"], ["Hail of Bolts","탄환의 폭풍"],
  ["Ballistus Strike","발리스투스 강타"], ["Brutalis Charge","브루탈리스 돌격"], ["Incendiary Terror","소이탄의 공포"], ["Guerrilla Tactics","게릴라 전술"],
  ["Sustained Hits 1","지속 명중 1"], ["Assault","강습"], ["Heavy","중화기"], ["Pistol","권총"], ["Twin-linked","쌍연결"],
  ["Torrent","분사"], ["Ignores Cover","엄폐 무시"], ["Lethal Hits","치명타 명중"], ["Devastating Wounds","치명적인 상처"],
  ["Precision","정밀 타격"], ["Twin-linked","쌍연결"], ["Blast","폭발"], ["Rapid Fire","속사"], ["Melta","멜타"], ["Lance","랜스"], ["Extra Attacks","추가 공격"]
]);
const keyGlossary = new Map([
  ["feel no pain",{ko:"고통 경감",en:"Feel No Pain",description:"이 능력이 있는 모델이 운드를 잃을 때 D6을 굴립니다. 결과가 괄호의 기준 이상이면 그 운드를 잃지 않습니다."}],
  ["sustained hits",{ko:"지속 명중",en:"Sustained Hits",description:"치명 명중을 기록할 때마다, 이 능력의 숫자만큼 추가 명중을 얻습니다."}],
  ["lethal hits",{ko:"치명타 명중",en:"Lethal Hits",description:"치명 명중을 기록하면 해당 공격은 운드 굴림 없이 자동으로 운드를 입힙니다."}],
  ["devastating wounds",{ko:"치명적인 상처",en:"Devastating Wounds",description:"치명 운드를 기록하면 대상은 이 공격의 피해를 방어 굴림으로 막을 수 없습니다."}],
  ["precision",{ko:"정밀 타격",en:"Precision",description:"치명 명중을 기록한 공격은 대상 유닛의 캐릭터 모델에 할당할 수 있습니다."}],
  ["torrent",{ko:"분사",en:"Torrent",description:"이 무기의 공격은 자동으로 명중합니다."}],
  ["ignores cover",{ko:"엄폐 무시",en:"Ignores Cover",description:"대상은 이 공격에 대해 엄폐 보너스를 받을 수 없습니다."}],
  ["assault",{ko:"강습",en:"Assault",description:"이 무기를 장비한 유닛은 전진한 턴에도 사격할 수 있습니다."}],
  ["heavy",{ko:"중화기",en:"Heavy",description:"유닛이 이번 턴에 제자리에 머물렀다면 이 무기의 명중 굴림에 보너스를 받습니다."}],
  ["pistol",{ko:"권총",en:"Pistol",description:"이 무기를 장비한 유닛은 적과 교전 중이어도 사격할 수 있습니다."}],
  ["twin-linked",{ko:"쌍연결",en:"Twin-linked",description:"이 무기의 운드 굴림을 다시 굴릴 수 있습니다."}],
  ["rapid fire",{ko:"속사",en:"Rapid Fire",description:"대상이 무기 사거리의 절반 안에 있으면 공격 횟수가 증가합니다."}],
  ["blast",{ko:"폭발",en:"Blast",description:"큰 규모의 유닛을 공격할 때 대상 모델 수에 따라 공격 횟수가 늘어납니다."}],
  ["close-quarters",{ko:"클로즈 쿼터스",en:"Close-Quarters",description:"이 무기를 가진 모델이 있는 유닛은 교전 중에도 사격할 수 있습니다. 핵심 규칙에서 Pistol과 동일하게 취급됩니다."}],
  ["librarius",{ko:"리브라리우스",en:"Librarius",description:"아뎁투스 아스타르테스 PSYKER 유닛은 데이터시트에 표시된 사이커 레벨만큼 매 배틀 라운드에 사이킥 능력을 사용할 수 있습니다. 사용하는 능력들의 사이킥 레벨 합계는 해당 유닛의 사이커 레벨을 넘을 수 없습니다."}],
  ["infiltrators",{ko:"인필트레이터",en:"Infiltrators",description:"배치 시 이 능력이 모든 모델에게 있다면, 상대 배치 구역과 모든 적 유닛에서 수평으로 8인치보다 멀리 떨어진 전장 어디든 배치할 수 있습니다."}],
  ["anti-infantry",{ko:"안티 인팬트리",en:"Anti-Infantry",description:"대상 유닛에 Infantry 키워드가 있으면 괄호의 수치 이상으로 운드 굴림 결과를 개선합니다."}],
  ["anti-monster",{ko:"안티 몬스터",en:"Anti-Monster",description:"대상 유닛에 Monster 키워드가 있으면 괄호의 수치 이상으로 운드 굴림 결과를 개선합니다."}],
  ["anti-vehicle",{ko:"안티 비히클",en:"Anti-Vehicle",description:"대상 유닛에 Vehicle 키워드가 있으면 괄호의 수치 이상으로 운드 굴림 결과를 개선합니다."}],
  ["anti-mounted",{ko:"안티 마운티드",en:"Anti-Mounted",description:"대상 유닛에 Mounted 키워드가 있으면 괄호의 수치 이상으로 운드 굴림 결과를 개선합니다."}],
  ["indirect fire",{ko:"인디렉트 파이어",en:"Indirect Fire",description:"무기의 간접 사격 규칙입니다. 시야와 표적 조건에 관한 세부 규칙을 확인하세요."}],
  ["sustained hits",{ko:"지속 명중",en:"Sustained Hits",description:"치명 명중을 기록할 때마다, 괄호의 숫자만큼 추가 명중을 얻습니다."}]
]);
const phoneticWords = new Map([["bolt","볼트"],["boltgun","볼트건"],["heavy","헤비"],["pistol","피스톨"],["rifle","라이플"],["rifles","라이플"],["bolter","볼터"],["chainsword","체인소드"],["lascannon","라스캐논"],["missile","미사일"],["launcher","런처"],["twin","트윈"],["storm","스톰"],["brutalis","브루탈리스"],["ballistus","발리스투스"],["armoured","아머드"],["feet","피트"],["fist","피스트"],["fists","피스트"],["icarus","이카루스"],["ironhail","아이언헤일"],["stubber","스터버"],["pyreblaster","파이어블래스터"],["master-crafted","마스터크래프티드"],["close","클로즈"],["combat","컴뱃"],["knife","나이프"],["shotgun","샷건"],["sergeant","서전트"],["weapon","웨폰"],["weapons","웨폰"],["flamer","플레이머"],["plasma","플라즈마"],["power","파워"],["sword","소드"],["fury","퓨리"],["autocannon","오토캐논"],["cannon","캐논"],["grenade","그레네이드"],["intercessor","인터세서"],["scout","스카웃"],["infernus","인페르누스"],["astartes","아스타르테스"]]);
const abilityTextTranslations = new Map([
  ["press the attack","이 모델의 유닛에 속한 모델들이 장비한 무기는 [지속 명중 1] 능력을 얻습니다."],
  ["honour of ultramar","이 모델이 근접 공격으로 파괴되었고 이번 페이즈에 아직 싸우지 않았다면, 주사위를 굴립니다. 2+가 나오면 이 모델을 제거하지 않고, 공격 유닛의 공격이 끝난 뒤 싸울 수 있습니다. 이 공격으로 적 모델을 하나 이상 파괴하면 잃은 운드를 D3만큼 회복하고 파괴되지 않습니다. 그렇지 않으면 전장에서 제거합니다."],
  ["shock assault","이 유닛의 모델이 근접 공격으로 적 유닛을 대상으로 할 때마다, 운드 굴림에서 나온 1을 다시 굴릴 수 있습니다. 대상 유닛이 목표 마커 범위 안에 있다면 운드 굴림 전체를 다시 굴릴 수 있습니다."],
  ["objective secured","지휘 페이즈 종료 시 이 유닛이 목표 마커 범위 안에 있고 해당 마커를 지배하고 있다면, 유닛이 마커 범위 안에 모델을 두지 않더라도 상대가 어느 턴의 시작 또는 종료 시점에 그 마커를 지배할 때까지 계속 지배합니다."],
  ["hail of bolts","사격 페이즈에 이 유닛을 사격 대상으로 선택할 때, 시야에 있는 적 유닛을 최대 하나 선택합니다. 해당 유닛을 대상으로 공격하는 동안 이 유닛의 볼트 라이플은 공격 횟수가 2 증가합니다."],
  ["ballistus strike","이 모델이 절반 이하 전력이 아닌 유닛을 대상으로 원거리 공격을 할 때마다 명중 굴림을 다시 굴릴 수 있습니다."],
  ["brutalis charge","이 모델이 돌격 이동을 마칠 때마다 교전 범위 안의 적 유닛 하나를 선택하고 D6을 굴립니다. 2~3이면 치명상 D3, 4~5이면 치명상 3, 6이면 치명상 D3+3을 입힙니다."],
  ["incendiary terror","사격 페이즈에 이 유닛의 사격이 끝난 뒤, 파이어블라스터 공격에 한 번 이상 맞은 적 보병 유닛 하나를 선택할 수 있습니다. 해당 유닛은 전투 충격 시험을 치르며, 시험 결과에 1을 뺍니다."],
  ["guerrilla tactics","상대 턴 종료 시 이 유닛이 모든 적 모델로부터 6인치보다 멀리 떨어져 있다면, 이 유닛을 전장에서 제거하고 전략 예비대로 배치할 수 있습니다."],
  ["support","이 모델은 다음 유닛에 합류할 수 있습니다: 강습 인터세서 분대, 강습 분대, 블레이드가드 베테랑 분대, 커맨드 분대, 컴퍼니 히어로즈, 헬블래스터 분대, 인페르누스 분대, 인터세서 분대, 스턴가드 베테랑 분대, 뱅가드 베테랑 분대 등."],
  ["leader","이 모델은 해당 데이터시트에 표시된 유닛에 합류할 수 있습니다."]
]);
const termTranslations = new Map([
  ["Adeptus Custodes","아뎁투스 쿠스토데스"],["Lions of the Emperor","황제의 사자들"],["Take and Hold","점령과 유지"],["Incursion","급습"],["Attached Units","부착 유닛"],["Attached Unit","부착 편성"],["BATTLELINE","전열"],["OTHER DATASHEETS","기타 데이터시트"],["Warlord","총사령관"],["Enhancement","강화"],["Attached as","부착 역할"],["Bodyguard","경호 유닛"],["Leader","지휘관"],["Character","캐릭터"],
  ["Shield-Captain in Allarus Terminator Armour","알라루스 터미네이터 아머 실드 캡틴"],["Allarus Custodians","알라루스 커스토디안 분대"],["Custodian Wardens","커스토디안 워든 분대"],["Custodian Guard","커스토디안 가드 분대"],["Blade Champion","블레이드 챔피언"],["Witchseeker Sister Superior","위치시커 시스터 슈페리어"],["Witchseekers","위치시커 분대"],["Witchseeker","위치시커"],["Vaultswords","볼트소드"],["Guardian spear","가디언 스피어"],["Balistus grenade launcher","발리스투스 그레네이드 런처"],["Superior Creation","상급 창조"],["Admonimortis","어드모니모르티스"],["Close combat weapon","근접 무기"],["Sister Superior","시스터 슈페리어"],
  ["Captain Titus","캡틴 티투스"],["Assault Intercessor Squad","강습 인터세서 분대"],["Assault Intercessors","강습 인터세서"],["Intercessor Squad","인터세서 분대"],["Intercessors","인터세서"],["Infernus Squad","인페르누스 분대"],["Infernus Marines","인페르누스 마린"],["Infernus Sergeant","인페르누스 서전트"],["Scout Squad","스카웃 분대"],["Scouts","스카웃"],["Scout Sergeant","스카웃 서전트"],["Ballistus Dreadnought","발리스투스 드레드노트"],["Brutalis Dreadnought","브루탈리스 드레드노트"],["Lieutenant","루테넌트"],["Assault Squad","강습 분대"],["Bladeguard Veteran Squad","블레이드가드 베테랑 분대"],["Command Squad","커맨드 분대"],["Company Heroes","컴퍼니 히어로즈"],["Hellblaster Squad","헬블래스터 분대"],["Sternguard Veteran Squad","스턴가드 베테랑 분대"],["Vanguard Veteran Squad","뱅가드 베테랑 분대"],
  ["Sustained Hits 1","지속 명중 1"],["Lethal Hits","치명타 명중"],["Devastating Wounds","치명적인 상처"],["Ignores Cover","엄폐 무시"],["Twin-linked","쌍연결"],["Torrent","분사"],["Assault","강습"],["Heavy","중화기"],["Pistol","권총"],["Blast","폭발"],["Rapid Fire","속사"],["Melta","멜타"],["Precision","정밀 타격"],["Extra Attacks","추가 공격"],["Oath of Moment","맹세의 순간"],["Objective Secured","목표 확보"],["Feel No Pain","고통 경감"],["Infiltrators","침투"],["Scouts","정찰"],["Below Half-strength","절반 이하 전력"],["Advance","전진"],["Fall Back","후퇴"],["Reinforcements","증원군"],["Leadership characteristic","리더십 능력치"],
  ["Strategic Reserves","전략 예비대"],["Objective marker","목표 마커"],["Command phase","지휘 페이즈"],["Shooting phase","사격 페이즈"],["Melee Weapons","근접 무기"],["Melee attack","근접 공격"],["Melee","근접"],["Ranged Weapons","원거리 무기"],["ranged attack","원거리 공격"],["Hit roll","명중 굴림"],["Wound roll","운드 굴림"],["Charge move","돌격 이동"],["Charge rolls","돌격 굴림"],["Engagement Range","교전 범위"],["Battle-shock test","전투 충격 시험"],["mortal wounds","치명상"],["enemy unit","적 유닛"],["enemy units","적 유닛"],["this unit","이 유닛"],["this model","이 모델"],["models","모델"],["unit","유닛"],["within range","범위 안"],["at the end of","종료 시"],["each time","~할 때마다"],["you can","할 수 있습니다"],["select one","하나를 선택합니다"],["roll one D6","D6 하나를 굴립니다"],["re-roll","다시 굴립니다"],["subtract 1","1을 뺍니다"],["add 1","1을 더합니다"],["destroyed","파괴된"],["not destroyed","파괴되지 않은"]
]);
const SPACE_MARINES_URL="https://raw.githubusercontent.com/BSData/wh40k-11e/main/Imperium%20-%20Space%20Marines.json";
const ULTRAMARINES_URL="https://raw.githubusercontent.com/BSData/wh40k-11e/main/Imperium%20-%20Ultramarines.json";
const BSDATA_BASE="https://raw.githubusercontent.com/BSData/wh40k-11e/main/";
const CATALOGUE_FILES=["Aeldari - Aeldari Library.json","Aeldari - Craftworlds.json","Aeldari - Drukhari.json","Chaos - Chaos Daemons Library.json","Chaos - Chaos Daemons.json","Chaos - Chaos Knights Library.json","Chaos - Chaos Knights.json","Chaos - Chaos Space Marines.json","Chaos - Death Guard.json","Chaos - Emperor's Children.json","Chaos - Thousand Sons.json","Chaos - Titanicus Traitoris.json","Chaos - World Eaters.json","Genestealer Cults.json","Imperium - Adepta Sororitas.json","Imperium - Adeptus Custodes.json","Imperium - Adeptus Mechanicus.json","Imperium - Adeptus Titanicus.json","Imperium - Agents of the Imperium.json","Imperium - Astra Militarum - Library.json","Imperium - Astra Militarum.json","Imperium - Black Templars.json","Imperium - Blood Angels.json","Imperium - Dark Angels.json","Imperium - Deathwatch.json","Imperium - Grey Knights.json","Imperium - Imperial Fists.json","Imperium - Imperial Knights - Library.json","Imperium - Imperial Knights.json","Imperium - Iron Hands.json","Imperium - Raven Guard.json","Imperium - Salamanders.json","Imperium - Space Marines.json","Imperium - Space Wolves.json","Imperium - Ultramarines.json","Imperium - White Scars.json","Leagues of Votann.json","Necrons.json","Orks.json","T'au Empire.json","Tyranids.json","Unaligned Forces.json"];
const FACTION_ALIASES=[["ultramarines","Imperium - Space Marines.json","Imperium - Ultramarines.json"],["bloodangels","Imperium - Space Marines.json","Imperium - Blood Angels.json"],["darkangels","Imperium - Space Marines.json","Imperium - Dark Angels.json"],["blacktemplars","Imperium - Space Marines.json","Imperium - Black Templars.json"],["spacewolves","Imperium - Space Marines.json","Imperium - Space Wolves.json"],["deathwatch","Imperium - Space Marines.json","Imperium - Deathwatch.json"],["imperialfists","Imperium - Space Marines.json","Imperium - Imperial Fists.json"],["ironhands","Imperium - Space Marines.json","Imperium - Iron Hands.json"],["ravenguard","Imperium - Space Marines.json","Imperium - Raven Guard.json"],["salamanders","Imperium - Space Marines.json","Imperium - Salamanders.json"],["whitescars","Imperium - Space Marines.json","Imperium - White Scars.json"],["adeptusastartes","Imperium - Space Marines.json"],["spacemarines","Imperium - Space Marines.json"],["adeptasororitas","Imperium - Adepta Sororitas.json"],["adeptuscustodes","Imperium - Adeptus Custodes.json"],["adeptusmechanicus","Imperium - Adeptus Mechanicus.json"],["adeptustitanicus","Imperium - Adeptus Titanicus.json"],["astramilitarum","Imperium - Astra Militarum.json","Imperium - Astra Militarum - Library.json"],["imperialknights","Imperium - Imperial Knights.json","Imperium - Imperial Knights - Library.json"],["agents of the imperium","Imperium - Agents of the Imperium.json"],["imperialagents","Imperium - Agents of the Imperium.json"],["greeknights","Imperium - Grey Knights.json"],["chaosspacemarines","Chaos - Chaos Space Marines.json"],["chaosdaemons","Chaos - Chaos Daemons.json","Chaos - Chaos Daemons Library.json"],["chaosknights","Chaos - Chaos Knights.json","Chaos - Chaos Knights Library.json"],["emperorschildren","Chaos - Emperor's Children.json"],["deathguard","Chaos - Death Guard.json"],["thousandsons","Chaos - Thousand Sons.json"],["worldeaters","Chaos - World Eaters.json"],["titanicustraitoris","Chaos - Titanicus Traitoris.json"],["genestealercults","Genestealer Cults.json"],["leaguesofvotann","Leagues of Votann.json"],["craftworlds","Aeldari - Craftworlds.json","Aeldari - Aeldari Library.json"],["aeldari","Aeldari - Craftworlds.json","Aeldari - Aeldari Library.json"],["drukhari","Aeldari - Drukhari.json"],["tauempire","T'au Empire.json"],["necrons","Necrons.json"],["orks","Orks.json"],["tyranids","Tyranids.json"],["unalignedforces","Unaligned Forces.json"]];
const normalizeFactionAlias=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu,"");
const KOREAN_FACTION_ALIASES=new Map([
  ["티라니드","Tyranids"],["타이라니드","Tyranids"],["네크론","Necrons"],["오크","Orks"],["아엘다리","Aeldari"],["엘다","Aeldari"],["드루카리","Drukhari"],["다크 엘다","Drukhari"],["타우","T'au Empire"],["타우 제국","T'au Empire"],
  ["진스틸러 컬트","Genestealer Cults"],["진스틸러 컬츠","Genestealer Cults"],["카오스 데몬","Chaos Daemons"],["카오스 데몬즈","Chaos Daemons"],["카오스 나이트","Chaos Knights"],["카오스 스페이스 마린","Chaos Space Marines"],["데스 가드","Death Guard"],["황제의 아이들","Emperor's Children"],["사우전드 선즈","Thousand Sons"],["월드 이터","World Eaters"],
  ["아뎁타 소로리타스","Adepta Sororitas"],["시스터즈 오브 배틀","Adepta Sororitas"],["아뎁투스 쿠스토데스","Adeptus Custodes"],["쿠스토데스","Adeptus Custodes"],["아뎁투스 메카니쿠스","Adeptus Mechanicus"],["기계교","Adeptus Mechanicus"],["아스트라 밀리타룸","Astra Militarum"],["임페리얼 가드","Astra Militarum"],["임페리얼 나이트","Imperial Knights"],["그레이 나이트","Grey Knights"],["인류제국 요원","Agents of the Imperium"],
  ["스페이스 마린","Adeptus Astartes"],["울트라마린","Ultramarines"],["블러드 엔젤","Blood Angels"],["다크 엔젤","Dark Angels"],["블랙 템플러","Black Templars"],["스페이스 울프","Space Wolves"],["데스워치","Deathwatch"],["임페리얼 피스트","Imperial Fists"],["아이언 핸드","Iron Hands"],["레이븐 가드","Raven Guard"],["샐러맨더","Salamanders"],["화이트 스카","White Scars"],["그레이 나이트","Grey Knights"],
  ["리그 오브 보탄","Leagues of Votann"],["보탄","Leagues of Votann"],["언얼라인드 포스","Unaligned Forces"]
].map(([name,faction])=>[normalizeFactionAlias(name),faction]));
const STRATAGEM_DATA_URL="https://raw.githubusercontent.com/pguetschow/warhammer-40k-stratagem-card-generator/main/public/data/";
let db = {edition:"11판",source:"BSData 공개 저장소",sourceVersion:"자동 연결 대기",units:[]};
function readStoredCP(){try{return localStorage.getItem("40k-cp")||"0";}catch{return "0";}}
let activeCatalogueKey="";let catalogueLoadToken=0;let coreStratagems=[];let factionStratagemCount=0;const stratEdition="11";let stratContextKey="";let stratLoadToken=0;let cpValue=Math.max(0,Math.min(20,Number(readStoredCP())||0));
const sourceRuleDescriptions=new Map();
const sourceRuleDescriptionsById=new Map();
// Conservative fallback imported from the user-provided 40K issue workbook.
// Existing app glossary entries and approved feed translations take precedence.
const workbook40kTranslations=new Map((window.WH40K_WORKBOOK_GLOSSARY||[]).map(([source,translation])=>[source,translation]));
const v2LabelTranslations=new Map(),v2RuleTranslations=new Map();
const DEFAULT_TRANSLATION_FEED="https://script.google.com/macros/s/AKfycbyrM4W4xGOYMgp1MLeiotCNcM4f8HQ2EO0_dx54Y3M8W2G5RRjiX9-XjmKQTa8O45admA/exec";
let v2TranslationFeed=new URLSearchParams(location.search).get("translationFeed")||DEFAULT_TRANSLATION_FEED;
let currentRosterMeta={};
const $ = (id) => document.getElementById(id);
const norm = (s) => s.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
function indexRuleDescriptions(root){const stack=[root],seen=new WeakSet();while(stack.length){const value=stack.pop();if(!value||typeof value!=="object"||seen.has(value))continue;seen.add(value);if(!Array.isArray(value)&&value.name){const c=(value.characteristics||[]).find(x=>x.name==="Description");let description=c?.["$text"]??c?.text??value.description??value.ruleDescription;if(description&&typeof description==="object")description=description.$text??description.value??"";if(typeof description==="string"&&description.trim()){const clean=description.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();sourceRuleDescriptions.set(textKey(value.name),clean);if(value.id)sourceRuleDescriptionsById.set(value.id,clean);}}if(Array.isArray(value)){for(const item of value)stack.push(item);}else{for(const [key,item] of Object.entries(value))if(key!=="$schema"&&item&&typeof item==="object")stack.push(item);}}}
function sourceDescriptionFor(name){const key=textKey(name);if(sourceRuleDescriptions.has(key))return sourceRuleDescriptions.get(key);const compact=norm(name);for(const [ruleKey,description] of sourceRuleDescriptions)if(norm(ruleKey)===compact)return description;return "";}
function parseRoster(text) {
  const lines = text.replace(/\u00a0/g," ").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const units = [], meta = {};let currentUnit=null,attachedGroup="";
  const headerRules = [[/FACTION KEYWORD:\s*(.+)/i,"faction"],[/DETACHMENT:\s*(.+)/i,"detachment"],[/FORCE DISPOSITION:\s*(.+)/i,"disposition"],[/TOTAL ARMY POINTS:\s*(\d+)/i,"points"],[/NUMBER OF UNITS:\s*(\d+)/i,"unitCount"],[/WARLORD:\s*(.+)/i,"warlord"]];
  for (const line of lines) {
    const attachedGroupLine=line.match(/^(?:Attached Unit|합류 유닛|부착 유닛|부착 편성)\s*(\d+)$/i);if(attachedGroupLine){attachedGroup=attachedGroupLine[1];currentUnit=null;continue;}
    if(/^(?:CHARACTERS|BATTLELINE|OTHER DATASHEETS|DEDICATED TRANSPORTS|CHARACTER|전열|기타 데이터시트|전속 수송|캐릭터)$/i.test(line))attachedGroup="";
    const attachedToLine=line.match(/^Attached to\s+(.+)$/i);if(attachedToLine&&currentUnit){currentUnit.attachedTo=attachedToLine[1].trim();continue;}
    for (const [re,key] of headerRules) { const m=line.match(re); if(m) meta[key]=m[1].trim(); }
    const detachmentLine=line.match(/^(.+?)\s*\(\s*\d+\s*(?:디태치먼트\s*포인트|detachment\s*points?)\s*\)$/i);if(detachmentLine&&!meta.detachment)meta.detachment=detachmentLine[1].trim();
    const totalLine=line.match(/^\(\s*(\d+)\s*(?:포인트|points?|pts?)\s*\)$/i);if(totalLine&&!meta.points)meta.points=totalLine[1];
    const gameSizeLine=line.match(/^(.+?)\s*\(\s*(\d+)\s*(?:포인트|points?|pts?)\s*\)$/i);if(gameSizeLine&&/^(?:급습|대규모|incursion|strike\s*force|onslaught)$/i.test(gameSizeLine[1].trim()))meta.gameSize=Number(gameSizeLine[2]);
    if(/^(?:점령과 유지|take and hold)$/i.test(line))meta.mission=line;
    if(!meta.faction){const factionAlias=FACTION_ALIASES.find(([alias])=>norm(line)===norm(alias));if(factionAlias)meta.faction=line;else{const koreanFaction=KOREAN_FACTION_ALIASES.get(norm(line));if(koreanFaction)meta.faction=koreanFaction;else{const embeddedFaction=FACTION_ALIASES.find(([alias])=>norm(line).includes(norm(alias)));if(embeddedFaction)meta.faction=line;}}}
    const unitLine = line.replace(/^Char\d+:\s*/i, "");
    const armyTitleLine=/^\d+\s*(?:포전|포|points?|pts?)?\s*\(\s*\d+\s*(?:포인트|points?|pts?)\s*\)$/i.test(unitLine);
    if (!armyTitleLine&&/^(?:\d+x\s+)?[^•+\-].*\(\s*\d+\s*(?:포인트|points?|pts?)\s*\)/i.test(unitLine)&&!/^(?:급습|대규모|incursion|strike\s*force|onslaught)\s*\(/i.test(unitLine)&&!/\((?:사본|copy)\)/i.test(unitLine)) {
      const m=unitLine.match(/^(?:(\d+)x\s+)?(.+?)\s*\(\s*(\d+)\s*(?:포인트|points?|pts?)\s*\)\s*(?::\s*(.*))?$/i);
      if (m) {currentUnit={count:Number(m[1]||0),rosterName:m[2].trim(),points:Number(m[3]),equipment:m[4]||"",equipmentLines:[],modelCounts:[],sourceLine:line,attachedGroup,attachedAs:"",attachedTo:""};units.push(currentUnit);}
    } else if(currentUnit&&/^[•●▪*-]\s*/.test(line)) {
      const item=line.replace(/^[•●▪*-]\s*/,""),role=item.match(/^(?:Attached as|합류 방식)\s*:\s*(Leader|Bodyguard|Support|리더|경호원|지원)(?:\s|\(|$)/i);if(role){currentUnit.attachedAs=role[1];continue;}currentUnit.equipmentLines.push(item);const model=item.match(/^(\d+)x\s+(.+)$/i);if(model&&!/\b(?:claws?|talons?|bonesword|lash whip|weapon|launcher|cannon|salvo|limbs?|ovipositor|barbed|chitin|fists?|blade|sword|rending|stinger|venom|spear|flamer|pistol|rifle|bolter|grenade)\b|볼터|볼트|권총|체인소드|체인블레이드|명장제조|라스캐논|미사일|런처|피스트|블레이드|소드|플라즈마|라이플|소총|파이어블래스터|볼트건|근접무기/i.test(model[2]))currentUnit.modelCounts.push(Number(model[1]));
    }
  }
  for(const unit of units){if(!unit.count){const inferred=unit.modelCounts.reduce((sum,n)=>sum+n,0),fallback=Math.max(0,...unit.equipmentLines.map(x=>Number(x.match(/^(\d+)x\s+/i)?.[1]||0)));unit.count=inferred||fallback||1;}delete unit.modelCounts;}
  if(!meta.points&&units.length)meta.points=String(units.reduce((sum,unit)=>sum+unit.points,0));
  return {meta, units};
}
const sessionUnitMatches=new Map();
const UNIT_NAME_ALIASES={librarian:["라이브러리언","라이브러리안","사서"],"librarian in phobos armour":["라이브러리언 인 포보스 아머","포보스 아머 라이브러리언"],"librarian in terminator armour":["라이브러리언 인 터미네이터 아머","터미네이터 아머 라이브러리언"]};
function findDataUnit(rosterName) {
  if (!db?.units) return null;
  const savedId=sessionUnitMatches.get(unitMatchKey(rosterName)),saved=savedId&&db.units.find(u=>`${u.edition}::${u.id}`===savedId);if(saved)return {unit:saved,confidence:"직접 선택"};
  const needle=normalizeMatchName(rosterName);
  const namesFor=u=>Array.from(new Set([u.name,...(u.aliases||[]),u.nameKo,tr(u.name||""),translateTerms(u.name||""),...(UNIT_NAME_ALIASES[normalizeMatchName(u.name)]||[])].filter(Boolean)));
  let exact=db.units.find(u=>namesFor(u).some(n=>normalizeMatchName(n)===needle));
  if(exact)return {unit:exact,confidence:normalizeMatchName(exact.name)===needle?"일치":"한글 이름 일치"};
  const uniqueCandidates=new Map();for(const unit of db.units){const score=namesFor(unit).reduce((s,n)=>Math.max(s,matchNameScore(needle,normalizeMatchName(n))),0),key=`${unit.edition}|${unit.id}`,prior=uniqueCandidates.get(key);if(score>=.52&&(!prior||score>prior.score))uniqueCandidates.set(key,{unit,score});}const candidates=[...uniqueCandidates.values()].sort((a,b)=>b.score-a.score);
  // Fuzzy matching may suggest candidates, but only a very strong, clearly
  // separated result is auto-linked. This prevents plausible wrong datasheets.
  if(candidates.length===1&&candidates[0].score>=.94||candidates.length>1&&candidates[0].score>=.94&&candidates[0].score-candidates[1].score>=.14)return {unit:candidates[0].unit,confidence:"높은 이름 유사도"};
  return candidates.length?{candidates:candidates.slice(0,4)}:null;
}
function normalizeMatchName(value=""){
  let tokens=String(value).normalize("NFKC").toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  while(tokens.length>1&&["squad","unit","datasheet"].includes(tokens.at(-1)))tokens.pop();
  return tokens.join(" ");
}
function matchNameScore(a,b){
  if(!a||!b)return 0;
  const edit=similarityScore(a,b),prefix=commonScore(a,b);
  const ta=new Set(a.match(/[\p{L}\p{N}]+/gu)||[]),tb=new Set(b.match(/[\p{L}\p{N}]+/gu)||[]);
  const overlap=[...ta].filter(x=>tb.has(x)).length/Math.max(ta.size,tb.size,1);
  return Math.max(edit*.72+overlap*.28, prefix*.85+overlap*.15);
}
function commonScore(a,b){let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;return i/Math.max(a.length,b.length,1)}
function similarityScore(a,b){if(!a||!b)return 0;let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const row=[i];for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=row;}return 1-prev[b.length]/Math.max(a.length,b.length,1);}
function unitMatchKey(name){return `${db.edition}|${norm(currentRosterMeta.faction||"")}|${norm(name)}`;}
function renderUnitMatchControl(name){if(!db.units.length)return "";const selected=sessionUnitMatches.get(unitMatchKey(name))||"",options=db.units.map(u=>`<option value="${escapeHtml(`${u.edition}::${u.id}`)}" ${selected===`${u.edition}::${u.id}`?"selected":""}>${escapeHtml(`${tr(u.name)} (${u.name}) · ${u.edition}`)}</option>`).join("");return `<label class="unit-match-control">데이터시트 직접 선택<select data-unit-match="${escapeHtml(name)}"><option value="">자동 매칭 결과 사용</option>${options}</select><small>선택은 현재 편성 분석에만 적용되며 매칭 사전 파일은 만들지 않습니다.</small></label>`;}
function matchFailureDetails(meta){
  if(!meta.faction)return "로스터에서 진영명을 인식하지 못했습니다. 상단에 진영명을 포함해 주세요.";
  if(!db.units.length)return "진영 " + meta.faction + "은 인식했지만 카탈로그가 비어 있거나 연결 중입니다. " + ($("data-status")?.textContent||"");
  const editions=Array.from(new Set(db.units.map(u=>u.edition))).join(" · ");
  return "진영 " + meta.faction + "의 " + editions + " 카탈로그는 불러왔지만 이름이 일치하지 않습니다. 언어·별칭·판본 차이일 수 있습니다.";
}
function escapeHtml(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function tr(s=""){if(v2LabelTranslations.has(textKey(s)))return v2LabelTranslations.get(textKey(s));if(translations.has(s))return translations.get(s);if(abilityTranslations.has(s))return `${abilityTranslations.get(s)} (${s})`;if(profileTypeTranslations.has(s))return `${profileTypeTranslations.get(s)} (${s})`;return translateTerms(s);}
function textKey(s=""){return s.replace(/\u00a0/g," ").replace(/\s+/g," ").trim().toLowerCase();}
function ruleFeedKey(name,source){const clean=s=>String(s||"").replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();return `${textKey(clean(name))}|${textKey(clean(source))}`;}
function translateTerms(s=""){
  let out=s.replace(/\*\*\^\^([^\^]+)\^\^\*\*/g,"$1").replace(/\^\^([^\^]+)\^\^/g,"$1");
  const curatedKeys=new Set([...translations,...abilityTranslations,...termTranslations].map(([en])=>textKey(en)));
  const reviewedWorkbookTerms=[...workbook40kTranslations].filter(([en])=>!curatedKeys.has(textKey(en)));
  const pairs=[...new Map([...reviewedWorkbookTerms,...translations,...abilityTranslations,...termTranslations,...v2LabelTranslations]).entries()].sort((a,b)=>b[0].length-a[0].length);
  for(const [en,ko] of pairs)out=out.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),ko);
  return out;
}
function bilingualLabel(s=""){const ko=translateTerms(s);return ko!==s?`${ko} (${s})`:s;}
function translateRulesText(profileName,text=""){
  const key=textKey(profileName);
  const approvedV2=v2RuleTranslations.get(ruleFeedKey(profileName,text));if(approvedV2)return approvedV2;
  if(key==="leader"&&text.includes("VICTRIX HONOUR GUARD"))return "이 모델은 다음 유닛에 합류할 수 있습니다: 강습 인터세서 분대, 강습 분대, 블레이드가드 베테랑 분대, 커맨드 분대, 컴퍼니 히어로즈, 헬블래스터 분대, 인페르누스 분대, 인터세서 분대, 스턴가드 베테랑 분대, 뱅가드 베테랑 분대, 빅트릭스 의장대, 울트라마르의 수호자.";
  if(key==="support")return "이 모델은 다음 유닛에 합류할 수 있습니다: 강습 인터세서 분대, 강습 분대, 블레이드가드 베테랑 분대, 커맨드 분대, 컴퍼니 히어로즈, 크루세이더 분대, 데스워치 베테랑, 데키무스 킬팀, 포르티스 킬팀, 헬블래스터 분대, 인페르누스 분대, 이너 서클 컴패니언, 인터세서 분대, 스턴가드 베테랑 분대, 소드 브레스런 분대, 택티컬 분대, 뱅가드 베테랑 분대.";
  const exact=abilityTextTranslations.get(key);if(exact)return exact;
  const clean=text.replace(/\*\*\^\^([^\^]+)\^\^\*\*/g,"$1").replace(/\^\^([^\^]+)\^\^/g,"$1");return translateTerms(clean);
}
function keywordInfo(raw=""){
  const clean=raw.replace(/\*\*/g,"").replace(/[\[\]]/g,"").trim(),key=textKey(clean);
  const sustained=clean.match(/^sustained\s+hits\s*(\d+)$/i)||key.match(/^sustainedhits(\d+)$/i);
  if(sustained){const n=sustained[1];return {key:`sustained hits ${n}`,ko:`지속 명중 ${n}`,en:`Sustained Hits ${n}`,description:`치명 명중을 기록할 때마다 추가 명중 ${n}회를 얻습니다.`};}
  const korean=clean.match(/^지속\s*명중\s*(\d+)$/);
  if(korean){const n=korean[1];return {key:`sustained hits ${n}`,ko:`지속 명중 ${n}`,en:`Sustained Hits ${n}`,description:`치명 명중을 기록할 때마다 추가 명중 ${n}회를 얻습니다.`};}
  const fnp=clean.match(/^feel\s+no\s+pain\s*\(?\s*(\d+)\s*\+?\s*\)?$/i);
  if(fnp){const n=fnp[1];return {key:`feel no pain ${n}+`,ko:`고통 경감 ${n}+`,en:`Feel No Pain ${n}+`,description:`이 능력이 있는 모델이 운드를 잃을 때마다 D6을 굴립니다. ${n}+가 나오면 그 운드를 잃지 않습니다.`};}
  const scouts=clean.match(/^scouts\s*(\d+)\s*[”’\u201d\u2019\u2033\u2032\"]?$/i);
  if(scouts){const n=scouts[1];return {key:`scouts ${n}`,ko:`스카웃 ${n}인치`,en:`Scouts ${n}\"`,description:`모든 모델이 이 능력을 가진 유닛은 첫 턴 시작 전에 최대 ${n}인치 이동할 수 있습니다. 아군 수송차량에 탑승 중이면 차량이 대신 이동할 수 있습니다.`};}
  const anti=clean.match(/^anti[\s\-‐‑‒–—]*([a-z][a-z -]*?)\s*(\d+)\s*\+?$/i);
  if(anti){const target=anti[1].trim().replace(/\s+/g," "),n=anti[2],base=keyGlossary.get(`anti-${target.toLowerCase()}`),translatedTarget=translateTerms(target);return {key:`anti-${target.toLowerCase()} ${n}`,ko:`${base?.ko||`안티 ${translatedTarget}`} ${n}+`,en:`Anti-${target} ${n}+`,description:`대상 유닛에 ${target} 키워드가 있으면, 수정하지 않은 운드 굴림 ${n}+는 치명 운드로 간주됩니다.`};}
  for(const [k,v] of keyGlossary)if(key===textKey(k)||key===textKey(v.ko))return {key:k,...v};
  const rule=abilityTextTranslations.get(key);
  if(rule){const original=[...abilityTranslations.keys()].find(x=>textKey(x)===key)||clean;return {key:original,ko:abilityTranslations.get(original)||translateTerms(original),en:original,description:rule};}
  const sourceDescription=sourceDescriptionFor(clean);
  if(sourceDescription)return {key:clean,ko:v2LabelTranslations.get(textKey(clean))||translations.get(clean)||abilityTranslations.get(clean)||clean,en:clean,description:v2RuleTranslations.get(ruleFeedKey(clean,sourceDescription))||`공개 데이터 설명 (영문 원문): ${sourceDescription}`};
  return null;
}
function renderKeywordButton(raw){
  const info=keywordInfo(raw),translated=tr(raw),display=info?`${info.ko} (${info.en})`:translated!==raw?`${translated} (${raw})`:raw;
  return `<button type="button" class="keyword-chip" data-keyword="${escapeHtml(info?.key||raw)}">${escapeHtml(display)}</button>`;
}
function unitWoundMax(data,count){const wounds=(data.profiles||[]).flatMap(p=>p.characteristics||[]).find(x=>x.name==="W")?.value;const perModel=Number.parseInt(wounds,10);return Number.isFinite(perModel)&&perModel>0?perModel*Math.max(1,count):0;}
const woundState=new Map();
function currentWounds(key,max){if(!max)return 0;const value=woundState.has(key)?Math.min(woundState.get(key),max):max;woundState.set(key,value);return value;}
function renderUnitSummary(data){const aliases={M:["M","Move"],T:["T","Toughness"],Sv:["Sv","SV","Save"],W:["W","Wounds"],LD:["LD","Leadership"],OC:["OC","Objective Control"],InSv:["InSv","InvSv","Invulnerable Save"]};const p=(data.profiles||[]).find(x=>["unit","model"].includes((x.typeName||"").toLowerCase())&&(x.characteristics||[]).some(c=>Object.values(aliases).flat().includes(c.name)));if(!p)return "";const chars=p.characteristics||[],wanted=["M","T","Sv","W","LD","OC","InSv"].filter(k=>chars.some(c=>aliases[k].includes(c.name)));return `<div class="card-stat-summary"><span class="summary-label">유닛 능력치 (Unit characteristics)</span>${wanted.map(k=>{const c=chars.find(x=>aliases[k].includes(x.name)),ko=statTranslations.get(k)||k,english=c.name;return `<span class="stat-pill"><b>${escapeHtml(ko)} <span>(${escapeHtml(english)})</span></b><strong>${escapeHtml(c.value)}</strong></span>`}).join("")}</div>`;}
function ruleAppliesToRoster(){return true;}
const assistantPhases=["전투 전 > 배치","전투 > 지휘","전투 > 이동","전투 > 사격","전투 > 돌격","전투 > 타격","전투 > 전투 충격","전투 > 피격·운드 처리","전투 > 목표·종료","전투 > 추가 확인"];
const GAME_TRACKER_KEY="40k-game-tracker-v1";
function readGameTracker(){try{const value=JSON.parse(localStorage.getItem(GAME_TRACKER_KEY)||"{}");return {mission:value.mission||"",deployment:value.deployment||"",ownDisposition:value.ownDisposition||"",opponentDisposition:value.opponentDisposition||"",primary:value.primary||"",secondary:value.secondary||"",rounds:Array.from({length:5},(_,i)=>({us:Number(value.rounds?.[i]?.us)||0,them:Number(value.rounds?.[i]?.them)||0}))};}catch{return {mission:"",deployment:"",ownDisposition:"",opponentDisposition:"",primary:"",secondary:"",rounds:Array.from({length:5},()=>({us:0,them:0}))};}}
function writeGameTracker(state){try{localStorage.setItem(GAME_TRACKER_KEY,JSON.stringify(state));}catch{}}
function renderGameTracker(meta){const state=readGameTracker(),mission=state.mission||meta.mission||"",ownDisposition=state.ownDisposition||meta.disposition||"",usTotal=state.rounds.reduce((sum,r)=>sum+r.us,0),themTotal=state.rounds.reduce((sum,r)=>sum+r.them,0),field=(key,label,value,placeholder="")=>`<label class="game-field"><span>${label}</span><input type="text" data-game-field="${key}" value="${escapeHtml(value)}" placeholder="${placeholder}"></label>`;return `<section class="game-tracker" aria-label="미션 및 점수 기록"><div class="game-tracker-heading"><div><p class="eyebrow">BATTLE JOURNAL</p><h3>미션 · 라운드 점수</h3></div><button type="button" class="quiet" data-reset-game>새 게임</button></div><div class="game-mission-grid">${field("mission","미션",mission,"미션 이름 입력")}${field("deployment","배치",state.deployment,"배치 방식")}${field("ownDisposition","내 군대 전술",ownDisposition,"예: 점령과 유지")}${field("opponentDisposition","상대 전술",state.opponentDisposition,"상대 로스터에서 입력")}${field("primary","주요 임무",state.primary,"주요 임무 이름")}${field("secondary","보조 임무",state.secondary,"보조 임무 이름")}</div><div class="score-table-wrap"><table class="score-table"><thead><tr><th>라운드</th><th>내 점수</th><th>상대 점수</th></tr></thead><tbody>${state.rounds.map((round,i)=>`<tr><th>${i+1}라운드</th><td><input type="number" min="0" max="99" step="1" inputmode="numeric" data-round-score="${i}" data-player="us" value="${round.us}" aria-label="${i+1}라운드 내 점수"></td><td><input type="number" min="0" max="99" step="1" inputmode="numeric" data-round-score="${i}" data-player="them" value="${round.them}" aria-label="${i+1}라운드 상대 점수"></td></tr>`).join("")}<tr class="score-total"><th>합계</th><td data-score-total="us">${usTotal}</td><td data-score-total="them">${themTotal}</td></tr></tbody></table></div><p class="game-tracker-note">점수와 임무 이름은 이 브라우저에 저장됩니다. 양측 점수는 각 라운드 종료 시 합산 점수로 기록하세요.</p></section>`;}
function classifyAssistantRule(name,description,typeName=""){
  const n=norm(name),t=norm(description),type=norm(typeName);
  if(n.startsWith("scouts")||n==="infiltrators"||t.includes("beforethebattle")||t.includes("duringdeployment"))return "전투 전 > 배치";
  if(t.includes("commandphase"))return "전투 > 지휘";
  if(n.includes("advance")||t.includes("advance move")||t.includes("movementphase"))return "전투 > 이동";
  if(n.includes("charge")||t.includes("chargephase")||t.includes("chargemove")||t.includes("chargemovement"))return "전투 > 돌격";
  if(type.includes("rangedweapon")||type.includes("rangedweapons"))return "전투 > 사격";
  if(type.includes("meleeweapon")||type.includes("meleeweapons"))return "전투 > 타격";
  if(n.includes("battle-shock")||n.includes("battleshock")||t.includes("battleshockphase")||t.includes("battleshocktest"))return "전투 > 전투 충격";
  if(n.includes("feel no pain")||n.includes("invulnerable")||t.includes("destroyed")||t.includes("losesawound")||t.includes("woundisallocated")||t.includes("savingthrow"))return "전투 > 피격·운드 처리";
  if(t.includes("fightphase")||t.includes("fightfirst")||t.includes("fightlast"))return "전투 > 타격";
  if(t.includes("shootingphase")||t.includes("makesashootingattack"))return "전투 > 사격";
  if(n.includes("objective")||t.includes("endofyourturn"))return "전투 > 목표·종료";
  return "전투 > 추가 확인";
}
function phasesForStratagem(stratagem){const phases=Array.isArray(stratagem.phases)?stratagem.phases:[stratagem.phases||""];const timing=norm(`${phases.join(" ")} ${stratagem.when||""} ${stratagem.restrictions||""}`),matches=[];for(const [token,phase] of [["command","전투 > 지휘"],["movement","전투 > 이동"],["shooting","전투 > 사격"],["charge","전투 > 돌격"],["fight","전투 > 타격"],["battleshock","전투 > 전투 충격"]])if(timing.includes(token)&&!matches.includes(phase))matches.push(phase);return matches.length?matches:["전투 > 추가 확인"];}
function makeAssistantTasks(parsed){
  const tasks=[];
  const add=(phase,unit,label,detail,source)=>tasks.push({phase,unit,label,detail,source,id:norm(`${phase}|${unit}|${label}|${source}`)});
  for(const [rosterIndex,rosterUnit] of parsed.units.entries()){
    const found=findDataUnit(rosterUnit.rosterName);if(!found||!found.unit)continue;const d=found.unit,baseUnit=tr(d.name),sameName=parsed.units.filter(x=>norm(x.rosterName)===norm(rosterUnit.rosterName)),copyNumber=parsed.units.slice(0,rosterIndex+1).filter(x=>norm(x.rosterName)===norm(rosterUnit.rosterName)).length,unit=sameName.length>1?`${baseUnit} ${copyNumber}`:baseUnit;
    for(const p of d.profiles||[]){
      const chars=p.characteristics||[],desc=chars.find(x=>x.name==="Description")?.value||"",type=p.typeName||"",isWeapon=/weapon/i.test(type),isAbility=/abilit/i.test(type)||Boolean(desc);
      if(isWeapon){const kws=chars.find(x=>x.name==="Keywords")?.value||"",terms=kws.split(/,\s*/).filter(Boolean);if(terms.length)add(classifyAssistantRule(p.name,kws,type),unit,`${profileDisplayName(p)} · ${terms.join(" · ")}`,"공격 전에 사거리·대상·무기 키워드 조건을 확인하세요.",terms.join("|"));}
      else if(isAbility){const phase=classifyAssistantRule(p.name,desc,type),translated=translateRulesText(p.name,desc);add(phase,unit,profileDisplayName(p),translated||"발동 시점과 조건을 원문에서 확인하세요.",p.name);}
      else if(type.toLowerCase().includes("unit")||type.toLowerCase().includes("model")){const kws=chars.find(x=>x.name==="Keywords")?.value||"";for(const kw of kws.split(/,\s*/).filter(x=>/scouts|infiltrators|deep strike|feel no pain|invulnerable/i.test(x)))add(classifyAssistantRule(kw,kw),unit,kw,keywordInfo(kw)?.description||"이 키워드의 배치 또는 방어 조건을 확인하세요.",kw);}
    }
    for(const ability of d.abilities||[]){const name=ability.name||ability.baseName||"규칙",description=ability.description||sourceDescriptionFor(name);add(classifyAssistantRule(name,description),unit,profileDisplayName({name,typeName:"Abilities"}),description?translateRulesText(name,description):"관련 규칙 원문을 확인하세요. 발동 시점 또는 조건이 로스터 데이터에 명시되지 않았습니다.",name);}
  }
  const dedup=new Map();for(const task of tasks)dedup.set(task.id,task);return [...dedup.values()];
}
function assistantChecked(id){try{return localStorage.getItem(`40k-assistant:${id}`)==="1";}catch{return false;}}
function coreStratagemMarkup(stratNameKo={}){
  const clean=s=>(s||"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim(),groups=new Map();
  for(const stratagem of coreStratagems)for(const phase of phasesForStratagem(stratagem)){if(!groups.has(phase))groups.set(phase,[]);groups.get(phase).push(stratagem);}
  const sections=[...groups].map(([phase,items])=>`<details class="stratagem-phase"><summary>${escapeHtml(phase)} <span>${items.length}</span></summary><div class="stratagem-list">${items.map(s=>{const id=`assistant-stratagem-${stratEdition}-${s.id||norm(s.name)}`,checked=assistantChecked(id),when=translateRulesText("",clean(s.when)),target=translateRulesText("",clean(s.target)),effect=translateRulesText("",clean(s.effect)),restrictions=translateRulesText("",clean(s.restrictions));return `<article class="stratagem-card"><div><strong>${escapeHtml(stratNameKo[s.name]||translateTerms(s.name))} <span>(${escapeHtml(s.name)})</span></strong><b>${escapeHtml(s.cp)} CP</b></div>${when?`<p><b>시점</b> ${escapeHtml(when)}</p>`:""}${target?`<p><b>대상</b> ${escapeHtml(target)}</p>`:""}${effect?`<p><b>효과</b> ${escapeHtml(effect)}</p>`:""}${restrictions?`<small>제한: ${escapeHtml(restrictions)}</small>`:""}<button type="button" class="quiet stratagem-spend" data-spend-cp="${escapeHtml(s.cp)}" data-stratagem-check="${escapeHtml(id)}" ${checked?"disabled":""}>${checked?"사용 완료":"CP 사용"}</button></article>`}).join("")}</div></details>`).join("");
  return `<details class="stratagem-library"><summary>스트라타젬 관리 <span>${coreStratagems.length?`${coreStratagems.length}개 로드`:`불러오는 중`}</span></summary><div class="stratagem-toolbar"><span>규칙 판본 11판</span><span>진영/편제 스트라타젬 ${factionStratagemCount}개</span><small>사용 가능한 전투 단계별로 묶었습니다. CP를 차감하면 사용 완료로 표시됩니다.</small></div>${sections||`<p class="phase-empty">스트라타젬 데이터가 아직 연결되지 않았습니다.</p>`}</details>`;
}
function renderAssistantPage(parsed){
  const tasks=makeAssistantTasks(parsed),stratNameKo={"COMMAND RE-ROLL":"지휘 재굴림","EPIC CHALLENGE":"에픽 결투","INSANE BRAVERY":"불굴의 용기","EXPLOSIVES":"폭발물","CRUSHING IMPACT":"분쇄 충격","RAPID INGRESS":"신속 투입","FIRE OVERWATCH":"경계 사격","SMOKESCREEN":"연막","HEROIC INTERVENTION":"영웅적 개입","COUNTEROFFENSIVE":"역습"};
  const groups=assistantPhases.map(phase=>[phase,tasks.filter(x=>x.phase===phase)]);
  const initialPhaseIndex=Math.max(0,groups.findIndex(([,items])=>items.length));
  const emptyState=!parsed.units.length?"편성표를 분석하면 로스터별 체크 항목이 여기에 표시됩니다.":!db.units.length?$("data-status")?.textContent||"진영 데이터 연결을 기다리는 중입니다.":tasks.length?"":"로스터의 데이터시트에서 자동으로 분류할 체크 항목을 찾지 못했습니다."
  const tabs=groups.map(([phase],i)=>`<button type="button" class="phase-tab ${i===initialPhaseIndex?"active":""}" data-phase="${escapeHtml(phase)}">${escapeHtml(phase)} <span>${tasks.filter(x=>x.phase===phase).length}</span></button>`).join("");
  const panels=groups.map(([phase,items],i)=>`<section class="phase-panel" data-phase-panel="${escapeHtml(phase)}" ${i!==initialPhaseIndex?"hidden":""}><h3>${escapeHtml(phase)}</h3>${items.length?`<div class="assistant-list">${items.map((x,j)=>`<div class="check-row ${assistantChecked(x.id)?"checked":""}"><input id="assistant-${escapeHtml(x.id)}-${i}-${j}" type="checkbox" data-assistant-check="${escapeHtml(x.id)}" ${assistantChecked(x.id)?"checked":""}><label class="check-copy" for="assistant-${escapeHtml(x.id)}-${i}-${j}"><b>${escapeHtml(x.unit)} <i>›</i> ${escapeHtml(x.label)}</b><small>${escapeHtml(x.detail)}</small></label><span class="assistant-rules">${x.spendCp!==undefined?`<button type="button" class="quiet stratagem-spend" data-spend-cp="${x.spendCp}" data-stratagem-check="assistant-${escapeHtml(x.id)}" ${assistantChecked(x.id)?"disabled":""}>${assistantChecked(x.id)?"사용 완료":"CP 사용"}</button>`:x.source.split("|").filter(Boolean).map(s=>renderKeywordButton(s)).join(" ")}</span></div>`).join("")}</div>`:`<p class="phase-empty">이 단계에 자동으로 분류된 체크 항목이 없습니다.</p>`}</section>`).join("");
  return `<div class="assistant-heading"><div class="assistant-intro"><p class="eyebrow">ROSTER AWARE</p><h2>전투 보조 체크리스트</h2><p>전투 단계별 로스터 확인은 탭에서, 스트라타젬은 상단 보관함에서 관리합니다.</p></div><button type="button" class="quiet" data-reset-assistant>체크 초기화</button></div><section class="cp-tracker"><strong>CP</strong><button type="button" class="wound-button" data-cp="minus" aria-label="CP 감소">−</button><output id="cp-value">${cpValue}</output><button type="button" class="wound-button" data-cp="plus" aria-label="CP 증가">+</button><small>현재 CP를 직접 추적합니다 · 브라우저 저장</small></section>${renderGameTracker(parsed.meta)}${coreStratagemMarkup(stratNameKo)}${emptyState?`<p class="empty">${escapeHtml(emptyState)}</p>`:""}<nav class="phase-tabs" aria-label="전투 단계">${tabs}</nav>${panels}<p class="assistant-footnote">능력 문구가 데이터에서 누락되었거나 판본이 다른 경우, 해당 데이터시트 원문과 실제 게임 판본을 기준으로 확인하세요. 체크 상태는 이 브라우저에 저장됩니다.</p>`;
}
function richText(text=""){
  return escapeHtml(text).replace(/\[([^\]]+)\]/g,(_,term)=>renderKeywordButton(term));
}
function weaponName(name=""){
  const known=[...termTranslations,...translations].find(([english])=>textKey(english)===textKey(name))?.[1];if(known)return `${known} (${name})`;
  const parts=name.split(/(\s+)/),converted=[];let complete=true;
  for(const part of parts){if(!part||/^\s+$/.test(part)){converted.push(part);continue;}const key=part.replace(/[^a-z-]/gi,"").toLowerCase(),translated=phoneticWords.get(key);if(!translated&&/[a-z]/i.test(part))complete=false;converted.push(translated?part.replace(/[a-z-]+/i,translated):part);}
  const phonetic=converted.join("");return complete&&phonetic!==name?`${phonetic} (${name})`:name;
}
function profileDisplayName(p){
  const type=(p.typeName||"").toLowerCase();
  const v2Name=v2LabelTranslations.get(textKey(p.name||""));if(v2Name)return `${v2Name} (${p.name})`;
  if(type.includes("weapon"))return weaponName(p.name||"");
  const ability=abilityTranslations.get(p.name);if(ability)return `${ability} (${p.name})`;
  if(translations.has(p.name))return `${translations.get(p.name)} (${p.name})`;
  const translated=translateTerms(p.name||"");if(translated!==(p.name||""))return `${translated} (${p.name})`;
  return p.name||p.typeName||"프로필";
}
function adaptBsData(raw,edition="11판",file="",relatedRaw=[]){
  const c=raw.catalogue||raw,related=relatedRaw.map(x=>x.catalogue||x);indexRuleDescriptions(c);for(const catalogue of related)indexRuleDescriptions(catalogue);const entries=c.sharedSelectionEntries||[], groups=c.sharedSelectionEntryGroups||[], byId=new Map([...related.flatMap(x=>[...(x.sharedSelectionEntries||[]),...(x.sharedSelectionEntryGroups||[])]),...entries,...groups].map(x=>[x.id,x]));
  const units=entries.filter(e=>["unit","model"].includes(e.type)).map(e=>{
    const profiles=[], seen=new Set();
    const walk=(x,depth=0)=>{if(!x||depth>10||seen.has(x.id)||/crusade|battle honours?|reclaimed relic/i.test(x.name||""))return;if(x.id)seen.add(x.id);for(const p of x.profiles||[])profiles.push(p);for(const k of ["selectionEntries","selectionEntryGroups","entryLinks"]){for(const child of x[k]||[]){if(/crusade|battle honours?|reclaimed relic|enhancement/i.test(child.name||""))continue;const target=child.targetId?byId.get(child.targetId):child;if(target)walk(target,depth+1);}}};
    walk(e);
    const profileKey=p=>`${textKey(p.typeName||"")}|${textKey(p.name||"")}|${(p.characteristics||[]).map(x=>`${textKey(x.name)}=${String(x["$text"]??x.text??"").trim().toLowerCase().replace(/\s+/g," ")}`).sort().join("|")}`;
    // Linked BSData selections can include the same unit/model profile several
    // times through different loadout branches. Keep one row per profile name
    // and type; weapon profiles have their own names and remain distinct.
    const unique=Array.from(new Map(profiles.map(p=>[`${textKey(p.typeName||"")}|${textKey(p.name||"")}`,p])).values());
    const abilities=(e.infoLinks||[]).map(link=>{let name=link.name||"";for(const modifier of link.modifiers||[])if(modifier.field==="name"){if(modifier.type==="append")name+=modifier.value;else if(modifier.type==="prepend")name=modifier.value+name;else if(modifier.type==="set")name=String(modifier.value);}const description=sourceRuleDescriptionsById.get(link.targetId)||sourceDescriptionFor(name)||sourceDescriptionFor(link.name||"");if(description)sourceRuleDescriptions.set(textKey(name),description);return {name,baseName:link.name||name,targetId:link.targetId,type:link.type||"rule",description};});
    return {id:e.id,name:e.name,edition,sourceFile:file,aliases:[],points:(e.costs||[]).find(x=>x.name==="pts")?.value||null,profiles:unique.map(p=>({id:p.id,name:p.name,typeName:p.typeName||"프로필",characteristics:(p.characteristics||[]).map(x=>({name:x.name,value:x["$text"]??x.text??""}))})),abilities:Array.from(new Map(abilities.map(x=>[textKey(x.name),x])).values()),keywords:[...new Map((e.categoryLinks||[]).map(x=>[textKey(x.name),x.name])).values()],translationStatus:"한글 용어 적용",note:"규칙 설명은 BSData의 sharedRules/sharedProfiles 색인에서 연결합니다. 공통 수치형 키워드는 규칙 패턴으로 처리합니다."};
  });
  return {edition,source:`BSData · ${file}`,sourceVersion:`저장소 revision ${c.revision??"현재"}`,units};
}
function catalogueFilesForFaction(faction=""){
  const key=norm(faction),matched=FACTION_ALIASES.find(([alias])=>key.includes(norm(alias)));
  if(/티라니드|타이라니드/.test(faction))return ["Tyranids.json"];
  if(matched)return matched.slice(1);
  const fallback=CATALOGUE_FILES.find(file=>key.includes(norm(file.replace(/\.json$/i,"").replace(/^(Imperium|Chaos|Aeldari)\s*-\s*/i,""))));
  return fallback?[fallback]:[];
}
async function loadRulesData(meta=parseRoster($("roster").value).meta){
  const files=catalogueFilesForFaction(meta.faction||"");const status=$("data-status");
  if(!files.length){catalogueLoadToken++;activeCatalogueKey="";sourceRuleDescriptions.clear();sourceRuleDescriptionsById.clear();db={edition:"11판",source:"BSData 공개 저장소",sourceVersion:"진영 미확인",units:[]};status.textContent=`진영 데이터 파일을 특정하지 못했습니다: ${meta.faction||"진영 정보 없음"}. 로스터의 팩션명을 확인해 주세요.`;status.className="data-status error";render();return;}
  const key=files.join("|");if(key===activeCatalogueKey)return;activeCatalogueKey=key;const requestToken=++catalogueLoadToken;db={edition:"11판",source:`BSData · ${files.map(x=>x.replace(/\.json$/i,"")).join(" + ")}`,sourceVersion:"불러오는 중",units:[]};status.textContent="11판 BSData 카탈로그를 불러오는 중…";status.className="data-status";render();
  const mirror=url=>url.replace("https://raw.githubusercontent.com/BSData/wh40k-11e/main/","https://cdn.jsdelivr.net/gh/BSData/wh40k-11e@main/");let primary=[],primaryErrors=[];
  for(const useMirror of [false,true]){const result=await Promise.all(files.map(async file=>{try{const url=BSDATA_BASE+encodeURIComponent(file),response=await fetch(useMirror?mirror(url):url,{cache:"no-cache"});if(!response.ok)throw new Error(`${file}: HTTP ${response.status}`);return {file,raw:await response.json()};}catch(error){return {file,error};}}));if(requestToken!==catalogueLoadToken)return;primary=result.filter(x=>x.raw);primaryErrors=result.filter(x=>x.error);if(primary.length)break;}
  if(requestToken!==catalogueLoadToken)return;
  if(!primary.length){activeCatalogueKey="";const issue=primaryErrors[0]?.error;db={edition:"11판",source:"BSData 공개 저장소",sourceVersion:"연결 실패",units:[]};status.textContent=`11판 진영 데이터 연결 실패 (${issue?.message||"카탈로그를 찾지 못했습니다"}).`;status.className="data-status error";render();return;}
  sourceRuleDescriptions.clear();sourceRuleDescriptionsById.clear();const primaryRaw=primary.map(x=>x.raw),adapted=primary.map(x=>adaptBsData(x.raw,"11판",x.file,primaryRaw)),allUnits=adapted.flatMap(x=>x.units);db={edition:"11판",source:`BSData · ${files.map(x=>x.replace(/\.json$/i,"")).join(" + ")}`,sourceVersion:`11판 ${primary.length}/${files.length} 카탈로그`,units:Array.from(new Map(allUnits.map(u=>[`${u.edition}|${u.id}`,u])).values())};
  status.textContent=`연결됨 · 11판: ${allUnits.length}개 데이터시트`;status.className="data-status ready";render();
}
function canonicalStratFaction(meta){const f=norm(meta.faction||"");if(/ultramarines|bloodangels|darkangels|blacktemplars|spacewolves|deathwatch|imperialfists|ironhands|ravenguard|salamanders|whitescars|adeptusastartes|spacemarines/.test(f))return "Space Marines";if(/craftworlds|asuryani|aeldari/.test(f))return "Aeldari";if(/chaosdaemons|daemons/.test(f))return "Chaos Daemons";if(/agentsoftheimperium/.test(f))return "Imperial Agents";return (meta.faction||"").split(" - ").filter(Boolean).at(-1)||"";}
async function loadCoreStratagems(){const edition="11";const requestToken=++stratLoadToken;coreStratagems=[];factionStratagemCount=0;try{const r=await fetch(`${STRATAGEM_DATA_URL}${edition}/cards.json`);if(requestToken!==stratLoadToken)return;if(!r.ok)throw new Error(String(r.status));const data=await r.json(),all=[];for(const [key,value] of Object.entries(data.factions||{}))if(norm(key)==="core"||norm(value.name||"").includes("core rules"))for(const items of Object.values(value.detachments||{}))all.push(...(items||[]));const canonical=norm(canonicalStratFaction(currentRosterMeta)),rawDet=currentRosterMeta.detachment||"",det=norm(rawDet.match(/\(([^)]+)\)/)?.[1]||rawDet),detNames=[det];for(const [factionKey,factionData] of Object.entries(data.factions||{})){if(norm(factionKey)==="core"||norm(factionData.name||"").includes("core rules"))continue;const factionNorm=norm(factionData.name||factionKey),factionMatch=canonical&&(factionNorm.includes(canonical)||canonical.includes(factionNorm));if(!factionMatch)continue;for(const [detachment,items] of Object.entries(factionData.detachments||{})){const detKey=norm(detachment);if(detKey==="none"||detNames.some(name=>name&&(name.includes(detKey)||detKey.includes(name)))){factionStratagemCount+=(items||[]).length;all.push(...(items||[]));}}}if(requestToken!==stratLoadToken)return;coreStratagems=Array.from(new Map(all.filter(x=>!x.noCp&&x.name).map(x=>[`${norm(x.name)}|${x.cp}`,x])).values());if($("assistant-page"))render();}catch{if(requestToken!==stratLoadToken)return;coreStratagems=[];factionStratagemCount=0;if($("assistant-page"))render();}}
function loadV2TranslationFeed(){
  const button=$("load-translations"),status=$("translation-feed-status");
  if(!v2TranslationFeed){if(status){status.textContent="번역 피드 주소를 입력하면 승인된 번역을 불러와 편성표에 적용합니다.";status.className="translation-feed-status";}return;}
  if(button){button.disabled=true;button.textContent="번역 불러오는 중…";}
  if(status){status.textContent="Google Sheets에서 승인된 번역을 불러오는 중…";status.className="translation-feed-status";}
  let feedUrl;try{feedUrl=new URL(v2TranslationFeed);if(feedUrl.protocol!=="https:"||feedUrl.hostname!=="script.google.com"&&feedUrl.hostname!=="script.googleusercontent.com")throw new Error("Google Apps Script HTTPS 웹 앱 주소를 확인하세요.");}catch(err){finishError(err.message||"주소 형식이 올바르지 않습니다.");return;}
  const callback=`v2Translation_${Date.now()}_${Math.floor(Math.random()*1e6)}`,script=document.createElement("script");feedUrl.searchParams.set("callback",callback);
  const cleanup=()=>{delete window[callback];script.remove();if(button){button.disabled=false;button.textContent="번역 불러오기 · 적용";}};
  const timer=setTimeout(()=>finishError("응답 시간이 초과됐습니다. 배포 URL과 웹 앱 액세스 설정을 확인하세요."),20000);
  function finishError(message){clearTimeout(timer);cleanup();if(status){status.textContent=`번역 피드를 불러오지 못했습니다. ${message}`;status.className="translation-feed-status error";}}
  window[callback]=payload=>{clearTimeout(timer);if(!payload||!Array.isArray(payload.translations)){finishError("피드 응답 형식이 예상과 다릅니다.");return;}v2LabelTranslations.clear();v2RuleTranslations.clear();for(const item of payload.translations){if(item.kind==="label"&&item.name&&item.translation)v2LabelTranslations.set(textKey(item.name),item.translation);else if(item.name&&item.source&&item.translation)v2RuleTranslations.set(ruleFeedKey(item.name,item.source),item.translation);}cleanup();if(status){status.textContent=`Google Sheets · 승인 번역 ${payload.translations.length}개 불러와 적용 완료`;status.className="translation-feed-status ready";}render();};
  script.onerror=()=>finishError("웹 앱에서 익명 접근을 허용하는지 확인하세요.");script.src=feedUrl.toString();document.head.appendChild(script);
}
function renderProfiles(profiles,modelCount=1){
  if(!profiles?.length)return "<p class=\"meta\">이 항목에 표시할 프로필이 없습니다.</p>";
  return `<div class="profile-list">${profiles.map(p=>{const chars=p.characteristics||[],description=chars.find(x=>x.name==="Description")?.value;const isAbility=(p.typeName||"").toLowerCase().includes("abilit")||Boolean(description);if(isAbility)return `<section class="ability-block"><h4 class="profile-title">${escapeHtml(profileDisplayName(p))}</h4><p class="ability-text">${richText(translateRulesText(p.name,description||""))}</p></section>`;const isWeapon=/weapon/i.test(p.typeName||"");return `<section class="profile-block"><h4 class="profile-title">${escapeHtml(profileDisplayName(p))}${p.typeName&&p.typeName!==p.name?` <span class="original">· ${escapeHtml(tr(p.typeName))}</span>`:""}</h4>${chars.length?`<table class="profile-table"><thead><tr><th>항목</th>${chars.map(x=>`<th>${escapeHtml(statTranslations.get(x.name)||tr(x.name))}</th>`).join("")}</tr></thead><tbody><tr><td>${escapeHtml(profileDisplayName(p))}</td>${chars.map(x=>x.name==="Keywords"?`<td>${x.value.split(/,\s*/).filter(Boolean).map(renderKeywordButton).join(" ")}</td>`:`<td${isWeapon&&x.name==="A"?` title="모든 편성 개체가 이 무기를 장비한 경우의 공격 횟수입니다. 일부 모델만 장비하면 실제 횟수는 줄어듭니다.">`: `>`}${escapeHtml(translateTerms(x.value))}${isWeapon&&x.name==="A"?` <small class="attack-count-multiplier">× ${escapeHtml(String(modelCount))}개체</small>`:""}</td>`).join("")}</tr></tbody></table>`:"<p class=\"meta\">상세 프로필이 없습니다.</p>"}</section>`}).join("")}</div>`;
}
const commonsImageRecords=new Map(),commonsImageLoads=new Map();let commonsImageQueue=Promise.resolve();
function enqueueUnitImage(section){commonsImageQueue=commonsImageQueue.then(async()=>{if(!section?.isConnected)return;await loadUnitImage(section);});}
function unitImageKey(unit){return `40k-unit-image:${unit.edition}:${unit.id}`;}
function readUnitImage(unit){try{return JSON.parse(localStorage.getItem(unitImageKey(unit))||"null");}catch{return null;}}
function renderUnitHeaderImage(unit){const record=readUnitImage(unit);return record?`<img class="unit-head-image" src="${escapeHtml(record.thumbUrl||record.imageUrl)}" alt="${escapeHtml(unit.name)} 대표 이미지" loading="lazy">`:"";}
function safeHttpsUrl(value,hosts){try{const url=new URL(value);return url.protocol==="https:"&&hosts.includes(url.hostname)?url.href:"";}catch{return "";}}
function metadataText(value=""){return String(value).replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/\s+/g," ").trim();}
function reusableCommonsLicense(shortName=""){return /^(?:CC0(?:\b)|Public domain\b|CC BY(?:-SA)?(?:\s|$))/i.test(String(shortName).trim());}
function renderUnitImagePreview(record,name){return `<figure class="unit-image-preview"><a href="${escapeHtml(record.sourceUrl)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(record.thumbUrl||record.imageUrl)}" alt="${escapeHtml(name)} 대표 이미지" loading="lazy"></a><figcaption><a href="${escapeHtml(record.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(record.fileName||"Wikimedia Commons 이미지")}</a><span>${escapeHtml(record.artist||"저작자 표기 없음")} · ${escapeHtml(record.license)}</span><a href="${escapeHtml(record.licenseUrl||record.sourceUrl)}" target="_blank" rel="noreferrer">이미지 출처</a></figcaption></figure>`;}
function renderUnitImageSection(unit,index){
  const key=unitImageKey(unit),record=readUnitImage(unit),encodedKey=escapeHtml(encodeURIComponent(key)),cached=commonsImageRecords.get(key);
  const content=record?renderUnitImagePreview(record,unit.name):cached?cached.record?renderUnitImagePreview(cached.record,unit.name):'<p class="unit-image-empty">표시할 대표 이미지가 없습니다.</p>':'<p class="unit-image-empty" data-image-status>대표 이미지를 불러오는 중…</p>';
  return `<section class="unit-image" data-unit-image="${encodedKey}" data-unit-index="${index}"><div class="unit-image-heading"><h4>유닛 대표 이미지</h4></div><div data-image-content>${content}</div></section>`;
}
async function loadUnitImage(section){
  let key;try{key=decodeURIComponent(section?.dataset.unitImage||"");}catch{return;}if(!section||!key)return;const content=section.querySelector("[data-image-content]");if(!content)return;
  let saved=null;try{saved=JSON.parse(localStorage.getItem(key)||"null");}catch{}const name=section.closest(".card")?.querySelector(".original")?.textContent.split(" · ")[0]||"유닛";if(saved){content.innerHTML=renderUnitImagePreview(saved,name);return;}
  if(commonsImageRecords.has(key)){const cached=commonsImageRecords.get(key);content.innerHTML=cached.record?renderUnitImagePreview(cached.record,name):'<p class="unit-image-empty">표시할 대표 이미지가 없습니다.</p>';return;}if(commonsImageLoads.has(key))return;
  const load=(async()=>{try{const queryName=section.closest(".card")?.querySelector(".original")?.textContent.split(" · ")[0]||name,queries=[`"${queryName}" Warhammer 40k`,`${queryName} Warhammer`,queryName],pages=new Map();for(const query of queries){const api=new URL("https://commons.wikimedia.org/w/api.php");for(const [param,value] of Object.entries({action:"query",generator:"search",gsrsearch:query,gsrnamespace:"6",gsrlimit:"10",prop:"imageinfo",iiprop:"url|extmetadata",iiurlwidth:"720",format:"json",origin:"*"}))api.searchParams.set(param,value);const response=await fetch(api);if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();for(const page of Object.values(data.query?.pages||{}))pages.set(page.pageid,page);if(Array.from(pages.values()).some(page=>reusableCommonsLicense(metadataText(page.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value||""))))break;}const candidates=Array.from(pages.values()).map(page=>{const info=page.imageinfo?.[0],meta=info?.extmetadata||{},license=metadataText(meta.LicenseShortName?.value||"");if(!info||!reusableCommonsLicense(license))return null;const imageUrl=safeHttpsUrl(info.url,["upload.wikimedia.org"]),thumbUrl=safeHttpsUrl(info.thumburl||info.url,["upload.wikimedia.org"]),sourceUrl=safeHttpsUrl(page.fullurl,["commons.wikimedia.org"]),licenseUrl=safeHttpsUrl(meta.LicenseUrl?.value||"",["creativecommons.org","commons.wikimedia.org"]);if(!imageUrl||!thumbUrl||!sourceUrl)return null;return {fileName:page.title.replace(/^File:/,""),imageUrl,thumbUrl,sourceUrl,artist:metadataText(meta.Artist?.value||meta.Credit?.value||""),license,licenseUrl};}).filter(Boolean),record=candidates[0]||null;commonsImageRecords.set(key,{record});if(record)try{localStorage.setItem(key,JSON.stringify(record));}catch{}const current=document.querySelector(`[data-unit-image="${CSS.escape(encodeURIComponent(key))}"]`),target=current?.querySelector("[data-image-content]");if(target)target.innerHTML=record?renderUnitImagePreview(record,queryName):'<p class="unit-image-empty">Commons에서 사용 가능한 대표 이미지를 찾지 못했습니다.</p>';if(record){const head=current?.closest(".card")?.querySelector(".card-head");if(head&&!head.querySelector(".unit-head-image")){const image=document.createElement("img");image.className="unit-head-image";image.src=record.thumbUrl;image.alt=`${queryName} 대표 이미지`;image.loading="lazy";head.querySelector(".card-title")?.prepend(image);}}}catch(error){commonsImageRecords.set(key,{record:null});const target=section.querySelector("[data-image-content]");if(target)target.innerHTML='<p class="unit-image-empty">이미지 제공처 연결 실패 · 페이지를 새로고침해 다시 시도할 수 있습니다.</p>';console.warn("Unit image load failed",error);}finally{commonsImageLoads.delete(key);}})();commonsImageLoads.set(key,load);await load;
}
function updateUnitQuickNav(parsed){
  const nav=$("unit-quick-nav"),list=$("unit-quick-nav-list");list.replaceChildren();
  if(!parsed.units.length){nav.hidden=true;return;}
  const roleLabels={Leader:"리더",Bodyguard:"경호원",Support:"지원",리더:"리더",경호원:"경호원",지원:"지원"},parentByChild=new Map(),leadersByGroup=new Map();
  parsed.units.forEach((unit,index)=>{if(unit.attachedGroup&&/^(?:Leader|리더)$/i.test(unit.attachedAs||"")&&!leadersByGroup.has(unit.attachedGroup))leadersByGroup.set(unit.attachedGroup,index);});
  parsed.units.forEach((unit,index)=>{let parent=-1;if(unit.attachedTo){const target=normalizeMatchName(unit.attachedTo);parent=parsed.units.findIndex((candidate,i)=>i!==index&&normalizeMatchName(candidate.rosterName)===target);}if(parent<0&&unit.attachedGroup&&unit.attachedAs&&!/^(?:Leader|리더)$/i.test(unit.attachedAs))parent=leadersByGroup.get(unit.attachedGroup)??-1;if(parent>=0&&parent!==index)parentByChild.set(index,parent);});
  const childrenByParent=new Map();for(const [child,parent] of parentByChild){if(!childrenByParent.has(parent))childrenByParent.set(parent,[]);childrenByParent.get(parent).push(child);}
  const makeButton=(index,child=false)=>{const unit=parsed.units[index],found=findDataUnit(unit.rosterName),name=found&&!found.candidates?(found.unit.nameKo||tr(found.unit.name)):unit.rosterName,button=document.createElement("button"),role=roleLabels[unit.attachedAs]||unit.attachedAs;button.type="button";button.className=`unit-quick-nav-item${child?" attached-child":""}`;button.dataset.unitJump=String(index);button.textContent=`${child?"└ ":`${index+1}. `}${name}${role&&!/^(?:Leader|리더)$/i.test(unit.attachedAs)?` · ${role}`:""} · ${unit.count}개체`;button.title=unit.attachedTo?`${unit.rosterName} → ${unit.attachedTo}`:unit.rosterName;return button;};
  const assistantButton=document.createElement("button");assistantButton.type="button";assistantButton.className="unit-quick-nav-item assistant-quick-link";assistantButton.dataset.assistantJump="true";assistantButton.textContent="전투 보조 체크리스트";list.append(assistantButton);
  parsed.units.forEach((unit,index)=>{if(parentByChild.has(index))return;list.append(makeButton(index));for(const child of childrenByParent.get(index)||[])list.append(makeButton(child,true));});
  nav.hidden=false;
}
function renderRosterEquipment(unit){
  const items=[...(unit.equipment?unit.equipment.split(/,(?![^()]*\))/).map(s=>s.trim()).filter(Boolean):[]),...(unit.equipmentLines||[])];
  return `<section class="roster-gear"><b>편성 장비</b>${items.length?`<ul>${items.map(x=>`<li>${escapeHtml(bilingualLabel(x))}</li>`).join("")}</ul>`:"<div>목록에 장비 정보 없음</div>"}</section>`;
}
let toastTimer;
function showKeywordToast(raw){
  const info=keywordInfo(raw),toast=$("toast");
  $("toast-title").textContent=info?`${info.ko} (${info.en})`:raw;
  let description=info?.description||"규칙 데이터에서 설명을 찾지 못했습니다. 현재 BSData에 규칙 본문이 연결되어 있는지 확인해 주세요.";
  $("toast-description").textContent=description;
  toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},5000);
}
function render(){
  const parsed=parseRoster($("roster").value),summary=$("summary"),results=$("results");
  if(!parsed.units.length){currentRosterMeta={};summary.hidden=true;results.innerHTML='<div class="empty">유닛 항목을 찾지 못했습니다. NewRecruit에서 복사한 편성표 텍스트인지 확인해 주세요.</div>';updateUnitQuickNav(parsed);$("assistant-page").innerHTML=renderAssistantPage(parsed);return;}
  const m=parsed.meta;currentRosterMeta=m; summary.hidden=false;
  summary.innerHTML=[m.faction&&`<span class="pill">진영 <strong>${escapeHtml(m.faction.split(" - ").map(bilingualLabel).join(" · "))}</strong></span>`,m.detachment&&`<span class="pill">편제 <strong>${escapeHtml(bilingualLabel(m.detachment))}</strong></span>`,m.mission&&`<span class="pill">미션 <strong>${escapeHtml(bilingualLabel(m.mission))}</strong></span>`,m.gameSize&&`<span class="pill">전장 규모 <strong>${escapeHtml(String(m.gameSize))}점</strong></span>`,m.disposition&&`<span class="pill">전술 <strong>${escapeHtml(bilingualLabel(m.disposition))}</strong></span>`,m.points&&`<span class="pill">총점 <strong>${escapeHtml(m.points)}점</strong></span>`,`<span class="pill">인식 유닛 <strong>${parsed.units.length}</strong></span>`].filter(Boolean).join("");
  results.innerHTML=parsed.units.map((u,i)=>{const found=findDataUnit(u.rosterName);if(!found)return `<article class="unmatched" data-unit-card="${i}"><strong>${!m.faction?"진영 인식 실패":db.units.length?"이름 매칭 실패":"진영/데이터 연결 확인"} · ${escapeHtml(u.rosterName)}</strong>${u.count}개체 · ${u.points}점 ${renderRosterEquipment(u)}<div class="meta">${escapeHtml(matchFailureDetails(m))}</div>${renderUnitMatchControl(u.rosterName)}</article>`;if(found.candidates)return `<article class="unmatched" data-unit-card="${i}"><strong>이름 확인 필요 · ${escapeHtml(u.rosterName)}</strong><div class="meta">유사 후보: ${found.candidates.map(c=>`${escapeHtml(c.unit.name)} (${escapeHtml(c.unit.edition)}, ${Math.round(c.score*100)}%)`).join(" · ")}. 확정 전까지 연결하지 않습니다.</div>${renderUnitMatchControl(u.rosterName)}</article>`;const d=found.unit,key=`${i}:${norm(u.rosterName)}`,max=unitWoundMax(d,u.count),now=currentWounds(key,max),related=d.abilities?.filter(a=>ruleAppliesToRoster(a.name,m))||[];return `<article class="card" data-unit-card="${i}"><div class="card-head" role="button" tabindex="0" aria-expanded="false" data-card="${i}"><div class="card-title">${renderUnitHeaderImage(d)}<div class="card-title-text"><h3>${escapeHtml(d.nameKo||tr(d.name))}</h3><div class="original">${escapeHtml(d.name)} · 편성 ${u.count}개체 · ${u.points}점${d.points?` · 출처 포인트 ${d.points}`:""}</div></div></div>${renderUnitSummary(d)}<div class="wound-control" aria-label="운드 추적기"><button type="button" class="wound-button" data-wound-action="minus" data-wound-key="${escapeHtml(key)}" data-wound-max="${max}" aria-label="운드 감소">−</button><span class="wound-value" data-wound-value="${escapeHtml(key)}">${max?`${now}/${max}`:"—/—"}</span><button type="button" class="wound-button" data-wound-action="plus" data-wound-key="${escapeHtml(key)}" data-wound-max="${max}" aria-label="운드 증가">+</button></div><span class="tag">${escapeHtml(found.confidence)} · ${escapeHtml(d.edition)} · ${escapeHtml(d.translationStatus||"번역 확인")}</span></div><div class="card-body" hidden><div class="meta">${escapeHtml(d.edition)} · BSData ${escapeHtml(d.sourceFile||"")} · ${escapeHtml(db.sourceVersion||"버전 미지정")}</div>${renderUnitImageSection(d,i)}${renderProfiles(d.profiles,u.count)}${related.length?`<p class="equip"><b>관련 규칙</b> ${related.map(a=>renderKeywordButton(a.name)).join(" · ")}</p>`:""}${d.keywords?.length?`<p class="equip"><b>키워드</b> ${d.keywords.map(renderKeywordButton).join(" · ")}</p>`:""}${renderRosterEquipment(u)}${d.note?`<p class="meta">${escapeHtml(d.note)}</p>`:""}</div></article>`}).join("");
  updateUnitQuickNav(parsed);
  $("assistant-page").innerHTML=renderAssistantPage(parsed);
  const requestedFiles=catalogueFilesForFaction(m.faction||"").join("|");if(requestedFiles&&requestedFiles!==activeCatalogueKey)loadRulesData(m);else if(!requestedFiles&&(activeCatalogueKey||db.sourceVersion!=="진영 미확인"))loadRulesData(m);
  const nextStratContext=`11|${norm(m.faction||"")}|${norm(m.detachment||"")}`;if(nextStratContext!==stratContextKey){stratContextKey=nextStratContext;loadCoreStratagems();}
  results.querySelectorAll(".card-head").forEach(head=>{head.addEventListener("click",e=>{if(e.target.closest(".wound-control"))return;const body=head.nextElementSibling,open=body.hidden;body.hidden=!open;head.setAttribute("aria-expanded",String(open));if(open){const imageSection=body.querySelector("[data-unit-image]");if(imageSection)loadUnitImage(imageSection);}});head.addEventListener("keydown",e=>{if(e.target!==head&&e.target.closest(".wound-control"))return;if(e.key==="Enter"||e.key===" "){e.preventDefault();head.click();}});});
  results.querySelectorAll("[data-unit-image]").forEach(enqueueUnitImage);
}
document.querySelector(".view-tabs").addEventListener("click",e=>{const button=e.target.closest("[data-view]");if(!button)return;const assistant=button.dataset.view==="assistant";document.body.classList.toggle("assistant-mode",assistant);document.querySelectorAll(".view-tab").forEach(x=>x.classList.toggle("active",x===button));$("summary").hidden=assistant;$("results").hidden=assistant;$("assistant-page").hidden=!assistant;});
$("assistant-page").addEventListener("click",e=>{const tab=e.target.closest("[data-phase]");if(tab){$("assistant-page").querySelectorAll(".phase-tab").forEach(x=>x.classList.toggle("active",x===tab));$("assistant-page").querySelectorAll(".phase-panel").forEach(x=>x.hidden=x.dataset.phasePanel!==tab.dataset.phase);return;}const cp=e.target.closest("[data-cp]");if(cp){cpValue=Math.max(0,Math.min(20,cpValue+(cp.dataset.cp==="plus"?1:-1)));try{localStorage.setItem("40k-cp",String(cpValue));}catch{}const output=$("cp-value");if(output)output.textContent=cpValue;return;}const spend=e.target.closest("[data-spend-cp]");if(spend){const cost=Number(spend.dataset.spendCp)||0;if(cpValue<cost){const toast=$("toast");$("toast-title").textContent="CP 부족";$("toast-description").textContent=`현재 ${cpValue} CP이며 이 스트라타젬에는 ${cost} CP가 필요합니다.`;toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},3500);return;}cpValue-=cost;try{localStorage.setItem("40k-cp",String(cpValue));}catch{}const output=$("cp-value");if(output)output.textContent=cpValue;spend.textContent="사용 완료";spend.disabled=true;spend.dataset.cpSpent="1";return;}if(e.target.closest("[data-reset-assistant]")){$("assistant-page").querySelectorAll("[data-assistant-check]").forEach(check=>{check.checked=false;check.closest(".check-row")?.classList.remove("checked");try{localStorage.removeItem(`40k-assistant:${check.dataset.assistantCheck}`);}catch{}});}});
$("assistant-page").addEventListener("change",e=>{const check=e.target.closest("[data-assistant-check]");if(check){try{localStorage.setItem(`40k-assistant:${check.dataset.assistantCheck}`,check.checked?"1":"0");}catch{}check.closest(".check-row")?.classList.toggle("checked",check.checked);}});
$("assistant-page").addEventListener("input",e=>{const field=e.target.closest("[data-game-field]"),score=e.target.closest("[data-round-score]");if(!field&&!score)return;const state=readGameTracker();if(field)state[field.dataset.gameField]=field.value;else{const round=Number(score.dataset.roundScore),player=score.dataset.player;if(round>=0&&round<5&&(player==="us"||player==="them"))state.rounds[round][player]=Math.max(0,Math.min(99,Number(score.value)||0));}writeGameTracker(state);for(const side of ["us","them"]){const total=state.rounds.reduce((sum,r)=>sum+r[side],0),output=$("assistant-page").querySelector(`[data-score-total="${side}"]`);if(output)output.textContent=String(total);}});
$("assistant-page").addEventListener("click",e=>{if(!e.target.closest("[data-reset-game]"))return;try{localStorage.removeItem(GAME_TRACKER_KEY);}catch{}$("assistant-page").innerHTML=renderAssistantPage(parseRoster($("roster").value));});
$("assistant-page").addEventListener("click",e=>{const spend=e.target.closest("[data-stratagem-check]");if(spend?.dataset.cpSpent==="1"){const id=spend.dataset.stratagemCheck;for(const check of $("assistant-page").querySelectorAll(`[data-assistant-check="${CSS.escape(id)}"]`)){check.checked=true;check.closest(".check-row")?.classList.add("checked");try{localStorage.setItem(`40k-assistant:${id}`,"1");}catch{}}for(const button of $("assistant-page").querySelectorAll(`[data-stratagem-check="${CSS.escape(id)}"]`)){button.textContent="사용 완료";button.disabled=true;}}if(e.target.closest("[data-reset-assistant]"))for(const button of $("assistant-page").querySelectorAll("[data-stratagem-check]")){button.textContent="CP 사용";button.disabled=false;delete button.dataset.cpSpent;try{localStorage.removeItem(`40k-assistant:${button.dataset.stratagemCheck}`);}catch{}}});
function resizeRoster(){const box=$("roster");box.style.height="160px";}
const ROSTER_PRESETS_KEY="40k-roster-presets-v1";
function readRosterPresets(){try{const value=JSON.parse(localStorage.getItem(ROSTER_PRESETS_KEY)||"{\"recent\":[],\"saved\":[]}");return {recent:Array.isArray(value.recent)?value.recent:[],saved:Array.isArray(value.saved)?value.saved:[]};}catch{return {recent:[],saved:[]};}}
function writeRosterPresets(value){try{localStorage.setItem(ROSTER_PRESETS_KEY,JSON.stringify(value));return true;}catch{const status=$("roster-preset-status");if(status)status.textContent="브라우저 저장 공간이 부족해 프리셋을 저장하지 못했습니다.";return false;}}
function refreshRosterPresetOptions(){
  const select=$("roster-preset-select"),presets=readRosterPresets(),current=select.value;
  select.innerHTML='<option value="">불러올 편성표 선택…</option>';
  if(presets.recent.length){const group=document.createElement("optgroup");group.label="최근 분석";for(const item of presets.recent){const option=document.createElement("option");option.value="recent:"+item.id;option.textContent=item.name;group.append(option);}select.append(group);}
  if(presets.saved.length){const group=document.createElement("optgroup");group.label="내 프리셋";for(const item of presets.saved){const option=document.createElement("option");option.value="saved:"+item.id;option.textContent=item.name;group.append(option);}select.append(group);}
  if([...select.options].some(option=>option.value===current))select.value=current;
  $("delete-roster-preset").disabled=!select.value.startsWith("saved:");
}
function rememberRecentRoster(){
  const text=$("roster").value.trim();if(!text)return;
  const presets=readRosterPresets(),now=Date.now(),id=String(now),stamp=new Date(now).toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"});
  presets.recent=[{id,name:"최근 편성표 · "+stamp,text,updatedAt:now},...presets.recent.filter(item=>item.text!==text)].slice(0,6);
  if(writeRosterPresets(presets))refreshRosterPresetOptions();
}
$("roster-preset-select").addEventListener("change",()=>{$("delete-roster-preset").disabled=!$("roster-preset-select").value.startsWith("saved:");});
$("save-roster-preset").addEventListener("click",()=>{const name=$("roster-preset-name").value.trim(),text=$("roster").value.trim(),status=$("roster-preset-status");if(!text){status.textContent="먼저 편성표를 붙여넣으세요.";return;}if(!name){$("roster-preset-name").focus();status.textContent="프리셋 이름을 입력하세요.";return;}const presets=readRosterPresets(),same=presets.saved.findIndex(item=>item.name.toLocaleLowerCase()===name.toLocaleLowerCase()),item={id:same>=0?presets.saved[same].id:(globalThis.crypto?.randomUUID?.()||String(Date.now())),name,text,updatedAt:Date.now()};if(same>=0)presets.saved[same]=item;else presets.saved.unshift(item);presets.saved=presets.saved.slice(0,30);writeRosterPresets(presets);refreshRosterPresetOptions();$("roster-preset-select").value="saved:"+item.id;$("delete-roster-preset").disabled=false;status.textContent="‘"+name+"’ 프리셋을 이 브라우저에 저장했습니다.";});
$("load-roster-preset").addEventListener("click",()=>{const [kind,id]=($("roster-preset-select").value||"").split(":"),presets=readRosterPresets(),item=presets[kind]?.find(entry=>entry.id===id),status=$("roster-preset-status");if(!item){status.textContent="불러올 편성표를 선택하세요.";return;}$("roster").value=item.text;resizeRoster();render();status.textContent="‘"+item.name+"’을 입력란에 불러왔습니다.";});
$("delete-roster-preset").addEventListener("click",()=>{const [kind,id]=($("roster-preset-select").value||"").split(":"),status=$("roster-preset-status");if(kind!=="saved")return;const presets=readRosterPresets(),item=presets.saved.find(entry=>entry.id===id);presets.saved=presets.saved.filter(entry=>entry.id!==id);writeRosterPresets(presets);refreshRosterPresetOptions();status.textContent=item?"‘"+item.name+"’ 프리셋을 삭제했습니다.":"";});
refreshRosterPresetOptions();
// Save pasted rosters into recent history immediately, even before analysis.
$("roster").addEventListener("paste",()=>setTimeout(rememberRecentRoster,0));
$("clear-roster").addEventListener("click",()=>{$("roster").value="";resizeRoster();render();$("roster").focus();});
$("load-example").addEventListener("click",()=>{$("roster").value=example;resizeRoster();render()});
$("parse").addEventListener("click",()=>{rememberRecentRoster();render();});
$("results").addEventListener("click",e=>{const wound=e.target.closest("[data-wound-action]");if(wound){e.preventDefault();e.stopPropagation();const key=wound.dataset.woundKey,max=Number(wound.dataset.woundMax)||0;if(!max)return;let value=currentWounds(key,max);value=Math.max(0,Math.min(max,value+(wound.dataset.woundAction==="plus"?1:-1)));woundState.set(key,value);const output=document.querySelector(`[data-wound-value="${CSS.escape(key)}"]`);if(output)output.textContent=`${value}/${max}`;return;}const button=e.target.closest(".keyword-chip");if(button)showKeywordToast(button.dataset.keyword);});
$("results").addEventListener("change",e=>{const select=e.target.closest("[data-unit-match]");if(!select)return;const key=unitMatchKey(select.dataset.unitMatch);if(select.value)sessionUnitMatches.set(key,select.value);else sessionUnitMatches.delete(key);render();});
$("unit-quick-nav").addEventListener("click",e=>{const toggle=e.target.closest("#unit-quick-nav-toggle");if(toggle){const list=$("unit-quick-nav-list"),open=list.hidden;list.hidden=!open;toggle.setAttribute("aria-expanded",String(open));return;}const closeList=()=>{$("unit-quick-nav-list").hidden=true;$("unit-quick-nav-toggle").setAttribute("aria-expanded","false");};if(e.target.closest("[data-assistant-jump]")){document.querySelector('[data-view="assistant"]').click();closeList();requestAnimationFrame(()=>$("assistant-page").scrollIntoView({behavior:"smooth",block:"start"}));return;}const item=e.target.closest("[data-unit-jump]");if(!item)return;if(document.body.classList.contains("assistant-mode"))document.querySelector('[data-view="datasheets"]').click();const card=document.querySelector(`[data-unit-card="${CSS.escape(item.dataset.unitJump)}"]`);if(!card)return;const head=card.querySelector(".card-head"),body=head?.nextElementSibling;if(body?.hidden){body.hidden=false;head.setAttribute("aria-expanded","true");const imageSection=body.querySelector("[data-unit-image]");if(imageSection)loadUnitImage(imageSection);}card.scrollIntoView({behavior:"smooth",block:"start"});closeList();});
$("assistant-page").addEventListener("click",e=>{const button=e.target.closest(".keyword-chip");if(button)showKeywordToast(button.dataset.keyword);});
const savedTranslationFeed=(()=>{try{return localStorage.getItem("40k-translation-feed")||"";}catch{return "";}})();
$("translation-feed-url").value=v2TranslationFeed||savedTranslationFeed;
if(!v2TranslationFeed)v2TranslationFeed=savedTranslationFeed;
$("load-translations").addEventListener("click",()=>{v2TranslationFeed=$("translation-feed-url").value.trim();try{if(v2TranslationFeed)localStorage.setItem("40k-translation-feed",v2TranslationFeed);}catch{}loadV2TranslationFeed();});
if(v2TranslationFeed)loadV2TranslationFeed();
$("roster").value=example;resizeRoster();render();
loadRulesData(parseRoster(example).meta);
