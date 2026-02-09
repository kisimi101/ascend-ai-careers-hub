import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  User, Briefcase, Bell, Clock, Trash2, Eye, Edit, 
  Plus, Mail, MapPin, DollarSign, Globe, Settings, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, languages, LanguageCode } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface CareerPlan {
  id: string;
  role_title: string;
  industry: string;
  years_experience: string;
  career_goal: string;
  created_at: string;
}

interface Portfolio {
  id: string;
  name: string;
  title: string;
  template: string;
  is_public: boolean;
  created_at: string;
}

interface JobAlert {
  id: string;
  job_title: string;
  location: string;
  industry: string;
  salary_min: number | null;
  salary_max: number | null;
  is_active: boolean;
  email_frequency: string;
}

interface UserProgress {
  id: string;
  tool_name: string;
  action_type: string;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [careerPlans, setCareerPlans] = useState<CareerPlan[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [activityHistory, setActivityHistory] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // New job alert form
  const [newAlert, setNewAlert] = useState({
    job_title: '',
    location: '',
    industry: '',
    salary_min: '',
    salary_max: '',
    email_frequency: 'daily'
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const [careerPlansRes, portfoliosRes, jobAlertsRes, progressRes] = await Promise.all([
        supabase.from('career_plans').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolios').select('*').order('created_at', { ascending: false }),
        supabase.from('job_alerts').select('*').order('created_at', { ascending: false }),
        supabase.from('user_progress').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      if (careerPlansRes.data) setCareerPlans(careerPlansRes.data);
      if (portfoliosRes.data) setPortfolios(portfoliosRes.data);
      if (jobAlertsRes.data) setJobAlerts(jobAlertsRes.data);
      if (progressRes.data) setActivityHistory(progressRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJobAlert = async () => {
    if (!newAlert.job_title) {
      toast({
        title: 'Job title required',
        description: 'Please enter a job title for your alert.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('job_alerts').insert({
        user_id: user?.id,
        job_title: newAlert.job_title,
        location: newAlert.location || null,
        industry: newAlert.industry || null,
        salary_min: newAlert.salary_min ? parseInt(newAlert.salary_min) : null,
        salary_max: newAlert.salary_max ? parseInt(newAlert.salary_max) : null,
        email_frequency: newAlert.email_frequency
      });

      if (error) throw error;

      toast({
        title: 'Job alert created!',
        description: 'You will receive email notifications for matching jobs.'
      });

      setNewAlert({
        job_title: '',
        location: '',
        industry: '',
        salary_min: '',
        salary_max: '',
        email_frequency: 'daily'
      });

      fetchUserData();
    } catch (error) {
      console.error('Error creating job alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job alert. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('job_alerts')
        .update({ is_active: !isActive })
        .eq('id', alertId);

      if (error) throw error;

      setJobAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_active: !isActive } : alert
        )
      );

      toast({
        title: isActive ? 'Alert paused' : 'Alert activated',
        description: isActive ? 'You will no longer receive notifications.' : 'You will now receive job notifications.'
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase.from('job_alerts').delete().eq('id', alertId);
      if (error) throw error;

      setJobAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: 'Alert deleted',
        description: 'Job alert has been removed.'
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleDeleteCareerPlan = async (planId: string) => {
    try {
      const { error } = await supabase.from('career_plans').delete().eq('id', planId);
      if (error) throw error;

      setCareerPlans(prev => prev.filter(plan => plan.id !== planId));
      toast({
        title: 'Career plan deleted',
        description: 'Your career plan has been removed.'
      });
    } catch (error) {
      console.error('Error deleting career plan:', error);
    }
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      const { error } = await supabase.from('portfolios').delete().eq('id', portfolioId);
      if (error) throw error;

      setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
      toast({
        title: 'Portfolio deleted',
        description: 'Your portfolio has been removed.'
      });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t.profile.myProfile}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="portfolios" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="portfolios" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Portfolios</span>
              </TabsTrigger>
              <TabsTrigger value="career-plans" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Career Plans</span>
              </TabsTrigger>
              <TabsTrigger value="job-alerts" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Job Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Portfolios Tab */}
            <TabsContent value="portfolios">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t.profile.savedPortfolios}</CardTitle>
                      <CardDescription>Manage your portfolio projects</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/portfolio-builder')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {portfolios.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No portfolios yet. Create your first one!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{portfolio.name || 'Untitled Portfolio'}</h3>
                            <p className="text-sm text-muted-foreground">{portfolio.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{portfolio.template}</Badge>
                              <Badge variant={portfolio.is_public ? 'default' : 'secondary'}>
                                {portfolio.is_public ? 'Public' : 'Private'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(portfolio.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio-builder')}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePortfolio(portfolio.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Career Plans Tab */}
            <TabsContent value="career-plans">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t.profile.savedCareerPlans}</CardTitle>
                      <CardDescription>Your saved career progression plans</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/career-path-planner')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {careerPlans.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No career plans yet. Start planning your career!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {careerPlans.map((plan) => (
                        <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{plan.role_title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{plan.industry}</Badge>
                              <Badge variant="secondary">{plan.years_experience} years</Badge>
                              {plan.career_goal && (
                                <span className="text-sm text-muted-foreground">
                                  Goal: {plan.career_goal}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground block mt-2">
                              Created {formatDate(plan.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/career-path-planner')}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCareerPlan(plan.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Alerts Tab */}
            <TabsContent value="job-alerts">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Create New Alert */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create Job Alert</CardTitle>
                    <CardDescription>Get notified when matching jobs are posted</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Job Title *</Label>
                      <Input 
                        placeholder="e.g., Software Engineer" 
                        value={newAlert.job_title}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, job_title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input 
                        placeholder="e.g., New York, Remote" 
                        value={newAlert.location}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Select 
                        value={newAlert.industry} 
                        onValueChange={(value) => setNewAlert(prev => ({ ...prev, industry: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Salary</Label>
                        <Input 
                          type="number" 
                          placeholder="50000" 
                          value={newAlert.salary_min}
                          onChange={(e) => setNewAlert(prev => ({ ...prev, salary_min: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Max Salary</Label>
                        <Input 
                          type="number" 
                          placeholder="150000" 
                          value={newAlert.salary_max}
                          onChange={(e) => setNewAlert(prev => ({ ...prev, salary_max: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email Frequency</Label>
                      <Select 
                        value={newAlert.email_frequency}
                        onValueChange={(value) => setNewAlert(prev => ({ ...prev, email_frequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={handleCreateJobAlert} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Create Alert
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Alerts ({jobAlerts.length})</CardTitle>
                    <CardDescription>Manage your job notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {jobAlerts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No job alerts yet. Create one to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobAlerts.map((alert) => (
                          <div key={alert.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{alert.job_title}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  {alert.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {alert.location}
                                    </span>
                                  )}
                                  {alert.industry && (
                                    <Badge variant="outline">{alert.industry}</Badge>
                                  )}
                                  {(alert.salary_min || alert.salary_max) && (
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      {alert.salary_min && `$${alert.salary_min.toLocaleString()}`}
                                      {alert.salary_min && alert.salary_max && ' - '}
                                      {alert.salary_max && `$${alert.salary_max.toLocaleString()}`}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                                    {alert.is_active ? 'Active' : 'Paused'}
                                  </Badge>
                                  <Badge variant="outline">{alert.email_frequency}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={alert.is_active}
                                  onCheckedChange={() => handleToggleAlert(alert.id, alert.is_active)}
                                />
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>{t.profile.activityHistory}</CardTitle>
                  <CardDescription>Your recent activity across all tools</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No activity yet. Start using our tools!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activityHistory.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.tool_name}</p>
                            <p className="text-sm text-muted-foreground">{activity.action_type}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>{t.profile.preferences}</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4" />
                      {t.profile.language}
                    </Label>
                    <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Object.entries(languages).map(([code, lang]) => (
                          <SelectItem key={code} value={code}>
                            {lang.native} ({lang.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      Choose your preferred language. The interface will update accordingly.
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Account</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                    
                    {/* Link to Full Settings Page */}
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/settings')}
                      className="w-full sm:w-auto"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Notification Settings
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Manage email notifications, interview reminders, and weekly digests.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
