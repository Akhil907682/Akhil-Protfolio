import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        // Double check token validity with the backend
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setAuthenticated(true);
        } else {
          // Token expired or invalid
          localStorage.removeItem("adminToken");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth validation error:", error);
        // On network error, we can still fall back to token presence for offline support,
        // or reject it. Rejecting is safer for security.
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-900">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
