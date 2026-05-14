import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Search, FileText, Rocket, Target, BarChart3,
  CheckCircle2, Users, Brain, Zap, Globe2, ArrowRight,
} from "lucide-react";

const aiTools = [
  {
    name: "Smart Apply",
    tagline: "Upload a resume → AI tailors it → batch apply to matching jobs",
    icon: Rocket,
    path: "/smart-apply",
    bullets: ["Resume parsing + ATS optimization", "Auto-generated cover letters", "Applies across 14+ job boards"],
  },
  {
    name: "AI Resume Builder",
    tagline: "ATS-friendly resumes with live AI suggestions",
    icon: FileText,
    path: "/resume-builder",
    bullets: ["6 recruiter-tested templates", "AI bullet & summary writer", "Live ATS score"],
  },
  {
    name: "Job Search Aggregator",
    tagline: "One search across LinkedIn, Indeed, Glassdoor + 11 more",
    icon: Search,
    path: "/job-search",
    bullets: ["14+ boards in one query", "Smart relevance ranking", "Save & track from results"],
  },
  {
    name: "AI Interview Practice",
    tagline: "Mock interviews with real-time feedback",
    icon: Brain,
    path: "/interview-practice",
    bullets: ["Role-specific question sets", "Tone & content scoring", "Improvement suggestions"],
  },
  {
    name: "Job Tracker",
    tagline: "Kanban pipeline for every application",
    icon: Target,
    path: "/job-tracker",
    bullets: ["Status tracking", "Interview reminders", "Application analytics"],
  },
  {
    name: "Job Market Heatmap",
    tagline: "See demand, salary, and growth by role and city",
    icon: BarChart3,
    path: "/job-market-heatmap",
    bullets: ["Live market data", "Salary benchmarks", "Hot-skill trends"],
  },
];

const faqs = [
  {
    q: "What are the best AI job search tools in 2026?",
    a: "The most useful AI job search tools combine resume optimization, job aggregation, and application automation in one workflow. CareerNow's Smart Apply parses your resume, tailors it per role, generates a cover letter, and batch-applies across 14+ boards — replacing what used to take 5–6 separate tools.",
  },
  {
    q: "Are AI job search tools worth it?",
    a: "Yes — when they remove repetitive work. Tailoring a resume and cover letter for one job takes 30–60 minutes manually. AI tools cut this to under 2 minutes per application while keeping ATS pass rates above 90%, which means more applications and more interviews from the same effort.",
  },
  {
    q: "Which job search tool is best for getting past ATS?",
    a: "Look for tools that score your resume against the actual job description (not just generic templates). CareerNow's Resume Checker and Keyword Scanner analyze the target posting and tell you exactly which keywords, sections, and formatting changes will pass the ATS.",
  },
  {
    q: "Can one tool replace Indeed, LinkedIn, and Glassdoor?",
    a: "It can replace the search step. CareerNow aggregates listings from LinkedIn, Indeed, Glassdoor, ZipRecruiter, RemoteOK, We Work Remotely and 8+ other boards into a single search — you still apply on the original site, but you only search once.",
  },
  {
    q: "Are there free AI job search tools?",
    a: "CareerNow's resume builder, resume checker, interview practice, and job tracker are free. Smart Apply, Job Search aggregator, and advanced tools like Job Market Heatmap and Referral Mapper are part of the Pro plan ($12/mo).",
  },
];

const JobSearchToolsLanding = () => {
  const url = "https://careernow.xyz/job-search-tools";
  const title = "Best AI Job Search Tools (2026) — CareerNow";
  const description =
    "The complete AI job search toolkit: resume builder, ATS scanner, job aggregator across 14+ boards, batch apply, mock interviews, and market data — all in one workflow.";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Job Search Tools",
    itemListElement: aiTools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `https://careernow.xyz${t.path}`,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Navigation />

      <main>
        {/* Hero */}
        <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" /> 2026 edition
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Best <span className="text-gradient-primary">AI Job Search Tools</span>, in One Place
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop juggling 6 different sites. CareerNow brings resume optimization, job aggregation,
              batch applying, and interview prep into one connected workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/get-started">
                  Start free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tools">Explore all tools</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Free resume builder · No credit card · 14+ job boards included
            </p>
          </div>
        </section>

        {/* Why one workflow */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
              Why job seekers switch to an integrated AI toolkit
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
              Most "AI job search tools" only solve one step. The win is when every step shares your
              data — your resume, target role, and history flow between every tool.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Apply 10× faster", body: "Tailor resume + cover letter + apply in under 2 minutes per role." },
                { icon: CheckCircle2, title: "90%+ ATS pass rate", body: "Resumes are scanned against the real job description, not a template." },
                { icon: Globe2, title: "14+ job boards, one search", body: "LinkedIn, Indeed, Glassdoor, RemoteOK, We Work Remotely and more." },
              ].map((b) => (
                <Card key={b.title} className="border border-border">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <b.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{b.title}</CardTitle>
                    <CardDescription>{b.body}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tool list */}
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
              The 6 AI job search tools you actually need
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Each tool is built for a specific job — and they all share your data so you never
              copy-paste between apps.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((t) => (
                <Card key={t.name} className="hover:shadow-lg hover:border-primary/30 transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-3">
                      <t.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{t.name}</CardTitle>
                    <CardDescription>{t.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-5">
                      {t.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={t.path}>Try {t.name}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 px-4 sm:px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
              CareerNow vs. job boards alone
            </h2>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Capability</th>
                    <th className="text-center p-4 font-semibold">Indeed / LinkedIn</th>
                    <th className="text-center p-4 font-semibold text-primary">CareerNow</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Search across 14+ boards in one query", false, true],
                    ["AI resume tailoring per job", false, true],
                    ["AI cover letter generation", false, true],
                    ["Batch apply to multiple roles", false, true],
                    ["ATS keyword scoring", false, true],
                    ["Mock interview practice", false, true],
                    ["Application tracker", "Limited", true],
                  ].map(([cap, a, b]) => (
                    <tr key={String(cap)} className="border-t border-border">
                      <td className="p-4 text-foreground">{cap}</td>
                      <td className="p-4 text-center text-muted-foreground">
                        {a === true ? "✓" : a === false ? "—" : a}
                      </td>
                      <td className="p-4 text-center text-primary font-semibold">
                        {b === true ? "✓" : b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
              Frequently asked questions about AI job search tools
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <Card key={f.q}>
                  <CardHeader>
                    <CardTitle className="text-lg">{f.q}</CardTitle>
                    <CardDescription className="text-base text-foreground/80 pt-2">
                      {f.a}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <Users className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Land your next role faster
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of job seekers using CareerNow to optimize every step — from resume to offer.
            </p>
            <Button size="lg" asChild>
              <Link to="/get-started">
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JobSearchToolsLanding;