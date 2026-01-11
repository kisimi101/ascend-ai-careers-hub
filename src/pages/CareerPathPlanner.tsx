import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Map, TrendingUp, Clock, DollarSign, BookOpen, Briefcase, 
  ChevronRight, Star, Target, Sparkles, RefreshCw, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CareerPath {
  title: string;
  level: string;
  salaryRange: string;
  yearsExperience: string;
  skills: string[];
  description: string;
  isCurrentRole?: boolean;
}

interface CareerPlan {
  currentRole: CareerPath;
  paths: {
    direction: string;
    description: string;
    timeline: string;
    roles: CareerPath[];
    requiredSkills: string[];
    recommendedCertifications: string[];
  }[];
  insights: string[];
}

const CareerPathPlanner = () => {
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const { toast } = useToast();

  const generateCareerPlan = async () => {
    if (!currentRole || !industry || !yearsExperience) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockPlan: CareerPlan = {
        currentRole: {
          title: currentRole,
          level: yearsExperience === '0-2' ? 'Entry Level' : yearsExperience === '3-5' ? 'Mid Level' : 'Senior Level',
          salaryRange: '$60,000 - $85,000',
          yearsExperience: yearsExperience,
          skills: ['Communication', 'Problem Solving', 'Technical Skills', 'Project Management'],
          description: 'Your current position in the career ladder.',
          isCurrentRole: true
        },
        paths: [
          {
            direction: 'Technical Leadership',
            description: 'Advance your technical expertise while leading teams',
            timeline: '3-5 years',
            roles: [
              {
                title: 'Senior ' + currentRole,
                level: 'Senior',
                salaryRange: '$90,000 - $130,000',
                yearsExperience: '5-7 years',
                skills: ['Advanced Technical Skills', 'Mentoring', 'Architecture Design'],
                description: 'Lead complex technical projects and mentor junior team members.'
              },
              {
                title: 'Lead ' + currentRole.split(' ')[0] + ' Architect',
                level: 'Lead',
                salaryRange: '$130,000 - $170,000',
                yearsExperience: '8-10 years',
                skills: ['System Design', 'Technical Strategy', 'Cross-team Collaboration'],
                description: 'Define technical direction and standards for the organization.'
              },
              {
                title: 'Principal ' + currentRole.split(' ')[0] + ' / CTO',
                level: 'Executive',
                salaryRange: '$170,000 - $250,000+',
                yearsExperience: '12+ years',
                skills: ['Executive Leadership', 'Business Strategy', 'Innovation'],
                description: 'Drive technology vision and strategy at the highest level.'
              }
            ],
            requiredSkills: ['Advanced ' + industry + ' expertise', 'Leadership', 'Strategic Thinking', 'Communication'],
            recommendedCertifications: ['AWS Solutions Architect', 'Google Cloud Professional', 'Certified Scrum Master']
          },
          {
            direction: 'Management Track',
            description: 'Transition into people management and organizational leadership',
            timeline: '4-6 years',
            roles: [
              {
                title: currentRole.split(' ')[0] + ' Team Lead',
                level: 'Lead',
                salaryRange: '$100,000 - $140,000',
                yearsExperience: '5-7 years',
                skills: ['Team Management', 'Project Planning', 'Stakeholder Communication'],
                description: 'Lead a small team while maintaining technical involvement.'
              },
              {
                title: currentRole.split(' ')[0] + ' Manager',
                level: 'Manager',
                salaryRange: '$130,000 - $180,000',
                yearsExperience: '7-10 years',
                skills: ['People Management', 'Budget Planning', 'Strategic Planning'],
                description: 'Manage multiple teams and drive departmental initiatives.'
              },
              {
                title: 'Director of ' + industry,
                level: 'Director',
                salaryRange: '$180,000 - $280,000+',
                yearsExperience: '12+ years',
                skills: ['Executive Communication', 'Organizational Design', 'P&L Management'],
                description: 'Lead entire departments and shape organizational strategy.'
              }
            ],
            requiredSkills: ['People Management', 'Strategic Planning', 'Budget Management', 'Executive Communication'],
            recommendedCertifications: ['PMP', 'MBA', 'Leadership Development Programs']
          },
          {
            direction: 'Specialist / Expert',
            description: 'Become a deep expert in your specific domain',
            timeline: '5-8 years',
            roles: [
              {
                title: currentRole.split(' ')[0] + ' Specialist',
                level: 'Specialist',
                salaryRange: '$95,000 - $135,000',
                yearsExperience: '5-8 years',
                skills: ['Deep Domain Expertise', 'Research', 'Innovation'],
                description: 'Become the go-to expert in a specific area.'
              },
              {
                title: 'Senior ' + industry + ' Consultant',
                level: 'Senior Consultant',
                salaryRange: '$140,000 - $200,000',
                yearsExperience: '8-12 years',
                skills: ['Consulting', 'Client Relations', 'Thought Leadership'],
                description: 'Advise organizations on complex challenges.'
              },
              {
                title: industry + ' Fellow / Distinguished Expert',
                level: 'Fellow',
                salaryRange: '$180,000 - $300,000+',
                yearsExperience: '15+ years',
                skills: ['Industry Recognition', 'Publications', 'Speaking Engagements'],
                description: 'Recognized industry expert and thought leader.'
              }
            ],
            requiredSkills: ['Deep Technical Expertise', 'Research Skills', 'Public Speaking', 'Writing'],
            recommendedCertifications: ['Industry-specific certifications', 'Advanced degrees', 'Published research']
          }
        ],
        insights: [
          'Based on your experience level, focus on building a strong technical foundation before transitioning to leadership.',
          'Consider getting at least one industry certification within the next 12 months to boost your credibility.',
          'Networking is crucial - aim to connect with 5+ professionals in your target role each quarter.',
          'Side projects and open source contributions can accelerate your career progression significantly.',
          'Document your achievements with metrics - this will be valuable for promotions and job applications.'
        ]
      };

      setPlan(mockPlan);
      setIsGenerating(false);
      
      toast({
        title: "Career plan generated!",
        description: "Explore your potential career paths below."
      });
    }, 2500);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'entry level':
        return 'bg-blue-500';
      case 'mid level':
      case 'senior':
        return 'bg-green-500';
      case 'lead':
      case 'manager':
        return 'bg-purple-500';
      case 'director':
      case 'executive':
      case 'fellow':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
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
              <Map className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Career Path Planner</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Visualize Your Career Journey</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered career progression planning with timeline recommendations and skill requirements
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Current Position
              </CardTitle>
              <CardDescription>
                Tell us about your current role to generate personalized career paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Role *</label>
                  <Input
                    placeholder="e.g., Software Engineer"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry *</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Years of Experience *</label>
                  <Select value={yearsExperience} onValueChange={setYearsExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-8">6-8 years</SelectItem>
                      <SelectItem value="9-12">9-12 years</SelectItem>
                      <SelectItem value="12+">12+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Career Goal</label>
                  <Input
                    placeholder="e.g., CTO, Director"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={generateCareerPlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Career Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Career Path
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {plan && (
            <div className="space-y-8">
              {/* Current Role Card */}
              <Card className="border-primary border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Your Current Position
                    </CardTitle>
                    <Badge className={getLevelColor(plan.currentRole.level)}>
                      {plan.currentRole.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{plan.currentRole.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{plan.currentRole.salaryRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{plan.currentRole.yearsExperience} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Paths */}
              <div className="grid lg:grid-cols-3 gap-6">
                {plan.paths.map((path, pathIdx) => (
                  <Card key={pathIdx} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{path.direction}</CardTitle>
                        <Badge variant="outline">{path.timeline}</Badge>
                      </div>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      {/* Career Progression */}
                      <div className="space-y-3">
                        {path.roles.map((role, roleIdx) => (
                          <div 
                            key={roleIdx} 
                            className="relative pl-6 pb-4 border-l-2 border-primary/30 last:border-l-0 last:pb-0"
                          >
                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">{roleIdx + 1}</span>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{role.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {role.level}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                <span className="text-green-600">{role.salaryRange}</span>
                                <span className="mx-2">•</span>
                                <span>{role.yearsExperience}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {role.skills.slice(0, 2).map((skill, sIdx) => (
                                  <Badge key={sIdx} variant="outline" className="text-[10px]">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Required Skills */}
                      <div>
                        <p className="text-sm font-medium mb-2">Key Skills Required:</p>
                        <div className="flex flex-wrap gap-1">
                          {path.requiredSkills.map((skill, sIdx) => (
                            <Badge key={sIdx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <p className="text-sm font-medium mb-2">Recommended Certifications:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {path.recommendedCertifications.map((cert, cIdx) => (
                            <li key={cIdx} className="flex items-center gap-2">
                              <BookOpen className="w-3 h-3" />
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Career Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <ArrowRight className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {!plan && !isGenerating && (
            <Card className="flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center">
                <Map className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Career Plan Yet</h3>
                <p className="text-muted-foreground">
                  Enter your current role and experience to generate personalized career paths
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerPathPlanner;
