import {useEffect,useState} from 'react';
export type ScrollEntry={id:string;label:string};
export function revealCard(id:string){
 const target=document.getElementById(id);
 if(target instanceof HTMLDetailsElement)target.open=true;
 if(target)requestAnimationFrame(()=>{
  const toolbar=target.closest('.battle-workspace')?.querySelector('.mission-mobile-toolbar');
  const height=toolbar instanceof HTMLElement?toolbar.getBoundingClientRect().height:0;
  target.style.scrollMarginTop=`${Math.ceil(height)+20}px`;
  target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 });
}
export function ScrollNavigator({entries,onNavigate}:{entries:ScrollEntry[];onNavigate?:(id:string)=>void}){
 const [open,setOpen]=useState(false),[current,setCurrent]=useState('');
 const signature=entries.map(e=>e.id).join('|');
 useEffect(()=>{
  let frame=0;
  const track=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const positions=signature.split('|').map(id=>({id,top:document.getElementById(id)?.getBoundingClientRect().top})).filter((x):x is {id:string;top:number}=>x.top!==undefined);const passed=positions.filter(x=>x.top<=110);setCurrent(passed.at(-1)?.id??positions[0]?.id??'')})};
  track();window.addEventListener('scroll',track,{passive:true});window.addEventListener('resize',track);document.addEventListener('toggle',track,true);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',track);window.removeEventListener('resize',track);document.removeEventListener('toggle',track,true)};
 },[signature]);
 if(!entries.length)return null;
 return <aside className="scroll-navigator" aria-label="오퍼레이티브 스크롤 네비게이터">
  {open&&<nav id="operative-scroll-list" className="scroll-navigator-list" aria-label="바로 이동">{entries.map((entry,i)=><button key={entry.id} aria-current={current===entry.id?'location':undefined} onClick={()=>{if(onNavigate)onNavigate(entry.id);else revealCard(entry.id);setCurrent(entry.id);setOpen(false)}}><span>{String(i+1).padStart(2,'0')}</span>{entry.label}</button>)}</nav>}
  <button className="scroll-navigator-toggle" aria-expanded={open} aria-controls="operative-scroll-list" onClick={()=>setOpen(!open)}><span>☷ 오퍼레이티브 바로가기</span><span>{open?'⌄':'⌃'}</span></button>
 </aside>;
}
