const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  selectableOptions,
  optionsForModel,
  optionsForGeneralModels,
  orderModelGroups,
  normalizeUnitWargearOptions,
  modelHasConflictingSelection,
  maxModelsForOption,
  modelGroupOffset,
  clearWargearSelection,
  matchWeaponProfiles
} = require("../roster-builder-wargear-policy.js");

test("fixed weapon profiles are not treated as selectable wargear", () => {
  const infernus = {
    profiles: ["Pyreblaster", "Bolt pistol", "Ceramite Fists"].map(name => ({ name, typeName: "Ranged Weapons" })),
    modelGroups: [{ name: "Infernus Marine", defaultWeapons: ["Pyreblaster", "Bolt pistol", "Ceramite Fists"] }]
  };

  assert.deepEqual(selectableOptions(infernus), []);
  assert.deepEqual(optionsForGeneralModels(infernus, infernus.modelGroups), []);
});

test("only declared replacement options are selectable and stay with their model", () => {
  const sergeant = { name: "Infernus Sergeant", isLeaderModel: true };
  const marine = { name: "Infernus Marine" };
  const sergeantOption = { id: "sergeant-flamer", modelConstraint: { model_name: "Infernus Sergeant" } };
  const marineOption = { id: "marine-flamer", modelConstraint: { model_name: "Infernus Marine" } };
  const unit = { wargearOptions: [sergeantOption, marineOption] };

  assert.deepEqual(optionsForModel(unit, sergeant), [sergeantOption]);
  assert.deepEqual(optionsForModel(unit, marine), [marineOption]);
  assert.deepEqual(optionsForGeneralModels(unit, [sergeant, marine]), []);
});

test("sergeant model group is displayed before regular models", () => {
  const regular = { name: "Assault Intercessor" };
  const sergeant = { name: "Assault Intercessor Sergeant" };
  assert.deepEqual(orderModelGroups([regular, sergeant]), [sergeant, regular]);
});

test("unscoped legal wargear options remain available in the shared section", () => {
  const scoped = { id: "sergeant-option", modelConstraint: { model_name: "Sergeant" } };
  const shared = { id: "shared-option", modelConstraint: {} };
  const unit = { wargearOptions: [scoped, shared] };
  assert.deepEqual(optionsForGeneralModels(unit, [{ name: "Sergeant" }]), [shared]);
});

