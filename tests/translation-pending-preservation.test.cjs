const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const file = 'Imperium - Space Marines.json';
const properties = new Map([['V2_PRIORITY_SOURCE_FILES', JSON.stringify([file])]]);
const props = {
  getProperty: key => properties.get(key) || null,
  setProperty: (key, value) => properties.set(key, value),
};
const rows = Array.from({ length: 4 }, () => Array(14).fill(''));
function row(number, kind, translation) {
  const cells = rows[number - 1];
  cells[1] = '11'; // B: Edition
  cells[3] = file; // D: Source file
  cells[5] = kind; // F: Kind
  cells[6] = `Rule ${number}`; // G: Name EN
  cells[7] = `Source ${number}`; // H: Source EN
  cells[9] = translation; // J: Translation KO
  cells[10] = 'PENDING'; // K: Status
}
row(2, 'ability', '이미 번역됨');
row(3, 'ability', '');
row(4, 'label', '');
const sheet = {
  getLastRow: () => rows.length,
  getRange: (start, column, count, width) => ({
    getDisplayValues: () => rows.slice(start - 1, start - 1 + count).map(cells => cells.slice(column - 1, column - 1 + width)),
    getValues: () => rows.slice(start - 1, start - 1 + count).map(cells => cells.slice(column - 1, column - 1 + width)),
    setValues: values => values.forEach((cells, i) => cells.forEach((value, j) => { rows[start - 1 + i][column - 1 + j] = value; })),
  }),
};
const context = { PropertiesService: { getScriptProperties: () => props } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../google-sheets-v2/Code.gs'), 'utf8'), context);
context.log_ = () => {};
const result = context.findPriorityTranslationRows_(sheet, 64);
assert.deepEqual(Array.from(result.items, item => item.row), [3, 4]);
assert.equal(rows[1][9], '이미 번역됨');
assert.equal(rows[1][10], 'AI_DRAFT');
console.log('Filled pending translation preservation passed');
