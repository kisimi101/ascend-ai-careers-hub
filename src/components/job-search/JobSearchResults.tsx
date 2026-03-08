
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Bookmark, ExternalLink, Building, Search, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  description: string;
  source?: string;
  postedDate?: string;
}

interface JobSearchResultsProps {
  searchQuery: string;
  location: string;
  filters: any;
  jobs: Job[];
  isLoading: boolean;
  hasSearched: boolean;
}

export const JobSearchResults = ({ searchQuery, location, filters, jobs, isLoading, hasSearched }: JobSearchResultsProps) => {
  const [sortBy, setSortBy] = useState("relevance");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="text-lg font-medium">Searching for jobs...</p>
        <p className="text-sm">This may take a moment while we scan multiple sources.</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Search className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Search for jobs</p>
        <p className="text-sm">Enter a job title or keywords above to find matching positions.</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Search className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm">Try different keywords or broaden your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Results</h2>
          <p className="text-muted-foreground">{jobs.length} jobs found for "{searchQuery}"</p>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="company">Company A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Job Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Bookmark 
                        className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current text-primary' : ''}`} 
                      />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.postedDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.postedDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.source && <Badge variant="secondary">{job.source}</Badge>}
                  </div>

                  <p className="text-muted-foreground line-clamp-2">{job.description}</p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {job.url && (
                      <Button asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View & Apply
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
