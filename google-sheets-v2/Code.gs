/**
 * WH40K translation pipeline prototype (V2).
 * Bind this Apps Script project to a Google Sheet and run setupSheets() once.
 * No API secret is stored in the spreadsheet or browser.
 */
const V2 = {
  edition: "11",
  repo: "https://raw.githubusercontent.com/BSData/wh40k-11e/main/",
  maxSourcesPerRun: 1,
  // Drain existing backlog before doing catalogue work. At 8 rows per request,
  // eight batches process up to 64 translations per trigger execution.
  aiBatchesPerRun: 8,
  rowsPerAiBatch: 8,
  softRunLimitMs: 240000,
  reserveRunTimeMs: 45000,
  maxSheetRowsPerRequest: 250,
  pendingScanWindowRows: 5000,
  maxPendingScanRowsPerRun: 25000,
  sourceSheet: "Sources",
  translationSheet: "Translations",
  glossarySheet: "Glossary",
  logSheet: "Run log",
  glossaryHeaders: ["English", "Korean", "Status", "Note"],
  glossarySeedRows: [
    ["Command phase", "지휘 페이즈", "APPROVED", "게임 단계"], ["Movement phase", "이동 페이즈", "APPROVED", "게임 단계"],
    ["Shooting phase", "사격 페이즈", "APPROVED", "게임 단계"], ["Charge phase", "돌격 페이즈", "APPROVED", "게임 단계"],
    ["Fight phase", "타격 페이즈", "APPROVED", "게임 단계"], ["Battle-shocked", "전투 충격 상태", "APPROVED", "상태"],
    ["wound", "운드", "APPROVED", "게임 용어"], ["hit roll", "명중 굴림", "APPROVED", "게임 용어"],
    ["wound roll", "운드 굴림", "APPROVED", "게임 용어"], ["saving throw", "방어 굴림", "APPROVED", "게임 용어"],
    ["Objective Control", "목표 장악", "APPROVED", "능력치"], ["Sustained Hits", "지속 명중", "APPROVED", "무기 능력"],
    ["Feel No Pain", "고통 경감", "APPROVED", "규칙"], ["Lethal Hits", "치명타 명중", "APPROVED", "무기 능력"],
    ["Devastating Wounds", "치명적인 상처", "APPROVED", "무기 능력"], ["Precision", "정밀 타격", "APPROVED", "무기 능력"],
    ["Torrent", "분사", "APPROVED", "무기 능력"], ["Ignores Cover", "엄폐 무시", "APPROVED", "무기 능력"],
    ["Assault", "강습", "APPROVED", "무기 능력"], ["Heavy", "중화기", "APPROVED", "무기 능력"],
    ["Pistol", "권총", "APPROVED", "무기 능력"], ["Twin-linked", "쌍연결", "APPROVED", "무기 능력"],
    ["Blast", "폭발", "APPROVED", "무기 능력"], ["Rapid Fire", "속사", "APPROVED", "무기 능력"],
    ["Melta", "멜타", "APPROVED", "무기 능력"], ["Infantry", "인팬트리", "APPROVED", "키워드"],
    ["Vehicle", "비히클", "APPROVED", "키워드"], ["Monster", "몬스터", "APPROVED", "키워드"]
  ],
  translationHeaders: ["Key", "Edition", "Faction", "Source file", "Source ID", "Kind", "Name EN", "Source EN", "Source hash", "Translation KO", "Status", "AI model", "Updated at", "Review note"],
  sourceHeaders: ["File", "Enabled", "Last revision", "Last synced", "Last error"],
  files: [
    "Aeldari - Aeldari Library.json", "Aeldari - Craftworlds.json", "Aeldari - Drukhari.json",
    "Chaos - Chaos Daemons Library.json", "Chaos - Chaos Daemons.json", "Chaos - Chaos Knights Library.json", "Chaos - Chaos Knights.json", "Chaos - Chaos Space Marines.json", "Chaos - Death Guard.json", "Chaos - Emperor's Children.json", "Chaos - Thousand Sons.json", "Chaos - Titanicus Traitoris.json", "Chaos - World Eaters.json",
    "Genestealer Cults.json", "Imperium - Adepta Sororitas.json", "Imperium - Adeptus Custodes.json", "Imperium - Adeptus Mechanicus.json", "Imperium - Adeptus Titanicus.json", "Imperium - Agents of the Imperium.json", "Imperium - Astra Militarum - Library.json", "Imperium - Astra Militarum.json", "Imperium - Black Templars.json", "Imperium - Blood Angels.json", "Imperium - Dark Angels.json", "Imperium - Deathwatch.json", "Imperium - Grey Knights.json", "Imperium - Imperial Fists.json", "Imperium - Imperial Knights - Library.json", "Imperium - Imperial Knights.json", "Imperium - Iron Hands.json", "Imperium - Raven Guard.json", "Imperium - Salamanders.json", "Imperium - Space Marines.json", "Imperium - Space Wolves.json", "Imperium - Ultramarines.json", "Imperium - White Scars.json",
    "Leagues of Votann.json", "Necrons.json", "Orks.json", "T'au Empire.json", "Tyranids.json", "Unaligned Forces.json"
  ]
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu("40K 번역 V2")
    .addItem("시트 준비", "setupSheets")
    .addItem("BSData 동기화 + AI 번역", "runV2Pipeline")
    .addItem("번역 우선 대상 선택", "showTranslationPriorityDialog")
    .addItem("번역 검색 시작 행 지정", "setTranslationSearchStartRow")
    .addItem("선택 행 검수 완료", "approveSelectedRows")
    .addItem("검수 완료 JSON 내보내기", "exportApprovedJson")
    .addItem("웹 앱 번역 저장 키 표시/생성", "showWebWriteToken")
    .addSeparator()
    .addItem("매일 자동 실행 켜기", "installDailyTrigger")
    .addItem("대기 번역 자동 처리 (15분마다)", "installFrequentTrigger")
    .addItem("자동 실행 끄기", "removeDailyTrigger")
    .addToUi();
}

function showWebWriteToken() {
  const props = PropertiesService.getScriptProperties();
  let token = props.getProperty("V2_WEB_WRITE_TOKEN");
  if (!token) {
    token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
    props.setProperty("V2_WEB_WRITE_TOKEN", token);
  }
  SpreadsheetApp.getUi().alert("WarHam 웹 앱 번역 저장 키", "이 키를 앱의 ‘번역 저장 키’ 칸에 입력하세요. 이 키는 공개 저장소에 올리지 말고, 다른 사람에게 공유하지 마세요.\n\n" + token, SpreadsheetApp.getUi().ButtonSet.OK);
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, V2.sourceSheet, V2.sourceHeaders, V2.files.map(file => [file, true, "", "", ""]));
  ensureSheet_(ss, V2.translationSheet, V2.translationHeaders, []);
  ensureSheet_(ss, V2.glossarySheet, V2.glossaryHeaders, V2.glossarySeedRows);
  ensureSheet_(ss, V2.logSheet, ["Timestamp", "Action", "Result", "Details"], []);
  PropertiesService.getScriptProperties().setProperty("V2_SPREADSHEET_ID", ss.getId());
  SpreadsheetApp.getUi().alert("시트 준비 완료. Script Properties에 GEMINI_API_KEY를 입력한 다음 ‘BSData 동기화 + AI 번역’을 실행하세요.");
}

