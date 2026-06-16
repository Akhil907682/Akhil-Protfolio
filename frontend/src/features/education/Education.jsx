import { motion } from "framer-motion";
import { HiOutlineAcademicCap, HiOutlineClock } from "react-icons/hi";
import SectionHeading from "@/shared/SectionHeading";
import { education } from "@/app/data";

export default function Education() {
  return (
    <section id="education" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Education"
          subtitle="Academic background and qualifications"
        />

        <div className="max-w-2xl mx-auto space-y-6">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary">
                  <HiOutlineAcademicCap size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text-100 mb-1">
                    {edu.degree}
                  </h3>

                  <p className="text-sm text-text-400 mb-1">
                    {edu.institution}
                  </p>

                  <p className="inline-flex items-center gap-1.5 text-xs text-text-500 font-mono mb-4">
                    <HiOutlineClock size={12} />
                    {edu.duration}
                  </p>

                  <p className="text-sm text-text-400 leading-relaxed mb-4">
                    {edu.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["Software Development", "Web Technologies", "Data Structures", "Databases"].map(
                      (tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
