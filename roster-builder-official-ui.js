// Official-app style navigation: role sections -> role picker -> unit management page.
let builderPickerRole = "";
let builderSelectedDetachments = [];
const catalogPane = $("builder-unit-catalog").closest(".builder-catalog-pane");
const catalogFilters = $("builder-unit-search").closest(".builder-unit-filters");
if (catalogPane && catalogFilters) catalogPane.prepend(catalogFilters);
const catalogHeading = catalogPane?.querySelector(".builder-pane-heading");
if (catalogHeading && !catalogHeading.querySelector("[data-builder-close-picker]")) {
  const closePicker = document.createElement("button");
  closePicker.type = "button";
  closePicker.className = "quiet";
  closePicker.dataset.builderClosePicker = "";
  closePicker.textContent = "← 편성";
  catalogHeading.append(closePicker);
}
const officialLabels = {
  epicHero: "에픽 히어로", character: "캐릭터", battleline: "전열",
  transport: "수송", infantry: "보병", mounted: "기승",
  vehicle: "차량", monster: "몬스터", beast: "야수", swarm: "군집",
  aircraft: "항공기", fortification: "요새화", other: "기타"
};

function builderSelectedDetachmentNames() {
  return builderSelectedDetachments.map(index =>
    rosterBuilderDetachments[index]?.detachment ||
    localizedRuleValue(rosterBuilderDetachments[index]?.name, "en") || ""
  ).filter(Boolean);
}

function builderSelectedDetachmentCost() {
  return builderSelectedDetachments.reduce((total, index) =>
    total + (builderDetachmentCost(rosterBuilderDetachments[index]) || 0), 0);
}

function builderSnapshotForText(text) {
  return {
    schema: 1,
    text,
    faction: rosterBuilderFaction,
    limit: Number($("builder-limit").value) || 1000,
    detachments: builderSelectedDetachmentNames(),
    manualDetachment: $("builder-detachment-manual").value.trim(),
    units: rosterBuilderUnits.map(entry => ({
      unitId: String(entry.unit.id || ""), unitName: entry.unit.name,
      models: entry.models,
      modelGroupCounts: { ...(entry.modelGroupCounts || {}) },
      wargearSelections: JSON.parse(JSON.stringify(entry.wargearSelections || {})),
      gearCounts: { ...(entry.gearCounts || {}) },
      weapons: [...(entry.weapons || [])],
      enhancementName: entry.enhancement ? localizedRuleValue(entry.enhancement.name, "en") : "",
      attachedTo: Number.isInteger(entry.attachedTo) ? entry.attachedTo : null
    }))
  };
}

function builderUnitsFromSnapshot(snapshot) {
  if(snapshot?.schema !== 1 || !Array.isArray(snapshot.units) || !snapshot.units.length) return null;
  const entries=[];
  for(const saved of snapshot.units){
    if(!saved || typeof saved!=="object")return null;
    const unit=db.units.find(candidate=>saved.unitId && String(candidate.id)===String(saved.unitId)) || builderFindRosterUnit(saved.unitName);
    if(!unit) return null;
    const minimum=Number(unit.modelCount?.min)||1,maximum=Math.max(minimum,Number(unit.modelCount?.max)||99);
    const models=Math.max(minimum,Math.min(maximum,Number(saved.models)||minimum));
    const entry={unit,models,points:builderPointsFor(unit,models),gearCounts:{},weapons:[],attachedTo:null};
    if(unit.modelGroups?.length){
      entry.modelGroupCounts={};
      unit.modelGroups.forEach(group=>{
        const key=String(group.id||group.name);
        if(Object.hasOwn(saved.modelGroupCounts||{},key))entry.modelGroupCounts[key]=Number(saved.modelGroupCounts[key]);
      });
      initializeBuilderModelGroups(entry);
      entry.points=builderPointsFor(unit,entry.models);
    }
    const availableGear=new Set(builderWeaponOptions(unit));
    for(const [name,count] of Object.entries(saved.gearCounts||{})){
      if(availableGear.has(name)&&Number.isFinite(Number(count)))entry.gearCounts[name]=Math.max(0,Math.min(entry.models,Number(count)));
    }
    entry.weapons=(Array.isArray(saved.weapons)?saved.weapons:[]).filter(name=>availableGear.has(name));
    entry.wargearSelections={};
    for(const option of unit.wargearOptions||[]){
      const choice=saved.wargearSelections?.[String(option.id)];
      const choices=option.replacementChoice?.length?option.replacementChoice:[option.replacement||[]];
      if(!choice||!Number.isInteger(choice.choiceIndex)||choice.choiceIndex<0||choice.choiceIndex>=choices.length)continue;
      const indices=[...new Set((Array.isArray(choice.modelIndices)?choice.modelIndices:[]).filter(index=>Number.isInteger(index)&&index>=0&&index<entry.models))];
      if(indices.length)entry.wargearSelections[String(option.id)]={choiceIndex:choice.choiceIndex,modelIndices:indices.slice(0,builderWargearCountLimit(entry,option))};
    }
    const name=String(saved.enhancementName||"");
    if(name)entry.enhancement=builderOptionsForEnhancement(entry).find(option=>
      normalizeRosterEnhancementName(localizedRuleValue(option.name,"en")||"")===normalizeRosterEnhancementName(name))||null;
    entries.push(entry);
  }
  entries.forEach((entry,index)=>{
    const target=snapshot.units[index].attachedTo;
    entry.attachedTo=Number.isInteger(target)&&target>=0&&target<entries.length&&target!==index?target:null;
  });
  return entries;
}

function builderDetachmentTags(item) {
  return item?.uniqueTags || item?.metadata?.uniqueTags || [];
}

function builderDetachmentConflict(index) {
  const candidate = rosterBuilderDetachments[index];
  const candidateTags = builderDetachmentTags(candidate);
  for (const selectedIndex of builderSelectedDetachments) {
    if (selectedIndex === index) continue;
    const selected = rosterBuilderDetachments[selectedIndex];
    for (const tag of candidateTags) {
      const key = String(tag.id || localizedRuleValue(tag.name, "en") || tag).toLocaleLowerCase();
      const conflict = builderDetachmentTags(selected).find(other =>
        String(other.id || localizedRuleValue(other.name, "en") || other).toLocaleLowerCase() === key
      );
      if (conflict) return localizedRuleValue(tag.name, "ko") || localizedRuleValue(tag.name, "en") || String(tag);
    }
  }
  return "";
}

function initializeBuilderModelGroups(entry) {
  const groups = entry.unit.modelGroups || [];
  if (!groups.length) return;
  entry.modelGroupCounts ||= {};
  groups.forEach(group => {
    const key = String(group.id || group.name);
    const min = Math.max(0, Number(group.min) || 0);
    const max = Math.max(min, Number(group.max) || 99);
    if (!Number.isFinite(Number(entry.modelGroupCounts[key]))) entry.modelGroupCounts[key] = min;
    entry.modelGroupCounts[key] = Math.max(min, Math.min(max, Number(entry.modelGroupCounts[key])));
  });
  const minimum = Number(entry.unit.modelCount?.min) || 1;
  const maximum = Number(entry.unit.modelCount?.max) || 99;
  let total = groups.reduce((sum, group) => sum + Number(entry.modelGroupCounts[String(group.id || group.name)] || 0), 0);
  if (total < minimum) {
    for (const group of groups) {
      const key = String(group.id || group.name), current = Number(entry.modelGroupCounts[key] || 0);
      const room = Math.max(0, (Number(group.max) || 99) - current);
      const add = Math.min(room, minimum - total);
      entry.modelGroupCounts[key] = current + add;
      total += add;
      if (total >= minimum) break;
    }
  }
  entry.models = Math.max(minimum, Math.min(maximum, total));
}

const baseBuilderWeaponOptions = builderWeaponOptions;
builderWeaponOptions = function (unit) {
  const options = unit.wargearOptions || [];
  if (!options.length) return baseBuilderWeaponOptions(unit);
  const names = options.flatMap(option => [
    ...(option.replacement || []),
    ...(option.replacementChoice || []).flat()
  ]);
  return [...new Map(names.filter(Boolean).map(name => [norm(name), name])).values()];
};

