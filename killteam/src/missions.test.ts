import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {eligibleTac,practiceCrit,missionKo} from './missions.ts';
import type {MissionPack} from './missions.ts';
const pack:MissionPack=JSON.parse(readFileSync(new URL('../public/data/missions.json',import.meta.url),'utf8'));
test('catalog is complete, unique and distinguishes verified text from titles',()=>{assert.equal(pack.cards.length,22);assert.equal(new Set(pack.cards.map(c=>c.id)).size,22);assert.equal(pack.cards.filter(c=>c.status==='official-text').length,7);for(const c of pack.cards)assert.equal(Boolean(c.english),c.status==='official-text')});
test('every verified text has Korean draft and official source',()=>{for(const c of pack.cards.filter(c=>c.status==='official-text')){assert.ok(missionKo[c.id]);assert.ok(c.source.startsWith('https://assets.warhammer-community.com/'));assert.ok(!c.english.includes('APPROVED OPS CARD PACK 2024'))}});
test('Tac Op eligibility respects both supported team archetypes',()=>{const a=pack.cards.filter(c=>eligibleTac(c,'IMP-AOD'));const s=pack.cards.filter(c=>eligibleTac(c,'IMP-SCT'));assert.equal(a.length,6);assert.equal(s.length,6);assert.ok(!a.some(c=>c.archetype==='recon'));assert.ok(!s.some(c=>c.archetype==='seek'));assert.equal(pack.cards.filter(c=>eligibleTac(c,'unknown')).length,0)});
test('practice draw only selects verified Crit Ops, never unverified/tac/kill',()=>{for(let i=0;i<=100;i++){const c=practiceCrit(pack.cards,()=>i/100)!;assert.equal(c.kind,'crit');assert.equal(c.status,'official-text')}assert.equal(practiceCrit([],()=>0),undefined)});
test('Flank draft includes TP4-only consecutive-control correction, Dominate includes 12 wound threshold',()=>{assert.ok(missionKo['tac-recon-01'].includes('TP4'));assert.ok(missionKo['tac-recon-01'].includes('TP3'));assert.ok(missionKo['tac-seek-03'].includes('12'));assert.ok(pack.cards.find(c=>c.id==='tac-recon-01')!.english.includes('fourth turning point'))});
test('ambiguous official Sweep & Clear paragraph is not marked verified',()=>assert.equal(pack.cards.find(c=>c.id==='tac-seek-01')!.status,'catalog-only'));

test('all 22 missions have Korean content and draft sources stay distinct from verified English',()=>{for(const c of pack.cards){assert.ok(missionKo[c.id]||c.koreanDraft,c.id);if(c.status!=='official-text'){assert.ok(c.koreanDraft);assert.ok(c.sourceText);assert.equal(c.sourceLanguage,'it');assert.equal(c.english,'')}}});