function showTranslationPriorityDialog() {
  const sources = getTranslationSourceChoices_();
  if (!sources.length) throw new Error("Sources 시트에 원문 파일이 없습니다. 먼저 시트 준비를 실행하세요.");
  let selected = [];
  try { selected = JSON.parse(PropertiesService.getScriptProperties().getProperty("V2_PRIORITY_SOURCE_FILES") || "[]"); } catch (_) {}
  const options = sources.map(source => {
    const label = `${escapeHtml_(source.file)}${source.enabled ? "" : " · 동기화 꺼짐"}`;
    const isChecked = selected.includes(source.file) ? " checked" : "";
    return `<label class="choice"><input type="checkbox" name="sourceFile" value="${escapeHtml_(source.file)}"${isChecked}> <span>${label}</span></label>`;
  }).join("");
  const html = HtmlService.createHtmlOutput(`<!doctype html><html><head><base target="_top"><style>
    body{font:14px Arial,sans-serif;padding:16px;color:#202124}.list{box-sizing:border-box;height:170px;overflow:auto;border:1px solid #dadce0;border-radius:4px;padding:6px 10px}.choice{display:flex;align-items:flex-start;gap:7px;padding:5px 0;font-weight:400}.choice input{margin-top:2px}.choice span{overflow-wrap:anywhere}p{color:#5f6368;line-height:1.45}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}button{padding:8px 14px;cursor:pointer}#status{min-height:18px;color:#1a73e8}
    </style></head><body><strong>우선 번역할 원문 파일</strong><div class="list">${options}</div><p>선택한 파일들의 11판 대기 번역을 먼저 처리합니다. 선택하지 않으면 전체 대기열 순서로 처리합니다.</p><div id="status"></div><div class="actions"><button onclick="google.script.host.close()">취소</button><button id="save">선택 저장</button></div><script>
    document.getElementById("save").addEventListener("click",function(){
      const button=this;button.disabled=true;document.getElementById("status").textContent="저장 중…";
      const files=Array.from(document.querySelectorAll('input[name="sourceFile"]:checked')).map(function(input){return input.value;});
      google.script.run.withSuccessHandler(function(message){document.getElementById("status").textContent=message;setTimeout(function(){google.script.host.close();},700);})
        .withFailureHandler(function(error){document.getElementById("status").textContent=error.message||String(error);button.disabled=false;})
        .saveTranslationPrioritySourceFiles(files);
    });
    </script></body></html>`).setWidth(520).setHeight(390);
  SpreadsheetApp.getUi().showModalDialog(html, "번역 우선 대상");
}

function saveTranslationPrioritySourceFiles(files) {
  files = Array.isArray(files) ? [...new Set(files.map(file => String(file || "").trim()).filter(Boolean))] : [];
  const sources = getTranslationSourceChoices_();
  const knownFiles = new Set(sources.map(source => source.file));
  if (files.some(file => !knownFiles.has(file))) throw new Error("Sources 시트에서 파일을 찾지 못했습니다. 목록을 새로 열어 선택해 주세요.");
  const props = PropertiesService.getScriptProperties();
  if (files.length) props.setProperty("V2_PRIORITY_SOURCE_FILES", JSON.stringify(files));
  else props.deleteProperty("V2_PRIORITY_SOURCE_FILES");
  props.deleteProperty("V2_PRIORITY_SCAN_CURSOR");
  props.deleteProperty("V2_PRIORITY_SCAN_PROGRESS");
  props.deleteProperty("V2_PRIORITY_SCAN_TOTAL");
  props.deleteProperty("V2_PRIORITY_CLEAR_FILES");
  props.deleteProperty("V2_PRIORITY_CLEAR_LAST_ROW");
  return files.length ? `우선 대상 ${files.length}개 저장` : "우선 대상 해제: 전체 대기열 순서로 처리합니다.";
}

