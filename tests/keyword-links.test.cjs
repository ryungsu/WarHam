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
  tr: value => value
});
vm.runInContext([
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

test('translated ability prose links unbracketed Sustained Hits and Blast', () => {
  const html = context.richText('이 무기는 지속 명중 1과 폭발 2를 얻습니다.');
  assert.match(html, /data-keyword="sustained hits 1"/);
  assert.match(html, /data-keyword="blast 2"/);
  assert.equal((html.match(/data-keyword=/g) || []).length, 2);
  assert.match(context.renderRuleMarkup('이 공격은 Blast 2를 얻습니다.'), /data-keyword="blast 2"/);
});

test('weapon-granted keywords can open their rule explanation', () => {
  const html = context.renderWeaponBuffKeywords([{label:'지속 명중 1', description:'', sourceName:'타이투스', sourceRule:'공세'}]);
  assert.match(html, /class="keyword-chip weapon-buff-keyword" data-keyword="sustained hits 1"/);
});
