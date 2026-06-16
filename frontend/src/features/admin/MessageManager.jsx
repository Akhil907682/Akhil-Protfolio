import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/app/config";
import {
  HiOutlineTrash,
  HiOutlineMailOpen,
  HiOutlineMail,
  HiOutlineFilter,
  HiX,
} from "react-icons/hi";

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, read, unread
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeMessage, setActiveMessage] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(data.inquiries || []);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError("Failed to fetch messages from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = async (msg) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      try {
        const response = await fetch(`${API_BASE_URL}/contacts/${msg._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isRead: true }),
        });
        if (response.ok) {
          fetchMessages();
        }
      } catch (err) {
        console.error("Auto mark read error:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess("Message deleted successfully.");
        fetchMessages();
      } else {
        setError(data.message || "Failed to delete message.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Connection error while deleting message.");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "read") return msg.isRead === true;
    if (filter === "unread") return msg.isRead === false;
    return true; // "all"
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-100">Contact Messages</h1>
        <p className="text-xs text-text-400 mt-1">
          Read and manage inquiries submitted through the contact form on your portfolio website.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-xs text-success font-medium">
          {success}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-surface-600/20 pb-4">
        <div className="flex gap-2">
          {[
            { key: "all", label: "All Messages" },
            { key: "unread", label: "Unread" },
            { key: "read", label: "Read" },
          ].map((tab) => {
            const count = messages.filter((m) => {
              if (tab.key === "read") return m.isRead === true;
              if (tab.key === "unread") return m.isRead === false;
              return true;
            }).length;

            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  filter === tab.key
                    ? "bg-primary text-white"
                    : "text-text-400 hover:text-text-200 bg-surface-800/40 hover:bg-surface-700/60 border border-surface-600/30"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs text-text-500 font-mono hidden sm:block">
          Total: {messages.length} messages
        </span>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-xs text-text-500">
          No messages found matching this filter.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card rounded-2xl p-5 sm:p-6 border relative transition-all duration-200 ${
                  msg.isRead 
                    ? "border-surface-600/10 opacity-75" 
                    : "border-primary-light/30 shadow-md shadow-primary/5"
                }`}
              >
                {/* Unread Indicator dot */}
                {!msg.isRead && (
                  <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                )}

                {/* Sender Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-600/10 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-text-100 flex items-center gap-1.5 flex-wrap">
                      {msg.name}
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-primary-light hover:underline font-normal font-mono"
                      >
                        &lt;{msg.email}&gt;
                      </a>
                    </h3>
                    <p className="text-xs text-text-400 mt-1 font-semibold">
                      Subject: <span className="text-text-200">{msg.subject}</span>
                    </p>
                    {msg.whatsapp && (
                      <p className="text-xs text-text-400 mt-0.5 font-semibold">
                        WhatsApp:{" "}
                        <a
                          href={`https://wa.me/${msg.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-200 hover:text-[#25D366] hover:underline transition-colors font-mono"
                          title="Chat on WhatsApp"
                        >
                          {msg.whatsapp}
                        </a>
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-text-500 font-mono">
                    {new Date(msg.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {/* Message Body snippet */}
                <p className="text-sm text-text-400 truncate max-w-2xl leading-relaxed">
                  {msg.message}
                </p>

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-600/10">
                  <button
                    onClick={() => handleOpenMessage(msg)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-primary/30 text-primary-light hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                  >
                    <HiOutlineMailOpen size={14} />
                    Open Message
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 rounded-lg border border-rose/30 hover:border-rose/60 text-rose hover:bg-rose/10 transition-all duration-200 cursor-pointer"
                    title="Delete Message"
                  >
                    <HiOutlineTrash size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {/* View Message Modal */}
      <AnimatePresence>
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-800 border border-surface-600/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMessage(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-700 text-text-400 hover:text-text-100 transition-colors"
              >
                <HiX size={18} />
              </button>

              {/* Modal Header */}
              <div className="border-b border-surface-600/20 pb-4">
                <span className="text-[10px] font-bold font-mono text-primary-light uppercase tracking-wider">
                  Inquiry Message
                </span>
                <h3 className="text-xl font-bold text-text-100 mt-2">
                  {activeMessage.name}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-text-400">
                  <a href={`mailto:${activeMessage.email}`} className="hover:underline font-mono text-primary-light">
                    {activeMessage.email}
                  </a>
                  {activeMessage.whatsapp && (
                    <a
                      href={`https://wa.me/${activeMessage.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-mono text-text-300 hover:text-[#25D366]"
                    >
                      WhatsApp: {activeMessage.whatsapp}
                    </a>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <p className="text-xs text-text-400 font-semibold uppercase tracking-wider">
                  Subject: <span className="text-text-100 font-normal normal-case">{activeMessage.subject}</span>
                </p>
                <div className="bg-surface-900/50 rounded-xl p-4 border border-surface-600/10 max-h-60 overflow-y-auto">
                  <p className="text-sm text-text-200 leading-relaxed whitespace-pre-wrap">
                    {activeMessage.message}
                  </p>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-surface-600/20">
                <span className="text-[10px] text-text-500 font-mono">
                  Received: {new Date(activeMessage.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <button
                  onClick={() => {
                    setActiveMessage(null);
                  }}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light transition-all duration-200 cursor-pointer shadow-md shadow-primary/20"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
