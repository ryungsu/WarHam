import {useEffect,useState} from 'react';
import './imageSearch.css';

export function OperativePortrait({id,name,searchName=name,triggerId=id,missile=false}:{id:string;name:string;searchName?:string;triggerId?:string;missile?:boolean}){
 const [failed,setFailed]=useState(false),[open,setOpen]=useState(false);
 const query=`Warhammer 40k ${searchName} painted miniature`;
 const openSearch=()=>setOpen(true);
 useEffect(()=>{const openFromName=(event:Event)=>{const detail=(event as CustomEvent<{id?:string}>).detail;if(detail?.id===triggerId)openSearch()};window.addEventListener('warham-google-image-search',openFromName);return()=>window.removeEventListener('warham-google-image-search',openFromName)},[triggerId]);
 const stop=(event:React.SyntheticEvent)=>{event.preventDefault();event.stopPropagation()};
 const localImage=`${import.meta.env.BASE_URL}images/operatives/${id}${id==='IMP-SCT-HGNR'&&missile?'-missile':''}.png`;
 const portrait=id==='IMP-SCT-SGT'?<span className="operative-portrait supplied-portrait" role="img" aria-label={`${name} 제공 이미지`} style={{backgroundImage:`url("${import.meta.env.BASE_URL}images/operatives/scout-sergeant-reference.jpg")`}}/>:failed?<span className="portrait-fallback" aria-label={`${name} 이미지 없음`}>KT</span>:<img src={localImage} alt={`${name} 킬팀 미니어처`} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>;
 return <>
  <span className="operative-portrait official-model">
   {portrait}
   <button className="operative-image-search-trigger" type="button" aria-label={`${searchName} Google 이미지 검색`} title="Google 이미지 검색" onClick={event=>{stop(event);openSearch()}}>⌕</button>
  </span>
  {open&&<div className="image-search-backdrop" role="presentation" onClick={event=>{event.stopPropagation();setOpen(false)}} onKeyDown={event=>event.stopPropagation()}>
   <section className="image-search-dialog google-image-search-dialog-kt" role="dialog" aria-modal="true" aria-label={`${searchName} 이미지 검색`} onClick={event=>event.stopPropagation()} onPointerDown={event=>event.stopPropagation()}>
    <header><div><strong>{searchName}</strong><small>{query}</small></div><button type="button" onClick={()=>setOpen(false)} aria-label="닫기">×</button></header>
    <p>검색어를 그대로 Google 이미지 검색에 전달합니다. Google 결과를 앱 내부에 직접 표시하는 기능은 Google이 iframe 삽입을 허용하지 않아 제공할 수 없습니다.</p>
    <a className="google-image-search-link" href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">Google 이미지 검색 결과 열기 ↗</a>
   </section>
  </div>}
 </>;
}
