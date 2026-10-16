import {useRef,useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import type {Team,Operative} from './types';
import {CompactDatasheet} from './CompactDatasheet';
import {names,texts} from './translations';
import type {MissionCard} from './missions';
import {missionKo} from './missions';
type Entry={key:string;title:string;kind:string;description:string;ko?:string;team?:Team;op?:Operative;mission?:MissionCard};
export function QuickSearch({open,setOpen,entries,lang,rule,show}:{open:boolean;setOpen:(v:boolean)=>void;entries:Entry[];lang:'ko'|'en';rule:(r:string)=>void;show:(title:string,en:string,id?:string,ko?:string)=>void}){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState<Entry|null>(null);const input=useRef<HTMLInputElement>(null);
 const [viewport,setViewport]=useState({top:0,height:0});
 useEffect(()=>{const v=window.visualViewport;const update=()=>setViewport({top:v?.offsetTop??0,height:v?.height??window.innerHeight});update();v?.addEventListener('resize',update);v?.addEventListener('scroll',update);window.addEventListener('resize',update);return()=>{v?.removeEventListener('resize',update);v?.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
 useEffect(()=>{if(open)input.current?.focus({preventScroll:true})},[open]);
 const name=(s:string)=>lang==='ko'?(names[s]??s):s;
 const filtered=query.trim()?entries.filter(e=>`${e.title} ${names[e.title]??''} ${e.description} ${e.ko??''} ${texts[e.key]??''} ${e.mission?.ko??''} ${missionKo[e.key]??e.mission?.koreanDraft??''}`.toLowerCase().includes(query.toLowerCase())):[];
 const unique=Array.from(new Map(filtered.map(e=>[`${e.kind}-${e.title}-${e.team?.killteamId??''}`,e])).values());
 return <>{open&&<button className="search-backdrop" aria-label="검색 닫기" onClick={()=>setOpen(false)}/>}<aside className={`quick-search side-search ${open?'is-open':''}`} style={viewport.height?{'--search-top':`${viewport.top+12}px`,'--search-height':`${Math.max(160,viewport.height-24)}px`} as CSSProperties:undefined} aria-label="항상 사용 가능한 빠른 검색">
 <button className="quick-search-toggle" aria-label={open?'검색 접기':'빠른 검색 열기'} aria-expanded={open} aria-controls="quick-search-content" onClick={()=>{if(open)input.current?.blur();setOpen(!open)}}><span className="search-handle-label">{open?'빠른 검색':<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m15 15 6 6" stroke="currentColor" strokeWidth="2"/></svg>}</span><span>{open?'접기 →':'←'}</span></button>
 {open&&<section id="quick-search-content" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);e.stopPropagation()}}}>
 <label className="search-input-label">유닛·무장·능력·미션·규칙<input ref={input} type="search" value={query} onChange={e=>{setQuery(e.target.value);setSelected(null)}} placeholder="이름이나 키워드로 바로 검색"/></label>
 <div className="quick-search-results">{selected?.op&&selected.team?<><button onClick={()=>setSelected(null)}>← 검색 결과</button><CompactDatasheet operative={selected.op} cardKey={`search-${selected.op.opTypeId}`} index={0} team={selected.team} name={name} lang={lang} rule={rule} show={show} abilityText={(id,n)=>texts[id]??(n==='Astartes'&&selected.team?.killteamId==='IMP-AOD'?texts['IMP-AOD-CPT-A-AS']:n==='Chapter Veteran'?texts['IMP-AOD-ISGT-A-CVET']:undefined)}/><p className="hint">제목을 펼쳐 데이터시트를 확인하세요. 현재 미션은 그대로 유지됩니다.</p></>:<>{!query.trim()?<p className="hint">현재 화면을 떠나지 않고 검색할 수 있습니다.</p>:<><p className="hint">{unique.length}개 결과</p>{unique.length===0&&<p role="status">검색 결과가 없습니다.</p>}{unique.slice(0,60).map(e=><button className="search-result" key={`${e.kind}-${e.key}-${e.team?.killteamId??''}`} onClick={()=>{if(e.kind==='오퍼레이티브'||e.kind==='무장'){setSelected(e);return}show(e.mission?(lang==='ko'?e.mission.ko:e.mission.title):name(e.title),e.description,e.key,e.mission?(missionKo[e.key]??(e.mission.koreanDraft?'커뮤니티 원문 번역 초안 · 공식 본문 대조 전\n\n'+e.mission.koreanDraft:undefined)):e.ko)}}><small>{e.kind} · {e.team?name(e.team.killteamName):e.mission?'Approved Ops 2025':'공통 규칙'}</small><strong>{e.mission?(lang==='ko'?e.mission.ko:e.mission.title):name(e.title)}</strong></button>)}</>}</>}
 </div></section>}
 </aside></>;
}
