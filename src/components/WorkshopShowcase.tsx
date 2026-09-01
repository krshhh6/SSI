"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Wrench, ShieldCheck, Cpu, CheckCircle2 } from "lucide-react";

export default function WorkshopShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        paddingTop: 80,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(226, 0, 26, 0.05) 0%, rgba(0, 102, 255, 0.04) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "4px 16px",
              borderRadius: 100,
              border: "1px solid rgba(0, 142, 207, 0.22)",
              color: "#008ECF",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
              background: "rgba(0, 142, 207, 0.08)",
            }}
          >
            OUR WORKSHOP FACILITY
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "var(--text)",
              fontFamily: "Outfit, sans-serif",
              margin: "0 0 16px 0",
              lineHeight: 1.2,
            }}
          >
            State-Of-The-Art Bosch Workshop In <span style={{ color: "#008ECF" }}>Patna</span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: 720,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Equipped with advanced Bosch KTS diagnostic scanners, 3D computerized wheel alignment bays, heavy-duty hydraulic lifts, and dust-free paint booths.
          </p>
        </motion.div>

        {/* 2-Column Photo Showcase Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {/* Showcase Card 1: Diagnostic & Service Floor */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            }}
          >
            {/* Image Box */}
            <div style={{ position: "relative", width: "100%", height: 320, overflow: "hidden" }}>
              <img
                src="/images/ref1.jpg"
                alt="Bosch Multi-Brand Service Workshop Floor in Patna"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "rgba(0, 102, 255, 0.85)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: 100,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Cpu size={14} /> DIAGNOSTIC BAYS
              </span>
            </div>

            {/* Content Box */}
            <div style={{ padding: "28px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 900,
                    color: "var(--text)",
                    margin: "0 0 10px 0",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Computerized Multi-Brand Diagnostic Floor
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    margin: "0 0 20px 0",
                  }}
                >
                  Our workshop features high-capacity multi-vehicle service bays integrated with Bosch KTS computer scanning tools for instantaneous ECU error code detection.
                </p>
              </div>

              {/* Feature Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} color="#10B981" /> Bosch KTS ECU Scanners
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} color="#10B981" /> 40+ Point Health Check
                </span>
              </div>
            </div>
          </motion.div>

          {/* Showcase Card 2: Hydraulic Lifts & Engine Bays */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6 }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            }}
          >
            {/* Image Box */}
            <div style={{ position: "relative", width: "100%", height: 320, overflow: "hidden" }}>
              <img
                src="/images/ref2.jpg"
                alt="Hydraulic Lifts & Engine Overhaul Bay at SAM Wheels Patna"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "rgba(0, 142, 207, 0.9)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: 100,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Wrench size={14} /> HYDRAULIC OVERHAUL BAYS
              </span>
            </div>

            {/* Content Box */}
            <div style={{ padding: "28px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 900,
                    color: "var(--text)",
                    margin: "0 0 10px 0",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Precision Engine & Suspension Lifting Bays
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    margin: "0 0 20px 0",
                  }}
                >
                  Heavy-duty hydraulic lift stations enable complete underbody inspection, brake rotor resurfacing, suspension tuning, and complete engine overhauls.
                </p>
              </div>

              {/* Feature Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <ShieldCheck size={15} color="#008ECF" /> Bosch Certified Master Technicians
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} color="#10B981" /> 100% Genuine Bosch Spare Parts
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
