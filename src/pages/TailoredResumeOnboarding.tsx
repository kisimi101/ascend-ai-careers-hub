import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Preview = {
  summary: string;
  topSkills: string[];
  bullets: string[];
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
};

export default function TailoredResumeOnboarding() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);

  const generate = async () => {
    if (!role.trim() || !jd.trim()) {
      toast.error("Please fill in target role and job description");
      return;
    }
    setLoading(true);
    setStep(3);
    try {
      const { data, error } = await supabase.functions.invoke("tailored-resume-preview", {
        body: { role, jobDescription: jd, background },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPreview(data as Preview);
    } catch (e: any) {
      toast.error(e.message || "Could not generate preview");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const url = "https://careernow.xyz/tailored-resume";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Tailored AI Resume Preview — CareerNow</title>
        <meta name="description" content="Tell us your target role and paste the job description — get a free tailored AI resume preview with ATS score in under 30 seconds." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Free Tailored AI Resume Preview" />
        <meta property="og:description" content="Get a tailored AI resume preview free. Role + JD in, ATS-scored bullets out." />
        <meta property="og:url" content={url} />
      </Helmet>
      <Navigation />
      <main className="container mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8">
          <Badge className="mb-3"><Sparkles className="w-3 h-3 mr-1" /> Free preview · No sign-up</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Tailor a resume to any job in 30 seconds</h1>
          <p className="text-muted-foreground mt-3">Two questions. AI writes a tailored summary, skills, and 5 ATS-ready bullets. Free preview.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`px-3 py-1 rounded-full ${step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {n === 1 ? "Role" : n === 2 ? "Job description" : "Preview"}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>What role are you targeting?</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Target role *</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Product Manager, Healthcare Marketing Lead" maxLength={200} />
              </div>
              <div>
                <Label htmlFor="bg">Quick background (optional)</Label>
                <Textarea id="bg" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="3 years of marketing in B2B SaaS, led content + paid acquisition…" maxLength={2000} rows={4} />
                <p className="text-xs text-muted-foreground mt-1">If empty, we'll infer a realistic profile for the role.</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!role.trim()}>Next <ArrowRight className="ml-1 w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>Paste the job description</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the full job posting here — the more we have, the better the tailoring." rows={10} maxLength={6000} />
              <p className="text-xs text-muted-foreground">{jd.length}/6000 characters</p>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={generate} disabled={!jd.trim() || loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</> : <>Generate free preview <Sparkles className="ml-1 w-4 h-4" /></>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {loading && (
              <Card><CardContent className="p-10 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />Crafting your tailored resume…</CardContent></Card>
            )}
            {preview && (
              <>
                <Card className="border-primary/30">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle>Free preview · {role}</CardTitle>
                    <Badge className="text-base px-3 py-1">ATS {preview.atsScore}/100</Badge>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <section>
                      <h3 className="font-semibold mb-1">Summary</h3>
                      <p className="text-sm text-muted-foreground">{preview.summary}</p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">Top skills</h3>
                      <div className="flex flex-wrap gap-1.5">{preview.topSkills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">Achievement bullets</h3>
                      <ul className="space-y-2 text-sm">
                        {preview.bullets.map((b, i) => <li key={i} className="flex gap-2"><span className="text-primary">▸</span><span>{b}</span></li>)}
                      </ul>
                    </section>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-md bg-muted/50">
                        <p className="text-xs font-semibold flex items-center gap-1 mb-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Matched keywords</p>
                        <div className="flex flex-wrap gap-1">{preview.matchedKeywords.map((k) => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}</div>
                      </div>
                      <div className="p-3 rounded-md bg-muted/50">
                        <p className="text-xs font-semibold flex items-center gap-1 mb-2"><AlertCircle className="w-3 h-3 text-destructive" /> Missing — add these</p>
                        <div className="flex flex-wrap gap-1">{preview.missingKeywords.map((k) => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center space-y-3">
                    <h3 className="font-semibold">Like it? Open it in the full builder</h3>
                    <p className="text-sm text-muted-foreground">Save versions, edit visually, pick a template, and export when ready.</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button asChild><Link to="/resume-builder">Open in builder <ArrowRight className="ml-1 w-4 h-4" /></Link></Button>
                      <Button variant="outline" onClick={() => { setStep(1); setPreview(null); }}>Try another role</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}