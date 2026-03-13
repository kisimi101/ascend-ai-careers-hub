import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Briefcase, Globe } from "lucide-react";

interface QuickApplyLinksProps {
  jobTitle: string;
  location: string;
}

export const QuickApplyLinks = ({ jobTitle, location }: QuickApplyLinksProps) => {
  const query = encodeURIComponent(jobTitle || "software engineer");
  const loc = encodeURIComponent(location || "");

  const generalBoards = [
    { name: "Indeed", url: `https://www.indeed.com/jobs?q=${query}&l=${loc}` },
    { name: "LinkedIn", url: `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${loc}` },
    { name: "Glassdoor", url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${query}&locKeyword=${loc}` },
    { name: "ZipRecruiter", url: `https://www.ziprecruiter.com/jobs-search?search=${query}&location=${loc}` },
    { name: "Monster", url: `https://www.monster.com/jobs/search?q=${query}&where=${loc}` },
    { name: "SimplyHired", url: `https://www.simplyhired.com/search?q=${query}&l=${loc}` },
    { name: "CareerBuilder", url: `https://www.careerbuilder.com/jobs?keywords=${query}&location=${loc}` },
    { name: "Dice", url: `https://www.dice.com/jobs?q=${query}&location=${loc}` },
  ];

  const remoteBoards = [
    { name: "We Work Remotely", url: `https://weworkremotely.com/remote-jobs/search?term=${query}` },
    { name: "Remote.co", url: `https://remote.co/remote-jobs/search/?search_keywords=${query}` },
    { name: "FlexJobs", url: `https://www.flexjobs.com/search?search=${query}` },
    { name: "RemoteOK", url: `https://remoteok.com/remote-${jobTitle.replace(/\s+/g, "-").toLowerCase()}-jobs` },
    { name: "AngelList", url: `https://wellfound.com/jobs?query=${query}` },
    { name: "Hired", url: `https://hired.com/jobs?q=${query}` },
  ];

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Job Boards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1.5">
            {generalBoards.map((board) => (
              <Button
                key={board.name}
                onClick={() => window.open(board.url, '_blank')}
                variant="outline"
                className="text-xs h-8 justify-start"
                size="sm"
              >
                {board.name}
                <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Remote Job Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1.5">
            {remoteBoards.map((board) => (
              <Button
                key={board.name}
                onClick={() => window.open(board.url, '_blank')}
                variant="outline"
                className="text-xs h-8 justify-start"
                size="sm"
              >
                {board.name}
                <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Opens pre-filled search on each job board
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
