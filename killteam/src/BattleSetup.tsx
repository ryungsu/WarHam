import {useState} from 'react';
import type {MissionPack} from './missions';
const zones=[['Volkus','볼쿠스'],['Tomb World','툼 월드'],['Gallowdark','갈로우다크'],['Bheta-Decima','베타 데시마'],['Octarius','옥타리우스'],['Non-specific','일반 전장']];
const mapOptions=zones.flatMap(([id])=>Array.from({length:6},(_,i)=>`${id} · 맵 ${i+1}`));
export function MapPicker({value,onChange}:{value:string;onChange:(v:string)=>void}){
 const custom=!!value&&!mapOptions.includes(value);
 const [editing,setEditing]=useState(custom);
 return <div className="setup-picker"><label>맵 / 킬존<select value={editing?'custom':value} onChange={e=>{setEditing(e.target.value==='custom');if(e.target.value!=='custom')onChange(e.target.value);else if(!custom)onChange('')}}><option value="">맵 선택…</option>{zones.map(([id,label])=><optgroup key={id} label={`${label} · ${id}`}>{Array.from({length:6},(_,i)=><option key={i} value={`${id} · 맵 ${i+1}`}>{label} · 맵 {i+1}</option>)}</optgroup>)}<option value="custom">직접 입력 / 커뮤니티 맵</option></select></label>{editing&&<label>직접 입력한 맵<input maxLength={120} placeholder="예: 커뮤니티 맵 이름 · 배치도 번호" value={value} onChange={e=>onChange(e.target.value)}/></label>}<p className="hint">Approved Ops 2025 배치도 번호를 기록합니다. 실제 지형 배치는 공식 카드·Companion을 확인하세요.</p></div>;
}
export function MissionPicker({pack,value,onChange}:{pack:MissionPack|null;value:string;onChange:(v:string)=>void}){
 const [manual,setManual]=useState(false),[mode,setMode]=useState('all');
 const cards=pack?.cards.filter(c=>c.kind==='crit')??[];
 const pool=cards.filter(c=>mode==='all'||c.status==='official-text');
 const selected=cards.find(c=>c.id===value);
 return <div className="setup-picker mission-picker"><label>미션 뽑기 범위<select value={mode} onChange={e=>setMode(e.target.value)}><option value="all">전체 Crit Op · {cards.length}개</option><option value="verified">앱 본문 검증 완료 · {cards.filter(c=>c.status==='official-text').length}개</option></select></label><button type="button" className="primary" disabled={!pool.length} onClick={()=>{if(value&&!confirm('현재 미션을 다시 뽑을까요?'))return;onChange(pool[Math.floor(Math.random()*pool.length)].id)}}>⚄ {value?'미션 다시 뽑기':'미션 랜덤 뽑기'}</button><div className="mission-draw-result" role="status">{selected?<><strong>{selected.ko} · {selected.title}</strong><small>{selected.status==='official-text'?'앱에서 미션 본문 확인 가능':'한국어 번역 초안 제공 · 공식 본문 대조 전'}</small></>:<span>미션을 뽑으면 여기에 표시됩니다.</span>}</div><button type="button" aria-expanded={manual} onClick={()=>setManual(!manual)}>{manual?'직접 선택 접기':'대회 지정 · 미션 직접 선택'}</button>{manual&&<label>공유 Crit Op<select value={value} onChange={e=>onChange(e.target.value)}><option value="">나중에 선택</option>{cards.map(c=><option key={c.id} value={c.id}>{c.ko} · {c.title}{c.status!=='official-text'?' · 본문 검증 대기':''}</option>)}</select></label>}<p className="hint">Crit Op만 뽑습니다. 내 Tac Op은 팀 조건에 맞춰 별도로 선택합니다.</p></div>;
}
