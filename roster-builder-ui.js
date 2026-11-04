let rosterBuilderSelectedIndex = -1;

builderUnitRole = function (unit) {
  const keywords = (unit.keywords || []).map(keyword => norm(keyword));
  const has = (...names) => names.some(name => keywords.includes(norm(name)));
  if (has("Epic Hero")) return "epicHero";
  if (has("Character")) return "character";
  if (has("Battleline")) return "battleline";
  if (has("Dedicated Transport")) return "transport";
  if (has("Infantry")) return "infantry";
  if (has("Mounted")) return "mounted";
  if (has("Vehicle")) return "vehicle";
  if (has("Monster")) return "monster";
  if (has("Beast")) return "beast";
  if (has("Swarm")) return "swarm";
  if (has("Aircraft")) return "aircraft";
  if (has("Fortification")) return "fortification";
  return "other";
};

const builderRoleLabels = {
  epicHero: "에픽 히어로", character: "캐릭터", battleline: "전열",
  transport: "전용 수송", infantry: "보병", mounted: "기승",
  vehicle: "차량", monster: "몬스터", beast: "야수", swarm: "군집",
  aircraft: "항공기", fortification: "요새화", other: "기타"
};
const builderCatalogRoot = $("builder-unit-catalog");
new MutationObserver(() => {
  builderCatalogRoot.querySelectorAll(".builder-unit-card").forEach((card, index) => {
    const unit = builderCatalogRoot._builderUnits?.[index];
    const badge = card.querySelector(".builder-role");
    if (unit && badge) badge.textContent = builderRoleLabels[builderUnitRole(unit)] || "기타";
  });
}).observe(builderCatalogRoot, { childList: true });

function builderOptionsForEnhancement(item) {
  const detachment = rosterBuilderDetachments[rosterBuilderSelectedDetachment]?.detachment || "";
  const selected = rosterBuilderUnits.filter(unit => unit.enhancement && unit !== item);
  const budget = Math.max(1, Math.floor((Number($("builder-limit").value) || 1000) / 500));
  if (!item.enhancement && selected.length >= budget) return [];
  return factionEnhancements.filter(enhancement =>
    detachmentNameMatches(localizedRuleValue(enhancement.detachment, "en") || enhancement.detachment, detachment)
  ).filter(enhancement => {
    const name = localizedRuleValue(enhancement.name, "en") || "";
    const upgrade = /upgrade/i.test(name) || /upgrade/i.test(enhancement.type || "");
    if (!upgrade && selected.some(unit => unit.enhancement === enhancement)) return false;
    const character = builderUnitRole(item.unit) === "character" &&
      !(item.unit.keywords || []).some(keyword => /epic hero/i.test(keyword));
    return upgrade || character;
  });
}

