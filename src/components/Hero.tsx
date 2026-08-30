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

  // Hero scroll fade: starts at 100% full opacity on load, stays solid as you scroll, and fades out later towards services
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35, 0.8], [1, 1, 0]);

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
        background: "#101010",
        color: "var(--text)",
      }}
      className="hero-section"
    >
      {/* Clean Dark #101010 Solid Background */}
      <div
        style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, background: "#101010" }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(to bottom, transparent, #101010)",
            zIndex: 2,
          }}
        />
      </div>

      {/* Car render — desktop: absolute scroll-animated | mobile: inline below text */}
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
          opacity: heroOpacity,
          zIndex: 2,
          pointerEvents: "auto",
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
          style={{ opacity: heroOpacity }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top Unified Verification & Rating Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: 20, display: "inline-flex", alignItems: "center" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px 5px 10px",
                borderRadius: 100,
                border: "1px solid rgba(255, 255, 255, 0.14)",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#E2001A",
                    boxShadow: "0 0 8px #E2001A",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", color: "#ffffff", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  Bosch Authorized · Patna
                </span>
              </div>
              <div style={{ width: 1, height: 12, background: "rgba(255, 255, 255, 0.18)", flexShrink: 0 }} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
                <Star size={12} fill="#FFC107" color="#FFC107" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FFD54F", whiteSpace: "nowrap" }}>4.7</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.65)", fontWeight: 500, whiteSpace: "nowrap" }}>(535+ Reviews)</span>
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <div
            className="display-xl"
            style={{ maxWidth: 640, marginBottom: 12, display: "flex", flexDirection: "column" }}
          >
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              BOSCH CERTIFIED
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ color: "var(--bosch-red)", textShadow: "0 0 35px rgba(226,0,26,0.3)" }}>
              CAR CARE EXCELLENCE
            </motion.span>
          </div>

          {/* Sub headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "clamp(0.92rem, 1.4vw, 1.05rem)",
              fontWeight: 400,
              marginTop: 14,
              marginBottom: 28,
              maxWidth: 460,
              lineHeight: 1.6,
            }}
          >
            Patna's premier multi-brand workshop equipped with advanced Bosch KTS diagnostics, genuine OEM parts, and certified master technicians.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}
          >
            <Link
              href="/booking"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#E2001A",
                color: "#ffffff",
                padding: "13px 26px",
                borderRadius: 9,
                fontWeight: 800,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(226, 0, 26, 0.4)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#c0001a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#E2001A"; }}
            >
              <CalendarCheck size={17} />
              <span>Book Service</span>
            </Link>

            <a
              href="tel:+919028384499"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                color: "#ffffff",
                padding: "13px 22px",
                borderRadius: 9,
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.07)"; }}
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
          </motion.div>

          {/* Micro Trust Bullet Perks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              fontSize: "0.76rem",
              color: "rgba(255, 255, 255, 0.55)",
              fontWeight: 500,
              marginBottom: 32,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ShieldCheck size={13} color="#10B981" /> 100% Genuine Bosch Parts
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Car size={13} color="#0066FF" /> Doorstep Pickup Available
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Star size={13} color="#FFB800" /> 6-Month Service Warranty
            </span>
          </motion.div>

          {/* Mobile Car Stage Render */}
          <motion.div
            className="hero-car-mobile"
            style={{
              display: "none",
              position: "relative",
              width: "100%",
              height: "260px",
              marginBottom: 24,
              zIndex: 2,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Ambient Stage Lighting */}
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "8%",
                right: "8%",
                height: "36px",
                background: "radial-gradient(ellipse, rgba(226, 0, 26, 0.3) 0%, rgba(0, 102, 255, 0.15) 50%, transparent 75%)",
                filter: "blur(18px)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
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
                  background: "#101010",
                  filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.5))",
                  WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 65%, transparent 100%)",
                  maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 65%, transparent 100%)",
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
                gap: 10,
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
                    padding: "7px 12px",
                    borderRadius: 8,
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <badge.icon size={13} color={badge.color} strokeWidth={2.5} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: badge.color }}>
                    {badge.value}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", fontWeight: 500 }}>
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Luxury Glossy Center-Aligned Stats Row */}
      <motion.div
        className="hero-stats"
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          margin: "0 auto",
          zIndex: 10,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 18,
          width: "calc(100% - 48px)",
          maxWidth: 740,
          overflow: "hidden",
          opacity: heroOpacity,
        }}
      >
        <div
          className="hero-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            position: "relative",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="hero-stat-card"
              style={{ 
                position: "relative",
                borderRight: i !== STATS.length - 1 ? "1px solid rgba(255, 255, 255, 0.09)" : "none"
              }}
            >
              <GlareHover
                glareColor="#ffffff"
                glareOpacity={0.12}
                glareAngle={-45}
                glareSize={160}
                transitionDuration={500}
                playOnce={false}
                style={{ width: "100%", height: "100%", padding: "12px 10px", boxSizing: "border-box", textAlign: "center" }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.18rem, 2.2vw, 1.55rem)",
                    fontWeight: 900,
                    color: "#38BDF8",
                    fontFamily: "Outfit, sans-serif",
                    lineHeight: 1.1,
                    marginBottom: 3,
                    textShadow: "0 0 16px rgba(56, 189, 248, 0.45)",
                    letterSpacing: "-0.01em",
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
                <div style={{ fontSize: "0.66rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
