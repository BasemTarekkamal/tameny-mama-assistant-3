import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingIndicator from './LoadingIndicator';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, hasChildren } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Onboarding: if user has no children, send them to add their first child
  // except if they are already on the children pages
  if (hasChildren === false &&
    !location.pathname.startsWith('/profile/children')) {
    return <Navigate to="/profile/children/new" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
