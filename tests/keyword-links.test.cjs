const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
function section(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `missing ${start}`);
  return source.slice(from, to);
}
const context = vm.createContext({
  textKey: value => String(value).trim().toLowerCase(),
  keywordText: value => String(value ?? ''),
  keyGlossary: new Map(),
  abilityTextTranslations: new Map(),
  abilityTranslations: new Map(),
  v2LabelTranslations: new Map(),
  translations: new Map(),
  sourceDescriptionFor: () => '',
  escapeHtml: value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])),
  metadataText: value => String(value ?? ''),
  tr: value => value,
  db:{units:[]}
});
vm.runInContext([
  section('const keyGlossary =', 'const phoneticWords ='),
  section('function keywordInfo(', 'function renderKeywordButton('),
  section('function renderKeywordButton(', 'function unitWoundMax('),
  section('function renderRuleMarkup(', 'function tr('),
  section('function richText(', 'function weaponName('),
  section('function renderWeaponBuffKeywords(', 'function renderWeaponModelNames(')
].join('\n'), context);

test('numbered weapon abilities resolve to usable 11th edition descriptions', () => {
  const blast = context.keywordInfo('Blast 2');
  assert.equal(blast.ko, '폭발 2');
  assert.match(blast.description, /모델 5개마다.*2개/);
  assert.equal(context.keywordInfo('폭발 2').key, blast.key);
  assert.match(context.keywordInfo('Rapid Fire 1').description, /사거리 절반.*1개/);
  assert.match(context.keywordInfo('Melta 2').description, /피해\(D\).*2/);
});

test('Explosives and Grenades keywords explain the core stratagem', () => {
  const explosives=context.keywordInfo('Explosives');
  assert.equal(explosives.ko,'폭발물');
  assert.match(explosives.description,/Explosives 스트라타젬/);
  assert.match(explosives.description,/1 CP/);
  assert.match(context.keywordInfo('Grenades').description,/Explosives 스트라타젬/);
  assert.match(context.renderKeywordButton('Explosives'),/data-keyword="explosives"[^>]*>폭발물 \(Explosives\)/);
  assert.match(context.renderRuleMarkup('이 유닛은 Explosives 키워드를 가집니다.'),/data-keyword="explosives"/);
});

test('Smoke links to Smokescreen and unit-name keywords use their datasheet', () => {
  assert.match(context.keywordInfo('Smoke').description,/Smokescreen 스트라타젬/);
  assert.match(context.keywordInfo('Smoke').description,/1 CP/);
  assert.match(context.renderRuleMarkup('Smoke 키워드가 있는 유닛'),/data-keyword="smoke"/);
  context.db.units=[{name:'Scout Squad',nameKo:'스카웃 분대'}];
  const scout=context.keywordInfo('Scout Squad');
  assert.equal(scout.ko,'스카웃 분대');
  assert.match(scout.description,/데이터시트 키워드/);
  assert.equal(context.keywordInfo('Unknown Squad'),null);
  context.db.units=[];
});

test('conditional Devastating Wounds resolves with its target restriction', () => {
  const english = context.keywordInfo('Devastating Wounds: non-Monster/Vehicle');
  assert.equal(english.ko, '치명적인 상처 (몬스터/차량 제외)');
  assert.match(english.description, /방어 굴림.*몬스터\/차량 키워드가 하나도 없을 때/);
  assert.equal(context.keywordInfo('치명적인 상처 (몬스터/차량 제외)').key, english.key);
  assert.match(context.renderKeywordButton('Devastating Wounds: non-Monster/Vehicle'), /data-keyword="devastating wounds: non-MONSTER\/VEHICLE"/);
});

test('translated ability prose links unbracketed Sustained Hits and Blast', () => {
  const html = context.richText('이 무기는 지속 명중 1과 폭발 2를 얻습니다.');
  assert.match(html, /data-keyword="sustained hits 1"/);
  assert.match(html, /data-keyword="blast 2"/);
  assert.equal((html.match(/data-keyword=/g) || []).length, 2);
  assert.match(context.renderRuleMarkup('이 공격은 Blast 2를 얻습니다.'), /data-keyword="blast 2"/);
});
test('detachment prose links alternate translated keyword names with English labels', () => {
  for(const [translated,english] of [['연타 1','Sustained Hits 1'],['살상타','Lethal Hits'],['정밀','Precision']]){
    assert.equal(context.keywordInfo(translated)?.en,english);
  }
  context.detachmentLabel=()=> 'Gladius Task Force';
  context.detachmentRules=[{name:{en:'Mission Tactics',ko:'임무 특화 전술'},rules:[{text:{ko:'퓨로르 전술: 이 유닛의 공격에 연타 1을 부여합니다. 말레우스 전술: 살상타를 부여합니다. 푸르가투스 전술: 정밀을 부여합니다.',en:'The unit gains Sustained Hits 1, Lethal Hits, and Precision.'}}]}];
  context.localizedRuleValue=(value,lang='ko')=>value?.[lang]||'';
  context.externalRuleText=value=>value;
  context.detachmentRulesStatus='';
  vm.runInContext(section('function renderDetachmentRules(', 'let dataDetachmentOverviewState='),context);
  const html=context.renderDetachmentRules();
  assert.match(html,/data-keyword="sustained hits 1"[^>]*>지속 명중 1 \(Sustained Hits 1\)/);
  assert.match(html,/data-keyword="lethal hits"[^>]*>치명타 명중 \(Lethal Hits\)/);
  assert.match(html,/data-keyword="precision"[^>]*>정밀 타격 \(Precision\)/);
  assert.match(html,/영문 원문 보기/);
});
test('other rule descriptions link unbracketed weapon and deployment keywords', () => {
  const html=context.renderRuleMarkup('이 무기는 분사와 근접 사격을 얻습니다. 이 유닛은 침투와 간접 사격을 가집니다.');
  for(const keyword of ['torrent','close-quarters','infiltrators','indirect fire'])assert.match(html,new RegExp(`data-keyword="${keyword}"`));
  assert.equal((html.match(/data-keyword=/g)||[]).length,4);
});