function setTranslationSearchStartRow() {
  const ui = SpreadsheetApp.getUi(), sheet = getSpreadsheet_().getSheetByName(V2.translationSheet);
  if (!sheet || sheet.getLastRow() < 2) throw new Error("Translations 시트에 검색할 데이터가 없습니다.");
  const response = ui.prompt(
    "번역 검색 시작 행 지정",
    `Translations 시트의 행 번호를 입력하세요 (2~${sheet.getLastRow()}). 이 행부터 대기 번역을 검색합니다.`,
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  const raw = response.getResponseText().trim();
  if (!/^\d+$/.test(raw)) throw new Error("행 번호는 숫자로 입력해 주세요.");
  const row = Number(raw);
  if (!Number.isSafeInteger(row) || row < 2 || row > sheet.getLastRow()) throw new Error(`행 번호는 2~${sheet.getLastRow()} 사이여야 합니다.`);
  const props = PropertiesService.getScriptProperties();
  props.setProperty("V2_PENDING_SCAN_CURSOR", String(row));
  props.setProperty("V2_PRIORITY_SCAN_CURSOR", String(row));
  props.deleteProperty("V2_PRIORITY_SCAN_PROGRESS");
  props.deleteProperty("V2_PRIORITY_SCAN_TOTAL");
  props.deleteProperty("V2_PRIORITY_CLEAR_FILES");
  props.deleteProperty("V2_PRIORITY_CLEAR_LAST_ROW");
  log_("translate", "검색 위치 변경", `Translations ${row}행부터 검색하도록 지정`);
  ui.alert(`다음 실행부터 ${row}행에서 대기 번역 검색을 시작합니다.`);
}

function getTranslationSourceChoices_() {
  const sheet = getSpreadsheet_().getSheetByName(V2.sourceSheet);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getDisplayValues()
    .filter(row => String(row[0] || "").trim())
    .map(row => ({ file: String(row[0]).trim(), enabled: !["false", "0", "no"].includes(String(row[1]).trim().toLowerCase()) }));
}

function escapeHtml_(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function ensureSheet_(ss, name, headers, seedRows) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    if (seedRows.length) sheet.getRange(2, 1, seedRows.length, headers.length).setValues(seedRows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  } else if (name === V2.sourceSheet && seedRows.length) {
    const existingFiles = new Set((sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat() : []).filter(Boolean).map(String));
    const missingRows = seedRows.filter(row => !existingFiles.has(String(row[0])));
    if (missingRows.length) sheet.getRange(sheet.getLastRow() + 1, 1, missingRows.length, headers.length).setValues(missingRows);
  } else if (name === V2.glossarySheet && seedRows.length) {
    const englishColumn = headers.indexOf("English") + 1;
    const existingTerms = new Set((sheet.getLastRow() > 1 ? sheet.getRange(2, englishColumn, sheet.getLastRow() - 1, 1).getValues().flat() : []).filter(Boolean).map(value => String(value).trim().toLowerCase()));
    const missingRows = seedRows.filter(row => !existingTerms.has(String(row[0]).trim().toLowerCase()));
    if (missingRows.length) sheet.getRange(sheet.getLastRow() + 1, 1, missingRows.length, headers.length).setValues(missingRows);
  }
  return sheet;
}

function runV2Pipeline() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return log_("pipeline", "skipped", "다른 실행이 진행 중입니다.");
  const startedAt = Date.now(), deadline = startedAt + V2.softRunLimitMs;
  try {
    log_("pipeline", "시작", `번역 배치 최대 ${V2.aiBatchesPerRun}개 · 원문 파일 최대 ${V2.maxSourcesPerRun}개`);

    // Translation backlog is the user's current priority. Process and persist it
    // before fetching/parsing a potentially large catalogue, so a slow sync
    // cannot consume the whole execution before any translations are written.
    const translation = Date.now() < deadline - V2.reserveRunTimeMs
      ? translatePendingBatch_(deadline)
      : { done: 0, selected: 0, scanned: 0 };
    log_("translate", "실행 결과", `번역 ${translation.done}개 · 대상 ${translation.selected}개 · ${translation.queue || "대기열"} 검색 ${translation.startRow || "-"}~${translation.endRow || "-"}행 (${translation.scanned}행 확인, 다음 시작 ${translation.nextRow || "-"}행)`);

    let synced = { files: 0, added: 0 }, syncError = "";
    if (Date.now() < deadline - V2.reserveRunTimeMs) {
      try {
        synced = syncSourceBatch_();
        log_("sync", "완료", `원문 파일 ${synced.files}개 확인 · 신규/변경 문장 ${synced.added}개`);
      } catch (err) {
        syncError = String(err && err.message || err);
        log_("sync", "오류 · 번역은 저장됨", syncError);
      }
    } else {
      log_("sync", "다음 실행으로 이월", "번역 대기열 처리를 우선 완료해 원문 동기화를 다음 실행으로 넘겼습니다.");
    }
    log_("pipeline", syncError ? "부분 완료" : "완료", `AI 번역 ${translation.done}개 · 확인 대상 ${translation.selected}개 · 스캔 ${translation.scanned}행 · 원문 파일 ${synced.files}개 확인, 신규/변경 문장 ${synced.added}개${syncError ? ` · 동기화 오류: ${syncError}` : ""}`);
  } catch (err) {
    log_("pipeline", "오류", String(err && err.stack || err));
    throw err;
  } finally {
    lock.releaseLock();
  }
}

function syncSourceBatch_() {
  const ss = getSpreadsheet_(), sourceSheet = ss.getSheetByName(V2.sourceSheet), transSheet = ss.getSheetByName(V2.translationSheet);
  if (!sourceSheet || !transSheet) throw new Error("먼저 메뉴에서 시트 준비를 실행하세요.");
  const sourceRows = sourceSheet.getDataRange().getValues().slice(1).map((values, index) => ({ values, rowNumber: index + 2 })).filter(row => row.values[0] && row.values[1] !== false);
  if (!sourceRows.length) return { files: 0, added: 0 };
  const props = PropertiesService.getScriptProperties();
  const start = Number(props.getProperty("V2_SOURCE_CURSOR") || 0) % sourceRows.length;
  const batch = Array.from({ length: Math.min(V2.maxSourcesPerRun, sourceRows.length) }, (_, i) => sourceRows[(start + i) % sourceRows.length]);
  const now = new Date();
  let okFiles = 0;
  let added = 0;
  batch.forEach(configRow => {
    const file = String(configRow.values[0]);
    try {
      log_("sync", "파일 동기화 시작", `${file} · Sources ${configRow.rowNumber}행`);
      const response = UrlFetchApp.fetch(V2.repo + encodeURIComponent(file), { muteHttpExceptions: true, followRedirects: true });
      if (response.getResponseCode() !== 200) throw new Error(`HTTP ${response.getResponseCode()}`);
      const fileAdded = syncOneSourceFile_(response, file, configRow, transSheet, sourceSheet, now);
      okFiles++;
      added += fileAdded;
      // Advance only after this file has been completely synchronized.
      props.setProperty("V2_SOURCE_CURSOR", String((start + 1) % sourceRows.length));
    } catch (err) {
      sourceSheet.getRange(configRow.rowNumber, 5).setValue(String(err.message || err));
      log_("sync", "파일 오류", `${file}: ${err.message || err}`);
      // Do not advance the cursor on failure; retry this source next run.
      throw err;
    }
  });
  return { files: okFiles, added };
}

// Keep only one downloaded catalogue and its parsed record map alive at a time.
function syncOneSourceFile_(response, file, configRow, transSheet, sourceSheet, now) {
  const data = JSON.parse(response.getContentText()), root = data.catalogue || data, revision = String(root.revision || "unknown");
  const unchanged = String(configRow.values[2] || "") === revision && Boolean(configRow.values[2]);
  if (unchanged) {
    sourceSheet.getRange(configRow.rowNumber, 3, 1, 3).setValues([[revision, now, ""]]);
    return 0;
  }

  const records = collectRecords_(data, file);
  log_("sync", "기존 행 대조 시작", `${file} · 원문 레코드 ${records.length}개 · Translations ${transSheet.getLastRow()}행 대상`);
  const existing = readExistingSourceRows_(transSheet, [file]);
  log_("sync", "기존 행 대조 완료", `${file} · 기존 레코드 ${existing.length}개`);
  const current = new Map(), duplicates = [];
  existing.forEach(candidate => {
    if (!candidate.key || candidate.status === "SUPERSEDED") return;
    const sourceKey = [candidate.edition, candidate.file, candidate.sourceId, candidate.kind].join("|");
    const prior = current.get(sourceKey);
    if (!prior) { current.set(sourceKey, candidate); return; }
    const rank = status => status === "APPROVED" ? 3 : status === "AI_DRAFT" ? 2 : 1;
    const keepPrior = rank(prior.status) > rank(candidate.status);
    duplicates.push(keepPrior ? candidate.row : prior.row);
    if (!keepPrior) current.set(sourceKey, candidate);
  });
  const append = [], supersede = [];
  for (const record of records) {
    const sourceHash = sha256_([record.name, record.source].join("\n")), key = [V2.edition, file, record.id, record.kind].join("|");
    const prior = current.get(key);
    if (prior && prior.hash === sourceHash) continue;
    if (prior) supersede.push(prior.row);
    append.push([key + "|" + sourceHash.slice(0, 12), V2.edition, factionForFile_(file), file, record.id, record.kind, record.name, record.source, sourceHash, "", "PENDING", "", now, prior ? "원문이 바뀌어 재번역 대기" : ""]);
  }
  writeStatusRows_(transSheet, [...duplicates, ...supersede], 11, "SUPERSEDED");
  if (duplicates.length || supersede.length) clearApprovedTranslationCache_();
  appendRowsInChunks_(transSheet, transSheet.getLastRow() + 1, 1, append, V2.translationHeaders.length);
  sourceSheet.getRange(configRow.rowNumber, 3, 1, 3).setValues([[revision, now, ""]]);
  return append.length;
}

