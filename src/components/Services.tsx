"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
import SpotlightCard from "./SpotlightCard";

const SERVICES = [
  {
    icon: Wrench,
    title: "Periodic Maintenance",
    desc: "Scheduled servicing with genuine oil, filters, and parts to keep your car running at peak performance.",
    color: "#0066FF",
    href: "/blog#periodic-maintenance",
  },
  {
    icon: Gauge,
    title: "Engine Diagnostics",
    desc: "Advanced Bosch KTS diagnostic tools for precise fault detection and engine health assessment.",
    color: "#00AAFF",
    href: "/blog#engine-diagnostics",
  },
  {
    icon: PaintBucket,
    title: "Dent & Paint",
    desc: "Professional dent removal and precision painting using computerized color matching technology.",
    color: "#E2001A",
    href: "/blog#dent-and-paint",
  },
  {
    icon: Wind,
    title: "AC Service & Repair",
    desc: "Complete AC system check, refrigerant refill, compressor service and cabin air filter replacement.",
    color: "#00C896",
    href: "/blog#ac-service",
  },
  {
    icon: RotateCcw,
    title: "Wheel Alignment",
    desc: "3D computerized wheel alignment and balancing for optimal tire life and fuel efficiency.",
    color: "#FF8800",
    href: "/blog#wheel-alignment",
  },
  {
    icon: Sparkles,
    title: "Car Detailing",
    desc: "Premium interior and exterior detailing with ceramic coating, polishing and deep cleaning.",
    color: "#AA66FF",
    href: "/blog#car-detailing",
  },
  {
    icon: FileText,
    title: "Insurance Claims",
    desc: "Hassle-free cashless insurance claim processing with all major insurance companies.",
    color: "#FF4466",
    href: "/blog#insurance-claims",
  },
  {
    icon: Package,
    title: "Genuine Bosch Parts",
    desc: "100% authentic Bosch spare parts sourced directly from authorized distributors.",
    color: "#0066FF",
    href: "/bosch-advantage",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-padding"
      style={{ background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}
    >
      {/* Parallax background orb */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          y: bgY,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 102, 255, 0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
          </motion.span>
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
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} {...service} index={i} />
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
  index,
  href,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  desc: string;
  color: string;
  index: number;
  href: string;
}) {
  const fromX = index % 2 === 0 ? -30 : 30;

  const cardVariants = {
    hidden: { opacity: 0, x: fromX, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.a
      href={href}
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      style={{ textDecoration: "none", display: "block" }}
    >
      <SpotlightCard
        spotlightColor={`${color}22`}
        style={{
          background: "var(--card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          cursor: "default",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        className="service-card"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="service-header">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: `${color}18`,
              border: `1px solid ${color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={24} color={color} strokeWidth={2} />
          </motion.div>

          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
        </div>

        <p
          className="service-desc"
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
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
          .service-card {
            padding: 24px;
          }
          .service-header {
            margin-bottom: 16px;
          }
          .service-card:hover {
            border-color: ${color}44 !important;
            box-shadow: 0 10px 40px ${color}18, 0 0 0 1px ${color}22 !important;
          }
          @media (max-width: 768px) {
            .service-card {
              padding: 16px;
            }
            .service-header {
              margin-bottom: 0;
            }
            .service-desc {
              display: none;
            }
          }
        `}</style>
      </SpotlightCard>
    </motion.a>
  );
}
