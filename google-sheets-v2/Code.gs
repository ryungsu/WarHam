/**
 * WH40K translation pipeline prototype (V2).
 * Bind this Apps Script project to a Google Sheet and run setupSheets() once.
 * No API secret is stored in the spreadsheet or browser.
 */
const V2 = {
  edition: "11",
  repo: "https://raw.githubusercontent.com/BSData/wh40k-11e/main/",
  maxSourcesPerRun: 8,
  aiBatchesPerRun: 5,
  rowsPerAiBatch: 8,
  sourceSheet: "Sources",
  translationSheet: "Translations",
  logSheet: "Run log",
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
    .addItem("선택 행 검수 완료", "approveSelectedRows")
    .addItem("검수 완료 JSON 내보내기", "exportApprovedJson")
    .addSeparator()
    .addItem("매일 자동 실행 켜기", "installDailyTrigger")
    .addItem("자동 실행 끄기", "removeDailyTrigger")
    .addToUi();
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, V2.sourceSheet, V2.sourceHeaders, V2.files.map(file => [file, true, "", "", ""]));
  ensureSheet_(ss, V2.translationSheet, V2.translationHeaders, []);
  ensureSheet_(ss, V2.logSheet, ["Timestamp", "Action", "Result", "Details"], []);
  PropertiesService.getScriptProperties().setProperty("V2_SPREADSHEET_ID", ss.getId());
  SpreadsheetApp.getUi().alert("시트 준비 완료. Script Properties에 GEMINI_API_KEY를 입력한 다음 ‘BSData 동기화 + AI 번역’을 실행하세요.");
}

