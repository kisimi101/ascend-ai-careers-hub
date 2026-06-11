import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const items = [
  { label: "Build & download 1 resume", sub: "No signup. PDF/PNG export." },
  { label: "10 job searches per day", sub: "Across LinkedIn, Indeed, Glassdoor + more." },
  { label: "1 full Smart Apply pipeline", sub: "Optimize → match → cover letters." },
  { label: "Resume ATS checker", sub: "Free line-by-line score." },
];

export const FreeTierCallout = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Free tier
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              What you can do for free
            </h2>
            <p className="mt-3 text-muted-foreground">
              Try the platform end-to-end before you sign up. No credit card, no email.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((i) => (
              <li key={i.label} className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/40 p-4">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-foreground">{i.label}</div>
                  <div className="text-sm text-muted-foreground">{i.sub}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="btn-gradient h-11 px-6" onClick={() => navigate("/resume-builder")}>
              Start free — no signup
            </Button>
            <Button variant="outline" className="h-11 px-6" onClick={() => navigate("/smart-apply")}>
              Try Smart Apply
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeTierCallout;