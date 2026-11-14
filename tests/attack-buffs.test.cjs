const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const buffSource=source.slice(source.indexOf('function rosterUnitAttackBuffs('),source.indexOf('function weaponBuffsForProfile('));
function makeContext(titusAbility){
  const units=[{rosterName:'Captain Titus'},{rosterName:'Infernus Squad'}];
  const datasheets={
    'Captain Titus':{name:'Captain Titus',abilities:[{name:'Press the Attack',description:titusAbility}],profiles:[]},
    'Infernus Squad':{name:'Infernus Squad',abilities:[],profiles:[]}
  };
  const context=vm.createContext({
    findDataUnit:name=>({unit:datasheets[name]}),
    metadataText:text=>String(text).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(),
    keywordInfo:effect=>({ko:effect}),
    translateTerms:value=>value,
    bilingualLabel:value=>value,
    profileDisplayName:value=>value.name,
    translateRulesText:(_,text)=>text,
    normalizeLoadoutText:value=>String(value).toLowerCase(),
    ruleAppliesToRoster:()=>true,
    statTranslations:new Map(),
    tr:value=>value
  });
  vm.runInContext(buffSource,context);
  return {context,units};
}

test('Titus melee buff reaches his attached squad without showing the doctrine-only choice',()=>{
  const ability='This unit’s melee attacks have: - [Sustained Hits 1: non-Monster/Vehicle]. - Or: If the assault doctrine is active for this unit, [Sustained Hits 1].';
  const {context,units}=makeContext(ability);
  const parents=new Map([[0,1]]);
  const buffs=context.rosterUnitAttackBuffs(units,parents,1);
  assert.equal(buffs.length,1);
  assert.equal(buffs[0].scope,'melee');
  assert.match(buffs[0].label,/Sustained Hits 1: non-Monster\/Vehicle/);
  assert.equal(buffs[0].sourceName,'Captain Titus');
});

test('weapon-granting version of Press the Attack applies to every weapon',()=>{
  const {context,units}=makeContext('Weapons equipped by models in this model’s unit have the [SUSTAINED HITS 1] ability.');
  const buffs=context.rosterUnitAttackBuffs(units,new Map([[0,1]]),1);
  assert.equal(buffs.length,1);
  assert.equal(buffs[0].scope,'all');
});
