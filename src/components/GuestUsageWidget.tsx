import { useEffect, useMemo, useState } from "react";
import { Search, Zap, Download, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Usage = { used: number; limit: number };

/**
 * Compact header widget showing remaining free-tier usage for guests:
 * job searches, smart-apply pipelines, and resume downloads.
 * Polls quietly on mount and on route changes.
 */
export const GuestUsageWidget = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState<Usage>({ used: 0, limit: 10 });
  const [apply, setApply] = useState<Usage>({ used: 0, limit: 1 });
  const [download, setDownload] = useState<Usage>({ used: 0, limit: 1 });
  const [loaded, setLoaded] = useState(false);

  const resetIn = useMemo(() => {
    const now = new Date();
    const next = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    const ms = next.getTime() - now.getTime();
    const h = Math.floor(ms / 3.6e6);
    const m = Math.floor((ms % 3.6e6) / 6e4);
    return `${h}h ${m}m`;
  }, [loaded]);

  useEffect(() => {
    if (isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const [s, a, d] = await Promise.all([
          supabase.functions.invoke("search-jobs", { body: { checkUsageOnly: true } }),
          supabase.functions.invoke("smart-match", { body: { checkUsageOnly: true } }),
          supabase.functions.invoke("track-download", { body: { consume: false } }),
        ]);
        if (cancelled) return;
        if (s.data) setSearch({ used: s.data.used ?? 0, limit: s.data.limit ?? 10 });
        if (a.data) setApply({ used: a.data.used ?? 0, limit: a.data.limit ?? 1 });
        if (d.data) setDownload({ used: d.data.used ?? 0, limit: d.data.limit ?? 1 });
      } catch {}
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (isAuthenticated) return null;

  const items = [
    { icon: Search, label: "Searches", ...search },
    { icon: Zap, label: "Smart Apply", ...apply },
    { icon: Download, label: "Downloads", ...download },
  ];

  const totalRemaining = items.reduce(
    (n, i) => n + Math.max(0, i.limit - i.used),
    0
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex h-9 gap-1.5 px-2.5 text-xs font-medium"
          aria-label="Free trial usage"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="hidden md:inline">Free trial</span>
          <span className="text-muted-foreground">{totalRemaining} left</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Free trial usage</div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" /> Resets in {resetIn}
          </div>
        </div>
        <div className="space-y-3">
          {items.map(({ icon: Icon, label, used, limit }) => {
            const remaining = Math.max(0, limit - used);
            const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
            const atLimit = used >= limit;
            return (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                  </span>
                  <span className={atLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {remaining}/{limit} left
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all ${atLimit ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <Button
          size="sm"
          className="btn-gradient mt-4 w-full"
          onClick={() => navigate("/get-started")}
        >
          Sign up free — keep your progress
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default GuestUsageWidget;