"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Package, UserCheck, Cpu, Truck, Shield, Globe, Timer, Heart,
} from "lucide-react";

const FEATURES = [
  { icon: Package, title: "100% Genuine Bosch Parts", desc: "Direct from authorized Bosch distributors. Zero counterfeit, zero compromise.", color: "#0066FF" },
  { icon: UserCheck, title: "Certified Bosch Technicians", desc: "All our technicians are Bosch-trained and regularly updated on latest vehicle tech.", color: "#E2001A" },
  { icon: Cpu, title: "Advanced Diagnostics", desc: "Bosch KTS 590 diagnostic system reads every fault code for precise repair.", color: "#00C896" },
  { icon: Truck, title: "Pickup & Drop Service", desc: "Convenient doorstep vehicle pickup and delivery for busy customers.", color: "#FF8800" },
  { icon: Shield, title: "Insurance Support", desc: "Cashless claim processing with all major insurers. Zero paperwork hassle.", color: "#AA66FF" },
  { icon: Globe, title: "Multi-Brand Expertise", desc: "We service Maruti, Hyundai, Honda, Toyota, BMW, Audi, Mercedes and more.", color: "#00AAFF" },
  { icon: Timer, title: "Quick Turnaround", desc: "Most services completed same day. We respect your time as much as your car.", color: "#FF4466" },
  { icon: Heart, title: "Customer First Approach", desc: "Real-time updates via WhatsApp. Transparent pricing. No hidden charges.", color: "#FFB800" },
];

export default function WhyDifferent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="why-different" className="section-padding" style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--border), transparent)"
        }} />
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--border), transparent)"
        }} />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
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
              marginBottom: 16,
            }}
          >
            Our Edge
          </span>
          <h2 className="display-lg" style={{ maxWidth: 600 }}>
            WE CAN DO WHAT{" "}
            <span className="gradient-text-red">OTHERS CAN&apos;T</span>
          </h2>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            maxWidth: 500,
            marginTop: 16
          }}>
            Our Bosch certification, equipment, and commitment to excellence sets us apart from every other workshop in Patna.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
      }}
      whileHover={{
        y: -5,
        boxShadow: `0 20px 50px ${color}20, 0 0 0 1px ${color}33`,
        borderColor: `${color}44`,
        transition: { duration: 0.2 }
      }}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      className="p-5 md:p-[24px_22px]"
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse 60% 50% at 10% 20%, ${color}08 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="mb-3 md:mb-4"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={color} strokeWidth={2} />
        </div>

        <h3 
          className="mb-0 md:mb-2"
          style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}
        >
          {title}
        </h3>
        <p 
          className="hidden md:block"
          style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}
        >
          {desc}
        </p>
      </div>

      {/* Hover indicator */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: 3, height: "100%",
          background: color,
          borderRadius: "0 2px 2px 0",
          scaleY: 0,
          originY: 0,
        }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}
