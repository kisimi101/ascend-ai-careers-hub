import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuth(true);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in or create an account to access this tool and save your progress.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} defaultTab="signin" />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
