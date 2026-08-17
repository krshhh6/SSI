"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";

export default function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Fade in after scrolling past 200px (past the initial hero fold)
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 16px 16px",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: 100,
              padding: "5px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              maxWidth: 420,
              width: "100%",
            }}
          >
            {/* Call Now Button */}
            <motion.a
              href="tel:+919028384499"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 100,
                background: "#E2001A",
                color: "white",
                fontWeight: 700,
                fontSize: "0.78rem",
                textDecoration: "none",
                flex: 1,
                boxShadow: "0 2px 8px rgba(226, 0, 26, 0.25)",
                transition: "all 0.2s ease",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              <Phone size={13} strokeWidth={2.5} />
              <span>Call Now</span>
            </motion.a>

            {/* WhatsApp Us Button */}
            <motion.a
              href="https://wa.me/919028384499?text=Hello%2C%20I%20want%20to%20book%20a%20car%20service%20at%20SAM%20Wheels%2C%20Patna."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 100,
                background: "#25D366",
                color: "white",
                fontWeight: 700,
                fontSize: "0.78rem",
                textDecoration: "none",
                flex: 1,
                boxShadow: "0 2px 8px rgba(37, 211, 102, 0.25)",
                transition: "all 0.2s ease",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </motion.a>
            
            {/* Get Directions Button */}
            <motion.a
              href="https://maps.google.com/?q=SAM+Wheels+Patna"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 100,
                background: "var(--bg-secondary, #f3f4f6)",
                color: "#1f2937",
                fontWeight: 700,
                fontSize: "0.78rem",
                textDecoration: "none",
                flex: 1,
                border: "1px solid rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#4285F4" }}>
                <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5 15.5 6.07 15.5 8s-1.57 3.5-3.5 3.5z"/>
              </svg>
              <span>Directions</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