function collectRecords_(root, file) {
  const found = new Map(), seen = new WeakSet();
  function visit(node, parentKey) {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) { node.forEach(item => visit(item, parentKey)); return; }
    const name = String(node.name || node.baseName || "").trim();
    const id = String(node.id || node.targetId || "").trim();
    const profileType = String(node.typeName || "");
    const descChar = (node.characteristics || []).find(c => String(c.name).toLowerCase() === "description");
    const source = cleanText_(node.description || node.ruleDescription || (descChar && (descChar["$text"] || descChar.text)) || "");
    const parent = String(parentKey || "").toLowerCase();
    const isRule = /rules?|sharedrules|sharedprofiles|infolinks/.test(parent);
    const isAbility = /abilit|psychic|wargear|weapon/i.test(profileType);
    const isNamedEntry = /selectionentries|sharedselectionentries|selectionentrygroups/.test(parent);
    const labelEligible = isNamedEntry || profileType || isRule || isAbility;
    const kind = source ? (isAbility ? "ability" : isRule ? "rule" : profileType ? "profile" : "rule") : (labelEligible ? "label" : "");
    const recordId = id || sha256_([kind, name, source].join("|")).slice(0, 24);
    const addRecord = (rid, recordKind, text) => {
      if (!name || !text || !/[A-Za-z]/.test(text)) return;
      const record = { id: rid, kind: recordKind, name, source: text };
      found.set([rid, recordKind, sha256_(text)].join("|"), record);
    };
    if (source) addRecord(recordId, kind, source);
    if (name && labelEligible && (!source || name.toLowerCase() !== source.toLowerCase())) addRecord(`${recordId}:name`, "label", name);
    Object.keys(node).forEach(key => { if (key !== "$schema") visit(node[key], key); });
  }
  visit(root, "root");
  return [...found.values()];
}

function translatePendingBatch_(deadline) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) {
    log_("translate", "건너뜀", "Script Properties에 GEMINI_API_KEY가 없습니다.");
    return { done: 0, selected: 0, scanned: 0 };
  }
  const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet);
  const limit = V2.aiBatchesPerRun * V2.rowsPerAiBatch;
  const scan = findPendingTranslationRows_(sheet, limit);
  const pending = scan.items;
  if (!pending.length) return { done: 0, selected: 0, scanned: scan.scanned, startRow: scan.startRow, endRow: scan.endRow, nextRow: scan.nextRow, queue: scan.queue };
  let done = 0;
  for (let offset = 0; offset < pending.length; offset += V2.rowsPerAiBatch) {
    if (deadline && Date.now() >= deadline - V2.reserveRunTimeMs) break;
    const batch = pending.slice(offset, offset + V2.rowsPerAiBatch);
    try {
      const itemNames = batch.map(item => String(item.name || "").replace(/\s+/g, " ").slice(0, 70)).join(" · ");
      log_("translate", "Gemini 배치 시작", `${offset + 1}~${offset + batch.length}/${pending.length}개 · ${batch[0].row}~${batch[batch.length - 1].row}행 · ${itemNames}`);
      const outputs = callGeminiWithRetry_(batch, apiKey), byIndex = new Map(outputs.map(x => [Number(x.i), x.ko]));
      const model = PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") || "gemini-3.8-flash", now = new Date(), writes = batch.map((item, i) => ({ row: item.row, values: [String(byIndex.get(i) || "").trim(), "AI_DRAFT", model, now, "검수 후 APPROVED로 변경"] })).filter(item => item.values[0]);
      const translationStartColumn = V2.translationHeaders.indexOf("Translation KO") + 1;
      writeTranslationDrafts_(sheet, writes, translationStartColumn);
      done += writes.length;
      log_("translate", "Gemini 배치 완료", `${writes.length}/${batch.length}개 저장 · ${batch[0].row}~${batch[batch.length - 1].row}행`);
    } catch (err) { log_("translate", "배치 오류 · 대기 유지", String(err.message || err)); break; }
  }
  return { done, selected: pending.length, scanned: scan.scanned, startRow: scan.startRow, endRow: scan.endRow, nextRow: scan.nextRow, queue: scan.queue };
}

function writeTranslationDrafts_(sheet, writes, startColumn) {
  const rows = [...writes].sort((a, b) => a.row - b.row);
  for (let i = 0; i < rows.length;) {
    let end = i + 1;
    while (end < rows.length && rows[end].row === rows[end - 1].row + 1 && end - i < V2.maxSheetRowsPerRequest) end++;
    sheet.getRange(rows[i].row, startColumn, end - i, 5).setValues(rows.slice(i, end).map(item => item.values));
    i = end;
  }
}

