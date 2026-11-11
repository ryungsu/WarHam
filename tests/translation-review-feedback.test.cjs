const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
function codeBetween(start, end) {
  const from = app.indexOf(start), to = app.indexOf(end, from);
  assert.ok(from >= 0 && to > from);
  return app.slice(from, to);
}

test('AI draft button reports missing key, progress, and API errors', async () => {
  const status = { textContent: '', classList: { toggle() {} } };
  const button = { disabled: false };
  const review = { open: true };
  const token = { value: '' };
  const results = { querySelector(selector) {
    return selector === '[data-translation-progress]' ? status :
      selector === '[data-translate-all]' ? button :
      selector === '.translation-review' ? review : null;
  } };
  let calls = 0, rejectRequest;
  const context = vm.createContext({
    $: id => id === 'results' ? results : token,
    requestRuleDraft: () => { calls++; return new Promise((_, reject) => { rejectRequest = reject; }); },
    render: () => {}
  });
  vm.runInContext(codeBetween('let activeTranslationCandidates=', 'function requestRuleDraft(') +
    codeBetween('async function runTranslationReview(', 'function showDatasheetPortrait('), context);
  vm.runInContext('activeTranslationCandidates=[{draft:false}]', context);

  await context.runTranslationReview([0]);
  assert.match(status.textContent, /번역 저장 키가 없습니다/);
  assert.equal(calls, 0);

  token.value = 'test-key';
  const pending = context.runTranslationReview([0]);
  assert.match(status.textContent, /AI 초안 생성 중 · 1\/1건/);
  assert.equal(calls, 1);
  rejectRequest(new Error('Gemini HTTP 429'));
  await pending;
  assert.match(status.textContent, /중단: Gemini HTTP 429/);
});

test('completed review keeps its result visible after rerender', () => {
  const context = vm.createContext({translationReviewMessage:'AI 초안 저장 완료',translationReviewError:false,escapeHtml:value=>value});
  vm.runInContext(codeBetween('function renderTranslationReview(', 'let activeTranslationCandidates='),context);
  assert.match(context.renderTranslationReview({units:[]},true),/AI 초안 저장 완료/);
});
