# V2 prototype: BSData → Google Sheets → AI translation

V1 stays on `master` at commit `5632063`. This branch adds a Google Apps Script pipeline and an optional JSONP translation feed to the web app. The importer follows the public 11th-edition BSData JSON catalogues.

## Setup the translation sheet

1. Create a Google Sheet, open **Extensions → Apps Script**, and paste `Code.gs` into the script editor. The checked-in `appsscript.json` sets the project timezone to Seoul.
2. In Apps Script **Project Settings → Script Properties**, add `GEMINI_API_KEY`. `GEMINI_MODEL` is optional; the default is `gemini-3.8-flash`. If an older `GEMINI_MODEL` property is already set, update or remove it to use the new default. Model availability and quotas follow Google's current API terms.
3. Run `setupSheets()` and approve the requested Google Sheets, Drive, and external request permissions. It creates the complete public 11e catalogue list, preserves existing source settings, and creates or fills missing seed terms in a `Glossary` tab without overwriting existing translations.
4. Reload the spreadsheet. The **40K 번역 V2** menu provides sync, review, export, and schedule actions. Run **BSData 동기화 + AI 번역** once to start.
5. In `Glossary`, adjust or add approved English→Korean mappings and leave `Status` as `APPROVED`. The translator includes these entries in every prompt. In `Translations`, review the `AI_DRAFT` rows, correct `Translation KO` as needed, then select reviewed rows and choose **선택 행 검수 완료** to set their status to `APPROVED`.
6. Select **대기 번역 자동 처리 (15분마다)** to drain a large initial backlog, or **매일 자동 실행 켜기** for normal updates. Each run checks up to 8 source files and requests translations in batches of up to 40 records. It rotates through enabled files and only adds new or changed source text. Throughput depends on Gemini quota and service availability.

`Sources` covers the public 11e faction catalogues, including shared and chapter libraries. Leave rows enabled to build coverage across factions; disable a file by changing `Enabled` to FALSE. `Translations` keeps old source versions as `SUPERSEDED`; unchanged hashes are skipped. Translation prompts include faction and record type, preserve numeric values, phases, exceptions, and mechanics, and use the approved glossary. Structured JSON responses are checked for missing or duplicate indexes and empty translations before writing drafts. AI output still requires human rules review; the glossary improves consistency but cannot guarantee correctness.

## Connect reviewed translations to the app

1. Deploy the Apps Script as a web app. Set it to execute as you, and grant public access only if you want the browser app to read approved translations. `doGet` publishes only rows whose status is `APPROVED`; it never publishes the Gemini key or AI drafts.
2. Copy the deployed `/exec` URL.
3. Open the app with that URL in the `translationFeed` query parameter, for example:

   `index.html?translationFeed=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2FDEPLOYMENT_ID%2Fexec`

   The app uses JSONP so a local `file://` page can read the approved feed without putting an API key in the browser. Without this parameter, it behaves like V1.

`exportApprovedJson()` also writes a JSON snapshot to Google Drive for review or backup. The web app endpoint is the route for automatic updates; Drive export is a snapshot.

## Prototype boundaries

- Account-specific setup (creating the Sheet, providing the API key, granting access, and deploying) must be done in the user's Google account.
- Updating this repository does not update a separately bound Apps Script project. After updating, paste the new `Code.gs` contents into Apps Script, save, run `setupSheets()` once to add missing seed terms, and update the web app deployment to a new version. Existing glossary terms and status edits are preserved.
- The catalog source is the public 11e BSData branch. The app chooses faction catalogues from the roster; an approved translation feed is shared across factions. A faction can load before its translation rows are generated and reviewed, in which case untranslated text remains English or uses the local glossary.
- AI output remains a draft until a person approves it. The public feed contains only approved Korean translations paired with their original text.
- Apps Script time triggers run under the account that created them and are subject to Google's quotas. Gemini 408/429/5xx errors are retried with exponential backoff up to three times; if a batch still fails, its rows remain `PENDING` for a later run. Check `Run log` for source/API errors.
- Published app feeds expose approved translations to anyone who can access the deployed web app. Keep `GEMINI_API_KEY` only in Script Properties.
- Roster presets are stored in this browser's local storage. Recent pasted/analyzed lists are kept locally (up to 6); named presets are also local to that browser (up to 30), not shared across devices.