test('weapon-granted keywords can open their rule explanation', () => {
  const html = context.renderWeaponBuffKeywords([{label:'지속 명중 1', description:'', sourceName:'타이투스', sourceRule:'공세'}]);
  assert.match(html, /class="keyword-chip weapon-buff-keyword" data-keyword="sustained hits 1"/);
});

test('Psychic Hood translation retains threshold and psychic-only condition links', () => {
  for(const render of [context.richText,context.renderRuleMarkup]){
    const html=render('이 유닛은 사이킥 공격을 상대로 고통 경감 4+를 가집니다.');
    assert.match(html,/data-keyword="feel no pain 4\+"/);
    assert.match(html,/data-keyword="psychic"/);
    assert.match(html,/공격을 상대로/);
    assert.equal((html.match(/data-keyword=/g)||[]).length,2);
  }
  assert.match(context.keywordInfo('고통 경감 4+').description,/4\+/);
  const english=context.richText('This unit has Feel No Pain 4+ against psychic attacks.');
  assert.equal((english.match(/data-keyword=/g)||[]).length,2);
  const bracketed=context.richText('[고통 경감 4+]와 [Psychic]');
  assert.equal((bracketed.match(/data-keyword=/g)||[]).length,2);
});

test('approved translation variants resolve to the canonical keyword', () => {
  for(const [translated,english] of [['지속 피해 1','Sustained Hits 1'],['지속적인 타격 2','Sustained Hits 2'],['정밀도','Precision'],['정밀 공격(Precision)','Precision'],['치명타(LETHAL HITS)','Lethal Hits'],['엄폐 무시(IGNORES COVER)','Ignores Cover'],['신속 사격(Rapid Fire)','Rapid Fire'],['파괴적인 상처: 몬스터/차량 제외','Devastating Wounds: non-Monster/Vehicle']]){
    assert.equal(context.keywordInfo(translated)?.en.toLowerCase(),context.keywordInfo(english)?.en.toLowerCase(),translated);
  }
});

test('ordinary and bold rule prose retain links without linking unit names', () => {
  for(const render of [context.richText,context.renderRuleMarkup]){
    const html=render('이 유닛은 선제 공격과 엄폐 무시, 정밀 타격을 얻습니다. 정찰 6인치를 가집니다.');
    assert.equal((html.match(/data-keyword=/g)||[]).length,4);
    assert.doesNotMatch(render('강습 인터세서의 치명타 굴림'),/data-keyword=/);
  }
  const html=context.renderRuleMarkup('<strong>선제 공격</strong>과 <b>엄폐 무시</b>');
  assert.equal((html.match(/data-keyword=/g)||[]).length,2);
  assert.doesNotMatch(html,/<button[^>]*>[^<]*<button/);
});

test('InSv source corrects the approved Force Dome translation without changing normal saves', () => {
  const bundle=fs.readFileSync(path.join(__dirname,'..','approved-translations.js'),'utf8');
  const rows=JSON.parse(bundle.slice(bundle.indexOf('{'),bundle.lastIndexOf('}')+1)).translations.filter(row=>row.id==='a97e-6a4c-de68-4a4d');
  const rules=vm.createContext({textKey:value=>String(value).toLowerCase(),approvedRuleTranslation:()=>rows.at(-1).translation,v2RuleTranslations:new Map(),v2DraftRuleTranslations:new Map(),ruleFeedKey:()=>'',abilityTextTranslations:new Map(),translateTerms:value=>value});
  vm.runInContext(section('function correctRuleStatTranslation(', 'function keywordInfo('),rules);
  assert.equal(rows.length,4);
  assert.match(rules.translateRulesText(rows[0].name,rows[0].source,{id:rows[0].id}),/무적 방어 4\+ \(InSv 4\+\)/);
  assert.doesNotMatch(rules.translateRulesText(rows[0].name,rows[0].source,{id:rows[0].id}),/4\+ 방어력/);
  assert.equal(rules.correctRuleStatTranslation('The bearer has a 4+ invulnerable save.','장착 모델은 무적 방어 4+를 가집니다.'),'장착 모델은 무적 방어 4+ (InSv 4+)를 가집니다.');
  assert.equal(rules.correctRuleStatTranslation('The bearer has a 4+ invulnerable save.','장착자는 4+ 무적 방어를 가집니다.'),'장착자는 무적 방어 4+ (InSv 4+)를 가집니다.');
  assert.equal(rules.correctRuleStatTranslation('The bearer has a 4+ invulnerable save.','장착 모델은 무적 방어 4+ (InSv 4+)를 가집니다.'),'장착 모델은 무적 방어 4+ (InSv 4+)를 가집니다.');
  assert.equal(rules.correctRuleStatTranslation('This unit has Sv 4+.','4+ 방어력을 얻습니다.'),'4+ 방어력을 얻습니다.');
});