// Prefer the user-selected source file. When that queue has been scanned once
// without a PENDING row, skip the priority scan until the sheet grows or the
// user changes the selection.
function findPriorityTranslationRows_(sheet, limit) {
  const props = PropertiesService.getScriptProperties();
  let selectedFiles = [];
  try { selectedFiles = JSON.parse(props.getProperty("V2_PRIORITY_SOURCE_FILES") || "[]"); } catch (_) {}
  if (!Array.isArray(selectedFiles) || !selectedFiles.length || !sheet || sheet.getLastRow() < 2) return { items: [], scanned: 0, completeCycle: true };
  selectedFiles = [...new Set(selectedFiles.map(file => String(file || "").trim()).filter(Boolean))];
  if (!selectedFiles.length) return { items: [], scanned: 0, completeCycle: true };
  const selectedFilesKey = JSON.stringify(selectedFiles);
  const lastRow = sheet.getLastRow(), totalRows = lastRow - 1;
  const fileCol = V2.translationHeaders.indexOf("Source file") + 1;
  const editionCol = V2.translationHeaders.indexOf("Edition") + 1;
  const kindCol = V2.translationHeaders.indexOf("Kind") + 1;
  const statusCol = V2.translationHeaders.indexOf("Status") + 1;
  if (props.getProperty("V2_PRIORITY_CLEAR_FILES") === selectedFilesKey && Number(props.getProperty("V2_PRIORITY_CLEAR_LAST_ROW")) === lastRow) {
    return { items: [], scanned: 0, completeCycle: true };
  }
  const priorityFiles = new Set(selectedFiles);
  let cursor = Number(props.getProperty("V2_PRIORITY_SCAN_CURSOR") || 2);
  if (!Number.isFinite(cursor) || cursor < 2 || cursor > lastRow) cursor = 2;
  const startRow = cursor, scanBudget = Math.min(V2.maxPendingScanRowsPerRun, totalRows);
  const savedTotal = Number(props.getProperty("V2_PRIORITY_SCAN_TOTAL") || 0);
  let cycleProgress = savedTotal === totalRows ? Number(props.getProperty("V2_PRIORITY_SCAN_PROGRESS") || 0) : 0;
  const selectedNonLabelRows = [], selectedLabelRows = [];
  let scanned = 0;
  while (scanned < scanBudget && selectedNonLabelRows.length < limit) {
    const count = Math.min(V2.pendingScanWindowRows, lastRow - cursor + 1, scanBudget - scanned);
    if (count <= 0) { cursor = 2; continue; }
    const editions = sheet.getRange(cursor, editionCol, count, 1).getDisplayValues();
    const files = sheet.getRange(cursor, fileCol, count, 1).getDisplayValues();
    const kinds = sheet.getRange(cursor, kindCol, count, 1).getDisplayValues();
    const statuses = sheet.getRange(cursor, statusCol, count, 1).getDisplayValues();
    let consumed = 0;
    for (let i = 0; i < count; i++) {
      consumed = i + 1;
      if (String(editions[i][0]).trim() === String(V2.edition) && priorityFiles.has(String(files[i][0]).trim()) && String(statuses[i][0]).trim() === "PENDING") {
        const rowNumber = cursor + i;
        if (String(kinds[i][0]).trim().toLowerCase() === "label") selectedLabelRows.push(rowNumber);
        else selectedNonLabelRows.push(rowNumber);
      }
      if (selectedNonLabelRows.length >= limit) break;
    }
    scanned += consumed;
    cursor += consumed;
    if (cursor > lastRow) cursor = 2;
  }
  const selectedRows = selectedNonLabelRows.concat(selectedLabelRows).slice(0, limit);
  cycleProgress += scanned;
  const completeCycle = cycleProgress >= totalRows;
  if (completeCycle) cycleProgress -= totalRows;
  props.setProperty("V2_PRIORITY_SCAN_CURSOR", String(cursor));
  props.setProperty("V2_PRIORITY_SCAN_PROGRESS", String(cycleProgress));
  props.setProperty("V2_PRIORITY_SCAN_TOTAL", String(totalRows));
  if (completeCycle && !selectedRows.length) {
    props.setProperty("V2_PRIORITY_CLEAR_FILES", selectedFilesKey);
    props.setProperty("V2_PRIORITY_CLEAR_LAST_ROW", String(lastRow));
  }
  const items = readTranslationWindows_(sheet, selectedRows, 2, 9).map(({ row, values }) => ({
    row, edition: String(values[0] || ""), faction: values[1], kind: values[4], name: values[5], source: values[6]
  })).filter(item => item.edition === String(V2.edition) && item.source);
  return { items, scanned, completeCycle, startRow, endRow: scanned ? (cursor === 2 ? lastRow : cursor - 1) : 0, nextRow: cursor, queue: "선택 파일" };
}

// Scan bounded Edition and Status columns with a saved cursor. A TextFinder
// limited to the first N PENDING cells can repeatedly hit old-edition rows and
// report zero eligible 11e translations even when thousands remain below.
function findPendingTranslationRows_(sheet, limit) {
  const priority = findPriorityTranslationRows_(sheet, limit);
  if (priority.items.length || !priority.completeCycle) return priority;
  if (!sheet || sheet.getLastRow() < 2) return { items: [], scanned: 0 };
  const lastRow = sheet.getLastRow();
  const props = PropertiesService.getScriptProperties();
  let cursor = Number(props.getProperty("V2_PENDING_SCAN_CURSOR") || 2);
  if (!Number.isFinite(cursor) || cursor < 2 || cursor > lastRow) cursor = 2;
  const startRow = cursor;
  const statusCol = V2.translationHeaders.indexOf("Status") + 1;
  const kindCol = V2.translationHeaders.indexOf("Kind") + 1;
  const nonLabelRows = [], labelRows = [];
  let scanned = 0;
  const scanBudget = Math.min(V2.maxPendingScanRowsPerRun, lastRow - 1);
  while (scanned < scanBudget && nonLabelRows.length < limit) {
    const count = Math.min(V2.pendingScanWindowRows, lastRow - cursor + 1, scanBudget - scanned);
    if (count <= 0) { cursor = 2; continue; }
    const editions = sheet.getRange(cursor, 2, count, 1).getDisplayValues();
    const kinds = sheet.getRange(cursor, kindCol, count, 1).getDisplayValues();
    const statuses = sheet.getRange(cursor, statusCol, count, 1).getDisplayValues();
    let consumed = 0;
    for (let i = 0; i < count; i++) {
      consumed = i + 1;
      if (String(editions[i][0]).trim() === String(V2.edition) && String(statuses[i][0]).trim() === "PENDING") {
        const rowNumber = cursor + i;
        if (String(kinds[i][0]).trim().toLowerCase() === "label") labelRows.push(rowNumber);
        else nonLabelRows.push(rowNumber);
      }
      if (nonLabelRows.length >= limit) break;
    }
    scanned += consumed;
    cursor += consumed;
    if (cursor > lastRow) cursor = 2;
  }
  const rowNumbers = nonLabelRows.concat(labelRows).slice(0, limit);
  props.setProperty("V2_PENDING_SCAN_CURSOR", String(cursor));
  const items = readTranslationWindows_(sheet, rowNumbers, 2, 9).map(({ row, values }) => ({
    row, edition: String(values[0] || ""), faction: values[1], kind: values[4], name: values[5], source: values[6]
  })).filter(item => item.edition === String(V2.edition) && item.source);
  return { items, scanned, startRow, endRow: scanned ? (cursor === 2 ? lastRow : cursor - 1) : 0, nextRow: cursor, queue: "전체" };
}

function readExistingSourceRows_(sheet, files) {
  const lastRow = sheet.getLastRow();
  if (!files.length || lastRow < 2) return [];
  const fileCol = V2.translationHeaders.indexOf("Source file") + 1;
  const wanted = new Set(files), matches = [];
  files.forEach(file => {
    const finder = sheet.getRange(2, fileCol, lastRow - 1, 1).createTextFinder(file).matchCase(true).matchEntireCell(true);
    let cell;
    while ((cell = finder.findNext())) matches.push(cell.getRow());
  });
  return readTranslationWindows_(sheet, matches, 2, 10)
    .map(({ row, values }) => ({
      row, edition: values[0], file: values[2], sourceId: values[3], kind: values[4],
      hash: values[7], status: values[9], key: values[0] && values[2] && values[3] && values[4]
    })).filter(item => wanted.has(String(item.file)) && item.key);
}

