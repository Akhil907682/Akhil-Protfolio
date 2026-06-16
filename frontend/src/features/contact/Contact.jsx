import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import SectionHeading from "@/shared/SectionHeading";
import GlassCard from "@/shared/GlassCard";
import { personalInfo } from "@/app/data";
import { API_BASE_URL } from "@/app/config";

const contactInfo = [
  {
    icon: HiOutlineMail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: HiOutlinePhone,
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: HiOutlineLocationMarker,
    label: "Location",
    value: personalInfo.location,
    href: null,
    color: "text-violet",
    bg: "bg-violet/8",
  },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message, whatsapp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccessPopup(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setWhatsapp("");
      } else {
        setError(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact form submit error:", err);
      setError("Network error. Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project idea, want to collaborate, or just say hello? Drop me a message!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Info cards — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((c, i) => (
              <GlassCard key={c.label} delay={i * 0.08}>
                <div className="flex items-center gap-4 p-2">
                  <div className={`p-3 rounded-xl ${c.bg} ${c.color} flex-shrink-0`}>
                    <c.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-500 uppercase tracking-wider font-semibold">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="text-sm text-text-200 hover:text-primary transition-colors break-all font-medium"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm text-text-200 font-medium truncate">{c.value}</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Contact Form — 3 cols */}
          <div className="lg:col-span-3">
            <GlassCard delay={0.2}>
              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5">
                <h3 className="text-base font-bold text-text-100 flex items-center gap-2 border-b border-surface-600/20 pb-3 mb-2">
                  <HiOutlinePaperAirplane size={18} className="text-primary rotate-45" />
                  Send a Message
                </h3>

                {error && (
                  <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium">
                    {error}
                  </div>
                )}



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-text-400 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-900 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-text-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-900 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-text-400 uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Project Inquiry"
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-900 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-text-400 uppercase tracking-wider mb-2">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-900 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-text-400 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-900 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light transition-all duration-200 cursor-pointer shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <HiOutlinePaperAirplane size={14} className="rotate-45" />
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-surface-600/30 bg-surface-800/90 p-6 shadow-2xl backdrop-blur-md text-center z-10 space-y-4"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-100">Message Sent!</h3>
                <p className="text-xs text-text-300 leading-relaxed">
                  Thank you for contacting me! Your message has been sent successfully. You will receive a reply via Email or WhatsApp soon.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light transition-all duration-200 cursor-pointer shadow-md shadow-primary/20"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
