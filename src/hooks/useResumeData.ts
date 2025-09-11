import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

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
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: ""
  },
  experience: [{ company: "", position: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "" }],
  skills: []
};

export const useResumeData = () => {
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resume-data', initialResumeData);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const updatePersonalInfo = useCallback((personalInfo: ResumeData['personalInfo']) => {
    setIsAutoSaving(true);
    setResumeData(prev => ({ ...prev, personalInfo }));
    setTimeout(() => setIsAutoSaving(false), 500);
  }, [setResumeData]);

  const updateExperience = useCallback((experience: ResumeData['experience']) => {
    setIsAutoSaving(true);
    setResumeData(prev => ({ ...prev, experience }));
    setTimeout(() => setIsAutoSaving(false), 500);
  }, [setResumeData]);

  const updateEducation = useCallback((education: ResumeData['education']) => {
    setIsAutoSaving(true);
    setResumeData(prev => ({ ...prev, education }));
    setTimeout(() => setIsAutoSaving(false), 500);
  }, [setResumeData]);

  const updateSkills = useCallback((skills: string[]) => {
    setIsAutoSaving(true);
    setResumeData(prev => ({ ...prev, skills }));
    setTimeout(() => setIsAutoSaving(false), 500);
  }, [setResumeData]);

  const addExperience = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", duration: "", description: "" }]
    }));
  }, [setResumeData]);

  const addEducation = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "" }]
    }));
  }, [setResumeData]);

  const clearResumeData = useCallback(() => {
    setResumeData(initialResumeData);
  }, [setResumeData]);

  return {
    resumeData,
    isAutoSaving,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkills,
    addExperience,
    addEducation,
    clearResumeData,
  };
};