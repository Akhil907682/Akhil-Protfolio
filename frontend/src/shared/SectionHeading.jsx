import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, align = "center" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`mb-14 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight mb-3">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-text-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
