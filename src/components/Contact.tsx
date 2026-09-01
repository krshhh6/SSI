"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MaterialSymbol from "./core/MaterialSymbol";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: "50%",
          background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(0, 102, 255, 0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Find Us
          </span>
          <h2 className="display-lg">
            VISIT OUR{" "}
            <span className="gradient-text">SERVICE CENTER</span>
          </h2>
        </motion.div>

        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
            gap: 36,
            alignItems: "stretch",
          }}
          className="contact-grid"
        >
          {/* Left: Unified Workshop Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "32px 28px",
              boxShadow: "0 14px 38px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            {/* Top Facility Header */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  color: "#E2001A",
                  textTransform: "uppercase",
                }}>
                  BOSCH AUTHORIZED WORKSHOP
                </div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: "#10B981",
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "2px 8px",
                  borderRadius: 100,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  Open Today
                </div>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text)", margin: 0, lineHeight: 1.25 }}>
                SAM Wheels Pvt Ltd
              </h3>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Multi-Brand Diagnostic & Precision Service Facility
              </div>
            </div>

            {/* 3 Detail Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Address Row */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div
                  style={{
                    width: 38, height: 38,
                    borderRadius: 10,
                    background: "rgba(226, 0, 26, 0.08)",
                    border: "1px solid rgba(226, 0, 26, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MaterialSymbol name="location_on" size={20} fill color="#E2001A" />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Workshop Address</div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.55, fontWeight: 600 }}>
                    Opp. Passport Office, Akashvani Lane,<br />
                    Ashiana–Digha Road, Patna, Bihar 800014
                  </div>
                </div>
              </div>

              {/* Phone Row */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div
                  style={{
                    width: 38, height: 38,
                    borderRadius: 10,
                    background: "rgba(0, 102, 255, 0.08)",
                    border: "1px solid rgba(0, 102, 255, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MaterialSymbol name="call" size={19} fill color="#0066FF" />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Helpline & Booking</div>
                  <a href="tel:+919028384499" style={{ fontSize: "1.05rem", color: "var(--text)", fontWeight: 800, textDecoration: "none" }}>
                    +91 90283 84499
                  </a>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: 2 }}>Direct Assistance & Toll-Free Advice</div>
                </div>
              </div>

              {/* Operating Hours Row */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 38, height: 38,
                    borderRadius: 10,
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MaterialSymbol name="schedule" size={19} fill color="#10B981" />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Operating Hours</div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 700 }}>
                    Mon – Sat: 9:00 AM – 7:00 PM
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Sunday: 10:00 AM – 4:00 PM
                  </div>
                </div>
              </div>
            </div>

            {/* Precision Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* 2-Column Primary Action Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <motion.a
                  href="tel:+919028384499"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "linear-gradient(180deg, #E81A2F 0%, #C40016 100%)",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    letterSpacing: "-0.01em",
                    boxShadow: "0 4px 14px rgba(226, 0, 26, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    textAlign: "center",
                  }}
                >
                  <MaterialSymbol name="call" size={16} fill color="#ffffff" />
                  <span>Call Now</span>
                </motion.a>

                <motion.a
                  href="https://wa.me/919028384499?text=Hello%2C%20I%20want%20to%20book%20a%20car%20service%20at%20SAM%20Wheels%2C%20Patna."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "linear-gradient(180deg, #1DA851 0%, #15803D 100%)",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    letterSpacing: "-0.01em",
                    boxShadow: "0 4px 14px rgba(21, 128, 61, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    textAlign: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </motion.a>
              </div>

              {/* Secondary Directions Action */}
              <motion.a
                href="https://maps.google.com/?q=SAM+Wheels+Bosch+Car+Service+Patna+Bihar"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 18px",
                  borderRadius: 10,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.2s ease",
                }}
              >
                <MaterialSymbol name="near_me" size={16} fill color="#0066FF" />
                <span>Get Directions via Google Maps</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Map Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--border)",
                position: "relative",
                boxShadow: "0 14px 38px rgba(0, 0, 0, 0.06)",
                flex: 1,
                minHeight: 460,
              }}
              className="contact-map"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.585721867909!2d85.0783003!3d25.6082862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5761f3c3eedd%3A0xe0ec48051c1df5d1!2sBosch%20Car%20Service%20-%20SAM%20Wheels%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: 460 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SAM Wheels Bosch Car Service Location Map"
              />
              
              {/* Map Floating Location Pill */}
              <div
                style={{
                  position: "absolute",
                  top: 14, left: 14,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "8px 14px",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MaterialSymbol name="location_on" size={18} fill color="#E2001A" />
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text)" }}>
                    SAM Wheels · Bosch Car Service
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    Ashiana–Digha Road, Patna
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
