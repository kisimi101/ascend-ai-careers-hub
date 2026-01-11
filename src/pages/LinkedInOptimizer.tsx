import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Linkedin, Sparkles, CheckCircle, AlertCircle, Lightbulb, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OptimizationResult {
  overallScore: number;
  sections: {
    name: string;
    score: number;
    status: 'good' | 'needs-work' | 'missing';
    suggestions: string[];
  }[];
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  generalTips: string[];
}

const LinkedInOptimizer = () => {
  const [linkedInProfile, setLinkedInProfile] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const { toast } = useToast();

  const analyzeProfile = async () => {
    if (!linkedInProfile.trim() || !resumeContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide both your LinkedIn profile content and resume.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-linkedin', {
        body: { linkedInProfile, resumeContent }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Analysis complete!",
        description: "Your LinkedIn profile has been analyzed."
      });
    } catch (error) {
      console.error('Error analyzing profile:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'needs-work':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'missing':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Suggestion copied to clipboard."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Linkedin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">LinkedIn Optimizer</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Optimize Your LinkedIn Profile</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered analysis to align your LinkedIn profile with your resume and maximize visibility
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn Profile Content
                  </CardTitle>
                  <CardDescription>
                    Paste your LinkedIn headline, about section, and experience descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your LinkedIn profile content here...

Example:
Headline: Senior Software Engineer | React | Node.js | AWS

About:
Passionate software engineer with 5+ years of experience...

Experience:
Software Engineer at Tech Corp
- Led development of..."
                    value={linkedInProfile}
                    onChange={(e) => setLinkedInProfile(e.target.value)}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Content</CardTitle>
                  <CardDescription>
                    Paste your resume content for comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeContent}
                    onChange={(e) => setResumeContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>

              <Button 
                className="w-full" 
                size="lg"
                onClick={analyzeProfile}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze & Optimize
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Overall Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Optimization Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <span className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}%
                        </span>
                      </div>
                      <Progress value={result.overallScore} className="h-3" />
                      <p className="text-center text-muted-foreground mt-2">
                        {result.overallScore >= 80 ? 'Excellent alignment!' : 
                         result.overallScore >= 60 ? 'Good, with room for improvement' : 
                         'Needs significant optimization'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Section Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Section Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.sections.map((section, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(section.status)}
                              <span className="font-medium">{section.name}</span>
                            </div>
                            <Badge variant={section.status === 'good' ? 'default' : 'secondary'}>
                              {section.score}%
                            </Badge>
                          </div>
                          {section.suggestions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {section.suggestions.map((suggestion, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                  <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
                                  <span className="flex-1">{suggestion}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(suggestion)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Keyword Match */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Keyword Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2 text-green-600">✓ Matched Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {result.keywordMatch.matched.map((keyword, idx) => (
                              <Badge key={idx} variant="default" className="bg-green-500">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2 text-red-600">✗ Missing Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {result.keywordMatch.missing.map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="border-red-500 text-red-500">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* General Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.generalTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <Linkedin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground">
                      Enter your LinkedIn profile and resume content to get AI-powered optimization suggestions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LinkedInOptimizer;
