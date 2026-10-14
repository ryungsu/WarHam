import {useState} from 'react';
export function OperativePortrait({id,name,missile=false}:{id:string;name:string;missile?:boolean}){
 const [failed,setFailed]=useState(false);
 if(id==='IMP-SCT-SGT')return <span className="operative-portrait supplied-portrait" role="img" aria-label={`${name} · 제공한 카드 이미지`} style={{backgroundImage:`url("${import.meta.env.BASE_URL}images/operatives/scout-sergeant-reference.jpg")`}}/>;
 return <span className="operative-portrait official-model">{failed?<span className="portrait-fallback" aria-label={`${name} 이미지 없음`}>KT</span>:<img src={`${import.meta.env.BASE_URL}images/operatives/${id}${id==='IMP-SCT-HGNR'&&missile?'-missile':''}.png`} alt={`${name} 킬팀 미니어처`} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}</span>;
}
