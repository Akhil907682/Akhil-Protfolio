import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiSun, HiMoon } from "react-icons/hi";
import { navLinks } from "@/app/data";

export default function Navbar({ theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  /* Are we in the hero (light) zone? */
  const inHero = activeSection === "home" && !scrolled && theme === "light";

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav" : ""
        } ${inHero ? "nav-light-mode" : ""}`}
      >
        <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollTo(e, "#home")}
            className={`text-lg font-bold tracking-tight hover:opacity-80 transition-opacity ${
              inHero ? "text-gray-900" : "text-text-100"
            }`}
          >
            <span className="nav-logo-accent">AS</span>
            {" "}
            <span className="font-semibold">AKHIL SINGH</span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = activeSection === link.href.replace("#", "");
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? inHero
                          ? "text-[#0077ff]"
                          : "text-primary-light"
                        : inHero
                        ? "text-gray-500 hover:text-gray-900"
                        : "text-text-400 hover:text-text-200"
                    }`}
                  >
                    {link.name.toUpperCase()}
                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full ${
                          inHero ? "bg-[#0077ff]" : "bg-primary-light"
                        }`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Theme Toggle & Resume CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                inHero
                  ? "border-[#0077ff]/20 text-[#0077ff] hover:bg-[#0077ff]/10"
                  : "border-surface-600/50 text-text-300 hover:text-text-100 hover:bg-surface-700/50"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>

            <a
              href="#resumes"
              onClick={(e) => scrollTo(e, "#resumes")}
              className={`inline-flex items-center gap-2 px-4 py-1.5 text-[13px] font-semibold rounded-lg border transition-all duration-200 ${
                inHero
                  ? "border-[#0077ff]/40 text-[#0077ff] hover:bg-[#0077ff]/10 hover:border-[#0077ff]/60"
                  : "border-primary/40 text-primary-light hover:bg-primary/10 hover:border-primary/60"
              }`}
            >
              Resume
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>


          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-1.5 transition-colors ${
              inHero ? "text-gray-600 hover:text-gray-900" : "text-text-300 hover:text-text-100"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface-800 border-l border-surface-600/50 md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-600/30">
                <span className="text-sm font-bold font-mono text-text-100">
                  <span className="text-primary-light">&lt;</span>
                  Akhil
                  <span className="text-primary-light"> /&gt;</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-text-400 hover:text-text-100"
                  aria-label="Close menu"
                >
                  <HiX size={20} />
                </button>
              </div>
              <div className="p-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === link.href.replace("#", "")
                        ? "text-primary-light bg-primary/10"
                        : "text-text-400 hover:text-text-200 hover:bg-surface-700"
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <div className="pt-5 mt-3 border-t border-surface-600/30 space-y-3">
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-xl border border-surface-600/50 text-text-200 hover:bg-surface-700 transition-colors cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <>
                        <HiSun size={17} />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <HiMoon size={17} />
                        Dark Mode
                      </>
                    )}
                  </button>

                  <a
                    href="#resumes"
                    onClick={(e) => scrollTo(e, "#resumes")}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-light transition-colors"
                  >
                    Download Resume
                  </a>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
