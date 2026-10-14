import type {Operative,Roster,Team} from './types.ts';
const rifle=['Auto Bolt Rifle','Bolt Rifle','Stalker Bolt Rifle'];
const melee=['Chainsword','Fists','Power Fist','Power Weapon','Thunder Hammer'];
export function loadouts(op:Operative):string[][] {
 const n=op.opTypeName.toLowerCase(); let sets:string[][];
 if(n==='assault intercessor sergeant') sets=[...['Hand Flamer','Heavy Bolt Pistol'].flatMap(r=>melee.filter(m=>m!=='Fists').map(m=>[r,m])),['Plasma Pistol','Chainsword']];
 else if(n==='intercessor sergeant') sets=rifle.flatMap(r=>melee.map(m=>[r,m]));
 else if(n==='intercessor gunner') sets=rifle.map(r=>[r,'Auxiliary Grenade Launcher','Fists']);
 else if(n==='intercessor warrior') sets=rifle.map(r=>[r,'Fists']);
 else if(n==='scout sergeant') sets=[['Astartes Shotgun','Fists'],['Boltgun','Fists'],['Bolt Pistol','Chainsword']];
 else if(n==='scout warrior') sets=[['Astartes Shotgun','Fists'],['Boltgun','Fists'],['Bolt Pistol','Combat Blade']];
 else if(n==='scout heavy gunner') sets=[['Bolt Pistol','Heavy Bolter','Fists'],['Bolt Pistol','Missile Launcher','Fists']];
 else sets=[op.weapons.map(w=>w.wepName)];
 return sets.map(s=>s.map(n=>{const w=op.weapons.find(w=>w.wepName.toLowerCase()===n.toLowerCase());if(!w)throw new Error(`Missing weapon ${op.opTypeId}: ${n}`);return w.wepId}));
}
export const isLeader=(op:Operative)=>op.keywords.split(',').some(k=>k.trim()==='LEADER');
export function validate(r:Roster,t:Team):string[]{
 const errors:string[]=[];const total=t.killteamId==='IMP-AOD'?6:9;
 if(r.members.length!==total) errors.push(`오퍼레이티브 ${total}명 필요 · 현재 ${r.members.length}명`);
 const ops=r.members.map(m=>t.opTypes.find(o=>o.opTypeId===m.type));
 if(ops.filter(o=>o&&isLeader(o)).length!==1)errors.push('리더를 정확히 1명 선택하세요.');
 for(const op of t.opTypes){const count=ops.filter(o=>o?.opTypeId===op.opTypeId).length;
  const max=op.opTypeName.includes('Warrior')?total:op.opTypeName==='Scout Heavy Gunner'?2:1;
  if(count>max)errors.push(`${op.opTypeName} 최대 ${max}명`);
 }
 for(const [i,m] of r.members.entries()){const op=ops[i];if(!op){errors.push('알 수 없는 오퍼레이티브');continue;}
  if(!loadouts(op).some(l=>l.length===m.loadout.length&&l.every(id=>m.loadout.includes(id))))errors.push(`${op.opTypeName}: 허용되지 않은 무장 조합`);
  if(op.abilities.some(a=>a.abilityName==='Chapter Veteran')&&(!m.veteranTactic||!op.options.some(o=>o.optionId.split('-CT-')[1]===m.veteranTactic)))errors.push(`${op.opTypeName}: 추가 챕터 전술 1개를 선택하세요.`);
 }
 if(t.killteamId==='IMP-AOD'&&ops.filter(o=>o&&['Eliminator Sniper','Heavy Intercessor Gunner'].includes(o.opTypeName)).length>1)errors.push('엘리미네이터 스나이퍼와 헤비 인터세서 거너는 합계 최대 1명입니다.');
 if(t.killteamId==='IMP-SCT'){for(const gun of ['Heavy Bolter','Missile Launcher']){
  const weapon=t.opTypes.find(o=>o.opTypeName==='Scout Heavy Gunner')?.weapons.find(w=>w.wepName===gun);
  if(weapon&&r.members.filter(m=>m.loadout.includes(weapon.wepId)).length>1)errors.push(`${gun} 중화기 사수는 1명만 선택할 수 있습니다.`);
 }}
 if(r.equipment.length>4||new Set(r.equipment).size!==r.equipment.length)errors.push('서로 다른 장비 최대 4개를 선택하세요.');
 if(r.equipment.some(id=>!t.equipments.some(e=>e.eqId===id)))errors.push('알 수 없는 장비');
 for(const group of ['UNIVERSAL-UE-UG','UNIVERSAL-UE-XG'])if(r.equipment.filter(id=>id.startsWith(group)).length>1)errors.push('같은 수류탄 장비는 한 가지 조합만 선택할 수 있습니다.');
 if(t.killteamId==='IMP-AOD'&&(r.tactics.length!==2||new Set(r.tactics).size!==2||r.tactics.some(id=>!t.opTypes[0].options.some(o=>o.optionId.split('-CT-')[1]===id))))errors.push('서로 다른 챕터 전술 2개를 선택하세요.');
 return errors;
}
export function parseBackup(value:unknown,teams:Team[]):Roster[]{
 if(!value||typeof value!=='object'||!('version' in value)||value.version!==1||!('rosters' in value)||!Array.isArray(value.rosters))throw new Error('지원하는 로스터 백업 형식이 아닙니다.');
 const rosters=value.rosters as Roster[];
 if(rosters.length>100)throw new Error('최대 100개 로스터까지 가져올 수 있습니다.');
 for(const r of rosters){const t=teams.find(t=>t.killteamId===r.team);
 if(!t||typeof r.id!=='string'||typeof r.name!=='string'||r.name.length>80||!Array.isArray(r.members)||r.members.length>30||!Array.isArray(r.equipment)||!Array.isArray(r.tactics)||typeof r.updated!=='string')throw new Error('잘못된 로스터 데이터입니다.');
 if(!r.members.every(m=>m&&typeof m.id==='string'&&typeof m.type==='string'&&t.opTypes.some(o=>o.opTypeId===m.type)&&Array.isArray(m.loadout)&&m.loadout.every(w=>typeof w==='string'))||!r.equipment.every(e=>typeof e==='string')||!r.tactics.every(e=>typeof e==='string'))throw new Error('잘못된 오퍼레이티브 데이터입니다.');
 }return rosters;
}
