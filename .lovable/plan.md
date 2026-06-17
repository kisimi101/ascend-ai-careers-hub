# Plan: 7 Improvements

## 1. Apify & Firecrawl via Lovable Connectors (with your keys as fallback)

**Answer to your question:** Yes — Lovable has a built-in **Firecrawl connector** (gateway-managed, auto-refreshing). Apify does **not** currently have a Lovable connector, so it stays as your own `APIFY_API_KEY` secret.

Proposal:
- **Firecrawl**: link the Lovable connector as **primary**. Edge functions try the gateway first, fall back to your `FIRECRAWL_API_KEY` if the gateway returns an error. (Both keys are server-side; your secret stays as backup.)
- **Apify**: keep your `APIFY_API_KEY` (no connector exists).

Files: small helper `supabase/functions/_shared/firecrawl.ts` used by `scrape-linkedin`, `scrape-company`, `search-contacts`.

## 2. Resend wired up + tested

You've added `RESEND_API_KEY` and verified a domain. I'll:
- Create `supabase/functions/_shared/email.ts` — single `sendEmail({to, subject, html})` helper hitting Resend.
- Switch `send-job-alerts`, `send-interview-reminders`, `send-notification-email`, `send-weekly-digest` to use it (they currently log only or are stubs).
- Use sender `CareerNow <alerts@<yourdomain>>` — I'll ask which verified domain to use after the plan.
- Test by calling `send-notification-email` with a sample payload and showing the Resend response.

**How this helps users:** they get actual email for: new job-alert matches (#3), interview reminders 24h before, weekly progress digest (Sunday), and follow-up reminders. Without Resend wired, those were silent.

## 3. Stricter recency: past 3 days

- `supabase/functions/search-jobs/index.ts`: change `tbs=qdr:w` → `tbs=qdr:3` (Google's "past 3 days" range).
- `supabase/functions/check-job-alerts/index.ts`: same change so notification matches are <=3 days old.
- Add `postedWithinDays: 3` default visible in `JobAlertManager` UI.

## 4. Company Watchlist

New feature — track companies, get notified when fresh roles appear.

DB migration:
```sql
CREATE TABLE public.company_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  keywords text,           -- optional role filter
  location text,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_name)
);
-- GRANTs + RLS (auth.uid() = user_id)
```

UI: new page `/company-watchlist` + card on Dashboard. Add/remove companies, see last-checked timestamp.

Reuse existing `check-job-alerts` cron — extend it to also query each watched company via Apify with `site:linkedin.com/jobs "{company}"`.

## 5. Job snapshot in Tracker

`job_applications` already stores `company`, `position`, `job_url`. Add:
```sql
ALTER TABLE public.job_applications
  ADD COLUMN job_snapshot jsonb,           -- {title, company, url, description, posted_date, source}
  ADD COLUMN snapshot_taken_at timestamptz;
```

When user clicks "Track this job" in JobSearch results or SmartApply, store the full snapshot. JobTracker UI shows snapshot data instead of re-fetching, with a "View original (may be expired)" link.

## 6. Per-tool upload limits in UI

Single source of truth: new `src/lib/uploadLimits.ts`:
```ts
export const UPLOAD_LIMITS = {
  resumeChecker: 50,
  resumeEnhancer: 50,
  smartApply: 50,
  coverLetter: 10,
  linkedinImport: 10,
  videoResume: 50,
  resumeComparison: 10,
} as const;
```
Each upload component shows `Max {limit}MB · PDF, DOCX` under the dropzone and blocks oversized files with a clear toast.

## 7. Manual "Refresh alerts" + auto schedule

- Add **Refresh** button in `JobAlertManager` → invokes `check-job-alerts` for the current user only (new `userId` param).
- Cron: schedule `check-job-alerts` every 6 hours via pg_cron (currently not scheduled).

## Files touched (≈22)

**Create:** `supabase/functions/_shared/email.ts`, `supabase/functions/_shared/firecrawl.ts`, `src/lib/uploadLimits.ts`, `src/pages/CompanyWatchlist.tsx`, `src/components/company-watchlist/WatchlistManager.tsx`, 2 migrations.

**Edit:** `search-jobs`, `check-job-alerts`, `send-job-alerts`, `send-interview-reminders`, `send-notification-email`, `send-weekly-digest`, `scrape-linkedin`, `scrape-company`, `JobAlertManager.tsx`, `JobSearchResults.tsx`, `JobTracker.tsx`, `ResumeChecker.tsx`, `SmartApply.tsx`, `CoverLetterGenerator.tsx`, `LinkedInImport.tsx`, `VideoResume.tsx`, `App.tsx` (route).

## Out of scope
- Migrating to non-Google Apify actors (LinkedIn/Indeed direct) — would change pricing; ask if you want this.
- Per-user OAuth for Apify (no such product).

## Verification
- Resend: trigger one test email, screenshot inbox path / function logs.
- Recency: search "react developer" → confirm dates ≤3 days.
- Watchlist: add "Stripe", run refresh, confirm rows.
- Snapshot: track a job, delete the source URL, confirm tracker still renders.
- Upload limits: try 60MB PDF on Resume Checker → blocked with message.

## I need from you before building
1. Which verified Resend domain/from-address? (e.g. `alerts@careernow.xyz`)
2. Confirm Firecrawl connector should be linked as primary (or keep your key only)?
3. OK to add the 2 migrations above?
