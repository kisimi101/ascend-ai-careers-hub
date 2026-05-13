export interface ApplyHistoryJob {
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  status: "queued" | "opened" | "applied";
}

export interface ApplyHistoryRun {
  id: string;
  timestamp: number;
  jobs: ApplyHistoryJob[];
  template?: string;
}

const HISTORY_KEY = "smart-apply-history";
const INSTANT_USAGE_KEY = "instant-apply-usage";

export const INSTANT_APPLY_LIMITS: Record<string, number> = {
  free: 0,
  pro: 100,
  enterprise: Infinity,
};

export function loadHistory(): ApplyHistoryRun[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRun(run: ApplyHistoryRun) {
  const all = loadHistory();
  all.unshift(run);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all.slice(0, 50)));
}

export function updateRunJobStatus(runId: string, jobIndex: number, status: ApplyHistoryJob["status"]) {
  const all = loadHistory();
  const run = all.find(r => r.id === runId);
  if (run && run.jobs[jobIndex]) {
    run.jobs[jobIndex].status = status;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
  }
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

export function getInstantApplyUsage(): { month: string; used: number } {
  try {
    const raw = localStorage.getItem(INSTANT_USAGE_KEY);
    const month = currentMonthKey();
    if (!raw) return { month, used: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.month !== month) return { month, used: 0 };
    return parsed;
  } catch {
    return { month: currentMonthKey(), used: 0 };
  }
}

export function incrementInstantApply(count: number) {
  const current = getInstantApplyUsage();
  const next = { month: current.month, used: current.used + count };
  localStorage.setItem(INSTANT_USAGE_KEY, JSON.stringify(next));
  return next;
}

export function getInstantApplyLimit(tier: string | undefined): number {
  return INSTANT_APPLY_LIMITS[tier ?? "free"] ?? 0;
}

export function getInstantApplyRemaining(tier: string | undefined): number {
  const limit = getInstantApplyLimit(tier);
  if (limit === Infinity) return Infinity;
  const { used } = getInstantApplyUsage();
  return Math.max(0, limit - used);
}