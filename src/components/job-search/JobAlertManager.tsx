import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2, X, BellRing } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface JobAlert {
  id: string;
  job_title: string;
  location: string | null;
  keywords: string[] | null;
  email_frequency: string | null;
  is_active: boolean | null;
  industry: string | null;
  salary_min: number | null;
  salary_max: number | null;
}

interface JobAlertManagerProps {
  defaultTitle?: string;
  defaultLocation?: string;
}

export const JobAlertManager = ({ defaultTitle = "", defaultLocation = "" }: JobAlertManagerProps) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    job_title: defaultTitle,
    location: defaultLocation,
    keywords: "",
    email_frequency: "daily",
  });

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  useEffect(() => {
    setForm((f) => ({ ...f, job_title: defaultTitle, location: defaultLocation }));
  }, [defaultTitle, defaultLocation]);

  const fetchAlerts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("job_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setAlerts(data);
  };

  const createAlert = async () => {
    if (!user || !form.job_title.trim()) {
      toast.error("Please enter a job title");
      return;
    }
    setLoading(true);
    const keywords = form.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const { error } = await supabase.from("job_alerts").insert({
      user_id: user.id,
      job_title: form.job_title.trim(),
      location: form.location.trim() || null,
      keywords: keywords.length > 0 ? keywords : null,
      email_frequency: form.email_frequency,
    });

    if (error) {
      toast.error("Failed to create alert");
    } else {
      toast.success("Job alert created!");
      setForm({ job_title: "", location: "", keywords: "", email_frequency: "daily" });
      setShowForm(false);
      fetchAlerts();
    }
    setLoading(false);
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    await supabase.from("job_alerts").update({ is_active: !isActive }).eq("id", id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: !isActive } : a)));
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("job_alerts").delete().eq("id", id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Alert deleted");
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          <BellRing className="w-8 h-8 mx-auto mb-2 opacity-40" />
          Sign in to create job alerts
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Job Alerts
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
            <div>
              <Label className="text-xs">Job Title *</Label>
              <Input
                placeholder="e.g. Software Engineer"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Input
                placeholder="e.g. Remote, New York"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Keywords (comma separated)</Label>
              <Input
                placeholder="e.g. React, TypeScript, Node.js"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Frequency</Label>
              <Select value={form.email_frequency} onValueChange={(v) => setForm({ ...form, email_frequency: v })}>
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={createAlert} disabled={loading} className="w-full h-9" size="sm">
              {loading ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        )}

        {alerts.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No alerts yet. Create one to get notified about new jobs.
          </p>
        )}

        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{alert.job_title}</p>
              {alert.location && (
                <p className="text-xs text-muted-foreground">{alert.location}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                {alert.keywords?.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {kw}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {alert.email_frequency}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Switch
                checked={alert.is_active ?? true}
                onCheckedChange={() => toggleAlert(alert.id, alert.is_active ?? true)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => deleteAlert(alert.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
