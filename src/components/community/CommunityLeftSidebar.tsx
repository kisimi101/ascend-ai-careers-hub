
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MessageCircle, 
  Bell, 
  Bookmark, 
  User, 
  Settings,
  Briefcase,
  Users,
  TrendingUp
} from "lucide-react";
import { SocialLinksCard } from "./SocialLinksCard";

export const CommunityLeftSidebar = () => {
  const navigationItems = [
    { icon: Home, label: "Home", active: true },
    { icon: MessageCircle, label: "Messages" },
    { icon: Bell, label: "Notifications" },
    { icon: Bookmark, label: "Bookmarks" },
    { icon: User, label: "Profile" },
    { icon: Briefcase, label: "Career Tools" },
    { icon: Users, label: "Network" },
    { icon: TrendingUp, label: "Trending" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">John Doe</h3>
              <p className="text-xs text-gray-500 truncate">Software Engineer</p>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 mb-3">
            <div className="text-center">
              <div className="font-semibold">1.2K</div>
              <div>Following</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">850</div>
              <div>Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">42</div>
              <div>Posts</div>
            </div>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            Premium Member
          </Badge>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className="w-full justify-start h-12 px-4"
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Social Links */}
      <SocialLinksCard />
    </div>
  );
};
