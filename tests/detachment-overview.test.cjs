const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

test('data overview and navigator use only the roster-selected detachment', () => {
  const selected = 'Assault Brethren, Ironclad Champions (Assault Mastery)';
  const options = [{ id: 'selected-id', detachment: selected }];
  const items = [
    { name: 'Selected Stratagem', detachment: selected, detachmentId: 'selected-id' },
    { name: 'Other Stratagem', detachment: 'Another Detachment', detachmentId: 'other-id' }
  ];
  const context = vm.createContext({
    detachmentLabel: () => selected,
    rosterDetachmentOptions: () => options,
    factionStratagems: () => items,
    isRosterDetachment: (name, value) => name === value,
    uniqueStratagemItems: values => values,
    currentRosterMeta: { faction: 'Imperium - Ultramarines' },
    translateTerms: value => value === 'Ultramarines' ? '울트라마린' : value,
    norm: value => String(value).toLowerCase(),
    detachmentNameMatches: (a, b) => a === b,
    rosterDetachmentNameCandidates: value => value.split(',').map(part => part.trim()),
    localizedRuleValue: value => value
  });
  const helperStart = source.indexOf('function selectedDetachmentStratagems(');
  const helperEnd = source.indexOf('function stratagemDetachmentOptions(', helperStart);
  const matchStart = source.indexOf('function gameDataDetachmentMatches(');
  const matchEnd = source.indexOf('function externalRuleText(', matchStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart && matchStart >= 0 && matchEnd > matchStart);
  vm.runInContext(source.slice(helperStart, helperEnd), context);
  vm.runInContext(source.slice(matchStart, matchEnd), context);
  assert.equal(context.selectedDetachmentStratagems().map(item => item.name).join(','), 'Selected Stratagem');
  assert.equal(context.rosterFactionLabel(), '울트라마린');
  assert.equal(context.gameDataDetachmentMatches({ detachments: [] }, { detachment_id: 'selected-id', detachment: selected }, selected), true);
  assert.equal(context.gameDataDetachmentMatches({ detachments: [] }, { detachment_id: 'other-id', detachment: 'Another Detachment' }, selected), false);
});

test('data overview includes collapsed common and selected detachment stratagem groups', () => {
  const context=vm.createContext({
    detachmentLabel:()=> 'Gladius Task Force',
    coreStratagems:[{name:'Smokescreen',isCore:true}],
    isCommonStratagem:item=>item.isCore,
    uniqueStratagemItems:items=>items,
    selectedDetachmentStratagems:()=>[{name:'Detachment Stratagem'}],
    renderDataOverviewStratagemRows:items=>items.map(item=>item.name).join(''),
    renderDetachmentRules:()=>'<details class="detachment-rules"></details>',
    translateTerms:value=>value,
    rosterFactionLabel:()=> 'Ultramarines',
    escapeHtml:value=>String(value),
    stratagemLoadStatus:'연결 완료'
  });
  const start=source.indexOf('function renderDataDetachmentOverview('),end=source.indexOf('function updateDataDetachmentOverview(',start);
  vm.runInContext(source.slice(start,end),context);
  const html=context.renderDataDetachmentOverview();
  assert.match(html,/data-stratagem-section="common"[^>]*><summary>공용 스트라타젬 <span>1개/);
  assert.match(html,/data-stratagem-section="detachment"[^>]*><summary>선택 편제 스트라타젬 <span>1개/);
  assert.doesNotMatch(html,/data-stratagem-section="(?:common|detachment)" open/);
});

test('keyword roster matches combine attached units and ignore partial keyword names', () => {
  const units=[{rosterName:'Scout Squad'},{rosterName:'Lieutenant',attachedTo:'Scout Squad'},{rosterName:'Smoke Tank'}];
  const data={
    'Scout Squad':{keywords:['Infantry']},
    Lieutenant:{keywords:['Character','Smoke']},
    'Smoke Tank':{keywords:['Smokescreen']}
  };
  const context=vm.createContext({
    norm:value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,''),
    keywordInfo:raw=>({en:raw}),
    rosterAttachmentParents:()=>new Map([[1,0]]),
    findDataUnit:name=>({unit:data[name]})
  });
  const start=source.indexOf('function rosterUnitsWithKeyword('),end=source.indexOf('function showKeywordToast(',start);
  vm.runInContext(source.slice(start,end),context);
  const result=context.rosterUnitsWithKeyword({units},'Smoke');
  assert.equal(result.matches.length,1);
  assert.equal(result.matches[0].unit.rosterName,'Scout Squad');
  assert.equal(result.matches[0].sources[0],'Lieutenant');
});