function builderGearCountLimit(unit, name, models) {
  const relevant = (unit.wargearOptions || []).filter(option =>
    [...(option.replacement || []), ...(option.replacementChoice || []).flat()].some(item => norm(item) === norm(name))
  );
  if (!relevant.length) return Math.max(1, Number(models) || 1);
  return relevant.reduce((highest, option) => {
    const constraint = option.modelConstraint || {};
    const perModels = constraint.any_number ? Number(models) || 1 :
      constraint.per_n_models ? Math.floor((Number(models) || 1) / constraint.per_n_models) : 1;
    return Math.max(highest, Math.min(Number(constraint.max_count) || perModels, perModels));
  }, 0);
}

function builderWargearCountLimit(entry, option) {
  return rosterBuilderWargearPolicy.maxModelsForOption(
    entry.unit, option, entry.modelGroupCounts, entry.models
  );
}

function builderWeaponProfiles(unit) {
  return (unit.profiles || []).filter(profile => /ranged|melee|weapon|원거리|근거리|근접/i.test(profile.typeName || ""));
}

function builderWeaponProfileMatches(unit, names) {
  return rosterBuilderWargearPolicy.matchWeaponProfiles(builderWeaponProfiles(unit), names);
}

function builderOpenInfoDialog(title, content) {
  let dialog = document.getElementById("builder-info-dialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "builder-info-dialog";
    dialog.className = "builder-info-dialog";
    dialog.innerHTML = '<header><b data-builder-dialog-title></b><button type="button" data-builder-dialog-close aria-label="닫기">×</button></header><div data-builder-dialog-content></div>';
    dialog.addEventListener("click", event => {
      if (event.target === dialog || event.target.closest("[data-builder-dialog-close]")) dialog.close();
    });
    document.body.append(dialog);
  }
  dialog.querySelector("[data-builder-dialog-title]").textContent = title;
  dialog.querySelector("[data-builder-dialog-content]").innerHTML = content;
  if (!dialog.open) dialog.showModal();
}

function builderWeaponProfileMarkup(unit, names) {
  const profiles = builderWeaponProfileMatches(unit, names);
  if (!profiles.length) return '<p class="phase-empty">연결된 무기 프로필이 없습니다.</p>';
  const groups = [
    ["원거리 무기", profiles.filter(profile => !/melee|근접/i.test(profile.typeName || ""))],
    ["근거리 무기", profiles.filter(profile => /melee|근접/i.test(profile.typeName || ""))]
  ].filter(([, items]) => items.length);
  return groups.map(([label, items]) => '<section class="builder-info-weapon-group"><h3>' + label + '</h3>' +
    items.map(profile => {
      const rawWeaponId = String(profile.id || "").startsWith("40kdc:") ? String(profile.id).split(":")[1] || "" : "";
      const readableWeaponId = rawWeaponId.replace(/-(?:scout|intercessor|terminator|infernus|assault|heavy)-squad$/i, "");
      const weaponName = profile.weaponName || (readableWeaponId
        ? readableWeaponId.split("-").map(word => word ? word[0].toUpperCase() + word.slice(1) : "").join(" ")
        : profile.name);
      const profileName = norm(weaponName) === norm(profile.name) ? "" : profile.name;
      return '<article><header><b>' + escapeHtml(tr(weaponName)) + '</b>' +
      (profileName ? '<small>' + escapeHtml(profileName) + ' 프로필</small>' : '') + '</header><dl>' +
      (profile.characteristics || []).map(characteristic => '<div><dt>' + escapeHtml(characteristic.name) + '</dt><dd>' +
        escapeHtml(characteristic.value) + '</dd></div>').join("") + '</dl></article>';
    }).join("") + '</section>').join("");
}

function builderOpenEnhancementDetails(entry, index) {
  const enhancement = builderOptionsForEnhancement(entry)[index];
  if (!enhancement) return;
  const name = localizedRuleValue(enhancement.name, "en") || "Enhancement";
  const descriptionText = value => {
    if (Array.isArray(value)) return value.map(item => descriptionText(item?.text ?? item?.description ?? item)).filter(Boolean).join("\n\n");
    if (value && typeof value === "object") {
      const direct = value.ko || value.en || value.kr || value.text || value.description;
      if (typeof direct === "string") return direct;
      if (direct) return descriptionText(direct);
      if (value.rules || value.text || value.description) return descriptionText(value.rules ?? value.text ?? value.description);
      return "";
    }
    return String(value || "");
  };
  const description = factionRuleDescription(enhancement) || descriptionText(enhancement.description) || sourceDescriptionFor(name) || "연결된 상세 규칙 설명이 없습니다.";
  const cost = builderEnhancementCost(enhancement);
  builderOpenInfoDialog(tr(name), '<small class="builder-info-english">' + escapeHtml(name) +
    (cost ? ' · ' + cost + '점' : '') + '</small><div class="builder-info-rules">' +
    renderRuleMarkup(description) + '</div>');
}

function builderWargearOptionsMarkup(entry, includeOption = () => true) {
  const options = rosterBuilderWargearPolicy.selectableOptions(entry.unit).filter(includeOption);
  const kind = option => {
    const names = [...(option.replaces || []), ...(option.replacement || []), ...(option.replacementChoice || []).flat()];
    const profiles = builderWeaponProfileMatches(entry.unit, names);
    const hasRanged = profiles.some(profile => !/melee|근접/i.test(profile.typeName || ""));
    const hasMelee = profiles.some(profile => /melee|근접/i.test(profile.typeName || ""));
    return hasRanged && hasMelee ? "원거리·근거리 무기" : hasMelee ? "근거리 무기" : "원거리 무기";
  };
  const groups = ["원거리 무기", "근거리 무기", "원거리·근거리 무기"].map(label => [label,
    options.filter(option => kind(option) === label)]).filter(([, items]) => items.length);
  return groups.map(([groupLabel, groupOptions]) => '<section class="builder-wargear-group"><h4>' + groupLabel + '</h4>' + groupOptions.map(option => {
    const choices = (option.replacementChoice?.length ? option.replacementChoice : [option.replacement || []])
      .filter(choice => choice.length);
    if (!choices.length) return "";
    const current = entry.wargearSelections?.[option.id] || {};
    const constraint = option.modelConstraint || {};
    const cap = builderWargearCountLimit(entry, option);
    const modelGroup = (entry.unit.modelGroups || []).find(group => norm(group.name) === norm(constraint.model_name || ""));
    const modelCount = modelGroup
      ? Number(entry.modelGroupCounts?.[String(modelGroup.id || modelGroup.name)] || 0)
      : Number(entry.models) || 1;
    const chooseModels = modelCount > 1 && (cap < modelCount || Boolean(constraint.any_number) || Boolean(constraint.per_n_models));
    const groupOffset = modelGroup
      ? rosterBuilderWargearPolicy.modelGroupOffset(entry.unit, entry.modelGroupCounts, modelGroup)
      : 0;
    const modelLabels = Array.from({ length: modelCount }, (_, index) =>
      (modelGroup ? tr(modelGroup.name) : tr(entry.unit.name)) + (modelCount > 1 ? " · " + String.fromCharCode(65 + ((groupOffset + index) % 26)) : "")
    );
    const selectedModels = new Set(current.modelIndices || []);
    const availableModelIndices = modelLabels.map((_, index) => index)
      .filter(index => !rosterBuilderWargearPolicy.modelHasConflictingSelection(entry.unit, entry.wargearSelections, option, index));
    const hasAvailableModel = cap > 0 && availableModelIndices.length > 0;
    const label = option.replaces?.length
      ? "교체: " + option.replaces.join(" + ")
      : "추가 장비";
    const variants = choices.map((choice, index) =>
      '<div class="builder-wargear-choice-row"><label class="builder-wargear-choice"><input type="radio" name="builder-wargear-' + escapeHtml(option.id) + '" data-wargear-choice="' +
      escapeHtml(option.id) + '" value="' + index + '"' + (current.choiceIndex != null && Number(current.choiceIndex) === index ? ' checked' : '') +
      (!hasAvailableModel && !(current.choiceIndex != null && Number(current.choiceIndex) === index) ? ' disabled' : '') +
      '><span><b>' + escapeHtml(choice.map(name => tr(name)).join(" + ")) + '</b><small>' + escapeHtml(choice.join(" + ")) + '</small></span></label><button type="button" class="quiet builder-choice-info" data-builder-option-choice-detail="' +
      escapeHtml(option.id) + '" data-choice-index="' + index + '" aria-label="' + escapeHtml(choice.join(" + ")) + ' 무기 상세">i</button>' +
      (current.choiceIndex != null && Number(current.choiceIndex) === index
        ? '<button type="button" class="quiet builder-wargear-clear" data-wargear-clear="' + escapeHtml(option.id) + '">' + (option.replaces?.length ? '기본 장비로' : '선택 해제') + '</button>'
        : '') + '</div>'
    ).join("");
    const modelChecks = chooseModels ? modelLabels.map((modelLabel, index) =>
      '<label class="builder-model-gear-choice"><input type="checkbox" data-wargear-model="' + escapeHtml(option.id) + '" data-model-index="' + index + '"' +
      (selectedModels.has(index) ? ' checked' : '') + (current.choiceIndex == null || rosterBuilderWargearPolicy.modelHasConflictingSelection(entry.unit, entry.wargearSelections, option, index) ? ' disabled' : '') + '><span>' + escapeHtml(modelLabel) + '</span></label>'
    ).join("") : "";
    const replacementLimit = constraint.per_n_models
      ? '분대 ' + constraint.per_n_models + '개체당 최대 1개체'
      : constraint.any_number ? '모델별 선택 가능' : '1개체 선택';
    return '<div class="builder-wargear-option"><div><b>' + escapeHtml(label) + '</b><small>' +
      (constraint.model_name ? escapeHtml(tr(constraint.model_name)) + ' · ' : '') +
      replacementLimit +
      (option.isFree ? ' · 무료' : '') + ' · 최대 ' + cap + '개체 · ' + (current.choiceIndex == null ? (option.replaces?.length ? '기본 장비 유지' : '추가 장비 없음') : '선택 장비') + '</small></div><div class="builder-wargear-controls"><div class="builder-wargear-choice-list">' + variants + '</div><div class="builder-model-gear-choices">' + modelChecks + '</div></div></div>';
  }).join("") + '</section>').join("");
}

