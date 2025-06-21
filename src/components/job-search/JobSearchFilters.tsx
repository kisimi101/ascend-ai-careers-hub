
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface JobSearchFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export const JobSearchFilters = ({ filters, setFilters }: JobSearchFiltersProps) => {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const companies = ["Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix"];

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      experience: [],
      salary: [],
      remote: false,
      datePosted: "",
      company: []
    });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Remote Work */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="remote"
              checked={filters.remote}
              onCheckedChange={(checked) => handleFilterChange("remote", checked)}
            />
            <Label htmlFor="remote">Remote Work</Label>
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date Posted</Label>
          <Select value={filters.datePosted} onValueChange={(value) => handleFilterChange("datePosted", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past week</SelectItem>
              <SelectItem value="month">Past month</SelectItem>
              <SelectItem value="any">Any time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Job Type</Label>
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.jobType.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange("jobType", [...filters.jobType, type]);
                  } else {
                    handleFilterChange("jobType", filters.jobType.filter((t: string) => t !== type));
                  }
                }}
              />
              <Label htmlFor={type} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Experience Level</Label>
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={level}
                checked={filters.experience.includes(level)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange("experience", [...filters.experience, level]);
                  } else {
                    handleFilterChange("experience", filters.experience.filter((e: string) => e !== level));
                  }
                }}
              />
              <Label htmlFor={level} className="text-sm">{level}</Label>
            </div>
          ))}
        </div>

        {/* Salary Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Salary Range (USD)</Label>
          <div className="px-2">
            <Slider
              value={filters.salary.length ? filters.salary : [0, 200000]}
              onValueChange={(value) => handleFilterChange("salary", value)}
              max={200000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${filters.salary[0] || 0}</span>
              <span>${filters.salary[1] || 200000}</span>
            </div>
          </div>
        </div>

        {/* Companies */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Companies</Label>
          {companies.map((company) => (
            <div key={company} className="flex items-center space-x-2">
              <Checkbox
                id={company}
                checked={filters.company.includes(company)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange("company", [...filters.company, company]);
                  } else {
                    handleFilterChange("company", filters.company.filter((c: string) => c !== company));
                  }
                }}
              />
              <Label htmlFor={company} className="text-sm">{company}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
