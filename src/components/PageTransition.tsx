"use client";
import { motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.99,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 1.01,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}
