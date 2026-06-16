import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass-card rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
