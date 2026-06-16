import { motion } from "framer-motion";
import {
  HiOutlineCode,
  HiOutlineAcademicCap,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import SectionHeading from "@/shared/SectionHeading";
import GlassCard from "@/shared/GlassCard";
import { personalInfo } from "@/app/data";

const highlights = [
  {
    icon: HiOutlineCode,
    title: "MERN Stack",
    desc: "Full-stack development with MongoDB, Express, React & Node.js",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: HiOutlineAcademicCap,
    title: "BCA Student",
    desc: "Pursuing Bachelor of Computer Applications at DDU Gorakhpur University",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: HiOutlineLightningBolt,
    title: "Problem Solver",
    desc: "DSA & algorithmic thinking to build scalable, efficient solutions",
    color: "text-violet",
    bg: "bg-violet/8",
  },
];

const stats = [
  { value: "1+", label: "Projects Built" },
  { value: "10+", label: "Technologies" },
  { value: "2024", label: "Started Coding" },
];

export default function About() {
  return (
    <section id="about" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="About Me"
          subtitle="A brief look at who I am and what drives me"
        />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Bio — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <p className="text-text-300 leading-[1.85] text-[15px]">
                {personalInfo.summary}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t border-surface-500/20">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold gradient-text">
                      {s.value}
                    </p>
                    <p className="text-xs text-text-500 mt-1 font-medium">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Highlight cards — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {highlights.map((h, i) => (
              <GlassCard key={h.title} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 p-2.5 rounded-xl ${h.bg} ${h.color}`}
                  >
                    <h.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-100 mb-1">
                      {h.title}
                    </h4>
                    <p className="text-xs text-text-400 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
