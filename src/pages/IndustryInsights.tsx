import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Briefcase, 
  Users, Globe, Sparkles, RefreshCw, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalaryTrend {
  role: string;
  averageSalary: number;
  change: number;
  demandLevel: 'high' | 'medium' | 'low';
  openings: number;
}

interface InDemandSkill {
  name: string;
  growthRate: number;
  averageSalaryBoost: number;
  demandScore: number;
}

interface MarketAnalysis {
  totalJobs: number;
  jobGrowth: number;
  averageSalary: number;
  salaryGrowth: number;
  topCompanies: string[];
  topLocations: { city: string; jobs: number; avgSalary: number }[];
}

interface IndustryData {
  industry: string;
  salaryTrends: SalaryTrend[];
  inDemandSkills: InDemandSkill[];
  marketAnalysis: MarketAnalysis;
  outlook: string;
  predictions: string[];
}

const IndustryInsights = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IndustryData | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);
  const { toast } = useToast();

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail & E-commerce' },
  ];

  const loadIndustryData = async (industry: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-job-market`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ industry }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job market data');
      }

      const result = await response.json();
      setData(result);
      setIsLiveData(result.isLiveData || false);
      
      if (result.isLiveData) {
        toast({
          title: "Live data loaded!",
          description: "Showing real-time job market insights.",
        });
      }
    } catch (error) {
      console.error('Error fetching industry data:', error);
      // Fall back to mock data
      const mockData = generateMockData(industry);
      setData(mockData);
      setIsLiveData(false);
      toast({
        title: "Using cached data",
        description: "Live data unavailable, showing sample insights.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (industry: string): IndustryData => ({
    industry,
    salaryTrends: [
      { role: 'Software Engineer', averageSalary: 125000, change: 8.5, demandLevel: 'high', openings: 45000 },
      { role: 'Product Manager', averageSalary: 140000, change: 6.2, demandLevel: 'high', openings: 28000 },
      { role: 'Data Scientist', averageSalary: 135000, change: 12.3, demandLevel: 'high', openings: 32000 },
      { role: 'UX Designer', averageSalary: 105000, change: 5.8, demandLevel: 'medium', openings: 18000 },
      { role: 'DevOps Engineer', averageSalary: 130000, change: 10.1, demandLevel: 'high', openings: 22000 },
      { role: 'Marketing Manager', averageSalary: 95000, change: 3.2, demandLevel: 'medium', openings: 15000 },
    ],
    inDemandSkills: [
      { name: 'AI/Machine Learning', growthRate: 45, averageSalaryBoost: 25000, demandScore: 95 },
      { name: 'Cloud Computing (AWS/GCP)', growthRate: 35, averageSalaryBoost: 20000, demandScore: 92 },
      { name: 'React/TypeScript', growthRate: 28, averageSalaryBoost: 15000, demandScore: 88 },
      { name: 'Kubernetes/Docker', growthRate: 32, averageSalaryBoost: 18000, demandScore: 85 },
      { name: 'Python', growthRate: 25, averageSalaryBoost: 12000, demandScore: 90 },
      { name: 'Data Analytics', growthRate: 30, averageSalaryBoost: 14000, demandScore: 82 },
      { name: 'Cybersecurity', growthRate: 38, averageSalaryBoost: 22000, demandScore: 88 },
      { name: 'Product Strategy', growthRate: 20, averageSalaryBoost: 18000, demandScore: 75 },
    ],
    marketAnalysis: {
      totalJobs: 2500000,
      jobGrowth: 15.3,
      averageSalary: 118000,
      salaryGrowth: 7.8,
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Salesforce', 'Adobe'],
      topLocations: [
        { city: 'San Francisco, CA', jobs: 185000, avgSalary: 165000 },
        { city: 'Seattle, WA', jobs: 120000, avgSalary: 155000 },
        { city: 'New York, NY', jobs: 145000, avgSalary: 145000 },
        { city: 'Austin, TX', jobs: 85000, avgSalary: 130000 },
        { city: 'Boston, MA', jobs: 72000, avgSalary: 140000 },
        { city: 'Remote', jobs: 350000, avgSalary: 125000 },
      ]
    },
    outlook: 'Strong growth expected with continued digital transformation across all sectors. AI and automation will create new roles while transforming existing ones.',
    predictions: [
      'AI/ML roles will see 40%+ growth in the next 2 years',
      'Remote work opportunities will stabilize at 35-40% of all tech jobs',
      'Entry-level salaries expected to increase 5-8% annually',
      'Cybersecurity demand will outpace supply for the next 5+ years',
      'Full-stack developers with cloud experience will be most sought after'
    ]
  });

  useEffect(() => {
    loadIndustryData(selectedIndustry);
  }, [selectedIndustry]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Industry Insights Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Job Market Intelligence</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLiveData ? 'Live' : 'Sample'} salary trends, in-demand skills, and job market analysis by industry
            </p>
            {isLiveData && (
              <Badge className="mt-2 bg-green-500">Live Data from Apify</Badge>
            )}
          </div>

          {/* Industry Selector */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Select Industry:</label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind.value} value={ind.value}>
                          {ind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => loadIndustryData(selectedIndustry)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading industry data...</p>
              </div>
            </div>
          ) : data && (
            <>
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Job Openings</p>
                        <p className="text-2xl font-bold">{formatNumber(data.marketAnalysis.totalJobs)}</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-primary/50" />
                    </div>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{data.marketAnalysis.jobGrowth}% YoY
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Salary</p>
                        <p className="text-2xl font-bold">{formatCurrency(data.marketAnalysis.averageSalary)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-primary/50" />
                    </div>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{data.marketAnalysis.salaryGrowth}% YoY
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Remote Jobs</p>
                        <p className="text-2xl font-bold">{formatNumber(data.marketAnalysis.topLocations.find(l => l.city === 'Remote')?.jobs || 0)}</p>
                      </div>
                      <Globe className="w-8 h-8 text-primary/50" />
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      ~14% of total openings
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Top Skill Demand</p>
                        <p className="text-2xl font-bold">AI/ML</p>
                      </div>
                      <Sparkles className="w-8 h-8 text-primary/50" />
                    </div>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +45% growth
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="salaries" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="salaries">Salary Trends</TabsTrigger>
                  <TabsTrigger value="skills">In-Demand Skills</TabsTrigger>
                  <TabsTrigger value="locations">Top Locations</TabsTrigger>
                  <TabsTrigger value="outlook">Market Outlook</TabsTrigger>
                </TabsList>

                {/* Salary Trends Tab */}
                <TabsContent value="salaries">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Salary Trends by Role
                      </CardTitle>
                      <CardDescription>
                        Average salaries and year-over-year changes for top roles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.salaryTrends.map((role, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{role.role}</span>
                                <div className="flex items-center gap-2">
                                  <Badge className={getDemandColor(role.demandLevel)}>
                                    {role.demandLevel} demand
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-2xl font-bold text-primary">
                                  {formatCurrency(role.averageSalary)}
                                </span>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    {getTrendIcon(role.change)}
                                    <span className={role.change > 0 ? 'text-green-600' : 'text-red-600'}>
                                      {role.change > 0 ? '+' : ''}{role.change}%
                                    </span>
                                  </span>
                                  <span>{formatNumber(role.openings)} openings</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* In-Demand Skills Tab */}
                <TabsContent value="skills">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Most In-Demand Skills
                      </CardTitle>
                      <CardDescription>
                        Skills with highest growth and salary boost potential
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {data.inDemandSkills.map((skill, idx) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium">{skill.name}</span>
                              <Badge variant="outline">
                                +{formatCurrency(skill.averageSalaryBoost)} salary boost
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Demand Score</span>
                                <span className="font-medium">{skill.demandScore}/100</span>
                              </div>
                              <Progress value={skill.demandScore} className="h-2" />
                              <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-muted-foreground">Growth Rate</span>
                                <span className="text-green-600 font-medium">+{skill.growthRate}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Top Locations Tab */}
                <TabsContent value="locations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Top Hiring Locations
                      </CardTitle>
                      <CardDescription>
                        Cities with highest job opportunities and average salaries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.marketAnalysis.topLocations.map((location, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{location.city}</span>
                                <span className="text-lg font-bold text-primary">
                                  {formatCurrency(location.avgSalary)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                                <span>{formatNumber(location.jobs)} open positions</span>
                                <span>avg salary</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Top Hiring Companies</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.marketAnalysis.topCompanies.map((company, idx) => (
                            <Badge key={idx} variant="secondary" className="text-sm">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Market Outlook Tab */}
                <TabsContent value="outlook">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Industry Outlook
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {data.outlook}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Key Predictions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {data.predictions.map((prediction, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">{idx + 1}</span>
                              </div>
                              <span className="text-sm">{prediction}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IndustryInsights;
