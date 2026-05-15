import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const DEFAULT_KEYWORDS = ["resume builder", "ai resume builder"];
const MOMENTUM_THRESHOLD = 15; // % change considered an "alert"

type Snap = { id: string; keyword: string; volume: number | null; difficulty: number | null; cpc: number | null; captured_at: string; notes: string | null; source: string };

export default function SeoKeywordTracker() {
  const { user } = useAuth();
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORDS[1]);
  const [volume, setVolume] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cpc, setCpc] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("keyword_trends")
      .select("*")
      .order("captured_at", { ascending: true });
    if (error) toast.error(error.message);
    setSnaps((data as Snap[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const addSnapshot = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    if (!keyword.trim() || !volume) { toast.error("Keyword and volume required"); return; }
    setSaving(true);
    const { error } = await supabase.from("keyword_trends").insert({
      user_id: user.id,
      keyword: keyword.trim().toLowerCase(),
      volume: parseInt(volume, 10),
      difficulty: difficulty ? parseFloat(difficulty) : null,
      cpc: cpc ? parseFloat(cpc) : null,
      notes: notes || null,
      source: "manual",
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Snapshot logged");
    setVolume(""); setDifficulty(""); setCpc(""); setNotes("");
    load();
  };

  // Build per-keyword series + momentum
  const series = useMemo(() => {
    const byKw = new Map<string, Snap[]>();
    snaps.forEach((s) => {
      if (!byKw.has(s.keyword)) byKw.set(s.keyword, []);
      byKw.get(s.keyword)!.push(s);
    });
    return Array.from(byKw.entries()).map(([kw, list]) => {
      const sorted = [...list].sort((a, b) => a.captured_at.localeCompare(b.captured_at));
      const first = sorted[0]?.volume ?? null;
      const last = sorted[sorted.length - 1]?.volume ?? null;
      const prev = sorted[sorted.length - 2]?.volume ?? null;
      const totalChange = first && last ? ((last - first) / first) * 100 : null;
      const recentChange = prev && last ? ((last - prev) / prev) * 100 : null;
      return { keyword: kw, points: sorted, first, last, totalChange, recentChange };
    });
  }, [snaps]);

  // Combined chart data: rows by date with one column per keyword
  const chartData = useMemo(() => {
    const dateMap = new Map<string, any>();
    snaps.forEach((s) => {
      const d = format(parseISO(s.captured_at), "MMM d");
      if (!dateMap.has(d)) dateMap.set(d, { date: d });
      dateMap.get(d)![s.keyword] = s.volume;
    });
    return Array.from(dateMap.values());
  }, [snaps]);

  const colors = ["hsl(var(--primary))", "#16a34a", "#9333ea", "#0ea5e9", "#f59e0b"];
  const allKeywords = Array.from(new Set(snaps.map((s) => s.keyword)));

  const alerts = series.filter((s) => s.recentChange !== null && Math.abs(s.recentChange) >= MOMENTUM_THRESHOLD);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SEO Keyword Trend Tracker — CareerNow</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navigation />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold">SEO Keyword Trend Tracker</h1>
          <p className="text-muted-foreground">Log Semrush snapshots over time, watch momentum shift between <code>resume builder</code> and <code>ai resume builder</code>, and get alerts on big moves.</p>
        </header>

        {/* Add snapshot */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> Log a snapshot</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <Label>Keyword</Label>
              <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="ai resume builder" />
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {DEFAULT_KEYWORDS.map((k) => (
                  <Badge key={k} variant="outline" className="cursor-pointer" onClick={() => setKeyword(k)}>{k}</Badge>
                ))}
              </div>
            </div>
            <div><Label>Volume *</Label><Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="301000" /></div>
            <div><Label>Difficulty</Label><Input type="number" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="88" /></div>
            <div><Label>CPC ($)</Label><Input type="number" step="0.01" value={cpc} onChange={(e) => setCpc(e.target.value)} placeholder="5.32" /></div>
            <div className="sm:col-span-5">
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Pulled from Semrush US database, weekly check-in" />
            </div>
            <div className="sm:col-span-5 flex justify-end">
              <Button onClick={addSnapshot} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />} Add snapshot</Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-yellow-500/40 bg-yellow-500/5">
            <CardHeader><CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400"><AlertTriangle className="w-4 h-4" /> Momentum alerts (≥{MOMENTUM_THRESHOLD}% change vs last snapshot)</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {alerts.map((a) => (
                <div key={a.keyword} className="text-sm flex items-center gap-2">
                  {a.recentChange! > 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  <span className="font-medium">{a.keyword}</span>
                  <span className={a.recentChange! > 0 ? "text-green-600" : "text-red-600"}>{a.recentChange!.toFixed(1)}%</span>
                  <span className="text-muted-foreground">since previous snapshot</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Summary cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {series.length === 0 && !loading && <p className="text-sm text-muted-foreground">No snapshots yet — add your first one above.</p>}
          {series.map((s) => (
            <Card key={s.keyword}>
              <CardHeader><CardTitle className="text-base">{s.keyword}</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.last?.toLocaleString() ?? "—"}<span className="text-xs font-normal text-muted-foreground"> /mo</span></div>
                <div className="flex gap-3 mt-1 text-sm">
                  <span className="flex items-center gap-1">
                    {s.recentChange == null ? "—" : s.recentChange >= 0 ? <TrendingUp className="w-3 h-3 text-green-600" /> : <TrendingDown className="w-3 h-3 text-red-600" />}
                    <span className={s.recentChange == null ? "text-muted-foreground" : s.recentChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {s.recentChange == null ? "no prior snapshot" : `${s.recentChange.toFixed(1)}% recent`}
                    </span>
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{s.totalChange == null ? "" : `${s.totalChange.toFixed(1)}% all-time`}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <CardHeader><CardTitle>Volume over time</CardTitle></CardHeader>
          <CardContent style={{ height: 360 }}>
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Log at least 2 snapshots per keyword to see trend lines.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {allKeywords.map((kw, i) => (
                    <Line key={kw} type="monotone" dataKey={kw} stroke={colors[i % colors.length]} strokeWidth={2} connectNulls dot />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Tip: pull weekly numbers from Semrush (US database) for both keywords and log them here. Anything ≥{MOMENTUM_THRESHOLD}% week-over-week shows up as an alert.
        </p>
      </main>
      <Footer />
    </div>
  );
}