"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, CalendarCheck, Star, Car, ShieldCheck } from "lucide-react";
import MaterialSymbol from "./core/MaterialSymbol";
import CountUp from "./ReactBits/CountUp";
import MagneticButton from "./MagneticButton";

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
          top: "47%",
          translateY: "-50%",
          width: "48%",
          maxWidth: 680,
          height: "52vh",
          minHeight: 380,
          maxHeight: 520,
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
          animate={{ y: [0, -12, 0] }}
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
          paddingTop: 80,
          paddingBottom: 88,
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
          {/* Top German Precision Bosch Credential Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", maxWidth: "100%" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px 4px 5px",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(22, 25, 34, 0.95)",
                boxShadow: "0 6px 20px -4px rgba(0, 0, 0, 0.5)",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Official Bosch Workshop Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#E2001A",
                  padding: "3px 7px",
                  borderRadius: 5,
                  flexShrink: 0,
                }}
              >
                <MaterialSymbol name="verified" size={12} fill color="#FFFFFF" />
                <span
                  style={{
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    letterSpacing: "0.07em",
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    fontFamily: "'Outfit', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  BOSCH CERTIFIED
                </span>
              </div>

              {/* Patna Region Text — hidden on small mobile screens to prevent overflow */}
              <span
                className="hidden sm:inline"
                style={{
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "0.01em",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Patna Workshop
              </span>

              {/* Fine hairline divider — hidden on small mobile screens */}
              <div className="hidden sm:block" style={{ width: 1, height: 12, background: "rgba(255, 255, 255, 0.15)", flexShrink: 0 }} />

              {/* Google Verified Customer Rating Lockup */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, whiteSpace: "nowrap" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.27A7.06 7.06 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.25A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                </svg>
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    fontFamily: "'Outfit', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  4.7
                </span>
                <span className="hidden sm:inline" style={{ color: "#F59E0B", fontSize: "0.72rem", letterSpacing: "1px", lineHeight: 1 }}>
                  ★★★★★
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  (535+ Reviews)
                </span>
              </div>
            </div>
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
              fontSize: "clamp(0.82rem, 1.05vw, 0.94rem)",
              fontWeight: 400,
              marginTop: 6,
              marginBottom: 16,
              maxWidth: 480,
              lineHeight: 1.55,
            }}
          >
            Patna's premier multi-brand workshop equipped with advanced Bosch KTS diagnostics, genuine OEM parts, and certified master technicians.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", width: "100%", maxWidth: 380, marginBottom: 14 }}
          >
            <Link
              href="/booking"
              style={{
                flex: "1 1 140px",
                height: 40,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "#E2001A",
                color: "#ffffff",
                padding: "0 18px",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: "0.85rem",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(226, 0, 26, 0.35)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#c0001a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#E2001A"; }}
            >
              <CalendarCheck size={16} />
              <span>Book Service</span>
            </Link>

            <a
              href="tel:+919028384499"
              style={{
                flex: "1 1 120px",
                height: 40,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                color: "#ffffff",
                padding: "0 16px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.07)"; }}
            >
              <Phone size={15} />
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
              gap: "8px 14px",
              flexWrap: "wrap",
              fontSize: "0.74rem",
              color: "rgba(255, 255, 255, 0.65)",
              fontWeight: 500,
              marginBottom: 0,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <ShieldCheck size={13} color="#10B981" /> Genuine Bosch Parts
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <Car size={13} color="#0066FF" /> Doorstep Pickup
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <Star size={13} color="#FFB800" /> 6-Month Warranty
            </span>
          </motion.div>

          {/* Mobile Car Stage Render */}
          <motion.div
            className="hero-car-mobile"
            style={{
              display: "none",
              position: "relative",
              width: "100%",
              height: "210px",
              marginTop: 14,
              marginBottom: 14,
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
                height: "30px",
                background: "radial-gradient(ellipse, rgba(226, 0, 26, 0.25) 0%, rgba(0, 102, 255, 0.12) 50%, transparent 75%)",
                filter: "blur(16px)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
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
        </motion.div>
      </div>

      {/* Matte Precision Stats Row — No shiny glare, pure executive matte finish */}
      <motion.div
        className="hero-stats"
        style={{
          position: "absolute",
          bottom: 14,
          left: 0,
          right: 0,
          margin: "0 auto",
          zIndex: 10,
          background: "#14171E",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
          borderRadius: 12,
          width: "calc(100% - 48px)",
          maxWidth: 680,
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="hero-stat-card"
              style={{ 
                position: "relative",
                borderRight: i !== STATS.length - 1 ? "1px solid rgba(255, 255, 255, 0.07)" : "none",
                padding: "10px 6px",
                textAlign: "center",
                background: "transparent",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.12rem, 1.65vw, 1.35rem)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  fontFamily: "Outfit, sans-serif",
                  lineHeight: 1.1,
                  marginBottom: 2,
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
              <div style={{ fontSize: "0.62rem", color: "rgba(255, 255, 255, 0.55)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