const baseRenderDetachments = renderBuilderDetachments;
renderBuilderDetachments = function () {
  baseRenderDetachments();
  const list = $("builder-detachment-list");
  const budget = builderDpBudget();
  const selectedCost = builderSelectedDetachmentCost();
  list.querySelectorAll("[data-builder-detachment]").forEach(button => {
    const index = Number(button.dataset.builderDetachment);
    const selected = builderSelectedDetachments.includes(index);
    const cost = builderDetachmentCost(rosterBuilderDetachments[index]);
    const conflict = builderDetachmentConflict(index);
    const unavailable = !selected && (cost === null || selectedCost + cost > budget || Boolean(conflict));
    button.setAttribute("aria-pressed", String(selected));
    button.disabled = unavailable;
    button.setAttribute("aria-disabled", String(unavailable));
    button.closest(".builder-detachment-card")?.classList.toggle("is-selected", selected);
    button.closest(".builder-detachment-card")?.classList.toggle("is-unavailable", unavailable);
    const badge = button.querySelector(".builder-detachment-check");
    if (badge) badge.textContent = selected ? "선택됨" : conflict ? conflict + " 중복" : cost === null ? "DP 정보 없음" : selectedCost + cost > budget ? "DP 한도 초과" : "선택";
  });
};

$("builder-detachment-list").addEventListener("click", event => {
  const button = event.target.closest("[data-builder-detachment]");
  if (!button || event.target.closest(".builder-detachment-rules")) return;
  event.stopImmediatePropagation();
  const index = Number(button.dataset.builderDetachment);
  const existing = builderSelectedDetachments.indexOf(index);
  if (existing >= 0) {
    builderSelectedDetachments.splice(existing, 1);
  } else {
    const conflict = builderDetachmentConflict(index);
    if (conflict) {
      $("builder-data-status").textContent = "‘" + conflict + "’ 고유 태그가 겹치는 디테치먼트는 함께 선택할 수 없습니다.";
      return;
    }
    const cost = builderDetachmentCost(rosterBuilderDetachments[index]);
    if (cost === null) {
      $("builder-data-status").textContent = "이 디테치먼트의 DP 데이터가 없어 선택 한도를 확인할 수 없습니다. 이름을 직접 입력하거나 데이터 갱신 후 선택하세요.";
      return;
    }
    const nextCost = builderSelectedDetachmentCost() + (cost || 0);
    const budget = builderDpBudget();
    if (nextCost > budget) {
      $("builder-data-status").textContent = "디테치먼트 DP 합계가 전장 규모 한도를 넘습니다. 선택을 줄이세요.";
      return;
    }
    builderSelectedDetachments.push(index);
    $("builder-data-status").textContent = "디테치먼트 " + builderSelectedDetachments.length + "개 선택 · " + nextCost + "/" + budget + " DP";
  }
  rosterBuilderSelectedDetachment = builderSelectedDetachments[0] ?? null;
  renderBuilderDetachments();
  $("builder-unit-step").hidden = !builderSelectedDetachments.length && !$("builder-detachment-manual").value.trim();
  if (!$("builder-unit-step").hidden) renderBuilderUnitCatalog();
  updateRosterBuilderSummary();
  renderRosterBuilderList();
}, true);

const baseBuilderEnhancementOptions = builderOptionsForEnhancement;
builderOptionsForEnhancement = function (item) {
  const names = builderSelectedDetachmentNames();
  if (!names.length) return baseBuilderEnhancementOptions(item);
  const selected = rosterBuilderUnits.filter(unit => unit.enhancement && unit !== item);
  const budget = Math.max(1, Math.floor((Number($("builder-limit").value) || 1000) / 500));
  if (!item.enhancement && selected.length >= budget) return [];
  return factionEnhancements.filter(enhancement =>
    names.some(name => detachmentNameMatches(localizedRuleValue(enhancement.detachment, "en") || enhancement.detachment, name))
  ).filter(enhancement => {
    const name = localizedRuleValue(enhancement.name, "en") || "";
    const upgrade = /upgrade/i.test(name) || /upgrade/i.test(enhancement.type || "");
    if (!upgrade && selected.some(unit => unit.enhancement === enhancement)) return false;
    const character = builderUnitRole(item.unit) === "character" &&
      !(item.unit.keywords || []).some(keyword => /epic hero/i.test(keyword));
    const keywords = (item.unit.keywords || []).map(norm);
    const required = (enhancement.keywords || []).map(norm);
    const excluded = (enhancement.excludes || []).map(norm);
    if (required.some(keyword => !keywords.includes(keyword))) return false;
    if (excluded.some(keyword => keywords.includes(keyword))) return false;
    return character || Boolean(enhancement.equipableByNonCharacter) || upgrade;
  });
};

const baseBuilderSummaryOfficial = updateRosterBuilderSummary;
updateRosterBuilderSummary = function () {
  baseBuilderSummaryOfficial();
  const selectedCost = builderSelectedDetachmentCost();
  const budget = builderDpBudget();
  const limit = Number($("builder-limit").value) || 1000;
  const total = rosterBuilderTotal();
  $("builder-total").textContent = total + " / " + limit + "점 · 디테치 DP " + selectedCost + " / " + budget;
  const over = total > limit || selectedCost > budget;
  $("builder-total").classList.toggle("over-limit", over);
  if (selectedCost > budget) $("builder-apply").disabled = true;
};

$("open-roster-builder").addEventListener("click", () => {
  builderSelectedDetachments = [];
  builderPickerRole = "";
  rosterBuilderEditingSavedId = "";
  rosterBuilderEditingName = "";
  $("builder-apply").textContent = "로스터 적용";
});

$("builder-load-faction").addEventListener("click", () => {
  builderSelectedDetachments = [];
  rosterBuilderSelectedDetachment = null;
}, true);

