"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, Wind, Recycle, Zap } from "lucide-react";

const ECO_FEATURES = [
  { icon: Wind, title: "Reduced Emissions", desc: "Proper engine tuning cuts harmful emissions by up to 30%.", color: "#00C896" },
  { icon: Recycle, title: "Eco-Friendly Maintenance", desc: "We recycle used oil and parts responsibly.", color: "#00AAFF" },
  { icon: Leaf, title: "Sustainable Practices", desc: "Workshop designed with minimal environmental footprint.", color: "#66DD55" },
  { icon: Zap, title: "Green Mobility Initiative", desc: "Preparing for EV servicing with future-ready infrastructure.", color: "#FFB800" },
];

export default function Sustainability() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="sustainability"
      className="section-padding"
      style={{
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated green ambient */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 200, 150, 0.07) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(0, 200, 150, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 150, 0.025) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating leaf particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            fontSize: "1.2rem",
            opacity: 0.15,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-10, -25, -10],
            x: [-5, 10, -5],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          🍃
        </motion.div>
      ))}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid rgba(0, 200, 150, 0.4)",
              color: "#00C896",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            🌱 Green Initiative
          </span>

          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            DRIVE SMART.
            <br />
            <span style={{
              background: "linear-gradient(135deg, #00C896, #00AAFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              DRIVE GREEN.
            </span>
          </h2>

          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: 520,
              margin: "0 auto",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
          >
            Every service at SAM Wheels contributes to cleaner mobility, reduced emissions, and a sustainable future for Bihar.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {ECO_FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: `0 20px 50px ${feat.color}25`, borderColor: `${feat.color}44` }}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* BG glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${feat.color}10, transparent)`,
                  pointerEvents: "none",
                }}
              />

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `${feat.color}18`,
                  border: `1px solid ${feat.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <feat.icon size={24} color={feat.color} strokeWidth={2} />
              </motion.div>

              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: "center", marginTop: 56 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 100,
              background: "linear-gradient(135deg, rgba(0, 200, 150, 0.15), rgba(0, 170, 255, 0.1))",
              border: "1px solid rgba(0, 200, 150, 0.3)",
              color: "#00C896",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            <Leaf size={16} />
            Join the Green Mobility Revolution with SAM Wheels
          </div>
        </motion.div>
      </div>
    </section>
  );
}
