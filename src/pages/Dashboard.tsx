import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  Phone,
  Building2,
  MapPin,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { WeeklyProgressReport } from "@/components/dashboard/WeeklyProgressReport";
import { useJobApplicationsDB } from "@/hooks/useJobApplicationsDB";

interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
}

interface CareerPlan {
  id: string;
  role_title: string;
  industry: string;
  plan_data: {
    milestones?: CareerMilestone[];
    skills?: string[];
    currentSkills?: string[];
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [careerPlans, setCareerPlans] = useState<CareerPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  
  // Use the database hook for job applications
  const { 
    applications, 
    isLoading: isLoadingApps, 
    getStatusCounts, 
    getWeeklyStats 
  } = useJobApplicationsDB();

  useEffect(() => {
    if (user) {
      loadCareerPlans();
    }
  }, [user]);

  const loadCareerPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('career_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const parsedPlans = (data || []).map(plan => ({
        ...plan,
        plan_data: typeof plan.plan_data === 'string' 
          ? JSON.parse(plan.plan_data) 
          : plan.plan_data
      }));
      
      setCareerPlans(parsedPlans);
    } catch (error) {
      console.error('Error loading career plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'phone-screen': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    technical: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    onsite: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    offer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const statusLabels: Record<string, string> = {
    applied: 'Applied',
    'phone-screen': 'Phone Screen',
    technical: 'Technical',
    onsite: 'Onsite',
    offer: 'Offer',
    rejected: 'Rejected'
  };

  const statusCounts = getStatusCounts();
  const weeklyStats = getWeeklyStats();
  const totalApps = applications.length;
  const activeApps = applications.filter(a => !['rejected', 'offer'].includes(a.status)).length;
  const successRate = totalApps > 0 ? Math.round((statusCounts['offer'] || 0) / totalApps * 100) : 0;

  // Get upcoming interviews (applications with interview dates in the future)
  const upcomingInterviews = applications
    .filter(app => app.interview_date && new Date(app.interview_date) >= new Date())
    .sort((a, b) => new Date(a.interview_date!).getTime() - new Date(b.interview_date!).getTime());

  // Get milestones from career plans
  const allMilestones: (CareerMilestone & { planTitle: string })[] = careerPlans.flatMap(plan => 
    (plan.plan_data?.milestones || []).map(m => ({ ...m, planTitle: plan.role_title }))
  );

  const upcomingMilestones = allMilestones
    .filter(m => !m.completed && new Date(m.targetDate) >= new Date())
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 5);

  // Calculate milestone stats
  const milestoneStats = {
    totalMilestones: allMilestones.length,
    completedMilestones: allMilestones.filter(m => m.completed).length,
    upcomingMilestones: upcomingMilestones.length,
    completionRate: allMilestones.length > 0 
      ? Math.round((allMilestones.filter(m => m.completed).length / allMilestones.length) * 100) 
      : 0
  };

  const isLoading = isLoadingApps || isLoadingPlans;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Career Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your job search progress and career milestones
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-enhanced">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-3xl font-bold text-foreground">{totalApps}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Applications</p>
                    <p className="text-3xl font-bold text-foreground">{activeApps}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming Interviews</p>
                    <p className="text-3xl font-bold text-foreground">{upcomingInterviews.length}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-3xl font-bold text-foreground">{successRate}%</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress Report */}
          <div className="mb-6">
            <WeeklyProgressReport 
              weeklyStats={weeklyStats}
              milestoneStats={milestoneStats}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Application Progress */}
            <Card className="lg:col-span-2 card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Application Progress
                  </CardTitle>
                  <CardDescription>Your job application pipeline</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/job-tracker')}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Progress Pipeline */}
                <div className="grid grid-cols-6 gap-2 mb-6">
                  {Object.entries(statusLabels).map(([status, label]) => {
                    const count = statusCounts[status] || 0;
                    const percentage = totalApps > 0 ? (count / totalApps) * 100 : 0;
                    return (
                      <div key={status} className="text-center">
                        <div className="text-2xl font-bold text-foreground">{count}</div>
                        <div className="text-xs text-muted-foreground truncate">{label}</div>
                        <Progress value={percentage} className="mt-2 h-1" />
                      </div>
                    );
                  })}
                </div>

                {/* Recent Applications */}
                <div className="space-y-3">
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No applications yet</p>
                      <Button variant="link" onClick={() => navigate('/job-tracker')} className="mt-2">
                        Add your first application
                      </Button>
                    </div>
                  ) : (
                    applications.slice(0, 4).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background rounded-lg">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{app.position}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              {app.company}
                              {app.location && (
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {app.location}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge className={statusColors[app.status]}>
                          {statusLabels[app.status]}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Interviews
                  </CardTitle>
                  <CardDescription>Your scheduled interviews</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No upcoming interviews</p>
                    <Button variant="link" onClick={() => navigate('/job-tracker')} className="mt-2">
                      Track an application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="p-3 rounded-lg border border-border bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-foreground">{interview.position}</p>
                          <Badge className={statusColors[interview.status]}>
                            {statusLabels[interview.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{interview.company}</p>
                        <div className="flex items-center text-sm text-primary">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(interview.interview_date!).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          <div className="mt-6">
            <DashboardCalendar
              interviews={upcomingInterviews.map((interview) => ({
                id: interview.id,
                company: interview.company,
                position: interview.position,
                interviewDate: interview.interview_date!,
                status: interview.status,
              }))}
              milestones={allMilestones.map((m) => ({
                id: m.id,
                title: m.title,
                targetDate: m.targetDate,
                planTitle: m.planTitle,
                completed: m.completed,
              }))}
            />
          </div>

          {/* Career Milestones */}
          <Card className="mt-6 card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Career Milestones
                </CardTitle>
                <CardDescription>Your career goals and progress</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/career-path-planner')}>
                Plan Career
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingMilestones.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-4">No career milestones set yet</p>
                  <Button onClick={() => navigate('/career-path-planner')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Career Plan
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMilestones.map((milestone) => (
                    <div 
                      key={milestone.id} 
                      className="p-4 rounded-lg border border-border bg-background hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {milestone.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Target className="w-5 h-5 text-primary" />
                          )}
                          <span className="text-xs text-muted-foreground">{milestone.planTitle}</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-foreground mb-1">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {milestone.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        Target: {new Date(milestone.targetDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/resume-builder')}
            >
              <Briefcase className="w-6 h-6" />
              <span>Build Resume</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/job-search')}
            >
              <Target className="w-6 h-6" />
              <span>Search Jobs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/interview-practice')}
            >
              <Phone className="w-6 h-6" />
              <span>Practice Interview</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/linkedin-import')}
            >
              <Building2 className="w-6 h-6" />
              <span>Import LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
