"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, CalendarCheck, Star, Users, Car, ShieldCheck } from "lucide-react";
import CountUp from "./ReactBits/CountUp";
import GlareHover from "./GlareHover";
import MagneticButton from "./MagneticButton";

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
      data-theme="dark"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
      }}
      className="hero-section"
    >
      {/* Clean Light Background */}
      <div
        style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, background: "var(--bg)" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
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
      </div>      {/* Car render — desktop: absolute scroll-animated | mobile: inline below text */}
      <motion.div
        className="hero-car-desktop"
        style={{
          position: "absolute",
          right: "0%",
          top: "40%",
          translateY: "-50%",
          width: "45%",
          maxWidth: 650,
          height: "55vh",
          minHeight: 400,

          zIndex: 2,
          pointerEvents: "auto", // Ensure it's interactive
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
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)"
            }}
          >
            <source src="/carhero.webm" type="video/webm" />
          </video>
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
          <div
            className="display-xl"
            style={{ maxWidth: 640, marginBottom: 8, display: "flex", flexDirection: "column" }}
          >
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              BOSCH CERTIFIED
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ color: "var(--bosch-red)" }}>
              CAR CARE
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              EXCELLENCE
            </motion.span>
          </div>

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
            <MagneticButton strength={10}>
              <Link href="/booking" style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  className="btn-primary"
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "var(--bosch-red)",
                    color: "#ffffff",
                    boxShadow: "0 4px 24px rgba(226, 0, 26, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CalendarCheck size={18} />
                  Book Service
                </motion.div>
              </Link>
            </MagneticButton>
            <MagneticButton strength={10}>
              <motion.a
                href="tel:+919028384499"
                className="btn-secondary"
                whileTap={{ scale: 0.97 }}
                style={{ fontSize: "1rem", padding: "15px 36px", display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
              >
                <Phone size={18} />
                Call Now
              </motion.a>
            </MagneticButton>
          </motion.div>

          {/* Mobile Car Render */}
          <motion.div
            className="hero-car-mobile"
            style={{
              display: "none",
              position: "relative",
              width: "100%",
              height: "280px",
              marginBottom: 20,
              zIndex: 2,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "5%",
                left: "15%",
                right: "15%",
                height: "20px",
                background: "radial-gradient(ellipse, rgba(0, 102, 255, 0.3) 0%, transparent 70%)",
                filter: "blur(15px)",
                zIndex: 1,
              }}
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "contain", 
                  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
                }}
              >
                <source src="/carhero.webm" type="video/webm" />
              </video>
            </motion.div>
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

      {/* Redesigned Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="hero-stats"
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          margin: "0 auto", // Safest way to center absolute elements
          zIndex: 10,
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-card)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 24,
          width: "calc(100% - 48px)",
          maxWidth: 1200,
          overflow: "hidden"
        }}
      >
        <div
          className="hero-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // Desktop default, mobile CSS overrides with !important
            position: "relative",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
              className="hero-stat-card"
              style={{ 
                position: "relative",
                borderRight: i !== STATS.length - 1 ? "1px solid var(--glass-border)" : "none"
              }}
              whileHover={{ backgroundColor: "var(--card-hover)" }}
            >
              <GlareHover
                glareColor="#0066FF"
                glareOpacity={0.2}
                glareAngle={-45}
                glareSize={200}
                transitionDuration={600}
                playOnce={false}
                style={{ width: "100%", height: "100%", padding: "24px 16px", boxSizing: "border-box" }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                    fontWeight: 900,
                    color: "var(--accent)",
                    fontFamily: "Outfit, sans-serif",
                    lineHeight: 1,
                    marginBottom: 8,
                    textShadow: "0 0 20px rgba(0, 102, 255, 0.4)"
                  }}
                >
                  <CountUp
                    to={stat.target}
                    from={0}
                    direction="up"
                    duration={2.5}
                    separator=","
                  />{stat.suffix}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </GlareHover>
            </motion.div>
          ))}
        </div>
      </motion.div>


    </section>
  );
}
