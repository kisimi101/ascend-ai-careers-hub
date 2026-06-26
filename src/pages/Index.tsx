import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AnnotatedResumePreview } from "@/components/AnnotatedResumePreview";
import { FloatingCTA } from "@/components/FloatingCTA";
import { FloatingSideTools } from "@/components/FloatingSideTools";
import { ToolsGrid } from "@/components/ToolsGrid";
import { FreeTierCallout } from "@/components/FreeTierCallout";

const DashboardPreview = lazy(() => import("@/components/DashboardPreview").then(m => ({ default: m.DashboardPreview })));
const ResumeTemplates = lazy(() => import("@/components/ResumeTemplates").then(m => ({ default: m.ResumeTemplates })));
const JobShowcase = lazy(() => import("@/components/JobShowcase").then(m => ({ default: m.JobShowcase })));
const Features = lazy(() => import("@/components/Features").then(m => ({ default: m.Features })));
const SkillsAssessment = lazy(() => import("@/components/SkillsAssessment").then(m => ({ default: m.SkillsAssessment })));
const PricingSection = lazy(() => import("@/components/PricingSection").then(m => ({ default: m.PricingSection })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const CTA = lazy(() => import("@/components/CTA").then(m => ({ default: m.CTA })));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>CareerNow — AI Resume Builder & Job Search</title>
        <meta name="description" content="ATS-friendly resume builder, 14+ job boards, smart apply, and interview practice — one connected AI workflow for job seekers." />
        <link rel="canonical" href="https://careernow.xyz/" />
        <meta property="og:title" content="CareerNow — AI Resume Builder & Job Search" />
        <meta property="og:description" content="ATS-friendly resume builder, 14+ job boards, smart apply and interview practice — one connected AI workflow." />
        <meta property="og:url" content="https://careernow.xyz/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CareerNow",
          url: "https://careernow.xyz",
          logo: "https://careernow.xyz/favicon.ico",
          sameAs: ["https://www.careernow.xyz"],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CareerNow",
          url: "https://careernow.xyz",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://careernow.xyz/job-search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        })}</script>
      </Helmet>
      <Navigation />
      <FloatingCTA />
      <FloatingSideTools />
      <Hero />
      <section className="py-16 sm:py-24 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            See What Your Resume Could Look Like
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Every section annotated — built to pass ATS systems and impress recruiters
          </p>
        </div>
        <AnnotatedResumePreview />
      </section>
      <Suspense fallback={<SectionFallback />}>
        <DashboardPreview />
      </Suspense>
      <ToolsGrid />
      <Suspense fallback={<SectionFallback />}>
        <ResumeTemplates />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <JobShowcase />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SkillsAssessment />
      </Suspense>
      <FreeTierCallout />
      <Suspense fallback={<SectionFallback />}>
        <PricingSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTA />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;
