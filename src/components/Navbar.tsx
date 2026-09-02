"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { SERVICE_CATEGORIES } from "@/lib/servicesData";
import MaterialSymbol from "./core/MaterialSymbol";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
  { title: "Home", url: "/" },
  {
    title: "Services",
    url: "/services",
    items: [
      {
        title: "Periodic Maintenance",
        description: "Comprehensive oil, filter, and multi-point inspections",
        icon: <MaterialSymbol name="build" size={17} fill color="#008ECF" />,
        url: "/services/car-services",
      },
      {
        title: "AC Service & Repair",
        description: "Cooling diagnostics, refrigerant recharge & evaporator deep clean",
        icon: <MaterialSymbol name="ac_unit" size={17} fill color="#0066FF" />,
        url: "/services/ac-service",
      },
      {
        title: "Batteries & Electrical",
        description: "Genuine Bosch batteries with free testing & warranty",
        icon: <MaterialSymbol name="bolt" size={17} fill color="#F59E0B" />,
        url: "/services/batteries",
      },
      {
        title: "Denting & Painting",
        description: "Grade-A paint booth, flawless color match & scratch removal",
        icon: <MaterialSymbol name="format_paint" size={17} fill color="#10B981" />,
        url: "/services/denting-painting",
      },
    ],
  },
  {
    title: "Company",
    url: "#",
    items: [
      {
        title: "Bosch Advantage",
        description: "Why SAM Wheels Bosch certified workshop leads the industry",
        icon: <MaterialSymbol name="verified" size={17} fill color="#008ECF" />,
        url: "/bosch-advantage",
      },
      {
        title: "About Us",
        description: "Certified technicians and advanced diagnostic equipment",
        icon: <MaterialSymbol name="domain" size={17} fill color="#0066FF" />,
        url: "/why-different",
      },
      {
        title: "Booking Guide",
        description: "Simple step-by-step appointment & doorstep pickup",
        icon: <MaterialSymbol name="calendar_month" size={17} fill color="#008ECF" />,
        url: "/booking",
      },
      {
        title: "Blog & Tips",
        description: "Expert car care tips and maintenance advice",
        icon: <MaterialSymbol name="article" size={17} fill color="#0066FF" />,
        url: "/blog",
      },
    ],
  },
  {
    title: "Booking",
    url: "/booking",
  },
  {
    title: "Blog",
    url: "/blog",
  },
];

const MOBILE_EXTRA_LINKS = [
  { name: "Services", url: "/#services" },
  { name: "Contact", url: "/#contact" },
  { name: "Advantage", url: "/bosch-advantage" },
  { name: "My Bookings", url: "/my-bookings" },
];

