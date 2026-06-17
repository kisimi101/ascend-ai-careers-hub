
# Scope (6 areas)

## 1. Welcome & Onboarding Email Sequence (Resend)
Create `supabase/functions/_shared/onboarding-emails.ts` with 10 branded HTML templates and a dispatcher `send-onboarding-email` edge function that takes `{userId, type}` and sends via Resend (using existing `RESEND_API_KEY` + `RESEND_FROM`).

Triggers:
| # | Email | Trigger | Send time |
|---|---|---|---|
| 1 | Welcome | DB trigger on `auth.users` insert (calls edge fn via pg_net) | Immediate |
| 2 | Complete your profile | pg_cron daily: profile incomplete & signup > 24h | T+1d |
| 3 | Upload your first resume | pg_cron: no resume_drafts & signup > 2d | T+2d |
| 4 | Optimize your resume | After first resume saved, score < 80 | Event |
| 5 | Job match recommendations | pg_cron weekly: has resume, matches found | Weekly Tue 9am |
| 6 | Try Smart Apply | pg_cron: has resume, 0 applications, T+5d | T+5d |
| 7 | Interview prep tips | After first `job_applications.status='interview'` | Event |
| 8 | Premium features | T+7d, still on free tier | T+7d |
| 9 | Re-engagement | pg_cron: no login in 14d | T+14d idle |
| 10 | Application follow-up | pg_cron daily: application age 7d still `applied` | T+7d per app |

Subject/preview/body per email written in templates file. Add new pg_cron job `onboarding-email-dispatcher` running daily that iterates eligible users and calls the dispatcher. Track sends in new `email_log` table (`user_id`, `email_type`, `sent_at` unique) to prevent duplicates.

## 2. Smart Apply Edge Function fix
Audit `supabase/functions/smart-match/index.ts` + `src/pages/SmartApply.tsx`. Known issues:
- `action === "generate-cover-letters"` calls `await req.json()` a **second time** — body already consumed at top → throws → non-2xx. Fix: read jobs from initial `body.jobs`.
- Surface server error JSON in the UI instead of generic "non-2xx". Wrap `supabase.functions.invoke` and read `error.context.body` / response JSON.
- Add explicit 4xx for missing `resumeData`.
- Verify `optimize-resume` and `parse-resume` paths still return 2xx for the 50MB storage flow.

## 3. Multi-format resume parsing
Update `supabase/functions/parse-resume/index.ts` to accept `.pdf .docx .doc .txt .rtf`:
- PDF: existing path
- DOCX: `npm:mammoth` extractRawText
- DOC: best-effort — return friendly error asking user to save as .docx (legacy binary parsing isn't viable in Deno)
- TXT: direct UTF-8 decode
- RTF: strip RTF control words with regex
Add MIME/extension validation on client (`ResumeChecker`, `SmartApply`, `ResumeEnhancer`, `LinkedInImport`). Show clear toast when unsupported.

## 4. Skills-section detection
Fix false "Missing skills section" in `src/pages/ResumeBuilder.tsx` / `src/components/resume-builder/ATSScoreCard.tsx` (or wherever the checklist lives). Treat any of these as a skills section:
`skills | key competencies | core competencies | technical competencies | technical skills | professional skills | expertise | proficiencies | technologies | tech stack`
Match against `resumeData.skills.length > 0` OR any synonymous heading in rendered text. Same fix applied to `optimize-resume` AI prompt and `scan-keywords` edge function.

## 5. Resume → Job Matching → Smart Apply wiring
- After resume save in `ResumeBuilder`, persist latest skills to `profiles.latest_resume_skills` (new column).
- `JobSearch` auto-prefills keywords from latest resume skills.
- `SmartApply` reads latest `resume_drafts` row for signed-in users instead of localStorage-only.
- "Find Jobs & Apply" CTA on optimize step → `/job-search?fromResume=1` then `/smart-apply` with selected jobs in sessionStorage.

## 6. Audit report
Markdown report at `docs/AUDIT_2026-06-17.md` covering auth, resume tools, AI, DB, edge funcs, frontend, performance. List issues found, fixes applied this turn, remaining risks, and a pre-prod testing checklist. No code refactors beyond items 1–5.

# Files

**Create**
- `supabase/functions/_shared/onboarding-emails.ts`
- `supabase/functions/send-onboarding-email/index.ts`
- `supabase/migrations/<ts>_email_log_and_onboarding.sql` (email_log table + GRANTs/RLS, profiles.latest_resume_skills column, pg_cron job, auth.users trigger via pg_net for welcome email)
- `docs/AUDIT_2026-06-17.md`

**Edit**
- `supabase/functions/smart-match/index.ts` (double json bug)
- `supabase/functions/parse-resume/index.ts` (multi-format)
- `supabase/functions/optimize-resume/index.ts` & `scan-keywords/index.ts` (skills synonyms)
- `src/pages/SmartApply.tsx` (better error surfacing, file types, use latest resume_drafts)
- `src/pages/ResumeChecker.tsx`, `src/pages/ResumeEnhancer.tsx`, `src/pages/LinkedInImport.tsx` (accept .doc/.txt/.rtf, validate)
- `src/pages/ResumeBuilder.tsx` (persist skills to profile, skills-section synonym check)
- `src/components/resume-builder/ATSScoreCard.tsx` (synonym check)
- `src/pages/JobSearch.tsx` (prefill from resume skills)

# Out of scope
- Visual redesign, mobile-responsive rework, bundle-size refactor (covered in audit report as recommendations only).
- Migrating off Apify/Google search recency.
- Per-user OAuth.

# Verification
- Curl `send-onboarding-email` with `type=welcome` to a test inbox.
- SmartApply pipeline end-to-end as guest then signed-in.
- Upload `.docx .txt .rtf` to Resume Checker, confirm text extraction.
- Build a resume using Executive template → confirm "Missing skills section" no longer fires when Key Competencies present.
- Optimize resume → click Find Jobs & Apply → confirm prefilled keywords and Smart Apply runs.

Confirm and I'll build.
