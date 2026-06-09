import { useState, useCallback, useEffect } from "react";

/**
 * Tracks one-time free usage for unauthenticated visitors via localStorage.
 * Returns { used, limit, remaining, canUse, recordUse }.
 */
export function useTrialLimit(key: string, limit: number) {
  const storageKey = `trial:${key}`;
  const [used, setUsed] = useState<number>(() => {
    try {
      const v = window.localStorage.getItem(storageKey);
      return v ? parseInt(v, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, String(used));
    } catch {}
  }, [storageKey, used]);

  const recordUse = useCallback(() => {
    setUsed((u) => u + 1);
  }, []);

  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    canUse: used < limit,
    recordUse,
  };
}

export default useTrialLimit;