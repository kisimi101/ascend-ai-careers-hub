import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, ArrowRight, FileText, Code2, Briefcase, GraduationCap, Stethoscope, Megaphone, ChefHat, HardHat } from "lucide-react";

const ROLE_SECTIONS = [
  { icon: Code2, role: "Software Engineer", path: "/resume-builder?role=software-engineer", blurb: "Tech stacks, system design wins, and impact metrics that pass tech ATS filters." },
  { icon: Briefcase, role: "Product Manager", path: "/resume-builder?role=product-manager", blurb: "Outcome-led bullets, roadmap impact, cross-functional ownership." },
  { icon: Megaphone, role: "Marketing & Growth", path: "/resume-builder?role=marketing", blurb: "Campaign metrics, CAC/LTV, channel performance with quantified results." },
  { icon: GraduationCap, role: "New Graduate", path: "/resume-builder?role=new-grad", blurb: "Coursework, internships, projects framed for entry-level recruiters." },
  { icon: Stethoscope, role: "Healthcare", path: "/resume-builder?role=healthcare", blurb: "Licenses, patient outcomes, EMR systems, and compliance keywords." },
  { icon: ChefHat, role: "Hospitality & Service", path: "/resume-builder?role=hospitality", blurb: "Customer satisfaction, throughput, team leadership and cross-training." },
  { icon: HardHat, role: "Skilled Trades", path: "/resume-builder?role=trades", blurb: "Certifications, safety record, equipment, and project scope." },
  { icon: FileText, role: "Career Switcher", path: "/resume-builder?role=switcher", blurb: "Translate transferable skills into the language of your new industry." },
];

const FEATURES = [
  "100% free to build, edit, and preview — no credit card",
  "AI rewrites bullets with action verbs + quantified impact",
  "Real-time ATS score against any job description",
  "6 recruiter-tested templates, ATS-safe layouts",
  "Auto keyword matching tailored to the role you target",
  "Export-ready preview before you ever pay anything",
];

const FAQS = [
  { q: "Is this AI resume builder really free?", a: "Yes. You can build, preview, and refine your AI-tailored resume for free. PDF/DOCX exports are part of our Pro plan, but the build experience and preview are 100% free." },
  { q: "How is an AI resume builder different from a template?", a: "Templates only handle layout. Our AI rewrites your bullets, infers missing keywords from the job description, and scores your resume against ATS rules in real time." },
  { q: "Will it pass Applicant Tracking Systems (ATS)?", a: "All templates are ATS-safe (single-column, parseable fonts, no images blocking text). Each resume gets a live ATS score and concrete fixes." },
  { q: "Can I tailor one resume for different roles?", a: "Yes — paste any job description and the AI re-tailors the summary, skills, and bullets in seconds. No need to maintain separate files." },
];

export default function AiResumeBuilderLanding() {
  const url = "https://careernow.xyz/ai-resume-builder";
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free AI Resume Builder — Tailored to Any Role | CareerNow</title>
        <meta name="description" content="Free AI resume builder with role-based templates, live ATS scoring, and instant tailoring to any job description. Build a recruiter-ready resume in minutes." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Free AI Resume Builder — Tailored to Any Role" />
        <meta property="og:description" content="Build an ATS-friendly resume free. AI tailors bullets, skills, and summary to your target role." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <Navigation />
      <main>
        {/* HERO */}
        <section className="px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="container mx-auto max-w-5xl text-center">
            <Badge className="mb-5"><Sparkles className="w-3 h-3 mr-1" /> Free AI Resume Builder · 2026</Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
              Build a Resume the <span className="text-gradient-primary">AI Wrote With You</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The free AI resume builder that tailors your bullets, skills, and summary to any role — and scores you against ATS in real time.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg"><Link to="/resume-builder">Start free <ArrowRight className="ml-1 w-4 h-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/tailored-resume">Try AI tailoring</Link></Button>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl mx-auto text-sm text-muted-foreground">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2 text-left">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROLE-BASED ENTRIES */}
        <section className="px-4 sm:px-6 py-16 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">Pick your role — we'll do the rest</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
              Each entry pre-loads industry keywords, action verbs, and metric prompts proven to convert recruiters and pass ATS scans.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLE_SECTIONS.map(({ icon: Icon, role, blurb, path }) => (
                <Link key={role} to={path}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/40 transition-all">
                    <CardHeader className="pb-3">
                      <Icon className="w-8 h-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{role}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{blurb}</CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-4 sm:px-6 py-16">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">How the free AI resume builder works</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { n: 1, t: "Pick your role", d: "Choose from engineer, PM, healthcare, trades, new-grad and more — each pre-loads the right keywords." },
                { n: 2, t: "Paste a job description", d: "Optional. The AI mirrors the JD's language so your resume matches what recruiters and ATS look for." },
                { n: 3, t: "Preview & refine free", d: "Live ATS score, missing-keyword alerts, and AI rewrites — all before you spend a cent." },
              ].map(({ n, t, d }) => (
                <Card key={n}>
                  <CardHeader>
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">{n}</div>
                    <CardTitle className="text-lg">{t}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{d}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 py-16 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">FAQ — Free AI Resume Builder</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <Card key={q}>
                  <CardHeader><CardTitle className="text-lg">{q}</CardTitle></CardHeader>
                  <CardContent className="text-muted-foreground">{a}</CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild size="lg"><Link to="/resume-builder">Build my free AI resume <ArrowRight className="ml-1 w-4 h-4" /></Link></Button>
              <p className="text-xs text-muted-foreground mt-3">
                See also: <Link to="/free-resume-templates" className="underline">free resume templates</Link> · <Link to="/job-search-tools" className="underline">AI job search tools</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}