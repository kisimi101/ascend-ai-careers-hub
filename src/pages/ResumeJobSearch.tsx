
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Briefcase, MapPin, Building2, ExternalLink, 
  Loader2, FileText, Sparkles, Clock, BookmarkPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  source: string;
  postedDate: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
}

const ResumeJobSearch = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationOverride, setLocationOverride] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load resume data from localStorage
    const savedResume = localStorage.getItem('resumeData');
    if (savedResume) {
      try {
        setResumeData(JSON.parse(savedResume));
      } catch (e) {
        console.error("Error parsing resume data:", e);
      }
    }

    // Load saved jobs
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const searchJobs = async () => {
    if (!resumeData) {
      toast.error("Please build your resume first");
      return;
    }

    setIsSearching(true);
    
    try {
      // Extract key info from resume
      const latestJob = resumeData.experience?.[0];
      const jobTitle = latestJob?.position || "Professional";
      const skills = resumeData.skills || [];
      const location = locationOverride || resumeData.personalInfo?.location || "";

      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: { 
          skills,
          jobTitle,
          location,
          experience: resumeData.experience?.length || 0
        }
      });

      if (error) throw error;
      setJobs(data.jobs || []);
      toast.success(`Found ${data.jobs?.length || 0} matching jobs!`);
    } catch (error) {
      console.error("Job search error:", error);
      // Fallback mock data
      setJobs([
        {
          id: "1",
          title: resumeData?.experience?.[0]?.position || "Software Developer",
          company: "Tech Innovators Inc",
          location: locationOverride || resumeData?.personalInfo?.location || "Remote",
          url: "https://example.com/job1",
          description: "Looking for experienced professionals to join our growing team...",
          source: "LinkedIn",
          postedDate: "2 days ago"
        },
        {
          id: "2",
          title: "Senior " + (resumeData?.experience?.[0]?.position || "Developer"),
          company: "StartupXYZ",
          location: "San Francisco, CA",
          url: "https://example.com/job2",
          description: "Exciting opportunity to work on cutting-edge technology...",
          source: "Indeed",
          postedDate: "1 week ago"
        },
        {
          id: "3",
          title: resumeData?.experience?.[0]?.position || "Full Stack Developer",
          company: "Global Tech Solutions",
          location: "New York, NY (Hybrid)",
          url: "https://example.com/job3",
          description: "Join our diverse team building enterprise solutions...",
          source: "Glassdoor",
          postedDate: "3 days ago"
        }
      ]);
      toast.info("Showing sample results");
    } finally {
      setIsSearching(false);
    }
  };

  const saveJob = (jobId: string) => {
    const newSaved = savedJobs.includes(jobId) 
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(newSaved);
    localStorage.setItem('savedJobs', JSON.stringify(newSaved));
    toast.success(savedJobs.includes(jobId) ? "Job removed" : "Job saved!");
  };

  const goToJobTracker = (job: Job) => {
    // Navigate to job tracker with pre-filled data
    navigate('/job-tracker', { 
      state: { 
        newJob: {
          company: job.company,
          position: job.title,
          location: job.location,
          notes: job.url
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Job Search</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Jobs Based on Your Resume
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We analyze your resume to find the best matching job opportunities for your skills and experience
            </p>
          </div>

          {!resumeData ? (
            <Card className="max-w-lg mx-auto">
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Resume Found</h3>
                <p className="text-muted-foreground mb-6">
                  Build your resume first to get personalized job recommendations
                </p>
                <Button onClick={() => navigate('/resume-builder')} className="btn-gradient">
                  <FileText className="w-4 h-4 mr-2" />
                  Build Your Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Resume Summary Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Your Resume Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Latest Role</h4>
                      <p className="text-foreground">
                        {resumeData.experience?.[0]?.position || "Not specified"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        at {resumeData.experience?.[0]?.company || "Company"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Top Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills?.slice(0, 5).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Location Override</h4>
                      <Input
                        placeholder={resumeData.personalInfo?.location || "Any location"}
                        value={locationOverride}
                        onChange={(e) => setLocationOverride(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <Button 
                      onClick={searchJobs}
                      disabled={isSearching}
                      className="btn-gradient"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Find Matching Jobs
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/resume-builder')}>
                      Edit Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Results */}
              {jobs.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {jobs.length} Jobs Found for You
                  </h2>

                  <div className="grid gap-4">
                    {jobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg text-foreground">{job.title}</h3>
                                <Badge variant="outline">{job.source}</Badge>
                              </div>
                              <p className="text-muted-foreground flex items-center gap-1 mb-1">
                                <Building2 className="w-4 h-4" />
                                {job.company}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                                <Clock className="w-3 h-3" />
                                {job.postedDate}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {job.description}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant={savedJobs.includes(job.id) ? "secondary" : "outline"}
                                size="icon"
                                onClick={() => saveJob(job.id)}
                              >
                                <BookmarkPlus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex gap-2">
                            <Button asChild className="flex-1">
                              <a href={job.url} target="_blank" rel="noopener noreferrer">
                                View Job
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => goToJobTracker(job)}
                            >
                              Track Application
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeJobSearch;
