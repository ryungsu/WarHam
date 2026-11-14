const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const context=vm.createContext({
  norm:value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,''),
  localizedRuleValue:(value,lang='en')=>typeof value==='string'?value:value?.[lang]||'',
  detachmentNameMatches:(a,b)=>String(a||'').toLowerCase()===String(b||'').toLowerCase(),
  rosterDetachmentNameCandidates:value=>String(value||'').split(',').map(x=>x.trim()).filter(Boolean),
  factionDetachmentCatalog:[]
});
vm.runInContext(source.slice(source.indexOf('const chapterRuleRequirements='),source.indexOf('const assistantPhases=')),context);

test('chapter-only army rules do not appear for another Space Marine chapter',()=>{
  const ultramarines={faction:'Ultramarines',detachment:'Gladius Task Force'};
  for(const name of ['Templar Vows','Vowed Target','Faith-Fuelled Resolve','Mission Tactics','Legacy of the Angel','Legendary Slayers','Black-winged Vigilance']){
    assert.equal(context.ruleAppliesToRoster({name},ultramarines),false,name);
  }
  assert.equal(context.ruleAppliesToRoster({name:'Templar Vows'},{faction:'Black Templars'}),true);
  assert.equal(context.ruleAppliesToRoster({name:'Vowed Target'},{faction:'Dark Angels'}),true);
  assert.equal(context.ruleAppliesToRoster({name:'Vowed Target'},{faction:'Black Templars'}),false);
  assert.equal(context.ruleAppliesToRoster({name:'Oath of Moment'},ultramarines),true);
  assert.equal(context.ruleAppliesToRoster({name:'New Rule'},ultramarines),false);
});

test('army eligibility and unit target keywords are checked separately',()=>{
  const bloodAngels={faction:'Blood Angels'};
  assert.equal(context.ruleAppliesToRoster({name:'Legacy of the Angel'},bloodAngels,{keywords:['Faction: Blood Angels','Character']}),true);
  assert.equal(context.ruleAppliesToRoster({name:'Legacy of the Angel'},bloodAngels,{keywords:['Faction: Blood Angels','Infantry']}),false);
  assert.equal(context.ruleAppliesToRoster({name:'Legacy of the Angel'},{faction:'Ultramarines'},{keywords:['Character']}),false);
  assert.equal(context.ruleAppliesToRoster({name:'Mission Tactics'},{faction:'Ultramarines',detachment:'Deathwatch Support'},{keywords:['Kill Team']}),true);
  assert.equal(context.ruleAppliesToRoster({name:'Mission Tactics'},{faction:'Ultramarines',detachment:'Gladius Task Force'},{keywords:['Kill Team']}),false);
  const restricted={name:'New Chapter Rule',description:'Restrictions: Your army can include Dark Angels units, but it cannot include Adeptus Astartes units from another Chapter.'};
  assert.equal(context.ruleAppliesToRoster(restricted,{faction:'Ultramarines'}),false);
  assert.equal(context.ruleAppliesToRoster(restricted,{faction:'Dark Angels'}),true);
});

test('a chapter rule that requires a named roster unit checks army composition',()=>{
  const rule={name:'Mastered Doctrines',description:'If your army includes a Marneus Calgar unit, this rule applies.'};
  const ultramarines={faction:'Ultramarines',rosterUnits:[{rosterName:'Intercessor Squad'}]};
  assert.equal(context.ruleAppliesToRoster(rule,ultramarines),false);
  assert.equal(context.ruleAppliesToRoster(rule,{...ultramarines,rosterUnits:[...ultramarines.rosterUnits,{rosterName:'Marneus Calgar'}]}),true);
  assert.equal(context.ruleAppliesToRoster(rule,{...ultramarines,faction:'Black Templars',rosterUnits:[{rosterName:'Marneus Calgar'}]}),false);
});

test('rules owned by another detachment are hidden',()=>{
  context.factionDetachmentCatalog=[
    {detachment:'Gladius Task Force',rules:[{name:{en:'Gladius Rule'}}]},
    {detachment:'Ironclad Champions',rules:[{name:{en:'Ironclad Rule'}}]},
    {detachment:'Gladius Task Force',faction:'Blood Angels',rules:[{name:{en:'Chapter Rule'}}]}
  ];
  const meta={faction:'Ultramarines',detachment:'Gladius Task Force'};
  assert.equal(context.ruleAppliesToRoster({name:'Gladius Rule'},meta),true);
  assert.equal(context.ruleAppliesToRoster({name:'Ironclad Rule'},meta),false);
  assert.equal(context.ruleAppliesToRoster({name:'Ironclad Rule'},{...meta,detachment:'Gladius Task Force, Ironclad Champions'}),true);
  assert.equal(context.ruleAppliesToRoster({name:'Chapter Rule'},meta),false);
  context.factionDetachmentCatalog=[];
});
