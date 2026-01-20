import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Briefcase,
  Phone,
  CheckCircle2,
  XCircle,
  Target,
  BarChart3
} from "lucide-react";

interface WeeklyStats {
  totalThisWeek: number;
  totalLastWeek: number;
  changePercentage: number;
  offersThisWeek: number;
  interviewsThisWeek: number;
  rejectionsThisWeek: number;
  thisWeekByStatus: Record<string, number>;
  lastWeekByStatus: Record<string, number>;
}

interface MilestoneStats {
  totalMilestones: number;
  completedMilestones: number;
  upcomingMilestones: number;
  completionRate: number;
}

interface WeeklyProgressReportProps {
  weeklyStats: WeeklyStats;
  milestoneStats: MilestoneStats;
}

export const WeeklyProgressReport = ({ weeklyStats, milestoneStats }: WeeklyProgressReportProps) => {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const interviewSuccessRate = weeklyStats.interviewsThisWeek > 0
    ? Math.round((weeklyStats.offersThisWeek / weeklyStats.interviewsThisWeek) * 100)
    : 0;

  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Weekly Progress Report
        </CardTitle>
        <CardDescription>Your job search performance this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Application Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{weeklyStats.totalThisWeek}</span>
              <div className={`flex items-center text-sm ${getTrendColor(weeklyStats.changePercentage)}`}>
                {getTrendIcon(weeklyStats.changePercentage)}
                <span className="ml-1">{Math.abs(weeklyStats.changePercentage)}%</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">vs last week ({weeklyStats.totalLastWeek})</span>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Interviews</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{weeklyStats.interviewsThisWeek}</span>
            <div className="text-xs text-muted-foreground">scheduled this week</div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Offers</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{weeklyStats.offersThisWeek}</span>
            <div className="text-xs text-muted-foreground">received this week</div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Rejections</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{weeklyStats.rejectionsThisWeek}</span>
            <div className="text-xs text-muted-foreground">this week</div>
          </div>
        </div>

        {/* Interview Success Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Interview Success Rate</span>
            <span className="text-sm text-muted-foreground">{interviewSuccessRate}%</span>
          </div>
          <Progress value={interviewSuccessRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {weeklyStats.offersThisWeek} offers from {weeklyStats.interviewsThisWeek} interviews this week
          </p>
        </div>

        {/* Milestone Stats */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Career Milestones</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xl font-bold text-foreground">{milestoneStats.completedMilestones}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xl font-bold text-foreground">{milestoneStats.upcomingMilestones}</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xl font-bold text-foreground">{milestoneStats.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{milestoneStats.completionRate}%</span>
            </div>
            <Progress value={milestoneStats.completionRate} className="h-2" />
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground mb-3 block">This Week's Status Breakdown</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(weeklyStats.thisWeekByStatus).map(([status, count]) => (
              <Badge 
                key={status} 
                variant="secondary"
                className="px-3 py-1"
              >
                {status.replace('-', ' ')}: {count}
              </Badge>
            ))}
            {Object.keys(weeklyStats.thisWeekByStatus).length === 0 && (
              <span className="text-sm text-muted-foreground">No applications this week</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