$("builder-apply").addEventListener("click", event => {
  event.stopImmediatePropagation();
  if (!rosterBuilderUnits.length) return;
  const total = rosterBuilderTotal();
  const selectedNames = builderSelectedDetachmentNames();
  const manualName = $("builder-detachment-manual").value.trim();
  const names = selectedNames.length ? selectedNames : (manualName ? [manualName] : []);
  const dp = builderSelectedDetachmentCost();
  const lines = ["FACTION KEYWORD: " + rosterBuilderFaction];
  if (names.length) lines.push("DETACHMENT: " + names.join(", ") + (dp ? " (" + dp + " detachment points)" : ""));
  lines.push("TOTAL ARMY POINTS: " + total, "NUMBER OF UNITS: " + rosterBuilderUnits.length, "");
  rosterBuilderUnits.forEach(item => {
    lines.push(item.models + "x " + item.unit.name + " (" +
      (item.points + builderEnhancementCost(item.enhancement)) + " points)");
    const modelGroups = item.unit.modelGroups || [];
    let globalModelOffset = 0;
    modelGroups.forEach(group => {
      const count = Number(item.modelGroupCounts?.[String(group.id || group.name)] || 0);
      if (count <= 0) return;
      for (let modelIndex = 0; modelIndex < count; modelIndex++) {
        const loadout = [...(group.defaultWeapons || [])];
        Object.entries(item.wargearSelections || {}).forEach(([optionId, selection]) => {
          const option = (item.unit.wargearOptions || []).find(candidate => String(candidate.id) === optionId);
          if (!option || selection.choiceIndex == null) return;
          const targetName = option.modelConstraint?.model_name;
          if (targetName && norm(targetName) !== norm(group.name)) return;
          const assignedIndex = targetName ? modelIndex : globalModelOffset + modelIndex;
          if (!(selection.modelIndices || []).includes(assignedIndex)) return;
          const choices = option.replacementChoice?.length ? option.replacementChoice : [option.replacement || []];
          const chosen = choices[Number(selection.choiceIndex)] || [];
          (option.replaces || []).forEach(name => {
            const index = loadout.findIndex(itemName => norm(itemName) === norm(name));
            if (index >= 0) loadout.splice(index, 1);
          });
          chosen.forEach(name => { if (!loadout.some(itemName => norm(itemName) === norm(name))) loadout.push(name); });
        });
        lines.push("• 1x " + group.name + " " + (modelIndex + 1) +
          (loadout.length ? ": " + loadout.join(", ") : ""));
      }
      globalModelOffset += count;
    });
    if (!modelGroups.length) Object.entries(item.wargearSelections || {}).forEach(([optionId, selection]) => {
      const option = (item.unit.wargearOptions || []).find(candidate => String(candidate.id) === optionId);
      if (!option || selection.choiceIndex == null) return;
      const choices = option.replacementChoice?.length ? option.replacementChoice : [option.replacement || []];
      const chosen = choices[Number(selection.choiceIndex)] || [];
      const indexes = selection.modelIndices || [];
      if (chosen.length && indexes.length) lines.push("• " + indexes.length + "x " + chosen.join(" + "));
    });
    const selectedGear = Object.entries(item.gearCounts || {}).filter(([, count]) => count > 0);
    if (selectedGear.length) lines.push("• " + selectedGear.map(([name, count]) =>
      count + "x " + name
    ).join(", "));
    else if (item.weapons?.length) lines.push("• " + item.weapons.join(", "));
    if (item.enhancement) lines.push("• Enhancements: " + (localizedRuleValue(item.enhancement.name, "en") || ""));
    if (Number.isInteger(item.attachedTo)) {
      const target = rosterBuilderUnits[item.attachedTo];
      if (target) lines.push("• Attached to: " + target.unit.name,
        "• Attached as: " + (item.unit.attachmentRole === "support" ? "Support" : "Leader"),
        "• Attached to index: " + (item.attachedTo + 1));
    }
  });
  $("roster").value = lines.join("\n");
  const builderSnapshot = builderSnapshotForText($("roster").value);
  writeRosterBuilderDraft(builderSnapshot);
  let savedEditMessage = "";
  if (rosterBuilderEditingSavedId) {
    const presets = readRosterPresets();
    const saved = presets.saved.find(item => item.id === rosterBuilderEditingSavedId);
    if (saved) {
      saved.text = $("roster").value;
      saved.faction = rosterBuilderFaction;
      saved.builderSnapshot = builderSnapshot;
      saved.updatedAt = Date.now();
      if (writeRosterPresets(presets)) {
        refreshRosterPresetOptions();
        savedEditMessage = " · ‘" + (rosterBuilderEditingName || saved.name) + "’ 저장 로스터 갱신됨";
      }
    }
  }
  resizeRoster();
  rememberRecentRoster();
  render();
  $("roster-builder").open = false;
  $("roster-import-panel").open = false;
  document.querySelector('[data-view="datasheets"]').click();
  $("roster-preset-status").textContent = total > (Number($("builder-limit").value) || 1000)
    ? "초안이 목표 포인트를 초과했습니다. 인원 구성을 조정하세요." + savedEditMessage
    : (rosterBuilderEditingSavedId ? "저장 로스터 편집 내용을 반영했습니다." : "로스터 초안을 적용했습니다.") + savedEditMessage;
  rosterBuilderEditingSavedId = "";
  rosterBuilderEditingName = "";
  $("builder-apply").textContent = "로스터 적용";
  $("roster").scrollIntoView({ behavior: "smooth", block: "center" });
}, true);

const officialBaseRenderCatalog = renderBuilderUnitCatalog;
renderBuilderUnitCatalog = function () {
  officialBaseRenderCatalog();
  const pane = $("builder-unit-catalog").closest(".builder-catalog-pane");
  if (pane) pane.classList.toggle("is-open", Boolean(builderPickerRole));
};

const officialBaseRenderRoster = renderRosterBuilderList;
renderRosterBuilderList = function () {
  updateRosterBuilderSummary();
  const list = $("builder-unit-list");
  $("builder-roster-count").textContent = rosterBuilderUnits.length + "개";
  const groups = new Map();
  rosterBuilderUnits.forEach((entry, index) => {
    const role = builderUnitRole(entry.unit);
    if (!groups.has(role)) groups.set(role, []);
    groups.get(role).push({ entry, index });
  });
  const order = ["epicHero", "character", "battleline", "infantry", "mounted", "vehicle",
    "monster", "beast", "swarm", "transport", "aircraft", "fortification", "other"];
  const available = new Set((db.units || []).map(unit => builderUnitRole(unit)));
  const categories = order.filter(role => available.has(role) || groups.has(role));
  list.innerHTML = categories.length ? categories.map(role =>
    '<section class="builder-roster-category"><header><b>' + escapeHtml(officialLabels[role] || "기타") +
    '</b><span>' + (groups.get(role)?.length || 0) + ' 채용 · ' +
    (db.units || []).filter(unit => builderUnitRole(unit) === role).length + '종</span><button type="button" class="primary" data-builder-open-category="' +
    role + '">＋</button></header>' + (groups.get(role) || []).map(({ entry, index }) =>
      (() => {
        const ownTarget = Number.isInteger(entry.attachedTo) ? rosterBuilderUnits[entry.attachedTo] : null;
        const attachedMembers = rosterBuilderUnits.map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
          .filter(({ candidate, candidateIndex }) => candidate.attachedTo === index && candidateIndex !== index);
        const ownSummary = ownTarget ? '<small class="builder-attachment-summary">합류 대상 → ' + escapeHtml(tr(ownTarget.unit.name)) + '</small>' : '';
        const incomingSummary = attachedMembers.length ? '<div class="builder-attached-children">' + attachedMembers.map(({candidate,candidateIndex})=>
          '<button type="button" class="builder-attached-child" data-builder-select-unit="'+candidateIndex+'"><span>↳ '+escapeHtml(tr(candidate.unit.name))+'</span><small>'+ (candidate.unit.attachmentRole==='support'?'서포트':'리더')+' · '+candidate.models+'모델</small></button>').join('')+'</div>' : '';
        return '<article class="builder-roster-row' + (index === rosterBuilderSelectedIndex ? " is-selected" : "") + '">' +
        '<button type="button" class="builder-roster-pick" data-builder-select-unit="' + index + '">' +
        '<b>' + escapeHtml(tr(entry.unit.name)) + '</b><small>' + escapeHtml(entry.unit.name) + '</small>' +
        '<span>' + (entry.models || entry.unit.modelCount?.min || 1) + '모델 · ' +
        (entry.points + builderEnhancementCost(entry.enhancement)) + '점</span>' + ownSummary + '</button>' +
        '<button type="button" class="quiet builder-roster-remove" data-builder-remove="' + index +
        '" aria-label="' + escapeHtml(entry.unit.name) + ' 삭제">×</button>' + incomingSummary + '</article>';
      })()
    ).join("") + '</section>'
  ).join("") : '<p class="phase-empty">카테고리의 ＋를 눌러 유닛을 채용하세요.</p>';
  renderBuilderUnitDetail();
  if (rosterBuilderSelectedIndex >= 0) $("builder-unit-detail").classList.add("is-open");
};

