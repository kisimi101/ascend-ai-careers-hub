
import { Hero } from "@/components/Hero";
import { DashboardPreview } from "@/components/DashboardPreview";
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
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <FloatingSideTools />
      <Hero />
      <DashboardPreview />
      <ResumeTemplates />
      <JobShowcase />
      <Features />
      <SkillsAssessment />
      <PricingSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