function ensureSheet_(ss, name, headers, seedRows) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    if (seedRows.length) sheet.getRange(2, 1, seedRows.length, headers.length).setValues(seedRows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function runV2Pipeline() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return log_("pipeline", "skipped", "다른 실행이 진행 중입니다.");
  try {
    const synced = syncSourceBatch_();
    const translated = translatePendingBatch_();
    log_("pipeline", "완료", `원문 파일 ${synced.files}개 확인, 신규/변경 문장 ${synced.added}개, AI 번역 ${translated}개`);
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
  const sourceRows = sourceSheet.getDataRange().getValues().slice(1).filter(r => r[0] && r[1] !== false);
  if (!sourceRows.length) return { files: 0, added: 0 };
  const props = PropertiesService.getScriptProperties();
  const start = Number(props.getProperty("V2_SOURCE_CURSOR") || 0) % sourceRows.length;
  const batch = Array.from({ length: Math.min(V2.maxSourcesPerRun, sourceRows.length) }, (_, i) => sourceRows[(start + i) % sourceRows.length]);
  props.setProperty("V2_SOURCE_CURSOR", String((start + batch.length) % sourceRows.length));
  const requests = batch.map(r => ({ url: V2.repo + encodeURIComponent(r[0]), muteHttpExceptions: true, followRedirects: true }));
  const responses = UrlFetchApp.fetchAll(requests), existing = transSheet.getDataRange().getValues(), header = existing.shift();
  const keyIndex = header.indexOf("Key"), hashIndex = header.indexOf("Source hash"), statusIndex = header.indexOf("Status");
  const current = new Map();
  existing.forEach((r, i) => { if (r[keyIndex] && r[statusIndex] !== "SUPERSEDED") current.set(String(r[keyIndex]), { row: r, index: i + 2 }); });
  const append = [], supersede = [], now = new Date();
  let okFiles = 0;
  responses.forEach((response, i) => {
    const configRow = batch[i], file = String(configRow[0]);
    try {
      if (response.getResponseCode() !== 200) throw new Error(`HTTP ${response.getResponseCode()}`);
      const data = JSON.parse(response.getContentText()), root = data.catalogue || data, revision = String(root.revision || "unknown");
      const records = collectRecords_(data, file), faction = factionForFile_(file);
      for (const record of records) {
        const sourceHash = sha256_([record.name, record.source].join("\n")), key = [V2.edition, file, record.id, record.kind].join("|");
        const prior = current.get(key);
        if (prior && String(prior.row[hashIndex]) === sourceHash) continue;
        if (prior) supersede.push(prior.index);
        append.push([key + "|" + sourceHash.slice(0, 12), V2.edition, faction, file, record.id, record.kind, record.name, record.source, sourceHash, "", "PENDING", "", now, prior ? "원문이 바뀌어 재번역 대기" : ""]);
      }
      sourceSheet.getRange(sourceRows.indexOf(configRow) + 2, 3, 1, 3).setValues([[revision, now, ""]]);
      okFiles++;
    } catch (err) {
      const sourceIndex = sourceRows.indexOf(configRow) + 2;
      sourceSheet.getRange(sourceIndex, 5).setValue(String(err.message || err));
      log_("sync", "파일 오류", `${file}: ${err.message || err}`);
    }
  });
  supersede.forEach(rowNum => transSheet.getRange(rowNum, statusIndex + 1).setValue("SUPERSEDED"));
  if (append.length) transSheet.getRange(transSheet.getLastRow() + 1, 1, append.length, V2.translationHeaders.length).setValues(append);
  return { files: okFiles, added: append.length };
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

function translatePendingBatch_() {
  const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) { log_("translate", "건너뜀", "Script Properties에 GEMINI_API_KEY가 없습니다."); return 0; }
  const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet), values = sheet.getDataRange().getValues();
  if (values.length < 2) return 0;
  const headers = values[0], col = name => headers.indexOf(name), pending = [];
  for (let i = 1; i < values.length && pending.length < V2.aiBatchesPerRun * V2.rowsPerAiBatch; i++) if (values[i][col("Status")] === "PENDING") pending.push({ row: i + 1, id: values[i][col("Key")], name: values[i][col("Name EN")], source: values[i][col("Source EN")] });
  let done = 0;
  for (let offset = 0; offset < pending.length; offset += V2.rowsPerAiBatch) {
    const batch = pending.slice(offset, offset + V2.rowsPerAiBatch);
    try {
      const outputs = callGemini_(batch, apiKey), byIndex = new Map(outputs.map(x => [Number(x.i), x.ko]));
      batch.forEach((item, i) => {
        const ko = String(byIndex.get(i) || "").trim();
        if (!ko) return;
        sheet.getRange(item.row, col("Translation KO") + 1, 1, 5).setValues([[ko, "AI_DRAFT", PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") || "gemini-3.6-flash", new Date(), "검수 후 APPROVED로 변경"]]);
        done++;
      });
    } catch (err) { log_("translate", "배치 오류", String(err.message || err)); }
  }
  return done;
}

function callGemini_(batch, apiKey) {
  const model = PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") || "gemini-3.6-flash";
  const items = batch.map((x, i) => ({ i, name: x.name, text: x.source }));
  const prompt = "Translate Warhammer 40,000 rules text into concise Korean. Return ONLY a JSON array of objects with i (input index) and ko (Korean translation). Preserve every number, dice value, range, phase, condition, exception, and game term; do not add rules or omit clauses. Keep official English names in parentheses only when translating a name. If uncertain, translate literally. Glossary: Command phase=지휘 페이즈, Movement phase=이동 페이즈, Shooting phase=사격 페이즈, Charge phase=돌격 페이즈, Fight phase=타격 페이즈, Battle-shocked=전투 충격 상태, wound=운드, hit roll=명중 굴림, wound roll=운드 굴림, saving throw=방어 굴림, Objective Control=목표 장악. Inputs: " + JSON.stringify(items);
  const response = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "post", contentType: "application/json", muteHttpExceptions: true,
    headers: { "x-goog-api-key": apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } })
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error(`Gemini HTTP ${response.getResponseCode()}: ${response.getContentText().slice(0, 400)}`);
  const body = JSON.parse(response.getContentText()), text = body.candidates[0].content.parts.map(p => p.text || "").join("");
  return JSON.parse(text);
}

function approveSelectedRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== V2.translationSheet) throw new Error("Translations 시트에서 검수 완료할 행을 선택하세요.");
  const range = sheet.getActiveRange(), statusCol = V2.translationHeaders.indexOf("Status") + 1;
  if (range.getRow() === 1) throw new Error("헤더가 아닌 번역 행을 선택하세요.");
  for (let row = range.getRow(); row < range.getRow() + range.getNumRows(); row++) if (sheet.getRange(row, V2.translationHeaders.indexOf("Translation KO") + 1).getValue()) sheet.getRange(row, statusCol).setValue("APPROVED");
}

