import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionState {
  isPro: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSubscription = (): SubscriptionState => {
  const { user, isAuthenticated } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsPro(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error: fnError } = await supabase.functions.invoke(
        "polar-customer-state"
      );

      if (fnError) throw fnError;
      setIsPro(data?.isPro ?? false);
      setError(null);
    } catch (err: any) {
      console.error("Subscription check error:", err);
      setError(err.message);
      setIsPro(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return { isPro, isLoading, error, refetch: fetchState };
};
