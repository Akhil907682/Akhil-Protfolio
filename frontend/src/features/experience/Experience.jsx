import { motion } from "framer-motion";
import {
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import SectionHeading from "@/shared/SectionHeading";
import { experience } from "@/app/data";

export default function Experience() {
  return (
    <section id="experience" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey and milestones"
        />

        <div className="max-w-2xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent" />

          {experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-12 pb-10 last:pb-0"
            >
              {/* Dot */}
              <div className="absolute left-3 top-2 w-3 h-3 rounded-full bg-primary ring-[3px] ring-surface-900 shadow-sm shadow-primary/30" />

              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-text-100">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-primary-light font-medium flex items-center gap-1.5">
                      <HiOutlineBriefcase size={13} />
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-[11px] text-text-500 font-mono flex items-center gap-1">
                    <HiOutlineClock size={11} />
                    {exp.duration}
                  </span>
                </div>

                <p className="text-sm text-text-400 mb-6 leading-relaxed">
                  {exp.description}
                </p>

                {exp.highlights && (
                  <ul className="space-y-2.5">
                    {exp.highlights.map((h, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-text-300"
                      >
                        <HiOutlineCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={14} />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
