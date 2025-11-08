import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Download, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "./types";
import { useToast } from "@/hooks/use-toast";

interface VersionHistoryProps {
  versions: Array<{
    id: string;
    timestamp: Date;
    resumeData: ResumeData;
    template: string;
  }>;
  onRestore: (version: any) => void;
  onDelete: (versionId: string) => void;
}

export const VersionHistory = ({ versions, onRestore, onDelete }: VersionHistoryProps) => {
  const { toast } = useToast();
  const [previewVersion, setPreviewVersion] = useState<string | null>(null);

  const handleRestore = (version: any) => {
    onRestore(version);
    toast({
      title: "Version Restored",
      description: "Your resume has been restored to this version.",
    });
  };

  const handleDelete = (versionId: string) => {
    onDelete(versionId);
    toast({
      title: "Version Deleted",
      description: "Version has been removed from history.",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          Restore or compare previous versions of your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {versions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No version history yet. Versions are automatically saved when you make changes.
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">
                        Version {versions.length - index}
                        {index === 0 && (
                          <Badge variant="secondary" className="ml-2">Latest</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(version.timestamp)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Template: {version.template.split('-').map(w => 
                          w.charAt(0).toUpperCase() + w.slice(1)
                        ).join(' ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(version)}
                      disabled={index === 0}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewVersion(
                        previewVersion === version.id ? null : version.id
                      )}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {previewVersion === version.id ? 'Hide' : 'Preview'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(version.id)}
                      disabled={index === 0}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {previewVersion === version.id && (
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      <div className="font-medium mb-2">Preview:</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Name: {version.resumeData.personalInfo.fullName || 'Not set'}</div>
                        <div>Experience: {version.resumeData.experience.length} entries</div>
                        <div>Education: {version.resumeData.education.length} entries</div>
                        <div>Skills: {version.resumeData.skills.length} skills</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
