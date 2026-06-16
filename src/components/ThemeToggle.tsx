"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      id="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 52,
        height: 28,
        borderRadius: 100,
        background: isDark
          ? "linear-gradient(135deg, #0066FF22, #0066FF44)"
          : "linear-gradient(135deg, #FFF176, #FFB300)",
        border: isDark ? "1px solid #0066FF55" : "1px solid #FFB30055",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Stars/Sun rays background */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.span
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 6,
              fontSize: 8,
              lineHeight: 1,
              color: "#0066FF99",
            }}
          >
            ✦ ✦
          </motion.span>
        ) : (
          <motion.span
            key="rays"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: 6,
              fontSize: 7,
              lineHeight: 1,
              color: "#FF980099",
            }}
          >
            ✦ ✦
          </motion.span>
        )}
      </AnimatePresence>

      {/* Thumb */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: isDark
            ? "linear-gradient(135deg, #C8D6FF, #A0BAFF)"
            : "linear-gradient(135deg, #FFD54F, #FF9800)",
          boxShadow: isDark
            ? "0 0 8px rgba(0, 102, 255, 0.6), inset -3px -1px 0 rgba(0,0,0,0.2)"
            : "0 0 12px rgba(255, 180, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          marginLeft: isDark ? "auto" : 0,
          marginRight: isDark ? 0 : "auto",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              🌙
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              ☀️
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
