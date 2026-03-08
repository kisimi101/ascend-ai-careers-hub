import React from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CompanyLookup } from "@/components/company-research/CompanyLookup";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingTour } from "@/components/OnboardingTour";

const companyTourSteps = [
  { title: "Search a Company", description: "Enter a company name or website URL to pull detailed employer information." },
  { title: "Review Insights", description: "Explore culture, benefits, social links, and industry data to tailor your application." },
  { title: "Save Favorites", description: "Save companies you're interested in to quickly reference them when applying." },
];

const CompanyResearch = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Company Research</h1>
                <p className="text-muted-foreground">
                  Research employers to customize your resume and prepare for interviews
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <CompanyLookup />

          {/* Tips Section */}
          <div className="mt-8 p-6 rounded-xl bg-muted/50 border">
            <h3 className="font-semibold mb-3">💡 Resume Customization Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use company culture keywords in your resume summary</li>
              <li>• Mention specific products or services you're familiar with</li>
              <li>• Align your experience with the company's industry focus</li>
              <li>• Reference recent company news in your cover letter</li>
              <li>• Connect with employees on LinkedIn before applying</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
      <OnboardingTour tourId="company-research" steps={companyTourSteps} />
    </div>
  );
};

export default CompanyResearch;
