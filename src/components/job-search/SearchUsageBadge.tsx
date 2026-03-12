import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchUsageProps {
  used?: number;
  limit?: number;
  tier?: string;
  onRefresh?: () => void;
}

export const SearchUsageBadge = ({ used: propUsed, limit: propLimit, tier: propTier, onRefresh }: SearchUsageProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [used, setUsed] = useState(propUsed ?? 0);
  const [limit, setLimit] = useState(propLimit ?? 5);
  const [tier, setTier] = useState(propTier ?? "free");
  const [loading, setLoading] = useState(!propUsed && !propLimit);

  useEffect(() => {
    if (propUsed !== undefined) setUsed(propUsed);
    if (propLimit !== undefined) setLimit(propLimit);
    if (propTier !== undefined) setTier(propTier);
  }, [propUsed, propLimit, propTier]);

  useEffect(() => {
    if (!isAuthenticated || propUsed !== undefined) return;
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
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) return null;

  const remaining = Math.max(0, limit - used);
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = used >= limit;
  const isUnlimited = limit >= 999999;

  const TierIcon = tier === "enterprise" ? Crown : tier === "pro" ? Zap : Search;

  return (
    <div className="flex items-center gap-3 bg-card border rounded-lg px-4 py-2.5">
      <TierIcon className="w-4 h-4 text-primary shrink-0" />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {isUnlimited ? "Unlimited" : `${used}/${limit}`}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {isUnlimited ? "searches" : "searches today"}
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
      <Badge variant={isAtLimit ? "destructive" : "secondary"} className="text-xs shrink-0 capitalize">
        {tier}
      </Badge>
      {tier === "free" && (
        <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2" onClick={() => navigate("/#pricing")}>
          Upgrade
        </Button>
      )}
    </div>
  );
};
