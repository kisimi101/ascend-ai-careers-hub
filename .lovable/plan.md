Scope is large but deliberate. Five workstreams, executed in this order:

## 1. Hero / navbar overlap (quick win)
`src/components/Hero.tsx` — bump top padding so the 3-tier nav (~190px tall on desktop) no longer clips "Better resume.". Change `pt-32 md:pt-36` → `pt-44 md:pt-56 lg:pt-60`. Verify in preview.

## 2. Free-by-default access model
**Rule:** all tools work anonymously. Sign-in required only for:
- creating a 2nd+ resume
- applying to >10 jobs/day
- the heavy AI tools: Resume Checker, Resume Enhancer, Career Path Planner (per your "Same + paywall on AI tools" choice — sign-in required, free tier OK for first use)

**Changes:**
- `src/components/ProtectedRoute.tsx` → add `mode` prop: `"auth-required" | "soft"`. Default soft = render children, no redirect.
- `src/App.tsx` → remove `<ProtectedRoute>` wrappers from: Resume Builder (first resume), Job Search, Smart Apply, Cover Letter Generator, Interview Practice, LinkedIn Import/Optimizer, Resume Summary/Bullet/Skills/Translator/Comparison/Keyword Scanner, Portfolio, Network, Company Research, Salary, Heatmap, Industry Insights, Video Resume, Get Started, Tools Dashboard.
- Keep auth required for: Dashboard, Profile, Settings, Apply History, Resume Analytics, Job Tracker, Job Analytics, Reference Manager, Auto Follow-Up, Career Timeline, Referral Mapper, SEO Keyword Tracker (these need persisted user data).
- `src/pages/ResumeBuilder.tsx` → check existing resume count in localStorage + DB; if user has ≥1 saved resume and is anonymous, show AuthDialog with "Sign in to save another resume".
- `src/hooks/useTrialLimit.ts` / job-apply flow → anonymous users get 10 applies/day tracked by localStorage; on 11th, show AuthDialog → upgrade modal.
- AI tools (`ResumeChecker`, `ResumeEnhancer`, `CareerPathPlanner`) — gate the **run** action behind sign-in (not the page view). Show inline prompt instead of redirect.

## 3. Pricing alignment (Free / Pro $12 / Enterprise $39)
`src/components/PricingSection.tsx` — rewrite feature lists to match what actually exists:
- **Free (no sign-in needed):** 1 saved resume, 10 job applies/day, all AI tools (Checker/Enhancer/Summary/Bullets/Career Planner), Smart Apply, Cover Letter Generator, Interview Practice, LinkedIn Import, all templates (preview only), CSV export.
- **Pro $12/mo:** Unlimited saved resumes, unlimited job applies, PDF + DOCX exports, Resume Analytics + share links, Job Tracker + analytics, Auto Follow-Up, Career Timeline, Reference Manager, Video-to-Resume, priority AI model.
- **Enterprise $39/mo:** Everything in Pro + team seats, Network/Referral Mapper, Job Market Heatmap, Industry Insights, SEO Keyword Tracker, dedicated support, SSO-ready.
Remove crowns per Core memory.

## 4. 50MB uploads via Storage streaming
- Create private storage bucket `uploads` (50MB file size limit).
- New edge function `upload-signed-url` → returns short-lived signed upload URL for `uploads/{userId or anon}/{uuid}.{ext}`.
- Client helper `src/lib/uploadLarge.ts` → request signed URL, PUT file directly to Storage, return storage path.
- Update Resume Checker / Enhancer / Parser / Video Resume to use the helper instead of base64 payloads.
- Edge functions (`ai-resume-tools`, `parse-resume`, new `video-to-resume`) accept `{ storagePath }`, download via service-role client, process, then delete the object.
- File-size guard: 50MB client + server.

## 5. Video-to-Resume (build from scratch)
- New edge function `supabase/functions/video-to-resume/index.ts`:
  1. Receive `{ storagePath }`.
  2. Download video from `uploads` bucket (streaming).
  3. Extract audio → send to Gemini 2.5 Flash via `/v1/chat/completions` with `input_audio` block (webm/m4a from MediaRecorder) **OR** for true video, send video as `image_url`-style data URI to a vision-capable Gemini model; use `google/gemini-2.5-pro` which accepts video input.
  4. Prompt: "Transcribe + extract: name, contact, education, experience with dates+bullets, skills, summary. Return strict JSON matching ResumeData shape."
  5. Use `EdgeRuntime.waitUntil` pattern for >30s processing; insert a `video_jobs` row, return `job_id`; client polls.
- DB migration: `video_jobs (id, user_id nullable, status, progress, result jsonb, error, created_at)` + RLS.
- Rewrite `src/pages/VideoResume.tsx`:
  - Upload UI (drag-drop, 50MB cap, mp4/webm/mov).
  - Record-in-browser option via MediaRecorder (existing if present).
  - Upload via `uploadLarge`, invoke `video-to-resume`, poll `video_jobs` row, on completion populate `resume-data` localStorage and navigate to `/resume-builder`.
- Add explainer panel: "How it works: record/upload a 1–3 min video introducing yourself → AI transcribes and extracts your experience → instant resume draft you can edit."

## Out of scope (will not touch)
- LinkedIn OAuth (separate request, not natively supported on Cloud).
- Existing P0 AI tool wiring (already shipped last turn).
- Mobile nav structure (already shipped).

## Verification
After each workstream:
- Hero: visual check via Playwright screenshot at 1280×800.
- Gating: open incognito → land on Resume Builder, build resume, save → save works; try second resume → AuthDialog. Try Job Search → 10 quick-applies allowed → 11th prompts sign-in.
- Pricing: visual diff vs current.
- Uploads: upload 30MB pdf to Resume Checker → AI returns analysis.
- Video: upload 60s webm → job completes → resume populated.

**Estimated edits:** ~18 files modified, 2 edge functions created, 1 migration, 1 storage bucket.