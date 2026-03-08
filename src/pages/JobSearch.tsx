
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { JobSearchFilters } from "@/components/job-search/JobSearchFilters";
import { JobSearchResults } from "@/components/job-search/JobSearchResults";
import { JobSearchHeader } from "@/components/job-search/JobSearchHeader";
import { QuickApplyLinks } from "@/components/job-search/QuickApplyLinks";
import { ResumeApplyBanner } from "@/components/job-search/ResumeApplyBanner";
import { OnboardingTour } from "@/components/OnboardingTour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

const jobSearchTourSteps = [
  { title: "Search Jobs", description: "Enter a job title and location to find matching positions across multiple sources." },
  { title: "Filter Results", description: "Use the sidebar filters to narrow down by job type, experience level, and salary range." },
  { title: "Quick Apply", description: "Use the Quick Apply panel to open pre-filled searches on Indeed, LinkedIn, Glassdoor, and more." },
];

const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    salary: [],
    remote: false,
    datePosted: "",
    company: []
  });

  const handleSearch = () => {
    console.log("Searching for jobs:", { searchQuery, location, filters });
  };

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
              >
                <Search className="w-4 h-4 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 space-y-4">
              <JobSearchFilters filters={filters} setFilters={setFilters} />
              <QuickApplyLinks jobTitle={searchQuery} location={location} />
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
