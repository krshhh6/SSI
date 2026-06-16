"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Award } from "lucide-react";

const ADVANTAGES = [
  "Bosch Certified Workshop",
  "Advanced KTS Diagnostic Equipment",
  "International Service Standards",
  "Genuine Spare Parts Guaranteed",
  "Trained & Certified Technicians",
  "Warranty-Compliant Repairs",
  "Transparent Pricing Policy",
  "Real-Time WhatsApp Updates",
];

export default function BoschAdvantage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="bosch-advantage"
      className="section-padding"
      style={{ background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          right: 0, top: 0, bottom: 0,
          width: "50%",
          background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(226, 0, 26, 0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
          className="bosch-grid"
        >
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative" }}
          >
            {/* Workshop visual */}
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                aspectRatio: "4/3",
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Simulated workshop scene */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #0a0a14 0%, #0f1520 40%, #0a0e18 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Grid floor */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(rgba(0, 102, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Bosch badge */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 20,
                      background: "linear-gradient(135deg, #E2001A, #A0000F)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      boxShadow: "0 0 50px rgba(226, 0, 26, 0.4), 0 0 100px rgba(226, 0, 26, 0.2)",
                    }}
                  >
                    <Award size={44} color="white" strokeWidth={1.5} />
                  </motion.div>
                  <div
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 900,
                      fontSize: "1.6rem",
                      color: "white",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    BOSCH
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", letterSpacing: "0.15em", marginTop: 2 }}>
                    AUTHORIZED WORKSHOP
                  </div>
                </div>

                {/* Corner accents */}
                {[
                  { top: 16, left: 16 },
                  { top: 16, right: 16 },
                  { bottom: 16, left: 16 },
                  { bottom: 16, right: 16 },
                ].map((pos, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      ...pos,
                      width: 30,
                      height: 30,
                      border: "2px solid rgba(0, 102, 255, 0.4)",
                      borderRadius: 4,
                    }}
                  />
                ))}

                {/* Glow rings */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    border: "1px solid rgba(226, 0, 26, 0.2)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Stats overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                position: "absolute",
                bottom: -20,
                right: -20,
                background: "var(--accent)",
                borderRadius: 14,
                padding: "16px 20px",
                boxShadow: "0 10px 40px rgba(0, 102, 255, 0.4)",
              }}
            >
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "2rem", color: "white", lineHeight: 1 }}>15+</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Years of<br/>Excellence</div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "5px 16px",
                borderRadius: 100,
                border: "1px solid rgba(226, 0, 26, 0.4)",
                color: "#E2001A",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Why Bosch
            </span>

            <h2 className="display-md" style={{ marginBottom: 20, lineHeight: 1.1 }}>
              THE{" "}
              <span className="gradient-text-red">BOSCH</span>
              <br />
              ADVANTAGE
            </h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.75, marginBottom: 36 }}>
              Being a Bosch Authorized Service Center means we meet the highest international service standards — giving your car the care it truly deserves.
            </p>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ADVANTAGES.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.07, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 size={18} color="#00C896" strokeWidth={2.5} />
                  </motion.div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text)" }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bosch-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
