import type {Roster} from './types';
export function recentRosters(rosters:Roster[]):Roster[]{
 let ids:string[]=[];try{const value=JSON.parse(localStorage.getItem('kt-recent-rosters')??'[]');if(Array.isArray(value))ids=value.filter((id:unknown)=>typeof id==='string')}catch{}
 return [...rosters].sort((a,b)=>{const ai=ids.indexOf(a.id),bi=ids.indexOf(b.id);if(ai>=0||bi>=0)return (ai<0?Infinity:ai)-(bi<0?Infinity:bi);return (Date.parse(b.updated)||0)-(Date.parse(a.updated)||0)});
}
export function rememberRoster(id:string){try{const current=JSON.parse(localStorage.getItem('kt-recent-rosters')??'[]');const ids=Array.isArray(current)?current.filter((v:unknown)=>typeof v==='string'&&v!==id):[];localStorage.setItem('kt-recent-rosters',JSON.stringify([id,...ids].slice(0,6)))}catch{}}
