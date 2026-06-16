"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Wrench,
  Gauge,
  PaintBucket,
  Wind,
  RotateCcw,
  Sparkles,
  FileText,
  Package,
} from "lucide-react";

const SERVICES = [
  {
    icon: Wrench,
    title: "Periodic Maintenance",
    desc: "Scheduled servicing with genuine oil, filters, and parts to keep your car running at peak performance.",
    color: "#0066FF",
  },
  {
    icon: Gauge,
    title: "Engine Diagnostics",
    desc: "Advanced Bosch KTS diagnostic tools for precise fault detection and engine health assessment.",
    color: "#00AAFF",
  },
  {
    icon: PaintBucket,
    title: "Dent & Paint",
    desc: "Professional dent removal and precision painting using computerized color matching technology.",
    color: "#E2001A",
  },
  {
    icon: Wind,
    title: "AC Service & Repair",
    desc: "Complete AC system check, refrigerant refill, compressor service and cabin air filter replacement.",
    color: "#00C896",
  },
  {
    icon: RotateCcw,
    title: "Wheel Alignment",
    desc: "3D computerized wheel alignment and balancing for optimal tire life and fuel efficiency.",
    color: "#FF8800",
  },
  {
    icon: Sparkles,
    title: "Car Detailing",
    desc: "Premium interior and exterior detailing with ceramic coating, polishing and deep cleaning.",
    color: "#AA66FF",
  },
  {
    icon: FileText,
    title: "Insurance Claims",
    desc: "Hassle-free cashless insurance claim processing with all major insurance companies.",
    color: "#FF4466",
  },
  {
    icon: Package,
    title: "Genuine Bosch Parts",
    desc: "100% authentic Bosch spare parts sourced directly from authorized distributors.",
    color: "#0066FF",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};


export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="section-padding" style={{ background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 102, 255, 0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
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
            What We Offer
          </span>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            SERVICES FOR{" "}
            <span className="gradient-text-blue">ALL CAR BRANDS</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.7 }}>
            From periodic maintenance to complex diagnostics — we service every make and model with Bosch-certified expertise.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
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
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      className="p-5 md:p-7 service-card"
    >
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Icon */}
      <div
        className="mb-3 md:mb-[18px]"
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
      >
        <Icon size={22} color={color} strokeWidth={2} />
      </div>

      <h3
        className="text-[var(--text)] mb-0 md:mb-[10px]"
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        className="hidden md:block"
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {desc}
      </p>

      {/* Bottom accent line */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${color}, ${color}44)`,
          originX: 0,
          scaleX: 0,
        }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      <style>{`
        .service-card:hover {
          border-color: ${color}44 !important;
          box-shadow: 0 10px 40px ${color}18, 0 0 0 1px ${color}22 !important;
        }
      `}</style>
    </motion.div>
  );
}
