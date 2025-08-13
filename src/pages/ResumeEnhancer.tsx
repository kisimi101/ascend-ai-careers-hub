import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wand2, Upload, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeEnhancer = () => {
  const [originalResume, setOriginalResume] = useState('');
  const [enhancedResume, setEnhancedResume] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const enhanceResume = async () => {
    if (!originalResume.trim()) {
      toast({
        title: "Error",
        description: "Please provide your resume content",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock enhanced resume
    const enhanced = originalResume.replace(/\b(managed|handled|worked)\b/gi, (match) => {
      const replacements = {
        managed: 'Led and optimized',
        handled: 'Strategically coordinated',
        worked: 'Collaborated effectively'
      };
      return replacements[match.toLowerCase() as keyof typeof replacements] || match;
    });
    
    const mockAnalysis = {
      overallScore: 85,
      improvements: [
        { category: 'Action Verbs', before: 65, after: 90, improvement: 25 },
        { category: 'Quantifiable Results', before: 70, after: 85, improvement: 15 },
        { category: 'Keywords', before: 60, after: 80, improvement: 20 },
        { category: 'Formatting', before: 75, after: 95, improvement: 20 }
      ],
      suggestions: [
        'Added stronger action verbs to increase impact',
        'Enhanced quantifiable achievements',
        'Improved keyword optimization for ATS systems',
        'Refined formatting for better readability'
      ]
    };
    
    setEnhancedResume(enhanced);
    setAnalysis(mockAnalysis);
    setIsEnhancing(false);
    
    toast({
      title: "Resume Enhanced!",
      description: "Your resume has been optimized for better impact.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Enhancer</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered resume optimization for maximum impact
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Paste your current resume content or upload a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your resume content here..."
                value={originalResume}
                onChange={(e) => setOriginalResume(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button 
                  onClick={enhanceResume} 
                  className="flex-1"
                  disabled={isEnhancing}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isEnhancing ? "Enhancing..." : "Enhance Resume"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Enhancement Analysis</CardTitle>
                <CardDescription>
                  See how your resume has been improved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium">Overall Score</span>
                      <span className="text-lg font-bold text-primary">{analysis.overallScore}%</span>
                    </div>
                    <Progress value={analysis.overallScore} className="h-3" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Improvement Areas</h3>
                      <div className="space-y-3">
                        {analysis.improvements.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{item.before}%</Badge>
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <Badge>{item.after}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Applied Enhancements</h3>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {enhancedResume && (
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Resume</CardTitle>
                <CardDescription>
                  Your optimized resume with AI-powered improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="enhanced" className="w-full">
                  <TabsList>
                    <TabsTrigger value="enhanced">Enhanced Version</TabsTrigger>
                    <TabsTrigger value="original">Original Version</TabsTrigger>
                    <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="enhanced" className="mt-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{enhancedResume}</pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="original" className="mt-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{originalResume}</pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comparison" className="mt-4">
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Original</h4>
                        <div className="bg-muted p-4 rounded-lg h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{originalResume}</pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Enhanced</h4>
                        <div className="bg-muted p-4 rounded-lg h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{enhancedResume}</pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeEnhancer;