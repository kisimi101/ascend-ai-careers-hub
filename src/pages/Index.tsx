
import { Hero } from "@/components/Hero";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { JobShowcase } from "@/components/JobShowcase";
import { Features } from "@/components/Features";
import { SkillsAssessment } from "@/components/SkillsAssessment";
import { PricingSection } from "@/components/PricingSection";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";
import { FloatingCTA } from "@/components/FloatingCTA";
import { FloatingSideTools } from "@/components/FloatingSideTools";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      <FloatingCTA />
      <FloatingSideTools />
      <Hero />
      <ResumeTemplates />
      <JobShowcase />
      <Features />
      <SkillsAssessment />
      <PricingSection />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Index;
