# V2 prototype: BSData → Google Sheets → AI translation

V1 stays on `master` at commit `5632063`. This branch adds a Google Apps Script pipeline and an optional JSONP translation feed to the local web app. The V2 importer currently follows the app's public 11th-edition BSData JSON catalogues.

## Setup the translation sheet

1. Create a Google Sheet, open **Extensions → Apps Script**, and paste `Code.gs` into the script editor. The checked-in `appsscript.json` sets the project timezone to Seoul.
2. In Apps Script **Project Settings → Script Properties**, add `GEMINI_API_KEY`. `GEMINI_MODEL` is optional; its default is `gemini-3.6-flash`.
3. Run `setupSheets()` once and approve the requested Google Sheets, Drive, and external request permissions.
4. Reload the spreadsheet. The **40K 번역 V2** menu now provides sync, review, export, and schedule actions. Run **BSData 동기화 + AI 번역** once to start.
5. In `Translations`, review the `AI_DRAFT` rows. Correct `Translation KO` as needed, then select the reviewed rows and choose **선택 행 검수 완료**; this sets their status to `APPROVED`.
6. Select **매일 자동 실행 켜기** when the first manual run looks right. Each daily run checks up to 8 source files and requests translations in batches of up to 40 records. It rotates through the enabled files, and only adds new or changed source text.

`Sources` starts with the public 11e faction catalogues. You can disable files by changing `Enabled` to FALSE. `Translations` keeps old source versions as `SUPERSEDED`; unchanged source hashes are skipped. Translation prompts explicitly preserve numeric values, phases, exceptions, and game terms.

## Connect reviewed translations to the V2 app

1. Deploy the Apps Script as a web app. Set it to execute as you, and grant public access only if you want the local browser app to read its approved translations. `doGet` publishes only rows whose status is `APPROVED`; it does not publish the Gemini key or AI drafts.
2. Copy the deployed `/exec` URL.
3. Open the V2 app with that URL in the `translationFeed` query parameter, for example:

   `index.html?translationFeed=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2FDEPLOYMENT_ID%2Fexec`

   The app uses JSONP so a local `file://` page can read the approved feed without putting an API key in the browser. Without this parameter, it behaves like V1.

`exportApprovedJson()` also writes a JSON snapshot to Google Drive for review or backup. The web app endpoint is the route for automatic updates; the Drive export is a snapshot.

## Prototype boundaries

- The importer and translator are ready to try after you create the Sheet and provide your Gemini API key. Those account-specific steps cannot be performed from this local workspace.
- The initial catalog source is the 11e BSData branch. The roster input parser and catalog selection otherwise remain the V1 implementation.
- AI output is a draft. It is not exposed to the app until a person approves it. The public feed contains approved Korean translations paired with their original text.
- Apps Script time triggers execute under the account that created them and are subject to Google's changing quotas. The importer deliberately works in small, resumable batches; check `Run log` if a source request or AI batch fails.
- Published app feeds expose approved translations to anyone who can access the deployed web app. Keep `GEMINI_API_KEY` only in Script Properties.
