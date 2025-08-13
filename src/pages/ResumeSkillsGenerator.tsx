import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeSkillsGenerator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('');
  const [generatedSkills, setGeneratedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const skillsCategories = {
    technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'],
    soft: ['Leadership', 'Communication', 'Problem-solving', 'Team collaboration', 'Time management'],
    industry: ['Project Management', 'Data Analysis', 'Digital Marketing', 'Customer Service', 'Sales']
  };

  const generateSkills = async () => {
    if (!jobTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job title",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const relevantSkills = [
      ...skillsCategories.technical.slice(0, 4),
      ...skillsCategories.soft.slice(0, 3),
      ...skillsCategories.industry.slice(0, 3)
    ];
    
    setGeneratedSkills(relevantSkills);
    setIsGenerating(false);
    
    toast({
      title: "Skills Generated!",
      description: "Relevant skills have been generated for your profile.",
    });
  };

  const copySkills = () => {
    navigator.clipboard.writeText(generatedSkills.join(', '));
    toast({
      title: "Copied!",
      description: "Skills copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Skills Generator</h1>
          <p className="text-xl text-muted-foreground">
            Generate relevant skills for your resume based on your target role
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate Skills
              </CardTitle>
              <CardDescription>
                Enter your job details to get relevant skills recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Input
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <Input
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Input
                  placeholder="e.g., Entry Level, Mid-Level, Senior"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={generateSkills} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Skills"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Skills</CardTitle>
              <CardDescription>
                Skills tailored for your target position
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedSkills.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {generatedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copySkills} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Skills
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Generated skills will appear here after you click "Generate Skills"
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumeSkillsGenerator;