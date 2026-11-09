const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const rows = Array.from({ length: 10020 }, () => Array(14).fill(''));
function translation(row, edition, korean) {
  const cells = rows[row - 1];
  cells[1] = edition;
  cells[3] = 'Imperium - Space Marines.json';
  cells[6] = `Name ${row}`;
  cells[7] = `Source ${row}`;
  cells[9] = korean;
  cells[10] = 'APPROVED';
}
translation(2, '11', '검수됨');
translation(5003, '10', '구판');
translation(10020, '11', '');
let largestSearch = 0;
const sheet = {
  getLastRow: () => rows.length,
  getRange: (start, column, count, width) => ({
    getDisplayValues: () => {
      largestSearch = Math.max(largestSearch, count);
      return rows.slice(start - 1, start - 1 + count).map(cells => cells.slice(column - 1, column - 1 + width));
    },
    getValues: () => rows.slice(start - 1, start - 1 + count).map(cells => cells.slice(column - 1, column - 1 + width)),
  }),
};
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../google-sheets-v2/Code.gs'), 'utf8'), context);
context.getSpreadsheet_ = () => ({ getSheetByName: () => sheet });
const exported = [];
assert.equal(context.forEachApprovedTranslation_(row => exported.push(row)), 1);
assert.equal(exported[0].translation, '검수됨');
assert.ok(largestSearch <= 5000, 'approved search must stay within a bounded window');
console.log('Bounded approved export checks passed');