// Read sorted row numbers in small contiguous windows so sparse hits do not
// cause a large rectangular getRange transfer.
function readTranslationWindows_(sheet, rowNumbers, startColumn, width) {
  const rows = [...new Set(rowNumbers)].sort((a, b) => a - b), result = [];
  for (let i = 0; i < rows.length;) {
    let end = i + 1;
    while (end < rows.length && rows[end] - rows[end - 1] <= 20 && rows[end] - rows[i] < V2.maxSheetRowsPerRequest) end++;
    const startRow = rows[i], lastRow = rows[end - 1];
    const values = sheet.getRange(startRow, startColumn, lastRow - startRow + 1, width).getValues();
    for (let j = i; j < end; j++) result.push({ row: rows[j], values: values[rows[j] - startRow] });
    i = end;
  }
  return result;
}

function regexEscape_(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function appendRowsInChunks_(sheet, startRow, startColumn, rows, width) {
  const size = V2.maxSheetRowsPerRequest;
  for (let offset = 0; offset < rows.length; offset += size) {
    const chunk = rows.slice(offset, offset + size);
    sheet.getRange(startRow + offset, startColumn, chunk.length, width).setValues(chunk);
  }
}

function approvedTranslationRows_() {
  const cache = CacheService.getScriptCache(), cacheKey = "V2_APPROVED_TRANSLATIONS_11E_V2";
  try {
    const cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const statusCol = V2.translationHeaders.indexOf("Status") + 1;
  const matches = sheet.getRange(2, statusCol, sheet.getLastRow() - 1, 1)
    .createTextFinder("APPROVED").matchCase(true).matchEntireCell(true).findAll();
  const rows = readTranslationWindows_(sheet, matches.map(cell => cell.getRow()), 2, 9)
    .map(({ values }) => ({ edition: values[0], faction: values[1], file: values[2], id: values[3], kind: values[4], name: values[5], source: values[6], hash: values[7], translation: values[8] }))
    .filter(row => String(row.edition) === String(V2.edition) && row.translation);
  try {
    const serialized = JSON.stringify(rows);
    if (serialized.length <= 90000) cache.put(cacheKey, serialized, 300);
  } catch (_) {}
  return rows;
}

function clearApprovedTranslationCache_() {
  try { CacheService.getScriptCache().removeAll(["V2_APPROVED_TRANSLATIONS_V1", "V2_APPROVED_TRANSLATIONS_11E_V2", "V2_APPROVED_LABEL_GLOSSARY_V1"]); } catch (_) {}
}

function findExactValueRow_(sheet, column, value) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const matches = sheet.getRange(2, column, lastRow - 1, 1).createTextFinder(String(value))
    .matchCase(true).matchEntireCell(true).findAll();
  return matches.length ? matches[matches.length - 1].getRow() : -1;
}

function callGemini_(batch, apiKey) {
  const model = PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") || "gemini-3.8-flash";
  const glossary = approvedGlossary_();
  const items = batch.map((x, i) => ({ i, edition: V2.edition, faction: x.faction, kind: x.kind, name: x.name, text: x.source }));
  const corpus = items.map(item => item.name + " " + item.text).join(" ").toLowerCase();
  const relevantGlossary = glossary.filter(entry => corpus.includes(entry.en.toLowerCase()));
  const prompt = "You are a specialist Korean localizer for Warhammer 40,000 rules. Translate these 11th-edition BSData catalogue records from English to Korean. Treat the English as authoritative rules text. Translate every sentence and clause; never summarize, omit, add advice, or invent rules. Preserve all numbers, dice expressions, ranges, measurements, named phases, conditions, exceptions, and cause/effect relationships exactly. Use the APPROVED glossary mappings verbatim and consistently; do not translate proper names or game terms differently from the glossary. For rules/ability records, write clear Korean rules text while retaining the exact mechanics. For labels/names, return only a concise Korean rendering; the app presents English alongside it. Keep weapon and datasheet names transliterated consistently. Return exactly one result for every input index, no duplicates or missing indexes, and Korean text in every ko field. Return only JSON matching the required schema. Relevant approved glossary: " + JSON.stringify(relevantGlossary) + ". Inputs: " + JSON.stringify(items);
  const response = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "post", contentType: "application/json", muteHttpExceptions: true,
    headers: { "x-goog-api-key": apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { i: { type: "INTEGER" }, ko: { type: "STRING" } }, required: ["i", "ko"] } } } })
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error(`Gemini HTTP ${response.getResponseCode()}: ${response.getContentText().slice(0, 400)}`);
  const body = JSON.parse(response.getContentText()), text = body.candidates[0].content.parts.map(p => p.text || "").join("");
  const outputs = JSON.parse(text);
  if (!Array.isArray(outputs) || outputs.length !== batch.length) throw new Error("Gemini 응답의 번역 항목 수가 입력과 다릅니다.");
  const indexes = new Set();
  for (const output of outputs) {
    if (!Number.isInteger(output.i) || output.i < 0 || output.i >= batch.length || indexes.has(output.i) || typeof output.ko !== "string" || !output.ko.trim()) throw new Error("Gemini 응답의 인덱스 또는 번역문을 검증하지 못했습니다.");
    indexes.add(output.i);
  }
  if (indexes.size !== batch.length) throw new Error("Gemini 응답에 누락된 번역 항목이 있습니다.");
  return outputs;
}

function approvedGlossary_() {
  const entries = new Map(), ss = getSpreadsheet_(), glossarySheet = ss.getSheetByName(V2.glossarySheet);
  if (glossarySheet && glossarySheet.getLastRow() > 1) {
    const rows = glossarySheet.getDataRange().getValues(), headers = rows.shift(), ix = name => headers.indexOf(name);
    rows.filter(row => String(row[ix("Status")]).trim().toUpperCase() === "APPROVED" && row[ix("English")] && row[ix("Korean")])
      .forEach(row => entries.set(String(row[ix("English")]).trim().toLowerCase(), { en: String(row[ix("English")]).trim(), ko: String(row[ix("Korean")]).trim(), context: String(row[ix("Note")]||"").trim() }));
  }
  approvedLabelGlossary_().forEach(entry => {
    const key = entry.en.toLowerCase();
    if (!entries.has(key)) entries.set(key, entry);
  });
  return [...entries.values()];
}

