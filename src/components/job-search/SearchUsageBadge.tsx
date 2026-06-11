import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Crown, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchUsageProps {
  used?: number;
  limit?: number;
  tier?: string;
  monthlyUsed?: number;
  monthlyLimit?: number | null;
  onRefresh?: () => void;
}

export const SearchUsageBadge = ({ used: propUsed, limit: propLimit, tier: propTier, monthlyUsed: propMonthlyUsed, monthlyLimit: propMonthlyLimit, onRefresh }: SearchUsageProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [used, setUsed] = useState(propUsed ?? 0);
  const [limit, setLimit] = useState(propLimit ?? 5);
  const [tier, setTier] = useState(propTier ?? "free");
  const [monthlyUsed, setMonthlyUsed] = useState<number>(propMonthlyUsed ?? 0);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(propMonthlyLimit ?? null);
  const [loading, setLoading] = useState(!propUsed && !propLimit);

  useEffect(() => {
    if (propUsed !== undefined) setUsed(propUsed);
    if (propLimit !== undefined) setLimit(propLimit);
    if (propTier !== undefined) setTier(propTier);
    if (propMonthlyUsed !== undefined) setMonthlyUsed(propMonthlyUsed);
    if (propMonthlyLimit !== undefined) setMonthlyLimit(propMonthlyLimit);
  }, [propUsed, propLimit, propTier, propMonthlyUsed, propMonthlyLimit]);

  useEffect(() => {
    if (propUsed !== undefined) return;
    fetchUsage();
  }, [isAuthenticated]);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("search-jobs", {
        body: { checkUsageOnly: true },
      });
      if (!error && data) {
        setUsed(data.used);
        setLimit(data.limit);
        setTier(data.tier);
        setMonthlyUsed(data.monthlyUsed ?? 0);
        setMonthlyLimit(data.monthlyLimit ?? null);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const remaining = Math.max(0, limit - used);
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = used >= limit;
  const isUnlimited = limit >= 999999;
  const monthRemaining = monthlyLimit ? Math.max(0, monthlyLimit - monthlyUsed) : null;
  const monthAtLimit = monthlyLimit ? monthlyUsed >= monthlyLimit : false;

  const TierIcon = tier === "enterprise" ? Crown : tier === "pro" ? Zap : Search;

  // Daily reset = next UTC midnight.
  const resetIn = useMemo(() => {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const ms = next.getTime() - now.getTime();
    const h = Math.floor(ms / 3.6e6);
    const m = Math.floor((ms % 3.6e6) / 6e4);
    return `${h}h ${m}m`;
  }, [used, limit]);

  return (
    <div className="flex flex-col gap-2 bg-card border rounded-lg px-4 py-2.5">
      <div className="flex items-center gap-3">
        <TierIcon className="w-4 h-4 text-primary shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {isUnlimited ? "Unlimited" : `${used}/${limit}`}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {isUnlimited ? "searches" : "today"}
          </span>
          {!isUnlimited && (
            <div className="hidden sm:flex items-center gap-1.5 flex-1 min-w-[60px]">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isAtLimit ? "bg-destructive" : isNearLimit ? "bg-yellow-500" : "bg-primary"}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <Badge variant={isAtLimit || monthAtLimit ? "destructive" : "secondary"} className="text-xs shrink-0 capitalize">
          {tier}
        </Badge>
        {tier === "free" && (
          <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2" onClick={() => navigate("/#pricing")}>
            Upgrade
          </Button>
        )}
        {tier === "guest" && (
          <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2" onClick={() => navigate("/get-started")}>
            Sign up free
          </Button>
        )}
      </div>
      {!isUnlimited && (
        <div className="flex items-center gap-1.5 pl-7 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          Resets in {resetIn}
          {isAtLimit && tier === "guest" && (
            <span className="ml-2 text-destructive font-medium">Limit reached — sign up free to keep searching.</span>
          )}
        </div>
      )}
      {monthlyLimit && (
        <div className="flex items-center gap-2 pl-7">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Monthly: <span className={`font-medium ${monthAtLimit ? "text-destructive" : "text-foreground"}`}>{monthlyUsed}/{monthlyLimit}</span>
          </span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden min-w-[60px]">
            <div
              className={`h-full rounded-full transition-all ${monthAtLimit ? "bg-destructive" : monthlyUsed / monthlyLimit >= 0.8 ? "bg-yellow-500" : "bg-primary/70"}`}
              style={{ width: `${Math.min((monthlyUsed / monthlyLimit) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {monthRemaining} left
          </span>
        </div>
      )}
    </div>
  );
};
