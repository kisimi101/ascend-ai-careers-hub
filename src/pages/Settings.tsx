import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Mail, Calendar, ArrowLeft, Loader2 } from "lucide-react";

interface UserSettings {
  email_reminders_enabled: boolean;
  interview_reminders_enabled: boolean;
  status_change_notifications: boolean;
  weekly_digest_enabled: boolean;
  digest_frequency: string;
  digest_day: string;
}

const defaultSettings: UserSettings = {
  email_reminders_enabled: true,
  interview_reminders_enabled: true,
  status_change_notifications: true,
  weekly_digest_enabled: true,
  digest_frequency: "weekly",
  digest_day: "monday",
};

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          email_reminders_enabled: data.email_reminders_enabled,
          interview_reminders_enabled: data.interview_reminders_enabled,
          status_change_notifications: data.status_change_notifications,
          weekly_digest_enabled: data.weekly_digest_enabled,
          digest_frequency: data.digest_frequency,
          digest_day: data.digest_day,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_settings")
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.id,
            ...settings,
          });

        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <SettingsIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
          </div>

          {/* Email Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>
                Control which email notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reminders">All Email Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Master toggle for all email notifications
                  </p>
                </div>
                <Switch
                  id="email-reminders"
                  checked={settings.email_reminders_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting("email_reminders_enabled", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="interview-reminders">Interview Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders 24 hours before scheduled interviews
                  </p>
                </div>
                <Switch
                  id="interview-reminders"
                  checked={settings.interview_reminders_enabled}
                  disabled={!settings.email_reminders_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting("interview_reminders_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status-notifications">Status Change Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when application status changes (offers, interviews)
                  </p>
                </div>
                <Switch
                  id="status-notifications"
                  checked={settings.status_change_notifications}
                  disabled={!settings.email_reminders_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting("status_change_notifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Digest */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Weekly Digest</CardTitle>
              </div>
              <CardDescription>
                Configure your weekly progress summary emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Enable Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of your job search progress
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.weekly_digest_enabled}
                  disabled={!settings.email_reminders_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting("weekly_digest_enabled", checked)
                  }
                />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="digest-frequency">Frequency</Label>
                  <Select
                    value={settings.digest_frequency}
                    onValueChange={(value) => updateSetting("digest_frequency", value)}
                    disabled={!settings.weekly_digest_enabled || !settings.email_reminders_enabled}
                  >
                    <SelectTrigger id="digest-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="digest-day">Delivery Day</Label>
                  <Select
                    value={settings.digest_day}
                    onValueChange={(value) => updateSetting("digest_day", value)}
                    disabled={
                      !settings.weekly_digest_enabled ||
                      !settings.email_reminders_enabled ||
                      settings.digest_frequency === "daily"
                    }
                  >
                    <SelectTrigger id="digest-day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