test("both roster detail renderers gate weapon choices on explicit wargear options", () => {
  const baseUi = fs.readFileSync(path.join(__dirname, "..", "roster-builder-ui.js"), "utf8");
  const officialUi = fs.readFileSync(path.join(__dirname, "..", "roster-builder-official-ui.js"), "utf8");
  assert.match(baseUi, /if\s*\(weapons\.length\s*&&\s*item\.unit\.wargearOptions\?\.length\)/);
  assert.match(officialUi, /if\s*\(gearSection\)\s*gearSection\.hidden\s*=\s*true/);
  assert.doesNotMatch(officialUi, /profiles\.map\(profile\s*=>\s*'<div class="builder-weapon-option"><label><input type="checkbox" data-builder-weapon-check/);
});

test("Scout wargear choices match the datasheet instead of mixing unrelated weapons", () => {
  const options = normalizeUnitWargearOptions("scout-squad", [
    { id: "general-boltgun", replaces: ["Boltgun"], replacementChoice: [["Astartes shotgun"], ["Combat knife"], ["Heavy bolter"], ["Missile launcher"]], modelConstraint: { model_name: "Scout", any_number: true } },
    { id: "sniper", replaces: ["Boltgun"], replacement: ["Scout sniper rifle"], modelConstraint: { model_name: "Scout", per_n_models: 5 } },
    { id: "sergeant-boltgun", replaces: ["Boltgun"], replacementChoice: [["Astartes chainsword"], ["Astartes shotgun"], ["Combat knife"]], modelConstraint: { model_name: "Scout Sergeant", any_number: true } },
    { id: "sergeant-knife", replaces: ["Combat knife"], replacement: ["Astartes chainsword"], modelConstraint: { model_name: "Scout Sergeant", any_number: true } }
  ]);

  const byId = Object.fromEntries(options.map(option => [option.id, option]));
  assert.deepEqual(byId["general-boltgun"].replacement, ["Astartes shotgun"]);
  assert.deepEqual(byId["sergeant-boltgun"].replacement, ["Astartes shotgun"]);
  assert.deepEqual(byId["sergeant-knife"].replacement, ["Astartes chainsword"]);
  assert.deepEqual(byId.sniper.replacement, ["Scout sniper rifle"]);
  assert.equal(byId["scout-squad-wgo-heavy-weapon-per-five"].modelConstraint.per_n_models, 5);
  assert.deepEqual(byId["scout-squad-wgo-heavy-weapon-per-five"].replacementChoice, [["Heavy bolter"], ["Missile launcher"]]);
});

test("per-five equipment uses total unit size and caps at eligible Scout models", () => {
  const unit = { modelGroups: [
    { name: "Scout Sergeant", min: 1, max: 1 },
    { name: "Scout", min: 4, max: 9 }
  ] };
  const option = { modelConstraint: { model_name: "Scout", per_n_models: 5 } };
  assert.equal(maxModelsForOption(unit, option, { Scout: 4, "Scout Sergeant": 1 }, 5), 1);
  assert.equal(maxModelsForOption(unit, option, { Scout: 9, "Scout Sergeant": 1 }, 10), 2);
});

test("a model cannot replace the same default weapon twice", () => {
  const rifleOption = { id: "sniper", replaces: ["Boltgun"], modelConstraint: { model_name: "Scout" } };
  const heavyOption = { id: "heavy", replaces: ["Boltgun"], modelConstraint: { model_name: "Scout" } };
  const unit = { wargearOptions: [rifleOption, heavyOption] };
  const selections = { sniper: { choiceIndex: 0, modelIndices: [1] } };
  assert.equal(modelHasConflictingSelection(unit, selections, heavyOption, 1), true);
  assert.equal(modelHasConflictingSelection(unit, selections, heavyOption, 2), false);
});

test("model letters continue after the sergeant instead of restarting at A", () => {
  const sergeant = { id: "sgt", name: "Scout Sergeant", isLeaderModel: true };
  const scouts = { id: "scouts", name: "Scout" };
  const unit = { modelGroups: [scouts, sergeant] };
  const counts = { sgt: 1, scouts: 4 };
  assert.equal(modelGroupOffset(unit, counts, sergeant), 0);
  assert.equal(modelGroupOffset(unit, counts, scouts), 1);
  assert.deepEqual(Array.from({ length: 4 }, (_, index) => String.fromCharCode(65 + modelGroupOffset(unit, counts, scouts) + index)), ["B", "C", "D", "E"]);
});

test("reset action removes the selected replacement so the default loadout returns", () => {
  const entry = { wargearSelections: { scoutBoltgun: { choiceIndex: 0, modelIndices: [1] } } };
  assert.equal(clearWargearSelection(entry, "scoutBoltgun"), true);
  assert.deepEqual(entry.wargearSelections, {});
  assert.equal(clearWargearSelection(entry, "scoutBoltgun"), false);
});

test("reset button is handled by a click event", () => {
  const officialUi = fs.readFileSync(path.join(__dirname, "..", "roster-builder-official-ui.js"), "utf8");
  assert.match(officialUi, /detail\.addEventListener\("click", event => \{[\s\S]*?const clearWargear = event\.target\.closest\("\[data-wargear-clear\]"\)/);
});

test("weapon details and reset controls are placed on the individual weapon row", () => {
  const officialUi = fs.readFileSync(path.join(__dirname, "..", "roster-builder-official-ui.js"), "utf8");
  assert.match(officialUi, /builder-wargear-choice-row[\s\S]*?builder-choice-info[\s\S]*?data-builder-option-choice-detail/);
  assert.match(officialUi, /current\.choiceIndex != null && Number\(current\.choiceIndex\) === index[\s\S]*?data-wargear-clear/);
  assert.match(officialUi, /const weaponChoiceDetail = event\.target\.closest\("\[data-builder-option-choice-detail\]"\)/);
});

test("weapon profiles match equipment aliases and multi-profile weapon IDs", () => {
  const profiles = [
    { id: "bsdata-shotgun", name: "Shotgun", typeName: "Ranged Weapons" },
    { id: "bsdata-chain", name: "Chainsword", typeName: "Melee Weapons" },
    { id: "40kdc:missile-launcher-scout-squad:Frag", name: "Frag", typeName: "Ranged Weapons" },
    { id: "bsdata-pistol", name: "Heavy Bolt Pistol", typeName: "Ranged Weapons" }
  ];
  assert.deepEqual(matchWeaponProfiles(profiles, ["Astartes shotgun", "Astartes chainsword", "Missile launcher"]), profiles.slice(0, 3));
});
