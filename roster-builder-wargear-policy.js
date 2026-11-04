(function (root) {
  "use strict";

  function key(value) {
    return String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  }

  function optionsForModel(unit, group) {
    const groupKey = key(group?.name);
    if (!groupKey) return [];
    return (Array.isArray(unit?.wargearOptions) ? unit.wargearOptions : []).filter(option =>
      key(option?.modelConstraint?.model_name) === groupKey
    );
  }

  function selectableOptions(unit) {
    return Array.isArray(unit?.wargearOptions) ? unit.wargearOptions : [];
  }

  function weaponNameKeys(value) {
    const normalized = key(value);
    if (!normalized) return [];
    const variants = new Set([normalized]);
    for (const prefix of ["astartes", "scout"]) {
      if (normalized.startsWith(prefix) && normalized.length > prefix.length) variants.add(normalized.slice(prefix.length));
    }
    return [...variants];
  }

  function matchWeaponProfiles(profiles, names) {
    const wanted = names.flatMap(weaponNameKeys);
    return (profiles || []).filter(profile => {
      const idWeapon = String(profile.id || "").split(":")[1] || "";
      const profileKeys = [...[profile.name, profile.weaponName, idWeapon].flatMap(weaponNameKeys)];
      return wanted.some(value => profileKeys.some(candidate => candidate === value ||
        (Math.min(value.length, candidate.length) >= 8 && candidate.startsWith(value))));
    });
  }

  function optionsForGeneralModels(unit, groups) {
    const groupKeys = new Set((groups || []).map(group => key(group?.name)).filter(Boolean));
    return selectableOptions(unit).filter(option =>
      !groupKeys.has(key(option?.modelConstraint?.model_name))
    );
  }

  function orderModelGroups(groups) {
    return [...(groups || [])].sort((a, b) => {
      const leader = group => Boolean(group?.isLeaderModel || /sergeant/i.test(group?.name || ""));
      return Number(leader(b)) - Number(leader(a));
    });
  }

  function modelGroupOffset(unit, groupCounts, targetGroup) {
    let offset = 0;
    for (const group of orderModelGroups(unit?.modelGroups || [])) {
      if (key(group.name) === key(targetGroup?.name)) return offset;
      offset += Number(groupCounts?.[String(group.id || group.name)] || 0);
    }
    return 0;
  }

  function normalizeUnitWargearOptions(unitId, options) {
    const normalized = (Array.isArray(options) ? options : []).map(option => ({
      ...option,
      modelConstraint: { ...(option.modelConstraint || {}) },
      replaces: [...(option.replaces || [])],
      replacement: [...(option.replacement || [])],
      replacementChoice: (option.replacementChoice || []).map(choice => [...choice])
    }));
    if (key(unitId) !== "scoutsquad") return normalized;

    const isFor = (option, modelName, replaced) =>
      key(option.modelConstraint?.model_name) === key(modelName) &&
      option.replaces.some(name => key(name) === key(replaced));
    const scoutBoltgun = normalized.find(option => isFor(option, "Scout", "Boltgun") && option.modelConstraint.any_number);
    const scoutSergeantBoltgun = normalized.find(option => isFor(option, "Scout Sergeant", "Boltgun"));
    const getChoiceBy = (option, pattern) => option
      ? [...option.replacement, ...option.replacementChoice.flat()].find(name => pattern.test(name))
      : undefined;

    const shotgun = getChoiceBy(scoutSergeantBoltgun || scoutBoltgun, /shotgun/i) || "Astartes shotgun";
    const heavyBolter = getChoiceBy(scoutBoltgun, /heavy bolter/i) || "Heavy bolter";
    const missileLauncher = getChoiceBy(scoutBoltgun, /missile launcher/i) || "Missile launcher";

    // Upstream currently groups unrelated Scout replacement choices under Boltgun.
    // Split them into the actual datasheet choices: shotgun, sniper, heavy weapon.
    if (scoutBoltgun) {
      scoutBoltgun.replacement = [shotgun];
      scoutBoltgun.replacementChoice = [];
    }
    if (scoutSergeantBoltgun) {
      scoutSergeantBoltgun.replacement = [shotgun];
      scoutSergeantBoltgun.replacementChoice = [];
    }

    const hasHeavyOption = normalized.some(option =>
      isFor(option, "Scout", "Boltgun") && option.modelConstraint.per_n_models &&
      [...option.replacement, ...option.replacementChoice.flat()].some(name => /heavy bolter|missile launcher/i.test(name))
    );
    if (!hasHeavyOption) normalized.push({
      id: "scout-squad-wgo-heavy-weapon-per-five",
      replaces: ["Boltgun"],
      replacement: [],
      replacementChoice: [[heavyBolter], [missileLauncher]],
      modelConstraint: { model_name: "Scout", per_n_models: 5 },
      isFree: true,
      additionalCost: null
    });
    return normalized;
  }

  function modelHasConflictingSelection(unit, selections, option, modelIndex) {
    const groupName = key(option.modelConstraint?.model_name);
    const removed = new Set(option.replaces.map(key));
    if (!groupName || !removed.size) return false;
    return Object.entries(selections || {}).some(([id, selection]) => {
      if (id === String(option.id)) return false;
      if (!selection?.modelIndices?.includes(modelIndex)) return false;
      const other = (unit?.wargearOptions || []).find(candidate => String(candidate.id) === id);
      if (!other || key(other.modelConstraint?.model_name) !== groupName) return false;
      return other.replaces.some(name => removed.has(key(name)));
    });
  }

  function maxModelsForOption(unit, option, groupCounts = {}, totalModels = 1) {
    const constraint = option?.modelConstraint || {};
    const group = (unit?.modelGroups || []).find(model => key(model.name) === key(constraint.model_name));
    const eligible = group
      ? Number(groupCounts[String(group.id || group.name)] || 0)
      : Math.max(0, Number(totalModels) || 0);
    const cap = constraint.per_n_models
      ? Math.floor((Number(totalModels) || 0) / Number(constraint.per_n_models))
      : constraint.any_number ? eligible : 1;
    return Math.max(0, Math.min(eligible, Number(constraint.max_count) || cap, cap));
  }

  function clearWargearSelection(entry, optionId) {
    if (!entry?.wargearSelections) return false;
    const existed = Object.hasOwn(entry.wargearSelections, String(optionId));
    delete entry.wargearSelections[String(optionId)];
    return existed;
  }

  const api = { selectableOptions, optionsForModel, optionsForGeneralModels, orderModelGroups, modelGroupOffset, normalizeUnitWargearOptions, modelHasConflictingSelection, maxModelsForOption, clearWargearSelection, weaponNameKeys, matchWeaponProfiles };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.rosterBuilderWargearPolicy = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
