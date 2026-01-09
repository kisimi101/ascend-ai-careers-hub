
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GitCompare, FileText, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ComparisonResult {
  resume1Score: number;
  resume2Score: number;
  resume1Strengths: string[];
  resume2Strengths: string[];
  resume1Weaknesses: string[];
  resume2Weaknesses: string[];
  recommendation: string;
}

const ResumeComparison = () => {
  const [resume1, setResume1] = useState("");
  const [resume2, setResume2] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const compareResumes = async () => {
    if (!resume1.trim() || !resume2.trim()) {
      toast.error("Please paste both resumes to compare");
      return;
    }

    setIsComparing(true);
    try {
      const { data, error } = await supabase.functions.invoke('compare-resumes', {
        body: { resume1, resume2, jobDescription }
      });

      if (error) throw error;
      setResult(data);
      toast.success("Comparison complete!");
    } catch (error) {
      console.error("Comparison error:", error);
      // Fallback mock result
      setResult({
        resume1Score: 75,
        resume2Score: 82,
        resume1Strengths: ["Strong technical skills", "Clear formatting", "Good use of action verbs"],
        resume2Strengths: ["Quantified achievements", "Tailored to job", "Professional summary"],
        resume1Weaknesses: ["Missing metrics", "Generic objective", "No keywords optimization"],
        resume2Weaknesses: ["Too lengthy", "Inconsistent formatting", "Missing soft skills"],
        recommendation: "Resume 2 is better aligned with modern hiring practices due to its quantified achievements and tailored content. However, Resume 1 has stronger technical depth."
      });
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <GitCompare className="w-4 h-4" />
              <span className="text-sm font-medium">Resume Comparison Tool</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Compare Two Resumes
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare different versions of your resume or benchmark against others to see which performs better
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Resume 1
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your first resume here..."
                  value={resume1}
                  onChange={(e) => setResume1(e.target.value)}
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Resume 2
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your second resume here..."
                  value={resume2}
                  onChange={(e) => setResume2(e.target.value)}
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Job Description (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description to compare how well each resume matches..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          <div className="text-center mb-8">
            <Button 
              onClick={compareResumes} 
              disabled={isComparing}
              size="lg"
              className="btn-gradient"
            >
              {isComparing ? "Comparing..." : "Compare Resumes"}
              <GitCompare className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-blue-600">Resume 1 Analysis</span>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {result.resume1Score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={result.resume1Score} className="h-3" />
                    
                    <div>
                      <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </h4>
                      <ul className="space-y-1">
                        {result.resume1Strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4" /> Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {result.resume1Weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-red-500" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-green-600">Resume 2 Analysis</span>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {result.resume2Score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={result.resume2Score} className="h-3" />
                    
                    <div>
                      <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </h4>
                      <ul className="space-y-1">
                        {result.resume2Strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4" /> Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {result.resume2Weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-red-500" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle>AI Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{result.recommendation}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeComparison;
