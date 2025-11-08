export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  sectionOrder?: Array<"experience" | "education" | "skills" | "summary">;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  rating: number;
  downloads: string;
  color: string;
  preview: string;
  atsScore: number;
  category: "modern" | "classic" | "creative" | "tech" | "executive";
}