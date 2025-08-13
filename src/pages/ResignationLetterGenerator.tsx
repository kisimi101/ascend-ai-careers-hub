import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResignationLetterGenerator = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    managerName: '',
    position: '',
    companyName: '',
    lastWorkingDay: '',
    reason: '',
    notice: '2 weeks'
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateLetter = async () => {
    if (!formData.employeeName || !formData.managerName || !formData.companyName) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const letter = `Dear ${formData.managerName},

I am writing to formally notify you of my resignation from my position as ${formData.position} at ${formData.companyName}. My last day of work will be ${formData.lastWorkingDay}.

${formData.reason ? `I have made this decision because ${formData.reason}.` : ''}

I am committed to ensuring a smooth transition of my responsibilities. During my remaining time, I will do everything possible to wrap up my current projects and assist in training my replacement.

I want to express my gratitude for the opportunities for professional and personal growth that I have had during my time here. I have enjoyed working with the team and appreciate the support provided to me.

Please let me know how I can help during this transition period.

Thank you for your understanding.

Sincerely,
${formData.employeeName}`;

    setGeneratedLetter(letter);
    setIsGenerating(false);
    
    toast({
      title: "Letter Generated!",
      description: "Your resignation letter has been created.",
    });
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Letter copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resignation Letter Generator</h1>
          <p className="text-xl text-muted-foreground">
            Create a professional resignation letter in minutes
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Letter Details
              </CardTitle>
              <CardDescription>
                Fill in your information to generate a professional resignation letter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name *</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Manager's Name *</label>
                  <Input
                    placeholder="Jane Smith"
                    value={formData.managerName}
                    onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
                  <Input
                    placeholder="Software Developer"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Company Name *</label>
                  <Input
                    placeholder="ABC Corporation"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Working Day</label>
                  <Input
                    type="date"
                    value={formData.lastWorkingDay}
                    onChange={(e) => setFormData({...formData, lastWorkingDay: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Notice Period</label>
                  <Select value={formData.notice} onValueChange={(value) => setFormData({...formData, notice: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 week">1 Week</SelectItem>
                      <SelectItem value="2 weeks">2 Weeks</SelectItem>
                      <SelectItem value="1 month">1 Month</SelectItem>
                      <SelectItem value="2 months">2 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Reason (Optional)</label>
                <Textarea
                  placeholder="I have accepted a new position that aligns with my career goals..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={generateLetter} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Letter"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Letter</CardTitle>
              <CardDescription>
                Your professional resignation letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedLetter ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedLetter}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyLetter} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Letter
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Your resignation letter will appear here after generation
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResignationLetterGenerator;