const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const {createCache}=require('../app-data-cache.js');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
function parser(){const context=vm.createContext({FACTION_ALIASES:[],KOREAN_FACTION_ALIASES:new Map(),norm:s=>String(s).toLowerCase(),normalizeMatchName:s=>String(s).toLowerCase().trim(),normalizeLoadoutText:s=>String(s).toLowerCase(),splitEnhancementNames:s=>[s],parseRosterModelLoadoutLine:()=>null,findDataUnit:()=>null});vm.runInContext(source.slice(source.indexOf('function parseRoster(text)'),source.indexOf('const sessionUnitMatches='))+source.slice(source.indexOf('function rosterAttachmentParents('),source.indexOf('function rosterUnitRenderOrder(')),context);return context;}
test('Leading and Supporting imports produce character-to-squad links',()=>{const c=parser();const parsed=c.parseRoster('FACTION KEYWORD: Ultramarines\n1x Captain Titus (115 points)\nLeading Infernus Squad\n1x Lieutenant (50 points)\nSupporting Assault Intercessor Squad\n5x Infernus Squad (95 points)\n5x Assault Intercessor Squad (85 points)');const links=c.rosterAttachmentParents(parsed.units);assert.equal(links.get(0),2);assert.equal(links.get(1),3);});
test('explicit target index distinguishes identical squads',()=>{const c=parser();const parsed=c.parseRoster('FACTION KEYWORD: Ultramarines\n1x Lieutenant (50 points)\n• Attached to: Intercessor Squad\n• Attached as: Support\n• Attached to index: 3\n5x Intercessor Squad (85 points)\n5x Intercessor Squad (85 points)');assert.equal(c.rosterAttachmentParents(parsed.units).get(0),2);});
test('reverse Attached to character keeps squad as host',()=>{const c=parser();const parsed=c.parseRoster('FACTION KEYWORD: Ultramarines\n1x Lieutenant (50 points)\n• Attached as: Support\n5x Intercessor Squad (85 points)\nAttached to Lieutenant');assert.equal(c.rosterAttachmentParents(parsed.units).get(0),1);});
test('fresh stored JSON skips network',async()=>{let calls=0;const cache=createCache({now:()=>100,read:async()=>({savedAt:50,data:{units:3}}),fetcher:async()=>{calls++;}});assert.deepEqual(await cache.json('a'),{units:3});assert.equal(calls,0);});
test('stale JSON is used offline, but records older than 30 days are rejected',async()=>{const failed=async()=>{throw Error('offline')};const cache=createCache({now:()=>86400000,read:async()=>({savedAt:0,data:[1]}),fetcher:failed});assert.deepEqual(await cache.json('a'),[1]);const expired=createCache({now:()=>31*86400000,read:async()=>({savedAt:0,data:[1]}),fetcher:failed});await assert.rejects(expired.json('a'),/offline/);});
test('concurrent requests share one fetch and a failed primary uses mirror',async()=>{let calls=0;const cache=createCache({fetcher:async url=>{calls++;if(url==='bad')throw Error('offline');return {ok:true,json:async()=>({ok:1})};}});const results=await Promise.all([cache.json(['bad','good']),cache.json(['bad','good'])]);assert.equal(calls,2);assert.deepEqual(results,[{ok:1},{ok:1}]);});

test('removing a unit clears its followers and shifts later attachment targets',()=>{const {removeUnitAndRepairAttachments}=require('../roster-builder-wargear-policy.js');const units=[{name:'leader A',attachedTo:2},{name:'leader B',attachedTo:3},{name:'squad A',attachedTo:null},{name:'squad B',attachedTo:null}];assert.equal(removeUnitAndRepairAttachments(units,2),true);assert.equal(units[0].attachedTo,null);assert.equal(units[1].attachedTo,2);assert.equal(units[2].name,'squad B');});

