
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Bookmark, ExternalLink, Building, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobSearchResultsProps {
  searchQuery: string;
  location: string;
  filters: any;
}

export const JobSearchResults = ({ searchQuery, location, filters }: JobSearchResultsProps) => {
  const [sortBy, setSortBy] = useState("relevance");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      postedDate: "2 days ago",
      description: "We're looking for a senior frontend developer to join our team...",
      requirements: ["React", "TypeScript", "5+ years experience"],
      remote: true,
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100,000 - $130,000",
      postedDate: "1 day ago",
      description: "Join our product team to drive innovation and growth...",
      requirements: ["Product Strategy", "Analytics", "3+ years experience"],
      remote: false,
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&h=80&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "Remote",
      type: "Contract",
      salary: "$80,000 - $100,000",
      postedDate: "3 days ago",
      description: "Create amazing user experiences for our clients...",
      requirements: ["Figma", "User Research", "2+ years experience"],
      remote: true,
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop&crop=center"
    }
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Results</h2>
          <p className="text-gray-600">{jobs.length} jobs found</p>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
            <SelectItem value="company">Company A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <img 
                    src={job.logo} 
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>

                {/* Job Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-gray-500 hover:text-orange-600"
                    >
                      <Bookmark 
                        className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current text-orange-600' : ''}`} 
                      />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    {job.remote && <Badge variant="outline" className="text-green-600 border-green-600">Remote</Badge>}
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="outline">{req}</Badge>
                    ))}
                  </div>

                  <p className="text-gray-700 line-clamp-2">{job.description}</p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      Apply Now
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg">
          Load More Jobs
        </Button>
      </div>
    </div>
  );
};
