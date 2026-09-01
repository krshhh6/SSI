"use client";

import { motion } from "framer-motion";
import * as React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1], // Smooth luxury automotive cubic-bezier
      }}
      style={{ width: "100%", minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}
