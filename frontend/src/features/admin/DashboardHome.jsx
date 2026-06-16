import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineUserGroup,
  HiOutlineBell,
} from "react-icons/hi";
import { API_BASE_URL } from "@/app/config";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalProjects: 0,
    totalSkills: 0,
    totalEducation: 0,
    totalCertifications: 0,
    totalResumes: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setStats(data.stats);
          setRecentMessages(data.recentMessages || []);
        } else {
          setError(data.message || "Failed to fetch analytics stats.");
        }
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Resumes",
      value: stats.totalResumes,
      icon: HiOutlineDocumentText,
      color: "text-primary",
      bg: "bg-primary/8",
      desc: "Uploaded role-based PDFs",
    },
    {
      title: "Portfolio Visitors",
      value: stats.totalVisitors,
      icon: HiOutlineUserGroup,
      color: "text-violet",
      bg: "bg-violet/8",
      desc: "Unique tracked visits",
    },
    {
      title: "Contact Messages",
      value: stats.totalMessages,
      icon: HiOutlineMail,
      color: "text-emerald-400",
      bg: "bg-emerald-400/8",
      desc: `${stats.unreadMessages} unread messages`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-100">Overview</h1>
        <p className="text-xs text-text-400 mt-1">
          A quick glance at your portfolio performance indicators.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium">
          {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card rounded-2xl p-6 flex items-start gap-4"
            >
              <div className={`p-3.5 rounded-xl ${card.bg} ${card.color} flex-shrink-0`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold text-text-100 mt-1 leading-none">
                  {card.value}
                </h3>
                <p className="text-xs text-text-500 mt-2 font-medium">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-1.5 rounded-lg bg-surface-700/60 text-text-300">
            <HiOutlineBell size={18} />
          </span>
          <h3 className="text-base font-bold text-text-100">Recent Inquiries</h3>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-xs text-text-500 text-center py-6">
            No recent messages found. Everything is quiet!
          </p>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div
                key={msg._id}
                className="p-4 rounded-xl bg-surface-800/40 border border-surface-600/10 hover:border-surface-500/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-semibold text-text-100">
                    {msg.name}{" "}
                    <span className="text-[10px] text-text-500 font-normal ml-1.5 font-mono">
                      ({msg.email})
                    </span>
                  </h4>
                  <p className="text-xs text-primary-light mt-1 font-semibold">
                    Subject: {msg.subject}
                  </p>
                  <p className="text-xs text-text-400 mt-1.5 leading-relaxed line-clamp-2">
                    {msg.message}
                  </p>
                </div>
                <span className="text-[10px] text-text-500 font-mono flex-shrink-0 self-start sm:self-center">
                  {new Date(msg.createdAt).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
