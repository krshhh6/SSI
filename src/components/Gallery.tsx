"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const GALLERY_ITEMS = [
  { category: "Workshop", label: "State-of-the-Art Facility", color: "#0066FF", emoji: "🏭", rows: 2 },
  { category: "Exterior", label: "Paint & Dent Perfection", color: "#0066FF", emoji: "🚗", rows: 1 },
  { category: "Technicians", label: "Bosch Certified Experts", color: "#00C896", emoji: "👨‍🔧", rows: 1 },
  { category: "Interior", label: "Premium Detailing", color: "#AA66FF", emoji: "💺", rows: 1 },
  { category: "Workshop", label: "Bosch KTS Diagnostics", color: "#FF8800", emoji: "🔬", rows: 1 },
  { category: "Customer Vehicles", label: "BMW Series 5", color: "#0066FF", emoji: "🏎️", rows: 1 },
  { category: "Customer Vehicles", label: "Hyundai Creta", color: "#00AAFF", emoji: "🚙", rows: 2 },
  { category: "Exterior", label: "Ceramic Coating", color: "#AA66FF", emoji: "✨", rows: 1 },
  { category: "Technicians", label: "Training & Certification", color: "#00C896", emoji: "🎓", rows: 1 },
];

const CATEGORIES = ["All", "Workshop", "Exterior", "Interior", "Technicians", "Customer Vehicles"];

const GRADIENTS = [
  "linear-gradient(135deg, #0a0e1a 0%, #0d1629 50%, #050810 100%)",
  "linear-gradient(135deg, #1a0505 0%, #290d0d 50%, #100505 100%)",
  "linear-gradient(135deg, #051a14 0%, #0d2921 50%, #051010 100%)",
  "linear-gradient(135deg, #14051a 0%, #1f0d29 50%, #0f0510 100%)",
  "linear-gradient(135deg, #1a0f05 0%, #291b0d 50%, #100805 100%)",
  "linear-gradient(135deg, #050d1a 0%, #0d1829 50%, #050810 100%)",
  "linear-gradient(135deg, #051016 0%, #0d1e29 50%, #05080f 100%)",
  "linear-gradient(135deg, #12051a 0%, #1e0d29 50%, #0c050f 100%)",
  "linear-gradient(135deg, #081a10 0%, #102914 50%, #050f08 100%)",
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === activeCategory);

  return (
    <section
      id="gallery"
      className="section-padding"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid var(--border-hover)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Visual Tour
          </span>
          <h2 className="display-lg">
            WORKSHOP{" "}
            <span className="gradient-text">GALLERY</span>
          </h2>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                border: activeCategory === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
                background: activeCategory === cat ? "var(--accent)" : "var(--card)",
                color: activeCategory === cat ? "white" : "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.25s ease",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          ref={ref}
          layout
          style={{
            columns: "3 280px",
            gap: 16,
          }}
        >
          <AnimatePresence>
            {filtered.map((item, i) => {
              const origIndex = GALLERY_ITEMS.indexOf(item);
              return (
                <motion.div
                  key={item.label}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  onClick={() => setLightboxItem(item)}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    breakInside: "avoid",
                    marginBottom: 16,
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    height: item.rows === 2 ? 320 : 200,
                    background: GRADIENTS[origIndex],
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="gallery-item"
                >
                  {/* Content */}
                  <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: item.rows === 2 ? "3.5rem" : "2.5rem", marginBottom: 10 }}>
                      {item.emoji}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: item.color,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {item.category}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                      {item.label}
                    </div>
                  </div>

                  {/* Grid overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `linear-gradient(${item.color}08 1px, transparent 1px), linear-gradient(90deg, ${item.color}08 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Corner glow */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, right: 0,
                      width: 120, height: 120,
                      background: `radial-gradient(circle at top right, ${item.color}25, transparent)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${item.color}25, rgba(0,0,0,0.3))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 3,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ZoomIn size={20} color="white" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,0.9)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: 48,
                maxWidth: 500,
                width: "100%",
                textAlign: "center",
                position: "relative",
              }}
            >
              <button
                onClick={() => setLightboxItem(null)}
                style={{
                  position: "absolute",
                  top: 16, right: 16,
                  background: "var(--card-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  width: 36, height: 36,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text)",
                }}
              >
                <X size={16} />
              </button>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>{lightboxItem.emoji}</div>
              <span style={{ color: lightboxItem.color, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {lightboxItem.category}
              </span>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", marginTop: 8, marginBottom: 12 }}>
                {lightboxItem.label}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.9rem" }}>
                At SAM Wheels, every aspect of our workshop reflects our commitment to quality — from Bosch-certified technicians to state-of-the-art equipment and premium service standards.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .gallery-masonry { columns: 1 !important; }
        }
      `}</style>
    </section>
  );
}
