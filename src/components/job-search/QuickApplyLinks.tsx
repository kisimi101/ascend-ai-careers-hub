import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Briefcase } from "lucide-react";

interface QuickApplyLinksProps {
  jobTitle: string;
  location: string;
}

export const QuickApplyLinks = ({ jobTitle, location }: QuickApplyLinksProps) => {
  const query = encodeURIComponent(jobTitle || "software engineer");
  const loc = encodeURIComponent(location || "");

  const jobBoards = [
    {
      name: "Indeed",
      url: `https://www.indeed.com/jobs?q=${query}&l=${loc}`,
      color: "bg-[#2164f3] hover:bg-[#1a4fc2]",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${loc}`,
      color: "bg-[#0077b5] hover:bg-[#005e93]",
    },
    {
      name: "Glassdoor",
      url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${query}&locT=&locId=&locKeyword=${loc}`,
      color: "bg-[#0caa41] hover:bg-[#0a8a35]",
    },
    {
      name: "ZipRecruiter",
      url: `https://www.ziprecruiter.com/jobs-search?search=${query}&location=${loc}`,
      color: "bg-[#25ba62] hover:bg-[#1f9d52]",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Quick Apply on Job Boards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {jobBoards.map((board) => (
            <Button
              key={board.name}
              onClick={() => window.open(board.url, '_blank')}
              className={`${board.color} text-white text-xs h-9`}
              size="sm"
            >
              {board.name}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Opens pre-filled search on each job board
        </p>
      </CardContent>
    </Card>
  );
};
