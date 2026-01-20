import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Linkedin, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Download,
  ArrowRight,
  User,
  Briefcase,
  GraduationCap,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LinkedInProfile {
  name: string;
  headline: string;
  summary: string;
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    years: string;
  }[];
  skills: string[];
}

const LinkedInImport = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[\w-]+\/?$/i;
    return linkedinPattern.test(url);
  };

  const scrapeLinkedInProfile = async () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter your LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/yourname)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setProfile(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('scrape-linkedin', {
        body: { url: linkedinUrl }
      });

      if (fnError) throw fnError;

      if (data.success && data.profile) {
        setProfile(data.profile);
        toast({
          title: "Profile Imported!",
          description: "Your LinkedIn profile has been successfully imported",
        });
      } else {
        throw new Error(data.error || "Failed to extract profile information");
      }
    } catch (err) {
      console.error('Error scraping LinkedIn:', err);
      setError(err instanceof Error ? err.message : "Failed to import LinkedIn profile. Please try again.");
      toast({
        title: "Import Failed",
        description: "Could not import your LinkedIn profile. Please ensure the profile is public.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createResumeFromProfile = () => {
    if (!profile) return;

    // Store profile data in localStorage for the resume builder to use
    const resumeData = {
      personalInfo: {
        fullName: profile.name,
        email: "",
        phone: "",
        location: "",
        linkedin: linkedinUrl,
        website: "",
        summary: profile.summary
      },
      experience: profile.experience.map((exp, index) => ({
        id: `exp-${index}`,
        company: exp.company,
        position: exp.title,
        startDate: "",
        endDate: "",
        current: false,
        description: exp.description,
        location: ""
      })),
      education: profile.education.map((edu, index) => ({
        id: `edu-${index}`,
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        startDate: "",
        endDate: "",
        gpa: ""
      })),
      skills: profile.skills
    };

    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
    toast({
      title: "Ready to Build!",
      description: "Your LinkedIn data has been loaded into the Resume Builder",
    });
    
    navigate('/resume-builder');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-300 text-sm font-medium mb-6">
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn Import
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Import Your
              <span className="text-gradient-primary"> LinkedIn Profile</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quickly create a professional resume by importing your LinkedIn profile information.
            </p>
          </div>

          {/* Import Form */}
          <Card className="card-enhanced mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                Enter Your LinkedIn URL
              </CardTitle>
              <CardDescription>
                Make sure your LinkedIn profile is set to public for best results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      id="linkedin-url"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={scrapeLinkedInProfile}
                      disabled={isLoading}
                      className="btn-gradient"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          Import Profile
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Example: linkedin.com/in/johndoe or https://www.linkedin.com/in/johndoe
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Preview */}
          {profile && (
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Profile Imported Successfully
                    </CardTitle>
                    <CardDescription>
                      Review your imported information before creating your resume
                    </CardDescription>
                  </div>
                  <Button onClick={createResumeFromProfile} className="btn-gradient">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Resume
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                          <p className="text-muted-foreground">{profile.headline}</p>
                        </div>
                      </div>
                      {profile.summary && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Summary</h4>
                          <p className="text-muted-foreground">{profile.summary}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="mt-6">
                    <div className="space-y-4">
                      {profile.experience.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No experience found</p>
                      ) : (
                        profile.experience.map((exp, index) => (
                          <div key={index} className="p-4 border border-border rounded-lg">
                            <div className="flex items-start gap-3">
                              <Briefcase className="w-5 h-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                <p className="text-muted-foreground">{exp.company}</p>
                                <p className="text-sm text-muted-foreground">{exp.duration}</p>
                                {exp.description && (
                                  <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="education" className="mt-6">
                    <div className="space-y-4">
                      {profile.education.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No education found</p>
                      ) : (
                        profile.education.map((edu, index) => (
                          <div key={index} className="p-4 border border-border rounded-lg">
                            <div className="flex items-start gap-3">
                              <GraduationCap className="w-5 h-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground">{edu.school}</h4>
                                <p className="text-muted-foreground">{edu.degree} in {edu.field}</p>
                                <p className="text-sm text-muted-foreground">{edu.years}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 w-full">No skills found</p>
                      ) : (
                        profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            <Award className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          {!profile && (
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-muted-foreground">Make sure your LinkedIn profile visibility is set to "Public"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-muted-foreground">Complete all sections of your LinkedIn profile for best results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-muted-foreground">Add detailed job descriptions to capture your full experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-muted-foreground">Include all relevant skills in your LinkedIn Skills section</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LinkedInImport;
