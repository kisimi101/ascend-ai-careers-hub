import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, Clock, DollarSign, BookOpen, Briefcase, Sparkles, Loader2, 
  Target, ArrowRight, CheckCircle2, Circle, Star, GraduationCap, Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Milestone {
  id: string;
  year: number;
  title: string;
  level: string;
  salaryRange: string;
  skills: string[];
  certifications: string[];
  description: string;
  isCurrent?: boolean;
  isAchieved?: boolean;
}

interface CareerTimeline {
  milestones: Milestone[];
  totalYears: number;
  peakSalary: string;
  insights: string[];
}

const CareerTimelinePage = () => {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [yearsExp, setYearsExp] = useState('3');
  const [industry, setIndustry] = useState('technology');
  const [timeline, setTimeline] = useState<CareerTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeline = async () => {
    if (!currentRole || !targetRole) {
      toast({ title: 'Required', description: 'Enter current and target roles', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-career-timeline', {
        body: { currentRole, targetRole, yearsExperience: yearsExp, industry }
      });

      if (!error && data?.milestones) {
        setTimeline(data);
      } else {
        setTimeline(generateFallbackTimeline());
      }
    } catch {
      setTimeline(generateFallbackTimeline());
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackTimeline = (): CareerTimeline => {
    const years = parseInt(yearsExp);
    const milestones: Milestone[] = [
      {
        id: '1', year: 0, title: currentRole || 'Current Role', level: 'Current',
        salaryRange: '$70k - $90k', skills: ['Core fundamentals', 'Team collaboration', 'Basic tooling'],
        certifications: [], description: 'Your current position — building foundational expertise.', isCurrent: true, isAchieved: true,
      },
      {
        id: '2', year: years + 1, title: `Senior ${currentRole.replace(/junior|jr\.?/gi, '').trim() || 'Professional'}`, level: 'Mid-Senior',
        salaryRange: '$100k - $130k', skills: ['Mentoring', 'Architecture decisions', 'Cross-team collaboration', 'Technical leadership'],
        certifications: ['AWS Solutions Architect', 'PMP'], description: 'Lead projects end-to-end and mentor junior team members.',
        isAchieved: false,
      },
      {
        id: '3', year: years + 3, title: `Lead / Staff ${industry === 'technology' ? 'Engineer' : 'Professional'}`, level: 'Senior',
        salaryRange: '$130k - $170k', skills: ['System design', 'Strategic planning', 'Org-level impact', 'Stakeholder management'],
        certifications: ['Domain-specific advanced cert'], description: 'Drive organization-level technical direction and strategy.',
        isAchieved: false,
      },
      {
        id: '4', year: years + 5, title: targetRole || 'Target Role', level: 'Target',
        salaryRange: '$170k - $250k+', skills: ['Executive leadership', 'P&L responsibility', 'Industry thought leadership', 'Team building at scale'],
        certifications: ['MBA (optional)', 'Executive education'], description: 'Your target destination — leading at the highest level.',
        isAchieved: false,
      },
    ];
    return {
      milestones,
      totalYears: years + 5,
      peakSalary: '$250k+',
      insights: [
        'Focus on high-impact projects that demonstrate leadership potential',
        'Build a professional network through conferences and industry groups',
        'Consider an advanced degree or executive education program',
        'Seek sponsorship from senior leaders who can advocate for your promotion',
        'Develop T-shaped skills — deep in one area, broad across many',
      ],
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Career Progression Timeline
          </h1>
          <p className="text-muted-foreground mt-1">AI-predicted career path with milestones and skill requirements</p>
        </div>

        {/* Input Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Current Role</label>
                <Input placeholder="e.g. Junior Developer" value={currentRole} onChange={e => setCurrentRole(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Target Role</label>
                <Input placeholder="e.g. VP Engineering" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Years Experience</label>
                <Select value={yearsExp} onValueChange={setYearsExp}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,5,7,10,15].map(y => <SelectItem key={y} value={String(y)}>{y} years</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={generateTimeline} disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generate Path
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card><CardContent className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-3" /><p className="text-muted-foreground">Mapping your career trajectory...</p></CardContent></Card>
        )}

        {timeline && !isLoading && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Clock className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold">{timeline.totalYears} years</p><p className="text-xs text-muted-foreground">Estimated timeline</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="w-5 h-5 text-green-600" /></div>
                  <div><p className="text-2xl font-bold">{timeline.peakSalary}</p><p className="text-xs text-muted-foreground">Peak salary potential</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10"><Target className="w-5 h-5 text-blue-600" /></div>
                  <div><p className="text-2xl font-bold">{timeline.milestones.length}</p><p className="text-xs text-muted-foreground">Key milestones</p></div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <div className="relative mb-8">
              {timeline.milestones.map((milestone, i) => (
                <div key={milestone.id} className="flex gap-6 mb-8 last:mb-0">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      milestone.isCurrent ? 'bg-primary text-primary-foreground' :
                      milestone.isAchieved ? 'bg-green-500 text-white' : 'bg-muted border-2 border-dashed border-muted-foreground/30'
                    }`}>
                      {milestone.isAchieved ? <CheckCircle2 className="w-5 h-5" /> : 
                       milestone.isCurrent ? <Star className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    {i < timeline.milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[40px] ${milestone.isAchieved ? 'bg-green-500' : 'bg-muted-foreground/20 border-l border-dashed'}`} />
                    )}
                  </div>
                  {/* Content */}
                  <Card className={`flex-1 ${milestone.isCurrent ? 'border-primary shadow-md' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="secondary" className="text-xs mb-1">Year {milestone.year} • {milestone.level}</Badge>
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <CardDescription>{milestone.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-sm font-bold shrink-0">
                          <DollarSign className="w-3 h-3 mr-0.5" />{milestone.salaryRange}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Key Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {milestone.skills.map((s, j) => <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>)}
                          </div>
                        </div>
                        {milestone.certifications.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><Award className="w-3 h-3" /> Certifications</p>
                            <div className="flex flex-wrap gap-1.5">
                              {milestone.certifications.map((c, j) => <Badge key={j} variant="outline" className="text-xs"><GraduationCap className="w-3 h-3 mr-1" />{c}</Badge>)}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {timeline.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CareerTimelinePage;