function approvedLabelGlossary_() {
  const cache = CacheService.getScriptCache(), cacheKey = "V2_APPROVED_LABEL_GLOSSARY_V1";
  try {
    const cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet);
  if (!sheet || sheet.getLastRow() < 2) return [];
  // Avoid findAll() over the entire 700k+ row sheet: retain only a bounded
  // recent window of approved label translations needed as translation context.
  const lastRow = sheet.getLastRow(), windowSize = 5000, maxScan = 25000, entries = [];
  for (let endRow = lastRow; endRow >= 2 && lastRow - endRow < maxScan && entries.length < 2000; endRow -= windowSize) {
    const startRow = Math.max(2, endRow - windowSize + 1), count = endRow - startRow + 1;
    const values = sheet.getRange(startRow, 2, count, 10).getDisplayValues(); // Edition..Status
    for (let i = values.length - 1; i >= 0 && entries.length < 2000; i--) {
      const row = values[i], edition = String(row[0] || "").trim(), kind = String(row[4] || "").trim(), name = String(row[5] || "").trim();
      const translation = String(row[8] || "").trim(), status = String(row[9] || "").trim();
      if (edition === String(V2.edition) && kind === "label" && status === "APPROVED" && name && translation) entries.push({ en: name, ko: translation, context: "검수 완료 데이터시트 용어" });
    }
  }
  try {
    const serialized = JSON.stringify(entries);
    if (serialized.length <= 90000) cache.put(cacheKey, serialized, 300);
  } catch (_) {}
  return entries;
}

function callGeminiWithRetry_(batch, apiKey) {
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try { return callGemini_(batch, apiKey); }
    catch (err) {
      const message = String(err && err.message || err);
      const retryable = /Gemini HTTP (408|429|500|502|503|504)\b/.test(message);
      if (!retryable || attempt === maxAttempts) throw err;
      const delayMs = Math.min(8000, 1000 * (2 ** (attempt - 1))) + Math.floor(Math.random() * 500);
      Utilities.sleep(delayMs);
    }
  }
  throw new Error("Gemini 재시도 횟수를 초과했습니다.");
}

function approveSelectedRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== V2.translationSheet) throw new Error("Translations 시트에서 검수 완료할 행을 선택하세요.");
  const range = sheet.getActiveRange(), statusCol = V2.translationHeaders.indexOf("Status") + 1;
  if (range.getRow() === 1) throw new Error("헤더가 아닌 번역 행을 선택하세요.");
  const start = range.getRow(), count = range.getNumRows();
  const translationCol = V2.translationHeaders.indexOf("Translation KO") + 1;
  for (let offset = 0; offset < count; offset += V2.maxSheetRowsPerRequest) {
    const size = Math.min(V2.maxSheetRowsPerRequest, count - offset);
    const values = sheet.getRange(start + offset, translationCol, size, 2).getValues();
    sheet.getRange(start + offset, statusCol, size, 1).setValues(values.map(([translation, status]) => [translation ? "APPROVED" : status]));
  }
  clearApprovedTranslationCache_();
}

function exportApprovedJson() {
  const translations = approvedTranslationRows_().map(({ edition, file, id, kind, name, source, translation, hash }) => ({ edition, file, id, kind, name, source, translation, hash }));
  const output = JSON.stringify({ schemaVersion: 1, edition: V2.edition, generatedAt: new Date().toISOString(), translations }, null, 2);
  const props = PropertiesService.getScriptProperties(), fileId = props.getProperty("V2_EXPORT_FILE_ID");
  let file = fileId ? DriveApp.getFileById(fileId) : null;
  // MimeType.JSON is not available in every Apps Script runtime; DriveApp expects
  // a MIME type string, so use the standard value explicitly when creating it.
  if (file) file.setContent(output); else { file = DriveApp.createFile("40k-translations-v2.json", output, "application/json"); props.setProperty("V2_EXPORT_FILE_ID", file.getId()); }
  log_("export", "완료", `APPROVED 번역 ${translations.length}개 · Drive file ${file.getId()}`);
  SpreadsheetApp.getUi().alert(`앱용 번역 JSON을 Drive에 갱신했습니다.\n${file.getUrl()}\n검수 완료 ${translations.length}개`);
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "translateDraft") {
    return jsonpOutput_(translateDraftFromApp_(e.parameter), e.parameter.callback);
  }
  if (e && e.parameter && e.parameter.action === "saveTranslationDraft") {
    return jsonpOutput_(saveTranslationDraftFromApp_(e.parameter), e.parameter.callback);
  }
  const translations = approvedTranslationRows_().map(({ edition, file, id, kind, name, source, hash, translation }) => ({ edition, file, id, kind, name, source, hash, translation }));
  const payload = { schemaVersion: 2, edition: V2.edition, translations };
  return jsonpOutput_(payload, e && e.parameter && e.parameter.callback);
}

