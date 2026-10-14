import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const raw=readFileSync(new URL('../data-original/upstream.json',import.meta.url),'utf8');
const teams=JSON.parse(raw).filter(t=>['IMP-AOD','IMP-SCT'].includes(t.killteamId));
mkdirSync(new URL('../data-original/',import.meta.url),{recursive:true});
writeFileSync(new URL('../data-original/teams.json',import.meta.url),JSON.stringify(teams,null,2));
for(const t of teams){
 // The upstream represents one equipment selection as two independent grenade records.
 // Expose three explicit, legal pairs so one equipment slot always grants exactly two.
 for(const [group,a,b] of [['UG','SMK','STN'],['XG','FRAG','KRAK']]){
  const first=t.equipments.find(e=>e.eqId===`UNIVERSAL-UE-${group}-${a}`),second=t.equipments.find(e=>e.eqId===`UNIVERSAL-UE-${group}-${b}`);
  const label=group==='UG'?'Utility Grenades':'Explosive Grenades';
  const na=group==='UG'?'Smoke':'Frag',nb=group==='UG'?'Stun':'Krak';
  t.equipments=t.equipments.filter(e=>![first.eqId,second.eqId].includes(e.eqId));
  t.equipments.push(...[[a,`2 ${na}`,first.description],[`${a}-${b}`,`1 ${na} + 1 ${nb}`,`${first.description}\n\n${second.description}`],[b,`2 ${nb}`,second.description]].map(([suffix,name,description])=>({...first,eqId:`UNIVERSAL-UE-${group}-${suffix}`,eqName:`${label}: ${name}`,description:`**Selected supply: ${name}. This is one equipment selection.**\n\n${description}`})));
 }
}
writeFileSync(new URL('../public/data/teams.json',import.meta.url),JSON.stringify(teams,null,2));
writeFileSync(new URL('../public/data/version.json',import.meta.url),JSON.stringify({edition:'Kill Team 2024',file:'kt24_v4.json',downloaded:'2026-10-14',sha256:createHash('sha256').update(raw).digest('hex'),source:'https://github.com/vjosset/killteamjson',note:'Community snapshot, not a claim of latest official balance parity.'},null,2));
