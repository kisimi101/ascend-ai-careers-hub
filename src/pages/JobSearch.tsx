
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { JobSearchFilters } from "@/components/job-search/JobSearchFilters";
import { JobSearchResults } from "@/components/job-search/JobSearchResults";
import { JobSearchHeader } from "@/components/job-search/JobSearchHeader";
import { QuickApplyLinks } from "@/components/job-search/QuickApplyLinks";
import { ResumeApplyBanner } from "@/components/job-search/ResumeApplyBanner";
import { JobAlertManager } from "@/components/job-search/JobAlertManager";
import { OnboardingTour } from "@/components/OnboardingTour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const jobSearchTourSteps = [
  { title: "Search Jobs", description: "Enter a job title and location to find matching positions across multiple sources." },
  { title: "Filter Results", description: "Use the sidebar filters to narrow down by job type, experience level, and salary range." },
  { title: "Quick Apply", description: "Use the Quick Apply panel to open pre-filled searches on Indeed, LinkedIn, Glassdoor, and more." },
];

interface ResumeData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; summary: string };
  experience: Array<{ company: string; position: string; duration: string; description: string }>;
  skills: string[];
}

const JobSearch = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("loc") || "");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    salary: [],
    remote: false,
    datePosted: "",
    company: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      try { setResumeData(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Auto-search when coming from notification link with query params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.trim()) {
      setSearchQuery(q);
      setLocation(searchParams.get("loc") || "");
      handleSearchJobs(q, searchParams.get("loc") || "");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchJobs = async (query?: string, loc?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) {
      toast({ title: "Please enter a search term", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-jobs", {
        body: { jobTitle: q, location: loc || location, skills: [] },
      });
      if (error) throw error;
      setJobs(data?.jobs || []);
      if ((data?.jobs || []).length === 0) {
        toast({ title: "No jobs found", description: "Try different keywords or location." });
      }
    } catch (err: any) {
      console.error("Search error:", err);
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => handleSearchJobs();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        <JobSearchHeader />
        
        {/* Main Search Bar */}
        <div className="bg-card shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 px-8"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                {isLoading ? "Searching..." : "Search Jobs"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 space-y-4">
              <ResumeApplyBanner resumeData={resumeData} searchQuery={searchQuery} location={location} />
              <JobSearchFilters filters={filters} setFilters={setFilters} />
              <QuickApplyLinks jobTitle={searchQuery} location={location} />
              <JobAlertManager defaultTitle={searchQuery} defaultLocation={location} />
            </div>
            
            {/* Results */}
            <div className="lg:w-3/4">
              <JobSearchResults searchQuery={searchQuery} location={location} filters={filters} />
            </div>
          </div>
        </div>
      </div>

      <OnboardingTour tourId="job-search" steps={jobSearchTourSteps} />
    </div>
  );
};

export default JobSearch;
