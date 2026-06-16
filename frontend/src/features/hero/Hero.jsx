import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  HiOutlineDownload,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { personalInfo, socialLinks } from "@/app/data";
import Button from "@/shared/Button";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-light-section"
    >
      <div className="hero-light-inner">
        <div className="hero-light-grid">
          {/* Left Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="hero-light-left"
          >
            {/* Greeting */}
            <motion.p variants={item} className="hero-greeting">
              HELLO, MY NAME IS
            </motion.p>

            {/* Name */}
            <motion.div variants={item}>
              <h1 className="hero-name">
                Akhil Singh
              </h1>
              <div className="hero-role-wrapper">
                <TypeAnimation
                  sequence={[
                    "MERN Stack Developer",
                    2500,
                    "BCA Student",
                    2000,
                    "Aspiring Full-Stack Developer",
                    2500,
                  ]}
                  wrapper="span"
                  speed={40}
                  repeat={Infinity}
                  className="hero-role"
                />
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={item} className="hero-contact-list">
              <a href={`mailto:${personalInfo.email}`} className="hero-contact-item">
                <HiOutlineMail className="hero-contact-icon" />
                <span>{personalInfo.email}</span>
              </a>
              <a href={`tel:${personalInfo.phone}`} className="hero-contact-item">
                <HiOutlinePhone className="hero-contact-icon" />
                <span>{personalInfo.phone}</span>
              </a>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={item} className="hero-cta-row">
              <a
                href="#resumes"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#resumes")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hero-btn-primary"
              >
                <HiOutlineDownload className="w-4 h-4" />
                Download CV
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hero-btn-secondary"
              >
                <HiOutlineMail className="w-4 h-4" />
                Contact Me
              </a>
            </motion.div>

            {/* Social */}
            <motion.div variants={item} className="hero-social-row">
              {[
                { icon: FaGithub, href: socialLinks.github, label: "GitHub" },
                { icon: FaLinkedinIn, href: socialLinks.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
