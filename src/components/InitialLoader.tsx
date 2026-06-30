"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while loader is active
    document.body.style.overflow = "hidden";
    
    // Hide loader after 6.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 6500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="page-loader-card"
        >
          <div className="page-loader">
            <p>loading</p>
            <div className="page-loader-words">
              <span className="page-loader-word">diagnostics</span>
              <span className="page-loader-word">servicing</span>
              <span className="page-loader-word">repairs</span>
              <span className="page-loader-word">car wash</span>
              <span className="page-loader-word">diagnostics</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
