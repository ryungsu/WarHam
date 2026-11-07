const test=require('node:test');
const assert=require('node:assert/strict');
const photos=require('../datasheet-images.js');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');

test('roster unit photos resolve by BSData ID even if the display name changes',()=>{
  const ids=['1117-cda-7f74-196b','8da0-4570-c3c-819f','a10b-fbfe-b1fa-6f0c','596f-dbdc-41e7-088a','ce15-e87e-7cff-b129','b793-b77e-9e49-d397','5dc7-aa6c-7053-cede','1c00-9398-b9e7-446a','b007-fc7b-8e4a-b017'];
  for(const id of ids)assert.ok(photos.unitPhoto({id,name:'번역된 이름'}),id);
  assert.equal(photos.unitPhoto({id:'unregistered',name:'Scout Squad'}),null);
});

test('40kdc fallback uses the BSData cross reference',()=>{
  const unit={id:'40kdc-wardens-of-ultramar',externalRefs:[{namespace:'bsdata',id:'b793-b77e-9e49-d397'}]};
  assert.ok(photos.unitPhoto(unit)?.src.includes('wardensofultramar'));
  assert.ok(photos.modelPhoto(unit,{id:'40kdc:wardens-of-ultramar:Ancient Gadriel'})?.src.includes('gadriel'));
});

test('all six Warden model profiles have distinct matching photos',()=>{
  const unit={id:'b793-b77e-9e49-d397'};
  const profileIds=['573d-8756-1e35-cf4a','5173-1bed-74c4-ffb2','a30b-90b6-2243-ce94','e646-c5f2-321e-00f4','1f8a-7e49-a77e-e62a','1158-893e-94e3-8af1'];
  const srcs=profileIds.map(id=>photos.modelPhoto(unit,{id})?.src);
  assert.equal(srcs.filter(Boolean).length,6);
  assert.equal(new Set(srcs).size,6);
  assert.equal(photos.modelPhoto(unit,{id:'unknown',name:'Ancient Gadriel'}),null);
});
test('weapon assignment names open the matching Warden model photo',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  const context=vm.createContext({DatasheetImages:photos,normalizeMatchName:name=>String(name).toLowerCase().trim(),escapeHtml:value=>String(value)});
  vm.runInContext(source.slice(source.indexOf('function renderWeaponModelNames('),source.indexOf('function renderProfiles(')),context);
  const unit={id:'b793-b77e-9e49-d397',profiles:[{id:'573d-8756-1e35-cf4a',name:'Ancient Gadriel',typeName:'Model'}]};
  const markup=context.renderWeaponModelNames([{name:'Ancient Gadriel',count:1}],unit);
  assert.match(markup,/data-unit-photo=.*gadriel/);
  assert.match(markup,/Ancient Gadriel · 1개체/);
});
