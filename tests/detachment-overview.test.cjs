const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

test('data overview and navigator use only the roster-selected detachment', () => {
  const selected = 'Assault Brethren, Ironclad Champions (Assault Mastery)';
  const options = [{ id: 'selected-id', detachment: selected }];
  const items = [
    { name: 'Selected Stratagem', detachment: selected, detachmentId: 'selected-id' },
    { name: 'Other Stratagem', detachment: 'Another Detachment', detachmentId: 'other-id' }
  ];
  const context = vm.createContext({
    detachmentLabel: () => selected,
    rosterDetachmentOptions: () => options,
    factionStratagems: () => items,
    isRosterDetachment: (name, value) => name === value,
    uniqueStratagemItems: values => values,
    currentRosterMeta: { faction: 'Imperium - Ultramarines' },
    translateTerms: value => value === 'Ultramarines' ? '울트라마린' : value,
    norm: value => String(value).toLowerCase(),
    detachmentNameMatches: (a, b) => a === b,
    rosterDetachmentNameCandidates: value => value.split(',').map(part => part.trim()),
    localizedRuleValue: value => value
  });
  const helperStart = source.indexOf('function selectedDetachmentStratagems(');
  const helperEnd = source.indexOf('function stratagemDetachmentOptions(', helperStart);
  const matchStart = source.indexOf('function gameDataDetachmentMatches(');
  const matchEnd = source.indexOf('function externalRuleText(', matchStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart && matchStart >= 0 && matchEnd > matchStart);
  vm.runInContext(source.slice(helperStart, helperEnd), context);
  vm.runInContext(source.slice(matchStart, matchEnd), context);
  assert.equal(context.selectedDetachmentStratagems().map(item => item.name).join(','), 'Selected Stratagem');
  assert.equal(context.rosterFactionLabel(), '울트라마린');
  assert.equal(context.gameDataDetachmentMatches({ detachments: [] }, { detachment_id: 'selected-id', detachment: selected }, selected), true);
  assert.equal(context.gameDataDetachmentMatches({ detachments: [] }, { detachment_id: 'other-id', detachment: 'Another Detachment' }, selected), false);
});
