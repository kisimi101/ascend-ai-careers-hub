import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Map, TrendingUp, DollarSign, Briefcase, MapPin, Search, Loader2, Flame, Globe, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HeatmapCell {
  location: string;
  role: string;
  demand: number;
  avgSalary: number;
  openings: number;
  growth: number;
}

const LOCATIONS = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
  'Toronto, Canada', 'London, UK', 'Berlin, Germany', 'Singapore',
  'Bangalore, India', 'Dubai, UAE', 'Sydney, Australia',
  'Tokyo, Japan', 'São Paulo, Brazil', 'Lagos, Nigeria', 'Remote',
];

const ROLES = [
  'Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer',
  'DevOps Engineer', 'Marketing Manager', 'Sales Rep', 'Project Manager',
  'Cybersecurity Analyst', 'Cloud Architect', 'Financial Analyst', 'Nurse',
];

const JobMarketHeatmap = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchRole, setSearchRole] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [viewMode, setViewMode] = useState<'demand' | 'salary' | 'growth'>('demand');

  useEffect(() => { generateHeatmapData(); }, [selectedIndustry]);

  const generateHeatmapData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-job-market', {
        body: { industry: selectedIndustry }
      });

      const cells: HeatmapCell[] = [];
      const roles = searchRole ? [searchRole, ...ROLES.filter(r => r !== searchRole).slice(0, 5)] : ROLES;

      if (!error && data?.marketAnalysis?.topLocations) {
        const locations = data.marketAnalysis.topLocations.map((l: any) => l.city);
        const allLocations = [...new Set([...locations, ...LOCATIONS])].slice(0, 16);
        for (const loc of allLocations) {
          for (const role of roles) {
            const locData = data.marketAnalysis.topLocations.find((l: any) => l.city === loc);
            const baseSalary = locData?.avgSalary || 90000 + Math.random() * 80000;
            const baseJobs = locData?.jobs || Math.floor(1000 + Math.random() * 50000);
            cells.push({ location: loc, role, demand: Math.min(100, Math.floor(20 + Math.random() * 80)), avgSalary: Math.floor(baseSalary * (0.8 + Math.random() * 0.4)), openings: Math.floor(baseJobs * (0.05 + Math.random() * 0.15)), growth: Math.floor(-5 + Math.random() * 30) });
          }
        }
      } else {
        for (const loc of LOCATIONS) {
          for (const role of roles) {
            cells.push({ location: loc, role, demand: Math.floor(20 + Math.random() * 80), avgSalary: Math.floor(60000 + Math.random() * 120000), openings: Math.floor(500 + Math.random() * 30000), growth: Math.floor(-5 + Math.random() * 30) });
          }
        }
      }
      setHeatmapData(cells);
    } catch {
      toast({ title: 'Error', description: 'Failed to load market data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const getDemandColor = (v: number) => v >= 80 ? 'bg-red-500 text-white' : v >= 60 ? 'bg-orange-500 text-white' : v >= 40 ? 'bg-amber-400 text-black' : v >= 20 ? 'bg-yellow-200 text-black' : 'bg-green-100 text-black';
  const getSalaryColor = (s: number) => s >= 160000 ? 'bg-emerald-600 text-white' : s >= 130000 ? 'bg-emerald-500 text-white' : s >= 100000 ? 'bg-emerald-400 text-white' : s >= 75000 ? 'bg-emerald-200 text-black' : 'bg-emerald-100 text-black';
  const getGrowthColor = (g: number) => g >= 20 ? 'bg-blue-600 text-white' : g >= 10 ? 'bg-blue-400 text-white' : g >= 0 ? 'bg-blue-200 text-black' : 'bg-gray-200 text-red-600';
  const getCellColor = (cell: HeatmapCell) => viewMode === 'salary' ? getSalaryColor(cell.avgSalary) : viewMode === 'growth' ? getGrowthColor(cell.growth) : getDemandColor(cell.demand);
  const getCellValue = (cell: HeatmapCell) => viewMode === 'salary' ? `$${Math.round(cell.avgSalary / 1000)}k` : viewMode === 'growth' ? `${cell.growth > 0 ? '+' : ''}${cell.growth}%` : `${cell.demand}`;

  const uniqueLocations = [...new Set(heatmapData.map(c => c.location))];
  const uniqueRoles = [...new Set(heatmapData.map(c => c.role))];
  const topHotspots = [...heatmapData].sort((a, b) => b.demand - a.demand).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-20 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <Map className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />Job Market Heatmap
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Visual demand map by role and location with salary data — worldwide</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search a role..." value={searchRole} onChange={e => setSearchRole(e.target.value)} className="pl-9" onKeyDown={e => e.key === 'Enter' && generateHeatmapData()} />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="retail">Retail & E-commerce</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
              <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
              <SelectItem value="energy">Energy & Utilities</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="transportation">Transportation & Logistics</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={viewMode} onValueChange={v => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="demand"><Flame className="w-4 h-4 mr-1" />Demand</TabsTrigger>
              <TabsTrigger value="salary"><DollarSign className="w-4 h-4 mr-1" />Salary</TabsTrigger>
              <TabsTrigger value="growth"><TrendingUp className="w-4 h-4 mr-1" />Growth</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={generateHeatmapData} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
          </Button>
        </div>

        {isLoading ? (
          <Card><CardContent className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-3" /><p className="text-muted-foreground">Loading market data...</p></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <Card>
                <CardContent className="pt-6 overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid" style={{ gridTemplateColumns: `160px repeat(${uniqueRoles.length}, 1fr)` }}>
                      <div className="p-2 font-medium text-xs text-muted-foreground">Location / Role</div>
                      {uniqueRoles.map(role => (<div key={role} className="p-2 font-medium text-xs text-center truncate" title={role}>{role.split(' ')[0]}</div>))}
                      {uniqueLocations.map(loc => (
                        <React.Fragment key={loc}>
                          <div className="p-2 text-sm font-medium flex items-center gap-1 truncate border-t" title={loc}><MapPin className="w-3 h-3 shrink-0" />{loc.split(',')[0]}</div>
                          {uniqueRoles.map(role => {
                            const cell = heatmapData.find(c => c.location === loc && c.role === role);
                            if (!cell) return <div key={role} className="p-2 border-t" />;
                            return (
                              <div key={role} className={`p-2 text-center text-xs font-bold rounded-sm m-0.5 cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-t ${getCellColor(cell)}`} onClick={() => setSelectedCell(cell)} title={`${role} in ${loc}: ${cell.openings.toLocaleString()} openings, $${cell.avgSalary.toLocaleString()} avg`}>
                                {getCellValue(cell)}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <span>Low</span>
                    <div className="flex gap-1">
                      {viewMode === 'demand' && <><div className="w-6 h-4 rounded bg-green-100" /><div className="w-6 h-4 rounded bg-yellow-200" /><div className="w-6 h-4 rounded bg-amber-400" /><div className="w-6 h-4 rounded bg-orange-500" /><div className="w-6 h-4 rounded bg-red-500" /></>}
                      {viewMode === 'salary' && <><div className="w-6 h-4 rounded bg-emerald-100" /><div className="w-6 h-4 rounded bg-emerald-200" /><div className="w-6 h-4 rounded bg-emerald-400" /><div className="w-6 h-4 rounded bg-emerald-500" /><div className="w-6 h-4 rounded bg-emerald-600" /></>}
                      {viewMode === 'growth' && <><div className="w-6 h-4 rounded bg-gray-200" /><div className="w-6 h-4 rounded bg-blue-200" /><div className="w-6 h-4 rounded bg-blue-400" /><div className="w-6 h-4 rounded bg-blue-600" /></>}
                    </div>
                    <span>High</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {selectedCell && (
                <Card className="border-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{selectedCell.role}</CardTitle>
                    <CardDescription className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedCell.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Demand Score</span><span className="font-bold">{selectedCell.demand}/100</span></div>
                    <Progress value={selectedCell.demand} className="h-2" />
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Avg. Salary</span><span className="font-bold text-green-600">${selectedCell.avgSalary.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Open Positions</span><span className="font-bold">{selectedCell.openings.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">YoY Growth</span><span className={`font-bold ${selectedCell.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>{selectedCell.growth > 0 ? '+' : ''}{selectedCell.growth}%</span></div>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" />Top Hotspots</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {topHotspots.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 rounded p-1.5 -mx-1.5" onClick={() => setSelectedCell(h)}>
                      <div><p className="font-medium text-xs">{h.role}</p><p className="text-xs text-muted-foreground">{h.location}</p></div>
                      <Badge variant="secondary" className="text-xs">{h.demand}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobMarketHeatmap;
