import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, MapPin, Building, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalaryData {
  min: number;
  max: number;
  median: number;
  percentile25: number;
  percentile75: number;
}

const SalaryEstimator = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");
  const [education, setEducation] = useState("");
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const baseSalaries: Record<string, number> = {
    "software-engineer": 95000,
    "product-manager": 115000,
    "data-scientist": 110000,
    "marketing-manager": 85000,
    "sales-representative": 65000,
    "project-manager": 90000,
    "ux-designer": 80000,
    "devops-engineer": 105000,
    "business-analyst": 75000,
    "hr-manager": 78000,
    "cybersecurity-analyst": 100000,
    "cloud-architect": 130000,
    "content-writer": 55000,
    "financial-analyst": 80000,
    "accountant": 65000,
    "lawyer": 120000,
    "doctor": 200000,
    "teacher": 50000,
    "nurse": 70000,
    "architect": 85000,
    "civil-engineer": 80000,
    "pharmacist": 120000,
    "supply-chain-manager": 90000,
    "journalist": 55000,
    "graphic-designer": 60000,
    "mechanical-engineer": 85000,
    "data-engineer": 115000,
    "mobile-developer": 105000,
    "qa-engineer": 85000,
    "digital-marketing-specialist": 65000,
  };

  const locationMultipliers: Record<string, number> = {
    // North America
    "san-francisco": 1.8,
    "new-york": 1.6,
    "seattle": 1.5,
    "boston": 1.4,
    "los-angeles": 1.3,
    "chicago": 1.1,
    "austin": 1.2,
    "denver": 1.0,
    "atlanta": 0.9,
    "toronto": 1.2,
    "vancouver": 1.15,
    // Europe
    "london": 1.4,
    "berlin": 1.0,
    "paris": 1.1,
    "amsterdam": 1.15,
    "zurich": 1.7,
    "dublin": 1.1,
    // Asia Pacific
    "singapore": 1.3,
    "tokyo": 1.2,
    "sydney": 1.2,
    "bangalore": 0.4,
    "shanghai": 0.6,
    "hong-kong": 1.3,
    "seoul": 0.8,
    // Middle East & Africa
    "dubai": 1.2,
    "tel-aviv": 1.1,
    "lagos": 0.25,
    "nairobi": 0.25,
    "cape-town": 0.35,
    "cairo": 0.2,
    // Latin America
    "sao-paulo": 0.35,
    "mexico-city": 0.3,
    "buenos-aires": 0.3,
    "bogota": 0.25,
    // Remote
    "remote": 1.1,
  };

  const experienceMultipliers: Record<string, number> = {
    "entry": 0.8,
    "mid": 1.0,
    "senior": 1.4,
    "lead": 1.7,
    "manager": 1.9,
    "director": 2.5,
  };

  const calculateSalary = () => {
    if (!jobTitle || !location || !experience) {
      toast({ title: "Missing Information", description: "Please fill in job title, location, and experience level", variant: "destructive" });
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const baseJobSalary = baseSalaries[jobTitle] || 75000;
      const locationMult = locationMultipliers[location] || 1.0;
      const experienceMult = experienceMultipliers[experience] || 1.0;
      const educationBonus = education === "masters" ? 1.1 : education === "phd" ? 1.2 : 1.0;
      const companyBonus = company === "large" ? 1.15 : company === "startup" ? 1.05 : 1.0;

      const baseSalary = baseJobSalary * locationMult * experienceMult * educationBonus * companyBonus;

      const salaryRange: SalaryData = {
        min: Math.round(baseSalary * 0.8),
        max: Math.round(baseSalary * 1.3),
        median: Math.round(baseSalary),
        percentile25: Math.round(baseSalary * 0.9),
        percentile75: Math.round(baseSalary * 1.15),
      };

      setSalaryData(salaryRange);
      setIsCalculating(false);
      toast({ title: "Salary Calculated!", description: "Market analysis complete" });
    }, 2000);
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4 mr-2" />
              Salary Estimator
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Know Your
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Market Value</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get accurate salary estimates based on job title, location, experience, and market data — worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Building className="w-5 h-5 mr-2 text-orange-500" />Job Details</CardTitle>
                <CardDescription>Enter your job information for personalized salary estimates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Job Title *</Label>
                  <Select value={jobTitle} onValueChange={setJobTitle}>
                    <SelectTrigger><SelectValue placeholder="Select job title" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="data-scientist">Data Scientist</SelectItem>
                      <SelectItem value="data-engineer">Data Engineer</SelectItem>
                      <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="cloud-architect">Cloud Architect</SelectItem>
                      <SelectItem value="cybersecurity-analyst">Cybersecurity Analyst</SelectItem>
                      <SelectItem value="mobile-developer">Mobile Developer</SelectItem>
                      <SelectItem value="qa-engineer">QA Engineer</SelectItem>
                      <SelectItem value="ux-designer">UX Designer</SelectItem>
                      <SelectItem value="graphic-designer">Graphic Designer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="project-manager">Project Manager</SelectItem>
                      <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                      <SelectItem value="digital-marketing-specialist">Digital Marketing Specialist</SelectItem>
                      <SelectItem value="content-writer">Content Writer</SelectItem>
                      <SelectItem value="sales-representative">Sales Representative</SelectItem>
                      <SelectItem value="business-analyst">Business Analyst</SelectItem>
                      <SelectItem value="financial-analyst">Financial Analyst</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="hr-manager">HR Manager</SelectItem>
                      <SelectItem value="supply-chain-manager">Supply Chain Manager</SelectItem>
                      <SelectItem value="lawyer">Lawyer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="architect">Architect</SelectItem>
                      <SelectItem value="civil-engineer">Civil Engineer</SelectItem>
                      <SelectItem value="mechanical-engineer">Mechanical Engineer</SelectItem>
                      <SelectItem value="journalist">Journalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location *</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">🌍 Remote</SelectItem>
                      <SelectItem disabled value="__na">— North America —</SelectItem>
                      <SelectItem value="san-francisco">San Francisco, USA</SelectItem>
                      <SelectItem value="new-york">New York, USA</SelectItem>
                      <SelectItem value="seattle">Seattle, USA</SelectItem>
                      <SelectItem value="boston">Boston, USA</SelectItem>
                      <SelectItem value="los-angeles">Los Angeles, USA</SelectItem>
                      <SelectItem value="chicago">Chicago, USA</SelectItem>
                      <SelectItem value="austin">Austin, USA</SelectItem>
                      <SelectItem value="denver">Denver, USA</SelectItem>
                      <SelectItem value="atlanta">Atlanta, USA</SelectItem>
                      <SelectItem value="toronto">Toronto, Canada</SelectItem>
                      <SelectItem value="vancouver">Vancouver, Canada</SelectItem>
                      <SelectItem disabled value="__eu">— Europe —</SelectItem>
                      <SelectItem value="london">London, UK</SelectItem>
                      <SelectItem value="berlin">Berlin, Germany</SelectItem>
                      <SelectItem value="paris">Paris, France</SelectItem>
                      <SelectItem value="amsterdam">Amsterdam, Netherlands</SelectItem>
                      <SelectItem value="zurich">Zurich, Switzerland</SelectItem>
                      <SelectItem value="dublin">Dublin, Ireland</SelectItem>
                      <SelectItem disabled value="__ap">— Asia Pacific —</SelectItem>
                      <SelectItem value="singapore">Singapore</SelectItem>
                      <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                      <SelectItem value="sydney">Sydney, Australia</SelectItem>
                      <SelectItem value="bangalore">Bangalore, India</SelectItem>
                      <SelectItem value="shanghai">Shanghai, China</SelectItem>
                      <SelectItem value="hong-kong">Hong Kong</SelectItem>
                      <SelectItem value="seoul">Seoul, South Korea</SelectItem>
                      <SelectItem disabled value="__mea">— Middle East & Africa —</SelectItem>
                      <SelectItem value="dubai">Dubai, UAE</SelectItem>
                      <SelectItem value="tel-aviv">Tel Aviv, Israel</SelectItem>
                      <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                      <SelectItem value="nairobi">Nairobi, Kenya</SelectItem>
                      <SelectItem value="cape-town">Cape Town, South Africa</SelectItem>
                      <SelectItem value="cairo">Cairo, Egypt</SelectItem>
                      <SelectItem disabled value="__la">— Latin America —</SelectItem>
                      <SelectItem value="sao-paulo">São Paulo, Brazil</SelectItem>
                      <SelectItem value="mexico-city">Mexico City, Mexico</SelectItem>
                      <SelectItem value="buenos-aires">Buenos Aires, Argentina</SelectItem>
                      <SelectItem value="bogota">Bogotá, Colombia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Experience Level *</Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger><SelectValue placeholder="Select experience" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-8 years)</SelectItem>
                      <SelectItem value="lead">Lead (9-12 years)</SelectItem>
                      <SelectItem value="manager">Manager (10+ years)</SelectItem>
                      <SelectItem value="director">Director/VP (15+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Company Size</Label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-500 employees)</SelectItem>
                      <SelectItem value="large">Large (500+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Education Level</Label>
                  <Select value={education} onValueChange={setEducation}>
                    <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highschool">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateSalary} disabled={isCalculating} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
                  {isCalculating ? "Calculating..." : "Calculate Salary Range"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-500" />Salary Estimate</CardTitle>
                <CardDescription>Based on current market data and your inputs</CardDescription>
              </CardHeader>
              <CardContent>
                {!salaryData ? (
                  <div className="text-center py-12 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your details to see salary estimates</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Estimated Range</h3>
                      <div className="text-3xl font-bold text-gray-900">{formatSalary(salaryData.min)} - {formatSalary(salaryData.max)}</div>
                      <p className="text-sm text-gray-600 mt-1">Annual Salary (USD equivalent)</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">25th Percentile</span>
                        <Badge variant="outline">{formatSalary(salaryData.percentile25)}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium">Median (50th)</span>
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500">{formatSalary(salaryData.median)}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">75th Percentile</span>
                        <Badge variant="outline">{formatSalary(salaryData.percentile75)}</Badge>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">💡 Insights</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Salaries can vary ±20% based on specific company and benefits</li>
                        <li>• Remote work may offer competitive salaries with location flexibility</li>
                        <li>• Consider total compensation including equity and benefits</li>
                        <li>• Figures shown in USD equivalent — local currency may differ</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SalaryEstimator;
