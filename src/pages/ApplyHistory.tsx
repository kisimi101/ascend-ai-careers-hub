import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, History, Trash2, CheckCircle2 } from "lucide-react";
import { loadHistory, updateRunJobStatus, type ApplyHistoryRun } from "@/lib/applyHistory";

const ApplyHistory = () => {
  const [runs, setRuns] = useState<ApplyHistoryRun[]>([]);

  useEffect(() => {
    setRuns(loadHistory());
  }, []);

  const refresh = () => setRuns(loadHistory());

  const clearAll = () => {
    localStorage.removeItem("smart-apply-history");
    setRuns([]);
  };

  const markApplied = (runId: string, jobIndex: number) => {
    updateRunJobStatus(runId, jobIndex, "applied");
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              Apply History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Every Smart Apply run with job links and status.
            </p>
          </div>
          {runs.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {runs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No Smart Apply runs yet. Run the pipeline to see your history here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <Card key={run.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base">
                      {new Date(run.timestamp).toLocaleString()}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {run.template && (
                        <Badge variant="outline" className="capitalize">
                          {run.template.replace(/-/g, " ")}
                        </Badge>
                      )}
                      <Badge variant="secondary">{run.jobs.length} jobs</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {run.jobs.map((job, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 border border-border rounded-lg p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{job.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job.company} • {job.location || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                          variant={
                            job.status === "applied"
                              ? "default"
                              : job.status === "opened"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs capitalize"
                        >
                          {job.status}
                        </Badge>
                        {job.status !== "applied" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => markApplied(run.id, idx)}
                            title="Mark as applied"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {job.url && job.url !== "#" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => window.open(job.url, "_blank")}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ApplyHistory;