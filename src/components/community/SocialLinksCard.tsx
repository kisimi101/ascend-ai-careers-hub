
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Link as LinkIcon, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook,
  Plus,
  Edit3,
  ExternalLink
} from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const SocialLinksCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: "1",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
      icon: Linkedin,
      color: "text-blue-600"
    },
    {
      id: "2",
      platform: "Twitter",
      url: "https://twitter.com/johndoe",
      icon: Twitter,
      color: "text-blue-400"
    },
    {
      id: "3",
      platform: "Instagram",
      url: "https://instagram.com/johndoe",
      icon: Instagram,
      color: "text-pink-500"
    }
  ]);

  const availablePlatforms = [
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { name: "Twitter", icon: Twitter, color: "text-blue-400" },
    { name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { name: "Facebook", icon: Facebook, color: "text-blue-700" },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center">
            <LinkIcon className="h-4 w-4 mr-2" />
            Social Links
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <link.icon className={`h-4 w-4 ${link.color}`} />
                <span className="text-sm font-medium">{link.platform}</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          ))}
          
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
            >
              <Plus className="h-3 w-3 mr-2" />
              Add Social Link
            </Button>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs text-gray-500 text-center">
            Share your profile: <Badge variant="outline" className="text-xs">careerhub.app/johndoe</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
