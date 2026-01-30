import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clipboard, Plus, Calendar as CalendarIcon, Building2, MapPin, DollarSign, Trash2, Loader2, Clock, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJobApplicationsDB, JobApplicationInsert } from "@/hooks/useJobApplicationsDB";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const JobTracker = () => {
  const { user } = useAuth();
  const { applications, isLoading, addApplication, updateApplication, deleteApplication, getStatusCounts } = useJobApplicationsDB();
  const { toast } = useToast();

  const [newApplication, setNewApplication] = useState<Partial<JobApplicationInsert>>({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
    job_url: '',
    interview_date: null
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null);
  const [interviewDateTime, setInterviewDateTime] = useState<Date | undefined>();
  const [interviewTime, setInterviewTime] = useState<string>("09:00");

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
    technical: 'Technical Interview',
    onsite: 'Onsite Interview',
    offer: 'Offer Received',
    rejected: 'Rejected'
  };

  const sendNotificationEmail = async (oldStatus: string | undefined, newStatus: string, company: string, position: string) => {
    if (!user?.email) return;
    
    try {
      await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'status_change',
          user_email: user.email,
          user_name: user.user_metadata?.full_name,
          application_data: {
            company,
            position,
            old_status: oldStatus,
            new_status: newStatus,
          }
        }
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  };

  const handleAddApplication = async () => {
    if (!newApplication.company || !newApplication.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in company and position",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await addApplication({
      company: newApplication.company!,
      position: newApplication.position!,
      location: newApplication.location || null,
      salary: newApplication.salary || null,
      status: (newApplication.status as 'applied' | 'phone-screen' | 'technical' | 'onsite' | 'offer' | 'rejected') || 'applied',
      applied_date: newApplication.applied_date || new Date().toISOString().split('T')[0],
      interview_date: newApplication.interview_date || null,
      notes: newApplication.notes || null,
      job_url: newApplication.job_url || null,
    });

    if (result) {
      // Send notification email for new application
      await sendNotificationEmail(undefined, result.status, result.company, result.position);
      
      setNewApplication({
        company: '',
        position: '',
        location: '',
        salary: '',
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0],
        notes: '',
        job_url: '',
        interview_date: null
      });
      setIsDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleScheduleInterview = async (id: string, company: string, position: string) => {
    if (!interviewDateTime) {
      toast({
        title: "Select a date",
        description: "Please select an interview date and time",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const [hours, minutes] = interviewTime.split(':').map(Number);
    const fullDateTime = new Date(interviewDateTime);
    fullDateTime.setHours(hours, minutes, 0, 0);

    const success = await updateApplication(id, { interview_date: fullDateTime.toISOString() });
    if (success) {
      toast({
        title: "Interview Scheduled! 📅",
        description: `Interview scheduled for ${format(fullDateTime, "PPP 'at' p")}. You'll receive a reminder 24 hours before.`,
      });
      setEditingInterviewId(null);
      setInterviewDateTime(undefined);
      setInterviewTime("09:00");
    }
  };

  const handleClearInterview = async (id: string) => {
    await updateApplication(id, { interview_date: null });
    toast({
      title: "Interview Cleared",
      description: "Interview date has been removed",
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string, company: string, position: string, oldStatus: string) => {
    const success = await updateApplication(id, { status: newStatus as 'applied' | 'phone-screen' | 'technical' | 'onsite' | 'offer' | 'rejected' });
    if (success) {
      await sendNotificationEmail(oldStatus, newStatus, company, position);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    await deleteApplication(id);
  };

  const statusCounts = getStatusCounts();

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
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Clipboard className="w-4 h-4 mr-2" />
              Job Application Tracker
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Track Your
              <span className="text-gradient-primary"> Job Applications</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay organized and never lose track of your job applications. Monitor progress and optimize your job search.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {Object.entries(statusLabels).map(([status, label]) => (
              <Card key={status} className="card-enhanced">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {statusCounts[status] || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Applications ({applications.length})</h2>
            
            <div className="flex gap-3">
              <Link to="/job-analytics">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Application
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
                  <DialogDescription>
                    Track a new job application
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={newApplication.company || ''}
                      onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      placeholder="Job title"
                      value={newApplication.position || ''}
                      onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={newApplication.location || ''}
                      onChange={(e) => setNewApplication({...newApplication, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      placeholder="e.g., $80,000 - $120,000"
                      value={newApplication.salary || ''}
                      onChange={(e) => setNewApplication({...newApplication, salary: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newApplication.status || 'applied'} 
                      onValueChange={(value) => setNewApplication({...newApplication, status: value as 'applied' | 'phone-screen' | 'technical' | 'onsite' | 'offer' | 'rejected'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="appliedDate">Applied Date</Label>
                    <Input
                      id="appliedDate"
                      type="date"
                      value={newApplication.applied_date || ''}
                      onChange={(e) => setNewApplication({...newApplication, applied_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="jobUrl">Job URL</Label>
                    <Input
                      id="jobUrl"
                      placeholder="https://..."
                      value={newApplication.job_url || ''}
                      onChange={(e) => setNewApplication({...newApplication, job_url: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Interview notes, contacts, etc."
                      value={newApplication.notes || ''}
                      onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleAddApplication} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Add Application
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card className="card-enhanced">
                <CardContent className="text-center py-12">
                  <Clipboard className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No applications tracked yet. Add your first application to get started!</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} className="card-enhanced">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{app.position}</h3>
                          <Badge className={statusColors[app.status]}>
                            {statusLabels[app.status]}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {app.company}
                          </div>
                          {app.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {app.location}
                            </div>
                          )}
                          {app.salary && (
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {app.salary}
                            </div>
                          )}
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            Applied {new Date(app.applied_date).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Interview Date Section */}
                        <div className="mb-3">
                          {app.interview_date ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                Interview: {format(new Date(app.interview_date), "PPP 'at' p")}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-purple-600 hover:text-destructive"
                                onClick={() => handleClearInterview(app.id)}
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            editingInterviewId === app.id ? (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-muted rounded-lg">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !interviewDateTime && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {interviewDateTime ? format(interviewDateTime, "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={interviewDateTime}
                                      onSelect={setInterviewDateTime}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <Input
                                  type="time"
                                  value={interviewTime}
                                  onChange={(e) => setInterviewTime(e.target.value)}
                                  className="w-[130px]"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleScheduleInterview(app.id, app.company, app.position)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingInterviewId(null);
                                      setInterviewDateTime(undefined);
                                      setInterviewTime("09:00");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingInterviewId(app.id)}
                                className="text-purple-600 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/30"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Schedule Interview
                              </Button>
                            )
                          )}
                        </div>
                        
                        {app.notes && (
                          <p className="text-foreground/80 mb-3">{app.notes}</p>
                        )}
                        
                        {app.job_url && (
                          <a 
                            href={app.job_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 text-sm"
                          >
                            View Job Posting →
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Select 
                          value={app.status} 
                          onValueChange={(value) => handleUpdateStatus(app.id, value, app.company, app.position, app.status)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApplication(app.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobTracker;
