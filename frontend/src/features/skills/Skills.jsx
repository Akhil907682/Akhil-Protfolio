import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
} from "react-icons/si";
import {
  HiOutlineCube,
  HiOutlineChip,
  HiOutlinePuzzle,
} from "react-icons/hi";
import SectionHeading from "@/shared/SectionHeading";
import { skills } from "@/app/data";

const iconMap = {
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  "React.js": SiReact,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  MongoDB: SiMongodb,
  Git: SiGit,
  GitHub: SiGithub,
  "REST APIs": HiOutlineCube,
  "MERN Stack": HiOutlineChip,
  "Data Structures & Algorithms": HiOutlinePuzzle,
  "Aptitude & Reasoning": HiOutlinePuzzle,
};

const colorMap = {
  HTML: "234, 88, 12",
  CSS: "37, 99, 235",
  JavaScript: "217, 119, 6",
  "React.js": "8, 145, 178",
  "Node.js": "22, 163, 74",
  "Express.js": "71, 85, 105",
  MongoDB: "5, 150, 105",
  Git: "234, 88, 12",
  GitHub: "30, 41, 59",
  "REST APIs": "147, 51, 234",
  "MERN Stack": "79, 70, 229",
  "Data Structures & Algorithms": "13, 148, 136",
  "Aptitude & Reasoning": "180, 83, 9",
};

const defaultColor = "0, 119, 255";

const categories = [
  { key: "all", label: "All Skills" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "tools", label: "Tools" },
  { key: "cs", label: "CS Fundamentals" },
  { key: "fullstack", label: "Full Stack" },
];

export default function Skills() {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Technologies I work with on a daily basis"
        />

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                active === c.key
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-text-400 hover:text-text-200 bg-surface-700/40 hover:bg-surface-600/60 border border-surface-500/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((skill) => {
              const Icon = iconMap[skill.name] || HiOutlineCube;
              const c = colorMap[skill.name] || defaultColor;

              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    "--brand-color-rgb": c,
                  }}
                  className="glass-card skill-card rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3 group cursor-default"
                >
                  <div className="skill-icon-container">
                    <Icon size={22} />
                  </div>
                  <span className="skill-name text-xs font-semibold text-text-300 text-center leading-snug">
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
