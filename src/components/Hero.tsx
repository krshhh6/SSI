"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { Phone, CalendarCheck, Star, Users, Car, ShieldCheck } from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import AnimatedCounter from "./AnimatedCounter";

const TRUST_BADGES = [
  { icon: Star, value: "4.7", label: "Google Rating", color: "#FFB800" },
  { icon: Users, value: "535+", label: "Customer Reviews", color: "#0066FF" },
  { icon: Car, value: "All", label: "Multi-Brand Service", color: "#00C896" },
  { icon: ShieldCheck, value: "100%", label: "Bosch Authorized", color: "#E2001A" },
];

const STATS = [
  { target: 4.7, suffix: "★", label: "Google Rating", decimals: 1 },
  { target: 535, suffix: "+", label: "Happy Customers", decimals: 0 },
  { target: 15, suffix: "+", label: "Years Experience", decimals: 0 },
  { target: 30, suffix: "+", label: "Car Brands Serviced", decimals: 0 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Car scroll-driven animation
  const rawCarX = useTransform(scrollYProgress, [0, 0.6], ["0%", "-32%"]);
  const rawCarRotateY = useTransform(scrollYProgress, [0, 0.6], [0, -6]);
  const rawCarScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.82]);
  const rawCarOpacity = useTransform(scrollYProgress, [0.3, 0.65], [1, 0]);
  const rawCarY = useTransform(scrollYProgress, [0, 0.6], ["0%", "8%"]);

  // Spring-smooth versions
  const carX = useSpring(rawCarX, { stiffness: 60, damping: 20 });
  const carScale = useSpring(rawCarScale, { stiffness: 60, damping: 20 });
  const carY = useSpring(rawCarY, { stiffness: 60, damping: 20 });

  // Hero content parallax
  const headlineY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-30%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Background orb parallax
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-10%", "30%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const badgesRef = useRef<HTMLDivElement>(null);
  const badgesInView = useInView(badgesRef, { once: true });

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}
      className="hero-section"
    >
      {/* Ambient Background */}
      <div
        style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
      >
        {/* Gradient mesh */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(0, 102, 255, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(226, 0, 26, 0.05) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0, 150, 255, 0.06) 0%, transparent 50%)",
          }}
        />
        {/* Animated orbs */}
        <motion.div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 102, 255, 0.12) 0%, transparent 70%)",
            right: "-10%",
            top: "10%",
            y: orb1Y,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(226, 0, 26, 0.07) 0%, transparent 70%)",
            left: "5%",
            bottom: "20%",
            y: orb2Y,
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Light beam */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: "-20%",
            width: "40%",
            height: "100%",
            background: "linear-gradient(105deg, transparent 40%, rgba(0, 102, 255, 0.03) 50%, transparent 60%)",
            transform: "rotate(-15deg)",
          }}
          animate={{ x: ["0%", "180%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Bottom vignette */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(to bottom, transparent, var(--bg))",
            zIndex: 2,
          }}
        />
      </div>

      {/* Particles */}
      <FloatingParticles />

      {/* Car render — desktop: absolute scroll-animated | mobile: inline below text */}
      <motion.div
        className="hero-car-desktop"
        style={{
          position: "absolute",
          right: "-4%",
          top: "50%",
          translateY: "-50%",
          width: "55%",
          maxWidth: 860,
          x: carX,
          scale: carScale,
          opacity: rawCarOpacity,
          y: carY,
          rotateY: rawCarRotateY,
          perspective: 1200,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: "20%",
            right: "20%",
            height: "30px",
            background: "radial-gradient(ellipse, rgba(0, 102, 255, 0.35) 0%, transparent 70%)",
            filter: "blur(20px)",
            zIndex: 1,
          }}
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <Image
            src="/images/hero-car.png"
            alt="Premium luxury car - Bosch SAM Wheels Patna"
            width={860}
            height={480}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 60px rgba(0, 102, 255, 0.5))",
            }}
            priority
          />
        </motion.div>
      </motion.div>

      {/* Hero Content */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          paddingTop: 100,
          paddingBottom: 80,
          width: "100%",
        }}
        className="hero-content"
      >
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: 24 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 100,
                border: "1px solid rgba(226, 0, 26, 0.4)",
                background: "rgba(226, 0, 26, 0.08)",
                color: "#FF3355",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#E2001A",
                  boxShadow: "0 0 8px #E2001A",
                }}
              />
              Bosch Authorized Workshop · Patna, Bihar
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="display-xl"
            style={{ maxWidth: 640, marginBottom: 8 }}
          >
            <span style={{ color: "var(--text)", display: "block", textShadow: "0 4px 30px var(--bg), 0 0 10px var(--bg)" }}>
              BOSCH CERTIFIED
            </span>
            <span
              className="gradient-text-blue"
              style={{ display: "block", lineHeight: 1, textShadow: "0 4px 30px var(--bg)" }}
            >
              CAR CARE
            </span>
            <span style={{ color: "var(--text)", display: "block", textShadow: "0 4px 30px var(--bg), 0 0 10px var(--bg)" }}>
              EXCELLENCE
            </span>
          </h1>

          {/* Sub headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              fontWeight: 400,
              marginTop: 20,
              marginBottom: 36,
              maxWidth: 440,
              lineHeight: 1.7,
            }}
          >
            Expert Diagnostics. Genuine Parts.
            <br />
            Certified Technicians for Every Brand.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}
          >
            <motion.a
              href="/booking"
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: "1rem", padding: "15px 36px" }}
            >
              <CalendarCheck size={18} />
              Book Service
            </motion.a>
            <motion.a
              href="tel:+919028384499"
              className="btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: "1rem", padding: "15px 36px" }}
            >
              <Phone size={18} />
              Call Now
            </motion.a>
          </motion.div>

          {/* Trust Badges */}
          <div ref={badgesRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={badgesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                maxWidth: 560,
              }}
            >
              {TRUST_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={badgesInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <badge.icon size={14} color={badge.color} strokeWidth={2.5} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: badge.color }}>
                    {badge.value}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 400 }}>
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="hero-stats"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          borderTop: "1px solid var(--border)",
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "20px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
          className="hero-stats-grid"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
              style={{ textAlign: "center", padding: "6px 0" }}
            >
              <div
                style={{
                  fontSize: "clamp(1.3rem, 3vw, 2rem)",
                  fontWeight: 900,
                  color: "var(--accent)",
                  fontFamily: "Outfit, sans-serif",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={2.5}
                  decimals={stat.decimals}
                />
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mobile-only car image (shown inline below text on small screens) */}
      <div
        className="hero-car-mobile"
        style={{
          display: "none",
          position: "relative",
          zIndex: 3,
          width: "100%",
          padding: "0 16px 120px",
          marginTop: "-20px",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "15%",
              right: "15%",
              height: "20px",
              background: "radial-gradient(ellipse, rgba(0, 102, 255, 0.3) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />
          <Image
            src="/images/hero-car.png"
            alt="Premium luxury car - Bosch SAM Wheels Patna"
            width={600}
            height={340}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 16px 40px rgba(0, 102, 255, 0.35))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
