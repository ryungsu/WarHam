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
const FORTYKDC_BASE="https://raw.githubusercontent.com/wn-mitch/40kdc-data/main/data/core/";
const FORTYKDC_FACTIONS=[["adeptasororitas","adepta-sororitas"],["adeptuscustodes","adeptus-custodes"],["adeptusmechanicus","adeptus-mechanicus"],["aeldari","aeldari"],["agentsoftheimperium","agents-of-the-imperium"],["astramilitarum","astra-militarum"],["blacktemplars","black-templars"],["bloodangels","blood-angels"],["chaosdaemons","chaos-daemons"],["chaosknights","chaos-knights"],["chaosspacemarines","chaos-space-marines"],["crimsonfists","crimson-fists"],["darkangels","dark-angels"],["deathguard","death-guard"],["deathwatch","deathwatch"],["drukhari","drukhari"],["emperorschildren","emperors-children"],["genestealercults","genestealer-cults"],["greyknights","grey-knights"],["imperialfists","imperial-fists"],["imperialknights","imperial-knights"],["ironhands","iron-hands"],["leaguesofvotann","leagues-of-votann"],["necrons","necrons"],["orks","orks"],["ravenguard","raven-guard"],["salamanders","salamanders"],["spacewolves","space-wolves"],["tauempire","tau-empire"],["thousandsons","thousand-sons"],["tyranids","tyranids"],["ultramarines","ultramarines"],["whitescars","white-scars"],["worldeaters","world-eaters"]];
const fortykdcCache=new Map();
function fortykdcSlugs(faction="") {const key=norm(faction),match=[...FORTYKDC_FACTIONS].sort((a,b)=>b[0].length-a[0].length).find(([alias])=>key.includes(alias)),slugs=[],isAstartes=/adeptusastartes|spacemarines|ultramarines|bloodangels|darkangels|blacktemplars|spacewolves|deathwatch|imperialfists|ironhands|ravenguard|salamanders|whitescars/.test(key);if(isAstartes)slugs.push("adeptus-astartes");if(match&&!isAstartes)slugs.push(match[1]);return [...new Set(slugs)];}
async function fetchFortykdcFile(slug,file){const path=`${slug}/${file}`,key=path.toLowerCase();if(fortykdcCache.has(key))return fortykdcCache.get(key);const urls=[FORTYKDC_BASE+path,`https://cdn.jsdelivr.net/gh/wn-mitch/40kdc-data@main/data/core/${path}`],request=(async()=>{let error;for(const url of urls)try{const response=await fetch(url,{cache:"force-cache"});if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);return await response.json();}catch(e){error=e;}throw error||new Error(`${path}: 연결 실패`);})();fortykdcCache.set(key,request);request.catch(()=>fortykdcCache.delete(key));return request;}
function fortykdcKeywordLabel(keyword={}){const id=String(keyword.keyword_id||"").toLowerCase(),params=keyword.parameters||{};if(id==="anti")return `Anti-${params.target_keyword||"?"} ${params.threshold||"?"}+`;const names={"sustained-hits":"Sustained Hits","lethal-hits":"Lethal Hits","devastating-wounds":"Devastating Wounds","ignores-cover":"Ignores Cover","twin-linked":"Twin-linked",torrent:"Torrent",assault:"Assault",heavy:"Heavy",pistol:"Pistol",blast:"Blast","rapid-fire":"Rapid Fire",melta:"Melta",precision:"Precision","extra-attacks":"Extra Attacks","indirect-fire":"Indirect Fire"};const base=names[id]||id.split("-").map(x=>x?x[0].toUpperCase()+x.slice(1):"").join(" ");const value=params.value??params.distance??params.threshold;return value!=null?`${base} ${value}${id==="melta"?"":""}`:base;}
function adaptFortykdcUnits(rawUnits,rawWeapons,slug){const weapons=new Map((rawWeapons||[]).map(w=>[w.id,w])),origin=slug;return (rawUnits||[]).map(unit=>{const profiles=(unit.profiles||[]).map(p=>({id:`40kdc:${unit.id}:${p.name}`,name:p.name||unit.name,typeName:"Unit",characteristics:[["M",p.M==null?"":`${p.M}\"`],["T",p.T],["Sv",p.Sv==null?"":`${p.Sv}+`],["W",p.W],["LD",p.Ld==null?"":`${p.Ld}+`],["OC",p.OC],["InSv",p.invuln_sv==null?"":`${p.invuln_sv}+`]].filter(([,v])=>v!==""&&v!=null).map(([name,value])=>({name,value:String(value)}))}));for(const id of unit.weapon_ids||[]){const weapon=weapons.get(id);if(!weapon)continue;for(const p of weapon.profiles||[]){const stats=p.stats||{},kw=(p.keywords||[]).map(fortykdcKeywordLabel).filter(Boolean).join(", ");profiles.push({id:`40kdc:${weapon.id}:${p.name}`,name:p.name||weapon.name,typeName:weapon.type==="melee"?"Melee Weapons":"Ranged Weapons",characteristics:[{name:"Range",value:typeof p.range==="number"?`${p.range}"`:String(p.range??"")},{name:"A",value:stats.A},{name:weapon.type==="melee"?"WS":"BS",value:stats.WS!=null?`${stats.WS}+`:stats.BS!=null?`${stats.BS}+`:""},{name:"S",value:stats.S},{name:"AP",value:stats.AP},{name:"D",value:stats.D},{name:"Keywords",value:kw}].filter(c=>c.value!==""&&c.value!=null).map(c=>({...c,value:String(c.value)}))});}}
  return {id:`40kdc-${unit.id}`,name:unit.name,edition:"11판",sourceFile:`40kdc-data · ${origin}`,dataSource:"40kdc-data",externalRefs:unit.external_refs||[],aliases:unit.aliases||[],points:unit.points?.[0]?.cost||null,profiles,abilities:[],keywords:[...(unit.keywords||[]),...(unit.faction_keywords||[])],translationStatus:"40kdc 보조 데이터",note:`BSData에 없는 항목을 보완하는 40kdc 보조 데이터입니다. ${unit.points_provisional?"포인트가 임시 값일 수 있습니다. ":""}영문 규칙 본문은 포함되지 않습니다.`,gameVersion:unit.game_version};});}
