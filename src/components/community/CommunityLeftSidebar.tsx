
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  MessageCircle, 
  Bell, 
  Bookmark, 
  User, 
  Settings,
  Briefcase,
  Users,
  TrendingUp,
  Camera,
  Edit3,
  Check,
  X
} from "lucide-react";
import { SocialLinksCard } from "./SocialLinksCard";

export const CommunityLeftSidebar = () => {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    title: "Software Engineer",
    bio: "Passionate about building amazing software experiences"
  });
  const [tempProfileData, setTempProfileData] = useState(profileData);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Profile</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col items-center space-y-4 mb-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileImage} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="h-3 w-3 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {isEditingProfile ? (
              <div className="w-full space-y-3">
                <Input
                  value={tempProfileData.name}
                  onChange={(e) => setTempProfileData({...tempProfileData, name: e.target.value})}
                  placeholder="Your name"
                  className="text-center text-sm"
                />
                <Input
                  value={tempProfileData.title}
                  onChange={(e) => setTempProfileData({...tempProfileData, title: e.target.value})}
                  placeholder="Your title"
                  className="text-center text-xs"
                />
                <Input
                  value={tempProfileData.bio}
                  onChange={(e) => setTempProfileData({...tempProfileData, bio: e.target.value})}
                  placeholder="Short bio"
                  className="text-center text-xs"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveProfile} className="flex-1">
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1">
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center w-full">
                <h3 className="font-semibold text-sm">{profileData.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{profileData.title}</p>
                <p className="text-xs text-gray-600 mb-3">{profileData.bio}</p>
              </div>
            )}
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
          
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-xs">
              Premium Member
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Social Links - Now positioned below profile */}
      <SocialLinksCard />

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
    </div>
  );
};
