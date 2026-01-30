import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Clock, Building2, Loader2 } from "lucide-react";
import { useJobApplicationsDB } from "@/hooks/useJobApplicationsDB";
import { useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const JobAnalytics = () => {
  const { applications, isLoading } = useJobApplicationsDB();

  const analyticsData = useMemo(() => {
    if (!applications.length) return null;

    // Application trends over time (last 12 weeks)
    const now = new Date();
    const weeklyData: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      weeklyData[weekLabel] = 0;
    }

    applications.forEach(app => {
      const appDate = new Date(app.applied_date);
      const weeksSinceApp = Math.floor((now.getTime() - appDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weeksSinceApp < 12 && weeksSinceApp >= 0) {
        const weekStart = new Date(now.getTime() - weeksSinceApp * 7 * 24 * 60 * 60 * 1000);
        const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (weeklyData[weekLabel] !== undefined) {
          weeklyData[weekLabel]++;
        }
      }
    });

    const trendData = Object.entries(weeklyData).map(([week, count]) => ({
      week,
      applications: count,
    }));

    // Response rates by company (top 10 companies)
    const companyStats: Record<string, { total: number; responses: number }> = {};
    applications.forEach(app => {
      if (!companyStats[app.company]) {
        companyStats[app.company] = { total: 0, responses: 0 };
      }
      companyStats[app.company].total++;
      if (app.status !== 'applied' && app.status !== 'rejected') {
        companyStats[app.company].responses++;
      }
    });

    const companyData = Object.entries(companyStats)
      .map(([company, stats]) => ({
        company: company.length > 15 ? company.substring(0, 15) + '...' : company,
        fullName: company,
        total: stats.total,
        responses: stats.responses,
        responseRate: Math.round((stats.responses / stats.total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Time to offer metrics
    const offeredApps = applications.filter(app => app.status === 'offer');
    const timeToOfferData = offeredApps.map(app => {
      const appliedDate = new Date(app.applied_date);
      const updatedDate = new Date(app.updated_at);
      const daysToOffer = Math.floor((updatedDate.getTime() - appliedDate.getTime()) / (24 * 60 * 60 * 1000));
      return {
        company: app.company,
        position: app.position,
        daysToOffer: Math.max(1, daysToOffer),
      };
    });

    const avgTimeToOffer = timeToOfferData.length > 0
      ? Math.round(timeToOfferData.reduce((sum, item) => sum + item.daysToOffer, 0) / timeToOfferData.length)
      : 0;

    // Status distribution
    const statusCounts: Record<string, number> = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const statusData = [
      { name: 'Applied', value: statusCounts['applied'] || 0, color: 'hsl(217, 91%, 60%)' },
      { name: 'Phone Screen', value: statusCounts['phone-screen'] || 0, color: 'hsl(45, 93%, 47%)' },
      { name: 'Technical', value: statusCounts['technical'] || 0, color: 'hsl(271, 91%, 65%)' },
      { name: 'Onsite', value: statusCounts['onsite'] || 0, color: 'hsl(24, 95%, 53%)' },
      { name: 'Offer', value: statusCounts['offer'] || 0, color: 'hsl(142, 71%, 45%)' },
      { name: 'Rejected', value: statusCounts['rejected'] || 0, color: 'hsl(0, 84%, 60%)' },
    ].filter(item => item.value > 0);

    // Overall stats
    const totalApps = applications.length;
    const totalResponses = applications.filter(app => 
      app.status !== 'applied' && app.status !== 'rejected'
    ).length;
    const overallResponseRate = totalApps > 0 ? Math.round((totalResponses / totalApps) * 100) : 0;
    const interviewRate = totalApps > 0 
      ? Math.round((applications.filter(app => 
          ['phone-screen', 'technical', 'onsite'].includes(app.status)
        ).length / totalApps) * 100) 
      : 0;
    const offerRate = totalApps > 0 
      ? Math.round((statusCounts['offer'] || 0) / totalApps * 100) 
      : 0;

    return {
      trendData,
      companyData,
      timeToOfferData,
      avgTimeToOffer,
      statusData,
      totalApps,
      overallResponseRate,
      interviewRate,
      offerRate,
    };
  }, [applications]);

  const chartConfig = {
    applications: { label: "Applications", color: "hsl(var(--primary))" },
    responses: { label: "Responses", color: "hsl(var(--chart-2))" },
    responseRate: { label: "Response Rate", color: "hsl(var(--chart-3))" },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              Job Application Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Track Your
              <span className="text-gradient-primary"> Search Performance</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visualize your job search progress with detailed analytics on application trends, response rates, and time-to-offer metrics.
            </p>
          </div>

          {!analyticsData || applications.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No applications tracked yet. Start tracking to see analytics!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="card-enhanced">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">{analyticsData.totalApps}</div>
                      <div className="text-sm text-muted-foreground">Total Applications</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-enhanced">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">{analyticsData.overallResponseRate}%</div>
                      <div className="text-sm text-muted-foreground">Response Rate</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-enhanced">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">{analyticsData.interviewRate}%</div>
                      <div className="text-sm text-muted-foreground">Interview Rate</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-enhanced">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">{analyticsData.avgTimeToOffer || '-'}</div>
                      <div className="text-sm text-muted-foreground">Avg Days to Offer</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="trends" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="trends">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trends
                  </TabsTrigger>
                  <TabsTrigger value="companies">
                    <Building2 className="w-4 h-4 mr-2" />
                    Companies
                  </TabsTrigger>
                  <TabsTrigger value="pipeline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Pipeline
                  </TabsTrigger>
                  <TabsTrigger value="timing">
                    <Clock className="w-4 h-4 mr-2" />
                    Timing
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trends">
                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle>Application Trends (Last 12 Weeks)</CardTitle>
                      <CardDescription>Track how many applications you've submitted each week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[400px]">
                        <AreaChart data={analyticsData.trendData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="week" 
                            tick={{ fontSize: 12 }} 
                            className="text-muted-foreground"
                          />
                          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="applications"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="companies">
                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle>Response Rates by Company</CardTitle>
                      <CardDescription>See which companies are most responsive to your applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[400px]">
                        <BarChart data={analyticsData.companyData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis 
                            type="category" 
                            dataKey="company" 
                            width={120} 
                            tick={{ fontSize: 11 }} 
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="total" fill="hsl(var(--muted-foreground))" name="Total" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="responses" fill="hsl(var(--primary))" name="Responses" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pipeline">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="card-enhanced">
                      <CardHeader>
                        <CardTitle>Application Status Distribution</CardTitle>
                        <CardDescription>Current breakdown of your applications by status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analyticsData.statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {analyticsData.statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <ChartTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-enhanced">
                      <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                        <CardDescription>How applications progress through stages</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analyticsData.statusData.map((status, index) => {
                            const percentage = (status.value / analyticsData.totalApps) * 100;
                            return (
                              <div key={status.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{status.name}</span>
                                  <span className="text-muted-foreground">{status.value} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${percentage}%`,
                                      backgroundColor: status.color 
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timing">
                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle>Time to Offer Analysis</CardTitle>
                      <CardDescription>
                        {analyticsData.timeToOfferData.length > 0 
                          ? `Average time to offer: ${analyticsData.avgTimeToOffer} days`
                          : 'Track offers to see timing metrics'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analyticsData.timeToOfferData.length > 0 ? (
                        <ChartContainer config={chartConfig} className="h-[300px]">
                          <BarChart data={analyticsData.timeToOfferData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="company" tick={{ fontSize: 12 }} />
                            <YAxis 
                              label={{ value: 'Days', angle: -90, position: 'insideLeft' }} 
                              tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar 
                              dataKey="daysToOffer" 
                              fill="hsl(var(--chart-4))" 
                              name="Days to Offer"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No offers tracked yet. When you receive offers, timing metrics will appear here.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobAnalytics;
