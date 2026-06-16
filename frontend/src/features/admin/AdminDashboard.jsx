import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
  HiSun,
  HiMoon,
} from "react-icons/hi";

import DashboardHome from "./DashboardHome";
import ResumeManager from "./ResumeManager";
import MessageManager from "./MessageManager";
import AdminSettings from "./AdminSettings";

export default function AdminDashboard({ theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminName = localStorage.getItem("adminName") || "Admin";
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login", { replace: true });
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HiOutlineHome },
    { name: "Resumes", path: "/admin/dashboard/resumes", icon: HiOutlineDocumentText },
    { name: "Messages", path: "/admin/dashboard/messages", icon: HiOutlineMail },
    { name: "Settings", path: "/admin/dashboard/settings", icon: HiOutlineCog },
  ];

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard" || location.pathname === "/admin/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="noise-overlay h-screen bg-surface-900 text-text-200 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-surface-600/20 bg-surface-800/60 backdrop-blur-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface-600/20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-bold font-mono text-primary-light">
              &lt;{sidebarOpen ? "Akhil" : "A"}&gt;
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-surface-700 text-text-400 hover:text-text-100"
          >
            <HiMenuAlt2 size={20} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-text-400 hover:text-text-200 hover:bg-surface-700/60"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-surface-600/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose hover:bg-rose/10 transition-colors cursor-pointer"
          >
            <HiOutlineLogout size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface-800 border-r border-surface-600/50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-600/30">
                <span className="text-sm font-bold font-mono text-text-100">
                  <span className="text-primary-light">&lt;</span>
                  Akhil Admin
                  <span className="text-primary-light"> /&gt;</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-text-400 hover:text-text-100"
                >
                  <HiX size={20} />
                </button>
              </div>

              <nav className="flex-1 p-5 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-primary text-white shadow-md shadow-primary/25"
                          : "text-text-400 hover:text-text-200 hover:bg-surface-700"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-5 border-t border-surface-600/30">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                >
                  <HiOutlineLogout size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="h-16 border-b border-surface-600/20 bg-surface-800/40 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1 rounded-lg text-text-400 hover:text-text-100 hover:bg-surface-700"
            >
              <HiMenuAlt2 size={22} />
            </button>
            <h2 className="text-sm font-bold text-text-100 hidden sm:block">
              Welcome back, <span className="text-primary-light">{adminName}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* View Site link */}
            <a
              href="/"
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-surface-600/50 hover:border-primary/50 text-text-300 hover:text-primary transition-all duration-200"
            >
              View Site
            </a>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-surface-600/50 text-text-300 hover:text-text-100 hover:bg-surface-700/50 cursor-pointer"
            >
              {theme === "dark" ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>
          </div>
        </header>

        {/* Content routing container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl w-full mx-auto">
          <Routes>
            <Route path="" element={<DashboardHome />} />
            <Route path="resumes" element={<ResumeManager />} />
            <Route path="messages" element={<MessageManager />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