test('loading screen stays open until every concurrent data request finishes',()=>{
  const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;},addEventListener(){}},progress={removeAttribute(name){if(name==='value')delete this.value;}},nodes={'app-loading-screen':dialog,'app-loading-message':{textContent:''},'app-loading-progress':progress,'connection-progress':{value:0},'connection-progress-percent':{textContent:''},'data-status':{textContent:'',className:''}};
  const context=vm.createContext({$:id=>nodes[id],document:{querySelector:()=>({dataset:{}})},Map,Symbol});
  vm.runInContext(source.slice(source.indexOf('let currentConnectionProgress=0;'),source.indexOf('async function loadRulesData(')),context);
  const rules=context.beginAppLoading('규칙');
  vm.runInContext('rulesLoadingToken=globalThis.testRulesToken',Object.assign(context,{testRulesToken:rules}));
  context.updateDataConnectionProgress(42,'카탈로그 확인 중');
  assert.equal(dialog.open,true);
  assert.equal(progress.value,42);
  assert.equal(nodes['app-loading-message'].textContent,'카탈로그 확인 중');
  const stratagems=context.beginAppLoading('스트라타젬');
  context.finishAppLoading(rules);
  assert.equal(dialog.open,true);
  assert.equal(nodes['app-loading-message'].textContent,'스트라타젬');
  assert.equal(Object.hasOwn(progress,'value'),false);
  context.finishAppLoading(stratagems);
  assert.equal(dialog.open,false);
});

test('ordinary core stratagems exclude Boarding Actions and mission packs',()=>{
  const context=vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function coreStratagemSourceItems('),source.indexOf('function isChallengerStratagem(')),context);
  const groups={'(none)':[{'id':'core','name':'COMMAND RE-ROLL'}],'Boarding Actions':[{'id':'boarding','name':'BATTLEFIELD COMMAND'}],Challenger:[{'id':'challenger','name':'BURST OF SPEED','cp':0}],'Mission Pack':[{'id':'mission','name':'NEW ORDERS'}]};
  const result=context.coreStratagemSourceItems({detachments:groups});
  assert.deepEqual(result.common.map(item=>item.name),['COMMAND RE-ROLL']);
  assert.deepEqual(result.challenger.map(item=>item.name),['BURST OF SPEED']);
  assert.equal(result.challenger[0].missionDeck,'challenger');
});

test('English stratagem title is not repeated as its own subtitle',()=>{
  const context=vm.createContext({stratagemTranslation:()=>null,norm:s=>String(s).toLowerCase(),escapeHtml:s=>s,translateTerms:s=>s});
  vm.runInContext(source.slice(source.indexOf('function stratagemDisplayName('),source.indexOf('function stratagemFieldText(')),context);
  assert.equal(context.stratagemEnglishSubtitle({name:'BATTLEFIELD COMMAND'}),'');
  assert.match(context.stratagemEnglishSubtitle({name:'COMMAND RE-ROLL',nameKo:'지휘 재굴림'}),/COMMAND RE-ROLL/);
});

test('unit summary omits an empty invulnerable save but keeps a real one',()=>{
  const context=vm.createContext({statTranslations:new Map([['InSv','무적 방어']]),escapeHtml:s=>String(s)});
  vm.runInContext(source.slice(source.indexOf('function unitStatIcon('),source.indexOf('function ruleAppliesToRoster(')),context);
  const profile={typeName:'Unit',characteristics:[{name:'M',value:'6"'},{name:'InSv',value:''}]};
  assert.doesNotMatch(context.renderUnitSummary({profiles:[profile]}),/InSv/);
  profile.characteristics[1].value='4+';
  assert.match(context.renderUnitSummary({profiles:[profile]}),/InSv/);
});

test('roster builder ability preview uses reviewed rule translation',()=>{
  const nodes={'builder-unit-catalog':{innerHTML:''},'builder-unit-search':{value:''},'builder-unit-category':{value:'all'},'builder-unit-count':{textContent:''}};
  const unit={id:'u1',edition:'11',name:'Intercessor Squad',sourceFile:'Imperium - Space Marines.json',abilities:[{name:'Bolter Discipline',targetId:'1164-3aff-c9a6-718d',description:'If any of the following apply, gain +1 to hit rolls.'}]};
  const calls=[],context=vm.createContext({$:id=>nodes[id],db:{units:[unit]},norm:s=>String(s).toLowerCase(),builderUnitRole:()=> 'battleline',tr:s=>s,escapeHtml:s=>s,externalRuleText:s=>s,translateRulesText:(name,text,identity)=>{calls.push({name,identity});return '다음 중 하나라도 해당하면 명중 굴림 +1';},Map});
  vm.runInContext(source.slice(source.indexOf('function renderBuilderUnitCatalog()'),source.indexOf('function updateRosterBuilderSummary()')),context);
  context.renderBuilderUnitCatalog();
  assert.match(nodes['builder-unit-catalog'].innerHTML,/다음 중 하나라도 해당하면/);
  assert.doesNotMatch(nodes['builder-unit-catalog'].innerHTML,/any of the following apply/i);
  assert.equal(calls[0].identity.id,'1164-3aff-c9a6-718d');
});
