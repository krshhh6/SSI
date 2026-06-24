"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Menu, X, Wrench, LogIn, User, LogOut, CalendarDays, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

type NavLinkDef = {
  label: string;
  href: string;
  isPage: boolean;
  dropdown?: Omit<NavLinkDef, "dropdown">[];
};

// Links with isPage=true go to a new route; isPage=false scroll within the homepage
const NAV_LINKS: NavLinkDef[] = [
  { label: "Home",             href: "/",                 isPage: true  },
  { label: "Services",         href: "/#services",        isPage: false },
  { label: "Bosch Advantage",  href: "/bosch-advantage",  isPage: true  },
  { 
    label: "About", 
    href: "#", 
    isPage: false,
    dropdown: [
      { label: "Why Different",    href: "/why-different",    isPage: true  },
      { label: "Sustainability",   href: "/sustainability",   isPage: true  },
      { label: "Gallery",          href: "/gallery",          isPage: true  },
    ]
  },
  { label: "Booking",          href: "/booking",          isPage: true  },
  { label: "Contact",          href: "/#contact",         isPage: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, link: Omit<NavLinkDef, "dropdown">) => {
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

  const isActive = (link: Omit<NavLinkDef, "dropdown">) => {
    if (link.href === "/") return pathname === "/";
    if (!link.isPage) return false;
    return pathname.startsWith(link.href);
  };

  return (
    <>
      <motion.nav
        id="navbar"
        data-theme={(pathname === "/" && !scrolled) ? "dark" : undefined}
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
            <img 
              src="/bosch-logo.png" 
              alt="Bosch Service Logo" 
              style={{ 
                height: 42, 
                width: "auto", 
                objectFit: "contain",
                background: "white", 
                padding: "3px 6px",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }} 
            />
            <div style={{ whiteSpace: "nowrap" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.06em", color: "var(--text)", lineHeight: 1.1, fontFamily: "Outfit, sans-serif", textTransform: "uppercase" }}>
                BOSCH CAR SERVICE
              </div>
              <div style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.12em", color: "var(--accent)", lineHeight: 1, textTransform: "uppercase", marginTop: 2 }}>
                SAM Wheels Pvt Ltd
              </div>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
            {NAV_LINKS.map((link) => {
              if (link.dropdown) {
                const isDropdownActive = link.dropdown.some(sublink => isActive(sublink));
                return (
                  <NavDropdown key={link.label} link={link} active={isDropdownActive} onClick={handleNavClick} />
                );
              }
              return (
                <NavLink key={link.href} link={link} active={isActive(link)} onClick={handleNavClick} />
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ThemeToggle />
            </div>

            {/* Auth button — desktop */}
            {user ? (
              <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.button
                  onClick={() => router.push("/my-bookings")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(0,102,255,0.08)",
                    border: "1px solid rgba(0,102,255,0.25)",
                    color: "var(--accent)", padding: "9px 16px", borderRadius: 7,
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.02em",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <User size={14} />
                  )}
                  My Bookings
                </motion.button>
                <motion.button
                  onClick={async () => { await logout(); router.push("/"); }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(226,0,26,0.08)",
                    border: "1px solid rgba(226,0,26,0.20)",
                    color: "#0066FF", padding: "9px 14px", borderRadius: 7,
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <LogOut size={14} />
                </motion.button>
              </div>
            ) : (
              <motion.button
                className="hidden-mobile"
                onClick={() => router.push("/sign-in")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text)", padding: "9px 16px", borderRadius: 7,
                  cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.02em",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <LogIn size={14} />
                Sign In
              </motion.button>
            )}

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
        <div style={{ padding: "16px 24px 24px", maxHeight: "calc(100vh - 72px)", overflowY: "auto" }}>
          {NAV_LINKS.map((link) => {
            if (link.dropdown) {
              return (
                <div key={link.label}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: "13px 0",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      fontSize: "0.95rem", fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {link.label}
                  </div>
                  <div style={{ paddingLeft: 16 }}>
                    {link.dropdown.map((sublink) => (
                      <a
                        key={sublink.href}
                        href={sublink.href}
                        onClick={(e) => handleNavClick(e, sublink)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", padding: "10px 0",
                          borderBottom: "1px solid var(--border)",
                          color: isActive(sublink) ? "var(--accent)" : "var(--text)",
                          fontSize: "0.9rem", fontWeight: isActive(sublink) ? 700 : 500,
                          cursor: "pointer", fontFamily: "Inter, sans-serif",
                          textDecoration: "none",
                        }}
                      >
                        {sublink.label}
                        {isActive(sublink) && (
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "block" }} />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
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
            );
          })}

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {user ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setMenuOpen(false); router.push("/my-bookings"); }}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.25)",
                    color: "var(--accent)", padding: "11px 16px", borderRadius: 7,
                    fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter, sans-serif",
                  }}
                >
                  <CalendarDays size={16} /> My Bookings
                </button>
                <button
                  onClick={async () => { setMenuOpen(false); await logout(); router.push("/"); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "rgba(226,0,26,0.08)", border: "1px solid rgba(226,0,26,0.2)",
                    color: "#0066FF", padding: "11px 16px", borderRadius: 7,
                    fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter, sans-serif",
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); router.push("/sign-in"); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text)", padding: "11px 20px", borderRadius: 7,
                  fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
              >
                <LogIn size={16} /> Sign In
              </button>
            )}

            <a
              href="tel:+919028384499"
              style={{
                flex: 1, background: "var(--bosch-red)", color: "white",
                padding: "11px 20px", borderRadius: 7, fontWeight: 600,
                fontSize: "0.9rem", textDecoration: "none", textAlign: "center",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
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
  link: Omit<NavLinkDef, "dropdown">;
  active: boolean;
  onClick: (e: React.MouseEvent, link: Omit<NavLinkDef, "dropdown">) => void;
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

function NavDropdown({
  link, active, onClick,
}: {
  link: NavLinkDef;
  active: boolean;
  onClick: (e: React.MouseEvent, link: Omit<NavLinkDef, "dropdown">) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div 
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        style={{
          background: "none", border: "none",
          color: active ? "var(--text)" : "var(--text-secondary)",
          fontSize: "0.82rem", fontWeight: active ? 600 : 500,
          padding: "6px 12px", borderRadius: 6,
          cursor: "pointer", position: "relative",
          fontFamily: "Inter, sans-serif", letterSpacing: "0.01em",
          display: "flex", alignItems: "center", gap: 4,
          transition: "color 0.2s ease",
        }}
      >
        {link.label}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10, pointerEvents: open ? "auto" : "none" }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 8,
          minWidth: 160,
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          zIndex: 100,
        }}
      >
        {link.dropdown?.map((sublink) => (
          <a
            key={sublink.href}
            href={sublink.href}
            onClick={(e) => onClick(e, sublink)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.2s",
              display: "block",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {sublink.label}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