function renderBuilderUnitDetail() {
  const panel = $("builder-unit-detail");
  const item = rosterBuilderUnits[rosterBuilderSelectedIndex];
  if (!item) {
    panel.hidden = true;
    panel.replaceChildren();
    return;
  }
  panel.hidden = false;
  const weapons = builderWeaponOptions(item.unit);
  const enhancements = builderOptionsForEnhancement(item);
  const role = item.unit.attachmentRole;
  let html = '<div class="builder-detail-heading"><div><small>선택한 유닛 편집</small><h3>' +
    escapeHtml(tr(item.unit.name)) + '</h3><span>' + escapeHtml(item.unit.name) + '</span></div>' +
    '<button type="button" class="quiet" data-builder-detail-close>닫기</button></div>';
  html += '<div class="builder-detail-controls"><label>모델 수<input type="number" min="' +
    (item.unit.modelCount?.min || 1) + '" max="' + (item.unit.modelCount?.max || 99) +
    '" value="' + (item.models || item.unit.modelCount?.min || 1) +
    '" data-builder-models="' + rosterBuilderSelectedIndex + '"></label><div class="builder-calculated-points"><span>자동 계산 포인트</span><output data-builder-points="' +
    rosterBuilderSelectedIndex + '">' + (item.points || 0) + '점</output></div><span class="builder-point-source">' +
    ((item.unit.pointOptions || []).length ? "모델 수 구간 포인트" : "기본 포인트 · 자료 미등록") + '</span></div>';
  html += '<section class="builder-detail-section builder-model-detail"><b>모델 구성</b><small>서전트와 일반 모델의 인원 및 기본 무장을 확인합니다.</small></section>';
  if (weapons.length && item.unit.wargearOptions?.length) {
    html += '<section class="builder-detail-section"><b>무장 선택</b><small>데이터에 등록된 교체·추가 무장만 선택할 수 있습니다.</small><div class="builder-weapon-options">';
    weapons.forEach(weapon => {
      html += '<label class="builder-weapon-option"><input type="checkbox" data-builder-weapon-check="' +
        rosterBuilderSelectedIndex + '" value="' + escapeHtml(weapon) + '"' +
        ((item.weapons || []).includes(weapon) ? " checked" : "") + '><span><b>' +
        escapeHtml(tr(weapon)) + '</b><small>' + escapeHtml(weapon) + '</small></span></label>';
    });
    html += '</div></section>';
  }
  if (enhancements.length) {
    html += '<section class="builder-detail-section builder-enhancement-section"><b>인헨스먼트 · 선택 가능한 항목</b><div class="builder-enhancement-options">';
    enhancements.forEach((enhancement, index) => {
      const name = localizedRuleValue(enhancement.name, "en") || "Enhancement";
      const cost = builderEnhancementCost(enhancement);
      const selected = item.enhancement === enhancement;
      const restrictions = [...(enhancement.keywords || []), ...(enhancement.excludes || []).map(keyword => "제외 " + keyword)];
      html += '<article class="builder-enhancement-option' + (selected ? ' is-selected' : '') + '"><div><b>' +
        escapeHtml(tr(name)) + '</b><small>' + escapeHtml(name) + (cost ? ' · ' + cost + '점' : ' · 포인트 미등록') +
        (restrictions.length ? ' · ' + escapeHtml(restrictions.join(' / ')) : '') + '</small></div><div class="builder-enhancement-actions"><button type="button" class="quiet builder-info-trigger" data-builder-enhancement-card-detail="' +
        index + '">상세 보기</button><button type="button" class="' + (selected ? 'primary' : 'quiet') + '" data-builder-enhancement-card-select="' +
        index + '">' + (selected ? '선택됨 · 해제' : '선택') + '</button></div></article>';
    });
    html += '</div></section>';
  }
  if (role) {
    html += '<section class="builder-detail-section"><b>' +
      (role === "support" ? "서포트 합류 대상 선택" : "리더 합류 대상 선택") + '</b><div class="builder-attachment-targets">';
    rosterBuilderUnits.forEach((target, index) => {
      if (index === rosterBuilderSelectedIndex || target.unit.attachmentRole) return;
      const selected = item.attachedTo === index;
      html += '<button type="button" class="builder-attachment-target' + (selected ? ' is-selected' : '') +
        '" data-builder-attach-card="' + index + '"><b>' + escapeHtml(tr(target.unit.name)) + '</b><small>' +
        escapeHtml(target.unit.name) + ' · #' + (index+1) + ' · ' + target.models + '개체 · ' + target.points + '점</small><span>' +
        (selected ? '선택됨' : '합류') + '</span></button>';
    });
    html += '<button type="button" class="quiet" data-builder-attach-card="">합류 없이 편성</button>';
    if (role === "support" && !Number.isInteger(item.attachedTo)) html += '<small>서포트 모델은 합류 대상을 선택해야 합니다.</small>';
    html += '</div></section>';
  }
  panel.innerHTML = html;
}

const builderRenderBeforeDetailLayout = renderRosterBuilderList;
renderRosterBuilderList = function () {
  updateRosterBuilderSummary();
  const list = $("builder-unit-list");
  $("builder-roster-count").textContent = rosterBuilderUnits.length + "개";
  list.innerHTML = rosterBuilderUnits.length ? rosterBuilderUnits.map((item, index) =>
    '<article class="builder-roster-row' + (index === rosterBuilderSelectedIndex ? " is-selected" : "") + '">' +
    '<button type="button" class="builder-roster-pick" data-builder-select-unit="' + index + '">' +
    '<b>' + escapeHtml(tr(item.unit.name)) + '</b><small>' + escapeHtml(item.unit.name) + '</small>' +
    '<span>' + (item.models || item.unit.modelCount?.min || 1) + '모델 · ' +
    (item.points + builderEnhancementCost(item.enhancement)) + '점</span></button>' +
    '<button type="button" class="quiet builder-roster-remove" data-builder-remove="' + index +
    '" aria-label="' + escapeHtml(item.unit.name) + ' 삭제">×</button></article>'
  ).join("") : '<p class="phase-empty">왼쪽 목록에서 유닛을 추가하세요.</p>';
  renderBuilderUnitDetail();
};

$("builder-unit-list").addEventListener("click", event => {
  const pick = event.target.closest("[data-builder-select-unit]");
  const close = event.target.closest("[data-builder-detail-close]");
  const remove = event.target.closest("[data-builder-remove]");
  if (pick) {
    rosterBuilderSelectedIndex = Number(pick.dataset.builderSelectUnit);
    renderRosterBuilderList();
    window.requestAnimationFrame(() => $("builder-unit-detail").scrollIntoView({ behavior: "smooth", block: "start" }));
  } else if (close) {
    rosterBuilderSelectedIndex = -1;
    renderRosterBuilderList();
  } else if (remove) {
    rosterBuilderSelectedIndex = Math.min(rosterBuilderSelectedIndex, rosterBuilderUnits.length - 1);
    renderRosterBuilderList();
  }
});

