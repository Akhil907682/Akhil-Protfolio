import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  download,
  onClick,
  className = "",
  icon: Icon,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl cursor-pointer select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-surface-600/50 text-text-200 border border-surface-500/50 hover:border-primary/30 hover:bg-surface-600/80 hover:scale-[1.02] active:scale-[0.98]",
    outline:
      "border border-primary/40 text-primary-light hover:bg-primary/10 hover:border-primary/60 hover:scale-[1.02] active:scale-[0.98]",
    ghost:
      "text-text-400 hover:text-text-200 hover:bg-surface-600/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      download={download}
      onClick={onClick}
      className={classes}
      type={href ? undefined : type}
      target={href && !href.startsWith("#") && !href.startsWith("/") ? "_blank" : undefined}
      rel={href && !href.startsWith("#") && !href.startsWith("/") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Tag>
  );
}
