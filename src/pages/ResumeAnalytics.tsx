import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Link2, Trash2, ExternalLink, BarChart3, TrendingUp, Clock, ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { OnboardingTour } from "@/components/OnboardingTour";

const analyticsTourSteps = [
  { title: "Your Shared Resumes", description: "See all resumes you've shared publicly with unique tracking links." },
  { title: "Track Views", description: "Monitor how many times each resume has been viewed by recruiters or employers." },
  { title: "Manage Links", description: "Copy share links, deactivate old ones, or delete resumes you no longer need." },
];

interface SharedResume {
  id: string;
  share_token: string;
  title: string | null;
  template: string;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const chartConfig = {
  views: { label: "Views", color: "hsl(var(--primary))" },
};

const ResumeAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SharedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    const { data, error } = await supabase
      .from("shared_resumes")
      .select("id, share_token, title, template, view_count, is_active, created_at, updated_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (!error && data) setResumes(data);
    setLoading(false);
  };

  const totalViews = resumes.reduce((sum, r) => sum + r.view_count, 0);
  const activeCount = resumes.filter((r) => r.is_active).length;

  // Build chart data from resumes by creation week
  const chartData = (() => {
    const weekMap: Record<string, number> = {};
    resumes.forEach((r) => {
      const week = format(new Date(r.created_at), "MMM d");
      weekMap[week] = (weekMap[week] || 0) + r.view_count;
    });
    return Object.entries(weekMap).map(([name, views]) => ({ name, views }));
  })();

  const copyLink = (token: string, id: string) => {
    const url = `${window.location.origin}/shared-resume/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Link copied!" });
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("shared_resumes").update({ is_active: !current }).eq("id", id);
    fetchResumes();
  };

  const deleteResume = async (id: string) => {
    await supabase.from("shared_resumes").delete().eq("id", id);
    fetchResumes();
    toast({ title: "Resume deleted" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Resume Analytics</h1>
              <p className="text-muted-foreground">Track views and engagement on your shared resumes</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalViews}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resumes.length}</p>
                  <p className="text-sm text-muted-foreground">Shared Links</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-sm text-muted-foreground">Active Links</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Views Over Time</CardTitle>
                <CardDescription>Aggregated view counts by resume creation date</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Resume List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shared Resumes</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : resumes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Link2 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium mb-1">No shared resumes yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Share a resume from the Resume Builder to start tracking views.</p>
                  <Button onClick={() => navigate("/resume-builder")}>Go to Resume Builder</Button>
                </CardContent>
              </Card>
            ) : (
              resumes.map((resume) => (
                <Card key={resume.id} className={!resume.is_active ? "opacity-60" : ""}>
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{resume.title || "Untitled Resume"}</p>
                        <Badge variant={resume.is_active ? "default" : "secondary"}>
                          {resume.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{resume.view_count} views</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{format(new Date(resume.created_at), "MMM d, yyyy")}</span>
                        <span className="capitalize">{resume.template}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => copyLink(resume.share_token, resume.id)}>
                        {copiedId === resume.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/shared-resume/${resume.share_token}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleActive(resume.id, resume.is_active)}>
                        {resume.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteResume(resume.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
      <OnboardingTour tourId="resume-analytics" steps={analyticsTourSteps} />
    </div>
  );
};

export default ResumeAnalytics;
