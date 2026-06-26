import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, Star, Download } from "lucide-react";
import { ModernTemplate } from "@/components/resume-builder/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/resume-builder/templates/ClassicTemplate";
import { TechTemplate } from "@/components/resume-builder/templates/TechTemplate";
import { CreativeTemplate } from "@/components/resume-builder/templates/CreativeTemplate";
import { ExecutiveTemplate } from "@/components/resume-builder/templates/ExecutiveTemplate";
import { MinimalistTemplate } from "@/components/resume-builder/templates/MinimalistTemplate";
import { ResumeData } from "@/components/resume-builder/types";

const sample: ResumeData = {
  personalInfo: { fullName: "Alex Johnson", email: "alex@email.com", phone: "+1 555-0123", location: "San Francisco, CA", summary: "Results-driven professional with 5+ years of experience delivering measurable impact." },
  experience: [
    { company: "Tech Corp", position: "Senior Developer", duration: "2021 - Present", description: "Led a team of 8 engineers building scalable microservices." },
    { company: "StartupCo", position: "Software Engineer", duration: "2019 - 2021", description: "Built core product features serving 100K+ users." },
  ],
  education: [{ institution: "MIT", degree: "B.S. Computer Science", year: "2019" }],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  sectionOrder: ["summary", "experience", "education", "skills"],
};

const TEMPLATES = [
  { id: "modern-professional", name: "Modern Professional", desc: "Clean, ATS-friendly. Best for corporate roles.", ats: 95, accent: "#2563eb", Comp: ModernTemplate, best: "PMs, analysts, operations" },
  { id: "classic-minimal", name: "Classic Minimal", desc: "Timeless layout, modern type. Recruiter favorite.", ats: 98, accent: "#374151", Comp: ClassicTemplate, best: "Finance, legal, consulting" },
  { id: "tech-specialist", name: "Tech Specialist", desc: "Built for engineers and technical roles.", ats: 97, accent: "#059669", Comp: TechTemplate, best: "SWE, data, devops" },
  { id: "creative-designer", name: "Creative Designer", desc: "Bolder layout for design and creative.", ats: 85, accent: "#6d28d9", Comp: CreativeTemplate, best: "UX, brand, content" },
  { id: "executive", name: "Executive", desc: "Commanding header for senior leadership.", ats: 96, accent: "#1e293b", Comp: ExecutiveTemplate, best: "Director / VP / C-suite" },
  { id: "minimalist", name: "Minimalist", desc: "Maximum whitespace, calm and elegant.", ats: 99, accent: "#737373", Comp: MinimalistTemplate, best: "Academic, research, writers" },
];

export default function FreeResumeTemplatesHub() {
  const url = "https://careernow.xyz/free-resume-templates";
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: TEMPLATES.map((t, i) => ({
      "@type": "ListItem", position: i + 1, name: t.name, url: `https://careernow.xyz/resume-builder?template=${t.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Resume Templates (ATS-Friendly) — CareerNow</title>
        <meta name="description" content="Download free, ATS-friendly resume templates. 6 recruiter-tested designs you can edit, tailor with AI, and export. No sign-up to preview." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Free Resume Templates (ATS-Friendly)" />
        <meta property="og:description" content="6 free, ATS-friendly resume templates with live AI tailoring and instant preview." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
      </Helmet>
      <Navigation />
      <main>
        <section className="px-4 sm:px-6 pt-12 pb-10 sm:pt-20 text-center">
          <div className="container mx-auto max-w-4xl">
            <Badge className="mb-4">100% free · ATS-friendly · 2026</Badge>
            <h1 className="text-4xl sm:text-6xl font-bold mb-5 tracking-tight">Free Resume Templates that Actually Pass ATS</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six recruiter-tested templates. Edit free, tailor with AI, and export when you're ready. Every template is single-column, parseable, and ATS-safe.
            </p>
            <div className="flex gap-3 justify-center mt-7">
              <Button asChild size="lg"><Link to="/resume-builder">Open the builder <ArrowRight className="ml-1 w-4 h-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/ai-resume-builder">See AI features</Link></Button>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-12">
          <div className="container mx-auto max-w-6xl">
            <h2 className="sr-only">Browse free resume templates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map(({ id, name, desc, ats, accent, Comp, best }) => (
              <Card key={id} className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-72 relative overflow-hidden bg-white border-b">
                  <div className="origin-top-left pointer-events-none" style={{ transform: "scale(0.34)", width: "700px", height: "900px" }}>
                    <Comp resumeData={sample} accentColor={accent} />
                  </div>
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs bg-background/80 backdrop-blur-sm">
                    <Shield size={10} className="mr-1" /> ATS {ats}%
                  </Badge>
                </div>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Best for:</span> {best}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" fill="currentColor" /> 4.8 / 5</span>
                    <span className="flex items-center gap-1"><Download size={12} /> Free download</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm"><Link to={`/resume-builder?template=${id}`}>Use template</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link to="/resume-examples">Preview</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What makes a resume template "ATS-friendly"?</h2>
            <p className="text-muted-foreground mb-6">
              Single-column layouts, parseable fonts, no text trapped inside images or tables, clear section headers, and consistent date formats. Every template here checks all five boxes — verified by our live ATS scanner.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-left text-sm">
              {["Single-column structure recruiters' parsers can read", "Standard headings (Experience, Education, Skills)", "No images, icons, or columns blocking content"].map((b) => (
                <Card key={b}><CardContent className="p-4 text-muted-foreground">{b}</CardContent></Card>
              ))}
            </div>
            <div className="mt-8 flex gap-3 justify-center flex-wrap">
              <Button asChild><Link to="/resume-builder">Start free in the builder</Link></Button>
              <Button asChild variant="outline"><Link to="/resume-checker">Score my existing resume</Link></Button>
              <Button asChild variant="ghost"><Link to="/ai-resume-builder">AI resume builder →</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}