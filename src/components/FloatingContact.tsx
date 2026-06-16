"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Navigation } from "lucide-react";

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
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="floating-contact-inner"
            style={{
              pointerEvents: "auto",
            }}
          >
            {/* Call Now Button */}
            <motion.a
              href="tel:+919028384499"
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 8px 20px var(--bosch-red-glow)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 18px",
                borderRadius: 50,
                background: "var(--bosch-red)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                flex: 1,
                boxShadow: "0 4px 12px var(--bosch-red-glow)",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
            >
              <Phone size={15} />
              <span>Call<span className="hidden md:inline"> Now</span></span>
            </motion.a>

            {/* WhatsApp Us Button */}
            <motion.a
              href="https://wa.me/919028384499?text=Hello%2C%20I%20want%20to%20book%20a%20car%20service%20at%20SAM%20Wheels%2C%20Patna."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 8px 20px rgba(37, 211, 102, 0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 18px",
                borderRadius: 50,
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                flex: 1,
                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.25)",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp<span className="hidden md:inline"> Us</span></span>
            </motion.a>

            {/* Get Directions Button */}
            <motion.a
              href="https://maps.google.com/?q=SAM+Wheels+Bosch+Car+Service+Patna+Bihar"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.03, 
                y: -2, 
                borderColor: "var(--accent)", 
                color: "var(--accent)", 
                boxShadow: "0 8px 20px rgba(0, 102, 255, 0.15)" 
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "11px 18px",
                borderRadius: 50,
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                flex: 1,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
            >
              <Navigation size={15} />
              <span><span className="hidden md:inline">Get </span>Directions</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