$("builder-unit-catalog").addEventListener("click", event => {
  if (!event.target.closest("[data-builder-add]")) return;
  const item = rosterBuilderUnits.at(-1);
  if (!item) return;
  item.models = Number(item.unit.modelCount?.min) || 1;
  item.points = builderPointsFor(item.unit, item.models);
  rosterBuilderSelectedIndex = rosterBuilderUnits.length - 1;
  renderRosterBuilderList();
  window.requestAnimationFrame(() => $("builder-unit-detail").scrollIntoView({ behavior: "smooth", block: "start" }));
});

$("builder-unit-detail").addEventListener("change", event => {
  const weapon = event.target.closest("[data-builder-weapon-check]");
  if (weapon) {
    const item = rosterBuilderUnits[Number(weapon.dataset.builderWeaponCheck)];
    const selected = new Set(item.weapons || []);
    if (weapon.checked) selected.add(weapon.value); else selected.delete(weapon.value);
    item.weapons = [...selected];
    return;
  }
  const enhancement = event.target.closest("[data-builder-enhancement-pick]");
  if (enhancement) {
    const item = rosterBuilderUnits[Number(enhancement.dataset.builderEnhancementPick)];
    item.enhancement = enhancement.value ? builderOptionsForEnhancement(item)[Number(enhancement.value)] || null : null;
    updateRosterBuilderSummary();
    renderRosterBuilderList();
    return;
  }
  const attach = event.target.closest("[data-builder-attach-pick]");
  if (attach) {
    rosterBuilderUnits[Number(attach.dataset.builderAttachPick)].attachedTo = attach.value ? Number(attach.value) : null;
    updateRosterBuilderSummary();
  }
});

$("builder-unit-detail").addEventListener("input", event => {
  const models = event.target.closest("[data-builder-models]");
  if (!models) return;
  const item = rosterBuilderUnits[Number(models.dataset.builderModels)];
  if (!item) return;
  item.models = Math.max(Number(item.unit.modelCount?.min) || 1,
    Math.min(Number(item.unit.modelCount?.max) || 99, Number(models.value) || 1));
  item.points = builderPointsFor(item.unit, item.models);
  const points = $("builder-unit-detail").querySelector("[data-builder-points]");
  if (points) points.textContent = item.points + "점";
  updateRosterBuilderSummary();
  const row = $("builder-unit-list").querySelector('[data-builder-select-unit="' + rosterBuilderSelectedIndex + '"] span');
  if (row) row.textContent = item.models + "모델 · " + (item.points + builderEnhancementCost(item.enhancement)) + "점";
});

$("builder-apply").addEventListener("click", () => {
  if (!rosterBuilderUnits.length) return;
  const total = rosterBuilderTotal();
  const detachment = rosterBuilderDetachments[rosterBuilderSelectedDetachment]?.detachment || $("builder-detachment-manual").value.trim();
  const dp = builderDetachmentCost(rosterBuilderDetachments[rosterBuilderSelectedDetachment]);
  const lines = ["FACTION KEYWORD: " + rosterBuilderFaction];
  if (detachment) lines.push("DETACHMENT: " + detachment + (dp ? " (" + dp + " detachment points)" : ""));
  lines.push("TOTAL ARMY POINTS: " + total, "NUMBER OF UNITS: " + rosterBuilderUnits.length, "");
  rosterBuilderUnits.forEach(item => {
    lines.push(item.models + "x " + item.unit.name + " (" +
      (item.points + builderEnhancementCost(item.enhancement)) + " points)");
    if (item.weapons?.length) lines.push("• " + item.weapons.join(", "));
    if (item.enhancement) lines.push("• Enhancements: " + (localizedRuleValue(item.enhancement.name, "en") || ""));
    if (Number.isInteger(item.attachedTo)) {
      const target = rosterBuilderUnits[item.attachedTo];
      if (target) lines.push("• Attached to: " + target.unit.name,
        "• Attached as: " + (item.unit.attachmentRole === "support" ? "Support" : "Leader"));
    }
  });
  $("roster").value = lines.join("\n");
  resizeRoster();
  render();
});

$("builder-limit").addEventListener("change", () => {
  rosterBuilderUnits.forEach(item => { item.points = builderPointsFor(item.unit, item.models); });
  renderRosterBuilderList();
});

renderRosterBuilderList();
