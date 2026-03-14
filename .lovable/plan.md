

## Plan: Global Expansion, Question Bank Caching, and UI Cleanup

### 1. Remove "Pro" Crown Badges from Tool Cards (Keep Paywall on Access)

**Files:** `src/pages/ToolsDashboard.tsx`

- Remove the `premium` property rendering of `Crown` badges on tool cards (lines 171-175)
- Keep the `handleToolAccess` gating logic intact so users still hit the upgrade modal when clicking premium tools
- Change button text: instead of showing "Upgrade to Access" for premium tools, show "Try Now" for all tools uniformly
- The paywall triggers only when users click, not visually before they try

---

### 2. Interview Question Bank: Cache AI Answers in Database

**Database migration:** Create an `interview_questions` table to store generated Q&A pairs.

```sql
CREATE TABLE public.interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  question text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  sample_answer text,
  tips jsonb DEFAULT '[]',
  upvotes integer DEFAULT 0,
  source text DEFAULT 'ai',
  created_at timestamptz DEFAULT now(),
  UNIQUE(company, role, question)
);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read interview questions"
  ON public.interview_questions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can insert questions"
  ON public.interview_questions FOR INSERT TO service_role
  WITH CHECK (true);
```

**Edge function update:** `supabase/functions/generate-interview-questions/index.ts`
- Before calling AI, query the `interview_questions` table for existing matches (company + role)
- If enough cached results exist (e.g., 5+), return them directly
- After AI generates new questions, insert them into the table for future reuse

**Frontend update:** `src/pages/InterviewQuestionBank.tsx`
- No major changes needed; the edge function handles caching transparently
- Add upvote functionality that increments the `upvotes` column in the database

---

### 3. Globalize the App (Remove US/Europe-Only Limitations)

This affects multiple files with hardcoded US cities, companies, and roles:

**A. Salary Estimator** (`src/pages/SalaryEstimator.tsx`)
- Replace hardcoded US-only location dropdown with a comprehensive global list including regions like: London, Berlin, Dubai, Singapore, Tokyo, Sydney, Toronto, Bangalore, Lagos, Nairobi, Sao Paulo, Remote
- Add corresponding salary multipliers for global cities
- Add more job titles beyond the current 10 (e.g., Cybersecurity Analyst, Cloud Architect, Content Writer, Financial Analyst, Teacher, Nurse, Civil Engineer, etc.)

**B. Job Market Heatmap** (`src/pages/JobMarketHeatmap.tsx`)
- Expand `LOCATIONS` array from US-only to global cities across all continents
- Expand `ROLES` array to include more diverse roles
- Add more industries beyond tech

**C. Mock/Fallback Data** (multiple files)
- `supabase/functions/fetch-job-market/index.ts`: Update `generateMockData` to include global cities (London, Toronto, Singapore, etc.) instead of only US cities
- `src/pages/Network.tsx`: Diversify fallback contact locations globally
- `src/pages/IndustryInsights.tsx`: Global top locations in mock data
- `src/pages/ResumeJobSearch.tsx`: Global fallback job locations

**D. Interview Question Bank** (`src/pages/InterviewQuestionBank.tsx`)
- Expand `POPULAR_COMPANIES` to include global companies: Samsung, Tata, Infosys, SAP, Alibaba, Toyota, Siemens, Accenture, etc.
- Expand role dropdown to include more diverse roles
- Allow free-text company input (already supported) and free-text role input

**E. Fetch Job Market Edge Function** (`supabase/functions/fetch-job-market/index.ts`)
- Change default `country` from `'US'` to accept a user-provided country parameter
- Update the `location` default from `'United States'` to be dynamic

---

### 4. Expand Companies, Industries, and Skills

**A. Job Market Heatmap** (`src/pages/JobMarketHeatmap.tsx`)
- Add industries: Healthcare, Finance, Education, Manufacturing, Construction, Agriculture, Legal, Media, Hospitality, Government, Energy, Retail, Transportation, etc.

**B. Salary Estimator** (`src/pages/SalaryEstimator.tsx`)
- Add 15+ more job titles covering non-tech fields: Accountant, Lawyer, Doctor, Teacher, Architect, Journalist, Pharmacist, Supply Chain Manager, etc.

**C. Skills in Heatmap/Mock Data**
- Expand the `commonSkills` list in `fetch-job-market` to include broader skills: Accounting, Nursing, Legal Compliance, Supply Chain, Digital Marketing, Content Creation, etc.

---

### Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/pages/ToolsDashboard.tsx` | Remove Crown badges, keep paywall on click |
| `src/pages/InterviewQuestionBank.tsx` | Global companies, more roles, upvote DB calls |
| `src/pages/SalaryEstimator.tsx` | Global locations, 25+ job titles |
| `src/pages/JobMarketHeatmap.tsx` | Global locations, expanded roles & industries |
| `src/pages/Network.tsx` | Global fallback contact locations |
| `src/pages/IndustryInsights.tsx` | Global mock data locations |
| `supabase/functions/fetch-job-market/index.ts` | Dynamic country, global mock data, expanded skills |
| `supabase/functions/generate-interview-questions/index.ts` | DB caching layer |
| **New migration** | `interview_questions` table |

