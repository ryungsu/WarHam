(function(root){
  'use strict';
  const HOUR=3600000;
  function createCache({fetcher,read=async()=>null,write=async()=>{},now=Date.now,timeout=10000}={}){
    const requests=new Map();
    async function json(urls){
      urls=Array.isArray(urls)?urls:[urls];const key=urls[0];
      if(requests.has(key))return requests.get(key);
      const pending=(async()=>{
        const cached=await read(key).catch(()=>null);
        if(cached&&now()-cached.savedAt<6*HOUR)return cached.data;
        let failure;
        for(const url of urls){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
          try{const response=await fetcher(url,{signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();void write(key,{savedAt:now(),data}).catch(()=>{});return data;}
          catch(error){failure=error;}finally{clearTimeout(timer);}
        }
        if(cached&&now()-cached.savedAt<30*24*HOUR)return cached.data;
        throw failure||new Error('자료 연결 실패');
      })();
      requests.set(key,pending);pending.catch(()=>requests.delete(key));return pending;
    }
    return {json};
  }
  let database;
  function openDatabase(){if(database)return database;database=new Promise(resolve=>{
    if(typeof indexedDB==='undefined'){resolve(null);return;}
    let request;try{request=indexedDB.open('40k-reference-cache',1);}catch{resolve(null);return;}
    const timer=setTimeout(()=>resolve(null),800);
    request.onupgradeneeded=()=>request.result.createObjectStore('json');
    request.onsuccess=()=>{clearTimeout(timer);resolve(request.result);};request.onerror=request.onblocked=()=>{clearTimeout(timer);resolve(null);};
  });return database;}
  async function access(mode,key,value){const db=await openDatabase();if(!db)return null;return new Promise(resolve=>{
    try{const transaction=db.transaction('json',mode),store=transaction.objectStore('json'),request=mode==='readonly'?store.get(key):store.put(value,key);let result=null;request.onsuccess=()=>{result=request.result;};transaction.oncomplete=()=>resolve(result);transaction.onerror=transaction.onabort=()=>resolve(null);}catch{resolve(null);}
  });}
  const api=createCache({fetcher:(...args)=>fetch(...args),read:key=>access('readonly',key),write:(key,value)=>access('readwrite',key,value)});
  root.WarhammerDataCache=api;
  if(typeof module!=='undefined')module.exports={createCache};
})(typeof globalThis!=='undefined'?globalThis:this);
