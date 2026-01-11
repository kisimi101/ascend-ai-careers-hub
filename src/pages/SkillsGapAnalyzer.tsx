import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Sparkles, BookOpen, ExternalLink, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LearningResource {
  title: string;
  platform: string;
  url: string;
  type: 'course' | 'tutorial' | 'certification' | 'book';
  duration: string;
}

interface SkillGap {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  currentLevel: number;
  requiredLevel: number;
  resources: LearningResource[];
}

interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  gapAnalysis: SkillGap[];
  learningPath: {
    phase: string;
    duration: string;
    skills: string[];
    description: string;
  }[];
  careerTips: string[];
}

const SkillsGapAnalyzer = () => {
  const [resumeSkills, setResumeSkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeGap = async () => {
    if (!resumeSkills.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide your skills and the job description.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-skills-gap', {
        body: { resumeSkills, jobDescription, targetRole }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Analysis complete!",
        description: "Your skills gap has been analyzed."
      });
    } catch (error) {
      console.error('Error analyzing skills gap:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-500';
      case 'important':
        return 'bg-yellow-500';
      case 'nice-to-have':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
        return '📚';
      case 'tutorial':
        return '🎥';
      case 'certification':
        return '🏆';
      case 'book':
        return '📖';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Skills Gap Analyzer</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Identify Your Skills Gap</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare your skills against job requirements and get personalized learning paths
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Target Role</CardTitle>
                  <CardDescription>
                    What position are you aiming for?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g., Senior Software Engineer, Product Manager..."
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Current Skills</CardTitle>
                  <CardDescription>
                    List your skills from your resume or enter them manually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="JavaScript, React, Node.js, Python, SQL, Project Management, Agile, Leadership..."
                    value={resumeSkills}
                    onChange={(e) => setResumeSkills(e.target.value)}
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                  <CardDescription>
                    Paste the job posting you're interested in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>

              <Button 
                className="w-full" 
                size="lg"
                onClick={analyzeGap}
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
                    Analyze Skills Gap
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Match Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Skills Match Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <span className={`text-5xl font-bold ${
                          result.matchScore >= 80 ? 'text-green-500' :
                          result.matchScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {result.matchScore}%
                        </span>
                      </div>
                      <Progress value={result.matchScore} className="h-3" />
                    </CardContent>
                  </Card>

                  {/* Matched Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Skills You Have
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.matchedSkills.map((skill, idx) => (
                          <Badge key={idx} variant="default" className="bg-green-500">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gap Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Skills to Develop
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.gapAnalysis.map((gap, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{gap.skill}</span>
                              <Badge className={getImportanceColor(gap.importance)}>
                                {gap.importance}
                              </Badge>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-muted-foreground mb-1">
                              <span>Current: {gap.currentLevel}%</span>
                              <span>Required: {gap.requiredLevel}%</span>
                            </div>
                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="absolute h-full bg-primary/50 rounded-full"
                                style={{ width: `${gap.requiredLevel}%` }}
                              />
                              <div 
                                className="absolute h-full bg-primary rounded-full"
                                style={{ width: `${gap.currentLevel}%` }}
                              />
                            </div>
                          </div>
                          {gap.resources.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Recommended Resources:</p>
                              {gap.resources.slice(0, 2).map((resource, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <span>{getResourceIcon(resource.type)}</span>
                                  <span>{resource.title}</span>
                                  <span className="text-muted-foreground">({resource.platform})</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Learning Path */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Suggested Learning Path
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.learningPath.map((phase, idx) => (
                          <div key={idx} className="relative pl-6 pb-4 border-l-2 border-primary/30 last:border-l-0">
                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                            <div className="mb-1">
                              <span className="font-medium">{phase.phase}</span>
                              <span className="text-sm text-muted-foreground ml-2">({phase.duration})</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {phase.skills.map((skill, sIdx) => (
                                <Badge key={sIdx} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Career Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.careerTips.map((tip, idx) => (
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
                    <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground">
                      Enter your skills and target job description to identify gaps and get a learning path
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

export default SkillsGapAnalyzer;
