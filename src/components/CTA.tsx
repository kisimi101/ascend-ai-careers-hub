import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();

  const freeTools = [
    {
      name: "Cover Letter Generator",
      description: "Write tailored cover letters in minutes.",
      icon: FileText,
      path: "/cover-letter-generator",
    },
    {
      name: "Resume Checker",
      description: "Instant feedback + keyword insights.",
      icon: Search,
      path: "/resume-checker",
    },
    {
      name: "AI Resume Builder",
      description: "ATS-friendly structure with smart suggestions.",
      icon: Sparkles,
      path: "/resume-builder",
    },
  ];

  return (
    <section className="section-padding container-padding">
      <div className="container mx-auto">
        {/* Primary CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-primary opacity-30" />
          <div className="relative p-6 sm:p-10 md:p-14">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Ready to ship better applications?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Turn your job search into a repeatable system: resume → keywords → applications → interviews.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="btn-gradient h-12 px-7 text-base"
                  onClick={() => navigate("/tools")}
                >
                  Start free
                  <ArrowRight className="ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 text-base bg-background/30"
                  onClick={() =>
                    document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Compare plans
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Free tools included • Upgrade anytime
              </p>
            </div>
          </div>
        </div>

        {/* Free tools */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Free AI career tools
            </h3>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Try the tools people use daily to move faster — no setup, no friction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {freeTools.map((tool) => (
              <Card
                key={tool.name}
                className="group border-border/60 bg-card/70 backdrop-blur hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/12 flex items-center justify-center">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs rounded-full border border-border/60 bg-background/30 px-3 py-1 text-muted-foreground">
                      Free
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-foreground">
                    {tool.name}
                  </h4>
                  <p className="mt-2 text-muted-foreground">{tool.description}</p>

                  <Button
                    className="mt-6 w-full btn-gradient"
                    onClick={() => navigate(tool.path)}
                  >
                    Try now
                    <ArrowRight className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
