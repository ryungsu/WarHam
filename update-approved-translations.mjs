import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error("사용법: node update-approved-translations.mjs <40k-translations-v2.json 경로>");
  process.exit(1);
}

const payload = JSON.parse(await readFile(resolve(sourcePath), "utf8"));
if (String(payload.edition) !== "11" || !Array.isArray(payload.translations)) {
  throw new Error("11판 번역 JSON 형식이 아닙니다.");
}
if (payload.translations.some(item => !item || !item.translation || !item.name)) {
  throw new Error("이름 또는 번역문이 비어 있는 항목이 있습니다.");
}

const bundlePath = new URL("./approved-translations.js", import.meta.url);
await writeFile(bundlePath, `window.WARHAMMER_APPROVED_TRANSLATIONS=${JSON.stringify(payload)};\n`, "utf8");

const indexPath = new URL("./index.html", import.meta.url);
const index = await readFile(indexPath, "utf8");
const version = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
const updated = index.replace(/approved-translations\.js\?v=[^"']+/, `approved-translations.js?v=${version}`);
if (updated === index) throw new Error("index.html에서 번역 파일 버전을 찾지 못했습니다.");
await writeFile(indexPath, updated, "utf8");
console.log(`승인 번역 ${payload.translations.length}개 적용 · 정적 파일 캐시 버전 ${version}`);
