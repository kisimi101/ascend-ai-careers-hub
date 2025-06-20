
import React from "react";
import { Navigation } from "@/components/Navigation";
import { CommunityLeftSidebar } from "@/components/community/CommunityLeftSidebar";
import { CommunityRightSidebar } from "@/components/community/CommunityRightSidebar";
import { CommunityFeed } from "@/components/community/CommunityFeed";

const Community = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto flex">
          {/* Left Sidebar */}
          <div className="w-64 fixed left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-gray-200 bg-white">
            <CommunityLeftSidebar />
          </div>
          
          {/* Main Feed */}
          <div className="flex-1 ml-64 mr-80 border-x border-gray-200 min-h-screen">
            <CommunityFeed />
          </div>
          
          {/* Right Sidebar */}
          <div className="w-80 fixed right-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white">
            <CommunityRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
