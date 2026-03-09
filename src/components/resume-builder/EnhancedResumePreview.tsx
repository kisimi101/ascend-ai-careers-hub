import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Image, Lock, Crown, Share2 } from "lucide-react";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { ResumeData } from "./types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ShareResumeDialog } from "./ShareResumeDialog";
import { AutoFillPanel } from "./AutoFillPanel";
import { useAuth } from "@/contexts/AuthContext";
import { createCheckout, POLAR_PRODUCTS } from "@/lib/polar";
import { toast } from "sonner";

interface EnhancedResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  accentColor?: string;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
  onDownloadPNG: () => void;
}

export const EnhancedResumePreview = ({ 
  resumeData, 
  selectedTemplate,
  accentColor,
  onDownloadPDF,
  onDownloadDOCX,
  onDownloadPNG
}: EnhancedResumePreviewProps) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const renderTemplate = () => {
    const props = { resumeData, accentColor };
    switch (selectedTemplate) {
      case "classic-minimal": return <ClassicTemplate {...props} />;
      case "tech-specialist": return <TechTemplate {...props} />;
      case "creative-designer": return <CreativeTemplate {...props} />;
      case "executive": return <ExecutiveTemplate {...props} />;
      case "minimalist": return <MinimalistTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  const handleDownload = (downloadFn: () => void) => {
    setShowPaywall(true);
  };

  return (
    <>
      <Card className="sticky top-8">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="text-lg">Resume Preview</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowShare(true)} size="sm" variant="secondary">
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button onClick={() => handleDownload(onDownloadPDF)} size="sm" variant="default">
                <Lock className="h-3 w-3 mr-1" />
                PDF
              </Button>
              <Button onClick={() => handleDownload(onDownloadDOCX)} size="sm" variant="outline">
                <Lock className="h-3 w-3 mr-1" />
                DOCX
              </Button>
              <Button onClick={() => handleDownload(onDownloadPNG)} size="sm" variant="outline">
                <Lock className="h-3 w-3 mr-1" />
                PNG
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            id="resume-preview" 
            className="border rounded-lg min-h-[700px] max-h-[800px] shadow-sm overflow-y-auto"
            style={{ aspectRatio: '8.5/11' }}
          >
            {renderTemplate()}
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Template: {selectedTemplate.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
          
          <div className="mt-3">
            <AutoFillPanel resumeData={resumeData} />
          </div>
        </CardContent>
      </Card>

      <ShareResumeDialog
        resumeData={resumeData}
        selectedTemplate={selectedTemplate}
        open={showShare}
        onOpenChange={setShowShare}
      />

      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-center text-2xl">Upgrade to Download</DialogTitle>
            <DialogDescription className="text-center text-base">
              Your resume looks great! Upgrade to Pro to download it in PDF, DOCX, or PNG format.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-3 text-sm">
              <Download className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Unlimited downloads in PDF, DOCX & PNG</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span>All premium resume templates</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Image className="h-4 w-4 text-primary flex-shrink-0" />
              <span>AI-powered ATS optimization</span>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full btn-gradient text-lg py-5" 
              disabled={checkoutLoading}
              onClick={async () => {
                if (!isAuthenticated) {
                  toast.error("Please sign in first to upgrade");
                  setShowPaywall(false);
                  return;
                }
                try {
                  setCheckoutLoading(true);
                  const url = await createCheckout(POLAR_PRODUCTS.pro);
                  window.location.href = url;
                } catch (err: any) {
                  toast.error(err.message || "Failed to start checkout");
                } finally {
                  setCheckoutLoading(false);
                }
              }}
            >
              {checkoutLoading ? "Loading…" : "Upgrade to Pro — $12/mo"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              7-day free trial • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