export default function Navbar() {
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 25 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 10 && isScrolled) {
      setIsScrolled(false);
    }
  });

  // Close dropdown on click outside or route change
  React.useEffect(() => {
    setSheetOpen(false);
    setOpenSearch(false);
    setActiveDropdown(null);
  }, [pathname]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch((prev) => !prev);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLinkClick = (url: string, e?: React.MouseEvent) => {
    setSheetOpen(false);
    setActiveDropdown(null);

    if (url === "/") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("resetHome"));
      }
      if (pathname === "/") {
        if (e) e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }

    if (url.startsWith("/#") || url.startsWith("#")) {
      if (e) e.preventDefault();
      const anchor = url.replace(/^\/?#/, "");

      const performScroll = () => {
        const el = document.getElementById(anchor);
        if (el) {
          const navOffset = 70;
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      };

      if (pathname === "/") {
        // Wait 60ms for Radix Sheet to unmount overlay and restore body scroll
        setTimeout(performScroll, 60);
      } else {
        router.push(`/#${anchor}`);
      }
      return;
    }
  };

  return (
    <>
      {/* Fixed outer shell — static, pointer-events-none, never animates */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pointerEvents: 'none',
        }}
      >
        {/* Animated capsule — single motion.div, all transitions owned here */}
        <motion.div
          ref={navRef}
          animate={{
            width: isScrolled ? 'min(92%, 1160px)' : '100%',
            y: isScrolled ? 16 : 0,
            borderRadius: isScrolled ? 9999 : 0,
            backdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'blur(0px)',
            backgroundColor: isScrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,1)',
            boxShadow: isScrolled
              ? '0 0 24px rgba(34,42,53,0.06), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(34,42,53,0.04), 0 0 4px rgba(34,42,53,0.08), 0 16px 68px rgba(47,48,55,0.05), inset 0 1px 0 rgba(255,255,255,0.9)'
              : '0 1px 0 rgba(0,0,0,0.08)',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 50, mass: 1 }}
          style={{
            pointerEvents: 'auto',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            overflow: 'visible',
          }}
        >
          {/* Inner layout container */}
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: isScrolled ? 20 : 24,
              paddingRight: isScrolled ? 20 : 24,
            }}
          >

            {/* LEFT — Logo & Brand Text */}
            <div className="navbar-logo-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Link
                href="/"
                prefetch={true}
                onClick={(e) => handleLinkClick("/", e)}
                style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', flexShrink: 0, cursor: 'pointer', touchAction: 'manipulation' }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  padding: 4,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Image
                    width={36}
                    height={36}
                    src="/bosch-logo.png"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    alt="Bosch Car Service"
                    priority
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: 'var(--text)',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                  }}>
                    BOSCH CAR SERVICE
                  </span>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#008ECF',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    marginTop: 2,
                  }}>
                    SAM Wheels Pvt Ltd
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER — Desktop Navigation */}
            <nav className="hidden lg:flex items-center" style={{ gap: 4 }}>
              {MENU_ITEMS.map((item) => {
                const isItemActive = item.url !== "#"
                  ? (pathname === item.url || (item.url === "/services" && pathname.startsWith("/services")))
                  : (item.items ? item.items.some(sub => pathname === sub.url || (sub.url.startsWith("/services") && pathname.startsWith("/services"))) : false);

                if (item.items) {
                  const isOpen = activeDropdown === item.title;
                  return (
                    <div
                      key={item.title}
                      style={{ position: 'relative' }}
                      onMouseEnter={() => setActiveDropdown(item.title)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(isOpen ? null : item.title)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.87rem',
                          fontWeight: isItemActive ? 700 : 600,
                          color: isItemActive ? '#008ECF' : (isOpen ? 'var(--text)' : 'var(--text-secondary)'),
                          padding: '7px 13px',
                          background: isOpen ? 'var(--border)' : 'transparent',
                          border: 0,
                          borderRadius: 8,
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.color = isItemActive ? '#008ECF' : 'var(--text)';
                          el.style.background = 'var(--border)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          if (!isOpen) {
                            el.style.color = isItemActive ? '#008ECF' : 'var(--text-secondary)';
                            el.style.background = 'transparent';
                          }
                        }}
                      >
                        <span>{item.title}</span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            opacity: isOpen ? 1 : 0.65,
                          }}
                        >
                          <MaterialSymbol name="expand_more" size={17} />
                        </span>

                        {/* Smooth active pill indicator */}
                        {isItemActive && (
                          <motion.div
                            layoutId="navTabIndicator"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: 9999,
                              background: 'rgba(0, 142, 207, 0.08)',
                              zIndex: -1,
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Dropdown Card */}
                      {isOpen && (
                        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 8, zIndex: 100 }}>
                          <div style={{
                            width: 375,
                            borderRadius: 16,
                            background: 'var(--dropdown-bg, #FFFFFF)',
                            border: '1px solid var(--border)',
                            padding: 8,
                            boxShadow: '0 24px 54px -6px rgba(0, 0, 0, 0.22), 0 8px 20px -2px rgba(0, 0, 0, 0.08)',
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.url}
                                  prefetch={true}
                                  onClick={() => setActiveDropdown(null)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    touchAction: 'manipulation',
                                    gap: 12,
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    textDecoration: 'none',
                                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                  }}
                                  onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = 'var(--bg-secondary)';
                                    el.style.transform = 'translateX(2px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = 'transparent';
                                    el.style.transform = 'translateX(0)';
                                  }}
                                >
                                  <div style={{
                                    width: 34, height: 34, borderRadius: 8,
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, marginTop: 1,
                                  }}>
                                    {subItem.icon}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                                      {subItem.title}
                                    </span>
                                    {subItem.description && (
                                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: 2 }}>
                                        {subItem.description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={item.title} style={{ position: 'relative' }}>
                    <Link
                      href={item.url}
                      onClick={(e) => handleLinkClick(item.url, e)}
                      style={{
                        fontSize: '0.87rem',
                        fontWeight: isItemActive ? 700 : 600,
                        color: isItemActive ? '#008ECF' : 'var(--text-secondary)',
                        textDecoration: 'none',
                        padding: '7px 13px',
                        borderRadius: 8,
                        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: '-0.01em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'transparent',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = isItemActive ? '#008ECF' : 'var(--text)';
                        el.style.background = 'var(--border)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = isItemActive ? '#008ECF' : 'var(--text-secondary)';
                        el.style.background = 'transparent';
                      }}
                    >
                      {item.title}
                      {isItemActive && (
                        <motion.div
                          layoutId="navTabIndicator"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 9999,
                            background: 'rgba(0, 142, 207, 0.08)',
                            zIndex: -1,
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* RIGHT — Actions (desktop only) */}
            <div className="hidden lg:flex items-center" style={{ gap: 10, justifyContent: 'flex-end' }}>
              {/* Search Trigger Pill */}
              <button
                type="button"
                onClick={() => setOpenSearch(true)}
                aria-label="Search services"
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.background = 'var(--card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <MaterialSymbol name="search" size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Search</span>
                <kbd style={{
                  fontSize: '0.64rem',
                  padding: '2px 5px',
                  borderRadius: 6,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  lineHeight: 1,
                }}>⌘K</kbd>
              </button>

              {/* Thin separator */}
              <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />

              {/* Auth */}
              {user ? (
                <Link
                  href="/my-bookings"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    border: '1px solid var(--border)', background: 'var(--card)',
                    color: 'var(--text)', borderRadius: 9999, padding: '0 14px',
                    fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                    height: 36, whiteSpace: 'nowrap', transition: 'all 0.18s ease',
                    outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-hover)'; el.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'translateY(0)'; }}
                >
                  <MaterialSymbol name="account_circle" size={17} fill color="var(--accent)" />
                  <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName || 'Account'}</span>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    border: '1px solid var(--border)', background: 'var(--card)',
                    color: 'var(--text)', borderRadius: 9999, padding: '0 15px',
                    fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                    height: 36, whiteSpace: 'nowrap', transition: 'all 0.18s ease',
                    outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-hover)'; el.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'translateY(0)'; }}
                >
                  <MaterialSymbol name="account_circle" size={16} fill color="var(--text-secondary)" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Book Service CTA — Bosch Royal Blue Gradient Pill */}
              <Link
                href="/booking"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'linear-gradient(135deg, #007BC0 0%, #005691 100%)',
                  color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)',
                  outline: 'none', borderRadius: 9999, padding: '0 18px',
                  fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none',
                  height: 36, whiteSpace: 'nowrap', letterSpacing: '-0.01em',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 4px 14px rgba(0,123,192,0.28), inset 0 1px 0 rgba(255,255,255,0.35)',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 20px rgba(0,123,192,0.42), inset 0 1px 0 rgba(255,255,255,0.45)'; el.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 14px rgba(0,123,192,0.28), inset 0 1px 0 rgba(255,255,255,0.35)'; el.style.transform = 'translateY(0)'; }}
              >
                <MaterialSymbol name="calendar_today" size={14} fill color="white" />
                <span>Book Service</span>
              </Link>
            </div>

            {/* MOBILE TRIGGER & ACTIONS — shown only on < lg */}
            <div className="navbar-mobile-actions flex lg:hidden items-center" style={{ gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setOpenSearch(true)}
                aria-label="Search"
                style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', background: 'transparent', border: 0, cursor: 'pointer' }}
              >
                <MaterialSymbol name="search" size={21} />
              </button>

              <Link
                href={user ? "/my-bookings" : "/sign-in"}
                aria-label={user ? "Account" : "Sign In"}
                style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: user ? '#008ECF' : 'var(--text)', background: 'transparent', border: 0, textDecoration: 'none' }}
              >
                <MaterialSymbol name="account_circle" size={22} fill={Boolean(user)} />
              </Link>

              <Link
                href="/booking"
                className="hidden sm:inline-flex"
                style={{
                  alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #005691 0%, #008ECF 100%)',
                  color: '#ffffff', border: 'none', outline: 'none',
                  borderRadius: 7, padding: '0 12px', fontSize: '0.78rem',
                  fontWeight: 800, textDecoration: 'none', height: 31,
                  whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,142,207,0.35)',
                }}
              >
                Book
              </Link>

              {/* Mobile Menu Sheet */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open menu"
                    style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', background: 'transparent', border: 0, cursor: 'pointer', touchAction: 'manipulation' }}
                  >
                    <IconMenu2 size={24} className="text-slate-800" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  style={{
                    overflowY: 'auto', width: '88vw', maxWidth: 390,
                    background: '#FFFFFF', color: '#0F172A',
                    borderLeft: '1px solid #E2E8F0', padding: '24px 20px',
                    boxShadow: '-20px 0 50px rgba(0,0,0,0.12)',
                  }}
                  className="text-slate-900"
                >
                  <motion.div
                    initial="closed"
                    animate={sheetOpen ? "open" : "closed"}
                    variants={{
                      open: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
                      closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                    }}
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', justifyContent: 'space-between' }}
                  >
                    <div>
                      <motion.div
                        variants={{
                          closed: { opacity: 0, x: 20, filter: "blur(4px)" },
                          open: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                        }}
                        style={{ paddingBottom: 18, borderBottom: '1px solid #F1F5F9' }}
                      >
                        <Link
                          href="/"
                          prefetch={true}
                          onClick={(e) => handleLinkClick("/", e)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', touchAction: 'manipulation' }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 9, padding: 4,
                            background: '#F8FAFC', border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <Image width={36} height={36} src="/bosch-logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Bosch Car Service" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.94rem', fontWeight: 900, color: '#0F172A', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                              BOSCH CAR SERVICE
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#008ECF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>SAM WHEELS</span>
                              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
                              <span style={{ fontSize: '0.64rem', fontWeight: 600, color: '#64748B' }}>Patna</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>

                      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {MENU_ITEMS.map((item) => {
                          const isCurrent = pathname === item.url || (item.items && item.items.some(si => pathname === si.url));

                          if (item.items) {
                            return (
                              <motion.div
                                key={item.title}
                                variants={{
                                  closed: { opacity: 0, x: 20, filter: "blur(4px)" },
                                  open: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                                }}
                              >
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value={item.title} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <AccordionTrigger style={{ padding: '12px 0', fontSize: '1.02rem', fontWeight: 700, color: isCurrent ? '#008ECF' : '#0F172A', fontFamily: 'Outfit, sans-serif', touchAction: 'manipulation' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {isCurrent && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#008ECF' }} />}
                                        <span>{item.title}</span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent style={{ marginTop: 4, paddingBottom: 10 }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 4 }}>
                                        {item.items.map((subItem) => (
                                          <Link
                                            key={subItem.title}
                                            prefetch={true}
                                            style={{
                                              display: 'flex', alignItems: 'center', gap: 12,
                                              borderRadius: 8, padding: '8px 10px', textDecoration: 'none',
                                              background: pathname === subItem.url ? 'rgba(0,142,207,0.06)' : '#F8FAFC',
                                              border: `1px solid ${pathname === subItem.url ? 'rgba(0,142,207,0.25)' : '#E2E8F0'}`,
                                              touchAction: 'manipulation',
                                              transition: 'all 0.18s ease',
                                            }}
                                            href={subItem.url}
                                            onClick={() => setSheetOpen(false)}
                                          >
                                            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#008ECF' }}>
                                              {subItem.icon}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>{subItem.title}</div>
                                              {subItem.description && (
                                                <p style={{ fontSize: '0.72rem', lineHeight: 1.3, color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                  {subItem.description}
                                                </p>
                                              )}
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </motion.div>
                            );
                          }

                          return (
                            <motion.div
                              key={item.title}
                              variants={{
                                closed: { opacity: 0, x: 20, filter: "blur(4px)" },
                                open: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                              }}
                              style={{ borderBottom: '1px solid #F1F5F9' }}
                            >
                              <Link
                                href={item.url}
                                prefetch={true}
                                onClick={(e) => handleLinkClick(item.url, e)}
                                style={{
                                  fontSize: '1.02rem', fontWeight: 700,
                                  color: isCurrent ? '#008ECF' : '#0F172A',
                                  fontFamily: 'Outfit, sans-serif', padding: '12px 0',
                                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
                                  touchAction: 'manipulation',
                                  transition: 'color 0.18s ease',
                                }}
                              >
                                {isCurrent && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#008ECF' }} />}
                                <span>{item.title}</span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Workshop Direct Contact Card */}
                      <motion.div
                        variants={{
                          closed: { opacity: 0, x: 20, filter: "blur(4px)" },
                          open: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                        }}
                        style={{
                          marginTop: 18, padding: '12px 14px', borderRadius: 10,
                          background: '#F8FAFC', border: '1px solid #E2E8F0',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748B', textTransform: 'uppercase' }}>Workshop Helpline</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif', marginTop: 2 }}>+91 90283 84499</div>
                        </div>
                        <a
                          href="tel:+919028384499"
                          style={{
                            width: 34, height: 34, borderRadius: 8,
                            background: '#ECFDF5', border: '1px solid #A7F3D0',
                            color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textDecoration: 'none', flexShrink: 0,
                          }}
                        >
                          <MaterialSymbol name="call" size={18} />
                        </a>
                      </motion.div>
                    </div>

                    {/* Bottom Actions */}
                    <motion.div
                      variants={{
                        closed: { opacity: 0, y: 16 },
                        open: { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.25 } },
                      }}
                      style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}
                    >
                      {user ? (
                        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                          <Link
                            href="/my-bookings"
                            onClick={() => setSheetOpen(false)}
                            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: 8, height: 40, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', background: '#F8FAFC' }}
                          >
                            <MaterialSymbol name="account_circle" size={16} fill color="#0F172A" />
                            <span>My Account</span>
                          </Link>
                          <button
                            type="button"
                            onClick={async () => { await logout(); setSheetOpen(false); }}
                            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid rgba(0,142,207,0.25)', color: '#008ECF', borderRadius: 8, height: 40, fontSize: '0.82rem', fontWeight: 700, background: 'rgba(0,142,207,0.06)', cursor: 'pointer' }}
                          >
                            <MaterialSymbol name="logout" size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      ) : (
                        <Link
                          href="/sign-in"
                          onClick={() => setSheetOpen(false)}
                          style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: 8, height: 40, fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none', background: '#F8FAFC', transition: 'all 0.18s ease' }}
                        >
                          Sign In
                        </Link>
                      )}

                      <Link
                        href="/booking"
                        onClick={() => setSheetOpen(false)}
                        style={{
                          width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          background: 'linear-gradient(135deg, #005691 0%, #008ECF 100%)',
                          color: '#ffffff', borderRadius: 8, height: 42, fontSize: '0.86rem', fontWeight: 800,
                          textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,142,207,0.35)', letterSpacing: '0.01em',
                        }}
                      >
                        <MaterialSymbol name="calendar_today" size={16} fill color="#FFFFFF" />
                        <span>Book Service Now</span>
                      </Link>

                      <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 4 }}>
                        <MaterialSymbol name="verified" size={12} fill color="#10B981" />
                        <span>100% Genuine Bosch Parts · Master Technicians</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </motion.div>
      </div>

      {/* SEARCH COMMAND PALETTE (CMD+K) */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search car services, periodic maintenance, batteries, AC..." autoFocus />
        <CommandList>
          <CommandEmpty>No services found matching your search.</CommandEmpty>

          <CommandGroup heading="Service Categories">
            {SERVICE_CATEGORIES.map((cat) => (
              <CommandItem
                key={cat.id}
                onSelect={() => {
                  setOpenSearch(false);
                  router.push(`/services/${cat.id}`);
                }}
              >
                <span>{cat.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => { setOpenSearch(false); router.push("/booking"); }}>
              <span>Book a Service Appointment</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenSearch(false); router.push("/bosch-advantage"); }}>
              <span>Why Choose SAM Wheels Bosch Workshop</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenSearch(false); router.push("/why-different"); }}>
              <span>About Bosch SAM Wheels Patna</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenSearch(false); router.push("/blog"); }}>
              <span>Expert Car Care Blog & Maintenance Tips</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
