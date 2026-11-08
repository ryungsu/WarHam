const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'roster-builder-official-ui.js'), 'utf8');
const from = source.indexOf('function builderSnapshotForText(');
const to = source.indexOf('function builderDetachmentTags(', from);
assert.ok(from >= 0 && to > from);
const snapshotCode = source.slice(from, to);

function fixture() {
  const squad = {
    id: 'squad-1', name: 'Assault Intercessor Squad', modelCount: { min: 5, max: 10 },
    modelGroups: [{ id: 'sergeant', name: 'Sergeant', min: 1, max: 1 }, { id: 'marine', name: 'Marine', min: 4, max: 9 }],
    wargearOptions: [{ id: 'pistol-choice', replacementChoice: [['Plasma pistol'], ['Hand flamer']] }]
  };
  const leader = { id: 'leader-1', name: 'Lieutenant', modelCount: { min: 1, max: 1 }, wargearOptions: [] };
  const enhancement = { name: 'Example Enhancement' };
  const context = vm.createContext({
    $: id => ({ value: id === 'builder-limit' ? '1000' : '' }), rosterBuilderFaction: 'Ultramarines',
    builderSelectedDetachmentNames: () => ['Assault Brethren, Ironclad Champions (Assault Mastery)'],
    rosterBuilderUnits: [
      { unit: squad, models: 5, points: 85, modelGroupCounts: { sergeant: 1, marine: 4 },
        wargearSelections: { 'pistol-choice': { choiceIndex: 0, modelIndices: [0] } },
        gearCounts: {}, weapons: [], attachedTo: null },
      { unit: leader, models: 1, points: 50, gearCounts: {}, weapons: [], attachedTo: 0, enhancement }
    ],
    db: { units: [squad, leader] },
    builderFindRosterUnit: name => [squad, leader].find(unit => unit.name === name) || null,
    builderPointsFor: (unit, models) => unit === squad ? 85 + Math.max(0, models - 5) * 10 : 50,
    builderWeaponOptions: () => [],
    builderWargearCountLimit: () => 1,
    builderOptionsForEnhancement: entry => entry.unit === leader ? [enhancement] : [],
    localizedRuleValue: value => value,
    normalizeRosterEnhancementName: value => String(value).toLowerCase(),
    initializeBuilderModelGroups: entry => {
      entry.models = Object.values(entry.modelGroupCounts).reduce((sum, value) => sum + value, 0);
    }
  });
  vm.runInContext(snapshotCode, context);
  return context;
}

test('saved builder state restores model wargear, enhancement and attachment without parsing text', () => {
  const context = fixture();
  const snapshot = context.builderSnapshotForText('FACTION KEYWORD: Ultramarines\n5x Assault Intercessor Squad');
  context.rosterBuilderUnits[0].wargearSelections['pistol-choice'].modelIndices.push(1);
  assert.equal(snapshot.units[0].wargearSelections['pistol-choice'].modelIndices.length, 1);
  assert.equal(snapshot.detachments[0], 'Assault Brethren, Ironclad Champions (Assault Mastery)');
  const restored = context.builderUnitsFromSnapshot(snapshot);
  assert.equal(restored[0].modelGroupCounts.sergeant, 1);
  assert.equal(restored[0].wargearSelections['pistol-choice'].choiceIndex, 0);
  assert.equal(restored[0].wargearSelections['pistol-choice'].modelIndices[0], 0);
  assert.equal(restored[1].enhancement.name, 'Example Enhancement');
  assert.equal(restored[1].attachedTo, 0);
});

test('unavailable units fall back to the legacy text import', () => {
  const context = fixture();
  const snapshot = context.builderSnapshotForText('roster');
  snapshot.units[0].unitId = 'removed';
  snapshot.units[0].unitName = 'Removed Unit';
  assert.equal(context.builderUnitsFromSnapshot(snapshot), null);
});
