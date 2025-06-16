
import { Hero } from "@/components/Hero";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { JobShowcase } from "@/components/JobShowcase";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      <Hero />
      <ResumeTemplates />
      <JobShowcase />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Index;
