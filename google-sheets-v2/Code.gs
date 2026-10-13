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
  const sourceRows = sourceSheet.getDataRange().getValues().slice(1).map((values, index) => ({ values, rowNumber: index + 2 })).filter(row => row.values[0] && row.values[1] !== false);
  if (!sourceRows.length) return { files: 0, added: 0 };
  const props = PropertiesService.getScriptProperties();
  const start = Number(props.getProperty("V2_SOURCE_CURSOR") || 0) % sourceRows.length;
  const batch = Array.from({ length: Math.min(V2.maxSourcesPerRun, sourceRows.length) }, (_, i) => sourceRows[(start + i) % sourceRows.length]);
  props.setProperty("V2_SOURCE_CURSOR", String((start + batch.length) % sourceRows.length));
  const requests = batch.map(r => ({ url: V2.repo + encodeURIComponent(r.values[0]), muteHttpExceptions: true, followRedirects: true }));
  const responses = UrlFetchApp.fetchAll(requests), existing = transSheet.getDataRange().getValues(), header = existing.shift();
  const keyIndex = header.indexOf("Key"), hashIndex = header.indexOf("Source hash"), statusIndex = header.indexOf("Status");
  const editionIndex = header.indexOf("Edition"), fileIndex = header.indexOf("Source file"), sourceIdIndex = header.indexOf("Source ID"), kindIndex = header.indexOf("Kind");
  const current = new Map(), batchFiles = new Set(batch.map(row => String(row.values[0]))), duplicates = [];
  existing.forEach((r, i) => {
    if (!r[keyIndex] || r[statusIndex] === "SUPERSEDED") return;
    const sourceKey = [r[editionIndex], r[fileIndex], r[sourceIdIndex], r[kindIndex]].join("|"), candidate = { row: r, index: i + 2 };
    const prior = current.get(sourceKey);
    if (!prior) { current.set(sourceKey, candidate); return; }
    if (batchFiles.has(String(r[fileIndex]))) {
      const rank = status => status === "APPROVED" ? 3 : status === "AI_DRAFT" ? 2 : 1;
      const keepPrior = rank(prior.row[statusIndex]) > rank(r[statusIndex]);
      duplicates.push(keepPrior ? candidate.index : prior.index);
      if (!keepPrior) current.set(sourceKey, candidate);
    } else current.set(sourceKey, candidate);
  });
  const append = [], supersede = [], now = new Date();
  let okFiles = 0;
  responses.forEach((response, i) => {
    const configRow = batch[i], file = String(configRow.values[0]);
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
      sourceSheet.getRange(configRow.rowNumber, 3, 1, 3).setValues([[revision, now, ""]]);
      okFiles++;
    } catch (err) {
      const sourceIndex = configRow.rowNumber;
      sourceSheet.getRange(sourceIndex, 5).setValue(String(err.message || err));
      log_("sync", "파일 오류", `${file}: ${err.message || err}`);
    }
  });
  writeStatusRows_(transSheet, [...duplicates, ...supersede], statusIndex + 1, "SUPERSEDED");
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
  for (let i = 1; i < values.length && pending.length < V2.aiBatchesPerRun * V2.rowsPerAiBatch; i++) if (values[i][col("Status")] === "PENDING") pending.push({ row: i + 1, id: values[i][col("Key")], faction: values[i][col("Faction")], kind: values[i][col("Kind")], name: values[i][col("Name EN")], source: values[i][col("Source EN")] });
  let done = 0;
  for (let offset = 0; offset < pending.length; offset += V2.rowsPerAiBatch) {
    const batch = pending.slice(offset, offset + V2.rowsPerAiBatch);
    try {
      const outputs = callGeminiWithRetry_(batch, apiKey), byIndex = new Map(outputs.map(x => [Number(x.i), x.ko]));
      batch.forEach((item, i) => {
        const ko = String(byIndex.get(i) || "").trim();
        if (!ko) return;
        sheet.getRange(item.row, col("Translation KO") + 1, 1, 5).setValues([[ko, "AI_DRAFT", PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") || "gemini-3.8-flash", new Date(), "검수 후 APPROVED로 변경"]]);
        done++;
      });
    } catch (err) { log_("translate", "배치 오류 · 대기 유지", String(err.message || err)); break; }
  }
  return done;
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
  // Reuse already-reviewed catalogue labels as a growing cross-faction term bank.
  const translations = ss.getSheetByName(V2.translationSheet);
  if (translations && translations.getLastRow() > 1) {
    const rows = translations.getDataRange().getValues(), headers = rows.shift(), ix = name => headers.indexOf(name);
    rows.filter(row => row[ix("Status")] === "APPROVED" && row[ix("Kind")] === "label" && row[ix("Name EN")] && row[ix("Translation KO")])
      .slice(-2000).forEach(row => {
        const en = String(row[ix("Name EN")]).trim(), key = en.toLowerCase();
        if (!entries.has(key)) entries.set(key, { en, ko: String(row[ix("Translation KO")]).trim(), context: "검수 완료 데이터시트 용어" });
      });
  }
  return [...entries.values()];
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
  if (e && e.parameter && e.parameter.action === "translateDraft") {
    return jsonpOutput_(translateDraftFromApp_(e.parameter), e.parameter.callback);
  }
  const sheet = getSpreadsheet_().getSheetByName(V2.translationSheet), rows = sheet.getDataRange().getValues(), headers = rows.shift(), ix = name => headers.indexOf(name);
  const payload = { schemaVersion: 1, edition: V2.edition, translations: rows.filter(r => r[ix("Status")] === "APPROVED" && r[ix("Translation KO")]).map(r => ({ id: r[ix("Source ID")], kind: r[ix("Kind")], name: r[ix("Name EN")], source: r[ix("Source EN")], translation: r[ix("Translation KO")] })) };
  return jsonpOutput_(payload, e && e.parameter && e.parameter.callback);
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
      const values = sheet.getDataRange().getValues(), headers = values[0], col = key => headers.indexOf(key);
      const hash = sha256_([name, source].join("\n")), stableKey = [V2.edition, file, id, "ability"].join("|");
      let rowNumber = -1;
      for (let i = values.length - 1; i > 0; i--) if (String(values[i][col("Key")]).startsWith(stableKey + "|")) { rowNumber = i + 1; break; }
      let row;
      if (rowNumber > 0) {
        row = values[rowNumber - 1];
        if (String(row[col("Source hash")]) !== hash) rowNumber = -1;
      }
      if (rowNumber > 0 && row[col("Translation KO")] && ["APPROVED", "AI_DRAFT"].includes(String(row[col("Status")]))) {
        return { ok: true, translation: String(row[col("Translation KO")]), status: String(row[col("Status")]), reused: true };
      }
      const faction = String(item.faction || "").slice(0, 160), now = new Date();
      if (rowNumber < 0) {
        const key = stableKey + "|" + hash.slice(0, 12);
        sheet.appendRow([key, V2.edition, faction, file, id, "ability", name, source, hash, "", "PENDING", "", now, "앱 요청 · AI 번역 후 검수 필요"]);
        rowNumber = sheet.getLastRow();
      } else {
        row = values[rowNumber - 1];
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
  SpreadsheetApp.getUi().alert("대기 중인 번역을 15분마다 최대 40개씩 처리하도록 설정했습니다. Gemini 사용량/한도에 따라 속도가 달라질 수 있으며, 메뉴에서 자동 실행을 끌 수 있습니다.");
}

function removeDailyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "runV2Pipeline").forEach(t => ScriptApp.deleteTrigger(t));
}

function factionForFile_(file) { return file.replace(/\.json$/i, "").split(" - ").slice(0, -1).join(" - ") || file.replace(/\.json$/i, ""); }
function writeStatusRows_(sheet, rowNumbers, column, value) {
  const sorted = [...new Set(rowNumbers)].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length;) {
    let end = i + 1;
    while (end < sorted.length && sorted[end] === sorted[end - 1] + 1) end++;
    sheet.getRange(sorted[i], column, end - i, 1).setValues(Array.from({ length: end - i }, () => [value]));
    i = end;
  }
}
function cleanText_(value) { return String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim(); }
function sha256_(text) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8).map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, "0")).join(""); }
function getSpreadsheet_() { const props = PropertiesService.getScriptProperties(), id = props.getProperty("V2_SPREADSHEET_ID"); return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet(); }
function log_(action, result, details) { const ss = getSpreadsheet_(), sheet = ss.getSheetByName(V2.logSheet); if (sheet) sheet.appendRow([new Date(), action, result, details]); }
