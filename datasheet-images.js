// Photos are keyed by the BSData selection/profile IDs, never by translated display names.
// Remote photos link to their publisher; local Kill Team cutouts are kept in images/datasheets/.
const DatasheetImages=(()=>{
  const publisher="https://www.warhammer-community.com/";
  const units=new Map([
    ["1117-cda-7f74-196b",{src:"images/datasheets/scout-squad.png",source:"official Kill Team team PDF"}],
    ["8da0-4570-c3c-819f",{src:"images/datasheets/intercessor-squad.png",source:"official Kill Team team PDF"}],
    ["a10b-fbfe-b1fa-6f0c",{src:"images/datasheets/assault-intercessor-squad.png",source:"official Kill Team team PDF"}],
    ["596f-dbdc-41e7-088a",{src:"https://assets.warhammer-community.com/image1-1762354820-karamprl1k.jpg",source:publisher+"en-gb/articles/fm2tm39s/world-championships-preview-captain-titus-battles-nekrosor-ammentar-for-the-five-hundred-worlds-of-ultramar/"}],
    ["ce15-e87e-7cff-b129",{src:"https://assets.warhammer-community.com/articles/3ce482d6-f671-4deb-83d4-1a772cc2da43/nqnn1es8jrhto8zs.jpg",source:publisher+"en-gb/articles/WoOFPxPo/lvo-2023-strike-force-agastus-makes-planetfall-with-new-desolation-marines-and-dreadnought/"}],
    ["b793-b77e-9e49-d397",{src:"https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_miniswide-73gzdi5ryx.jpg",source:publisher+"en-gb/articles/9viqqmca/500-worlds-titus-who-are-the-wardens-of-ultramar/"}],
    ["5dc7-aa6c-7053-cede",{src:"https://assets.warhammer-community.com/articles/242a03cf-4804-4940-88b8-2f58c378e38c/atkwmivvnbnhamsv.jpg",source:publisher+"en-gb/articles/Am3ZIwdF/warhammer-40000-leviathan-whats-in-the-box/"}],
    ["1c00-9398-b9e7-446a",{src:"https://assets.warhammer-community.com/articles/e390c066-b05e-450f-a6a7-4bfa7ea6d149/ble8xov0xgndka04.jpg",source:publisher+"en-gb/articles/eg6b2azc/the-brutalis-dreadnought-is-even-more-terrifying-than-you-thought/"}],
    ["b007-fc7b-8e4a-b017",{src:"https://assets.warhammer-community.com/articles/58c58f5a-98a8-420b-85e7-37f05c6ffbb6/p9cpxy3mx1a3tsgb.jpg",source:publisher+"en-gb/articles/Oy7PhwN4/sunday-preview-starter-sets-for-gamers-and-painters/"}]
  ]);
  const models=new Map([
    ["b793-b77e-9e49-d397:5173-1bed-74c4-ffb2","https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_1-metaurus_alt-fnrklerrb8.jpg"],
    ["b793-b77e-9e49-d397:573d-8756-1e35-cf4a","https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_2-gadriel_alt-2xp891pmio.jpg"],
    ["b793-b77e-9e49-d397:1f8a-7e49-a77e-e62a","https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_3-kornelius_alt-iawxlglssn.jpg"],
    ["b793-b77e-9e49-d397:1158-893e-94e3-8af1","https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_4-vestha_alt-avrr5zrf0i.jpg"],
    ["b793-b77e-9e49-d397:a30b-90b6-2243-ce94","https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_5-silvaalt-rvks1jjbed.jpg"],
    ["b793-b77e-9e49-d397:e646-c5f2-321e-00f4","https://assets.warhammer-community.com/40k_wardensofultramarlore-jan05_6-minervasalt-ucx5d3yjt3.jpg"]
  ]);
  for(const [id,photo] of Object.entries(globalThis.DatasheetImageFiles?.units||{}))units.set(id,photo);
  for(const [id,src] of Object.entries(globalThis.DatasheetImageFiles?.models||{}))models.set(id,src);
  // 40kdc fallback profiles use deterministic IDs generated from unit ID and model name.
  const fallbackModelIds=new Map([
    ["40kdc:wardens-of-ultramar:Veteran Sergeant Metaurus","5173-1bed-74c4-ffb2"],
    ["40kdc:wardens-of-ultramar:Ancient Gadriel","573d-8756-1e35-cf4a"],
    ["40kdc:wardens-of-ultramar:Dainal Kornelius","1f8a-7e49-a77e-e62a"],
    ["40kdc:wardens-of-ultramar:Lucia Vestha","1158-893e-94e3-8af1"],
    ["40kdc:wardens-of-ultramar:Gaius Silva","a30b-90b6-2243-ce94"],
    ["40kdc:wardens-of-ultramar:Aemelia Minervas","e646-c5f2-321e-00f4"]
  ]);
  const bsdataId=unit=>{
    const id=String(unit?.id||"");
    if(units.has(id))return id;
    return (unit?.externalRefs||[]).find(ref=>ref.namespace==="bsdata")?.id||"";
  };
  const unitPhoto=unit=>units.get(bsdataId(unit))||null;
  const modelPhoto=(unit,profile)=>{
    const id=bsdataId(unit),profileId=fallbackModelIds.get(profile?.id)||profile?.id;
    const src=models.get(`${id}:${profileId}`);
    return src?{src,source:unitPhoto(unit)?.source||""}:null;
  };
  return {unitPhoto,modelPhoto};
})();
if(typeof module!=="undefined")module.exports=DatasheetImages;
