import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Scan, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeKeywordScanner = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const scanKeywords = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please provide both resume and job description",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResults = {
      matchScore: 75,
      foundKeywords: ['JavaScript', 'React', 'Node.js', 'Project Management', 'Team Leadership'],
      missingKeywords: ['Python', 'AWS', 'Docker', 'Agile', 'Scrum'],
      suggestions: [
        'Add Python experience to your technical skills',
        'Include cloud computing experience (AWS)',
        'Mention Agile/Scrum methodology experience'
      ]
    };
    
    setScanResults(mockResults);
    setIsScanning(false);
    
    toast({
      title: "Scan Complete!",
      description: "Your resume has been analyzed for keyword optimization.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Keyword Scanner</h1>
          <p className="text-xl text-muted-foreground">
            Optimize your resume by scanning for relevant keywords
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Resume</CardTitle>
                <CardDescription>
                  Paste your resume content or upload a file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume File
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>
                  Paste the job description you're targeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={scanKeywords} 
              size="lg"
              disabled={isScanning}
            >
              <Scan className="h-5 w-5 mr-2" />
              {isScanning ? "Scanning..." : "Scan Keywords"}
            </Button>
          </div>

          {scanResults && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scan Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className="text-sm font-medium">{scanResults.matchScore}%</span>
                    </div>
                    <Progress value={scanResults.matchScore} className="h-2" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Found Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {scanResults.foundKeywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {scanResults.missingKeywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="destructive">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Optimization Suggestions</h3>
                    <ul className="space-y-2">
                      {scanResults.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-muted-foreground">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeKeywordScanner;