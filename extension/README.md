# CareerNow One-Click Apply (Chrome MV3)

Autofills job application forms on Workday, Greenhouse, Lever, Ashby, SmartRecruiters, iCIMS, and BambooHR using your CareerNow profile + latest resume.

## Install (developer mode)

1. Open `chrome://extensions` in Chrome / Edge / Brave / Arc.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `extension/` folder.
4. Pin the extension, click it, sign in with your CareerNow email + password.
5. Open any supported job application page and press **Autofill this page**.

## How it works

- **popup.js** signs in against the CareerNow backend (Supabase password grant) and caches your `profiles` row + latest `resume_drafts.data` in `chrome.storage.local`.
- **content.js** scans every visible `<input>` / `<textarea>`, scores each field by its label / placeholder / `aria-label` / `name` / Workday `data-automation-id`, maps it to a profile key, and uses the native setter so React/Vue/Angular state actually updates.
- **background.js** is a thin service worker — no network calls from there, no analytics.
- The user **always clicks Submit themselves**. The extension never submits forms automatically.

## Supported field types (today)

First/last/full name, email, phone, location, LinkedIn URL, website/portfolio, current company, current title, school, degree, cover-letter/summary, skills list.

## Roadmap

- Resume file attachment (download from storage → drop into `<input type="file">`).
- AI cover letter generation per job (call `smart-match` edge function).
- Workday's multi-step wizard (custom adapter).
- OAuth sign-in instead of password grant.

## Packaging

```bash
cd extension && zip -r ../careernow-autofill.zip . -x "*.DS_Store"
```