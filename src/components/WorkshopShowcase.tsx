"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Wrench, ShieldCheck, Cpu, CheckCircle2, type LucideIcon } from "lucide-react";

interface WorkshopTag {
  label: string;
  icon: LucideIcon;
  iconColor: string;
}

interface WorkshopFacility {
  id: string;
  badge: string;
  badgeIcon: LucideIcon;
  badgeBg: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tags: WorkshopTag[];
}

const WORKSHOP_FACILITIES: WorkshopFacility[] = [
  {
    id: "diagnostic-floor",
    badge: "DIAGNOSTIC BAYS",
    badgeIcon: Cpu,
    badgeBg: "rgba(0, 102, 255, 0.88)",
    title: "Computerized Multi-Brand Diagnostic Floor",
    description:
      "Our workshop features high-capacity multi-vehicle service bays integrated with Bosch KTS computer scanning tools for instantaneous ECU error code detection.",
    imageSrc: "/images/bosch-diagnostic-bay.jpg",
    imageAlt: "Bosch Multi-Brand Service Diagnostic Bay in Patna",
    tags: [
      { label: "Bosch KTS ECU Scanners", icon: CheckCircle2, iconColor: "#10B981" },
      { label: "40+ Point Health Check", icon: CheckCircle2, iconColor: "#10B981" },
    ],
  },
  {
    id: "hydraulic-bays",
    badge: "HYDRAULIC OVERHAUL BAYS",
    badgeIcon: Wrench,
    badgeBg: "rgba(0, 142, 207, 0.9)",
    title: "Precision Engine & Suspension Lifting Bays",
    description:
      "Heavy-duty hydraulic lift stations enable complete underbody inspection, brake rotor resurfacing, suspension tuning, and complete engine overhauls.",
    imageSrc: "/images/bosch-hydraulic-bay.jpg",
    imageAlt: "Bosch Hydraulic Lifts & Engine Overhaul Bay at SAM Wheels Patna",
    tags: [
      { label: "Bosch Certified Master Technicians", icon: ShieldCheck, iconColor: "#008ECF" },
      { label: "100% Genuine Bosch Spare Parts", icon: CheckCircle2, iconColor: "#10B981" },
    ],
  },
];

export default function WorkshopShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-40px" });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="workshop-showcase-title"
      style={{
        background: "var(--bg)",
        paddingTop: 64,
        paddingBottom: 64,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Radial Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0, 102, 255, 0.05) 0%, rgba(226, 0, 26, 0.04) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container mx-auto px-4" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid rgba(0, 142, 207, 0.25)",
              color: "#008ECF",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
              background: "rgba(0, 142, 207, 0.08)",
            }}
          >
            OUR WORKSHOP FACILITY
          </span>
          <h2
            id="workshop-showcase-title"
            style={{
              fontSize: "clamp(1.75rem, 3.2vw, 2.4rem)",
              fontWeight: 900,
              color: "var(--text)",
              fontFamily: "Outfit, sans-serif",
              margin: "0 0 12px 0",
              lineHeight: 1.2,
            }}
          >
            State-Of-The-Art Bosch Workshop In <span style={{ color: "#008ECF" }}>Patna</span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              maxWidth: 700,
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
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 26,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {WORKSHOP_FACILITIES.map((facility, index) => (
            <motion.article
              key={facility.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.12 }}
              whileHover={{ y: -5 }}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              }}
              className="group"
            >
              {/* Image Box */}
              <div style={{ position: "relative", width: "100%", height: 250, overflow: "hidden", background: "#0a0a0a" }}>
                <Image
                  src={facility.imageSrc}
                  alt={facility.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  className="group-hover:scale-105"
                  quality={85}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: facility.badgeBg,
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    padding: "4px 12px",
                    borderRadius: 100,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <facility.badgeIcon size={13} />
                  {facility.badge}
                </span>
              </div>

              {/* Content Box */}
              <div
                style={{
                  padding: "24px 22px 22px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      margin: "0 0 10px 0",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {facility.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      margin: "0 0 18px 0",
                    }}
                  >
                    {facility.description}
                  </p>
                </div>

                {/* Feature Tags with Clean Pill Styling */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {facility.tags.map((tag) => (
                    <span
                      key={tag.label}
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <tag.icon size={14} color={tag.iconColor} />
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
