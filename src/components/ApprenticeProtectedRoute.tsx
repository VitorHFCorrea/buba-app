import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ApprenticeSession } from "@/types/apprentice";

interface ApprenticeProtectedRouteProps {
  children: React.ReactNode;
}

export const ApprenticeProtectedRoute = ({ children }: ApprenticeProtectedRouteProps) => {
  const [session, setSession] = useState<ApprenticeSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem('apprentice_session');
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/apprentice-login" replace />;
  }

  return <>{children}</>;
};
