import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  salary: string;
  location: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: string;
  notes: string;
}

export const useJobApplications = () => {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job-applications', []);
  const [isLoading, setIsLoading] = useState(false);

  const addApplication = useCallback((application: Omit<JobApplication, 'id'>) => {
    const newApplication: JobApplication = {
      ...application,
      id: Date.now().toString(),
    };
    setApplications(prev => [...prev, newApplication]);
  }, [setApplications]);

  const updateApplication = useCallback((id: string, updates: Partial<JobApplication>) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...updates } : app)
    );
  }, [setApplications]);

  const deleteApplication = useCallback((id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  }, [setApplications]);

  const getStatusCounts = useCallback(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [applications]);

  return {
    applications,
    isLoading,
    addApplication,
    updateApplication,
    deleteApplication,
    getStatusCounts,
  };
};