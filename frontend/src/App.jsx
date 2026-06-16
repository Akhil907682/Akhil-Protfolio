import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PortfolioHome from "@/pages/PortfolioHome";

const AdminLogin = lazy(() => import("@/features/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/features/admin/AdminDashboard"));
const ProtectedRoute = lazy(() => import("@/features/admin/ProtectedRoute"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-900">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PortfolioHome theme={theme} setTheme={setTheme} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminDashboard theme={theme} setTheme={setTheme} />
              </ProtectedRoute>
            }
          />
          {/* Redirect any other undefined paths back to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
