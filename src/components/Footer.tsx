"use client";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Phone, MessageCircle, Award, ArrowUp } from "lucide-react";

const QUICK_LINKS = ["Home", "Services", "Bosch Advantage", "Blog", "Reviews", "Gallery", "Contact", "Privacy Policy"];
const SERVICES_LIST = [
  { label: "Periodic Maintenance", href: "/blog#periodic-maintenance" },
  { label: "Engine Diagnostics", href: "/blog#engine-diagnostics" },
  { label: "Dent & Paint", href: "/blog#dent-and-paint" },
  { label: "AC Service", href: "/blog#ac-service" },
  { label: "Wheel Alignment", href: "/blog#wheel-alignment" },
  { label: "Car Detailing", href: "/blog#car-detailing" },
  { label: "Insurance Claims", href: "/blog#insurance-claims" },
];

// Social media icons as inline SVG paths (lucide-react doesn't include brand icons)
const SOCIAL = [
  {
    label: "Instagram", href: "https://www.instagram.com/samwheelsofficial/", color: "#E1306C",
    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  },
  {
    label: "Facebook", href: "https://www.facebook.com/p/Sam-Wheels-Pvt-Ltd-100085225728801/", color: "#1877F2",
    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  },
  {
    label: "YouTube", href: "#", color: "#FF0000",
    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
  },
  {
    label: "Twitter / X", href: "#", color: "#1DA1F2",
    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleQuickLinkClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    if (link === "Home") {
      if (pathname === "/") scrollToTop();
      else router.push("/");
      return;
    }
    if (link === "Blog") {
      router.push("/blog");
      return;
    }
    if (link === "Bosch Advantage") {
      router.push("/bosch-advantage");
      return;
    }
    if (link === "Gallery") {
      router.push("/gallery");
      return;
    }
    if (link === "Privacy Policy") {
      router.push("/privacy-policy");
      return;
    }

    const anchor = link.toLowerCase().replace(/\s+/g, "-");
    if (pathname === "/") {
      document.querySelector(`#${anchor}`)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${anchor}`);
    }
  };

  return (
    <footer style={{
        background: "var(--bg-footer)",
        borderTop: "1px solid var(--border)",
        paddingTop: 80,
        position: "relative",
        overflow: "hidden",
      }}>
      {/* Ambient */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 600, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0, 102, 255, 0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Footer Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "72px 24px 48px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: 48,
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--bosch-red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px var(--bosch-red-glow)",
                }}
              >
                <Award size={20} color="white" strokeWidth={2} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    color: "var(--text)",
                    lineHeight: 1.1,
                  }}
                >
                  BOSCH CAR SERVICE
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                  }}
                >
                  SAM Wheels Pvt Ltd
                </div>
              </div>
            </div>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                lineHeight: 1.75,
                marginBottom: 24,
                maxWidth: 260,
              }}
            >
              Patna&apos;s trusted Bosch Authorized Multi-Brand Car Service Center. Delivering international quality standards since 2009.
            </p>

            {/* Bosch Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid rgba(226, 0, 26, 0.3)",
                background: "rgba(226, 0, 26, 0.06)",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: "1rem" }}>🏆</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0066FF", letterSpacing: "0.06em" }}>
                Bosch Authorized Workshop
              </span>
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIAL.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, color: s.color }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s.svg}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: 20,
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <motion.a
                    href={link === "Home" ? "/" : link === "Blog" ? "/blog" : link === "Bosch Advantage" ? "/bosch-advantage" : link === "Gallery" ? "/gallery" : `/#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={(e) => handleQuickLinkClick(e, link)}
                    whileHover={{ x: 4, color: "var(--accent)" }}
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      display: "inline-block",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: 20,
              }}
            >
              Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {SERVICES_LIST.map((s) => (
                <li key={s.label}>
                  <motion.a
                    href={s.href}
                    whileHover={{ x: 4, color: "var(--accent)" }}
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      display: "inline-block",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {s.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: 20,
              }}
            >
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Opp. Passport Office,<br />
                Akashvani Lane,<br />
                Ashiana–Digha Road,<br />
                Patna, Bihar 800014
              </div>
              <a
                href="tel:+919028384499"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <Phone size={14} />
                +91 90283 84499
              </a>
              <a
                href="https://wa.me/919028384499"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#25D366",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <MessageCircle size={14} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 24px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © 2024 SAM Wheels Pvt Ltd · Bosch Car Service, Patna · All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Privacy Policy</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Terms of Service</span>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--accent)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px var(--accent-glow)",
              }}
            >
              <ArrowUp size={16} color="white" />
            </motion.button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