const rosterList = $("builder-unit-list");
rosterList.addEventListener("click", event => {
  event.stopImmediatePropagation();
  const add = event.target.closest("[data-builder-open-category]");
  if (add) {
    builderPickerRole = add.dataset.builderOpenCategory;
    $("builder-unit-category").value = builderPickerRole;
    renderBuilderUnitCatalog();
    const pane = $("builder-unit-catalog").closest(".builder-catalog-pane");
    pane.classList.add("is-open");
    window.requestAnimationFrame(() => pane.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  const pick = event.target.closest("[data-builder-select-unit]");
  if (pick) {
    rosterBuilderSelectedIndex = Number(pick.dataset.builderSelectUnit);
    renderRosterBuilderList();
  }
  const remove = event.target.closest("[data-builder-remove]");
  if (remove) {
    rosterBuilderWargearPolicy.removeUnitAndRepairAttachments(rosterBuilderUnits, Number(remove.dataset.builderRemove));
    rosterBuilderSelectedIndex = -1;
    renderRosterBuilderList();
  }
}, true);

catalogPane?.addEventListener("click", event => {
  if (!event.target.closest("[data-builder-close-picker]")) return;
  builderPickerRole = "";
  catalogPane.classList.remove("is-open");
});

$("builder-unit-catalog").addEventListener("click", event => {
  event.stopImmediatePropagation();
  const button = event.target.closest("[data-builder-add]");
  if (!button) return;
  const unit = $("builder-unit-catalog")._builderUnits?.[Number(button.dataset.builderAdd)];
  if (!unit) return;
  const entry = { unit, models: Number(unit.modelCount?.min) || 1, points: 0, gearCounts: {} };
  initializeBuilderModelGroups(entry);
  entry.points = builderPointsFor(unit, entry.models);
  rosterBuilderUnits.push(entry);
  rosterBuilderSelectedIndex = -1;
  builderPickerRole = "";
  $("builder-unit-catalog").closest(".builder-catalog-pane").classList.remove("is-open");
  renderRosterBuilderList();
}, true);

// Re-render the selected unit as a dedicated, back-to-roster management view.
const detail = $("builder-unit-detail");
const detailBaseRender = renderBuilderUnitDetail;
let builderDetailRenderedIndex=-1;
renderBuilderUnitDetail = function () {
  const previousScroll=builderDetailRenderedIndex===rosterBuilderSelectedIndex?detail.scrollTop:0;
  detailBaseRender();
  if (!detail.hidden && rosterBuilderSelectedIndex >= 0) {
    const entry = rosterBuilderUnits[rosterBuilderSelectedIndex];
    const heading = detail.querySelector(".builder-detail-heading");
    if (heading) {
      const title = heading.querySelector("small");
      if (title) title.textContent = "유닛 관리 · " + (officialLabels[builderUnitRole(rosterBuilderUnits[rosterBuilderSelectedIndex].unit)] || "기타");
      const back = heading.querySelector("[data-builder-detail-close]");
      if (back) back.textContent = "← 로스터";
    }
    const navigation=document.createElement('nav');navigation.className='builder-editor-nav';navigation.setAttribute('aria-label','유닛 설정 항목');
    navigation.innerHTML='<button type="button" data-builder-section="models">인원 · 무장</button><button type="button" data-builder-section="enhancements">인헨스</button><button type="button" data-builder-section="attachments">합류</button>';
    heading?.after(navigation);
    const modelInput = detail.querySelector("[data-builder-models]");
    const modelGroups = entry.unit.modelGroups || [];
    const modelSection = detail.querySelector(".builder-model-detail");
    if (modelGroups.length && modelSection) {
      initializeBuilderModelGroups(entry);
      modelInput?.closest("label")?.remove();
      const orderedModelGroups = rosterBuilderWargearPolicy.orderModelGroups(modelGroups);
      const rows = orderedModelGroups.map(group => {
        const key = String(group.id || group.name), count = Number(entry.modelGroupCounts[key] || 0);
        const modelRole = group.isLeaderModel || /sergeant/i.test(group.name) ? "서전트" : modelGroups.length > 1 ? "일반 모델" : "모델";
        const groupOptions = rosterBuilderWargearPolicy.optionsForModel(entry.unit, group);
        const replaceableGear = (entry.unit.wargearOptions || [])
          .filter(option => norm(option.modelConstraint?.model_name || "") === norm(group.name))
          .flatMap(option => option.replaces || []);
        const fixedGear = (group.defaultWeapons || []).map(weapon =>
          '<button type="button" class="builder-fixed-chip" data-builder-weapon-profile-detail="'+escapeHtml(weapon)+'"><span>'+escapeHtml(tr(weapon))+'</span><small>ⓘ</small></button>'
        ).join("");
        return '<section class="builder-model-group-card"><div class="builder-model-group-row"><span>' + escapeHtml(tr(group.name)) +
          '<small><b class="builder-model-role">' + modelRole + '</b> · ' + escapeHtml(group.name) + ' · ' + (group.min || 0) + '–' + (group.max ?? "—") +
          (group.defaultWeapons?.length ? ' · 고정 장비 ' + group.defaultWeapons.length + '종' : ' · 기본 장비 데이터 없음') + '</small></span>' +
          (group.defaultWeapons?.length ? '<button type="button" class="quiet builder-info-trigger" data-builder-model-weapon-detail="' + escapeHtml(key) + '">무기 상세</button>' : '') +
          '<div class="builder-model-stepper"><button type="button" data-model-group-step="-1" data-model-group-id="' +
          escapeHtml(key) + '" aria-label="' + escapeHtml(group.name) + ' 수량 감소">−</button><output>' + count +
          '</output><button type="button" data-model-group-step="1" data-model-group-id="' + escapeHtml(key) +
          '" aria-label="' + escapeHtml(group.name) + ' 수량 증가">＋</button></div></div>' +
          (fixedGear ? '<details class="builder-default-loadout"><summary>기본 장비 · ' + group.defaultWeapons.length + '종</summary><div class="builder-model-fixed-gear-list">' + fixedGear + '</div></details>' : '') +
          (groupOptions.length ? '<div class="builder-model-specific-wargear"><b>' + modelRole + ' 무장 변경</b>' +
            builderWargearOptionsMarkup(entry, option => groupOptions.includes(option)) + '</div>' : '') + '</section>';
      }).join("");
      modelSection.innerHTML = '<b>모델 유형별 인원 · 합계 ' + entry.models + '</b>' + rows +
        '<small>' + (entry.unit.compositionSource ? '모델 유형과 기본 무장은 40kdc 편성 데이터 기준입니다.' : '모델 유형은 BSData 선택 조건 기준입니다. 기본 무장 편성 데이터가 없을 수 있습니다.') + '</small>';
    } else if (modelInput && !modelInput.closest(".builder-model-stepper")) {
      const label = modelInput.closest("label");
      const stepper = document.createElement("span");
      stepper.className = "builder-model-stepper";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.dataset.modelStep = "-1";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "모델 수 감소");
      const plus = document.createElement("button");
      plus.type = "button";
      plus.dataset.modelStep = "1";
      plus.textContent = "＋";
      plus.setAttribute("aria-label", "모델 수 증가");
      label.insertBefore(stepper, modelInput);
      stepper.append(minus, modelInput, plus);
    }
    const gearContainer = detail.querySelector(".builder-weapon-options");
    if (gearContainer) {
      const gearSection = gearContainer.closest(".builder-detail-section");
      if (entry.unit.wargearOptions?.length) {
        const generalOptions = rosterBuilderWargearPolicy.optionsForGeneralModels(entry.unit, modelGroups);
        gearContainer.innerHTML = builderWargearOptionsMarkup(entry, option => generalOptions.includes(option));
        if (gearSection) gearSection.hidden = !gearContainer.innerHTML.trim();
        const note = gearContainer.parentElement.querySelector("small");
        if (note) note.textContent = "원거리·근거리 무장 선택을 구분했습니다. 무기 상세에서 사거리, 공격 횟수, 능력치를 확인할 수 있습니다.";
      } else {
        // Weapon profiles describe attacks; they are not proof of a legal roster choice.
        // Only BSData wargear options should create interactive replacement controls.
        if (gearSection) gearSection.hidden = true;
      }
    }
    detail.classList.add("is-open");
    detail.setAttribute("role", "dialog");
    detail.setAttribute("aria-modal", "true");
    detail.setAttribute("tabindex", "-1");
  } else {
    detail.classList.remove("is-open");
    detail.removeAttribute("aria-modal");
  }
  builderDetailRenderedIndex=rosterBuilderSelectedIndex;
  detail.scrollTop=previousScroll;
};

detail.addEventListener("click", event => {
  const clearWargear = event.target.closest("[data-wargear-clear]");
  const weaponChoiceDetail = event.target.closest("[data-builder-option-choice-detail]");
  const weaponOptionDetail = event.target.closest("[data-builder-option-weapon-detail]");
  const defaultWeaponDetail = event.target.closest("[data-builder-model-weapon-detail]");
  const weaponProfileDetail = event.target.closest("[data-builder-weapon-profile-detail]");
  const enhancementDetail = event.target.closest("[data-builder-enhancement-detail]");
  const enhancementCardDetail = event.target.closest("[data-builder-enhancement-card-detail]");
  const enhancementCardSelect = event.target.closest("[data-builder-enhancement-card-select]");
  const sectionJump=event.target.closest('[data-builder-section]');
  if(sectionJump){const key=sectionJump.dataset.builderSection;const section=key==='models'?detail.querySelector('.builder-model-detail'):key==='enhancements'?detail.querySelector('.builder-enhancement-section'):detail.querySelector('.builder-attachment-targets')?.closest('.builder-detail-section');section?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  const attachmentCard = event.target.closest("[data-builder-attach-card]");
  const activeEntry = rosterBuilderUnits[rosterBuilderSelectedIndex];
  if (clearWargear && activeEntry) {
    rosterBuilderWargearPolicy.clearWargearSelection(activeEntry, clearWargear.dataset.wargearClear);
    renderRosterBuilderList();
    return;
  }
  if (weaponChoiceDetail && activeEntry) {
    const option = (activeEntry.unit.wargearOptions || []).find(item => String(item.id) === weaponChoiceDetail.dataset.builderOptionChoiceDetail);
    const choices = option?.replacementChoice?.length ? option.replacementChoice : [option?.replacement || []];
    const choice = choices[Number(weaponChoiceDetail.dataset.choiceIndex)] || [];
    if (choice.length) builderOpenInfoDialog("무기 프로필", builderWeaponProfileMarkup(activeEntry.unit, choice));
    return;
  }
  if (weaponOptionDetail && activeEntry) {
    const option = (activeEntry.unit.wargearOptions || []).find(item => String(item.id) === weaponOptionDetail.dataset.builderOptionWeaponDetail);
    if (option) builderOpenInfoDialog("무기 프로필", builderWeaponProfileMarkup(activeEntry.unit,
      [...(option.replaces || []), ...(option.replacement || []), ...(option.replacementChoice || []).flat()]));
    return;
  }
  if (defaultWeaponDetail && activeEntry) {
    const group = (activeEntry.unit.modelGroups || []).find(item => String(item.id || item.name) === defaultWeaponDetail.dataset.builderModelWeaponDetail);
    if (group) builderOpenInfoDialog("기본 무장 · " + tr(group.name), builderWeaponProfileMarkup(activeEntry.unit, group.defaultWeapons || []));
    return;
  }
  if (weaponProfileDetail && activeEntry) {
    builderOpenInfoDialog("무기 프로필", builderWeaponProfileMarkup(activeEntry.unit, [weaponProfileDetail.dataset.builderWeaponProfileDetail]));
    return;
  }
  if (enhancementDetail && activeEntry) {
    const select = detail.querySelector("[data-builder-enhancement-pick]");
    if (select?.value) builderOpenEnhancementDetails(activeEntry, Number(select.value));
    return;
  }
  if (enhancementCardDetail && activeEntry) {
    builderOpenEnhancementDetails(activeEntry, Number(enhancementCardDetail.dataset.builderEnhancementCardDetail));
    return;
  }
  if (enhancementCardSelect && activeEntry) {
    const index = Number(enhancementCardSelect.dataset.builderEnhancementCardSelect);
    const choices = builderOptionsForEnhancement(activeEntry);
    activeEntry.enhancement = activeEntry.enhancement === choices[index] ? null : choices[index] || null;
    renderRosterBuilderList();
    return;
  }
  if (attachmentCard && activeEntry) {
    const target = attachmentCard.dataset.builderAttachCard;
    activeEntry.attachedTo = target === "" ? null : Number(target);
    renderRosterBuilderList();
    return;
  }
  if (event.target.closest("[data-builder-detail-close]")) {
    rosterBuilderSelectedIndex = -1;
    renderRosterBuilderList();
    detail.classList.remove("is-open");
    return;
  }
  const step = event.target.closest("[data-gear-step]");
  const groupStep = event.target.closest("[data-model-group-step]");
  const modelStep = event.target.closest("[data-model-step]");
  if (groupStep) {
    const entry = rosterBuilderUnits[rosterBuilderSelectedIndex];
    if (!entry) return;
    initializeBuilderModelGroups(entry);
    const groups = entry.unit.modelGroups || [];
    const group = groups.find(item => String(item.id || item.name) === groupStep.dataset.modelGroupId);
    if (!group) return;
    const key = String(group.id || group.name);
    const current = Number(entry.modelGroupCounts[key] || 0);
    const next = Math.max(Number(group.min) || 0, Math.min(Number(group.max) || 99, current + Number(groupStep.dataset.modelGroupStep)));
    const total = groups.reduce((sum, item) =>
      sum + (String(item.id || item.name) === key ? next : Number(entry.modelGroupCounts[String(item.id || item.name)] || 0)), 0);
    if (total < (Number(entry.unit.modelCount?.min) || 1) || total > (Number(entry.unit.modelCount?.max) || 99)) return;
    entry.modelGroupCounts[key] = next;
    entry.models = total;
    entry.points = builderPointsFor(entry.unit, total);
    renderRosterBuilderList();
    return;
  }
  if (modelStep) {
    const entry = rosterBuilderUnits[rosterBuilderSelectedIndex];
    if (!entry) return;
    const min = Number(entry.unit.modelCount?.min) || 1;
    const max = Number(entry.unit.modelCount?.max) || 99;
    entry.models = Math.max(min, Math.min(max, (Number(entry.models) || min) + Number(modelStep.dataset.modelStep)));
    entry.points = builderPointsFor(entry.unit, entry.models);
    renderRosterBuilderList();
    return;
  }
  if (!step) return;
  const entry = rosterBuilderUnits[rosterBuilderSelectedIndex];
  if (!entry) return;
  const name = step.dataset.gearName;
  const next = Math.max(0, Math.min(builderGearCountLimit(entry.unit, name, entry.models),
    (entry.gearCounts?.[name] || 0) + Number(step.dataset.gearStep)));
  entry.gearCounts ||= {};
  entry.gearCounts[name] = next;
  entry.weapons = Object.keys(entry.gearCounts).filter(key => entry.gearCounts[key] > 0);
  renderRosterBuilderList();
});

detail.addEventListener("change", event => {
  const enhancementSelect = event.target.closest("[data-builder-enhancement-pick]");
  if (enhancementSelect) {
    const button = detail.querySelector("[data-builder-enhancement-detail]");
    if (button) button.disabled = !enhancementSelect.value;
  }
  const choice = event.target.closest("[data-wargear-choice]");
  const modelChoice = event.target.closest("[data-wargear-model]");
  if (choice || modelChoice) {
    const entry = rosterBuilderUnits[rosterBuilderSelectedIndex];
    if (!entry) return;
    entry.wargearSelections ||= {};
    const id = choice ? choice.dataset.wargearChoice : modelChoice.dataset.wargearModel;
    const option = (entry.unit.wargearOptions || []).find(item => String(item.id) === id);
    if (!option) return;
    if (choice) {
      const previous = entry.wargearSelections[id] || {};
      const constraint = option.modelConstraint || {};
      const group = (entry.unit.modelGroups || []).find(item => norm(item.name) === norm(constraint.model_name || ""));
      const modelCount = group ? Number(entry.modelGroupCounts?.[String(group.id || group.name)] || 0) : Number(entry.models) || 1;
      const cap = builderWargearCountLimit(entry, option);
      const chooseModels = modelCount > 1 && (cap < modelCount || Boolean(constraint.any_number) || Boolean(constraint.per_n_models));
      const availableIndices = Array.from({ length: modelCount }, (_, index) => index)
        .filter(index => !rosterBuilderWargearPolicy.modelHasConflictingSelection(entry.unit, entry.wargearSelections, option, index));
      entry.wargearSelections[id] = { choiceIndex: Number(choice.value), modelIndices: chooseModels
        ? (previous.modelIndices || []).filter(index => index < modelCount && availableIndices.includes(index)).slice(0, cap)
        : availableIndices.slice(0, Math.min(modelCount, cap)) };
    } else {
      const selection = entry.wargearSelections[id];
      if (!selection || selection.choiceIndex == null) return;
      const modelIndex = Number(modelChoice.dataset.modelIndex);
      const indexes = new Set(selection.modelIndices || []);
      if (modelChoice.checked) {
        if (indexes.size >= builderWargearCountLimit(entry, option)) {
          modelChoice.checked = false;
          $("builder-data-status").textContent = "이 장비는 최대 " + builderWargearCountLimit(entry, option) + "개 모델만 선택할 수 있습니다.";
          return;
        }
        indexes.add(modelIndex);
      } else indexes.delete(modelIndex);
      selection.modelIndices = [...indexes].sort((a, b) => a - b);
      if (!selection.modelIndices.length) delete entry.wargearSelections[id];
    }
    renderRosterBuilderList();
    return;
  }
  const check = event.target.closest("[data-builder-weapon-check]");
  if (!check) return;
  const entry = rosterBuilderUnits[rosterBuilderSelectedIndex];
  if (!entry) return;
  entry.gearCounts ||= {};
  entry.gearCounts[check.value] = check.checked
    ? Math.max(1, Math.min(builderGearCountLimit(entry.unit, check.value, entry.models), entry.gearCounts[check.value] || 1))
    : 0;
  entry.weapons = Object.keys(entry.gearCounts).filter(key => entry.gearCounts[key] > 0);
  renderRosterBuilderList();
});

function builderFactionAliasFromName(value) {
  let key = normalizeFactionAlias(value);
  for (const [korean, english] of KOREAN_FACTION_ALIASES) {
    if (key.includes(korean)) {
      key = key.replace(korean, normalizeFactionAlias(english));
      break;
    }
  }
  const match = FACTION_ALIASES.find(([alias, ...files]) => {
    const aliasKey = normalizeFactionAlias(alias);
    return key === aliasKey || key.includes(aliasKey) || files.some(file => {
      const fileKey = normalizeFactionAlias(file.replace(/\.json$/i, "").split(" - ").at(-1));
      return key === fileKey || key.endsWith(fileKey);
    });
  });
  return match?.[0] || "";
}

function builderFindRosterUnit(name) {
  const key = normalizeMatchName(name);
  const exact = db.units.find(unit => [unit.name, unit.nameKo, tr(unit.name || ""), ...(unit.aliases || [])]
    .filter(Boolean).some(candidate => normalizeMatchName(candidate) === key));
  if (exact) return exact;
  const result = findDataUnit(name);
  return result && !result.candidates ? result.unit : null;
}

function builderFindDetachmentIndex(name) {
  const key = norm(name);
  if (!key) return -1;
  return rosterBuilderDetachments.findIndex(item => {
    const names = [item.detachment, localizedRuleValue(item.name, "en"), localizedRuleValue(item.name, "ko"),
      localizedRuleValue(item.metadata?.name, "en"), localizedRuleValue(item.metadata?.name, "ko")].filter(Boolean);
    return names.some(candidate => {
      const candidateKey = norm(candidate);
      return detachmentNameMatches(candidate, name) || candidateKey === key ||
        (Math.min(candidateKey.length, key.length) >= 7 && (candidateKey.includes(key) || key.includes(candidateKey)));
    });
  });
}

function builderRestoreLoadout(entry, parsedUnit) {
  initializeBuilderModelGroups(entry);
  if (entry.unit.modelGroups?.length && parsedUnit.modelLoadouts?.length) {
    const records = parsedUnit.modelLoadouts.map(loadout => {
      // Variant labels include their weapons ("Scout · Bolt pistol + ...").
      // Resolve the model name before matching so "Scout" never consumes a
      // Sergeant's loadout merely because both names contain "Scout".
      const baseName = String(loadout.name || "").split(/\s+·\s+/)[0].trim();
      const baseKey = normalizeMatchName(baseName);
      const exact = entry.unit.modelGroups.find(model => normalizeMatchName(model.name) === baseKey);
      const group = exact || entry.unit.modelGroups.find(model =>
        /sergeant|sergent|서전트/i.test(model.name) === /sergeant|sergent|서전트/i.test(baseName) &&
        normalizeMatchName(baseName).includes(normalizeMatchName(model.name))
      );
      return { loadout, group };
    }).filter(record => record.group);
    const counts = Object.fromEntries(entry.unit.modelGroups.map(group => [String(group.id || group.name), Number(group.min) || 0]));
    const recordedCounts = {};
    records.forEach(({ loadout, group }) => {
      const key = String(group.id || group.name);
      recordedCounts[key] = Number(recordedCounts[key] || 0) + Number(loadout.models || 0);
    });
    entry.unit.modelGroups.forEach(group => {
      const key = String(group.id || group.name);
      if (Object.hasOwn(recordedCounts, key)) counts[key] = Math.max(Number(group.min) || 0,
        Math.min(Number(group.max) || 99, recordedCounts[key]));
    });
    const expectedCount = Number(parsedUnit.count) || 0;
    let unassigned = Math.max(0, expectedCount - Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0));
    for (const group of [...entry.unit.modelGroups].sort((a, b) => Number(Boolean(a.isLeaderModel)) - Number(Boolean(b.isLeaderModel)))) {
      if (!unassigned) break;
      const key = String(group.id || group.name);
      const room = Math.max(0, (Number(group.max) || 99) - Number(counts[key] || 0));
      const add = Math.min(room, unassigned);
      counts[key] = Number(counts[key] || 0) + add;
      unassigned -= add;
    }
    entry.modelGroupCounts = counts;
    const totalModels = entry.unit.modelGroups.reduce((sum, group) => sum + Number(counts[String(group.id || group.name)] || 0), 0);
    if (totalModels >= (Number(entry.unit.modelCount?.min) || 1) && totalModels <= (Number(entry.unit.modelCount?.max) || 99)) {
      entry.models = totalModels;
      entry.points = builderPointsFor(entry.unit, totalModels);
    }
    const groupOffsets = {};
    records.forEach(({ loadout, group }) => {
      const key = String(group.id || group.name);
      const startIndex = Number(groupOffsets[key] || 0);
      const loadoutSize = Number(loadout.models) || 0;
      groupOffsets[key] = startIndex + loadoutSize;
      const names = (loadout.items || []).map(item => normalizeLoadoutText(item.name));
      (entry.unit.wargearOptions || []).forEach(option => {
        if (normalizeMatchName(option.modelConstraint?.model_name || "") !== normalizeMatchName(group.name)) return;
        const choices = option.replacementChoice?.length ? option.replacementChoice : [option.replacement || []];
        const choiceIndex = choices.findIndex(choice => choice.length && choice.every(name => names.includes(normalizeLoadoutText(name))));
        if (choiceIndex >= 0) {
          entry.wargearSelections ||= {};
          const selection = entry.wargearSelections[String(option.id)] ||= { choiceIndex, modelIndices: [] };
          selection.choiceIndex = choiceIndex;
          const limit = builderWargearCountLimit(entry, option);
          selection.modelIndices = [...new Set([...selection.modelIndices, ...Array.from({ length: Math.min(loadoutSize, limit) }, (_, index) => startIndex + index)])]
            .slice(0, limit);
        }
      });
    });
  }
  const rawGear = [...(parsedUnit.equipmentLines || []), parsedUnit.equipment || ""].join(",");
  const options = builderWeaponOptions(entry.unit);
      entry.weapons = entry.unit.wargearOptions?.length
        ? []
        : options.filter(name => normalizeLoadoutText(rawGear).includes(normalizeLoadoutText(name)));
}

async function editSavedRosterInBuilder(savedId) {
  const saved = readRosterPresets().saved.find(item => item.id === savedId);
  if (!saved) return;
  const parsed = parseRoster(savedRosterTextWithFaction(saved));
  const faction = savedRosterFaction(saved);
  if (!faction) {
    $("roster-preset-status").textContent = "저장 로스터의 진영을 인식하지 못해 편집기로 열지 못했습니다.";
    return;
  }
  rosterBuilderRequest++;
  rosterBuilderUnits.splice(0, rosterBuilderUnits.length);
  rosterBuilderFaction = faction;
  rosterBuilderDetachments = [];
  builderSelectedDetachments = [];
  rosterBuilderSelectedDetachment = null;
  $("builder-detachment-manual").value = "";
  rosterBuilderEditingSavedId = saved.id;
  rosterBuilderEditingName = saved.name;
  $("builder-faction").value = faction;
  $("builder-limit").value = Number(saved.builderSnapshot?.text===saved.text&&saved.builderSnapshot?.limit) || Number(parsed.meta.gameSize) || Number(parsed.meta.points) || 1000;
  $("builder-load-faction").disabled = false;
  $("builder-detachment-step").hidden = false;
  $("builder-unit-step").hidden = true;
  $("builder-apply").textContent = "변경 내용 저장";
  $("builder-data-status").textContent = "저장 로스터 자료를 불러오는 중입니다…";
  $("roster-builder").open = true;
  try {
    await loadRulesData({ faction, rosterUnits: parsed.units });
    rosterBuilderDetachments = await loadBuilderDetachments(faction);
    const savedSnapshot=saved.builderSnapshot?.schema===1&&saved.builderSnapshot.text===saved.text?saved.builderSnapshot:null;
    const detachmentText = String(parsed.meta.detachment || "").replace(/^\s*DETACHMENT\s*:\s*/i, "")
      .replace(/\s*\(\s*\d+\s*(?:detachment\s*points?|DPs?|디테치먼트\s*포인트)\s*\)\s*$/i, "");
    const rosterLineKeys = saved.text.split(/\r?\n/).map(line => norm(line.replace(/^\s*[•●▪*◦○◆-]\s*/, "")));
    const inferredDetachmentNames = detachmentText ? [] : rosterBuilderDetachments.filter(item => {
      const names = [item.detachment, localizedRuleValue(item.name, "en"), localizedRuleValue(item.name, "ko")].filter(Boolean).map(norm);
      return names.some(name => rosterLineKeys.some(line => line === name ||
        (line.startsWith(name) && /\b(?:dp|points?)\b|디테치먼트\s*포인트/.test(line.slice(name.length)))));
    }).map(item => item.detachment);
    const snapshotDetachments=Array.isArray(savedSnapshot?.detachments)?savedSnapshot.detachments:[];
    const detachmentNames = (snapshotDetachments.length?snapshotDetachments:detachmentText?detachmentText.split(/\s*,\s*/):inferredDetachmentNames).filter(Boolean);
    const unmatchedDetachments = [];
    detachmentNames.forEach(name => {
      const index = builderFindDetachmentIndex(name);
      if (index >= 0 && !builderSelectedDetachments.includes(index)) builderSelectedDetachments.push(index);
      else if (index < 0) unmatchedDetachments.push(name);
    });
    if ((detachmentNames.length && !builderSelectedDetachments.length)||savedSnapshot?.manualDetachment) {
      $("builder-detachment-manual").value = savedSnapshot?.manualDetachment||detachmentNames.join(", ");
      $("builder-detachment-manual-wrap").hidden = false;
    }
    rosterBuilderSelectedDetachment = builderSelectedDetachments[0] ?? null;
    renderBuilderDetachments();
    const unmatched = [];
    const snapshotUnits=builderUnitsFromSnapshot(savedSnapshot);
    if(snapshotUnits)rosterBuilderUnits.push(...snapshotUnits);
    else parsed.units.forEach((parsedUnit, parsedIndex) => {
      const unit = builderFindRosterUnit(parsedUnit.rosterName);
      if (!unit) { unmatched.push(parsedUnit.rosterName); return; }
      const entry = { unit, models: parsedUnit.count || unit.modelCount?.min || 1,
        points: builderPointsFor(unit, parsedUnit.count || unit.modelCount?.min || 1),
        gearCounts: {}, weapons: [], attachedTo: null };
      builderRestoreLoadout(entry, parsedUnit);
      const enhancementName = parsedUnit.enhancements?.[0] || "";
      if (enhancementName) {
        const enhancementOptions = builderOptionsForEnhancement(entry);
        entry.enhancement = enhancementOptions.find(option =>
          normalizeRosterEnhancementName(localizedRuleValue(option.name, "en") || "") === normalizeRosterEnhancementName(enhancementName) ||
          normalizeRosterEnhancementName(localizedRuleValue(option.name, "ko") || "") === normalizeRosterEnhancementName(enhancementName)
        ) || null;
      }
      entry._savedAttachName = parsedUnit.attachedTo || "";
      entry._savedParsedIndex = parsedIndex;
      rosterBuilderUnits.push(entry);
    });
    if(!snapshotUnits){
      const savedParents=rosterAttachmentParents(parsed.units);
      rosterBuilderUnits.forEach(entry => {
        const parent=savedParents.get(entry._savedParsedIndex);
        const target=rosterBuilderUnits.findIndex(candidate=>candidate._savedParsedIndex===parent);
        entry.attachedTo=target>=0?target:null;
      });
      rosterBuilderUnits.forEach(entry=>{delete entry._savedAttachName;delete entry._savedParsedIndex;});
    }
    rosterBuilderSelectedIndex = rosterBuilderUnits.length ? 0 : -1;
    $("builder-unit-step").hidden = false;
    $("builder-data-status").textContent = [
      unmatched.length ? "데이터 연결이 안 된 유닛: " + unmatched.join(", ") : "",
      unmatchedDetachments.length ? "디테치먼트 연결 안 됨: " + unmatchedDetachments.join(", ") : "",
      !unmatched.length && !unmatchedDetachments.length ? snapshotUnits?"저장된 모델별 장비·인헨스·합류 설정을 복원했습니다.":"저장 로스터의 디테치먼트·유닛·무장·인헨스·합류 구성을 불러왔습니다." : ""
    ].filter(Boolean).join(" · ");
    renderBuilderUnitCatalog();
    renderRosterBuilderList();
    if (rosterBuilderSelectedIndex >= 0) $("builder-unit-detail").classList.add("is-open");
    $("roster-import-panel").open = false;
    $("roster-builder").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    $("builder-data-status").textContent = "저장 로스터 편집기 연결 실패: " + (error?.message || "데이터 연결 오류");
  }
}

$("roster-saved-list").addEventListener("click", event => {
  const button = event.target.closest("[data-edit-saved-roster]");
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  editSavedRosterInBuilder(button.dataset.editSavedRoster);
}, true);

renderRosterBuilderList();
