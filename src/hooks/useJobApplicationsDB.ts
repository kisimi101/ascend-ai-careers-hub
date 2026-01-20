import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  salary: string | null;
  status: 'applied' | 'phone-screen' | 'technical' | 'onsite' | 'offer' | 'rejected';
  applied_date: string;
  interview_date: string | null;
  notes: string | null;
  job_url: string | null;
  created_at: string;
  updated_at: string;
}

export type JobApplicationInsert = Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const useJobApplicationsDB = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_date', { ascending: false });

      if (error) throw error;
      
      setApplications(data as JobApplication[] || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job applications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('job_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchApplications]);

  const addApplication = useCallback(async (application: JobApplicationInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          ...application,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Application Added!',
        description: 'Your job application has been tracked successfully',
      });

      return data as JobApplication;
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: 'Error',
        description: 'Failed to add job application',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  const updateApplication = useCallback(async (id: string, updates: Partial<JobApplicationInsert>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: 'Application status has been updated',
      });

      return true;
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

  const deleteApplication = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Application Deleted',
        description: 'Application removed from tracker',
      });

      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

  const getStatusCounts = useCallback(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [applications]);

  const getWeeklyStats = useCallback(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = applications.filter(
      app => new Date(app.applied_date) >= oneWeekAgo
    );
    const lastWeek = applications.filter(
      app => new Date(app.applied_date) >= twoWeeksAgo && new Date(app.applied_date) < oneWeekAgo
    );

    const thisWeekByStatus = thisWeek.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lastWeekByStatus = lastWeek.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalThisWeek = thisWeek.length;
    const totalLastWeek = lastWeek.length;
    const changePercentage = totalLastWeek > 0 
      ? Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100) 
      : totalThisWeek > 0 ? 100 : 0;

    const offersThisWeek = thisWeekByStatus['offer'] || 0;
    const interviewsThisWeek = (thisWeekByStatus['phone-screen'] || 0) + 
                                (thisWeekByStatus['technical'] || 0) + 
                                (thisWeekByStatus['onsite'] || 0);
    const rejectionsThisWeek = thisWeekByStatus['rejected'] || 0;

    return {
      totalThisWeek,
      totalLastWeek,
      changePercentage,
      offersThisWeek,
      interviewsThisWeek,
      rejectionsThisWeek,
      thisWeekByStatus,
      lastWeekByStatus,
    };
  }, [applications]);

  return {
    applications,
    isLoading,
    addApplication,
    updateApplication,
    deleteApplication,
    getStatusCounts,
    getWeeklyStats,
    refetch: fetchApplications,
  };
};
