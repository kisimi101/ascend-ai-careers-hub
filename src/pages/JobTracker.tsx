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
import { Clipboard, Plus, Calendar, Building2, MapPin, DollarSign, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: 'applied' | 'phone-screen' | 'technical' | 'onsite' | 'offer' | 'rejected';
  appliedDate: string;
  notes: string;
  jobUrl?: string;
}

const JobTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: '1',
      company: 'Google',
      position: 'Software Engineer',
      location: 'Mountain View, CA',
      salary: '$150,000 - $200,000',
      status: 'technical',
      appliedDate: '2024-01-15',
      notes: 'Great team, interesting projects. Technical interview scheduled for next week.',
      jobUrl: 'https://careers.google.com'
    },
    {
      id: '2',
      company: 'Meta',
      position: 'Product Manager',
      location: 'Menlo Park, CA',
      salary: '$180,000 - $220,000',
      status: 'phone-screen',
      appliedDate: '2024-01-10',
      notes: 'Recruiter was very friendly. Focus on growth metrics and user experience.',
    }
  ]);

  const [newApplication, setNewApplication] = useState<Partial<JobApplication>>({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
    jobUrl: ''
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const statusColors: Record<JobApplication['status'], string> = {
    applied: 'bg-blue-100 text-blue-800',
    'phone-screen': 'bg-yellow-100 text-yellow-800',
    technical: 'bg-purple-100 text-purple-800',
    onsite: 'bg-orange-100 text-orange-800',
    offer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels: Record<JobApplication['status'], string> = {
    applied: 'Applied',
    'phone-screen': 'Phone Screen',
    technical: 'Technical Interview',
    onsite: 'Onsite Interview',
    offer: 'Offer Received',
    rejected: 'Rejected'
  };

  const addApplication = () => {
    if (!newApplication.company || !newApplication.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in company and position",
        variant: "destructive",
      });
      return;
    }

    const application: JobApplication = {
      id: Date.now().toString(),
      company: newApplication.company!,
      position: newApplication.position!,
      location: newApplication.location || '',
      salary: newApplication.salary || '',
      status: newApplication.status as JobApplication['status'] || 'applied',
      appliedDate: newApplication.appliedDate || new Date().toISOString().split('T')[0],
      notes: newApplication.notes || '',
      jobUrl: newApplication.jobUrl || ''
    };

    setApplications([...applications, application]);
    setNewApplication({
      company: '',
      position: '',
      location: '',
      salary: '',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      jobUrl: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Application Added!",
      description: "Your job application has been tracked successfully",
    });
  };

  const updateStatus = (id: string, newStatus: JobApplication['status']) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Application status changed to ${statusLabels[newStatus]}`,
    });
  };

  const deleteApplication = (id: string) => {
    setApplications(apps => apps.filter(app => app.id !== id));
    toast({
      title: "Application Deleted",
      description: "Application removed from tracker",
    });
  };

  const getStatusCounts = () => {
    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<JobApplication['status'], number>);
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-6">
              <Clipboard className="w-4 h-4 mr-2" />
              Job Application Tracker
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Track Your
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Job Applications</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay organized and never lose track of your job applications. Monitor progress and optimize your job search.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {Object.entries(statusLabels).map(([status, label]) => (
              <Card key={status}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {statusCounts[status as JobApplication['status']] || 0}
                    </div>
                    <div className="text-sm text-gray-600">{label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Applications ({applications.length})</h2>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
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
                      onValueChange={(value) => setNewApplication({...newApplication, status: value as JobApplication['status']})}
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
                      value={newApplication.appliedDate || ''}
                      onChange={(e) => setNewApplication({...newApplication, appliedDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="jobUrl">Job URL</Label>
                    <Input
                      id="jobUrl"
                      placeholder="https://..."
                      value={newApplication.jobUrl || ''}
                      onChange={(e) => setNewApplication({...newApplication, jobUrl: e.target.value})}
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
                  <Button onClick={addApplication} className="flex-1">
                    Add Application
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clipboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500">No applications tracked yet. Add your first application to get started!</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{app.position}</h3>
                          <Badge className={statusColors[app.status]}>
                            {statusLabels[app.status]}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {app.notes && (
                          <p className="text-gray-700 mb-3">{app.notes}</p>
                        )}
                        
                        {app.jobUrl && (
                          <a 
                            href={app.jobUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 text-sm"
                          >
                            View Job Posting →
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Select value={app.status} onValueChange={(value) => updateStatus(app.id, value as JobApplication['status'])}>
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
                          onClick={() => deleteApplication(app.id)}
                          className="text-red-600 hover:text-red-700"
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