
import { Hero } from "@/components/Hero";
import { ResumeTemplates } from "@/components/ResumeTemplates";
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
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Index;
