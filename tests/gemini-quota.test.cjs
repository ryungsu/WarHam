const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const values = new Map([['GEMINI_MODEL', 'gemini-3.8-flash']]);
const props = {
  getProperty: key => values.get(key) || null,
  setProperty: (key, value) => values.set(key, value),
};
const context = {
  PropertiesService: { getScriptProperties: () => props },
  Utilities: { formatDate: () => '2026-11-09 18:00' },
  Session: { getScriptTimeZone: () => 'Asia/Seoul' },
  log_: () => {},
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../google-sheets-v2/Code.gs'), 'utf8'), context);
context.log_ = () => {};

let calls = 0;
context.callGemini_ = () => {
  calls++;
  const error = new Error('Gemini HTTP 429');
  error.status = 429;
  error.quotaIds = [];
  throw error;
};
assert.throws(() => context.callGeminiWithRetry_([], 'test-key'), /429/);
assert.equal(calls, 1, '429 must not be retried immediately');
assert.ok(context.geminiCooldownRemainingMs_() > 59 * 60000);
assert.throws(() => context.callGeminiWithRetry_([], 'test-key'), /한도 대기/);
assert.equal(calls, 1, 'cooldown must block later calls');

values.set('GEMINI_MODEL', 'another-model');
assert.equal(context.geminiCooldownRemainingMs_(), 0, 'changing models must clear this model’s cooldown');
console.log('Gemini quota checks passed');
