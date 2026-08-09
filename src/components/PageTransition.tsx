"use client";
import { motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const variants: Variants = {
  hidden: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
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
