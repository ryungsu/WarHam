import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const raw=readFileSync('data-original/missions/italian-candidate.json','utf8');
const upstream=JSON.parse(raw);
const official=readFileSync('docs/mission-audit/approved-update-2026-08.txt','utf8').replace(/\r/g,'');
const url='https://assets.warhammer-community.com/eng_kt_approved_ops_update_log-c46bfdlsms-senqgrexsi.pdf';
const mappings=[['crit-01','Secure','확보'],['crit-02','Loot','약탈'],['crit-03','Transmission','전송'],['crit-04','Orb','구체'],['crit-05','Stake Claim','권리 주장'],['crit-06','Energy Cells','에너지 셀'],['crit-07','Download','다운로드'],['crit-08','Data','데이터'],['crit-09','Reboot','재부팅'],['tac-recon-01','Flank','측면 확보'],['tac-recon-02','Scout Enemy Movement','적 이동 정찰'],['tac-recon-03','Retrieval','회수'],['tac-infil-01','Track Enemy','적 추적'],['tac-infil-02','Steal Intelligence','정보 탈취'],['tac-infil-03','Plant Devices','장치 설치'],['tac-sec-01','Plant Banner','깃발 설치'],['tac-sec-02','Martyrs','순교자'],['tac-sec-03','Envoy','특사'],['tac-seek-01','Sweep & Clear','소탕 및 확보'],['tac-seek-02','Rout','패주'],['tac-seek-03','Dominate','지배'],['kill-op-1','Kill Op','킬 옵']];
const sections={
 'crit-05':['5. STAKE CLAIM','6. ENERGY CELLS'],
 'crit-06':['6. ENERGY CELLS','\nC\nA\n'],
 'tac-recon-01':['\nFLANK\n','\nRETRIEVAL\n'],
 'tac-recon-03':['\nRETRIEVAL\n','SECURITY TAC OPS'],
 'tac-sec-02':['\nMARTYRS\n','\nENVOY\n'],
 'tac-sec-03':['\nENVOY\n','PREVIOUS RULES COMMENTARIES'],
 'tac-seek-03':['\nDOMINATE\n','\nSWEEP & CLEAR\n'],
};
const cards=[...upstream.crit_ops,...upstream.tac_ops,upstream.kill_op].map(c=>{
 const m=mappings.find(x=>x[0]===c.id);if(!m)throw Error('Unknown card '+c.id);
 let english='';if(sections[c.id]){const [a,b]=sections[c.id];const start=official.indexOf(a),end=official.indexOf(b,start+a.length);if(start<0||end<start)throw Error('Missing official section '+c.id);english=official.slice(start,end).trim()}
 return {id:c.id,title:m[1],ko:m[2],kind:c.id.startsWith('crit')?'crit':c.id.startsWith('tac')?'tac':'kill',archetype:c.archetypeId??null,status:english?'official-text':'catalog-only',english,source:english?url:'https://github.com/ArturoBianchi/kt-op-2025',note:c.id==='tac-seek-01'?'공식 문서의 Additional Rules 문장이 불완전하여 본문 적용을 보류했습니다.':english?'공식 2026년 8월 업데이트의 해당 카드 본문 대조 완료. 한국어는 번역 초안.':'카드 본문 전체의 최신 공식 일치는 아직 검증되지 않았습니다. 실물 카드 또는 공식 앱을 참고하세요.'};
});
writeFileSync('public/data/missions.json',JSON.stringify({id:'approved-ops-2025',title:'Approved Ops 2025',checked:'2026-10-14',officialUpdated:'2026-08-26',sourceCommit:'0d5e0b370a41e4f2cc519f20ad2e853fcbd1efdb',candidateSha256:createHash('sha256').update(raw).digest('hex'),officialSource:url,companion:'https://assets.warhammer-community.com/eng_kt_approved_ops_2025_tournament_companion-fpsaag6ryp-uwnxgflxow.pdf',cards},null,2));
console.log('Mission catalog:',cards.length,'cards;',cards.filter(c=>c.english).length,'official text sections.');
