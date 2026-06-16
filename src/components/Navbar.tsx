"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Menu, X, Wrench } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

// Links with isPage=true go to a new route; isPage=false scroll within the homepage
const NAV_LINKS = [
  { label: "Home",             href: "/",                 isPage: true  },
  { label: "Services",         href: "/#services",        isPage: false },
  { label: "Bosch Advantage",  href: "/bosch-advantage",  isPage: true  },
  { label: "Why Different",    href: "/why-different",    isPage: true  },
  { label: "Sustainability",   href: "/sustainability",   isPage: true  },
  { label: "Gallery",          href: "/gallery",          isPage: true  },
  { label: "Booking",          href: "/booking",          isPage: true  },
  { label: "Contact",          href: "/#contact",         isPage: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, link: typeof NAV_LINKS[0]) => {
    e.preventDefault();
    setMenuOpen(false);

    if (!link.isPage) {
      // Anchor link — if already on home, scroll; else navigate then scroll
      const anchor = link.href.split("#")[1];
      if (pathname === "/") {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(link.href);
      }
    } else {
      router.push(link.href);
    }
  };

  const isActive = (link: typeof NAV_LINKS[0]) => {
    if (link.href === "/") return pathname === "/";
    return pathname.startsWith(link.href.split("#")[0]) && link.href !== "/";
  };

  return (
    <>
      <motion.nav
        id="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "var(--navbar-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid var(--glass-border)" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          {/* Logo */}
          <motion.a
            href="/"
            onClick={(e) => handleNavClick(e, NAV_LINKS[0])}
            whileHover={{ scale: 1.02 }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--bosch-red)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px var(--bosch-red-glow)",
                flexShrink: 0,
              }}
            >
              <Wrench size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.06em", color: "var(--text)", lineHeight: 1.1, fontFamily: "Outfit, sans-serif" }}>
                BOSCH CAR SERVICE
              </div>
              <div style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.12em", color: "var(--accent)", lineHeight: 1, textTransform: "uppercase" }}>
                SAM Wheels Pvt Ltd
              </div>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} link={link} active={isActive(link)} onClick={handleNavClick} />
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="hidden-mobile">
              <ThemeToggle />
            </div>
            <motion.a
              href="tel:+919028384499"
              className="hidden-mobile"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "var(--bosch-red)", color: "white",
                padding: "9px 20px", borderRadius: 7,
                fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.04em",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 0 20px var(--bosch-red-glow)",
              }}
            >
              <Phone size={14} />
              Book Service
            </motion.a>

            {/* Mobile hamburger */}
            <motion.button
              className="show-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none", border: "1px solid var(--border)", borderRadius: 6,
                padding: "6px 8px", cursor: "pointer", color: "var(--text)",
                display: "flex", alignItems: "center",
              }}
              whileTap={{ scale: 0.9 }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", top: 72, left: 0, right: 0, zIndex: 999,
          background: "var(--navbar-bg)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--glass-border)", overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 24px 24px" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "13px 0",
                borderBottom: "1px solid var(--border)",
                color: isActive(link) ? "var(--accent)" : "var(--text)",
                fontSize: "0.95rem", fontWeight: isActive(link) ? 700 : 500,
                cursor: "pointer", fontFamily: "Inter, sans-serif",
                textDecoration: "none",
              }}
            >
              {link.label}
              {isActive(link) && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "block" }} />
              )}
            </a>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <ThemeToggle />
            <a
              href="tel:+919028384499"
              style={{
                flex: 1, background: "var(--bosch-red)", color: "white",
                padding: "11px 20px", borderRadius: 7, fontWeight: 600,
                fontSize: "0.9rem", textDecoration: "none", textAlign: "center",
              }}
            >
              Book Service
            </a>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({
  link, active, onClick,
}: {
  link: typeof NAV_LINKS[0];
  active: boolean;
  onClick: (e: React.MouseEvent, link: typeof NAV_LINKS[0]) => void;
}) {
  return (
    <motion.a
      href={link.href}
      onClick={(e) => onClick(e, link)}
      style={{
        background: "none", border: "none",
        color: active ? "var(--text)" : "var(--text-secondary)",
        fontSize: "0.82rem", fontWeight: active ? 600 : 500,
        padding: "6px 12px", borderRadius: 6,
        cursor: "pointer", position: "relative",
        fontFamily: "Inter, sans-serif", letterSpacing: "0.01em",
        textDecoration: "none", display: "inline-block",
        transition: "color 0.2s ease",
      }}
      whileHover={{ color: "var(--text)" }}
    >
      {link.label}
      <motion.div
        style={{
          position: "absolute", bottom: 2, left: "50%",
          height: 2, background: "var(--accent)", borderRadius: 1, originX: 0.5,
        }}
        initial={{ width: active ? "60%" : 0, x: "-50%" }}
        animate={{ width: active ? "60%" : 0, x: "-50%" }}
        whileHover={{ width: "60%", x: "-50%" }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
}
