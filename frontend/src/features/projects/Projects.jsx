import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineExternalLink,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineStar,
} from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
} from "react-icons/si";
import SectionHeading from "@/shared/SectionHeading";
import Button from "@/shared/Button";
import { projects } from "@/app/data";

const techIcons = {
  MongoDB: SiMongodb,
  "Express.js": SiExpress,
  "React.js": SiReact,
  "Node.js": SiNodedotjs,
};

const techColors = {
  MongoDB: "text-emerald-400",
  "Express.js": "text-gray-400",
  "React.js": "text-cyan-400",
  "Node.js": "text-green-400",
};

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Featured Projects"
          subtitle="Real-world applications I've designed and built"
        />

        <div className="space-y-10 max-w-4xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="glass-card rounded-2xl overflow-hidden group">
                {/* Header */}
                <div className="relative p-5 sm:p-8 pb-5 sm:pb-6 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 border-b border-surface-500/10">
                  {/* Floating Icons */}
                  <div className="flex items-center gap-4 mb-6">
                    {project.tech.map((t, idx) => {
                      const Icon = techIcons[t];
                      const color = techColors[t] || "text-text-400";
                      return Icon ? (
                        <motion.div
                          key={t}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 3,
                            delay: idx * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`p-3 rounded-xl bg-surface-700/60 border border-surface-500/20 ${color}`}
                        >
                          <Icon size={22} />
                        </motion.div>
                      ) : null;
                    })}

                    {project.featured && (
                      <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/10 text-amber text-[11px] font-semibold border border-amber/20">
                        <HiOutlineStar size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-text-100 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-400 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-surface-500/10 bg-surface-800/40">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant="primary"
                      size="sm"
                      href={project.liveLink}
                      icon={HiOutlineExternalLink}
                    >
                      Live Demo
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FaGithub}
                      href={project.githubLink}
                    >
                      Code
                    </Button>
                    <button
                      onClick={() => setSelected(project)}
                      className="text-xs text-text-500 hover:text-primary transition-colors cursor-pointer underline underline-offset-4 decoration-surface-500/50 hover:decoration-primary/50"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-800 border border-surface-600/40 rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-surface-800/95 backdrop-blur-sm border-b border-surface-600/30 p-6 sm:px-8 sm:py-6 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg font-bold text-text-100">
                  {selected.title}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg hover:bg-surface-600/50 text-text-400 hover:text-text-200 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <HiOutlineX size={18} />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-7">
                <p className="text-sm text-text-400 leading-relaxed">
                  {selected.description}
                </p>

                {/* Features */}
                <div>
                  <h4 className="text-[11px] font-semibold text-text-500 uppercase tracking-wider mb-3">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {selected.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-start gap-2 text-xs text-text-300 py-1"
                      >
                        <HiOutlineCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={14} />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech */}
                <div>
                  <h4 className="text-[11px] font-semibold text-text-500 uppercase tracking-wider mb-3">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.tech.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-3 border-t border-surface-600/30">
                  <Button
                    variant="primary"
                    size="sm"
                    href={selected.liveLink}
                    icon={HiOutlineExternalLink}
                  >
                    View Live
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    href={selected.githubLink}
                    icon={FaGithub}
                  >
                    GitHub
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
