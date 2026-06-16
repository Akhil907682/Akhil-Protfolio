import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineArrowUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { personalInfo, navLinks, socialLinks } from "@/app/data";

export default function Footer() {
  const navigate = useNavigate();
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-surface-600/20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <span className="text-base font-bold font-mono text-text-100">
              <span className="text-primary-light">&lt;</span>
              Akhil
              <span className="text-primary-light"> /&gt;</span>
            </span>
            <p className="text-xs text-text-500 mt-2 leading-relaxed max-w-[220px]">
              Building modern web experiences with the MERN Stack. Always learning, always shipping.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-text-500 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs text-text-400 hover:text-primary-light transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[11px] font-semibold text-text-500 uppercase tracking-wider mb-3">
              Connect
            </h4>
            <div className="flex gap-2">
              {[
                { icon: FaGithub, href: socialLinks.github, label: "GitHub" },
                { icon: FaLinkedinIn, href: socialLinks.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-surface-500/20 text-text-500 hover:text-primary-light hover:border-primary/30 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-surface-600/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <p className="text-[11px] text-text-500">
            <span
              onDoubleClick={() => navigate("/admin/login")}
              className="cursor-default hover:text-text-400 transition-colors"
            >
              ©
            </span>{" "}
            {new Date().getFullYear()} {personalInfo.name}. Built with React & Tailwind CSS.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[11px] text-text-500 hover:text-primary-light transition-colors cursor-pointer"
          >
            Back to top
            <HiOutlineArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
