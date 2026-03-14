import { lazy, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FloatingCTA } from "@/components/FloatingCTA";
import { FloatingSideTools } from "@/components/FloatingSideTools";

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
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <FloatingSideTools />
      <Hero />
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
    </div>
  );
};

export default Index;
