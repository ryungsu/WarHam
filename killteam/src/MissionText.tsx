import Markdown from 'react-markdown';
import {missionKo,type MissionCard} from './missions';
export const missionTranslation=(card:MissionCard)=>missionKo[card.id]??card.koreanDraft;
export function MissionText({card,lang}:{card:MissionCard;lang:'ko'|'en'}){
 const ko=missionTranslation(card);
 const render=(text:string)=>{const parts=text.split(/\n\n(?=\|)/);const rows=parts[1]?.trim().split('\n').map(row=>row.split('|').slice(1,-1));return <div className="prose"><Markdown>{parts[0]}</Markdown>{rows&&<table><thead><tr>{rows[0].map((cell,i)=><th key={i}>{cell}</th>)}</tr></thead><tbody>{rows.slice(2).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table>}</div>};
 return <>{card.status!=='official-text'&&<p className="mission-draft-note">커뮤니티 원문 기반 번역 초안 · 최신 공식 본문 대조 전</p>}{lang==='ko'&&ko?render(ko):card.english?<div className="prose"><Markdown>{card.english}</Markdown></div>:<><p>공식 영문 본문 미확보 · 한국어 번역 초안을 표시합니다.</p>{render(ko??card.note)}</>}{(card.english||card.sourceText)&&<details><summary>{card.english?'영문 원본 · 한국어는 번역 초안':'번역 출처 원문 · 이탈리아어 커뮤니티 자료'}</summary><div className="prose"><Markdown>{card.english||card.sourceText}</Markdown></div></details>}</>;
}
