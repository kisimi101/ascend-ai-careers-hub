import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Chrome, Sparkles, Shield, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ChromeExtension() {
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/careernow-autofill.zip");
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "careernow-autofill.zip";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Extension downloaded — follow the install steps below");
    } catch (e: any) {
      toast.error(e?.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> New
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            One-Click Apply, Anywhere
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The CareerNow Chrome extension fills out application forms on Workday, Greenhouse, Lever, Ashby, SmartRecruiters, iCIMS, and BambooHR — automatically, with your saved profile and latest resume.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={download} disabled={downloading} className="gap-2">
              <Download className="w-4 h-4" />
              {downloading ? "Preparing…" : "Download Extension (.zip)"}
            </Button>
            <span className="text-xs text-muted-foreground">v0.1 · Chrome, Edge, Brave, Arc</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Zap, title: "Instant fill", body: "One click fills name, email, phone, location, LinkedIn, work history, education — all from your CareerNow profile." },
            { icon: Shield, title: "You stay in control", body: "We never submit forms for you. Review every field, then hit Submit yourself. ToS-safe." },
            { icon: Chrome, title: "Works everywhere", body: "Smart field detection adapts to Workday, Greenhouse, Lever, Ashby and other ATS templates." },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5">
                <f.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Install in 4 steps</h2>
            <ol className="space-y-4">
              {[
                ["Download & unzip", "Click the download button above and unzip the file anywhere on your computer."],
                ["Open chrome://extensions", "Paste chrome://extensions into a new Chrome tab and toggle on Developer mode (top-right)."],
                ["Load unpacked", "Click Load unpacked and select the unzipped careernow-autofill folder."],
                ["Sign in & apply", "Pin the extension, click it, sign in with your CareerNow account, then visit any job application and press Autofill this page."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{title}</div>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-3">Currently supported fields</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                {["First / last name","Email","Phone","Location","LinkedIn","Website / portfolio","Current company","Current title","School","Degree","Skills","Cover letter / summary"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> {s}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}