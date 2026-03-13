import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Clock, Send, Sparkles, Copy, Building2, Calendar, CheckCircle2, Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useJobApplicationsDB } from '@/hooks/useJobApplicationsDB';
import { format, differenceInDays, addDays } from 'date-fns';

interface FollowUpDraft {
  applicationId: string;
  company: string;
  position: string;
  appliedDate: string;
  daysSinceApply: number;
  followUpType: 'initial' | 'second' | 'final';
  subject: string;
  body: string;
  suggestedSendDate: string;
  status: 'pending' | 'sent' | 'skipped';
}

const FOLLOW_UP_TIMING = {
  initial: 5,
  second: 12,
  final: 21,
};

const AutoFollowUp = () => {
  const { user } = useAuth();
  const { applications } = useJobApplicationsDB();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<FollowUpDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<FollowUpDraft | null>(null);
  const [editedBody, setEditedBody] = useState('');
  const [editedSubject, setEditedSubject] = useState('');
  const [tone, setTone] = useState('professional');
  const [autoSchedule, setAutoSchedule] = useState(true);

  useEffect(() => {
    if (applications && applications.length > 0) {
      generateDrafts();
    }
  }, [applications]);

  const generateDrafts = async () => {
    if (!applications || applications.length === 0) return;
    setIsGenerating(true);

    try {
      const newDrafts: FollowUpDraft[] = [];
      const activeApps = applications.filter(app => 
        ['applied', 'interviewing'].includes(app.status)
      );

      for (const app of activeApps) {
        const daysSince = differenceInDays(new Date(), new Date(app.applied_date));
        
        for (const [type, days] of Object.entries(FOLLOW_UP_TIMING)) {
          if (daysSince >= days - 1 && daysSince <= days + 7) {
            newDrafts.push({
              applicationId: app.id,
              company: app.company,
              position: app.position,
              appliedDate: app.applied_date,
              daysSinceApply: daysSince,
              followUpType: type as FollowUpDraft['followUpType'],
              subject: generateSubject(app.company, app.position, type as any),
              body: generateBody(app.company, app.position, type as any, daysSince),
              suggestedSendDate: format(addDays(new Date(app.applied_date), days), 'yyyy-MM-dd'),
              status: 'pending',
            });
          }
        }
      }

      // Also generate AI-enhanced versions
      if (newDrafts.length > 0) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-follow-up', {
            body: { 
              applications: newDrafts.map(d => ({
                company: d.company,
                position: d.position,
                daysSince: d.daysSinceApply,
                followUpType: d.followUpType,
                tone,
              }))
            }
          });
          if (!error && data?.drafts) {
            data.drafts.forEach((aiDraft: any, i: number) => {
              if (newDrafts[i]) {
                newDrafts[i].subject = aiDraft.subject || newDrafts[i].subject;
                newDrafts[i].body = aiDraft.body || newDrafts[i].body;
              }
            });
          }
        } catch {
          // Fall back to template-based drafts
        }
      }

      setDrafts(newDrafts);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSubject = (company: string, position: string, type: 'initial' | 'second' | 'final') => {
    const subjects = {
      initial: `Following Up: ${position} Application at ${company}`,
      second: `Continued Interest in ${position} Role — ${company}`,
      final: `Final Check-In: ${position} at ${company}`,
    };
    return subjects[type];
  };

  const generateBody = (company: string, position: string, type: 'initial' | 'second' | 'final', days: number) => {
    const templates = {
      initial: `Dear Hiring Manager,

I hope this message finds you well. I recently applied for the ${position} position at ${company} approximately ${days} days ago, and I wanted to follow up to express my continued enthusiasm for the role.

I believe my skills and experience align well with what you're looking for, and I would welcome the opportunity to discuss how I could contribute to your team.

Would you have time for a brief conversation this week? I'm happy to work around your schedule.

Thank you for your consideration.

Best regards`,
      second: `Dear Hiring Team,

I'm writing to follow up on my application for the ${position} role at ${company}. I applied ${days} days ago and remain very interested in this opportunity.

Since my initial application, I've continued to follow ${company}'s work and am particularly excited about [specific project or news]. I'd love to bring my expertise to support these initiatives.

I understand the hiring process takes time, but I wanted to reiterate my strong interest. Please don't hesitate to reach out if you need any additional information.

Warm regards`,
      final: `Dear Hiring Manager,

I wanted to reach out one more time regarding my application for the ${position} position at ${company}, submitted ${days} days ago.

I understand that hiring decisions involve many factors and take time. I remain genuinely interested in contributing to ${company} and believe I could make a meaningful impact.

If the position has been filled or if you'd prefer I not follow up further, I completely understand. Otherwise, I'd appreciate any update you might be able to share.

Thank you for your time and consideration.

Best regards`,
    };
    return templates[type];
  };

  const handleCopy = (draft: FollowUpDraft) => {
    const text = `Subject: ${selectedDraft ? editedSubject : draft.subject}\n\n${selectedDraft ? editedBody : draft.body}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Follow-up email copied to clipboard' });
  };

  const handleSelectDraft = (draft: FollowUpDraft) => {
    setSelectedDraft(draft);
    setEditedBody(draft.body);
    setEditedSubject(draft.subject);
  };

  const getFollowUpLabel = (type: string) => {
    const labels = { initial: '1st Follow-Up', second: '2nd Follow-Up', final: 'Final Follow-Up' };
    return labels[type as keyof typeof labels] || type;
  };

  const getFollowUpColor = (type: string) => {
    const colors = { initial: 'bg-blue-500/10 text-blue-600', second: 'bg-amber-500/10 text-amber-600', final: 'bg-red-500/10 text-red-600' };
    return colors[type as keyof typeof colors] || '';
  };

  const pendingDrafts = drafts.filter(d => d.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-20 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              Auto Follow-Up
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">AI-generated follow-up emails sent at optimal timing</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-32 sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="confident">Confident</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateDrafts} disabled={isGenerating} size="sm">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Mail className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{pendingDrafts.length}</p>
                <p className="text-xs text-muted-foreground">Pending Follow-Ups</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{drafts.filter(d => d.status === 'sent').length}</p>
                <p className="text-xs text-muted-foreground">Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{drafts.filter(d => d.followUpType === 'initial').length}</p>
                <p className="text-xs text-muted-foreground">1st Follow-Ups</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><Sparkles className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{applications?.filter(a => ['applied', 'interviewing'].includes(a.status)).length || 0}</p>
                <p className="text-xs text-muted-foreground">Active Applications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Draft List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold mb-3">Follow-Up Queue</h2>
            {isGenerating ? (
              <Card><CardContent className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" /><p className="text-muted-foreground">Generating AI drafts...</p></CardContent></Card>
            ) : pendingDrafts.length === 0 ? (
              <Card><CardContent className="py-12 text-center"><Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-muted-foreground">No follow-ups due right now</p><p className="text-xs text-muted-foreground mt-1">Add applications in Job Tracker to start</p></CardContent></Card>
            ) : (
              pendingDrafts.map((draft, i) => (
                <Card
                  key={i}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedDraft?.applicationId === draft.applicationId && selectedDraft?.followUpType === draft.followUpType ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelectDraft(draft)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{draft.company}</p>
                        <p className="text-xs text-muted-foreground">{draft.position}</p>
                      </div>
                      <Badge variant="secondary" className={`text-xs ${getFollowUpColor(draft.followUpType)}`}>
                        {getFollowUpLabel(draft.followUpType)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Send by {draft.suggestedSendDate}</span>
                      <span>•</span>
                      <span>{draft.daysSinceApply}d since apply</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Email Editor */}
          <div className="lg:col-span-2">
            {selectedDraft ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {selectedDraft.company} — {selectedDraft.position}
                      </CardTitle>
                      <CardDescription>{getFollowUpLabel(selectedDraft.followUpType)} • {selectedDraft.daysSinceApply} days since application</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(selectedDraft)}>
                        <Copy className="w-4 h-4 mr-1" /> Copy
                      </Button>
                      <Button size="sm" onClick={() => {
                        const mailto = `mailto:?subject=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`;
                        window.open(mailto);
                        toast({ title: 'Opening email client...' });
                      }}>
                        <Send className="w-4 h-4 mr-1" /> Open in Email
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Subject</Label>
                    <Input value={editedSubject} onChange={(e) => setEditedSubject(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email Body</Label>
                    <Textarea value={editedBody} onChange={(e) => setEditedBody(e.target.value)} className="mt-1 min-h-[350px] font-mono text-sm" />
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Switch checked={autoSchedule} onCheckedChange={setAutoSchedule} />
                      <Label className="text-sm">Auto-schedule reminders</Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Optimal send: {selectedDraft.suggestedSendDate}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-24 text-center">
                  <ArrowRight className="w-10 h-10 mx-auto text-muted-foreground/30 mb-4 rotate-180 lg:rotate-0" />
                  <p className="text-muted-foreground">Select a follow-up from the queue to preview and edit</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AutoFollowUp;
