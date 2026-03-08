import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, Eye, Link2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ResumeData } from "./types";

interface ShareResumeDialogProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareResumeDialog = ({ resumeData, selectedTemplate, open, onOpenChange }: ShareResumeDialogProps) => {
  const [shareLink, setShareLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const createShareLink = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('shared_resumes')
        .insert({
          user_id: user.id,
          resume_data: resumeData as any,
          template: selectedTemplate,
          title: `${resumeData.personalInfo.fullName || 'My'} Resume`,
        })
        .select('share_token, view_count')
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/shared-resume/${data.share_token}`;
      setShareLink(link);
      setViewCount(data.view_count);

      toast({ title: "Share link created!", description: "Anyone with this link can view your resume." });
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({ title: "Error", description: "Failed to create share link.", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Resume
          </DialogTitle>
          <DialogDescription>
            Create a shareable link with view tracking analytics.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!shareLink ? (
            <Button onClick={createShareLink} disabled={isCreating} className="w-full">
              {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Link2 className="h-4 w-4 mr-2" />}
              {isCreating ? "Creating link..." : "Generate Share Link"}
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="text-sm" />
                <Button onClick={copyLink} size="icon" variant="outline">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Eye className="h-4 w-4" />
                <span>{viewCount} views so far</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