// Stores a user-edited Korean draft. It deliberately does not publish/approve it.
function saveTranslationDraftFromApp_(params) {
  try {
    const props = PropertiesService.getScriptProperties(), expected = props.getProperty("V2_WEB_WRITE_TOKEN");
    if (!expected || !params.token || !constantTimeEqual_(String(params.token), expected)) throw new Error("번역 저장 키가 올바르지 않습니다. Google Sheet 메뉴에서 키를 표시/생성하세요.");
    if (!params.item || String(params.item).length > 12000) throw new Error("번역 원문 정보가 비어 있거나 너무 깁니다.");
    const item = JSON.parse(params.item), name = String(item.name || "").trim(), source = cleanText_(item.source), file = String(item.file || "").trim(), id = String(item.id || "").trim();
    const translation = String(params.translation || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").trim();
    if (!name || !source || source.length > 8000 || !/^[\w .'-]{1,180}\.json$/i.test(file) || !id || id.length > 200) throw new Error("번역 원문 정보가 올바르지 않습니다.");
    if (!translation || translation.length > 8000 || !/[가-힣]/.test(translation)) throw new Error("한국어 번역을 입력해 주세요. 최대 8,000자까지 저장할 수 있습니다.");
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) throw new Error("다른 번역 저장 작업이 진행 중입니다. 잠시 후 다시 시도하세요.");
    try {
      const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet);
      if (!sheet) throw new Error("Translations 시트가 없습니다. 먼저 시트 준비를 실행하세요.");
      const headers = sheet.getRange(1, 1, 1, V2.translationHeaders.length).getValues()[0], col = key => headers.indexOf(key);
      const required = V2.translationHeaders;
      if (required.some(key => col(key) < 0)) throw new Error("Translations 시트의 열 구성이 다릅니다. 시트 준비 상태를 확인하세요.");
      const hash = sha256_([name, source].join("\n")), stableKey = [V2.edition, file, id, "ability"].join("|"), key = stableKey + "|" + hash.slice(0, 12);
      let rowNumber = findExactValueRow_(sheet, col("Key") + 1, key);
      const faction = String(item.faction || "").slice(0, 160), now = new Date(), tail = [translation, "AI_DRAFT", "MANUAL", now, "앱에서 직접 입력/수정 · 확인 후 APPROVED로 변경"];
      if (rowNumber > 0) sheet.getRange(rowNumber, col("Translation KO") + 1, 1, tail.length).setValues([tail]);
      else sheet.appendRow([key, V2.edition, faction, file, id, "ability", name, source, hash, ...tail]);
      clearApprovedTranslationCache_();
      log_("app-manual-translation", "AI_DRAFT 저장", `${file} · ${name}`);
      return { ok: true, translation, status: "AI_DRAFT" };
    } finally { lock.releaseLock(); }
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  }
}

// The public GitHub Pages app can request one bounded translation at a time.
// Writes require a random key kept only in Apps Script properties and the user's browser.
function translateDraftFromApp_(params) {
  try {
    const props = PropertiesService.getScriptProperties(), expected = props.getProperty("V2_WEB_WRITE_TOKEN");
    if (!expected || !params.token || !constantTimeEqual_(String(params.token), expected)) throw new Error("번역 저장 키가 올바르지 않습니다. Google Sheet 메뉴에서 키를 표시/생성하세요.");
    if (!props.getProperty("GEMINI_API_KEY")) throw new Error("Apps Script Script Properties에 GEMINI_API_KEY가 없습니다.");
    if (!params.item || String(params.item).length > 12000) throw new Error("번역 요청이 비어 있거나 너무 깁니다.");
    const item = JSON.parse(params.item);
    const name = String(item.name || "").trim(), source = cleanText_(item.source), file = String(item.file || "").trim(), id = String(item.id || "").trim();
    if (!name || !source || !/[A-Za-z]/.test(source) || source.length > 8000 || !/^[\w .'-]{1,180}\.json$/i.test(file) || !id || id.length > 200) throw new Error("번역 원문 정보가 올바르지 않습니다.");
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) throw new Error("다른 번역 저장 작업이 진행 중입니다. 잠시 후 다시 시도하세요.");
    try {
      const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet);
      if (!sheet) throw new Error("Translations 시트가 없습니다. 먼저 시트 준비를 실행하세요.");
      const headers = sheet.getRange(1, 1, 1, V2.translationHeaders.length).getValues()[0], col = key => headers.indexOf(key);
      const hash = sha256_([name, source].join("\n")), stableKey = [V2.edition, file, id, "ability"].join("|");
      const key = stableKey + "|" + hash.slice(0, 12);
      let rowNumber = findExactValueRow_(sheet, col("Key") + 1, key);
      const row = rowNumber > 0 ? sheet.getRange(rowNumber, 1, 1, V2.translationHeaders.length).getValues()[0] : null;
      if (rowNumber > 0 && row[col("Translation KO")] && ["APPROVED", "AI_DRAFT"].includes(String(row[col("Status")]))) {
        return { ok: true, translation: String(row[col("Translation KO")]), status: String(row[col("Status")]), reused: true };
      }
      const faction = String(item.faction || "").slice(0, 160), now = new Date();
      if (rowNumber < 0) {
        sheet.appendRow([key, V2.edition, faction, file, id, "ability", name, source, hash, "", "PENDING", "", now, "앱 요청 · AI 번역 후 검수 필요"]);
        rowNumber = sheet.getLastRow();
      } else {
        if (String(row[col("Status")]) === "PENDING") {
          // Keep the existing row and translate its current source.
        } else {
          sheet.getRange(rowNumber, col("Source EN") + 1, 1, 4).setValues([[source, hash, "", "PENDING"]]);
        }
      }
      const translationItem = { row: rowNumber, id: stableKey + "|" + hash.slice(0, 12), faction, kind: "ability", name, source };
      const ko = String(callGeminiWithRetry_([translationItem], props.getProperty("GEMINI_API_KEY"))[0].ko || "").trim();
      if (!ko) throw new Error("AI가 빈 번역을 반환했습니다.");
      const model = props.getProperty("GEMINI_MODEL") || "gemini-3.8-flash";
      sheet.getRange(rowNumber, col("Translation KO") + 1, 1, 5).setValues([[ko, "AI_DRAFT", model, now, "앱에서 생성 · 확인 후 APPROVED로 변경"]]);
      clearApprovedTranslationCache_();
      log_("app-translate", "AI_DRAFT 저장", `${file} · ${name}`);
      return { ok: true, translation: ko, status: "AI_DRAFT", reused: false };
    } finally { lock.releaseLock(); }
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  }
}

function jsonpOutput_(payload, callback) {
  if (callback) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(callback)) throw new Error("Invalid JSONP callback.");
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload).replace(/</g, "\\u003c")});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function constantTimeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function installDailyTrigger() {
  removeDailyTrigger();
  ScriptApp.newTrigger("runV2Pipeline").timeBased().everyDays(1).atHour(4).create();
  SpreadsheetApp.getUi().alert("매일 자동 동기화와 번역을 설정했습니다. 실행 시간은 계정 시간대의 오전 4시 전후입니다.");
}

function installFrequentTrigger() {
  removeDailyTrigger();
  ScriptApp.newTrigger("runV2Pipeline").timeBased().everyMinutes(15).create();
  SpreadsheetApp.getUi().alert(`대기 중인 11판 번역을 15분마다 최대 ${V2.aiBatchesPerRun * V2.rowsPerAiBatch}개씩 처리하도록 설정했습니다. 기존 번역을 먼저 저장하고, 남은 실행 시간에 BSData 동기화를 진행합니다. Gemini 사용량/한도에 따라 실제 처리량은 달라질 수 있으며, 메뉴에서 자동 실행을 끌 수 있습니다.`);
}

function removeDailyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "runV2Pipeline").forEach(t => ScriptApp.deleteTrigger(t));
}

function factionForFile_(file) { return file.replace(/\.json$/i, "").split(" - ").slice(0, -1).join(" - ") || file.replace(/\.json$/i, ""); }
function writeStatusRows_(sheet, rowNumbers, column, value) {
  const sorted = [...new Set(rowNumbers)].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length;) {
    let end = i + 1;
    while (end < sorted.length && sorted[end] === sorted[end - 1] + 1 && end - i < V2.maxSheetRowsPerRequest) end++;
    sheet.getRange(sorted[i], column, end - i, 1).setValues(Array.from({ length: end - i }, () => [value]));
    i = end;
  }
}
function cleanText_(value) { return String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim(); }
function sha256_(text) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8).map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, "0")).join(""); }
function getSpreadsheet_() { const props = PropertiesService.getScriptProperties(), id = props.getProperty("V2_SPREADSHEET_ID"); return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet(); }
function log_(action, result, details) { const ss = getSpreadsheet_(), sheet = ss.getSheetByName(V2.logSheet); if (sheet) sheet.appendRow([new Date(), action, result, details]); }
