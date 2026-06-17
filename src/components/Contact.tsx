"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, MessageCircle, Navigation, Clock, Mail } from "lucide-react";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Background */}
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
          style={{ textAlign: "center", marginBottom: 60 }}
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
            Find Us
          </span>
          <h2 className="display-lg">
            VISIT OUR{" "}
            <span className="gradient-text-blue">SERVICE CENTER</span>
          </h2>
        </motion.div>

        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 40,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Address Card */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 28,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 44, height: 44,
                    borderRadius: 10,
                    background: "rgba(0, 102, 255, 0.12)",
                    border: "1px solid rgba(0, 102, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={20} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 6 }}>Address</div>
                  <div style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.7, fontWeight: 500 }}>
                    Opp. Passport Office,<br />
                    Akashvani Lane,<br />
                    Ashiana–Digha Road,<br />
                    Patna, Bihar 800014
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 28,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  style={{
                    width: 44, height: 44,
                    borderRadius: 10,
                    background: "rgba(226, 0, 26, 0.12)",
                    border: "1px solid rgba(226, 0, 26, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Phone size={20} color="var(--bosch-red)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Phone</div>
                  <a href="tel:+919028384499" style={{ fontSize: "1.1rem", color: "var(--text)", fontWeight: 700, textDecoration: "none" }}>
                    +91 90283 84499
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 28,
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 44, height: 44,
                    borderRadius: 10,
                    background: "rgba(0, 200, 150, 0.12)",
                    border: "1px solid rgba(0, 200, 150, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={20} color="#00C896" />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 6 }}>Working Hours</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 500 }}>
                    Mon – Sat: 9:00 AM – 7:00 PM
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Sunday: 10:00 AM – 4:00 PM
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="contact-actions">
              <motion.a
                href="tel:+919028384499"
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 32px var(--bosch-red-glow)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 24px",
                  borderRadius: 10,
                  background: "var(--bosch-red)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 8px 24px var(--bosch-red-glow)",
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                }}
              >
                <Phone size={17} />
                Call Now
              </motion.a>

              <motion.a
                href="https://wa.me/919028384499?text=Hello%2C%20I%20want%20to%20book%20a%20car%20service%20at%20SAM%20Wheels%2C%20Patna."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 32px rgba(37, 211, 102, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 24px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 8px 24px rgba(37, 211, 102, 0.3)",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                <MessageCircle size={17} />
                WhatsApp Us
              </motion.a>

              <motion.a
                href="https://maps.google.com/?q=SAM+Wheels+Bosch+Car+Service+Patna+Bihar"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.02, 
                  y: -2, 
                  borderColor: "var(--accent)", 
                  color: "var(--accent)", 
                  boxShadow: "0 12px 32px rgba(0, 102, 255, 0.15)" 
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "13px 24px",
                  borderRadius: 10,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s ease",
                }}
              >
                <Navigation size={17} />
                Get Directions
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--border)",
                position: "relative",
              }}
              className="contact-map"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.585721867909!2d85.0783003!3d25.6082862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5761f3c3eedd%3A0xe0ec48051c1df5d1!2sBosch%20Car%20Service%20-%20SAM%20Wheels%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="460"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SAM Wheels Bosch Car Service Location Map"
              />
              {/* Map overlay pin label */}
              <div
                style={{
                  position: "absolute",
                  top: 16, left: 16,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MapPin size={14} color="var(--bosch-red)" />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                  SAM Wheels, Patna
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