function exportApprovedJson() {
  const rows = getSpreadsheet_().getSheetByName(V2.translationSheet).getDataRange().getValues(), headers = rows.shift(), ix = name => headers.indexOf(name);
  const translations = rows.filter(r => r[ix("Status")] === "APPROVED" && r[ix("Translation KO")]).map(r => ({ edition: r[ix("Edition")], file: r[ix("Source file")], id: r[ix("Source ID")], kind: r[ix("Kind")], name: r[ix("Name EN")], source: r[ix("Source EN")], translation: r[ix("Translation KO")], hash: r[ix("Source hash")] }));
  const output = JSON.stringify({ schemaVersion: 1, edition: V2.edition, generatedAt: new Date().toISOString(), translations }, null, 2);
  const props = PropertiesService.getScriptProperties(), fileId = props.getProperty("V2_EXPORT_FILE_ID");
  let file = fileId ? DriveApp.getFileById(fileId) : null;
  if (file) file.setContent(output); else { file = DriveApp.createFile("40k-translations-v2.json", output, MimeType.JSON); props.setProperty("V2_EXPORT_FILE_ID", file.getId()); }
  log_("export", "완료", `APPROVED 번역 ${translations.length}개 · Drive file ${file.getId()}`);
  SpreadsheetApp.getUi().alert(`앱용 번역 JSON을 Drive에 갱신했습니다.\n${file.getUrl()}\n검수 완료 ${translations.length}개`);
}

function doGet(e) {
  const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet), rows = sheet.getDataRange().getValues(), headers = rows.shift(), ix = name => headers.indexOf(name);
  const payload = { schemaVersion: 1, edition: V2.edition, translations: rows.filter(r => r[ix("Status")] === "APPROVED" && r[ix("Translation KO")]).map(r => ({ id: r[ix("Source ID")], kind: r[ix("Kind")], name: r[ix("Name EN")], source: r[ix("Source EN")], translation: r[ix("Translation KO")] })) };
  const callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(callback)) throw new Error("Invalid JSONP callback.");
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload).replace(/</g, "\\u003c")});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function installDailyTrigger() {
  removeDailyTrigger();
  ScriptApp.newTrigger("runV2Pipeline").timeBased().everyDays(1).atHour(4).create();
  SpreadsheetApp.getUi().alert("매일 자동 동기화와 번역을 설정했습니다. 실행 시간은 계정 시간대의 오전 4시 전후입니다.");
}

function removeDailyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "runV2Pipeline").forEach(t => ScriptApp.deleteTrigger(t));
}

function factionForFile_(file) { return file.replace(/\.json$/i, "").split(" - ").slice(0, -1).join(" - ") || file.replace(/\.json$/i, ""); }
function cleanText_(value) { return String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim(); }
function sha256_(text) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8).map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, "0")).join(""); }
function getSpreadsheet_() { const props = PropertiesService.getScriptProperties(), id = props.getProperty("V2_SPREADSHEET_ID"); return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet(); }
function log_(action, result, details) { const ss = getSpreadsheet_(), sheet = ss.getSheetByName(V2.logSheet); if (sheet) sheet.appendRow([new Date(), action, result, details]); }