async function loadFortykdcFallback(faction,requestToken){const slugs=fortykdcSlugs(faction);if(!slugs.length)return {units:[],failed:0};const results=await Promise.all(slugs.map(async slug=>{try{const units=await fetchFortykdcFile(slug,"units.json"),weapons=await fetchFortykdcFile(slug,"weapons.json").catch(()=>[]);return {slug,units,weapons};}catch(error){return {slug,error};}}));if(requestToken!==catalogueLoadToken)return {units:[],failed:0};const ready=results.filter(x=>x.units),all=ready.flatMap(x=>adaptFortykdcUnits(x.units,x.weapons,x.slug));return {units:all,failed:results.length-ready.length};}
const CORE_RULES_FILE="Warhammer 40,000.json";
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
const STRATAGEM_DATA_URLS=[`${STRATAGEM_DATA_URL}11/cards.json`,`https://cdn.jsdelivr.net/gh/pguetschow/warhammer-40k-stratagem-card-generator@main/public/data/11/cards.json`];
let db = {edition:"11판",source:"BSData 공개 저장소",sourceVersion:"자동 연결 대기",units:[]};
function readStoredCP(){try{return localStorage.getItem("40k-cp")||"0";}catch{return "0";}}
let activeCatalogueKey="";let catalogueLoadToken=0;let coreStratagems=[];let factionStratagemCount=0;let factionDatasets=[];let factionArmyRules=[];let factionDetachmentCatalog=[];let factionEnhancements=[];let detachmentRules=[];let detachmentEnhancements=[];let detachmentRulesStatus="";let stratagemLoadStatus="대기 중";const stratEdition="11";let stratContextKey="";let stratLoadToken=0;let quickStratagemCategory="common";let quickStratagemDetachment="";let quickNavCollapsed=(()=>{try{return localStorage.getItem("40k-quick-nav-collapsed")!=="0";}catch{return true;}})();let detachmentPickerExpanded=true;let cpValue=Math.max(0,Math.min(20,Number(readStoredCP())||0));
const sourceRuleDescriptions=new Map();
const sourceRuleDescriptionsById=new Map();
const bsDataFileCache=new Map();
let coreRulesLoadPromise=null;
// Conservative fallback imported from the user-provided 40K issue workbook.
// Existing app glossary entries and approved feed translations take precedence.
const workbook40kTranslations=new Map((window.WH40K_WORKBOOK_GLOSSARY||[]).map(([source,translation])=>[source,translation]));
const v2LabelTranslations=new Map(),v2RuleTranslations=new Map(),v2RuleTranslationsById=new Map(),v2DraftRuleTranslations=new Map();
const DEFAULT_TRANSLATION_FEED="https://script.google.com/macros/s/AKfycbyrM4W4xGOYMgp1MLeiotCNcM4f8HQ2EO0_dx54Y3M8W2G5RRjiX9-XjmKQTa8O45admA/exec";
let v2TranslationFeed=new URLSearchParams(location.search).get("translationFeed")||"";
let currentRosterMeta={};
const $ = (id) => document.getElementById(id);
const norm = (s) => s.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
function indexRuleDescriptions(root){const stack=[root],seen=new WeakSet();while(stack.length){const value=stack.pop();if(!value||typeof value!=="object"||seen.has(value))continue;seen.add(value);if(!Array.isArray(value)&&value.name){const c=(value.characteristics||[]).find(x=>x.name==="Description");let description=c?.["$text"]??c?.text??value.description??value.ruleDescription;if(description&&typeof description==="object")description=description.$text??description.value??"";if(typeof description==="string"&&description.trim()){const clean=description.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();sourceRuleDescriptions.set(textKey(value.name),clean);if(value.id)sourceRuleDescriptionsById.set(value.id,clean);}}if(Array.isArray(value)){for(const item of value)stack.push(item);}else{for(const [key,item] of Object.entries(value))if(key!=="$schema"&&item&&typeof item==="object")stack.push(item);}}}
function sourceDescriptionFor(name){const key=textKey(name);if(sourceRuleDescriptions.has(key))return sourceRuleDescriptions.get(key);const compact=norm(name);for(const [ruleKey,description] of sourceRuleDescriptions)if(norm(ruleKey)===compact)return description;return "";}
function splitEnhancementNames(value=""){return String(value||"").replace(/^\s*(?:enhancements?|강화)\s*:\s*/i,"").split(/\s*[,;]\s*/).map(item=>item.trim()).filter(Boolean);}
function parseRosterModelLoadoutLine(value,defaultCount=1){
  const match=String(value||"").match(/^(\d+)\s*x\s+([^:]+?)(?:\s*:\s*(.*))?$/i);
  if(!match)return null;
  const models=Number(match[1])||Number(defaultCount)||1,items=(match[3]||"").split(/,(?![^()]*\))/).map(raw=>{
    const source=raw.trim(),withCount=source.match(/^(\d+)\s+with\s+(.+)$/i),explicit=source.match(/^(\d+)\s*x\s+(.+)$/i),name=(withCount?.[2]||explicit?.[2]||source).trim(),count=Number(withCount?.[1]||explicit?.[1]||models);
    return {name,count:Math.min(models,count)};
  }).filter(item=>item.name);
  return {name:match[2].trim(),models,items};
}
function parseRosterEquipmentItems(value,modelCount=1){
  const countForAll=Math.max(1,Number(modelCount)||1);
  return String(value||"").split(/,(?![^()]*\))/).map(raw=>{
    const text=raw.trim(),explicit=text.match(/^(\d+)\s*(?:x|with)\s+(.+)$/i),count=Math.min(countForAll,Number(explicit?.[1]||countForAll)),name=(explicit?.[2]||text).trim();
    return name?{name,count}:null;
  }).filter(Boolean);
}
function looksLikeRosterModelName(value=""){return !/\b(?:claws?|talons?|bonesword|lash whip|weapon|launcher|cannon|salvo|limbs?|ovipositor|barbed|chitin|fists?|blade|sword|rending|stinger|venom|spear|flamer|pistol|rifle|bolter|bolt\s?guns?|grenade|shotgun|melta|plasma|lasgun|carbine|knife|knives|sabre|mace|hammer|axe|lance|staff|crozius|shield|banner|standard|relic|auspex|vox|scanner|icon|signum|servo|grenades?)\b|볼터|볼트|권총|체인소드|체인블레이드|명장제조|라스캐논|미사일|런처|피스트|블레이드|소드|플라즈마|라이플|소총|파이어블래스터|파이어블라스터|파이어 블래스터|파이어 블라스터|볼트건|근접무기|샷건|저격|나이프|해머|메이스|방패|깃발|유물|수류탄/i.test(value);}
function parseRoster(text) {
  const lines = text.replace(/\u00a0/g," ").split(/\r?\n/).map((value,index)=>({line:value.replace(/\*\*|__|~~|`/g,"").trim(),index})).filter(x=>x.line);
  const units = [], meta = {};let currentUnit=null,currentModelLoadout=null,attachedGroup="";
  const headerRules = [[/FACTION KEYWORD:\s*(.+)/i,"faction"],[/DETACHMENT:\s*(.+)/i,"detachment"],[/FORCE DISPOSITION:\s*(.+)/i,"disposition"],[/TOTAL ARMY POINTS:\s*(\d+)/i,"points"],[/NUMBER OF UNITS:\s*(\d+)/i,"unitCount"],[/WARLORD:\s*(.+)/i,"warlord"]];
  for (const {line, index:sourceLineIndex} of lines) {
    const attachedGroupLine=line.match(/^(?:Attached Unit|합류 유닛|부착 유닛|부착 편성)\s*(\d+)$/i);if(attachedGroupLine){attachedGroup=attachedGroupLine[1];currentUnit=null;continue;}
    if(/^(?:CHARACTERS|BATTLELINE|OTHER DATASHEETS|DEDICATED TRANSPORTS|CHARACTER|전열|기타 데이터시트|전속 수송|캐릭터)$/i.test(line))attachedGroup="";
    const attachedToLine=line.match(/^(?:[•●▪*◦○◆-]\s*)?Attached to\s*:?\s*(.+)$/i);if(attachedToLine&&currentUnit){currentUnit.attachedTo=attachedToLine[1].trim();continue;}
    const attachedRoleLine=line.match(/^(?:[•●▪*◦○◆-]\s*)?Attached as\s*:?\s*(Leader|Bodyguard|Support|리더|경호원|지원)\b/i);if(attachedRoleLine&&currentUnit){currentUnit.attachedAs=attachedRoleLine[1];continue;}
    const unbulletedWithLine=line.match(/^(\d+)\s+with\s+(.+)$/i);if(currentUnit&&currentModelLoadout&&unbulletedWithLine){currentModelLoadout.withVariants||=[];currentModelLoadout.withVariants.push({models:Math.min(currentModelLoadout.models,Number(unbulletedWithLine[1])||1),items:parseRosterEquipmentItems(unbulletedWithLine[2],Number(unbulletedWithLine[1])||1)});continue;}
    for (const [re,key] of headerRules) { const m=line.match(re); if(m) meta[key]=m[1].trim(); }
    const detachmentLine=line.match(/^(.+?)\s*\(\s*\d+\s*(?:디태치먼트\s*포인트|detachment\s*points?)\s*\)$/i);if(detachmentLine&&!meta.detachment)meta.detachment=detachmentLine[1].trim();
    const totalLine=line.match(/^\(\s*(\d+)\s*(?:포인트|points?|pts?)\s*\)$/i);if(totalLine&&!meta.points)meta.points=totalLine[1];
    const gameSizeLine=line.match(/^(.+?)\s*\(\s*(\d+)\s*(?:포인트|points?|pts?)\s*\)$/i);if(gameSizeLine&&/^(?:급습|대규모|incursion|strike\s*force|onslaught)$/i.test(gameSizeLine[1].trim()))meta.gameSize=Number(gameSizeLine[2]);
    if(/^(?:점령과 유지|take and hold)$/i.test(line))meta.mission=line;
    if(!meta.faction){const factionAlias=FACTION_ALIASES.find(([alias])=>norm(line)===norm(alias));if(factionAlias)meta.faction=line;else{const koreanFaction=KOREAN_FACTION_ALIASES.get(norm(line));if(koreanFaction)meta.faction=koreanFaction;else{const embeddedFaction=FACTION_ALIASES.find(([alias])=>norm(line).includes(norm(alias)));if(embeddedFaction)meta.faction=line;}}}
    const standaloneEnhancement=line.match(/^[•●▪*◦○◆-]?\s*(?:enhancements?|강화)\s*:\s*(.+)$/i);if(currentUnit&&standaloneEnhancement){currentUnit.enhancements.push(...splitEnhancementNames(standaloneEnhancement[1]));continue;}
    const unitLine = line.replace(/^Char\d+:\s*/i, "");
    const armyTitleLine=/^\d+\s*(?:포전|포|points?|pts?)?\s*\(\s*\d+\s*(?:포인트|points?|pts?)\s*\)$/i.test(unitLine);
    if (!armyTitleLine&&/^(?:\d+x\s+)?[^•+\-].*\(\s*\d+\s*(?:포인트|points?|pts?)\s*\)/i.test(unitLine)&&!/^(?:급습|대규모|incursion|strike\s*force|onslaught)\s*\(/i.test(unitLine)&&!/\((?:사본|copy)\)/i.test(unitLine)) {
      const m=unitLine.match(/^(?:(\d+)x\s+)?(.+?)\s*\(\s*(\d+)\s*(?:포인트|points?|pts?)\s*\)\s*(?::\s*(.*))?$/i);
      if (m) {const equipment=m[4]||"",enhancementMatch=equipment.match(/(?:enhancements?|강화)\s*:\s*(.+)$/i);currentUnit={count:Number(m[1]||0),rosterName:m[2].trim(),points:Number(m[3]),equipment:enhancementMatch?equipment.slice(0,enhancementMatch.index).replace(/[,;\s]+$/," ").trim():equipment,equipmentLines:[],modelLoadouts:[],enhancements:enhancementMatch?splitEnhancementNames(enhancementMatch[1]):[],modelCounts:[],sourceLine:line,sourceLineIndex,equipmentLineIndexes:[sourceLineIndex],attachedGroup,attachedAs:"",attachedTo:""};units.push(currentUnit);currentModelLoadout=null;}
    } else if(currentUnit&&/^[•●▪*◦○◆-]\s*/.test(line)) {
      const symbol=line.match(/^([•●▪*◦○◆-])/)[1],item=line.replace(/^[•●▪*◦○◆-]\s*/,""),role=item.match(/^(?:Attached as|합류 방식)\s*:\s*(Leader|Bodyguard|Support|리더|경호원|지원)(?:\s|\(|$)/i);if(role){currentUnit.attachedAs=role[1];continue;}const enhancement=item.match(/^(?:enhancements?|강화)\s*:\s*(.+)$/i);if(enhancement){currentUnit.enhancements.push(...splitEnhancementNames(enhancement[1]));continue;}const withLine=item.match(/^(\d+)\s+with\s+(.+)$/i);if(withLine&&currentModelLoadout){currentModelLoadout.withVariants||=[];currentModelLoadout.withVariants.push({models:Math.min(currentModelLoadout.models,Number(withLine[1])||1),items:parseRosterEquipmentItems(withLine[2],Number(withLine[1])||1)});continue;}currentUnit.equipmentLines.push(item);currentUnit.equipmentLineIndexes.push(sourceLineIndex);
      const parsedGroup=parseRosterModelLoadoutLine(item,currentUnit.count),hasInlineGear=Boolean(item.includes(":"));
      if(parsedGroup&&hasInlineGear){currentUnit.modelLoadouts.push(parsedGroup);currentModelLoadout=parsedGroup;currentUnit.modelCounts.push(parsedGroup.models);continue;}
      if(parsedGroup&&looksLikeRosterModelName(parsedGroup.name)) {parsedGroup.items=[];currentUnit.modelLoadouts.push(parsedGroup);currentModelLoadout=parsedGroup;currentUnit.modelCounts.push(parsedGroup.models);continue;}
      if(parsedGroup&&currentModelLoadout){currentModelLoadout.items.push({name:parsedGroup.name,count:parsedGroup.models});continue;}
      if(parsedGroup&&looksLikeRosterModelName(parsedGroup.name)){currentUnit.modelCounts.push(parsedGroup.models);continue;}
    }
  }
  for(const unit of units){if(!unit.count){const inferred=unit.modelCounts.reduce((sum,n)=>sum+n,0),fallback=Math.max(0,...unit.equipmentLines.map(x=>Number(x.match(/^(\d+)x\s+/i)?.[1]||0)));unit.count=inferred||fallback||1;}delete unit.modelCounts;if(!unit.modelLoadouts.length){unit.modelLoadouts=(unit.equipmentLines||[]).map(line=>parseRosterModelLoadoutLine(line,unit.count)).filter(group=>group?.items?.length);}const expanded=[];for(const group of unit.modelLoadouts){if(!group.withVariants?.length){expanded.push(group);continue;}const variantSets=group.withVariants.map(variant=>new Set(variant.items.map(item=>normalizeLoadoutText(item.name)))),common=new Set([...variantSets[0]].filter(name=>variantSets.every(set=>set.has(name))));group.withVariants.forEach((variant,index)=>{const unique=variant.items.filter(item=>!common.has(normalizeLoadoutText(item.name))).map(item=>item.name),label=unique.length?unique.join(" + "): `장비 구성 ${index+1}`,name=`${group.name} · ${label}`;expanded.push({name,models:variant.models,items:variant.items});});const assigned=group.withVariants.reduce((sum,variant)=>sum+variant.models,0),remaining=Math.max(0,group.models-assigned);if(remaining)expanded.push({name:group.name,models:remaining,items:group.items||[]});}unit.modelLoadouts=expanded;}
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
function escapeHtml(s=""){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderRuleMarkup(value=""){
  const tokens=[];let source=String(value??"").replace(/\r/g,"").replace(/<k\b[^>]*>([\s\S]*?)<\/k>/gi,(_,inner)=>{const keyword=inner.replace(/<[^>]*>/g,"").trim(),token=tokens.push(renderKeywordButton(keyword))-1;return `\uE000${token}\uE001`;});
  source=source.replace(/<br\s*\/?\s*>/gi,"\n").replace(/<(\/?)\s*(b|strong|i|em|u|ul|ol|li|p)\b[^>]*>/gi,(_,slash,tag)=>{const token=tokens.push(`<${slash}${tag.toLowerCase()}>`)-1;return `\uE100${token}\uE101`;}).replace(/<[^>]*>/g,"");
  return escapeHtml(source).replace(/\uE000(\d+)\uE001/g,(_,index)=>tokens[Number(index)]||"").replace(/\uE100(\d+)\uE101/g,(_,index)=>tokens[Number(index)]||"").replace(/\n/g,"<br>");
}
function tr(s=""){if(v2LabelTranslations.has(textKey(s)))return v2LabelTranslations.get(textKey(s));if(translations.has(s))return translations.get(s);if(abilityTranslations.has(s))return `${abilityTranslations.get(s)} (${s})`;if(profileTypeTranslations.has(s))return `${profileTypeTranslations.get(s)} (${s})`;return translateTerms(s);}
function textKey(s=""){return String(s).normalize("NFKC").replace(/[\u00a0\u2007\u202f]/g," ").replace(/[‐‑‒–—]/g,"-").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g," ").trim().toLowerCase();}
function ruleFeedKey(name,source){const clean=s=>String(s||"").replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();return `${textKey(clean(name))}|${textKey(clean(source))}`;}
function ruleIdentityKey(id){return textKey(id||"");}
function sourceFileKey(file){return textKey(String(file||"").split("/").pop());}
function approvedRuleTranslation(name,source,identity={}){
  const idKey=ruleIdentityKey(identity.id);if(!idKey)return "";
  let candidates=v2RuleTranslationsById.get(idKey)||[];if(!candidates.length)return "";
  const fileKey=sourceFileKey(identity.file);
  if(fileKey){const inFile=candidates.filter(item=>sourceFileKey(item.file)===fileKey);if(inFile.length)candidates=inFile;}
  const kind=textKey(identity.kind||"");
  if(kind){const sameKind=candidates.filter(item=>textKey(item.kind)===kind);if(sameKind.length)candidates=sameKind;}
  const nameKey=textKey(name||"");
  if(nameKey){const sameName=candidates.filter(item=>textKey(item.name)===nameKey);if(sameName.length)candidates=sameName;}
  const unique=new Map(candidates.map(item=>[`${ruleFeedKey(item.name,item.source)}|${item.translation}`,item]));
  if(unique.size!==1)return "";
  return unique.values().next().value.translation;
}
function translateTerms(s=""){
  let out=s.replace(/\*\*\^\^([^\^]+)\^\^\*\*/g,"$1").replace(/\^\^([^\^]+)\^\^/g,"$1");
  const curatedKeys=new Set([...translations,...abilityTranslations,...termTranslations].map(([en])=>textKey(en)));
  const reviewedWorkbookTerms=[...workbook40kTranslations].filter(([en])=>!curatedKeys.has(textKey(en)));
  const pairs=[...new Map([...reviewedWorkbookTerms,...translations,...abilityTranslations,...termTranslations,...v2LabelTranslations].map(([en,ko])=>[textKey(en),[en,ko]])).values()].sort((a,b)=>b[0].length-a[0].length);
  for(const [en,ko] of pairs){
    const escaped=en.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/ /g,"\\s+").replace(/-/g,"[-‐‑‒–—]").replace(/'/g,"['’‘]");
    const bounded=new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?=$|[^\\p{L}\\p{N}])`,"giu");
    out=out.replace(bounded,(_,prefix)=>`${prefix}${ko}`);
  }
  return out;
}
function bilingualLabel(s=""){const ko=translateTerms(s);return ko!==s?`${ko} (${s})`:s;}
function translateRulesText(profileName,text="",identity={}){
  const key=textKey(profileName);
  const approvedById=approvedRuleTranslation(profileName,text,identity);if(approvedById)return approvedById;
  const approvedV2=v2RuleTranslations.get(ruleFeedKey(profileName,text));if(approvedV2)return approvedV2;
  const savedDraft=v2DraftRuleTranslations.get(ruleFeedKey(profileName,text));if(savedDraft)return savedDraft;
  if(key==="leader"&&text.includes("VICTRIX HONOUR GUARD"))return "이 모델은 다음 유닛에 합류할 수 있습니다: 강습 인터세서 분대, 강습 분대, 블레이드가드 베테랑 분대, 커맨드 분대, 컴퍼니 히어로즈, 헬블래스터 분대, 인페르누스 분대, 인터세서 분대, 스턴가드 베테랑 분대, 뱅가드 베테랑 분대, 빅트릭스 의장대, 울트라마르의 수호자.";
  if(key==="support")return "이 모델은 다음 유닛에 합류할 수 있습니다: 강습 인터세서 분대, 강습 분대, 블레이드가드 베테랑 분대, 커맨드 분대, 컴퍼니 히어로즈, 크루세이더 분대, 데스워치 베테랑, 데키무스 킬팀, 포르티스 킬팀, 헬블래스터 분대, 인페르누스 분대, 이너 서클 컴패니언, 인터세서 분대, 스턴가드 베테랑 분대, 소드 브레스런 분대, 택티컬 분대, 뱅가드 베테랑 분대.";
  const exact=abilityTextTranslations.get(key);if(exact)return exact;
  const clean=text.replace(/\*\*\^\^([^\^]+)\^\^\*\*/g,"$1").replace(/\^\^([^\^]+)\^\^/g,"$1");return translateTerms(clean);
}
function keywordInfo(raw=""){
  const source=keywordText(raw),clean=source.replace(/\*\*/g,"").replace(/[\[\]]/g,"").replace(/\u00a0/g," ").trim(),key=textKey(clean),canonicalKey=textKey(clean.replace(/\s*\(([^()]*)\)\s*/g,(_,inside)=>textKey(inside)===textKey(clean.split("(")[0])?"":" "+inside).trim());
  if(["librarius","librarius psyker","librarius ability"].includes(canonicalKey)||/\blibrarius\b/i.test(clean))return {key:"librarius",ko:"리브라리우스",en:"Librarius",description:"아뎁투스 아스타르테스 PSYKER 유닛은 데이터시트에 표시된 사이커 레벨만큼 매 배틀 라운드에 사이킥 능력을 사용할 수 있습니다. 사용하는 능력들의 사이킥 레벨 합계는 해당 유닛의 사이커 레벨을 넘을 수 없습니다."};
  const conditionalHits=clean.match(/^(lethal\s+hits|sustained\s+hits\s*\d+)\s*[:：]\s*non[\s\-‐‑‒–—]*([a-z]+(?:\s*\/\s*[a-z]+)*)$/i),localizedConditionalHits=clean.match(/^(치명타\s*명중|지속\s*명중\s*(\d+))\s*[:：]?\s*(?:\(\s*)?((?:몬스터|차량|보병|기병|야수)(?:\s*\/\s*(?:몬스터|차량|보병|기병|야수))*)\s*제외\s*\)?$/);
  if(conditionalHits||localizedConditionalHits){const englishTargets={monster:"몬스터",vehicle:"차량",infantry:"보병",mounted:"기병",beast:"야수"},koreanTargets={몬스터:"MONSTER",차량:"VEHICLE",보병:"INFANTRY",기병:"MOUNTED",야수:"BEAST"},isLocalized=Boolean(localizedConditionalHits),base=isLocalized?(localizedConditionalHits[1].startsWith("지속")?`Sustained Hits ${localizedConditionalHits[2]}`:"Lethal Hits"):conditionalHits[1].replace(/\s+/g," ").trim(),targets=(isLocalized?localizedConditionalHits[3].split("/").map(x=>x.trim()):conditionalHits[2].split("/").map(x=>x.trim())),targetKo=targets.map(x=>isLocalized?x:(englishTargets[textKey(x)]||translateTerms(x.charAt(0)+x.slice(1).toLowerCase()))).join("/"),targetEn=targets.map(x=>isLocalized?(koreanTargets[x]||x.toUpperCase()):x.toUpperCase()).join("/"),sustainedBase=base.match(/^sustained\s+hits\s*(\d+)$/i),isLethal=/^lethal\s+hits$/i.test(base),label=isLethal?"치명타 명중":`지속 명중 ${sustainedBase?.[1]||""}`.trim(),effect=isLethal?"치명 명중을 기록하면 해당 공격은 운드 굴림 없이 자동으로 운드를 입힙니다.":`치명 명중을 기록할 때마다 추가 명중 ${sustainedBase?.[1]||"1"}회를 얻습니다.`;return {key:clean,ko:`${label} (${targetKo} 제외)`,en:`${base}: non-${targetEn}`,description:`${effect} 이 효과는 대상 유닛에 ${targetKo} 키워드가 하나도 없을 때만 적용됩니다.`};}
  const sustained=clean.match(/^sustained\s+hits\s*(\d+)$/i)||key.match(/^sustainedhits(\d+)$/i);
  if(sustained){const n=sustained[1];return {key:`sustained hits ${n}`,ko:`지속 명중 ${n}`,en:`Sustained Hits ${n}`,description:`치명 명중을 기록할 때마다 추가 명중 ${n}회를 얻습니다.`};}
  const korean=clean.match(/^지속\s*명중\s*(\d+)$/);
  if(korean){const n=korean[1];return {key:`sustained hits ${n}`,ko:`지속 명중 ${n}`,en:`Sustained Hits ${n}`,description:`치명 명중을 기록할 때마다 추가 명중 ${n}회를 얻습니다.`};}
  const fnp=clean.match(/^feel\s+no\s+pain\s*\(?\s*(\d+)\s*\+?\s*\)?$/i);
  if(fnp){const n=fnp[1];return {key:`feel no pain ${n}+`,ko:`고통 경감 ${n}+`,en:`Feel No Pain ${n}+`,description:`이 능력이 있는 모델이 운드를 잃을 때마다 D6을 굴립니다. ${n}+가 나오면 그 운드를 잃지 않습니다.`};}
  const scouts=clean.match(/^scouts\s*(\d+)\s*[”’\u201d\u2019\u2033\u2032\"]?$/i);
  if(scouts){const n=scouts[1];return {key:`scouts ${n}`,ko:`스카웃 ${n}인치`,en:`Scouts ${n}\"`,description:`모든 모델이 이 능력을 가진 유닛은 첫 턴 시작 전에 최대 ${n}인치 이동할 수 있습니다. 아군 수송차량에 탑승 중이면 차량이 대신 이동할 수 있습니다.`};}
  const anti=clean.match(/^anti[\s\-‐‑‒–—]*([a-z][a-z /-]*?)\s*(\d+)\s*\+?$/i);
  if(anti){const targets=anti[1].split("/").map(x=>x.trim().replace(/\s+/g," ")),n=anti[2],translatedTargets=targets.map(target=>{const base=keyGlossary.get(`anti-${target.toLowerCase()}`);return base?.ko?.replace(/^안티\s*/,"")||translateTerms(target);}),targetKo=translatedTargets.join("/");return {key:`anti-${targets.map(x=>x.toLowerCase()).join("/")} ${n}`,ko:`안티 ${targetKo} ${n}+`,en:`Anti-${targets.join("/")} ${n}+`,description:`대상 유닛에 ${targets.join(" 또는 ")} 키워드 중 하나 이상이 있으면, 수정하지 않은 운드 굴림 ${n}+는 치명 운드로 간주됩니다.`};}
  for(const [k,v] of keyGlossary)if(key===textKey(k)||key===textKey(v.ko))return {key:k,...v};
  const rule=abilityTextTranslations.get(key);
  if(rule){const original=[...abilityTranslations.keys()].find(x=>textKey(x)===key)||clean;return {key:original,ko:abilityTranslations.get(original)||translateTerms(original),en:original,description:rule};}
  const sourceDescription=sourceDescriptionFor(clean);
  if(sourceDescription)return {key:clean,ko:v2LabelTranslations.get(textKey(clean))||translations.get(clean)||abilityTranslations.get(clean)||clean,en:clean,description:v2RuleTranslations.get(ruleFeedKey(clean,sourceDescription))||`공개 데이터 설명 (영문 원문): ${sourceDescription}`};
  return null;
}
function renderKeywordButton(raw){
  const source=keywordText(raw),info=keywordInfo(source),translated=tr(source),display=info?`${info.ko} (${info.en})`:translated!==source?`${translated} (${source})`:source;
  return `<button type="button" class="keyword-chip" data-keyword="${escapeHtml(info?.key||source)}">${escapeHtml(display)}</button>`;
}
function keywordText(raw=""){if(typeof raw==="string")return raw;if(raw&&typeof raw==="object")return String(raw.label??raw.name??raw.keyword??raw.text??fortykdcKeywordLabel(raw)??"");return String(raw??"");}
function unitWoundMax(data,count){const wounds=(data.profiles||[]).flatMap(p=>p.characteristics||[]).find(x=>x.name==="W")?.value;const perModel=Number.parseInt(wounds,10);return Number.isFinite(perModel)&&perModel>0?perModel*Math.max(1,count):0;}
const woundState=new Map();
function currentWounds(key,max){if(!max)return 0;const value=woundState.has(key)?Math.min(woundState.get(key),max):max;woundState.set(key,value);return value;}
function unitStatIcon(key){const paths={M:'<path d="M3 12h17M14 5l7 7-7 7"/>',T:'<path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/>',Sv:'<path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/><path d="m8 12 2.5 2.5L16 9"/>',W:'<path d="M12 2C9 7 5 11 5 16a7 7 0 0 0 14 0c0-5-4-9-7-14z"/>',LD:'<path d="M4 21V3m1 1h13l-3 4 3 4H5"/>',OC:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',InSv:'<path d="m12 2 2.4 6.5L21 11l-6.6 2.5L12 20l-2.4-6.5L3 11l6.6-2.5z"/>',Range:'<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>',A:'<path d="M5 20 12 4l7 16M8 14h8"/>',BS:'<path d="M4 18 18 4m-9 0h9v9M4 20h5"/>',WS:'<path d="m5 5 14 14M19 5 5 19M12 3v4m0 10v4"/>',S:'<path d="M17 6a5 5 0 0 0-8-1L5 8l11 8-3 3a5 5 0 0 1-7-1"/>',AP:'<path d="M4 20 20 4M7 4h13v13"/><path d="M4 8V4h4"/>',D:'<path d="M5 19V5h8a7 7 0 0 1 0 14z"/><path d="M9 9h4a3 3 0 0 1 0 6H9z"/>'},assets={M:"Move.svg",T:"Toughness.svg",Sv:"Save.svg",W:"Wounds.svg",LD:"Leadership.svg",Range:"Range.svg",A:"Attacks.svg",BS:"BallisticSkill.svg",WS:"WeaponSkill.svg",S:"Strength.svg",AP:"ArmourPenetration.svg",D:"Damage.svg"},fallback=`<svg class="stat-icon stat-icon-fallback" viewBox="0 0 24 24" aria-hidden="true">${paths[key]||paths.T}</svg>`;if(!assets[key])return fallback;const src=`https://cdn.jsdelivr.net/gh/Locequen/40k-Data-Card@master/src/svg/${assets[key]}`;return `<span class="stat-icon-wrap"><img class="stat-icon stat-icon-asset" src="${src}" alt="" loading="lazy" decoding="async" onerror="this.remove();this.nextElementSibling.style.display='block'">${fallback}</span>`;}
function renderUnitSummary(data){const aliases={M:["M","Move"],T:["T","Toughness"],Sv:["Sv","SV","Save"],W:["W","Wounds"],LD:["LD","Leadership"],OC:["OC","Objective Control"],InSv:["InSv","InvSv","Invulnerable Save"]};const p=(data.profiles||[]).find(x=>["unit","model"].includes((x.typeName||"").toLowerCase())&&(x.characteristics||[]).some(c=>Object.values(aliases).flat().includes(c.name)));if(!p)return "";const chars=p.characteristics||[],wanted=["M","T","Sv","W","LD","OC","InSv"].filter(k=>chars.some(c=>aliases[k].includes(c.name)));return `<div class="card-stat-summary"><span class="summary-label">유닛 능력치</span>${wanted.map(k=>{const c=chars.find(x=>aliases[k].includes(x.name)),ko=statTranslations.get(k)||k,english=c.name,changed=c.enhancementOriginal;return `<span class="stat-pill ${changed?"enhanced-stat":""}"><b>${escapeHtml(ko)} <span>(${escapeHtml(english)})</span></b><span class="stat-pill-value">${unitStatIcon(k)}${changed?`<del>${escapeHtml(changed)}</del>`:""}<strong>${escapeHtml(c.value)}</strong>${c.enhancementConditional?`<small>조건부</small>`:""}</span></span>`}).join("")}</div>`;}
function ruleAppliesToRoster(){return true;}
const assistantPhases=["전투 전 > 배치","전투 > 지휘","전투 > 이동","전투 > 사격","전투 > 돌격","전투 > 타격","전투 > 전투 충격","전투 > 피격·운드 처리","전투 > 파괴 시","전투 > 목표·종료","전투 > 추가 확인"];
let quickAssistantPhase="";
const GAME_TRACKER_KEY="40k-game-tracker-v1";
function readGameTracker(){try{const value=JSON.parse(localStorage.getItem(GAME_TRACKER_KEY)||"{}");return {mission:value.mission||"",deployment:value.deployment||"",ownDisposition:value.ownDisposition||"",opponentDisposition:value.opponentDisposition||"",primary:value.primary||"",secondary:value.secondary||"",rounds:Array.from({length:5},(_,i)=>({us:Number(value.rounds?.[i]?.us)||0,them:Number(value.rounds?.[i]?.them)||0}))};}catch{return {mission:"",deployment:"",ownDisposition:"",opponentDisposition:"",primary:"",secondary:"",rounds:Array.from({length:5},()=>({us:0,them:0}))};}}
function writeGameTracker(state){try{localStorage.setItem(GAME_TRACKER_KEY,JSON.stringify(state));}catch{}}
function renderGameTracker(meta){const state=readGameTracker(),mission=state.mission||meta.mission||"",ownDisposition=state.ownDisposition||meta.disposition||"",usTotal=state.rounds.reduce((sum,r)=>sum+r.us,0),themTotal=state.rounds.reduce((sum,r)=>sum+r.them,0),field=(key,label,value,placeholder="")=>`<label class="game-field"><span>${label}</span><input type="text" data-game-field="${key}" value="${escapeHtml(value)}" placeholder="${placeholder}"></label>`;return `<section class="game-tracker" aria-label="미션 및 점수 기록"><div class="game-tracker-heading"><div><p class="eyebrow">BATTLE JOURNAL</p><h3>미션 · 라운드 점수</h3></div><button type="button" class="quiet" data-reset-game>새 게임</button></div><div class="game-mission-grid">${field("mission","미션",mission,"미션 이름 입력")}${field("deployment","배치",state.deployment,"배치 방식")}${field("ownDisposition","내 군대 전술",ownDisposition,"예: 점령과 유지")}${field("opponentDisposition","상대 전술",state.opponentDisposition,"상대 로스터에서 입력")}${field("primary","주요 임무",state.primary,"주요 임무 이름")}${field("secondary","보조 임무",state.secondary,"보조 임무 이름")}</div><div class="score-table-wrap"><table class="score-table"><thead><tr><th>라운드</th><th>내 점수</th><th>상대 점수</th></tr></thead><tbody>${state.rounds.map((round,i)=>`<tr><th>${i+1}라운드</th><td><input type="number" min="0" max="99" step="1" inputmode="numeric" data-round-score="${i}" data-player="us" value="${round.us}" aria-label="${i+1}라운드 내 점수"></td><td><input type="number" min="0" max="99" step="1" inputmode="numeric" data-round-score="${i}" data-player="them" value="${round.them}" aria-label="${i+1}라운드 상대 점수"></td></tr>`).join("")}<tr class="score-total"><th>합계</th><td data-score-total="us">${usTotal}</td><td data-score-total="them">${themTotal}</td></tr></tbody></table></div><p class="game-tracker-note">점수와 임무 이름은 이 브라우저에 저장됩니다. 양측 점수는 각 라운드 종료 시 합산 점수로 기록하세요.</p></section>`;}
function classifyAssistantRule(name,description,typeName=""){
  const n=norm(name),t=norm(description),type=norm(typeName);
  if(n.startsWith("scouts")||n==="infiltrators"||t.includes("beforethebattle")||t.includes("duringdeployment"))return "전투 전 > 배치";
  if(t.includes("commandphase")||t.includes("atthestartofthefirstbattleround"))return "전투 > 지휘";
  if(n.includes("advance")||t.includes("advance move")||t.includes("movementphase"))return "전투 > 이동";
  if(n.includes("charge")||t.includes("chargephase")||t.includes("chargemove")||t.includes("chargemovement"))return "전투 > 돌격";
  if(type.includes("rangedweapon")||type.includes("rangedweapons"))return "전투 > 사격";
  if(type.includes("meleeweapon")||type.includes("meleeweapons"))return "전투 > 타격";
  if(n.includes("battle-shock")||n.includes("battleshock")||t.includes("battleshockphase")||t.includes("battleshocktest"))return "전투 > 전투 충격";
  if(/(?:thismodel|thisunit|bearer|modelinthisunit).{0,45}(?:is)?destroyed|destroyed.{0,35}(?:thismodel|thisunit|bearer)/.test(t))return "전투 > 파괴 시";
  if(n.includes("feel no pain")||n.includes("invulnerable")||/feelnopain|invulnerablesave|mortalwound|psychicattack|loses(?:any|awound)|wound(?:is)?allocated|attackisallocated|savingthrow|damageisallocated|suffersdamage|attackismadeagainst|selectedasa(?:the)?target|targetofattack|attack.{0,24}(?:target|allocated)|target.{0,24}attack/.test(t))return "전투 > 피격·운드 처리";
  if(t.includes("fightphase")||t.includes("fightfirst")||t.includes("fightlast"))return "전투 > 타격";
  if(t.includes("shootingphase")||t.includes("makesashootingattack"))return "전투 > 사격";
  if(n.includes("objective")||t.includes("endofyourturn"))return "전투 > 목표·종료";
  return "전투 > 추가 확인";
}
function isRosterAttachmentInfo(name,description=""){
  const key=norm(name),text=norm(description);
  if(["leader","support","attachedunits","attachedunit","attachedas"].includes(key))return true;
  return /(?:this|that)modelcanbeattachedto|canbeattachedtothefollowingunits?|canattachto(?:thefollowing)?units?|canattachthis(?:model|unit)to|unitcanbeattachedto|이모델은다음유닛에합류할수있습니다|이유닛은다음유닛에합류할수있습니다|유닛에합류할수있습니다|부착할수있습니다/.test(text);
}
function rosterWideAssistantLabel(description=""){
  const text=norm(description);
  const abilityWide=text.includes("friendly")&&text.includes("unitswiththisability")&&(text.includes("atthestartofyourcommandphase")||text.includes("onceperbattle"));
  const armyScope=text.includes("unitsfromyourarmy")||text.includes("unitsofyourarmy")||text.includes("modelsofyourarmy");
  const armyWide=armyScope&&(text.includes("activeforyourarmy")||text.includes("atthestart")||text.includes("selectone")||text.includes("onceperbattle"));
  return armyWide?"군대 공통":abilityWide?"능력 보유 유닛 공통":"";
}
function phasesForStratagem(stratagem){const phases=Array.isArray(stratagem.phases)?stratagem.phases:[stratagem.phases||""];const timing=norm(`${phases.join(" ")} ${stratagem.when||""} ${stratagem.restrictions||""}`),matches=[];for(const [token,phase] of [["command","전투 > 지휘"],["movement","전투 > 이동"],["shooting","전투 > 사격"],["charge","전투 > 돌격"],["fight","전투 > 타격"],["battleshock","전투 > 전투 충격"]])if(timing.includes(token)&&!matches.includes(phase))matches.push(phase);return matches.length?matches:["전투 > 추가 확인"];}
function makeAssistantTasks(parsed){
  const tasks=[];
  const add=(phase,unit,label,detail,source,identity=source)=>tasks.push({phase,unit,label,detail,source,id:norm(`${phase}|${unit}|${label}|${identity}`)});
  for(const [rosterIndex,rosterUnit] of parsed.units.entries()){
    const found=findDataUnit(rosterUnit.rosterName);if(!found||!found.unit)continue;const d=found.unit,effects=unitRuleEffects(d),baseUnit=tr(d.name),sameName=parsed.units.filter(x=>norm(x.rosterName)===norm(rosterUnit.rosterName)),copyNumber=parsed.units.slice(0,rosterIndex+1).filter(x=>norm(x.rosterName)===norm(rosterUnit.rosterName)).length,unit=sameName.length>1?`${baseUnit} ${copyNumber}`:baseUnit;
    for(const p of d.profiles||[]){
      const chars=p.characteristics||[],desc=chars.find(x=>x.name==="Description")?.value||"",type=p.typeName||"",isWeapon=/weapon/i.test(type),isAbility=!isWeapon&&(/abilit/i.test(type)||Boolean(desc));
      if(isAbility){if(!desc||isRosterAttachmentInfo(p.name,desc))continue;if(effects.length&&/feel\s+no\s+pain/i.test(`${p.name} ${desc}`))continue;const phase=classifyAssistantRule(p.name,desc,type),translated=translateRulesText(p.name,desc,{id:p.id,file:d.sourceFile,kind:/abilit/i.test(type)?"ability":"profile"}),taskUnit=rosterWideAssistantLabel(desc)||unit;add(phase,taskUnit,profileDisplayName(p),translated||"발동 시점과 조건을 원문에서 확인하세요.",p.name,`${p.name}|${desc}`);}
      else if(type.toLowerCase().includes("unit")||type.toLowerCase().includes("model")){const kws=chars.find(x=>x.name==="Keywords")?.value||"";for(const kw of kws.split(/,\s*/).filter(x=>/scouts|infiltrators|deep strike|feel no pain|invulnerable/i.test(x)&&!(effects.length&&/feel\s+no\s+pain/i.test(x))))add(classifyAssistantRule(kw,kw),unit,kw,keywordInfo(kw)?.description||"이 키워드의 배치 또는 방어 조건을 확인하세요.",kw);}
    }
    for(const ability of d.abilities||[]){const name=ability.name||ability.baseName||"규칙",description=ability.description||sourceDescriptionFor(name);if(!description||isRosterAttachmentInfo(name,description))continue;if(effects.length&&/feel\s+no\s+pain/i.test(`${name} ${description}`))continue;const taskUnit=rosterWideAssistantLabel(description)||unit;add(classifyAssistantRule(name,description),taskUnit,profileDisplayName({name,typeName:"Abilities"}),translateRulesText(name,description,{id:ability.targetId,file:d.sourceFile,kind:"ability"}),name,`${name}|${description}`);}
    for(const effect of effects)add("전투 > 피격·운드 처리",unit,effect.title,effect.detail,`effect:${effect.title}`);
  }
  const dedup=new Map();for(const task of tasks)dedup.set(task.id,task);return [...dedup.values()];
}
function assistantChecked(id){try{return localStorage.getItem(`40k-assistant:${id}`)==="1";}catch{return false;}}
function renderQuickAssistant(parsed){
  const tasks=makeAssistantTasks(parsed),groups=assistantPhases.map(phase=>[phase,tasks.filter(task=>task.phase===phase)]).filter(([,items])=>items.length);
  if(!groups.length)return `<p class="quick-assistant-empty">전투 보조 항목을 찾지 못했습니다.</p>`;
  if(!groups.some(([phase])=>phase===quickAssistantPhase))quickAssistantPhase=groups[0][0];
  const selected=groups.find(([phase])=>phase===quickAssistantPhase)?.[1]||[];
  const open=selected.filter(task=>!assistantChecked(task.id)).length;
  $("quick-assistant-count").textContent=`${open}/${selected.length} · ${quickAssistantPhase.split(" > ").at(-1)}`;
  const tabs=groups.map(([phase,items])=>`<button type="button" class="quick-assistant-phase ${phase===quickAssistantPhase?"active":""}" data-quick-phase="${escapeHtml(phase)}">${escapeHtml(phase.split(" > ").at(-1))}<small>${items.filter(task=>!assistantChecked(task.id)).length}</small></button>`).join("");
  const rows=selected.map(task=>{const checked=assistantChecked(task.id),title=`${task.unit} › ${task.label}`;return `<div class="quick-assistant-row ${checked?"checked":""}" data-quick-phase-row="${escapeHtml(task.phase)}"><input type="checkbox" aria-label="${escapeHtml(title)} 확인" data-quick-assistant-check="${escapeHtml(task.id)}" ${checked?"checked":""}><button type="button" class="assistant-detail-trigger quick-assistant-detail" data-assistant-detail-title="${escapeHtml(title)}" data-assistant-detail-text="${escapeHtml(task.detail)}"><b>${escapeHtml(task.unit)} <i>›</i> ${escapeHtml(task.label)}</b><span aria-hidden="true">ⓘ</span></button></div>`;}).join("");
  return `<nav class="quick-assistant-phases" aria-label="전투 단계">${tabs}</nav><div class="quick-assistant-rows">${rows}</div><button type="button" class="quick-assistant-open" data-assistant-jump>전체 전투 보조 열기</button>`;
}
function syncQuickAssistantCheck(id,checked){
  const quick=$("quick-assistant-content"),main=$("assistant-page"),quickCheck=quick.querySelector(`[data-quick-assistant-check="${CSS.escape(id)}"]`),mainCheck=main.querySelector(`[data-assistant-check="${CSS.escape(id)}"]`);
  if(quickCheck){quickCheck.checked=checked;quickCheck.closest(".quick-assistant-row")?.classList.toggle("checked",checked);}
  if(mainCheck){mainCheck.checked=checked;mainCheck.closest(".check-row")?.classList.toggle("checked",checked);}
  const total=quick.querySelectorAll("[data-quick-assistant-check]").length;
  if(total){const tasks=makeAssistantTasks(parseRoster($("roster").value)),remaining=tasks.filter(task=>!assistantChecked(task.id)).length;$("quick-assistant-count").textContent=`${remaining}개 남음`;}
  for(const button of quick.querySelectorAll("[data-quick-phase]")){const phase=button.dataset.quickPhase,open=quick.querySelectorAll(`[data-quick-phase-row="${CSS.escape(phase)}"] [data-quick-assistant-check]:not(:checked)`).length,count=button.querySelector("small");if(count)count.textContent=String(open);}
}
function isCommonStratagem(stratagem){return stratagem?.isCore===true||/^core11-/i.test(String(stratagem?.id||""))||norm(stratagem?.group||"")==="core";}
function factionStratagems(){return coreStratagems.filter(stratagem=>!isCommonStratagem(stratagem)&&stratagem.detachment);}
function stratagemDetachmentOptions(items=factionStratagems()){
  const groups=new Map();for(const item of items){const faction=localizedRuleValue(item.detachmentFaction||item.detachment_faction,"en")||"팩션 미분류",detachment=localizedRuleValue(item.detachment,"en")||String(item.detachment||"");if(!detachment)continue;if(!groups.has(faction))groups.set(faction,new Map());const entries=groups.get(faction);if(!entries.has(norm(detachment)))entries.set(norm(detachment),detachment);}
  return [...groups].flatMap(([faction,detachments])=>[...detachments.values()].map(detachment=>({faction,detachment}))).sort((a,b)=>a.faction.localeCompare(b.faction)||a.detachment.localeCompare(b.detachment));
}
const stratagemTranslationsById=new Map((window.WARHAMMER_STRATAGEM_TRANSLATIONS?.translations||[]).map(item=>[`${String(window.WARHAMMER_STRATAGEM_TRANSLATIONS?.edition||"")}|${String(item.id||"")}`,item]));
function stratagemTranslation(stratagem){return stratagemTranslationsById.get(`${stratEdition}|${String(stratagem?.id||"")}`)||null;}
function stratagemDisplayName(stratagem,fallback={}){return stratagemTranslation(stratagem)?.name||stratagem?.nameKo||fallback[stratagem?.name]||translateTerms(stratagem?.name||"");}
function stratagemFieldText(stratagem,field){const translated=stratagemTranslation(stratagem)?.[field];if(typeof translated==="string"&&translated.trim())return translated;const source=String(stratagem?.[field]??"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();return source?translateRulesText("",source):"";}
function renderQuickStratagemNav(){
  const count=$("quick-stratagem-count"),content=$("quick-stratagem-content");if(!content)return;
  const stratNameKo={"COMMAND RE-ROLL":"지휘 재굴림","EPIC CHALLENGE":"에픽 결투","INSANE BRAVERY":"불굴의 용기","EXPLOSIVES":"폭발물","CRUSHING IMPACT":"분쇄 충격","RAPID INGRESS":"신속 투입","FIRE OVERWATCH":"경계 사격","SMOKESCREEN":"연막","HEROIC INTERVENTION":"영웅적 개입","COUNTEROFFENSIVE":"역습"};
  const commonItems=coreStratagems.filter(isCommonStratagem),detachmentItems=factionStratagems(),options=stratagemDetachmentOptions(detachmentItems),commonCount=commonItems.length;
  if(!options.some(option=>norm(option.detachment)===norm(quickStratagemDetachment))){const rosterDetachment=detachmentLabel();quickStratagemDetachment=options.find(option=>detachmentNameMatches(option.detachment,rosterDetachment))?.detachment||options[0]?.detachment||"";}
  count.textContent=coreStratagems.length?`${commonCount}개 공용 · ${detachmentItems.length}개 팩션`:stratagemLoadStatus;
  const items=quickStratagemCategory==="common"?commonItems:detachmentItems.filter(item=>detachmentNameMatches(item.detachment,quickStratagemDetachment)),groups=new Map();
  for(const stratagem of items)for(const phase of phasesForStratagem(stratagem)){if(!groups.has(phase))groups.set(phase,[]);groups.get(phase).push(stratagem);}
  const categoryTabs=`<div class="quick-stratagem-tabs" role="tablist" aria-label="스트라타젬 종류"><button type="button" role="tab" aria-selected="${quickStratagemCategory==="common"}" class="${quickStratagemCategory==="common"?"active":""}" data-stratagem-category="common">공용 <small>${commonCount}</small></button><button type="button" role="tab" aria-selected="${quickStratagemCategory==="faction"}" class="${quickStratagemCategory==="faction"?"active":""}" data-stratagem-category="faction">팩션·편제 <small>${detachmentItems.length}</small></button></div>`;
  const detachmentSelect=quickStratagemCategory==="faction"&&options.length?`<label class="quick-stratagem-detachment-label">팩션 디테치먼트<select data-stratagem-detachment>${options.map(option=>`<option value="${escapeHtml(option.detachment)}" ${norm(option.detachment)===norm(quickStratagemDetachment)?"selected":""}>${escapeHtml(option.faction)} · ${escapeHtml(option.detachment)}</option>`).join("")}</select></label>`:"";
  if(!groups.size){const emptyMessage=stratagemLoadStatus==="대기 중"?"스트라타젬 연결을 기다리는 중입니다.":stratagemLoadStatus==="불러오는 중"?"스트라타젬을 불러오는 중입니다.":quickStratagemCategory==="faction"?`${canonicalStratFaction(currentRosterMeta)||"선택된 팩션"}의 디테치먼트 스트라타젬 데이터를 찾지 못했습니다.`:"공용 스트라타젬을 찾지 못했습니다.";content.innerHTML=`${categoryTabs}${detachmentSelect}<p class="quick-stratagem-status">${escapeHtml(emptyMessage)}</p>${stratagemLoadStatus.startsWith("연결 실패")?'<button type="button" class="quick-stratagem-retry" data-quick-stratagem-retry>다시 연결</button>':""}`;return;}
  const sections=[...groups].map(([phase,items])=>`<details class="quick-stratagem-phase"><summary>${escapeHtml(phase.split(" > ").at(-1))}<small>${items.length}</small></summary><div class="quick-stratagem-list">${items.map(s=>{const id=`assistant-stratagem-${stratEdition}-${s.id||norm(s.name)}`,name=stratagemDisplayName(s,stratNameKo),used=assistantChecked(id);return `<button type="button" class="quick-stratagem-item ${used?"used":""}" data-quick-stratagem-id="${escapeHtml(id)}"><span>${escapeHtml(name)}</span><b>${escapeHtml(s.cp)} CP${used?" · 사용":""}</b></button>`;}).join("")}</div></details>`).join("");
  content.innerHTML=`${categoryTabs}${detachmentSelect}<div class="quick-stratagem-cp"><b>현재 CP</b><button type="button" data-cp="minus" aria-label="CP 감소">−</button><output id="quick-stratagem-cp-value" data-cp-output>${cpValue}</output><button type="button" data-cp="plus" aria-label="CP 증가">+</button></div>${sections}`;
  if(quickStratagemCategory==="faction"&&!detachmentItems.length){const selectedFaction=canonicalStratFaction(currentRosterMeta);content.insertAdjacentHTML("beforeend",`<p class="quick-stratagem-status">${escapeHtml(`${selectedFaction||"선택된 팩션"}의 디테치먼트 스트라타젬 데이터를 찾지 못했습니다.`)}</p>`);}
}
function factionRuleDescription(rule){return (rule?.rules||[]).map(item=>localizedRuleValue(item.text||item.description)).filter(Boolean).join("\n\n");}
function detachmentTheme(value){const key=norm(value);if(/brethren/.test(key))return {id:"brethren",label:"브라더후드 전투단",art:"<path d=\"M10 5 5 9l5 5m4-9 5 4-5 5\"/><path d=\"m8 20 8-8m-3 8 5-5\"/><circle cx=\"12\" cy=\"8\" r=\"2\"/>"};if(/gravis/.test(key))return {id:"gravis",label:"그라비스 중장보병",art:"<path d=\"M8 20V9l4-4 4 4v11M6 11h12M9 14h6M10 20v-4h4v4\"/><path d=\"m4 8 2-3m14 3-2-3\"/>"};if(/phobos/.test(key))return {id:"phobos",label:"포보스 정찰·잠입",art:"<path d=\"M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6z\"/><circle cx=\"12\" cy=\"11\" r=\"3\"/><path d=\"m14 13 4 4\"/>"};if(/terminator/.test(key))return {id:"terminator",label:"터미네이터 강습대",art:"<path d=\"M7 20V8l5-4 5 4v12M5 10h14M8 13h8M9 20v-4h6v4\"/><path d=\"M12 4V2m-7 7-2 2m14-2 2 2\"/>"};if(/tacticus/.test(key))return {id:"tacticus",label:"택티쿠스 전투단",art:"<path d=\"M8 20V9l4-4 4 4v11M7 12h10M9 15h6M10 20v-4h4v4\"/><path d=\"m4 6 2 2m12-2-2 2\"/>"};if(/ironstorm|armou?red|vehicle|dreadnought/.test(key))return {id:"armoured",label:"기갑·기계화 전력",art:"<path d=\"M4 10h16v8H4zM7 10V7h10v3M8 18v2m8-2v2M7 13h3m4 0h3\"/><path d=\"m5 7 2-3h10l2 3\"/>"};if(/stormlance|mounted|cavalry|bike/.test(key))return {id:"mobile",label:"기동 타격대",art:"<path d=\"M5 16a3 3 0 1 0 6 0 3 3 0 1 0-6 0m8 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0\"/><path d=\"m8 16 3-6h4l3 6m-7-6 3 6H8m1-8h4\"/>"};return {id:"taskforce",label:"전술 임무부대",art:"<path d=\"M12 3 20 7v5c0 5-3 8-8 10-5-2-8-5-8-10V7z\"/><path d=\"m12 7 1.5 3.2 3.5.5-2.5 2.4.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.4 3.5-.5z\"/>"};}
function factionDetachmentEmblem(theme){return `<svg viewBox="0 0 24 24" role="img" aria-label="${escapeHtml(theme.label)}"><circle cx="12" cy="12" r="10.5" fill="#111a22" stroke="var(--faction-accent,#65a8ff)" stroke-width="1.4"/><g fill="none" stroke="#d5e5f2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${theme.art}</g></svg>`;}
function detachmentDispositionIcon(value){const key=norm(localizedRuleValue(value?.name,"en")||value?.name||value),glyph=/takeandhold/.test(key)?'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>':/priorityassets/.test(key)?'<path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="m12 6 1.7 4.1 4.3.3-3.3 2.8 1 4.2-3.7-2.3-3.7 2.3 1-4.2L6 10.4l4.3-.3z"/>':/reconnaissance/.test(key)?'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>':/disruption/.test(key)?'<path d="M3 7h8l3 5h7M3 17h5l3-5"/><path d="m17 8 4 4-4 4"/>':/purgethefoe/.test(key)?'<path d="m5 5 14 14M19 5 5 19M12 2v5m0 10v5"/>':'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>';return `<svg viewBox="0 0 24 24" aria-hidden="true">${glyph}</svg>`;}
function renderDetachmentPicker(detachmentOptions,detachmentGroups,chosen,selected){
  if(!detachmentOptions.length)return '<p class="phase-empty">편성표에 팩션을 입력하면 해당 팩션의 디테치먼트가 표시됩니다.</p>';
  const selectedOption=detachmentOptions.find(item=>detachmentNameMatches(item.detachment,chosen));
  const selectionMarkup=selectedOption?`<span class="detachment-emblem">${factionDetachmentEmblem(detachmentTheme(selectedOption.detachment))}</span><span><b>${escapeHtml(translateTerms(selectedOption.detachment)||selectedOption.detachment)}</b><small>${escapeHtml(selectedOption.detachment)} · ${escapeHtml(selectedOption.detachmentPoints??selectedOption.metadata?.detachmentPoints??"—")} DP</small></span>`:'<span class="detachment-picker-placeholder">디테치먼트 선택</span>';
  const order=["브라더후드 전투단","그라비스 중장보병","택티쿠스 전투단","터미네이터 강습대","포보스 정찰·잠입","기갑·기계화 전력","기동 타격대","전술 임무부대"];
  const groupsMarkup=[...detachmentGroups].sort(([a],[b])=>order.indexOf(a)-order.indexOf(b)).map(([family,options])=>`<div class="faction-detachment-family"><h4><span class="detachment-family-icon">${factionDetachmentEmblem(detachmentTheme(options[0]?.detachment||family))}</span><span>${escapeHtml(family)}<small>${options.length}개 편제</small></span></h4><div class="faction-detachment-grid">${options.map(option=>{const dispositions=option.forceDispositions?.length?option.forceDispositions:option.forceDisposition?[option.forceDisposition]:[],cost=option.detachmentPoints??option.metadata?.detachmentPoints,nameKo=translateTerms(option.detachment)||option.detachment;return `<button type="button" class="faction-detachment-option ${detachmentNameMatches(option.detachment,chosen)?"active":""} ${detachmentNameMatches(option.detachment,selected)?"roster-detachment":""}" data-detachment-option="${escapeHtml(option.detachment)}" aria-pressed="${detachmentNameMatches(option.detachment,chosen)}"><span class="detachment-card-name"><span class="detachment-emblem">${factionDetachmentEmblem(detachmentTheme(option.detachment))}</span><span><strong>${escapeHtml(nameKo)}</strong><small>${escapeHtml(option.detachment)}${detachmentNameMatches(option.detachment,selected)?" · 현재 편성":""}</small></span></span><span class="detachment-card-meta">${dispositions.map(disposition=>{const label=localizedRuleValue(disposition.name)||translateTerms(localizedRuleValue(disposition.name,"en"))||localizedRuleValue(disposition.name,"en");return `<span class="detachment-disposition" title="${escapeHtml(label)}">${detachmentDispositionIcon(disposition)}<small>${escapeHtml(label)}</small></span>`;}).join("")}<b class="detachment-cost">${cost==null?"—":`${escapeHtml(cost)} DP`}</b></span></button>`;}).join("")}</div></div>`).join("");
  return `<section class="faction-detachment-picker"><button type="button" class="detachment-picker-toggle" data-detachment-picker-toggle aria-expanded="${detachmentPickerExpanded}"><span class="detachment-picker-selection">${selectionMarkup}</span><span class="detachment-picker-action">${detachmentPickerExpanded?"목록 접기":"변경"}<b>${detachmentPickerExpanded?"−":"＋"}</b></span></button>${detachmentPickerExpanded?`<div class="detachment-picker-options"><div class="faction-detachment-picker-heading"><h3>디테치먼트 선택</h3><span>${detachmentOptions.length}개 · 계열별 분류 · DP</span></div>${groupsMarkup}</div>`:""}</section>`;
}
function renderStratagemPhaseGroups(items){
  const groups=new Map();for(const stratagem of items)for(const phase of phasesForStratagem(stratagem)){if(!groups.has(phase))groups.set(phase,[]);groups.get(phase).push(stratagem);}
  const phaseOrder={"전투 > 지휘":0,"전투 > 이동":1,"전투 > 사격":2,"전투 > 돌격":3,"전투 > 타격":4,"전투 > 전투 충격":5,"전투 > 추가 확인":6};
  return [...groups].sort(([a],[b])=>(phaseOrder[a]??99)-(phaseOrder[b]??99)).map(([phase,phaseItems],index)=>`<details class="stratagem-phase" ${index===0?"open":""}><summary>${escapeHtml(phase.split(" > ").at(-1))}<span>${phaseItems.length}</span></summary><div class="stratagem-reference-phase-list">${phaseItems.map(s=>{const when=stratagemFieldText(s,"when"),target=stratagemFieldText(s,"target"),effect=stratagemFieldText(s,"effect"),secondary=stratagemFieldText(s,"secondaryEffect"),restrictions=stratagemFieldText(s,"restrictions"),extraCost=Number(s.secondaryEffectCost)||0;return `<details class="stratagem-reference-card stratagem-reference-stratagem"><summary><span>${escapeHtml(stratagemDisplayName(s))}<small>${escapeHtml(s.name||"")}</small></span><b>${escapeHtml(s.cp)} CP</b></summary><div>${when?`<p><b>시점</b> ${renderRuleMarkup(when)}</p>`:""}${target?`<p><b>대상</b> ${renderRuleMarkup(target)}</p>`:""}${effect?`<p><b>효과</b> ${renderRuleMarkup(effect)}</p>`:""}${secondary?`<p><b>추가 효과${extraCost?` (+${extraCost} CP)`:""}</b> ${renderRuleMarkup(secondary)}</p>`:""}${restrictions?`<p><b>제한</b> ${renderRuleMarkup(restrictions)}</p>`:""}</div></details>`;}).join("")}</div></details>`).join("");
}
function renderFactionReference(){
  const selected=detachmentLabel(),detachmentOptions=Array.from(new Map(factionDetachmentCatalog.map(item=>[norm(item.detachment),item])).values());
  if(!detachmentOptions.some(item=>detachmentNameMatches(item.detachment,quickStratagemDetachment)))quickStratagemDetachment=detachmentOptions.find(item=>detachmentNameMatches(item.detachment,selected))?.detachment||detachmentOptions[0]?.detachment||"";
  const chosen=quickStratagemDetachment||selected;
  const ruleGroups=factionDetachmentCatalog.filter(item=>detachmentNameMatches(item.detachment,chosen));
  const abilities=ruleGroups.flatMap(item=>item.rules||[]);
  const enhancements=factionEnhancements.filter(item=>detachmentNameMatches(localizedRuleValue(item.detachment,"en")||item.detachment,chosen));
  const stratagems=factionStratagems().filter(item=>detachmentNameMatches(item.detachment,chosen));
  const detachmentGroups=new Map();for(const option of detachmentOptions){const theme=detachmentTheme(option.detachment);if(!detachmentGroups.has(theme.label))detachmentGroups.set(theme.label,[]);detachmentGroups.get(theme.label).push(option);}
  const picker=renderDetachmentPicker(detachmentOptions,detachmentGroups,chosen,selected);
  const armyRules=factionArmyRules.map(rule=>`<details class="stratagem-reference-card"><summary>${escapeHtml(localizedRuleValue(rule.name)||"팩션 규칙")}</summary><div>${renderRuleMarkup(factionRuleDescription(rule)||"설명 없음")}</div></details>`).join("");
  const abilityCards=abilities.map(rule=>`<details class="stratagem-reference-card"><summary>${escapeHtml(localizedRuleValue(rule.name)||"편제 능력")}</summary><div>${renderRuleMarkup(factionRuleDescription(rule)||"설명 없음")}</div></details>`).join("");
  const enhancementCards=enhancements.map(item=>`<details class="stratagem-reference-card"><summary>${escapeHtml(localizedRuleValue(item.name)||"인핸스먼트")} <small>${escapeHtml(item.cost||"")}pt</small></summary><div>${renderRuleMarkup(localizedRuleValue(item.description)||"설명 없음")}</div></details>`).join("");
  const stratagemSections=renderStratagemPhaseGroups(stratagems);
  const factionName=canonicalStratFaction(currentRosterMeta)||currentRosterMeta.faction||"편성표에서 팩션을 선택하세요";
  const updated=factionDatasets.map(source=>source.updated).filter(Boolean).sort().at(-1),updatedLabel=updated?` · 자료 갱신 ${new Date(updated).toLocaleDateString("ko-KR")}`:"";
  return `<section class="faction-reference"><div class="faction-reference-heading"><div><p class="eyebrow">DETACHMENT STRATAGEMS</p><h3>${escapeHtml(factionName)}</h3><p>팩션 규칙과 디테치먼트 스트라타젬을 확인합니다.</p><small class="faction-reference-source">출처 <a href="https://github.com/game-datacards/datasources/tree/main/11th/gdc" target="_blank" rel="noreferrer">game-datacards · 11판${escapeHtml(updatedLabel)}</a></small></div><span class="tag">${escapeHtml(stratagemLoadStatus)}</span></div>${picker}${armyRules?`<details class="stratagem-reference-group"><summary>팩션 공통 규칙 <span>${factionArmyRules.length}</span></summary>${armyRules}</details>`:""}<details class="stratagem-reference-group"><summary>디테치먼트 능력 <span>${abilities.length}</span></summary>${abilityCards||`<p class="phase-empty">${escapeHtml(chosen?`“${chosen}” 디테치먼트 능력을 찾지 못했습니다.`:"디테치먼트를 선택해 주세요.")}</p>`}</details><details class="stratagem-reference-group"><summary>인핸스먼트 <span>${enhancements.length}</span></summary>${enhancementCards||'<p class="phase-empty">이 디테치먼트의 인핸스먼트가 없습니다.</p>'}</details><details class="stratagem-reference-group" open><summary>디테치먼트 스트라타젬 <span>${stratagems.length}</span></summary>${stratagemSections||'<p class="phase-empty">이 디테치먼트의 스트라타젬 데이터가 없습니다.</p>'}</details></section>`;
}
function renderStratagemPage(){
  const commonItems=coreStratagems.filter(isCommonStratagem),commonCount=commonItems.length;
  const tabs=`<div class="quick-stratagem-tabs stratagem-page-tabs" role="tablist" aria-label="스트라타젬 종류"><button type="button" role="tab" aria-selected="${quickStratagemCategory==="common"}" class="${quickStratagemCategory==="common"?"active":""}" data-stratagem-category="common">공용 스트라타젬 <small>${commonCount}</small></button><button type="button" role="tab" aria-selected="${quickStratagemCategory==="faction"}" class="${quickStratagemCategory==="faction"?"active":""}" data-stratagem-category="faction">디테치 스트라타젬 <small>${factionStratagemCount}</small></button></div>`;
  const retry=stratagemLoadStatus.startsWith("연결 실패")?'<button type="button" class="quick-stratagem-retry" data-quick-stratagem-retry>다시 연결</button>':"";
  const commonPanel=renderStratagemPhaseGroups(commonItems)||`<p class="phase-empty">${escapeHtml(stratagemLoadStatus==="불러오는 중"?"공용 스트라타젬을 불러오는 중입니다.":"공용 스트라타젬을 찾지 못했습니다.")}</p>${retry}`;
  const content=quickStratagemCategory==="common"?commonPanel:renderFactionReference();
  return `<div class="assistant-heading"><div class="assistant-intro"><p class="eyebrow">DETACHMENT STRATAGEMS</p><h2>디테치 스트라타젬</h2><p>선택한 팩션의 디테치먼트를 찾아 규칙과 스트라타젬 설명을 확인합니다.</p></div><span class="tag">${escapeHtml(stratagemLoadStatus)}</span></div>${tabs}${content}`;
}
function showStratagemToast(id){
  const stratagem=coreStratagems.find(s=>`assistant-stratagem-${stratEdition}-${s.id||norm(s.name)}`===id);if(!stratagem)return;
  const nameKo={"COMMAND RE-ROLL":"지휘 재굴림","EPIC CHALLENGE":"에픽 결투","INSANE BRAVERY":"불굴의 용기","EXPLOSIVES":"폭발물","CRUSHING IMPACT":"분쇄 충격","RAPID INGRESS":"신속 투입","FIRE OVERWATCH":"경계 사격","SMOKESCREEN":"연막","HEROIC INTERVENTION":"영웅적 개입","COUNTEROFFENSIVE":"역습"},name=stratagemDisplayName(stratagem,nameKo),used=assistantChecked(id);
  let dialog=document.getElementById("stratagem-detail-dialog");
  if(!dialog){dialog=document.createElement("dialog");dialog.id="stratagem-detail-dialog";dialog.className="assistant-rule-dialog stratagem-detail-dialog";dialog.innerHTML='<form method="dialog" class="assistant-rule-close-form"><button type="submit" aria-label="닫기">×</button></form><p class="eyebrow">STRATAGEM</p><h2 data-stratagem-title></h2><div class="stratagem-detail-copy" data-stratagem-copy></div><p class="stratagem-dialog-status" data-stratagem-dialog-status hidden></p><button type="button" class="quick-stratagem-spend" data-stratagem-dialog-spend>CP 사용</button>';document.body.append(dialog);dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});}
  const secondaryCost=Number(stratagem.secondaryEffectCost)||0,paragraphs=[["시점","when"],["대상","target"],["효과","effect"],[secondaryCost?`추가 효과 (+${secondaryCost} CP)`:"추가 효과","secondaryEffect"],["제한","restrictions"]].map(([label,field])=>[label,stratagemFieldText(stratagem,field)]).filter(([,value])=>value).map(([label,value])=>`<p><b>${label}</b> ${renderRuleMarkup(value)}</p>`).join("");
  dialog.dataset.stratagemId=id;dialog.dataset.stratagemCost=String(Number(stratagem.cp)||0);dialog.querySelector("[data-stratagem-title]").textContent=`${name} · ${stratagem.cp} CP`;dialog.querySelector("[data-stratagem-copy]").innerHTML=paragraphs||"<p>표시할 설명이 없습니다.</p>";const spend=dialog.querySelector("[data-stratagem-dialog-spend]"),status=dialog.querySelector("[data-stratagem-dialog-status]");spend.textContent=used?"사용 완료":"CP 사용";spend.disabled=used;status.hidden=true;status.textContent="";if(!dialog.open)dialog.showModal();
}
function useStratagemFromDialog(dialog){
  const id=dialog.dataset.stratagemId,cost=Number(dialog.dataset.stratagemCost)||0,button=dialog.querySelector("[data-stratagem-dialog-spend]");if(!id||!button||button.disabled)return;
  if(cpValue<cost){const status=dialog.querySelector("[data-stratagem-dialog-status]");status.textContent=`CP가 부족합니다. 현재 ${cpValue} CP이며 ${cost} CP가 필요합니다.`;status.hidden=false;return;}
  cpValue-=cost;try{localStorage.setItem("40k-cp",String(cpValue));localStorage.setItem(`40k-assistant:${id}`,"1");}catch{}document.querySelectorAll("[data-cp-output]").forEach(output=>output.textContent=String(cpValue));document.querySelectorAll(`[data-stratagem-check="${CSS.escape(id)}"]`).forEach(item=>{item.textContent="사용 완료";item.disabled=true;item.dataset.cpSpent="1";});button.textContent="사용 완료";button.disabled=true;dialog.close();renderQuickStratagemNav();if(!$("stratagem-page").hidden)$("stratagem-page").innerHTML=renderStratagemPage();
}
function renderAssistantPage(parsed){
  const tasks=makeAssistantTasks(parsed);
  const groups=assistantPhases.map(phase=>[phase,tasks.filter(x=>x.phase===phase)]);
  const initialPhaseIndex=Math.max(0,groups.findIndex(([,items])=>items.length));
  const emptyState=!parsed.units.length?"편성표를 분석하면 로스터별 체크 항목이 여기에 표시됩니다.":!db.units.length?$("data-status")?.textContent||"진영 데이터 연결을 기다리는 중입니다.":tasks.length?"":"로스터의 데이터시트에서 자동으로 분류할 체크 항목을 찾지 못했습니다."
  const tabs=groups.map(([phase],i)=>`<button type="button" class="phase-tab ${i===initialPhaseIndex?"active":""}" data-phase="${escapeHtml(phase)}">${escapeHtml(phase)} <span>${tasks.filter(x=>x.phase===phase).length}</span></button>`).join("");
  const panels=groups.map(([phase,items],i)=>`<section class="phase-panel" data-phase-panel="${escapeHtml(phase)}" ${i!==initialPhaseIndex?"hidden":""}><h3>${escapeHtml(phase)}</h3>${items.length?`<div class="assistant-list">${items.map((x,j)=>{const title=`${x.unit} › ${x.label}`;return `<div class="check-row ${assistantChecked(x.id)?"checked":""}"><input id="assistant-${escapeHtml(x.id)}-${i}-${j}" type="checkbox" data-assistant-check="${escapeHtml(x.id)}" ${assistantChecked(x.id)?"checked":""}><button type="button" class="assistant-detail-trigger check-copy" data-assistant-detail-title="${escapeHtml(title)}" data-assistant-detail-text="${escapeHtml(x.detail)}" aria-label="${escapeHtml(title)} 설명 보기"><b>${escapeHtml(x.unit)} <i>›</i> ${escapeHtml(x.label)}</b><span aria-hidden="true">ⓘ</span></button><span class="assistant-rules">${x.spendCp!==undefined?`<button type="button" class="quiet stratagem-spend" data-spend-cp="${x.spendCp}" data-stratagem-check="assistant-${escapeHtml(x.id)}" ${assistantChecked(x.id)?"disabled":""}>${assistantChecked(x.id)?"사용 완료":"CP 사용"}</button>`:x.source.split("|").filter(s=>s&&!s.startsWith("effect:")).map(s=>renderKeywordButton(s)).join(" ")}</span></div>`}).join("")}</div>`:`<p class="phase-empty">이 단계에 자동으로 분류된 체크 항목이 없습니다.</p>`}</section>`).join("");
  return `<div class="assistant-heading"><div class="assistant-intro"><p class="eyebrow">ROSTER AWARE</p><h2>전투 보조 체크리스트</h2><p>전투 단계별 로스터 확인은 탭에서, 스트라타젬은 하단 보관함에서 따로 확인합니다.</p></div><button type="button" class="quiet" data-reset-assistant>체크 초기화</button></div><section class="cp-tracker"><strong>CP</strong><button type="button" class="wound-button" data-cp="minus" aria-label="CP 감소">−</button><output id="cp-value" data-cp-output>${cpValue}</output><button type="button" class="wound-button" data-cp="plus" aria-label="CP 증가">+</button><small>현재 CP를 직접 추적합니다 · 브라우저 저장</small></section>${renderDetachmentRules()}${emptyState?`<p class="empty">${escapeHtml(emptyState)}</p>`:""}<nav class="phase-tabs" aria-label="전투 단계">${tabs}</nav>${panels}<p class="assistant-footnote">능력 문구가 데이터에서 누락되었거나 판본이 다른 경우, 해당 데이터시트 원문과 실제 게임 판본을 기준으로 확인하세요. 체크 상태는 이 브라우저에 저장됩니다.</p>`;
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
function weaponShortDisplayName(p){
  const full=profileDisplayName(p),english=String(p.name||"").trim();
  const suffix=english?` (${english})`:"";
  return suffix&&full.endsWith(suffix)?full.slice(0,-suffix.length):full;
}
function applyFactionTheme(faction=""){
  const key=normalizeFactionAlias(faction),palettes=[
    [/ultramarines/,"ultramarines","76,145,255"],[/bloodangels/,"blood-angels","224,77,83"],[/darkangels/,"dark-angels","107,175,126"],[/blacktemplars/,"black-templars","204,213,225"],[/spacewolves/,"space-wolves","111,181,215"],[/deathwatch/,"deathwatch","176,190,205"],[/imperialfists/,"imperial-fists","237,190,79"],[/ironhands/,"iron-hands","148,166,180"],[/ravenguard/,"raven-guard","161,165,198"],[/salamanders/,"salamanders","106,192,119"],[/whitescars/,"white-scars","221,224,228"],
    [/adeptuscustodes/,"custodes","222,183,83"],[/adeptasororitas/,"sororitas","225,115,143"],[/adeptusmechanicus/,"mechanicus","221,111,78"],[/astramilitarum/,"astra-militarum","125,169,207"],[/imperialknights/,"imperial-knights","204,177,105"],[/greeknights/,"grey-knights","172,185,204"],[/agentsoftheimperium|imperialagents/,"imperial-agents","190,197,208"],[/adeptusastartes|spacemarines|imperium/,"imperium","208,183,111"],
    [/worldeaters/,"world-eaters","222,73,73"],[/deathguard/,"death-guard","151,177,107"],[/thousandsons/,"thousand-sons","94,190,210"],[/emperorschildren/,"emperors-children","193,113,209"],[/chaosdaemons/,"chaos-daemons","211,100,110"],[/chaosknights/,"chaos-knights","197,89,104"],[/chaosspacemarines/,"chaos-marines","190,105,132"],[/titanicustraitoris/,"titanicus-traitoris","177,103,151"],[/chaos/,"chaos","199,111,142"],
    [/drukhari/,"drukhari","184,121,218"],[/aeldari|craftworlds/,"aeldari","108,195,194"],[/tyranids/,"tyranids","173,125,213"],[/necrons/,"necrons","98,207,174"],[/orks/,"orks","142,190,91"],[/tauempire/,"tau","91,199,211"],[/genestealercults/,"genestealer-cults","204,110,174"],[/leaguesofvotann/,"votann","224,147,83"],[/unalignedforces/,"unaligned","176,169,147"]
  ];
  const match=palettes.find(([pattern])=>pattern.test(key));
  const rgb=match?.[2]||"183,219,136";
  document.body.dataset.factionTheme=match?.[1]||"default";
  document.body.style.setProperty("--faction-accent-rgb",rgb);
  document.body.style.setProperty("--faction-accent",`rgb(${rgb})`);
  document.body.style.setProperty("--accent",`rgb(${rgb})`);
}
function adaptBsData(raw,edition="11판",file="",relatedRaw=[]){
  const c=raw.catalogue||raw,related=relatedRaw.map(x=>x.catalogue||x);indexRuleDescriptions(c);for(const catalogue of related)indexRuleDescriptions(catalogue);const entries=c.sharedSelectionEntries||[],groups=c.sharedSelectionEntryGroups||[],relatedEntries=related.flatMap(x=>[...(x.sharedSelectionEntries||[]),...(x.sharedSelectionEntryGroups||[])]),byId=new Map([...relatedEntries,...entries,...groups].map(x=>[x.id,x])),sharedProfiles=[...(c.sharedProfiles||[]),...related.flatMap(x=>x.sharedProfiles||[])],profileById=new Map(sharedProfiles.filter(x=>x.id).map(x=>[x.id,x]));
  const units=entries.filter(e=>["unit","model"].includes(e.type)).map(e=>{
    const profiles=[], seen=new Set();
    const walk=(x,depth=0)=>{if(!x||depth>10||seen.has(x.id)||/crusade|battle honours?|reclaimed relic/i.test(x.name||""))return;if(x.id)seen.add(x.id);for(const p of x.profiles||[])profiles.push(p);for(const link of x.infoLinks||[]){const profile=profileById.get(link.targetId);if(!profile)continue;const linked={...profile};for(const modifier of link.modifiers||[])if(modifier.field==="name"){if(modifier.type==="append")linked.name=(linked.name||"")+modifier.value;else if(modifier.type==="prepend")linked.name=modifier.value+(linked.name||"");else if(modifier.type==="set")linked.name=String(modifier.value);}profiles.push(linked);}for(const k of ["selectionEntries","selectionEntryGroups","entryLinks"]){for(const child of x[k]||[]){if(/crusade|battle honours?|reclaimed relic|enhancement/i.test(child.name||""))continue;const target=child.targetId?byId.get(child.targetId):child;if(target)walk(target,depth+1);}}};
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
function fetchBsDataFile(file){
  const key=norm(file);if(bsDataFileCache.has(key))return bsDataFileCache.get(key);
  const url=BSDATA_BASE+encodeURIComponent(file),mirror=url.replace("https://raw.githubusercontent.com/BSData/wh40k-11e/main/","https://cdn.jsdelivr.net/gh/BSData/wh40k-11e@main/");
  const request=(async()=>{let lastError;for(const candidate of [url,mirror])try{const response=await fetch(candidate);if(!response.ok)throw new Error(`${file}: HTTP ${response.status}`);return await response.json();}catch(error){lastError=error;}throw lastError||new Error(`${file}: 연결 실패`);})();
  bsDataFileCache.set(key,request);request.catch(()=>{if(bsDataFileCache.get(key)===request)bsDataFileCache.delete(key);});return request;
}
async function fetchConnectedCatalogues(seedFiles,requestToken){
  const catalogues=new Map(),seen=new Set(),queue=[...seedFiles],failed=[];
  while(queue.length){const batch=queue.splice(0,12).filter(file=>{const key=norm(file);if(seen.has(key))return false;seen.add(key);return true;});if(!batch.length)continue;
    const results=await Promise.all(batch.map(async file=>{try{return {file,raw:await fetchBsDataFile(file)};}catch(error){return {file,error};}}));if(requestToken!==catalogueLoadToken)return {catalogues:new Map(),failed:[]};
    for(const result of results){if(result.raw){catalogues.set(result.file,result.raw);const catalogue=result.raw.catalogue||result.raw;for(const link of catalogue.catalogueLinks||[]){if(link.type&&link.type!=="catalogue")continue;const name=String(link.name||"").trim();if(!name)continue;const linkedFile=/\.json$/i.test(name)?name:`${name}.json`;if(!seen.has(norm(linkedFile)))queue.push(linkedFile);}}else failed.push(`${result.file}: ${result.error?.message||"연결 실패"}`);}
    const completed=catalogues.size+failed.length,total=Math.max(completed+queue.length,seedFiles.length,1),percent=Math.max(currentConnectionProgress,22+Math.round(42*completed/total));
    updateDataConnectionProgress(percent,`BSData 카탈로그 확인 중 · ${completed}/${total}개 처리${queue.length?` · 대기 ${queue.length}개`:""}`);
  }
  return {catalogues,failed};
}
function loadCoreRulesFile(){if(!coreRulesLoadPromise)coreRulesLoadPromise=fetchBsDataFile(CORE_RULES_FILE).catch(error=>{coreRulesLoadPromise=null;throw error;});return coreRulesLoadPromise;}
let currentConnectionProgress=0;
function updateDataConnectionProgress(value,message,state="loading"){
  const progress=$("connection-progress"),percent=$("connection-progress-percent"),status=$("data-status"),panel=document.querySelector(".connection-progress-panel");
  currentConnectionProgress=Math.max(currentConnectionProgress,Math.max(0,Math.min(100,Number(value)||0)));
  if(progress)progress.value=currentConnectionProgress;
  if(percent)percent.textContent=state==="waiting"?"대기":`${Math.round(currentConnectionProgress)}%`;
  if(status){status.textContent=message;status.className=`data-status${state==="ready"?" ready":state==="error"?" error":""}`;}
  if(panel)panel.dataset.state=state;
}
async function loadRulesData(meta=parseRoster($("roster").value).meta){
  const files=catalogueFilesForFaction(meta.faction||"");
  if(!files.length){currentConnectionProgress=0;const requestToken=++catalogueLoadToken;activeCatalogueKey="";db={edition:"11판",source:"BSData 공개 저장소",sourceVersion:"진영 미확인",units:[]};updateDataConnectionProgress(8,`진영 데이터 파일을 특정하지 못했습니다: ${meta.faction||"진영 정보 없음"}. 공통 규칙 연결 중…`);try{const coreRaw=await loadCoreRulesFile();if(requestToken!==catalogueLoadToken)return;sourceRuleDescriptions.clear();sourceRuleDescriptionsById.clear();indexRuleDescriptions(coreRaw);updateDataConnectionProgress(100,"공통 규칙 연결됨 · 진영 편성표를 불러오면 카탈로그를 연결합니다.","ready");}catch(error){if(requestToken!==catalogueLoadToken)return;updateDataConnectionProgress(100,`진영 식별 실패 · 공통 규칙 연결도 실패 (${error?.message||"네트워크 오류"})`,"error");}render();return;}
  const key=files.join("|");if(key===activeCatalogueKey)return;currentConnectionProgress=0;activeCatalogueKey=key;const requestToken=++catalogueLoadToken;db={edition:"11판",source:`BSData · ${files.map(x=>x.replace(/\.json$/i,"")).join(" + ")}`,sourceVersion:"불러오는 중",units:[]};updateDataConnectionProgress(4,`11판 BSData 카탈로그 ${files.length}개와 공통 규칙 연결을 시작합니다…`);render();
  let rootDone=0;const rootResults=await Promise.all(files.map(async file=>{try{return {file,raw:await fetchBsDataFile(file)}}catch(error){return {file,error}}finally{rootDone++;updateDataConnectionProgress(8+Math.round(10*rootDone/files.length),`진영 카탈로그 확인 중 · ${rootDone}/${files.length}개 완료`);}}));if(requestToken!==catalogueLoadToken)return;
  const primary=rootResults.filter(item=>item.raw).map(item=>({file:item.file,raw:item.raw}));sourceRuleDescriptions.clear();sourceRuleDescriptionsById.clear();for(const item of primary)indexRuleDescriptions(item.raw);
  if(primary.length){const initial=primary.map(item=>adaptBsData(item.raw,"11판",item.file,primary.map(entry=>entry.raw))),units=Array.from(new Map(initial.flatMap(item=>item.units).map(unit=>[`${unit.edition}|${unit.id}`,unit])).values());db={edition:"11판",source:`BSData · ${primary.map(item=>item.file.replace(/\.json$/i,"")).join(" + ")}`,sourceVersion:`BSData 데이터시트 ${units.length}개 · 공통 규칙/세부 문구 연결 중`,units};updateDataConnectionProgress(20,`데이터시트 ${units.length}개 준비됨 · 연결 카탈로그와 공통 규칙을 이어서 불러옵니다…`);render();}
  updateDataConnectionProgress(22,"연결 카탈로그·공통 규칙·40kdc 보조 데이터를 확인 중…");let taskCount=0;const trackTask=(promise,label)=>promise.finally(()=>{taskCount++;updateDataConnectionProgress(64+Math.round(taskCount*8/3),`${label} 완료 · 추가 자료 ${taskCount}/3개 확인`);});
  const [{catalogues,failed},coreResult,fortykdcResult]=await Promise.all([trackTask(fetchConnectedCatalogues(files,requestToken),"연결 카탈로그"),trackTask(loadCoreRulesFile().then(raw=>({raw}),error=>({error})),"공통 규칙"),trackTask(loadFortykdcFallback(meta.faction||"",requestToken),"40kdc 보조 데이터")]);if(requestToken!==catalogueLoadToken)return;
  const completePrimary=files.map(file=>({file,raw:catalogues.get(file)})).filter(item=>item.raw),coreRaw=coreResult.raw;updateDataConnectionProgress(92,"규칙 본문 색인과 유닛 중복 정리 중…");if(!completePrimary.length){sourceRuleDescriptions.clear();sourceRuleDescriptionsById.clear();if(coreRaw)indexRuleDescriptions(coreRaw);const fallback=fortykdcResult.units;db={edition:"11판",source:"40kdc-data 보조 데이터",sourceVersion:`BSData 연결 실패 · 40kdc 보조 데이터 ${fallback.length}개${coreRaw?" + 공통 규칙":""}`,units:fallback};updateDataConnectionProgress(100,fallback.length?`BSData 연결 실패 · 40kdc 보조 데이터 ${fallback.length}개로 대체 표시${fortykdcResult.failed?` · 미지원 ${fortykdcResult.failed}개`:""}`:`11판 진영 데이터 연결 실패 (${failed[0]||"BSData 저장소에서 파일을 찾지 못했습니다"})`,fallback.length?"ready":"error");render();return;}
  sourceRuleDescriptions.clear();sourceRuleDescriptionsById.clear();if(coreRaw)indexRuleDescriptions(coreRaw);const linkedRaw=[...catalogues.values(),...(coreRaw?[coreRaw]:[])];for(const raw of linkedRaw)indexRuleDescriptions(raw);const adapted=completePrimary.map(item=>adaptBsData(item.raw,"11판",item.file,linkedRaw)),bsUnits=Array.from(new Map(adapted.flatMap(item=>item.units).map(unit=>[`${unit.edition}|${unit.id}`,unit])).values()),bsNames=new Set(bsUnits.flatMap(unit=>[unit.name,...(unit.aliases||[])].map(normalizeMatchName))),fallback=fortykdcResult.units.filter(unit=>![unit.name,...(unit.aliases||[])].map(normalizeMatchName).some(name=>bsNames.has(name))).map(unit=>({...unit,nameKo:translateTerms(unit.name)})),allUnits=[...bsUnits,...fallback];db={edition:"11판",source:`BSData · ${files.map(file=>file.replace(/\.json$/i,"")).join(" + ")} · 연결 카탈로그 ${catalogues.size}개${coreRaw?" + 공통 규칙":""} · 40kdc 보조`,sourceVersion:`11판 BSData ${bsUnits.length}개 · 40kdc 보조 ${fallback.length}개${coreRaw?" + 공통 규칙":""}`,units:allUnits};
  const connectionMessage=`연결됨 · BSData ${bsUnits.length}개 · 40kdc 보조 ${fallback.length}개 · 연결 카탈로그 ${catalogues.size}개${coreRaw?" · 공통 규칙 포함":" · 공통 규칙 파일 연결 실패"}${failed.length?` · 참조 파일 실패 ${failed.length}개`:""}${fortykdcResult.failed?` · 40kdc 미지원 ${fortykdcResult.failed}개`:""}`;updateDataConnectionProgress(100,connectionMessage,failed.length||!coreRaw?"error":"ready");render();
}
function canonicalStratFaction(meta){const f=norm(meta.faction||"");if(/ultramarines|bloodangels|darkangels|blacktemplars|spacewolves|deathwatch|imperialfists|ironhands|ravenguard|salamanders|whitescars|adeptusastartes|spacemarines/.test(f))return "Space Marines";if(/craftworlds|asuryani|aeldari/.test(f))return "Aeldari";if(/chaosdaemons|daemons/.test(f))return "Chaos Daemons";if(/agentsoftheimperium/.test(f))return "Imperial Agents";return (meta.faction||"").split(" - ").filter(Boolean).at(-1)||"";}
function gameDataCardSlugs(meta){let f=norm(meta.faction||"");for(const [korean,english] of KOREAN_FACTION_ALIASES)if(f.includes(korean)){f=norm(english);break;}if(/ultramarines|bloodangels|darkangels|blacktemplars|spacewolves|deathwatch|imperialfists|ironhands|ravenguard|salamanders|whitescars|adeptusastartes|spacemarines/.test(f)){const slugs=["space_marines"],chapter=[["blacktemplars","blacktemplar"],["bloodangels","bloodangels"],["darkangels","darkangels"],["deathwatch","deathwatch"],["spacewolves","spacewolves"]].find(([key])=>f.includes(key));if(chapter)slugs.push(chapter[1]);return slugs;}const entries=[["adeptasororitas","adeptasororitas"],["adeptuscustodes","adeptuscustodes"],["adeptusmechanicus","adeptusmechanicus"],["aeldari","aeldari"],["craftworlds","aeldari"],["agentsoftheimperium","agents"],["imperialagents","agents"],["astramilitarum","astramilitarum"],["imperialknights","imperialknights"],["greyknights","greyknights"],["chaosspacemarines","chaos_spacemarines"],["chaosdaemons","chaosdaemons"],["chaosknights","chaosknights"],["emperorschildren","emperors_children"],["deathguard","deathguard"],["thousandsons","thousandsons"],["worldeaters","worldeaters"],["genestealercults","gsc"],["leaguesofvotann","votann"],["drukhari","drukhari"],["necrons","necrons"],["orks","orks"],["tauempire","tau"],["tyranids","tyranids"]].find(([alias])=>f.includes(alias));return entries?[entries[1]]:[];}
const gameDataCardsBase="https://raw.githubusercontent.com/game-datacards/datasources/main/11th/gdc/";
function localizedRuleValue(value,language="ko"){if(value&&typeof value==="object")return String(value[language]||value.en||Object.values(value).find(x=>typeof x==="string")||"");return String(value??"");}
function detachmentLabel(value=currentRosterMeta.detachment||""){return String(value).replace(/\s*\(\s*\d+\s+detachment\s+points?\s*\)\s*$/i,"").replace(/^(?:detachment|편제)\s*:\s*/i,"").trim();}
function detachmentNameMatches(a,b){const na=norm(a||""),nb=norm(b||"");if(!na||!nb)return false;if(na===nb)return true;const equivalents=value=>{const key=norm(value),out=new Set([key,norm(translateTerms(String(value||"")))]);for(const table of [translations,termTranslations,v2LabelTranslations])for(const [english,korean] of table)if(norm(english)===key||norm(korean)===key){out.add(norm(english));out.add(norm(korean));}return out;},aNames=equivalents(a),bNames=equivalents(b);return [...aNames].some(name=>bNames.has(name));}
function gameDataDetachmentMatches(source,item,selected){if(detachmentNameMatches(item.detachment,selected))return true;const catalogue=(source.detachments||[]).find(det=>item.detachment_id&&det.id===item.detachment_id||detachmentNameMatches(localizedRuleValue(det.name,"en"),selected)||detachmentNameMatches(localizedRuleValue(det.name,"ko"),selected));return Boolean(catalogue&&[localizedRuleValue(catalogue.name,"en"),localizedRuleValue(catalogue.name,"ko")].some(name=>detachmentNameMatches(name,selected)));}
function externalRuleText(value){return String(value??"").replace(/\r/g,"\n").replace(/<br\s*\/?\s*>/gi,"\n").replace(/<\/(?:p|div|li|ul|ol)>/gi,"\n").replace(/<li\b[^>]*>/gi,"• ").replace(/<[^>]*>/g,"").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").trim();}
function renderDetachmentRules(){const selected=detachmentLabel();if(!selected)return "";const cards=detachmentRules.map(rule=>{const name=localizedRuleValue(rule.name)||"편제 능력",parts=(rule.rules||[]).map(item=>externalRuleText(localizedRuleValue(item.text||item.description))).filter(Boolean),englishParts=(rule.rules||[]).map(item=>externalRuleText(localizedRuleValue(item.text||item.description,"en"))).filter(Boolean),description=parts.join("\n\n"),original=englishParts.join("\n\n");return `<details class="detachment-rule"><summary>${escapeHtml(name)}${rule.name?.en?` <small>${escapeHtml(rule.name.en)}</small>`:""}</summary><div class="detachment-rule-text">${escapeHtml(description||"설명 본문이 데이터에 없습니다.")}</div>${original&&original!==description?`<details class="detachment-rule-original"><summary>영문 원문 보기</summary><div class="detachment-rule-text">${escapeHtml(original)}</div></details>`:""}</details>`;}).join("");return `<details class="detachment-rules"><summary>선택 편제 능력 <span>${escapeHtml(selected)}${detachmentRules.length?` · ${detachmentRules.length}개`:""}</span></summary>${cards||`<p class="quick-stratagem-status">${escapeHtml(detachmentRulesStatus||`현재 연결된 규칙 자료에서 “${selected}”의 편제 능력을 찾지 못했습니다.`)}</p>`}</details>`;}
async function loadCoreStratagems(){
  const requestToken=++stratLoadToken;coreStratagems=[];factionStratagemCount=0;factionDatasets=[];factionArmyRules=[];factionDetachmentCatalog=[];factionEnhancements=[];detachmentRules=[];detachmentEnhancements=[];detachmentRulesStatus="";stratagemLoadStatus="불러오는 중";renderQuickStratagemNav();if($("stratagem-page")&&!$("stratagem-page").hidden)$("stratagem-page").innerHTML=renderStratagemPage();
  let detachmentDataLoaded=false;
  try{
    let data=null,lastError=null;
    for(const url of STRATAGEM_DATA_URLS){
      try{const response=await fetch(url,{cache:"no-cache"});if(!response.ok)throw new Error(`HTTP ${response.status}`);const candidate=await response.json();if(!candidate?.factions||typeof candidate.factions!=="object")throw new Error("stratagem data schema mismatch");data=candidate;break;}
      catch(error){lastError=error;}
      if(requestToken!==stratLoadToken)return;
    }
    if(requestToken!==stratLoadToken)return;
    const all=[],isCore=(key,value)=>norm(key)==="core"||norm(localizedRuleValue(value.name,"en"))==="corerules";let commonSourceCount=0;
    if(data)for(const [key,value] of Object.entries(data.factions))if(isCore(key,value))for(const items of Object.values(value.detachments||{})){const validItems=(Array.isArray(items)?items:[]).filter(item=>item&&typeof item==="object"&&!item.noCp&&item.name).map(item=>({...item,isCore:true}));commonSourceCount+=validItems.length;all.push(...validItems);}
    const selected=detachmentLabel(),slugs=gameDataCardSlugs(currentRosterMeta);
    if(slugs.length){const fetched=await Promise.all(slugs.map(async slug=>{const urls=[`${gameDataCardsBase}${slug}.json`,`https://cdn.jsdelivr.net/gh/game-datacards/datasources@main/11th/gdc/${slug}.json`];let error;for(const url of urls)try{const response=await fetch(url,{cache:"force-cache"});if(!response.ok)throw new Error(`${slug}: HTTP ${response.status}`);return await response.json();}catch(e){error=e;}console.warn(`Detachment data unavailable for ${slug}`,error);return null;}));if(requestToken!==stratLoadToken)return;const datasets=fetched.filter(Boolean);detachmentDataLoaded=datasets.length>0;factionDatasets=datasets;factionArmyRules=datasets.flatMap(source=>source.rules?.army||[]);factionDetachmentCatalog=datasets.flatMap(source=>{const metadata=source.detachments||[],byId=new Map(metadata.map(item=>[item.id,item])),ruleEntries=(source.rules?.detachment||[]).map(item=>{const meta=byId.get(item.detachment_id)||metadata.find(candidate=>detachmentNameMatches(localizedRuleValue(candidate.name,"en"),item.detachment));return {...(meta||{}),...item,detachment:item.detachment||localizedRuleValue(meta?.name,"en"),sourceFaction:item.faction||meta?.faction||localizedRuleValue(source.name,"en"),metadata:meta||null};}),ruleIds=new Set(ruleEntries.map(item=>item.detachment_id||item.metadata?.id));return [...ruleEntries,...metadata.filter(item=>!ruleIds.has(item.id)).map(item=>({...item,detachment:localizedRuleValue(item.name,"en"),sourceFaction:item.faction||localizedRuleValue(source.name,"en"),metadata:item,rules:[]}))];});factionEnhancements=datasets.flatMap(source=>source.enhancements||[]);
      const detRules=datasets.flatMap(source=>(source.rules?.detachment||[]).filter(rule=>gameDataDetachmentMatches(source,rule,selected)).flatMap(rule=>rule.rules||[]));detachmentRules=Array.from(new Map(detRules.map(rule=>[`${norm(localizedRuleValue(rule.name,"en"))}|${norm((rule.rules||[]).map(item=>localizedRuleValue(item.text||item.description,"en")).join(" "))}`,rule])).values());detachmentEnhancements=factionEnhancements;
      const selectedStratagems=datasets.flatMap(source=>(source.stratagems||[]).filter(item=>item.detachment).map(item=>({id:`gdc11-${item.id}`,name:localizedRuleValue(item.name,"en"),nameKo:localizedRuleValue(item.name,"ko"),cp:item.cost,phases:item.phase||[],when:localizedRuleValue(item.when),target:localizedRuleValue(item.target),effect:localizedRuleValue(item.effect),secondaryEffect:localizedRuleValue(item.secondary_effect),secondaryEffectCost:item.secondary_effect_cost,restrictions:localizedRuleValue(item.restrictions),detachment:localizedRuleValue(item.detachment,"en"),detachmentFaction:item.detachment_faction||item.detachmentFaction||localizedRuleValue(source.name,"en"),isCore:false,source:"game-datacards 11th"})));factionStratagemCount=selectedStratagems.length;all.push(...selectedStratagems);
      detachmentRulesStatus=detachmentRules.length?"":datasets.length?`연결 데이터에서 선택 편제 “${selected||"(편제 미지정)"}” 규칙을 찾지 못했습니다.`:`편제 데이터 연결에 실패했습니다. 네트워크나 데이터 제공처 상태를 확인해 주세요.`;
    }else detachmentRulesStatus=`“${canonicalStratFaction(currentRosterMeta)||currentRosterMeta.faction||"현재 진영"}”의 편제 자료 파일을 찾지 못했습니다.`;
    if(requestToken!==stratLoadToken)return;
    coreStratagems=Array.from(new Map(all.filter(x=>!x.noCp&&x.name).map(x=>[x.id?`${x.isCore?"core":"faction"}|${x.id}`:`${norm(localizedRuleValue(x.name,"en")||x.name)}|${x.cp??x.cost}`,{...x,name:localizedRuleValue(x.name,"en")||x.name,nameKo:x.nameKo||localizedRuleValue(x.name,"ko"),cp:x.cp??x.cost}])).values());
    stratagemLoadStatus=coreStratagems.length?`연결 완료 · ${coreStratagems.filter(isCommonStratagem).length}개 공통${factionStratagemCount?` + 선택 편제 ${factionStratagemCount}개`:""}`:commonSourceCount?"연결 실패 · 공용 Core 항목에서 표시할 CP 스트라타젬을 찾지 못했습니다.":`연결 실패 · ${lastError?.message||"공용 Core 데이터가 비어 있습니다. 다시 연결해 주세요."}`;
    if($("assistant-page"))render();
  }catch(error){
    if(requestToken!==stratLoadToken)return;coreStratagems=[];factionStratagemCount=0;factionDatasets=[];factionArmyRules=[];factionDetachmentCatalog=[];factionEnhancements=[];detachmentRules=[];detachmentRulesStatus=error?.message||"네트워크 또는 데이터 형식 오류";stratagemLoadStatus=`연결 실패 · ${error?.message||"네트워크 또는 데이터 형식 오류"}`;console.warn("Stratagem data load failed",error);if($("assistant-page"))render();
  }
}
function applyV2TranslationPayload(payload,replace=false){
  if(!payload||!Array.isArray(payload.translations))return 0;
  if(replace){v2LabelTranslations.clear();v2RuleTranslations.clear();v2RuleTranslationsById.clear();}
  for(const raw of payload.translations){
    const item={...raw,edition:String(raw.edition||payload.edition||"")};
    if(item.kind==="label"&&item.name&&item.translation)v2LabelTranslations.set(textKey(item.name),item.translation);
    else if(item.name&&item.source&&item.translation){
      v2RuleTranslations.set(ruleFeedKey(item.name,item.source),item.translation);
      const idKey=ruleIdentityKey(item.id);if(idKey){const records=v2RuleTranslationsById.get(idKey)||[],recordKey=entry=>`${sourceFileKey(entry.file)}|${textKey(entry.kind)}|${ruleFeedKey(entry.name,entry.source)}`,existing=records.findIndex(entry=>recordKey(entry)===recordKey(item));if(existing>=0)records[existing]=item;else records.push(item);v2RuleTranslationsById.set(idKey,records);}
    }
  }
  return payload.translations.length;
}
const bundledTranslationCount=applyV2TranslationPayload(window.WARHAMMER_APPROVED_TRANSLATIONS,true);
function loadV2TranslationFeed(){
  const button=$("load-translations"),status=$("translation-feed-status");
  if(!v2TranslationFeed){if(status){status.textContent="번역 피드 주소를 입력하면 승인된 번역을 불러와 편성표에 적용합니다.";status.className="translation-feed-status";}return;}
  if(button){button.disabled=true;button.setAttribute("aria-busy","true");button.innerHTML='<span class="translation-loading-gear" aria-hidden="true">⚙</span><span>번역 불러오는 중…</span>';}
  if(status){status.textContent=`Google Sheets에서 최신 승인 번역 확인 중… · GitHub 번역 ${bundledTranslationCount}개 적용됨`;status.className="translation-feed-status";}
  let feedUrl;try{feedUrl=new URL(v2TranslationFeed);if(feedUrl.protocol!=="https:"||feedUrl.hostname!=="script.google.com"&&feedUrl.hostname!=="script.googleusercontent.com")throw new Error("Google Apps Script HTTPS 웹 앱 주소를 확인하세요.");}catch(err){finishError(err.message||"주소 형식이 올바르지 않습니다.");return;}
  const callback=`v2Translation_${Date.now()}_${Math.floor(Math.random()*1e6)}`,script=document.createElement("script");feedUrl.searchParams.set("callback",callback);
  const cleanup=()=>{delete window[callback];script.remove();if(button){button.disabled=false;button.removeAttribute("aria-busy");button.textContent="시트 최신 번역 불러오기";}};
  const timer=setTimeout(()=>finishError("응답 시간이 초과됐습니다. 배포 URL과 웹 앱 액세스 설정을 확인하세요."),60000);
  function finishError(message){clearTimeout(timer);cleanup();if(status){status.textContent=`Google Sheets 최신 확인 실패 · GitHub 번역 ${bundledTranslationCount}개 사용 중 · ${message}`;status.className="translation-feed-status error";}}
  window[callback]=payload=>{clearTimeout(timer);if(!payload||!Array.isArray(payload.translations)){finishError("피드 응답 형식이 예상과 다릅니다.");return;}applyV2TranslationPayload(payload,true);cleanup();if(status){status.textContent=`GitHub 기본 번역 ${bundledTranslationCount}개 적용 · Google Sheets 승인 번역 ${payload.translations.length}개 최신본 적용`;status.className="translation-feed-status ready";}render();};
  script.onerror=()=>finishError("웹 앱에서 익명 접근을 허용하는지 확인하세요.");script.src=feedUrl.toString();document.head.appendChild(script);
}
function normalizeLoadoutText(value=""){return String(value).normalize("NFKC").toLowerCase().replace(/[^a-z0-9가-힣]+/g," ").replace(/\s+/g," ").trim();}
function weaponBaseName(profile){return String(profile?.name||"").replace(/^[\s➤▶▸→➢]+/u,"").split(/\s+-\s+/)[0].replace(/\s*\([^)]*\)\s*$/,"" ).trim();}
function weaponProfileModeName(profile){const name=String(profile?.name||"").replace(/^[\s➤▶▸→➢]+/u,""),base=weaponBaseName(profile);return name.slice(base.length).replace(/^\s*(?:-|\()\s*/,"").replace(/\)\s*$/ ,"").trim();}
function weaponRosterAliases(name=""){
  const key=normalizeLoadoutText(weaponBaseName({name}));
  const aliases={
    "master-crafted chainsword":["명장제조 체인소드"],
    "astartes chainsword":["체인소드"],
    "chainsword":["체인소드"],
    "master-crafted bolter":["명장제조 볼터","명장제조 볼트건"],
    "power fist":["파워 피스트"],
    "boltgun":["bolt gun","볼트건","볼트 건","볼터"],
    "bolt gun":["boltgun","볼트건","볼트 건","볼터"],
    "bolt rifle":["볼트 라이플","볼트 소총"],
    "bolt pistol":["볼트 피스톨","볼트 권총"],
    "scout shotgun":["shotgun","샷건"],
    "astartes shotgun":["shotgun","샷건"],
    "shotgun":["샷건"],
    "combat shotgun":["전투 샷건","샷건"],
    "heavy bolter":["헤비 볼터","헤비볼터"],
    "missile launcher":["rocket launcher","미사일 런처","미사일 발사기","로켓 런처"],
    "scout sniper rifle":["sniper rifle","저격 소총","스나이퍼 라이플"],
    "sniper rifle":["저격 소총","스나이퍼 라이플","저격총"],
    "pyreblaster":["파이어블래스터","파이어 블래스터","파이어블라스터","파이어 블라스터","파이어 블래스터"],
    "close combat weapon":["근접 무기","근접전 무기"]
  };
  return aliases[key]||[];
}
function weaponLabels(profile){const names=[profile?.name,weaponBaseName(profile),weaponName(profile?.name||""),weaponName(weaponBaseName(profile)),weaponName(profile?.name||"").match(/^(.+?)\s+\([^)]+\)$/)?.[1],weaponName(weaponBaseName(profile)).match(/^(.+?)\s+\([^)]+\)$/)?.[1],translateTerms(profile?.name||""),translateTerms(weaponBaseName(profile)),profileDisplayName(profile),...weaponRosterAliases(profile?.name||"")];return [...new Set(names.filter(Boolean))].sort((a,b)=>b.length-a.length);}
function loadoutHasWeaponLabels(loadout,labels){const padded=` ${normalizeLoadoutText(loadout)} `;return labels.map(normalizeLoadoutText).filter(label=>/[가-힣]/.test(label)?label.replace(/\s/g,"").length>=2:label.length>=4).some(label=>padded.includes(` ${label} `));}
function weaponIsEquipped(profile,loadout,profileSet=[]){
  if(!loadout)return false;
  const variant=String(profile?.name||"").match(/^(.+?)\s+-\s+(.+)$/),base=weaponBaseName(profile);
  const peers=(profileSet||[]).filter(candidate=>candidate!==profile&&normalizeLoadoutText(weaponBaseName(candidate))===normalizeLoadoutText(base));
  if(variant&&peers.length){
    const specific=[profile.name,profileDisplayName(profile),translateTerms(profile.name)];
    if(loadoutHasWeaponLabels(loadout,specific))return true;
    const modeProfiles=[profile,...peers].filter(candidate=>/\s+-\s+/.test(candidate.name||"")&&!/\b(?:standard|supercharged)\b/i.test(candidate.name||""));
    if(modeProfiles.length>1){
      if(modeProfiles.some(candidate=>loadoutHasWeaponLabels(loadout,[candidate.name,profileDisplayName(candidate),translateTerms(candidate.name)])))return modeProfiles.includes(profile);
      if(loadoutHasWeaponLabels(loadout,[base,translateTerms(base),...weaponRosterAliases(base)]))return modeProfiles.includes(profile);
    }
    if(peers.some(candidate=>loadoutHasWeaponLabels(loadout,[candidate.name,profileDisplayName(candidate),translateTerms(candidate.name)])))return false;
    if(/\bstandard\b/i.test(variant[2]))return loadoutHasWeaponLabels(loadout,[base,translateTerms(base),...weaponRosterAliases(base)]);
    if(/\bsupercharged\b/i.test(variant[2]))return false;
    // A base weapon name (e.g. Bolt Rifle) equips every firing profile
    // belonging to that physical weapon (e.g. Focused Fire and Saturation).
    return loadoutHasWeaponLabels(loadout,[base,translateTerms(base),...weaponRosterAliases(base)]);
  }
  return loadoutHasWeaponLabels(loadout,weaponLabels(profile));
}
function replaceRosterWeaponChoice(unitIndex,targetName,targetType,sourceName=""){
  const box=$("roster"),source=box.value,parsed=parseRoster(source),unit=parsed.units[unitIndex],target=findDataUnit(unit?.rosterName);
  if(!unit||!target||target.candidates)return {message:"유닛 데이터를 확정하지 못해 원본을 수정하지 않았습니다."};
  const data=target.unit,category=/ranged/i.test(targetType)?"ranged":/melee/i.test(targetType)?"melee":"other",sameCategory=p=>/weapon/i.test(p.typeName||"")&&(category==="ranged"?/ranged/i.test(p.typeName||""):category==="melee"?/melee/i.test(p.typeName||""):!/ranged|melee/i.test(p.typeName||"")),all=(data.profiles||[]).filter(sameCategory),gear=normalizeLoadoutText([unit.equipment||"",...(unit.equipmentLines||[])].join(" ")),active=all.filter(p=>weaponIsEquipped(p,gear,all)),activeBases=[...new Map(active.map(p=>[normalizeLoadoutText(weaponBaseName(p)),p])).values()],desired=all.find(p=>p.name===targetName);
  if(!desired)return {message:"선택한 무기 프로필을 찾지 못했습니다."};
  const current=sourceName?activeBases.find(p=>normalizeLoadoutText(weaponBaseName(p))===normalizeLoadoutText(sourceName)):activeBases.length===1?activeBases[0]:null;
  if(!current&&activeBases.length>1)return {needsChoice:true,choices:activeBases.map(p=>({name:weaponBaseName(p),label:profileDisplayName(p)}))};
  if(!current)return {message:"현재 장착 무기를 원문에서 찾지 못했습니다. 편성표의 장비 표기를 확인해 주세요."};
  if(normalizeLoadoutText(weaponBaseName(current))===normalizeLoadoutText(weaponBaseName(desired)))return {message:"이미 같은 무기가 장착되어 있습니다."};
  const lines=source.split(/\r?\n/),start=unit.sourceLineIndex,end=parsed.units[unitIndex+1]?.sourceLineIndex??lines.length,matchLabels=weaponLabels(current).filter(x=>x.length>=4),matches=[];
  for(let i=start;i<end;i++){const line=lines[i]||"";if(i!==start&&!/^\s*[•●▪*-]/.test(line))continue;for(const label of matchLabels){const haystack=line.toLocaleLowerCase(),needle=label.toLocaleLowerCase();let at=0;while((at=haystack.indexOf(needle,at))>=0){matches.push({lineIndex:i,at,label});at+=needle.length;}}}
  const unique=[...new Map(matches.map(m=>[`${m.lineIndex}:${m.at}`,m])).values()],oneRepeatedEntry=unique.length>1&&new Set(unique.map(m=>`${m.lineIndex}|${m.label}`)).size===1;
  if(!unique.length||unique.length>1&&!oneRepeatedEntry)return {message:"선택한 장착 무기의 원문 위치를 하나로 특정하지 못했습니다. 편성표는 그대로 두었습니다."};
  const found=unique[0],raw=lines[found.lineIndex],isKorean=/[가-힣]/.test(found.label),replacement=isKorean?(weaponRosterAliases(weaponBaseName(desired))[0]||translateTerms(weaponBaseName(desired))||weaponBaseName(desired)):weaponBaseName(desired);
  if(oneRepeatedEntry){const escaped=found.label.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");lines[found.lineIndex]=raw.replace(new RegExp(escaped,"gi"),replacement);}else lines[found.lineIndex]=raw.slice(0,found.at)+replacement+raw.slice(found.at+found.label.length);
  box.value=lines.join("\n");return {ok:true,message:"편성표 원문의 무기 장비를 바꿨습니다."};
}
function rosterAttachedRoleLabel(role){return ({Leader:"리더",Bodyguard:"경호 유닛",Support:"지원",리더:"리더",경호원:"경호 유닛",지원:"지원"})[role]||role||"";}
function rosterAttachmentParents(units){
  const parents=new Map(),groups=new Map();
  const role=unit=>String(unit.attachedAs||"").toLowerCase();
  const isBodyguard=unit=>/^(?:bodyguard|경호원)$/.test(role(unit));
  const isLeader=unit=>/^(?:leader|리더)$/.test(role(unit));
  const isAttachedCharacter=unit=>{
    if(/^(?:leader|support|리더|지원)$/.test(role(unit)))return true;
    const found=findDataUnit(unit.rosterName),keywords=found?.unit?.keywords||[];
    return keywords.some(keyword=>/^(?:character|캐릭터)$/i.test(String(keyword)));
  };
  const matchAttachedTo=(unit,index)=>{
    if(!unit.attachedTo)return -1;
    const target=normalizeMatchName(unit.attachedTo);
    if(!target)return -1;
    const exact=units.findIndex((candidate,i)=>i!==index&&normalizeMatchName(candidate.rosterName)===target);
    if(exact>=0)return exact;
    const candidates=units.map((candidate,i)=>({i,name:normalizeMatchName(candidate.rosterName)}))
      .filter(candidate=>candidate.i!==index&&candidate.name&&(target.includes(candidate.name)||candidate.name.includes(target)))
      .sort((a,b)=>b.name.length-a.name.length);
    return candidates[0]?.i??-1;
  };
  let groupKey="",groupMembers=[];
  const saveGroup=()=>{if(groupMembers.length>1){if(!groups.has(groupKey))groups.set(groupKey,[]);groups.get(groupKey).push(...groupMembers);}groupMembers=[];};
  units.forEach((unit,index)=>{if(unit.attachedGroup!==groupKey){saveGroup();groupKey=unit.attachedGroup||"";}if(unit.attachedGroup)groupMembers.push(index);});saveGroup();
  for(const members of groups.values()){
    if(members.length<2)continue;
    const host=members.find(index=>isBodyguard(units[index]))??members.find(index=>!units[index].attachedAs)??members.find(index=>isLeader(units[index]))??members[0];
    for(const index of members)if(index!==host&&!units[index].attachedTo)parents.set(index,host);
  }
  units.forEach((unit,index)=>{const explicit=matchAttachedTo(unit,index);if(explicit<0)return;const target=units[explicit],currentIsAttached=isAttachedCharacter(unit),targetIsAttached=isAttachedCharacter(target);if(targetIsAttached&&!currentIsAttached)parents.set(explicit,index);else parents.set(index,explicit);});
  return parents;
}
function rosterUnitRenderOrder(units){
  const parents=rosterAttachmentParents(units),children=new Map(),order=[],emitted=new Set();
  const roleRank=unit=>{const role=String(unit.attachedAs||"").toLowerCase();return /^(?:leader|리더)$/.test(role)?0:/^(?:support|지원)$/.test(role)?1:2;};
  for(const [child,parent] of parents){if(!children.has(parent))children.set(parent,[]);children.get(parent).push(child);}
  const appendGroup=(root,depth=0)=>{if(emitted.has(root)||depth>units.length)return;order.push(root);emitted.add(root);const attached=children.get(root)||[];attached.sort((a,b)=>roleRank(units[a])-roleRank(units[b])||a-b);for(const child of attached)appendGroup(child,depth+1);};
  units.forEach((_,index)=>{if(!parents.has(index))appendGroup(index);});
  units.forEach((_,index)=>{if(!emitted.has(index))appendGroup(index);});
  return order;
}
function weaponEquippedModelCount(profile,rosterUnit,unitCount,profileSet=[]){
  const assignments=(rosterUnit.modelLoadouts||[]).flatMap(group=>group.items.filter(item=>weaponIsEquipped(profile,item.name,profileSet)).map(item=>({group,count:item.count})));
  if(assignments.length)return Math.min(Math.max(1,Number(unitCount)||1),assignments.reduce((sum,item)=>sum+item.count,0));
  const lines=[rosterUnit.equipment||"",...(rosterUnit.equipmentLines||[])].map(line=>String(line||"").trim()).filter(Boolean);
  const uniqueLines=[...new Set(lines)],matching=uniqueLines.filter(line=>weaponIsEquipped(profile,line,profileSet));
  if(!matching.length)return Math.max(1,Number(unitCount)||1);
  const countLines=sourceLines=>{
    let specificTotal=0,fallbackTotal=0;
    for(const line of sourceLines){
      if(!weaponIsEquipped(profile,line,profileSet))continue;
      const segments=line.split(/,(?![^()]*\))/).map(part=>part.trim()),explicit=segments
        .map(segment=>({segment,count:Number(segment.match(/^(\d+)\s*x\s*/i)?.[1]||0)}))
        .filter(item=>item.count&&weaponIsEquipped(profile,item.segment.replace(/^\d+\s*x\s*/i,""),profileSet));
      if(explicit.length){specificTotal+=explicit.reduce((sum,item)=>sum+item.count,0);continue;}
      const modelLine=line.match(/^\s*(\d+)\s*x\s+[^:]+:\s*(.+)$/i);
      if(modelLine&&weaponIsEquipped(profile,modelLine[2],profileSet)){specificTotal+=Number(modelLine[1]);continue;}
      const quantityLine=line.match(/^\s*(\d+)\s*x\s+/i);
      if(quantityLine){specificTotal+=Number(quantityLine[1]);continue;}
      fallbackTotal+=Math.max(1,Number(unitCount)||1);
    }
    return {specificTotal,fallbackTotal};
  };
  const detailed=countLines(rosterUnit.equipmentLines||[]),all=countLines([rosterUnit.equipment||"",...(rosterUnit.equipmentLines||[])]);
  const total=detailed.specificTotal||all.specificTotal||all.fallbackTotal||detailed.fallbackTotal;
  return Math.min(Math.max(1,Number(unitCount)||1),Math.max(1,total));
}
function weaponLoadoutAssignments(profile,rosterUnit,unitCount,profileSet=[]){
  const groups=rosterUnit.modelLoadouts||[];
  if(groups.length){
    const matched=new Map();
    for(const group of groups)for(const item of group.items)if(weaponIsEquipped(profile,item.name,profileSet)){const key=normalizeLoadoutText(group.name),prior=matched.get(key);matched.set(key,{name:group.name,models:group.models,count:(prior?.count||0)+item.count});}
    return [...matched.values()];
  }
  const gear=[rosterUnit.equipment||"",...(rosterUnit.equipmentLines||[])].join(" ");
  return weaponIsEquipped(profile,gear,profileSet)?[{name:"편성 전체",models:Math.max(1,Number(unitCount)||1),count:weaponEquippedModelCount(profile,rosterUnit,unitCount,profileSet)}]:[];
}
function weaponProfilesLoadoutAssignments(profiles,rosterUnit,unitCount,profileSet=[]){
  const merged=new Map();
  for(const profile of profiles)for(const assignment of weaponLoadoutAssignments(profile,rosterUnit,unitCount,profileSet)){const key=normalizeLoadoutText(assignment.name),prior=merged.get(key);merged.set(key,{...assignment,count:Math.max(prior?.count||0,assignment.count)});}
  return [...merged.values()];
}
function unmatchedRosterWeapons(rosterUnit,profiles,profileSet=[]){
  const groups=rosterUnit.modelLoadouts||[],matched=new Set();
  for(const profile of profiles)for(const group of groups)for(const item of group.items)if(weaponIsEquipped(profile,item.name,profileSet))matched.add(`${group.name}|${normalizeLoadoutText(item.name)}`);
  return groups.flatMap(group=>group.items.filter(item=>!matched.has(`${group.name}|${normalizeLoadoutText(item.name)}`)).map(item=>({...item,group:group.name,models:group.models})));
}
function renderProfiles(profiles,modelCount=1,rosterUnit={},unitIndex=0,dataUnit={}){
  if(!profiles?.length)return '<p class="meta">이 항목에 표시할 프로필이 없습니다.</p>';
  const matchedEnhancements=(rosterUnit.enhancements||[]).map(rosterEnhancementMatch).filter(Boolean);profiles=applyEnhancementWeaponEffects(applyEnhancementUnitEffects(profiles,matchedEnhancements),matchedEnhancements);
  const summaryStatNames=new Set(["M","Move","T","Toughness","Sv","SV","Save","W","Wounds","LD","Leadership","OC","Objective Control","InSv","InvSv","Invulnerable Save"]),summaryProfile=profiles.find(p=>["unit","model"].includes((p.typeName||"").toLowerCase())&&(p.characteristics||[]).some(c=>summaryStatNames.has(c.name))),gearText=normalizeLoadoutText([rosterUnit.equipment||"",...(rosterUnit.equipmentLines||[])].join(" ")),weapons=profiles.filter(p=>/weapon/i.test(p.typeName||"")),others=profiles.filter(p=>!/weapon/i.test(p.typeName||"")&&p!==summaryProfile),equipped=weapons.filter(p=>weaponLoadoutAssignments(p,rosterUnit,modelCount,weapons).length||(!rosterUnit.modelLoadouts?.length&&weaponIsEquipped(p,gearText,weapons))),equippedSet=new Set(equipped),showOptionsInitially=!equipped.length,unmatched=unmatchedRosterWeapons(rosterUnit,weapons,weapons);
  const renderOther=p=>{const chars=p.characteristics||[],visibleChars=chars.filter(c=>!/^base(?:\s+size)?$/i.test(c.name.trim())),description=chars.find(x=>x.name==="Description")?.value,isAbility=(p.typeName||"").toLowerCase().includes("abilit")||Boolean(description),title=profileDisplayName(p);if(isAbility)return `<section class="ability-block"><div class="ability-heading"><h4 class="profile-title">${escapeHtml(title)}</h4>${description?`<details class="ability-original"><summary>EN 원문</summary><p class="ability-original-text">${escapeHtml(metadataText(description))}</p></details>`:""}</div><p class="ability-text">${richText(translateRulesText(p.name,description||"",{id:p.id,file:dataUnit.sourceFile,kind:/abilit/i.test(p.typeName||"")?"ability":"profile"}))}</p></section>`;return `<section class="profile-block"><h4 class="profile-title"><span>${escapeHtml(title)}</span><button type="button" class="profile-image-search-trigger" data-google-image-search data-search-name="${escapeHtml(p.name||title)}" aria-label="${escapeHtml(title)} 이미지 검색" title="이미지 검색">⌕</button></h4>${visibleChars.length?`<table class="profile-table"><thead><tr><th>항목</th>${visibleChars.map(c=>`<th>${escapeHtml(statTranslations.get(c.name)||tr(c.name))}</th>`).join("")}</tr></thead><tbody><tr><td>${escapeHtml(title)}</td>${visibleChars.map(c=>c.name==="Keywords"?`<td>${String(c.value).split(/,\s*/).filter(Boolean).map(renderKeywordButton).join(" ")}</td>`:`<td>${escapeHtml(translateTerms(c.value))}</td>`).join("")}</tr></tbody></table>`:""}</section>`;};
  const isPistolProfile=p=>/pistol/i.test(p.name||'')||String((p.characteristics||[]).find(c=>c.name==='Keywords')?.value||'').split(/,\s*/).some(keyword=>/pistol/i.test(keyword));
  const categories=[{label:'원거리 주무장',match:p=>/ranged/i.test(p.typeName||'')&&!isPistolProfile(p)},{label:'원거리 보조 무장 · 권총',match:p=>/ranged/i.test(p.typeName||'')&&isPistolProfile(p)},{label:'근거리 무기',match:p=>/melee/i.test(p.typeName||'')},{label:'기타 무기',match:p=>!/ranged|melee/i.test(p.typeName||'')}];
  const renderTable=items=>{
    if(!items.length)return '';
    const byBase=new Map();
    for(const profile of items){const key=normalizeLoadoutText(weaponBaseName(profile));if(!byBase.has(key))byBase.set(key,[]);byBase.get(key).push(profile);}
    const profileGroups=[...byBase.values()],hasModes=profileGroups.some(group=>group.length>1),hasKeywords=items.some(p=>(p.characteristics||[]).some(c=>c.name==='Keywords'&&String(c.value||'').trim())),columns=['Range','A','BS','WS','S','AP','D'].filter(key=>items.some(p=>(p.characteristics||[]).some(c=>c.name===key)));
    const rows=profileGroups.map(group=>{
      const base=weaponBaseName(group[0]),baseLabel=weaponShortDisplayName({...group[0],name:base}),englishName=String(base||''),representative=group[0],assignments=weaponProfilesLoadoutAssignments(group,rosterUnit,modelCount,weapons),assignmentCount=assignments.reduce((sum,item)=>sum+item.count,0),assignmentText=assignments.length?`${assignments[0].name}${assignmentCount>1?` 등 ${assignmentCount}개체`:' · 1개체'}`:'미장착 / 선택 가능',assignmentDetails=assignments.map(item=>`${item.name} · ${item.count}개체`),active=group.some(profile=>equippedSet.has(profile)),weaponCell=`<td class="weapon-name-cell" rowspan="${group.length}"><label class="weapon-choice" title="${escapeHtml(`${baseLabel} · ${englishName}`)}"><input type="checkbox" data-loadout-weapon data-unit-index="${unitIndex}" data-weapon-name="${escapeHtml(representative.name||'')}" data-weapon-type="${escapeHtml(representative.typeName||'')}" ${active?'checked':''}><span class="weapon-name-scroll"><span>${escapeHtml(baseLabel)}${baseLabel!==englishName?` <small>${escapeHtml(englishName)}</small>`:''}</span></span></label>${assignments.length?`<button type="button" class="weapon-model-assignment" data-weapon-model-list="${escapeHtml(JSON.stringify(assignmentDetails))}" aria-label="${escapeHtml(`${assignmentText} 모델 목록 보기`)}">${escapeHtml(assignmentText)}</button>`:`<small class="weapon-model-assignment">${escapeHtml(assignmentText)}</small>`}`;
      return group.map((profile,index)=>{
        const chars=new Map((profile.characteristics||[]).map(c=>[c.name,c])),modeName=weaponProfileModeName(profile),modeLabel=modeName?(translateTerms(modeName)!==modeName?`${translateTerms(modeName)} (${modeName})`:modeName):'—',keywords=String(chars.get('Keywords')?.value||'').split(/,\s*/).filter(Boolean),modeCell=hasModes?`<td class="weapon-mode-cell">${escapeHtml(modeLabel)}</td>`:'',keywordCell=hasKeywords?`<td class="weapon-keyword-cell">${keywords.map(renderKeywordButton).join(' ')||'—'}</td>`:'',changedStats=key=>{const characteristic=chars.get(key)||{},value=characteristic.value||'',changed=characteristic.enhancementOriginal;return changed?`<span class="enhancement-value"><del>${escapeHtml(changed)}</del><b>${escapeHtml(value)}</b>${characteristic.enhancementConditional?`<small>조건부</small>`:''}</span>`:escapeHtml(translateTerms(value));};
        return `<tr class="weapon-row ${equippedSet.has(profile)?'is-equipped':'not-equipped'}">${index===0?weaponCell:''}${modeCell}${columns.map(key=>{const characteristic=chars.get(key)||{},value=characteristic.value||'',attack=key==='A'&&value,shown=changedStats(key);return `<td class="weapon-stat-cell weapon-stat-${key}">${attack?`<span class="weapon-attack-count"><b>${shown}</b>${assignmentCount?`<small>× ${assignmentCount}개체</small>`:''}</span>`:shown}</td>`}).join('')}${keywordCell}</tr>`;
      }).join('');
    }).join('');
    const mobileCards=profileGroups.map(group=>{const representative=group[0],base=weaponBaseName(representative),baseLabel=weaponShortDisplayName({...representative,name:base}),assignments=weaponProfilesLoadoutAssignments(group,rosterUnit,modelCount,weapons),assignmentCount=assignments.reduce((sum,item)=>sum+item.count,0),assignmentText=assignments.length?`${assignments[0].name}${assignmentCount>1?` 등 ${assignmentCount}개체`:' · 1개체'}`:'미장착 / 선택 가능',assignmentDetails=assignments.map(item=>`${item.name} · ${item.count}개체`),active=group.some(profile=>equippedSet.has(profile)),modelList=assignments.length?`<button type="button" class="weapon-model-assignment" data-weapon-model-list="${escapeHtml(JSON.stringify(assignmentDetails))}">${escapeHtml(assignmentText)}</button>`:`<small class="weapon-model-assignment">${escapeHtml(assignmentText)}</small>`,profilesHtml=group.map(profile=>{const chars=new Map((profile.characteristics||[]).map(c=>[c.name,c])),mode=weaponProfileModeName(profile),keywords=String(chars.get('Keywords')?.value||'').split(/,\s*/).filter(Boolean),fields=[['Profile',mode?(translateTerms(mode)!==mode?`${translateTerms(mode)} (${mode})`:mode):'기본'],['R',chars.get('Range')?.value],['A',chars.get('A')?.value?`${chars.get('A').value}${assignmentCount>1?` × ${assignmentCount}개체`:''}`:''],[chars.has('BS')?'BS':chars.has('WS')?'WS':'BS/WS',chars.get('BS')?.value||chars.get('WS')?.value],['S',chars.get('S')?.value],['AP',chars.get('AP')?.value],['D',chars.get('D')?.value]].filter(([,value])=>value!==undefined&&value!==''),fieldsHtml=fields.map(([label,value])=>`<div class="weapon-mobile-stat"><small>${label}</small><b>${escapeHtml(translateTerms(value))}</b></div>`).join('');return `<div class="weapon-mobile-profile">${fieldsHtml}${keywords.length?`<div class="weapon-mobile-keywords"><small>KW</small><span>${keywords.map(renderKeywordButton).join(' ')}</span></div>`:''}</div>`;}).join('');return `<section class="weapon-mobile-card ${active?'is-equipped':'not-equipped'}"><header class="weapon-mobile-card-head">${active?`<span class="weapon-mobile-name"><b>${escapeHtml(baseLabel)}</b>${baseLabel!==base?` <small>${escapeHtml(base)}</small>`:''}<em>장착</em></span>`:`<label class="weapon-choice"><input type="checkbox" data-loadout-weapon data-unit-index="${unitIndex}" data-weapon-name="${escapeHtml(representative.name||'')}" data-weapon-type="${escapeHtml(representative.typeName||'')}"><span>${escapeHtml(baseLabel)}${baseLabel!==base?` <small>${escapeHtml(base)}</small>`:''}</span></label>`}${modelList}</header>${profilesHtml}</section>`;}).join('');
    return `<div class="weapon-compact-scroll"><table class="profile-table weapon-compact-table"><thead><tr><th>무기 · 장착 모델</th>${hasModes?'<th>발사 프로필</th>':''}${columns.map(key=>`<th>${escapeHtml(statTranslations.get(key)||tr(key))}</th>`).join('')}${hasKeywords?'<th>키워드</th>':''}</tr></thead><tbody>${rows}</tbody></table></div><div class="weapon-mobile-list">${mobileCards}</div>`;
  };
  const unmatchedHtml=unmatched.length?`<section class="weapon-unmatched-loadout"><h5>편성표 장비 · 프로필 미연결</h5>${unmatched.map(item=>`<div><strong>${escapeHtml(item.group)}</strong> · ${escapeHtml(item.name)} <small>${item.count}개체</small></div>`).join('')}</section>`:'';
  const equippedWeaponCount=new Set(equipped.map(profile=>normalizeLoadoutText(weaponBaseName(profile)))).size,groupedWeapons=categories.map(category=>({label:category.label,items:weapons.filter(category.match).sort((a,b)=>Number(equippedSet.has(b))-Number(equippedSet.has(a)))})).filter(group=>group.items.length),drawGroups=groups=>groups.map(group=>`<section class="weapon-group ${group.label.includes('근거리')?'weapon-group-melee':group.label.includes('원거리')?'weapon-group-ranged':'weapon-group-other'}"><h5>${group.label}</h5>${renderTable(group.items)}</section>`).join(''),weaponHtml=weapons.length?`<section class="weapon-profile-groups" data-show-options="${showOptionsInitially}"><div class="weapon-profile-toolbar"><strong>무기 프로필</strong><small>${escapeHtml(dataUnit.nameKo||tr(dataUnit.name||rosterUnit.rosterName))}${rosterUnit.attachedAs?` · ${escapeHtml(rosterAttachedRoleLabel(rosterUnit.attachedAs))}`:""}</small>${weapons.some(p=>!equippedSet.has(p))?`<button type="button" data-weapons-toggle title="${showOptionsInitially?'장착 무기만 표시':'전체 무기 표시'}">${showOptionsInitially?'☑ 장착만':'☷ 전체'}</button>`:''}<small>${equippedWeaponCount?`장착 무기 ${equippedWeaponCount}종`:'장착 확인 필요'}</small></div>${drawGroups(groupedWeapons)}${unmatchedHtml}</section>`:'';
  return `<div class="profile-list">${weaponHtml}${others.map(renderOther).join('')}</div>`;
}
function metadataText(value=""){return String(value).replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/\s+/g," ").trim();}
function unitRuleEffects(unit){
  const sources=[...(unit.profiles||[]).map(p=>({name:p.name||"",description:(p.characteristics||[]).find(c=>c.name==="Description")?.value||""})),...(unit.abilities||[]).map(a=>({name:a.name||a.baseName||"",description:a.description||sourceDescriptionFor(a.name||a.baseName||"")})),...(unit.keywords||[]).map(name=>({name,description:""}))],effects=new Map();
  for(const {name,description} of sources){const text=String(description||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim(),fnp=text.match(/Feel\s+No\s+Pain\s+(\d+)\s*\+?(?:\s+against\s+([^.;]+))?/i)||name.match(/Feel\s+No\s+Pain\s*\(?\s*(\d+)\s*\+?\s*\)?/i);if(fnp){const value=fnp[1],scope=(fnp[2]||"").replace(/\s+and\s+/gi," 또는 ").replace(/psychic attacks?/gi,"사이킥 공격").replace(/mortal wounds?/gi,"모탈 운드").replace(/\s+/g," ").trim(),title=`고통 경감 ${value}+ (Feel No Pain ${value}+)`,detail=`${scope?`${scope}로 `:""}운드를 잃을 때마다 D6을 굴립니다. ${value}+가 나오면 해당 운드를 무시합니다.`;effects.set(title,{title,detail,source:text||name});}}
  return [...effects.values()];
}
function renderRuleEffectSummary(unit){
  const effects=unitRuleEffects(unit);if(!effects.length)return "";
  return `<section class="effect-summary"><h4>효과 빠른 확인</h4>${effects.map(x=>`<article><strong>${escapeHtml(x.title)}</strong><p>${escapeHtml(x.detail)}</p><small>원문: ${escapeHtml(x.source)}</small></article>`).join("")}</section>`;
}
function updateUnitQuickNav(parsed){
  const nav=$("unit-quick-nav"),list=$("unit-quick-nav-list");list.replaceChildren();$("quick-assistant-content").innerHTML=renderQuickAssistant(parsed);renderQuickStratagemNav();
  const navBody=$("unit-quick-nav-body"),collapseButton=$("unit-quick-nav-collapse");navBody.hidden=quickNavCollapsed;nav.classList.toggle("is-collapsed",quickNavCollapsed);collapseButton.setAttribute("aria-expanded",String(!quickNavCollapsed));collapseButton.setAttribute("aria-label",quickNavCollapsed?"전투 메뉴 펼치기":"전투 메뉴 접기");collapseButton.querySelector("span").textContent=quickNavCollapsed?"☰":"×";
  const allTasks=makeAssistantTasks(parsed);$("quick-assistant-count").textContent=allTasks.filter(task=>!assistantChecked(task.id)).length?`${allTasks.filter(task=>!assistantChecked(task.id)).length}개 남음`:allTasks.length?"완료":"";
  if(!parsed.units.length){nav.hidden=true;return;}
  const parentByChild=rosterAttachmentParents(parsed.units);
  const childrenByParent=new Map();for(const [child,parent] of parentByChild){if(!childrenByParent.has(parent))childrenByParent.set(parent,[]);childrenByParent.get(parent).push(child);}
  const makeButton=(index,child=false)=>{const unit=parsed.units[index],found=findDataUnit(unit.rosterName),name=found&&!found.candidates?(found.unit.nameKo||tr(found.unit.name)):unit.rosterName,button=document.createElement("button");button.type="button";button.className=`unit-quick-nav-item${child?" attached-child":""}`;button.dataset.unitJump=String(index);button.textContent=`${child?"└ ":`${index+1}. `}${name}${unit.attachedAs?` · ${rosterAttachedRoleLabel(unit.attachedAs)}`:""} · ${unit.count}개체`;button.title=unit.attachedTo?`${unit.rosterName} → ${unit.attachedTo}`:unit.rosterName;return button;};
  const appendButtonTree=(index,depth=0,seen=new Set())=>{if(seen.has(index))return;seen.add(index);const button=makeButton(index,depth>0);if(depth)button.style.paddingLeft=`${12+depth*14}px`;list.append(button);for(const child of childrenByParent.get(index)||[])appendButtonTree(child,depth+1,seen);};
  rosterUnitRenderOrder(parsed.units).forEach(index=>{if(!parentByChild.has(index))appendButtonTree(index);});
  nav.hidden=false;
}
function renderRosterEquipment(unit){
  const items=[...(unit.equipment?unit.equipment.split(/,(?![^()]*\))/).map(s=>s.trim()).filter(Boolean):[]),...(unit.equipmentLines||[])];
  return `<section class="roster-gear"><b>편성 장비</b>${items.length?`<ul>${items.map(x=>`<li>${escapeHtml(bilingualLabel(x))}</li>`).join("")}</ul>`:"<div>목록에 장비 정보 없음</div>"}</section>`;
}
const ENHANCEMENT_CHARACTERISTICS={attacks:"A",attack:"A",strength:"S",damage:"D",range:"Range",ap:"AP","armour penetration":"AP","armor penetration":"AP","weapon skill":"WS","ballistic skill":"BS",move:"M",movement:"M",toughness:"T",wound:"W",wounds:"W",save:"Sv","invulnerable save":"InSv",invs:"InSv",leadership:"Ld","objective control":"OC"};
function stripRosterEnhancementSuffixes(value){return String(value||"").replace(/\s*\(\s*\+?\s*\d+\s*(?:points?|pts?|포인트)\s*\)\s*$/i,"").replace(/\s*\(\s*upgrade\s*\)\s*$/i,"").trim();}
function normalizeRosterEnhancementName(value){return norm(stripRosterEnhancementSuffixes(value).replace(/\s*\([^)]*\)\s*$/,""));}
function rosterEnhancementMatch(rosterName){
  const key=normalizeRosterEnhancementName(rosterName);
  if(!key)return null;
  return detachmentEnhancements.find(item=>[localizedRuleValue(item.name,"en"),localizedRuleValue(item.name,"ko")].some(name=>normalizeRosterEnhancementName(name)===key))||null;
}
function enhancementStatEffects(enhancements){
  const effects=[];
  for(const item of enhancements||[]){const source=metadataText(localizedRuleValue(item.description,"en"));if(!source)continue;
    const pattern=/(?:add|increase)\s+(\d+)\s+to\s+the\s+([a-z][a-z ,/&-]*?)\s+characteristics?\s+of\s+([^.;\n]+)/gi;let match;
    while((match=pattern.exec(source))){const bonus=Number(match[1]),target=match[3].toLowerCase(),fields=match[2].toLowerCase().split(/\s*(?:,|\/|\band\b|&)\s*/).map(name=>ENHANCEMENT_CHARACTERISTICS[name.trim()]).filter(Boolean),scope=/melee\s+weapons?|weapons?\s+(?:equipped|wielded)/i.test(target)?"melee":/this\s+model|models?\s+in\s+this\s+unit|this\s+unit/i.test(target)?"unit":"";if(!scope||!fields.length)continue;
      const conditional=/\b(?:while|when|if|each time|whenever|until|during)\b/i.test(source);for(const field of fields)effects.push({field,bonus,scope,conditional,name:localizedRuleValue(item.name,"en")});
    }
  }
  return effects;
}
function applyEnhancementWeaponEffects(profiles,enhancements){
  const effects=enhancementStatEffects(enhancements).filter(effect=>effect.scope==="melee");if(!effects.length)return profiles;
  return (profiles||[]).map(profile=>{if(!/melee/i.test(profile.typeName||""))return profile;let changed=false;const characteristics=(profile.characteristics||[]).map(characteristic=>{const field=characteristic.name,matching=effects.filter(effect=>effect.field===field);if(!matching.length)return characteristic;const base=String(characteristic.value||"").trim(),numeric=base.match(/^(\d+)(["″]?)$/);if(!numeric)return characteristic;const bonus=matching.reduce((sum,effect)=>sum+effect.bonus,0),conditional=matching.some(effect=>effect.conditional);changed=true;return {...characteristic,value:`${Number(numeric[1])+bonus}${numeric[2]}`,enhancementOriginal:base,enhancementConditional:conditional};});return changed?{...profile,characteristics}:profile;});
}
function applyEnhancementUnitEffects(profiles,enhancements){
  const effects=enhancementStatEffects(enhancements).filter(effect=>effect.scope==="unit");if(!effects.length)return profiles;
  return (profiles||[]).map(profile=>{if(!["unit","model"].includes(String(profile.typeName||"").toLowerCase()))return profile;let changed=false;const characteristics=(profile.characteristics||[]).map(characteristic=>{const matching=effects.filter(effect=>effect.field.toLowerCase()===characteristic.name.toLowerCase());if(!matching.length)return characteristic;const base=String(characteristic.value||"").trim(),numeric=base.match(/^(\d+)(["″]?)$/);if(!numeric)return characteristic;const bonus=matching.reduce((sum,effect)=>sum+effect.bonus,0);changed=true;return {...characteristic,value:`${Number(numeric[1])+bonus}${numeric[2]}`,enhancementOriginal:base,enhancementConditional:matching.some(effect=>effect.conditional)};});return changed?{...profile,characteristics}:profile;});
}
function renderRosterEnhancements(rosterUnit,dataUnit){
  const names=Array.from(new Set(rosterUnit.enhancements||[]));if(!names.length)return "";
  const effects=[];
  const cards=names.map(rosterName=>{const data=rosterEnhancementMatch(rosterName),localRule=(dataUnit?.abilities||[]).find(rule=>normalizeRosterEnhancementName(rule.name||rule.baseName)===normalizeRosterEnhancementName(rosterName)),sourceName=localizedRuleValue(data?.name,"en")||stripRosterEnhancementSuffixes(rosterName),nameKo=localizedRuleValue(data?.name,"ko")||translateTerms(sourceName),english=localizedRuleValue(data?.description,"en")||localRule?.description||sourceDescriptionFor(sourceName),korean=localizedRuleValue(data?.description,"ko")||(english?translateRulesText(sourceName,english):""),text=externalRuleText(korean||english)||"현재 선택 편제 데이터에서 이 인핸스먼트의 설명을 찾지 못했습니다.";if(data)effects.push(data);const keywords=(data?.keywords||[]).join(" · "),cost=data?.cost?`${data.cost}점`:"";return `<article class="roster-enhancement"><div class="roster-enhancement-heading"><b>${escapeHtml(nameKo)}</b>${sourceName!==nameKo?`<small>${escapeHtml(sourceName)}</small>`:""}<span>${escapeHtml([cost,keywords].filter(Boolean).join(" · "))}</span></div><p>${escapeHtml(text)}</p>${english&&externalRuleText(english)!==text?`<details><summary>영문 원문</summary><p>${escapeHtml(externalRuleText(english))}</p></details>`:""}${!data?`<small class="enhancement-source-warning">선택 편제의 공개 인핸스먼트 목록과 이름이 일치하지 않아 보유 규칙 데이터에서 설명을 대조했습니다.</small>`:""}</article>`;}).join("");
  const summary=names.map(name=>{const data=rosterEnhancementMatch(name),english=localizedRuleValue(data?.name,"en")||stripRosterEnhancementSuffixes(name),korean=localizedRuleValue(data?.name,"ko")||translateTerms(english),cost=data?.cost?` +${data.cost}점`:"";return `${korean}${cost}`;}).join(" · ");
  return `<details class="roster-enhancements"><summary><b>장착 인핸스먼트</b><span>${names.length}개${summary?` · ${escapeHtml(summary)}`:""}</span></summary><div class="roster-enhancement-list">${cards}</div></details>`;
}
function residualEnglishPhrases(text=""){
  const plain=metadataText(text),signals=new Set("the this that while when if once your bearer model unit phase battle friendly enemy within range each only can must and or is are has have with for on at by as from until instead select roll start end attacks attack weapons weapon ability abilities characteristic characteristics doctrine stratagem target selected equipped effects effect".split(" "));
  const matches=plain.match(/\b[A-Za-z][A-Za-z’'-]*(?:\s+[A-Za-z][A-Za-z’'-]*){1,7}\b/g)||[];
  return [...new Set(matches.map(x=>x.trim()).filter(x=>x.split(/\s+/).some(word=>signals.has(word.toLowerCase()))))];
}
function renderTranslationReview(parsed){
  const candidates=[],seen=new Set();
  parsed.units.forEach(unit=>{
    const found=findDataUnit(unit.rosterName);if(!found||found.candidates)return;
    for(const profile of found.unit.profiles||[]){
      const source=(profile.characteristics||[]).find(c=>textKey(c.name)==="description")?.value||"";if(!source)continue;
      const key=ruleFeedKey(profile.name,source);if(seen.has(key))continue;seen.add(key);
      const translated=translateRulesText(profile.name,source),residual=residualEnglishPhrases(translated),draft=v2DraftRuleTranslations.has(key);if(!residual.length&&!draft)continue;
      candidates.push({key,unit:found.unit.nameKo||tr(found.unit.name),profile:profile.name,source,translated,residual,file:found.unit.sourceFile||"",id:profile.id||profile.name,faction:currentRosterMeta.faction||"",draft});
    }
  });
  if(!candidates.length)return "";
  activeTranslationCandidates=candidates.slice(0,40);
  return `<details class="translation-review"><summary>규칙 설명 번역 ${candidates.length}건 <span>직접 수정하거나 AI 초안을 만든 뒤 저장하세요</span></summary><div class="translation-review-tools"><button type="button" class="primary" data-translate-all ${translationReviewBusy?"disabled":""}>미번역 후보 AI 초안 생성</button><span data-translation-progress role="status">${translationReviewBusy?"번역 중…":""}</span></div><div class="translation-review-list">${activeTranslationCandidates.map((item,index)=>`<details class="translation-review-item"><summary><b>${escapeHtml(item.unit)} › ${escapeHtml(item.profile)}</b><span>${item.draft?"저장된 초안 · 수정 가능":escapeHtml(item.residual.slice(0,3).join(" · "))}</span></summary><p><b>BSData 원문</b>${escapeHtml(metadataText(item.source))}</p><label class="translation-edit-label" for="translation-edit-${index}">한국어 번역 직접 입력 / 수정</label><textarea id="translation-edit-${index}" data-translation-edit="${index}" rows="4" placeholder="여기에 자연스러운 한국어 규칙 설명을 입력하세요">${escapeHtml(metadataText(item.translated))}</textarea><div class="translation-save-row">${!item.draft?`<button type="button" class="quiet" data-translate-candidate="${index}" ${translationReviewBusy?"disabled":""}>AI 초안 생성</button>`:""}<button type="button" class="primary" data-save-translation="${index}">번역 저장</button><span data-translation-row-status="${index}" role="status"></span></div></details>`).join("")}</div>${candidates.length>40?`<p class="translation-review-more">화면에는 먼저 40건을 표시합니다.</p>`:""}<p class="translation-review-note">번역 저장을 누르면 Google Sheets의 Translations 탭에 AI_DRAFT로 기록됩니다. 저장된 번역은 그 시트에서 행을 선택한 뒤 ‘40K 번역 V2 → 선택 행 검수 완료’를 눌러야 앱에 정식 배포됩니다.</p></details>`;
}
let activeTranslationCandidates=[],translationReviewBusy=false;
function requestRuleDraft(candidate){
  return new Promise((resolve,reject)=>{
    const token=$("translation-write-token").value.trim();if(!token){reject(new Error("번역 저장 키를 입력하세요. Google Sheet 메뉴에서 키를 표시/생성할 수 있습니다."));return;}
    let endpoint;try{endpoint=new URL(v2TranslationFeed);if(endpoint.protocol!=="https:")throw new Error("HTTPS 번역 피드 주소를 확인하세요.");}catch(error){reject(error);return;}
    const callback=`v2Draft_${Date.now()}_${Math.floor(Math.random()*1e6)}`,script=document.createElement("script");
    endpoint.searchParams.set("action","translateDraft");endpoint.searchParams.set("callback",callback);endpoint.searchParams.set("token",token);
    endpoint.searchParams.set("item",JSON.stringify({name:candidate.profile,source:candidate.source,file:candidate.file,id:candidate.id,faction:candidate.faction}));
    const cleanup=()=>{delete window[callback];script.remove();clearTimeout(timer);};
    const timer=setTimeout(()=>{cleanup();reject(new Error("Apps Script 응답 시간이 초과됐습니다."));},45000);
    window[callback]=payload=>{cleanup();if(!payload?.ok){const missingAction=payload?.schemaVersion||Array.isArray(payload?.translations);reject(new Error(missingAction?"현재 Google Apps Script 배포본은 직접 번역 저장을 지원하지 않습니다. Apps Script에서 새 버전을 배포해 주세요.":payload?.error||"번역 저장에 실패했습니다."));return;}v2DraftRuleTranslations.set(candidate.key,payload.translation);resolve(payload);};
    script.onerror=()=>{cleanup();reject(new Error("Apps Script 요청에 실패했습니다. 웹 앱을 새 버전으로 배포했는지 확인하세요."));};script.src=endpoint.toString();document.head.appendChild(script);
  });
}
function requestManualRuleDraft(candidate,translation){
  return new Promise((resolve,reject)=>{
    const token=$("translation-write-token").value.trim();if(!token){reject(new Error("번역 저장 키를 입력하세요. 화면 아래 ‘번역 피드 설정’에서 키를 입력할 수 있습니다."));return;}
    let endpoint;try{endpoint=new URL(v2TranslationFeed);if(endpoint.protocol!=="https:")throw new Error("HTTPS 번역 피드 주소를 확인하세요.");}catch(error){reject(error);return;}
    const callback=`v2ManualDraft_${Date.now()}_${Math.floor(Math.random()*1e6)}`,script=document.createElement("script");
    endpoint.searchParams.set("action","saveTranslationDraft");endpoint.searchParams.set("callback",callback);endpoint.searchParams.set("token",token);
    endpoint.searchParams.set("item",JSON.stringify({name:candidate.profile,source:candidate.source,file:candidate.file,id:candidate.id,faction:candidate.faction}));endpoint.searchParams.set("translation",translation);
    const cleanup=()=>{delete window[callback];script.remove();clearTimeout(timer);};
    const timer=setTimeout(()=>{cleanup();reject(new Error("Apps Script 응답 시간이 초과됐습니다."));},45000);
    window[callback]=payload=>{cleanup();if(!payload?.ok){reject(new Error(payload?.error||"번역 저장에 실패했습니다."));return;}v2DraftRuleTranslations.set(candidate.key,payload.translation);resolve(payload);};
    script.onerror=()=>{cleanup();reject(new Error("저장 API에 연결하지 못했습니다. Google Apps Script를 새 버전으로 배포했는지 확인하세요."));};script.src=endpoint.toString();document.head.appendChild(script);
  });
}
async function saveManualRuleTranslation(index){
  const candidate=activeTranslationCandidates[index],field=$("results").querySelector(`[data-translation-edit="${index}"]`),card=field?.closest(".translation-review-item"),button=card?.querySelector("[data-save-translation]"),status=card?.querySelector("[data-translation-row-status]");
  if(!candidate||!field||!button)return;
  const translation=field.value.trim();if(!translation){if(status)status.textContent="번역문을 입력한 뒤 저장하세요.";field.focus();return;}
  if(!/[가-힣]/.test(translation)){if(status)status.textContent="한국어 번역을 입력해 주세요.";field.focus();return;}
  button.disabled=true;if(status)status.textContent="저장 중…";
  try{await requestManualRuleDraft(candidate,translation);candidate.draft=true;candidate.translated=translation;render();const review=$("results").querySelector(".translation-review");if(review)review.open=true;const next=$("results").querySelectorAll(".translation-review-item")[index];if(next)next.open=true;const progress=$("results").querySelector("[data-translation-progress]");if(progress)progress.textContent="번역을 Google Sheet 초안으로 저장했습니다. 검수 후 승인해 주세요.";}
  catch(error){button.disabled=false;if(status)status.textContent=error.message;if(/저장 키/.test(error.message)){const settings=document.querySelector(".translation-feed-settings");if(settings){settings.open=true;settings.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>$("translation-write-token").focus(),250);}}}
}
async function runTranslationReview(indices){
  if(translationReviewBusy)return;
  const candidates=indices.map(index=>activeTranslationCandidates[index]).filter(item=>item&&!item.draft);if(!candidates.length)return;
  translationReviewBusy=true;const button=$("results").querySelector("[data-translate-all]");if(button)button.disabled=true;
  const progress=()=>$("results").querySelector("[data-translation-progress]");let done=0,errors=[];
  for(const candidate of candidates){try{await requestRuleDraft(candidate);done++;}catch(error){errors.push(error.message);break;}const label=progress();if(label)label.textContent=`${done}/${candidates.length}건 번역해 시트에 저장했습니다.`;}
  translationReviewBusy=false;render();const review=$("results").querySelector(".translation-review");if(review)review.open=true;const label=$("results").querySelector("[data-translation-progress]");if(label)label.textContent=errors.length?`저장 ${done}건 · 중단: ${errors[0]}`:`완료 · ${done}건 번역 초안을 DB에 저장했습니다.`;
}
function openGoogleImageSearch(searchName=""){
  const name=String(searchName||"").trim();if(!name)return;
  let dialog=document.getElementById("google-image-search-dialog");
  if(!dialog){dialog=document.createElement("dialog");dialog.id="google-image-search-dialog";dialog.className="google-image-search-dialog";dialog.innerHTML='<form method="dialog" class="google-image-search-close-form"><button type="submit" aria-label="닫기">×</button></form><p class="eyebrow">IMAGE SEARCH</p><h2 data-google-image-title></h2><p data-google-image-query></p><a class="google-image-search-action" data-google-image-link target="_blank" rel="noopener noreferrer">Google 이미지 검색 결과 열기 ↗</a><small>검색 결과는 새 탭에서 열립니다. 검색어를 수정하려면 Google 검색창에서 바꾸세요.</small>';document.body.append(dialog);dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});}
  const query=`Warhammer 40k ${name} painted miniature`,url=new URL("https://www.google.com/search");url.searchParams.set("tbm","isch");url.searchParams.set("q",query);dialog.querySelector("[data-google-image-title]").textContent=name;dialog.querySelector("[data-google-image-query]").textContent=query;dialog.querySelector("[data-google-image-link]").href=url.toString();if(!dialog.open)dialog.showModal();
}
let toastTimer;
function showAssistantRuleDetail(title,detail){
  let dialog=document.getElementById("assistant-rule-dialog");
  if(!dialog){dialog=document.createElement("dialog");dialog.id="assistant-rule-dialog";dialog.className="assistant-rule-dialog";dialog.innerHTML='<form method="dialog" class="assistant-rule-close-form"><button type="submit" aria-label="닫기">×</button></form><p class="eyebrow">전투 보조 설명</p><h2 data-assistant-rule-title></h2><div data-assistant-rule-text></div>';document.body.append(dialog);dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});}
  dialog.querySelector("[data-assistant-rule-title]").textContent=title||"규칙 설명";dialog.querySelector("[data-assistant-rule-text]").textContent=detail||"표시할 설명이 없습니다.";if(!dialog.open)dialog.showModal();
}
function showKeywordToast(raw){
  const info=keywordInfo(raw),toast=$("toast");
  $("toast-title").textContent=info?`${info.ko} (${info.en})`:raw;
  let description=info?.description||"앱에 등록된 설명을 찾지 못했습니다. 이 키워드가 BSData 공통 규칙 본문에 연결되어 있는지 확인해 주세요.";
  $("toast-description").textContent=description;
  toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},5000);
}
function render(){
  const parsed=parseRoster($("roster").value),summary=$("summary"),results=$("results");
  applyFactionTheme(parsed.meta.faction||"");
  $("game-page").innerHTML=renderGameTracker(parsed.meta);
  if(!parsed.units.length){currentRosterMeta={};summary.hidden=true;results.innerHTML='<div class="empty">유닛 항목을 찾지 못했습니다. NewRecruit에서 복사한 편성표 텍스트인지 확인해 주세요.</div>';updateUnitQuickNav(parsed);if(!$("assistant-page").hidden)$("assistant-page").innerHTML=renderAssistantPage(parsed);if(!$("stratagem-page").hidden)$("stratagem-page").innerHTML=renderStratagemPage();return;}
  const m=parsed.meta;currentRosterMeta=m; summary.hidden=false;
  summary.innerHTML=[m.faction&&`<span class="pill">진영 <strong>${escapeHtml(m.faction.split(" - ").map(bilingualLabel).join(" · "))}</strong></span>`,m.detachment&&`<span class="pill">편제 <strong>${escapeHtml(bilingualLabel(m.detachment))}</strong></span>`,m.mission&&`<span class="pill">미션 <strong>${escapeHtml(bilingualLabel(m.mission))}</strong></span>`,m.gameSize&&`<span class="pill">전장 규모 <strong>${escapeHtml(String(m.gameSize))}점</strong></span>`,m.disposition&&`<span class="pill">전술 <strong>${escapeHtml(bilingualLabel(m.disposition))}</strong></span>`,m.points&&`<span class="pill">총점 <strong>${escapeHtml(m.points)}점</strong></span>`,`<span class="pill">인식 유닛 <strong>${parsed.units.length}</strong></span>`].filter(Boolean).join("");
  const attachmentParents=rosterAttachmentParents(parsed.units),renderOrder=rosterUnitRenderOrder(parsed.units),hasAttachedChildren=new Set(attachmentParents.values());results.innerHTML=renderTranslationReview(parsed)+renderOrder.map(i=>{const u=parsed.units[i],isAttachedMember=attachmentParents.has(i),hasAttachedUnits=hasAttachedChildren.has(i),attachedRole=u.attachedAs||(isAttachedMember?"합류 구성원":""),profileUnit=attachedRole===u.attachedAs?u:{...u,attachedAs:attachedRole};const found=findDataUnit(u.rosterName);if(!found)return `<article class="unmatched" data-unit-card="${i}"><strong>${!m.faction?"진영 인식 실패":db.units.length?"이름 매칭 실패":"진영/데이터 연결 확인"} · ${escapeHtml(u.rosterName)}</strong>${u.count}개체 · ${u.points}점 ${renderRosterEquipment(u)}<div class="meta">${escapeHtml(matchFailureDetails(m))}</div>${renderUnitMatchControl(u.rosterName)}</article>`;if(found.candidates)return `<article class="unmatched" data-unit-card="${i}"><strong>이름 확인 필요 · ${escapeHtml(u.rosterName)}</strong><div class="meta">유사 후보: ${found.candidates.map(c=>`${escapeHtml(c.unit.name)} (${escapeHtml(c.unit.edition)}, ${Math.round(c.score*100)}%)`).join(" · ")}. 확정 전까지 연결하지 않습니다.</div>${renderUnitMatchControl(u.rosterName)}</article>`;const d=found.unit,key=`${i}:${norm(u.rosterName)}`,max=unitWoundMax(d,u.count),now=currentWounds(key,max),related=d.abilities?.filter(a=>ruleAppliesToRoster(a.name,m))||[];return `<article class="card${hasAttachedChildren?" attachment-group-start":""}${isAttachedMember?" attachment-group-member":""}" data-unit-card="${i}">${hasAttachedChildren?`<div class="attachment-banner">합류 묶음 · ${[...attachmentParents.values()].filter(parentIndex=>parentIndex===i).length+1}개 유닛</div>`:isAttachedMember?`<div class="attachment-banner member">합류 · ${escapeHtml(parsed.units[attachmentParents.get(i)]?.rosterName||"리더")}</div>`:""}<div class="card-head" role="button" tabindex="0" aria-expanded="false" data-card="${i}"><div class="card-title"><div class="card-title-text"><h3><button type="button" class="unit-image-search-trigger" data-google-image-search data-search-name="${escapeHtml(/[가-힣]/.test(u.rosterName)?d.name:u.rosterName)}" aria-label="${escapeHtml(u.rosterName)} 이미지 검색">${escapeHtml(d.nameKo||tr(d.name))}<span aria-hidden="true">⌕</span></button></h3><div class="original">${escapeHtml(d.name)} · 편성 ${u.count}개체 · ${u.points}점${d.points?` · 출처 포인트 ${d.points}`:""}</div></div></div>${renderUnitSummary({...d,profiles:applyEnhancementUnitEffects(d.profiles,(u.enhancements||[]).map(rosterEnhancementMatch).filter(Boolean))})}<div class="wound-control" aria-label="운드 추적기"><button type="button" class="wound-button" data-wound-action="minus" data-wound-key="${escapeHtml(key)}" data-wound-max="${max}" aria-label="운드 감소">−</button><span class="wound-value" data-wound-value="${escapeHtml(key)}">${max?`${now}/${max}`:"—/—"}</span><button type="button" class="wound-button" data-wound-action="plus" data-wound-key="${escapeHtml(key)}" data-wound-max="${max}" aria-label="운드 증가">+</button></div><span class="tag">${escapeHtml(found.confidence)} · ${escapeHtml(d.edition)} · ${escapeHtml(d.translationStatus||"번역 확인")}</span></div><div class="card-body" hidden><div class="meta">${escapeHtml(d.edition)} · ${d.dataSource==="40kdc-data"?"40kdc 보조 데이터":"BSData"} ${escapeHtml(d.sourceFile||"")} · ${escapeHtml(db.sourceVersion||"버전 미지정")}</div>${renderRosterEnhancements(u,d)}${renderProfiles(d.profiles,u.count,profileUnit,i,d)}${related.length?`<p class="equip"><b>관련 규칙</b> ${related.map(a=>renderKeywordButton(a.name)).join(" · ")}</p>`:""}${d.keywords?.length?`<p class="equip"><b>키워드</b> ${d.keywords.map(renderKeywordButton).join(" · ")}</p>`:""}${renderRosterEquipment(u)}${d.note?`<p class="meta">${escapeHtml(d.note)}</p>`:""}${renderRuleEffectSummary(d)}</div></article>`}).join("");
  updateUnitQuickNav(parsed);
  if(!$("assistant-page").hidden)$("assistant-page").innerHTML=renderAssistantPage(parsed);
  if(!$("stratagem-page").hidden)$("stratagem-page").innerHTML=renderStratagemPage();
  const requestedFiles=catalogueFilesForFaction(m.faction||"").join("|");if(requestedFiles&&requestedFiles!==activeCatalogueKey)loadRulesData(m);else if(!requestedFiles&&(activeCatalogueKey||db.sourceVersion!=="진영 미확인"))loadRulesData(m);
  const nextStratContext=`11|${norm(m.faction||"")}|${norm(m.detachment||"")}`;if(nextStratContext!==stratContextKey){stratContextKey=nextStratContext;loadCoreStratagems();}
  results.querySelectorAll(".card-head").forEach(head=>{head.addEventListener("click",e=>{if(e.target.closest(".wound-control,.unit-head-image-source,[data-head-image-search],.unit-image-search-trigger"))return;const body=head.nextElementSibling,open=body.hidden;body.hidden=!open;head.setAttribute("aria-expanded",String(open));});head.addEventListener("keydown",e=>{if(e.target!==head&&e.target.closest(".wound-control,.unit-head-image-source,[data-head-image-search],.unit-image-search-trigger"))return;if(e.key==="Enter"||e.key===" "){e.preventDefault();head.click();}});});
}
results.addEventListener("click",event=>{const imageTrigger=event.target.closest("[data-google-image-search]");if(imageTrigger){event.preventDefault();event.stopPropagation();openGoogleImageSearch(imageTrigger.dataset.searchName);return;}const modelList=event.target.closest("[data-weapon-model-list]");if(modelList){event.preventDefault();event.stopPropagation();let names=[];try{names=JSON.parse(modelList.dataset.weaponModelList||"[]");}catch{}const toast=$("toast");$("toast-title").textContent="장착 모델 목록";$("toast-description").textContent=names.join("\n")||"장착 모델 정보를 찾지 못했습니다.";toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},5000);return;}const weaponToggle=event.target.closest("[data-weapons-toggle]");if(weaponToggle){const groups=weaponToggle.closest(".weapon-profile-groups"),showOptions=groups.dataset.showOptions!=="true";groups.dataset.showOptions=String(showOptions);weaponToggle.textContent=showOptions?"☑ 장착만":"☷ 전체";weaponToggle.title=showOptions?"장착 무기만 표시":"전체 무기 표시";return;}});
function finishWeaponReplacement(result,unitIndex){
  const toast=$("toast"),ok=Boolean(result.ok);$("toast-title").textContent=ok?"무장 변경 완료":"편성표 원문은 유지했습니다";$("toast-description").textContent=ok?`${result.message} 입력란에서 변경 내용을 확인할 수 있습니다.`:result.message;toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},4500);
  if(ok){
    const results=$("results"),scrollX=window.scrollX,scrollY=window.scrollY;
    const openCards=new Set([...results.querySelectorAll('.card-head[aria-expanded="true"]')].map(head=>head.dataset.card));openCards.add(String(unitIndex));
    const compactScroll=[...results.querySelectorAll(".weapon-compact-scroll")].map((node,index)=>({index,left:node.scrollLeft}));
    render();
    for(const cardIndex of openCards){const head=results.querySelector(`.card-head[data-card="${CSS.escape(cardIndex)}"]`);if(head){head.nextElementSibling.hidden=false;head.setAttribute("aria-expanded","true");}}
    [...results.querySelectorAll(".weapon-compact-scroll")].forEach((node,index)=>{const saved=compactScroll.find(item=>item.index===index);if(saved)node.scrollLeft=saved.left;});
    requestAnimationFrame(()=>{window.scrollTo({left:scrollX,top:scrollY,behavior:"instant"});requestAnimationFrame(()=>window.scrollTo({left:scrollX,top:scrollY,behavior:"instant"}));});
  }
}
results.addEventListener("change",event=>{
  const sourceSelect=event.target.closest("[data-weapon-replace-source]");
  if(sourceSelect){const result=replaceRosterWeaponChoice(Number(sourceSelect.dataset.unitIndex),sourceSelect.dataset.weaponName,sourceSelect.dataset.weaponType,sourceSelect.value);if(result.needsChoice)return;finishWeaponReplacement(result,Number(sourceSelect.dataset.unitIndex));return;}
  const choice=event.target.closest("[data-loadout-weapon]");if(!choice)return;if(!choice.checked){choice.checked=true;return;}
  const unitIndex=Number(choice.dataset.unitIndex),result=replaceRosterWeaponChoice(unitIndex,choice.dataset.weaponName,choice.dataset.weaponType);
  if(result.needsChoice){choice.checked=false;const cell=choice.closest("td")||choice.closest(".weapon-mobile-card-head"),picker=document.createElement("div");picker.className="weapon-replace-picker";picker.innerHTML=`<label>교체할 장착 무기 <select data-weapon-replace-source data-unit-index="${unitIndex}" data-weapon-name="${escapeHtml(choice.dataset.weaponName)}" data-weapon-type="${escapeHtml(choice.dataset.weaponType)}"><option value="">선택…</option>${result.choices.map(item=>`<option value="${escapeHtml(item.name)}">${escapeHtml(item.label)}</option>`).join("")}</select></label>`;cell.querySelector(".weapon-replace-picker")?.remove();cell.append(picker);return;}
  finishWeaponReplacement(result,unitIndex);
});
document.querySelector(".view-tabs").addEventListener("click",e=>{const button=e.target.closest("[data-view]");if(!button)return;const view=button.dataset.view,assistant=view==="assistant",game=view==="game",stratagem=view==="stratagems",datasheets=view==="datasheets";if(assistant)$("assistant-page").innerHTML=renderAssistantPage(parseRoster($("roster").value));if(stratagem){$("stratagem-page").innerHTML=renderStratagemPage();if(!coreStratagems.length&&stratagemLoadStatus!=="불러오는 중")loadCoreStratagems();}document.body.classList.toggle("assistant-mode",assistant);document.body.classList.toggle("game-mode",game);document.body.classList.toggle("stratagem-mode",stratagem);document.querySelectorAll(".view-tab").forEach(x=>x.classList.toggle("active",x===button));$("summary").hidden=!datasheets;$("results").hidden=!datasheets;$("assistant-page").hidden=!assistant;$("game-page").hidden=!game;$("stratagem-page").hidden=!stratagem;});
$("assistant-page").addEventListener("click",e=>{const tab=e.target.closest("[data-phase]");if(tab){$("assistant-page").querySelectorAll(".phase-tab").forEach(x=>x.classList.toggle("active",x===tab));$("assistant-page").querySelectorAll(".phase-panel").forEach(x=>x.hidden=x.dataset.phasePanel!==tab.dataset.phase);return;}const cp=e.target.closest("[data-cp]");if(cp){cpValue=Math.max(0,Math.min(20,cpValue+(cp.dataset.cp==="plus"?1:-1)));try{localStorage.setItem("40k-cp",String(cpValue));}catch{}const output=$("cp-value");if(output)output.textContent=cpValue;return;}const spend=e.target.closest("[data-spend-cp]");if(spend){const cost=Number(spend.dataset.spendCp)||0;if(cpValue<cost){const toast=$("toast");$("toast-title").textContent="CP 부족";$("toast-description").textContent=`현재 ${cpValue} CP이며 이 스트라타젬에는 ${cost} CP가 필요합니다.`;toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},3500);return;}cpValue-=cost;try{localStorage.setItem("40k-cp",String(cpValue));}catch{}const output=$("cp-value");if(output)output.textContent=cpValue;spend.textContent="사용 완료";spend.disabled=true;spend.dataset.cpSpent="1";return;}if(e.target.closest("[data-reset-assistant]")){$("assistant-page").querySelectorAll("[data-assistant-check]").forEach(check=>{check.checked=false;check.closest(".check-row")?.classList.remove("checked");try{localStorage.removeItem(`40k-assistant:${check.dataset.assistantCheck}`);}catch{}});}});
$("assistant-page").addEventListener("click",e=>{if(e.target.closest("[data-quick-stratagem-retry]"))loadCoreStratagems();});
$("assistant-page").addEventListener("change",e=>{const check=e.target.closest("[data-assistant-check]");if(check){try{localStorage.setItem(`40k-assistant:${check.dataset.assistantCheck}`,check.checked?"1":"0");}catch{}check.closest(".check-row")?.classList.toggle("checked",check.checked);syncQuickAssistantCheck(check.dataset.assistantCheck,check.checked);}});
$("assistant-page").addEventListener("click",e=>{if(!e.target.closest("[data-reset-assistant]"))return;const parsed=parseRoster($("roster").value);$("quick-assistant-content").innerHTML=renderQuickAssistant(parsed);const tasks=makeAssistantTasks(parsed);$("quick-assistant-count").textContent=tasks.length?`${tasks.length}개 남음`:"";});
$("assistant-page").addEventListener("click",e=>{const spend=e.target.closest("[data-stratagem-check]");if(spend?.dataset.cpSpent==="1"){const id=spend.dataset.stratagemCheck;for(const check of $("assistant-page").querySelectorAll(`[data-assistant-check="${CSS.escape(id)}"]`)){check.checked=true;check.closest(".check-row")?.classList.add("checked");try{localStorage.setItem(`40k-assistant:${id}`,"1");}catch{}}for(const button of $("assistant-page").querySelectorAll(`[data-stratagem-check="${CSS.escape(id)}"]`)){button.textContent="사용 완료";button.disabled=true;}}if(e.target.closest("[data-reset-assistant]"))for(const button of $("assistant-page").querySelectorAll("[data-stratagem-check]")){button.textContent="CP 사용";button.disabled=false;delete button.dataset.cpSpent;try{localStorage.removeItem(`40k-assistant:${button.dataset.stratagemCheck}`);}catch{}}});
function resizeRoster(){const box=$("roster");box.style.height="";}
const ROSTER_PRESETS_KEY="40k-roster-presets-v1";
function readRosterPresets(){try{const value=JSON.parse(localStorage.getItem(ROSTER_PRESETS_KEY)||"{\"recent\":[],\"saved\":[]}");return {recent:Array.isArray(value.recent)?value.recent:[],saved:Array.isArray(value.saved)?value.saved:[]};}catch{return {recent:[],saved:[]};}}
function writeRosterPresets(value){try{localStorage.setItem(ROSTER_PRESETS_KEY,JSON.stringify(value));return true;}catch{const status=$("roster-preset-status");if(status)status.textContent="브라우저 저장 공간이 부족해 프리셋을 저장하지 못했습니다.";return false;}}
function refreshRosterPresetOptions(){
  const presets=readRosterPresets(),presetSelect=$("roster-preset-select"),recentSelect=$("roster-recent-select"),presetCurrent=presetSelect.value,recentCurrent=recentSelect.value;
  presetSelect.innerHTML='<option value="">저장한 프리셋 없음</option>';recentSelect.innerHTML='<option value="">최근 편성표 없음</option>';
  for(const item of presets.saved){const option=document.createElement("option");option.value=item.id;option.textContent=item.name;presetSelect.append(option);}
  for(const item of presets.recent){const option=document.createElement("option");option.value=item.id;option.textContent=item.name;recentSelect.append(option);}
  presetSelect.value=presets.saved.some(item=>item.id===presetCurrent)?presetCurrent:(presets.saved[0]?.id||"");
  recentSelect.value=presets.recent.some(item=>item.id===recentCurrent)?recentCurrent:(presets.recent[0]?.id||"");
  $("delete-roster-preset").disabled=!presetSelect.value;
  const preferred=presets.saved[0]||presets.recent[0],defaultButton=$("load-preferred-roster");defaultButton.disabled=!preferred;defaultButton.textContent=presets.saved.length?"기본 편성표 불러오기 · 내 프리셋 우선":"기본 편성표 불러오기 · 최근 편성표";
}
function rememberRecentRoster(){
  const text=$("roster").value.trim();if(!text)return;
  const presets=readRosterPresets(),now=Date.now(),id=String(now),stamp=new Date(now).toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"});
  presets.recent=[{id,name:"최근 편성표 · "+stamp,text,updatedAt:now},...presets.recent.filter(item=>item.text!==text)].slice(0,6);
  if(writeRosterPresets(presets))refreshRosterPresetOptions();
}
$("roster-preset-select").addEventListener("change",()=>{$("delete-roster-preset").disabled=!$("roster-preset-select").value;});
function loadRosterEntry(item,label){const status=$("roster-preset-status");if(!item){status.textContent="불러올 편성표가 없습니다.";return;}$("roster").value=item.text;resizeRoster();render();status.textContent=`‘${item.name}’ ${label}을 입력란에 불러왔습니다.`;}
$("save-roster-preset").addEventListener("click",()=>{const name=$("roster-preset-name").value.trim(),text=$("roster").value.trim(),status=$("roster-preset-status");if(!text){status.textContent="먼저 편성표를 붙여넣거나 불러오세요.";return;}if(!name){$("roster-preset-name").focus();status.textContent="프리셋 이름을 입력하세요.";return;}const presets=readRosterPresets(),same=presets.saved.findIndex(item=>item.name.toLocaleLowerCase()===name.toLocaleLowerCase()),item={id:same>=0?presets.saved[same].id:(globalThis.crypto?.randomUUID?.()||String(Date.now())),name,text,updatedAt:Date.now()};if(same>=0)presets.saved.splice(same,1);presets.saved.unshift(item);presets.saved=presets.saved.slice(0,30);if(!writeRosterPresets(presets))return;refreshRosterPresetOptions();$("roster-preset-select").value=item.id;$("delete-roster-preset").disabled=false;status.textContent=`‘${name}’ 프리셋 슬롯에 저장했습니다.`;});
$("load-roster-preset").addEventListener("click",()=>{const id=$("roster-preset-select").value,item=readRosterPresets().saved.find(entry=>entry.id===id);loadRosterEntry(item,"프리셋");});
$("load-roster-recent").addEventListener("click",()=>{const id=$("roster-recent-select").value,item=readRosterPresets().recent.find(entry=>entry.id===id);loadRosterEntry(item,"최근 편성표");});
$("load-preferred-roster").addEventListener("click",()=>{const presets=readRosterPresets(),selected=presets.saved.find(entry=>entry.id===$("roster-preset-select").value),recent=presets.recent.find(entry=>entry.id===$("roster-recent-select").value),item=selected||presets.saved[0]||recent||presets.recent[0];loadRosterEntry(item,(selected||presets.saved.length)?"기본 프리셋":"최근 편성표");});
$("delete-roster-preset").addEventListener("click",()=>{const id=$("roster-preset-select").value,status=$("roster-preset-status"),presets=readRosterPresets(),item=presets.saved.find(entry=>entry.id===id);if(!item)return;presets.saved=presets.saved.filter(entry=>entry.id!==id);if(!writeRosterPresets(presets))return;refreshRosterPresetOptions();status.textContent=`‘${item.name}’ 프리셋 슬롯을 삭제했습니다.`;});
refreshRosterPresetOptions();
// Save pasted rosters into recent history immediately, even before analysis.
$("roster").addEventListener("paste",()=>setTimeout(()=>{rememberRecentRoster();render();},0));
$("roster").addEventListener("change",()=>render());
$("clear-roster").addEventListener("click",()=>{$("roster").value="";resizeRoster();render();$("roster").focus();});
$("load-example").addEventListener("click",()=>{$("roster").value=example;resizeRoster();render()});
$("parse").addEventListener("click",()=>{rememberRecentRoster();render();});
$("results").addEventListener("click",e=>{const save=e.target.closest("[data-save-translation]");if(save){e.preventDefault();saveManualRuleTranslation(Number(save.dataset.saveTranslation));return;}const all=e.target.closest("[data-translate-all]");if(all){e.preventDefault();runTranslationReview(activeTranslationCandidates.map((_,i)=>i));return;}const one=e.target.closest("[data-translate-candidate]");if(one){e.preventDefault();runTranslationReview([Number(one.dataset.translateCandidate)]);return;}const wound=e.target.closest("[data-wound-action]");if(wound){e.preventDefault();e.stopPropagation();const key=wound.dataset.woundKey,max=Number(wound.dataset.woundMax)||0;if(!max)return;let value=currentWounds(key,max);value=Math.max(0,Math.min(max,value+(wound.dataset.woundAction==="plus"?1:-1)));woundState.set(key,value);const output=document.querySelector(`[data-wound-value="${CSS.escape(key)}"]`);if(output)output.textContent=`${value}/${max}`;return;}const button=e.target.closest(".keyword-chip");if(button)showKeywordToast(button.dataset.keyword);});
$("results").addEventListener("change",e=>{const select=e.target.closest("[data-unit-match]");if(!select)return;const key=unitMatchKey(select.dataset.unitMatch);if(select.value)sessionUnitMatches.set(key,select.value);else sessionUnitMatches.delete(key);render();});
$("unit-quick-nav").addEventListener("click",e=>{const collapse=e.target.closest("#unit-quick-nav-collapse");if(!collapse)return;quickNavCollapsed=!quickNavCollapsed;$("unit-quick-nav-body").hidden=quickNavCollapsed;$("unit-quick-nav").classList.toggle("is-collapsed",quickNavCollapsed);collapse.setAttribute("aria-expanded",String(!quickNavCollapsed));collapse.setAttribute("aria-label",quickNavCollapsed?"전투 메뉴 펼치기":"전투 메뉴 접기");collapse.querySelector("span").textContent=quickNavCollapsed?"☰":"×";try{localStorage.setItem("40k-quick-nav-collapsed",quickNavCollapsed?"1":"0");}catch{}});
$("unit-quick-nav").addEventListener("click",e=>{const toggle=e.target.closest("#unit-quick-nav-toggle");if(toggle){const list=$("unit-quick-nav-list"),open=list.hidden;if(open){$("quick-assistant").open=false;$("quick-stratagem-nav").open=false;}list.hidden=!open;toggle.setAttribute("aria-expanded",String(open));return;}const closeList=()=>{$("unit-quick-nav-list").hidden=true;$("unit-quick-nav-toggle").setAttribute("aria-expanded","false");};if(e.target.closest("[data-assistant-jump]")){document.querySelector('[data-view="assistant"]').click();closeList();requestAnimationFrame(()=>$("assistant-page").scrollIntoView({behavior:"smooth",block:"start"}));return;}const item=e.target.closest("[data-unit-jump]");if(!item)return;if(document.body.classList.contains("assistant-mode")||document.body.classList.contains("game-mode"))document.querySelector('[data-view="datasheets"]').click();const card=document.querySelector(`[data-unit-card="${CSS.escape(item.dataset.unitJump)}"]`);if(!card)return;const head=card.querySelector(".card-head"),body=head?.nextElementSibling;if(body?.hidden){body.hidden=false;head.setAttribute("aria-expanded","true");}card.scrollIntoView({behavior:"smooth",block:"start"});closeList();});
$("unit-quick-nav").addEventListener("click",e=>{const button=e.target.closest("[data-quick-phase]");if(!button)return;quickAssistantPhase=button.dataset.quickPhase;$("quick-assistant-content").innerHTML=renderQuickAssistant(parseRoster($("roster").value));});
$("unit-quick-nav").addEventListener("change",e=>{const check=e.target.closest("[data-quick-assistant-check]");if(!check)return;try{localStorage.setItem(`40k-assistant:${check.dataset.quickAssistantCheck}`,check.checked?"1":"0");}catch{}check.closest(".quick-assistant-row")?.classList.toggle("checked",check.checked);syncQuickAssistantCheck(check.dataset.quickAssistantCheck,check.checked);});
$("assistant-page").addEventListener("click",e=>{if(!e.target.closest("[data-cp],[data-spend-cp]"))return;requestAnimationFrame(()=>{const main=$("cp-value"),quick=$("quick-stratagem-cp-value");if(main&&quick)quick.textContent=main.textContent;});});
$("unit-quick-nav").addEventListener("click",e=>{const cp=e.target.closest("[data-cp]");if(cp){cpValue=Math.max(0,Math.min(20,cpValue+(cp.dataset.cp==="plus"?1:-1)));try{localStorage.setItem("40k-cp",String(cpValue));}catch{}document.querySelectorAll("[data-cp-output]").forEach(output=>output.textContent=String(cpValue));return;}const spend=e.target.closest("[data-quick-stratagem-spend]");if(spend){const cost=Number(spend.dataset.spendCp)||0;if(cpValue<cost){const toast=$("toast");$("toast-title").textContent="CP 부족";$("toast-description").textContent=`현재 ${cpValue} CP이며 이 스트라타젬에는 ${cost} CP가 필요합니다.`;toast.classList.add("show");toast.setAttribute("aria-hidden","false");clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},3500);return;}cpValue-=cost;try{localStorage.setItem("40k-cp",String(cpValue));localStorage.setItem(`40k-assistant:${spend.dataset.stratagemCheck}`,"1");}catch{}document.querySelectorAll("[data-cp-output]").forEach(output=>output.textContent=String(cpValue));document.querySelectorAll(`[data-stratagem-check="${CSS.escape(spend.dataset.stratagemCheck)}"]`).forEach(button=>{button.textContent="사용 완료";button.disabled=true;button.dataset.cpSpent="1";});}});
$("assistant-page").addEventListener("click",e=>{if(!e.target.closest("[data-reset-assistant]"))return;document.querySelectorAll("[data-stratagem-check]").forEach(button=>{button.textContent="CP 사용";button.disabled=false;delete button.dataset.cpSpent;try{localStorage.removeItem(`40k-assistant:${button.dataset.stratagemCheck}`);}catch{}});});
$("stratagem-page").addEventListener("click",e=>{const keyword=e.target.closest(".keyword-chip");if(keyword){showKeywordToast(keyword.dataset.keyword);return;}const parentSummary=e.target.closest(".stratagem-reference-group>summary");if(parentSummary){const group=parentSummary.parentElement;requestAnimationFrame(()=>{const open=group.open;[...group.children].filter(child=>child.matches(".stratagem-reference-card,.stratagem-phase")).forEach(child=>child.open=open);});return;}const category=e.target.closest("[data-stratagem-category]");if(category){quickStratagemCategory=category.dataset.stratagemCategory;$("stratagem-page").innerHTML=renderStratagemPage();renderQuickStratagemNav();return;}if(e.target.closest("[data-detachment-picker-toggle]")){detachmentPickerExpanded=!detachmentPickerExpanded;$("stratagem-page").innerHTML=renderStratagemPage();return;}const detachment=e.target.closest("[data-detachment-option]");if(detachment){quickStratagemDetachment=detachment.dataset.detachmentOption;detachmentPickerExpanded=false;$("stratagem-page").innerHTML=renderStratagemPage();renderQuickStratagemNav();return;}if(e.target.closest("[data-quick-stratagem-retry]")){loadCoreStratagems();return;}const item=e.target.closest("[data-quick-stratagem-id]");if(item)showStratagemToast(item.dataset.quickStratagemId);});
$("stratagem-page").addEventListener("change",e=>{const select=e.target.closest("[data-stratagem-detachment]");if(!select)return;quickStratagemDetachment=select.value;$("stratagem-page").innerHTML=renderStratagemPage();renderQuickStratagemNav();});
$("assistant-page").addEventListener("click",e=>{const button=e.target.closest(".keyword-chip");if(button)showKeywordToast(button.dataset.keyword);});
$("assistant-page").addEventListener("click",e=>{const detail=e.target.closest("[data-assistant-detail-title]");if(detail)showAssistantRuleDetail(detail.dataset.assistantDetailTitle,detail.dataset.assistantDetailText);});
$("unit-quick-nav").addEventListener("click",e=>{const detail=e.target.closest("[data-assistant-detail-title]");if(detail)showAssistantRuleDetail(detail.dataset.assistantDetailTitle,detail.dataset.assistantDetailText);});
$("unit-quick-nav").addEventListener("click",e=>{if(e.target.closest("[data-quick-stratagem-retry]"))loadCoreStratagems();});
$("unit-quick-nav").addEventListener("click",e=>{const tab=e.target.closest("[data-stratagem-category]");if(!tab)return;quickStratagemCategory=tab.dataset.stratagemCategory;renderQuickStratagemNav();if(!$("stratagem-page").hidden)$("stratagem-page").innerHTML=renderStratagemPage();});
$("unit-quick-nav").addEventListener("change",e=>{const select=e.target.closest("[data-stratagem-detachment]");if(!select)return;quickStratagemDetachment=select.value;renderQuickStratagemNav();if(!$("stratagem-page").hidden)$("stratagem-page").innerHTML=renderStratagemPage();});
$("unit-quick-nav").addEventListener("click",e=>{const item=e.target.closest("[data-quick-stratagem-id]");if(item)showStratagemToast(item.dataset.quickStratagemId);});
document.addEventListener("click",e=>{if(e.target.closest("[data-stratagem-dialog-spend]")){const dialog=e.target.closest("#stratagem-detail-dialog");if(dialog)useStratagemFromDialog(dialog);}});
$("quick-assistant").addEventListener("toggle",()=>{if($("quick-assistant").open){$("quick-stratagem-nav").open=false;$("unit-quick-nav-list").hidden=true;$("unit-quick-nav-toggle").setAttribute("aria-expanded","false");}});
$("quick-stratagem-nav").addEventListener("toggle",()=>{if($("quick-stratagem-nav").open){$("quick-assistant").open=false;$("unit-quick-nav-list").hidden=true;$("unit-quick-nav-toggle").setAttribute("aria-expanded","false");if(!coreStratagems.length&&stratagemLoadStatus!=="불러오는 중")loadCoreStratagems();}});
const savedTranslationFeed=(()=>{try{return localStorage.getItem("40k-translation-feed")||"";}catch{return "";}})();
const savedTranslationWriteToken=(()=>{try{return localStorage.getItem("40k-translation-write-token")||"";}catch{return "";}})();
if(!v2TranslationFeed)v2TranslationFeed=savedTranslationFeed||DEFAULT_TRANSLATION_FEED;
$("translation-feed-url").value=v2TranslationFeed;
$("translation-write-token").value=savedTranslationWriteToken;
$("load-translations").addEventListener("click",()=>{v2TranslationFeed=$("translation-feed-url").value.trim();try{if(v2TranslationFeed)localStorage.setItem("40k-translation-feed",v2TranslationFeed);}catch{}loadV2TranslationFeed();});
$("translation-write-token").addEventListener("change",()=>{try{const token=$("translation-write-token").value.trim();if(token)localStorage.setItem("40k-translation-write-token",token);else localStorage.removeItem("40k-translation-write-token");}catch{}});
$("roster").value="";resizeRoster();render();currentConnectionProgress=0;updateDataConnectionProgress(0,"편성표를 불러오면 BSData와 공통 규칙 연결을 시작합니다.","waiting");
if(v2TranslationFeed)loadV2TranslationFeed();else{$("translation-feed-status").textContent=`GitHub 기본 번역 ${bundledTranslationCount}개 적용됨 · Google Sheets 주소를 연결하면 최신 승인 번역을 확인합니다.`;$('translation-feed-status').className="translation-feed-status ready";}
$("game-page").addEventListener("input",e=>{const field=e.target.closest("[data-game-field]"),score=e.target.closest("[data-round-score]");if(!field&&!score)return;const state=readGameTracker();if(field)state[field.dataset.gameField]=field.value;else{const round=Number(score.dataset.roundScore),player=score.dataset.player;if(round>=0&&round<5&&(player==="us"||player==="them"))state.rounds[round][player]=Math.max(0,Math.min(99,Number(score.value)||0));}writeGameTracker(state);for(const side of ["us","them"]){const total=state.rounds.reduce((sum,r)=>sum+r[side],0),output=$("game-page").querySelector(`[data-score-total="${side}"]`);if(output)output.textContent=String(total);}});
$("game-page").addEventListener("click",e=>{if(!e.target.closest("[data-reset-game]"))return;try{localStorage.removeItem(GAME_TRACKER_KEY);}catch{}$("game-page").innerHTML=renderGameTracker(parseRoster($("roster").value).meta);});
