import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail, HiLockClosed, HiArrowRight } from "react-icons/hi";
import { API_BASE_URL } from "@/app/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectPath = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminName", data.admin.name);
        navigate(redirectPath, { replace: true });
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Server connection failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noise-overlay min-h-screen bg-surface-900 flex items-center justify-center p-4">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl border border-surface-500/10 p-8 shadow-2xl relative z-10 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-sm font-bold font-mono tracking-tight text-primary-light">
              &lt; Akhil /&gt;
            </span>
            <h1 className="text-2xl font-bold text-text-100 mt-2">
              Admin Portal
            </h1>
            <p className="text-xs text-text-400 mt-1">
              Sign in to manage your portfolio content and resumes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3.5 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-500 pointer-events-none">
                  <HiOutlineMail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-800/40 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-500 pointer-events-none">
                  <HiLockClosed size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-800/40 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-light transition-all duration-200 cursor-pointer shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <HiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center mt-8 pt-6 border-t border-surface-600/20">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="text-xs text-text-500 hover:text-primary transition-colors font-medium cursor-pointer"
            >
              ← Back to Main Portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
