
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { JobSearchFilters } from "@/components/job-search/JobSearchFilters";
import { JobSearchResults } from "@/components/job-search/JobSearchResults";
import { JobSearchHeader } from "@/components/job-search/JobSearchHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20">
        <JobSearchHeader />
        
        {/* Main Search Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <JobSearchFilters filters={filters} setFilters={setFilters} />
            </div>
            
            {/* Results */}
            <div className="lg:w-3/4">
              <JobSearchResults searchQuery={searchQuery} location={location} filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
