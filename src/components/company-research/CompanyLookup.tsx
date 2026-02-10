import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Building2, Globe, Linkedin, Twitter, 
  Facebook, Instagram, MapPin, Users, ExternalLink,
  Loader2, Briefcase, TrendingUp, Star, Heart, HeartOff,
  Bell, BellOff, Trash2, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyInfo {
  name: string;
  description: string;
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  headquarters: string;
  employeeCount: string;
  industry: string;
  founded: string;
  rating: number;
  reviewCount: number;
  openPositions: number;
  recentNews: string[];
  benefits: string[];
  culture: string[];
}

interface FavoriteCompany {
  id: string;
  company_name: string;
  company_website: string | null;
  company_linkedin: string | null;
  company_twitter: string | null;
  company_facebook: string | null;
  company_instagram: string | null;
  headquarters: string | null;
  employee_count: string | null;
  industry: string | null;
  founded: string | null;
  description: string | null;
  benefits: string[] | null;
  culture: string[] | null;
  notes: string | null;
  created_at: string;
}

export const CompanyLookup = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteCompany[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (companyInfo && favorites.length > 0) {
      setIsFavorite(favorites.some(f => f.company_name.toLowerCase() === companyInfo.name.toLowerCase()));
    } else {
      setIsFavorite(false);
    }
  }, [companyInfo, favorites]);

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const { data, error } = await supabase
        .from('favorite_companies')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setFavorites((data as FavoriteCompany[]) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('scrape-company', {
        body: { companyName: searchQuery.trim() },
      });

      if (error) throw error;

      if (data?.success && data.company) {
        const company: CompanyInfo = {
          name: data.company.name || searchQuery,
          description: data.company.description || '',
          website: data.company.website || '',
          linkedin: data.company.linkedin || '',
          twitter: data.company.twitter || '',
          facebook: data.company.facebook || '',
          instagram: data.company.instagram || '',
          headquarters: data.company.headquarters || 'Not available',
          employeeCount: data.company.employeeCount || 'Unknown',
          industry: data.company.industry || 'Various',
          founded: data.company.founded || 'N/A',
          rating: data.company.rating || 0,
          reviewCount: data.company.reviewCount || 0,
          openPositions: data.company.openPositions || 0,
          recentNews: data.company.recentNews || [],
          benefits: data.company.benefits || [],
          culture: data.company.culture || [],
        };
        setCompanyInfo(company);
        if (!recentSearches.includes(company.name)) {
          setRecentSearches(prev => [company.name, ...prev.slice(0, 4)]);
        }
        toast.success(`Found information for ${company.name}`);
      } else {
        toast.error(data?.error || "Could not find company information");
      }
    } catch (error) {
      console.error('Error searching company:', error);
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !companyInfo) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (isFavorite) {
      // Remove from favorites
      const fav = favorites.find(f => f.company_name.toLowerCase() === companyInfo.name.toLowerCase());
      if (fav) {
        const { error } = await supabase.from('favorite_companies').delete().eq('id', fav.id);
        if (error) {
          toast.error("Failed to remove from favorites");
          return;
        }
        setFavorites(prev => prev.filter(f => f.id !== fav.id));
        toast.success(`${companyInfo.name} removed from favorites`);
      }
    } else {
      // Add to favorites
      const { error } = await supabase.from('favorite_companies').insert({
        user_id: user!.id,
        company_name: companyInfo.name,
        company_website: companyInfo.website || null,
        company_linkedin: companyInfo.linkedin || null,
        company_twitter: companyInfo.twitter || null,
        company_facebook: companyInfo.facebook || null,
        company_instagram: companyInfo.instagram || null,
        headquarters: companyInfo.headquarters || null,
        employee_count: companyInfo.employeeCount || null,
        industry: companyInfo.industry || null,
        founded: companyInfo.founded || null,
        description: companyInfo.description || null,
        benefits: companyInfo.benefits || [],
        culture: companyInfo.culture || [],
      });
      if (error) {
        if (error.code === '23505') {
          toast.info("Company already in favorites");
        } else {
          toast.error("Failed to save to favorites");
        }
        return;
      }
      await fetchFavorites();
      toast.success(`${companyInfo.name} saved to favorites!`);
    }
  };

  const handleCreateJobAlert = async (companyName: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to create job alerts");
      return;
    }

    try {
      const { error } = await supabase.from('job_alerts').insert({
        user_id: user!.id,
        job_title: `Any position at ${companyName}`,
        keywords: [companyName.toLowerCase()],
        email_frequency: 'daily',
      });
      if (error) throw error;
      toast.success(`Job alert created for ${companyName}! You'll be notified of new positions.`);
    } catch (error) {
      console.error('Error creating job alert:', error);
      toast.error("Failed to create job alert");
    }
  };

  const handleDeleteFavorite = async (id: string, name: string) => {
    const { error } = await supabase.from('favorite_companies').delete().eq('id', id);
    if (error) {
      toast.error("Failed to remove company");
      return;
    }
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast.success(`${name} removed from favorites`);
  };

  const handleViewFavorite = (fav: FavoriteCompany) => {
    setCompanyInfo({
      name: fav.company_name,
      description: fav.description || '',
      website: fav.company_website || '',
      linkedin: fav.company_linkedin || '',
      twitter: fav.company_twitter || '',
      facebook: fav.company_facebook || '',
      instagram: fav.company_instagram || '',
      headquarters: fav.headquarters || 'Not available',
      employeeCount: fav.employee_count || 'Unknown',
      industry: fav.industry || 'Various',
      founded: fav.founded || 'N/A',
      rating: 0,
      reviewCount: 0,
      openPositions: 0,
      recentNews: [],
      benefits: fav.benefits || [],
      culture: fav.culture || [],
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Companies
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Favorites ({favorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Company Research
              </CardTitle>
              <CardDescription>
                Search any company to get live data from their website, LinkedIn, and social profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter company name (e.g., Google, Tesla, Netflix)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {recentSearches.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Recent:</span>
                  {recentSearches.map((company) => (
                    <Badge
                      key={company}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => { setSearchQuery(company); }}
                    >
                      {company}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Results */}
          {companyInfo && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Company Overview */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{companyInfo.name}</CardTitle>
                      <CardDescription className="mt-2 max-w-3xl">
                        {companyInfo.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {isAuthenticated && (
                        <>
                          <Button
                            variant={isFavorite ? "default" : "outline"}
                            size="sm"
                            onClick={handleToggleFavorite}
                            className="flex items-center gap-1.5"
                          >
                            {isFavorite ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                            {isFavorite ? "Unsave" : "Save"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateJobAlert(companyInfo.name)}
                            className="flex items-center gap-1.5"
                          >
                            <Bell className="w-4 h-4" />
                            Job Alert
                          </Button>
                        </>
                      )}
                      {companyInfo.rating > 0 && (
                        <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{companyInfo.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{companyInfo.headquarters}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{companyInfo.employeeCount} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{companyInfo.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>Founded {companyInfo.founded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Media & Links</CardTitle>
                  <CardDescription>Connect with {companyInfo.name} online</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companyInfo.website && (
                    <a href={companyInfo.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">Website</p>
                        <p className="text-sm text-muted-foreground truncate">{companyInfo.website}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {companyInfo.linkedin && (
                    <a href={companyInfo.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                      <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                      <div className="flex-1">
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Company Page</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {companyInfo.twitter && (
                    <a href={companyInfo.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                      <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                      <div className="flex-1">
                        <p className="font-medium">Twitter / X</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {companyInfo.facebook && (
                    <a href={companyInfo.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                      <Facebook className="w-5 h-5 text-[#1877F2]" />
                      <div className="flex-1">
                        <p className="font-medium">Facebook</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {companyInfo.instagram && (
                    <a href={companyInfo.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                      <Instagram className="w-5 h-5 text-[#E4405F]" />
                      <div className="flex-1">
                        <p className="font-medium">Instagram</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Company Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Insights</CardTitle>
                  <CardDescription>Use these for your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyInfo.openPositions > 0 && (
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="font-medium text-green-700 dark:text-green-400">
                        {companyInfo.openPositions.toLocaleString()} Open Positions
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Great time to apply!</p>
                    </div>
                  )}

                  {companyInfo.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Benefits & Perks</h4>
                      <div className="flex flex-wrap gap-2">
                        {companyInfo.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary">{benefit}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {companyInfo.culture.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Company Culture</h4>
                      <div className="flex flex-wrap gap-2">
                        {companyInfo.culture.map((value) => (
                          <Badge key={value} variant="outline">{value}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {companyInfo.recentNews.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recent News</h4>
                      <ul className="space-y-2">
                        {companyInfo.recentNews.map((news, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {news}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Saved Companies
                  </CardTitle>
                  <CardDescription>
                    Your favorite employers — search them again or set up job alerts
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchFavorites} disabled={loadingFavorites}>
                  <RefreshCw className={`w-4 h-4 ${loadingFavorites ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sign in to save your favorite companies</p>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved companies yet. Search and save companies you're interested in!</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleViewFavorite(fav)}>
                        <h3 className="font-medium">{fav.company_name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {fav.industry && <Badge variant="outline" className="text-xs">{fav.industry}</Badge>}
                          {fav.headquarters && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{fav.headquarters}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewFavorite(fav)} title="View details">
                          <Search className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleCreateJobAlert(fav.company_name)} title="Create job alert">
                          <Bell className="w-4 h-4" />
                        </Button>
                        {fav.company_website && (
                          <a href={fav.company_website} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" title="Visit website">
                              <Globe className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {fav.company_linkedin && (
                          <a href={fav.company_linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" title="View LinkedIn">
                              <Linkedin className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFavorite(fav.id, fav.company_name)} title="Remove">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
