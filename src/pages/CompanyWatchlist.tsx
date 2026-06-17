import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface WatchItem {
  id: string;
  company_name: string;
  keywords: string | null;
  location: string | null;
  last_checked_at: string | null;
}

const CompanyWatchlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({ company_name: "", keywords: "", location: "" });

  const load = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("company_watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setItems(data as WatchItem[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const add = async () => {
    if (!user || !form.company_name.trim()) return toast.error("Enter a company name");
    setLoading(true);
    const { error } = await (supabase as any).from("company_watchlist").insert({
      user_id: user.id,
      company_name: form.company_name.trim(),
      keywords: form.keywords.trim() || null,
      location: form.location.trim() || null,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Added to watchlist");
    setForm({ company_name: "", keywords: "", location: "" });
    load();
  };

  const remove = async (id: string) => {
    await (supabase as any).from("company_watchlist").delete().eq("id", id);
    setItems((p) => p.filter((i) => i.id !== id));
  };

  const refresh = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke("check-job-alerts", { body: { userId: user.id } });
      if (error) throw error;
      toast.success("Refreshed — check notifications");
      load();
    } catch (e: any) {
      toast.error(e?.message || "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20 px-6 text-center">
          <p className="text-muted-foreground">Sign in to track companies.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="w-7 h-7 text-primary" /> Company Watchlist
              </h1>
              <p className="text-muted-foreground mt-1">
                Get notified when companies you care about post new roles (past 3 days).
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={refresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">Add a company</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Company *</Label>
                <Input placeholder="e.g. Stripe" value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Role keywords (optional)</Label>
                  <Input placeholder="e.g. Backend, Go" value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Location (optional)</Label>
                  <Input placeholder="e.g. Remote" value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <Button onClick={add} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add to watchlist
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No companies tracked yet. Add one above to start getting alerts.
              </p>
            )}
            {items.map((it) => (
              <Card key={it.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{it.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.keywords && <span>{it.keywords} · </span>}
                      {it.location && <span>{it.location} · </span>}
                      {it.last_checked_at
                        ? `checked ${formatDistanceToNow(new Date(it.last_checked_at), { addSuffix: true })}`
                        : "not checked yet"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(it.id)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyWatchlist;