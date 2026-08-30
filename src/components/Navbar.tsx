"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { SERVICE_CATEGORIES } from "@/lib/servicesData";
import {
  Search,
  ShoppingCart,
  Menu,
  Book,
  Palette,
  GraduationCap,
  History,
  Users,
  LayoutDashboard,
  Sparkles,
  Boxes,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

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
        icon: <Boxes className="size-4 text-[#E2001A]" />,
        url: "/services/car-services",
      },
      {
        title: "AC Service & Repair",
        description: "Cooling diagnostics, refrigerant recharge & evaporator deep clean",
        icon: <LayoutDashboard className="size-4 text-[#E2001A]" />,
        url: "/services/ac-service",
      },
      {
        title: "Batteries & Electrical",
        description: "Genuine Bosch batteries with free testing & warranty",
        icon: <Sparkles className="size-4 text-[#E2001A]" />,
        url: "/services/batteries",
      },
      {
        title: "Denting & Painting",
        description: "Grade-A paint booth, flawless color match & scratch removal",
        icon: <Palette className="size-4 text-[#E2001A]" />,
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
        icon: <Book className="size-4 text-[#E2001A]" />,
        url: "/bosch-advantage",
      },
      {
        title: "About Us",
        description: "Certified technicians and advanced diagnostic equipment",
        icon: <Users className="size-4 text-[#E2001A]" />,
        url: "/why-different",
      },
      {
        title: "Booking Guide",
        description: "Simple step-by-step appointment & doorstep pickup",
        icon: <GraduationCap className="size-4 text-[#E2001A]" />,
        url: "/booking",
      },
      {
        title: "Blog & Tips",
        description: "Expert car care tips and maintenance advice",
        icon: <History className="size-4 text-[#E2001A]" />,
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
      if (pathname === "/") {
        if (e) e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }
    if (url.startsWith("/#")) {
      if (e) e.preventDefault();
      const anchor = url.split("#")[1];
      if (pathname === "/") {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(url);
      }
      return;
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#F4F7F9',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        height: 60,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ── 3-column layout: Logo | Center Nav | Right Actions ── */}
      <div ref={navRef} className="navbar-container px-4 sm:px-6 lg:px-8">

        {/* LEFT — Logo & Brand Text */}
        <div className="navbar-logo-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Link
            href="/"
            onClick={(e) => handleLinkClick("/", e)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, cursor: 'pointer' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, padding: 4, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image
                width={34}
                height={34}
                src="/bosch-logo.png"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                alt="Bosch Car Service"
                priority
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.25, color: '#0f172a', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                BOSCH CAR SERVICE
              </span>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap', marginTop: 1 }}>
                SAM Wheels Pvt Ltd
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER — Desktop Navigation */}
        <nav className="hidden lg:flex items-center" style={{ gap: 2 }}>
          {MENU_ITEMS.map((item) => {
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
                      gap: 5,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: isOpen ? '#0f172a' : '#334155',
                      padding: '6px 12px',
                      background: isOpen ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
                      border: 0,
                      borderRadius: 8,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.color = '#0f172a';
                      el.style.background = 'rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      if (!isOpen) {
                        el.style.color = '#334155';
                        el.style.background = 'transparent';
                      }
                    }}
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      size={13}
                      style={{
                        color: isOpen ? '#0f172a' : '#64748b',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {/* Dropdown Card */}
                  {isOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 8, zIndex: 50 }}>
                      <div style={{ width: 360, borderRadius: 16, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.08)', padding: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              onClick={() => setActiveDropdown(null)}
                              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 10, borderRadius: 12, textDecoration: 'none', transition: 'background 0.15s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(226,0,26,0.06)', border: '1px solid rgba(226,0,26,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                {subItem.icon}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                                  {subItem.title}
                                </span>
                                {subItem.description && (
                                  <span style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>
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

            const isCurrent = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={(e) => handleLinkClick(item.url, e)}
                style={{
                  fontSize: 13.5,
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? '#E2001A' : '#334155',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 8,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  background: isCurrent ? 'rgba(226, 0, 26, 0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = isCurrent ? '#E2001A' : '#0f172a';
                  el.style.background = isCurrent ? 'rgba(226, 0, 26, 0.12)' : 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = isCurrent ? '#E2001A' : '#334155';
                  el.style.background = isCurrent ? 'rgba(226, 0, 26, 0.08)' : 'transparent';
                }}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT — Actions (desktop only) */}
        <div className="hidden lg:flex items-center" style={{ gap: 8, justifyContent: 'flex-end' }}>
          {/* Search Button */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            style={{ width: 34, height: 34, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', transition: 'color 0.15s, background 0.15s', flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Search size={16} strokeWidth={2} />
          </button>

          {/* Thin separator */}
          <div style={{ width: 1, height: 18, background: 'rgba(0, 0, 0, 0.12)', flexShrink: 0 }} />

          {/* Auth */}
          {user ? (
            <Link
              href="/my-bookings"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid rgba(0, 0, 0, 0.12)', background: '#ffffff', color: '#0f172a', borderRadius: 7, padding: '0 12px', fontSize: 12.5, fontWeight: 600, textDecoration: 'none', height: 32, whiteSpace: 'nowrap', transition: 'all 0.15s', outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(0, 0, 0, 0.25)'; el.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(0, 0, 0, 0.12)'; el.style.background = '#ffffff'; }}
            >
              <User size={13} strokeWidth={2} />
              <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName || 'Account'}</span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 0, 0, 0.12)', background: '#ffffff', color: '#0f172a', borderRadius: 7, padding: '0 14px', fontSize: 12.5, fontWeight: 600, textDecoration: 'none', height: 32, whiteSpace: 'nowrap', transition: 'all 0.15s', outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(0, 0, 0, 0.25)'; el.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(0, 0, 0, 0.12)'; el.style.background = '#ffffff'; }}
            >
              Sign In
            </Link>
          )}

          {/* Book Service CTA — filled red pill */}
          <Link
            href="/booking"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#E2001A', color: '#ffffff', border: 'none', outline: 'none', borderRadius: 7, padding: '0 16px', fontSize: 12.5, fontWeight: 700, textDecoration: 'none', height: 32, whiteSpace: 'nowrap', letterSpacing: '0.01em', transition: 'background 0.15s', boxShadow: '0 2px 8px rgba(226,0,26,0.35)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#c0001a'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E2001A'; }}
          >
            Book Service
          </Link>
        </div>

        {/* MOBILE TRIGGER & ACTIONS — shown only on < lg */}
        <div className="navbar-mobile-actions flex lg:hidden items-center" style={{ gap: 6, justifyContent: 'flex-end' }}>
          {/* Search Button */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', background: 'transparent', border: 0, cursor: 'pointer' }}
          >
            <Search size={17} />
          </button>

          {/* User Account Icon Button */}
          <Link
            href={user ? "/my-bookings" : "/sign-in"}
            aria-label={user ? "Account" : "Sign In"}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: user ? '#E2001A' : '#334155', background: 'transparent', border: 0, textDecoration: 'none' }}
          >
            <User size={18} strokeWidth={2} />
          </Link>

          {/* Book Service Quick Button */}
          <Link
            href="/booking"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#E2001A', color: '#ffffff', border: 'none', outline: 'none', borderRadius: 7, padding: '0 12px', fontSize: 11.5, fontWeight: 700, textDecoration: 'none', height: 30, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(226,0,26,0.3)' }}
          >
            Book
          </Link>

          {/* Mobile Menu Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', background: 'transparent', border: 0, cursor: 'pointer' }}
              >
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent
              style={{ overflowY: 'auto', width: '85vw', maxWidth: 384, background: '#F4F7F9', color: '#0f172a', borderLeft: '1px solid rgba(0,0,0,0.08)', padding: 24 }}
            >
              <SheetHeader>
                <SheetTitle style={{ textAlign: 'left' }}>
                  <Link
                    href="/"
                    onClick={(e) => handleLinkClick("/", e)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 6, padding: 3, background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Image
                        width={32}
                        height={32}
                        src="/bosch-logo.png"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        alt="Bosch Car Service"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>BOSCH CAR SERVICE</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const }}>SAM Wheels</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div style={{ marginTop: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                  {MENU_ITEMS.map((item) => {
                    if (item.items) {
                      return (
                        <AccordionItem key={item.title} value={item.title} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                          <AccordionTrigger style={{ padding: '10px 0', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent style={{ marginTop: 4, paddingBottom: 8 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 8 }}>
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  style={{ display: 'flex', gap: 12, borderRadius: 8, padding: 10, textDecoration: 'none', color: '#334155', transition: 'background 0.15s' }}
                                  href={subItem.url}
                                  onClick={() => setSheetOpen(false)}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                  <div style={{ marginTop: 2 }}>{subItem.icon}</div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{subItem.title}</div>
                                    {subItem.description && (
                                      <p style={{ fontSize: 11, lineHeight: 1.4, color: '#64748b', marginTop: 2, marginBottom: 0 }}>
                                        {subItem.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    }

                    return (
                      <div key={item.title} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <Link
                          href={item.url}
                          onClick={(e) => handleLinkClick(item.url, e)}
                          style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', padding: '10px 0', textDecoration: 'none', display: 'block' }}
                        >
                          {item.title}
                        </Link>
                      </div>
                    );
                  })}
                </Accordion>

                {/* Extra Quick Links */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 8 }}>Quick Navigation</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {MOBILE_EXTRA_LINKS.map((link, idx) => (
                      <Link
                        key={idx}
                        style={{ display: 'inline-flex', height: 32, alignItems: 'center', borderRadius: 6, padding: '0 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none', transition: 'background 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                        href={link.url}
                        onClick={(e) => handleLinkClick(link.url, e)}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth and Action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
                  {user ? (
                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                      <Link
                        href="/my-bookings"
                        onClick={() => setSheetOpen(false)}
                        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid rgba(0,0,0,0.12)', color: '#0f172a', borderRadius: 8, height: 38, fontSize: 12.5, fontWeight: 600, textDecoration: 'none', background: '#ffffff', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                      >
                        <User size={14} />
                        <span style={{ whiteSpace: 'nowrap' }}>Account</span>
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          await logout();
                          setSheetOpen(false);
                        }}
                        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid rgba(226,0,26,0.3)', color: '#E2001A', borderRadius: 8, height: 38, fontSize: 12.5, fontWeight: 600, background: 'rgba(226,0,26,0.06)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        <LogOut size={14} />
                        <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setSheetOpen(false)}
                      style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.12)', color: '#0f172a', borderRadius: 8, height: 38, fontSize: 12.5, fontWeight: 600, textDecoration: 'none', background: '#ffffff', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    >
                      Sign In
                    </Link>
                  )}
                  <Link
                    href="/booking"
                    onClick={() => setSheetOpen(false)}
                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#E2001A', color: '#ffffff', borderRadius: 8, height: 38, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', border: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(226,0,26,0.35)' }}
                  >
                    Book Service Now
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
            <CommandItem
              onSelect={() => {
                setOpenSearch(false);
                router.push("/booking");
              }}
            >
              <span>Book a Service Appointment</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpenSearch(false);
                router.push("/bosch-advantage");
              }}
            >
              <span>Why Choose SAM Wheels Bosch Workshop</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpenSearch(false);
                router.push("/why-different");
              }}
            >
              <span>About Bosch SAM Wheels Patna</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpenSearch(false);
                router.push("/blog");
              }}
            >
              <span>Expert Car Care Blog & Maintenance Tips</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
