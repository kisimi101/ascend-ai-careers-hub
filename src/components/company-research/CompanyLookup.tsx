import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Building2, Globe, Linkedin, Twitter, 
  Facebook, Instagram, MapPin, Users, ExternalLink,
  Loader2, Briefcase, TrendingUp, Star
} from "lucide-react";
import { toast } from "sonner";

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

// Mock company data - in production would come from an API
const mockCompanies: Record<string, CompanyInfo> = {
  "google": {
    name: "Google",
    description: "Google LLC is an American multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, and more.",
    website: "https://google.com",
    linkedin: "https://linkedin.com/company/google",
    twitter: "https://twitter.com/google",
    facebook: "https://facebook.com/google",
    instagram: "https://instagram.com/google",
    headquarters: "Mountain View, CA",
    employeeCount: "150,000+",
    industry: "Technology",
    founded: "1998",
    rating: 4.5,
    reviewCount: 25000,
    openPositions: 1250,
    recentNews: [
      "Google announces new AI initiatives for 2026",
      "Expansion of cloud services in Asia-Pacific region",
      "New sustainability commitments unveiled"
    ],
    benefits: ["Health Insurance", "401k Match", "Remote Work", "Unlimited PTO", "Learning Budget"],
    culture: ["Innovation-focused", "Collaborative", "Data-driven", "Diverse & Inclusive"]
  },
  "microsoft": {
    name: "Microsoft",
    description: "Microsoft Corporation is an American multinational technology corporation that develops, manufactures, licenses, supports, and sells computer software and consumer electronics.",
    website: "https://microsoft.com",
    linkedin: "https://linkedin.com/company/microsoft",
    twitter: "https://twitter.com/microsoft",
    facebook: "https://facebook.com/microsoft",
    instagram: "https://instagram.com/microsoft",
    headquarters: "Redmond, WA",
    employeeCount: "220,000+",
    industry: "Technology",
    founded: "1975",
    rating: 4.3,
    reviewCount: 32000,
    openPositions: 2100,
    recentNews: [
      "Microsoft Azure reaches new cloud market milestone",
      "Copilot AI integration across all products",
      "Gaming division reports record growth"
    ],
    benefits: ["Health Insurance", "Stock Options", "Parental Leave", "Education Assistance", "Wellness Programs"],
    culture: ["Growth Mindset", "Customer Obsessed", "One Microsoft", "Making a Difference"]
  },
  "apple": {
    name: "Apple",
    description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    website: "https://apple.com",
    linkedin: "https://linkedin.com/company/apple",
    twitter: "https://twitter.com/apple",
    facebook: "https://facebook.com/apple",
    instagram: "https://instagram.com/apple",
    headquarters: "Cupertino, CA",
    employeeCount: "160,000+",
    industry: "Technology",
    founded: "1976",
    rating: 4.2,
    reviewCount: 18000,
    openPositions: 890,
    recentNews: [
      "Apple Vision Pro 2 announced",
      "New privacy features in latest iOS update",
      "Sustainable packaging initiative expanded"
    ],
    benefits: ["Health Insurance", "Apple Products Discount", "Stock Purchase", "Fitness Reimbursement", "Commuter Benefits"],
    culture: ["Design Excellence", "Privacy First", "Innovation", "Sustainability"]
  }
};

export const CompanyLookup = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const query = searchQuery.toLowerCase();
    const foundCompany = mockCompanies[query] || Object.values(mockCompanies).find(
      c => c.name.toLowerCase().includes(query)
    );

    if (foundCompany) {
      setCompanyInfo(foundCompany);
      if (!recentSearches.includes(foundCompany.name)) {
        setRecentSearches(prev => [foundCompany.name, ...prev.slice(0, 4)]);
      }
      toast.success(`Found information for ${foundCompany.name}`);
    } else {
      // Generate mock data for unknown companies
      const mockUnknown: CompanyInfo = {
        name: searchQuery,
        description: `${searchQuery} is a company in the industry. Search for more details on their official website.`,
        website: `https://${searchQuery.toLowerCase().replace(/\s+/g, '')}.com`,
        linkedin: `https://linkedin.com/company/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
        twitter: "",
        facebook: "",
        instagram: "",
        headquarters: "Location not available",
        employeeCount: "Unknown",
        industry: "Various",
        founded: "N/A",
        rating: 0,
        reviewCount: 0,
        openPositions: 0,
        recentNews: [],
        benefits: [],
        culture: []
      };
      setCompanyInfo(mockUnknown);
      toast.info("Limited information available. Check official sources for details.");
    }
    
    setIsSearching(false);
  };

  const handleQuickSearch = (companyName: string) => {
    setSearchQuery(companyName);
    const company = Object.values(mockCompanies).find(
      c => c.name.toLowerCase() === companyName.toLowerCase()
    );
    if (company) {
      setCompanyInfo(company);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company Research
          </CardTitle>
          <CardDescription>
            Look up company profiles, social media links, and insights to customize your applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter company name (e.g., Google, Microsoft, Apple)"
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

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {["Google", "Microsoft", "Apple"].map((company) => (
              <Badge
                key={company}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleQuickSearch(company)}
              >
                {company}
              </Badge>
            ))}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Recent:</span>
              {recentSearches.map((company) => (
                <Badge
                  key={company}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleQuickSearch(company)}
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
                <div>
                  <CardTitle className="text-2xl">{companyInfo.name}</CardTitle>
                  <CardDescription className="mt-2 max-w-3xl">
                    {companyInfo.description}
                  </CardDescription>
                </div>
                {companyInfo.rating > 0 && (
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{companyInfo.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({companyInfo.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                )}
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
                <a
                  href={companyInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <Globe className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">Website</p>
                    <p className="text-sm text-muted-foreground truncate">{companyInfo.website}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
              
              {companyInfo.linkedin && (
                <a
                  href={companyInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  <div className="flex-1">
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Company Page</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}

              {companyInfo.twitter && (
                <a
                  href={companyInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  <div className="flex-1">
                    <p className="font-medium">Twitter / X</p>
                    <p className="text-sm text-muted-foreground">@{companyInfo.name.toLowerCase()}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}

              {companyInfo.facebook && (
                <a
                  href={companyInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <div className="flex-1">
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-muted-foreground">Company Page</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}

              {companyInfo.instagram && (
                <a
                  href={companyInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-[#E4405F]" />
                  <div className="flex-1">
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">@{companyInfo.name.toLowerCase()}</p>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Great time to apply!
                  </p>
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
    </div>
  );
};
