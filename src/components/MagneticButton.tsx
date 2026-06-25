"use client";
import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // how many px to pull (default 12)
  className?: string;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  strength = 12,
  className,
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    x.set(distX * (strength / (rect.width / 2)));
    y.set(distY * (strength / (rect.height / 2)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      style={{ display: "inline-block", ...style, x, y }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      // On mobile, no magnetic effect (touch devices)
      whileTap={{ scale: 0.96 }}
    >
      {children}
      {/* Subtle glow pulse on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "inherit",
            background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}
    </motion.div>
  );
}
