"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, Menu, X, LogIn, User, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

type NavLinkDef = {
  label: string;
  href: string;
  isPage: boolean;
};

const NAV_LINKS: NavLinkDef[] = [
  { label: "Home",            href: "/",                isPage: true  },
  { label: "Services",        href: "/#services",       isPage: false },
  { label: "Bosch Advantage", href: "/bosch-advantage", isPage: true  },
  { label: "About",           href: "/why-different",   isPage: true  },
  { label: "Blog",            href: "/blog",            isPage: true  },
  { label: "Booking",         href: "/booking",         isPage: true  },
  { label: "Contact",         href: "/#contact",        isPage: false },
];

function CartButton() {
  const { cartCount } = useCart();
  return (
    <button
      aria-label="View cart"
      style={{
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#374151",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
        (e.currentTarget as HTMLButtonElement).style.color = "#E2001A";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = "#374151";
      }}
      onClick={() => {
        // TODO: open cart drawer or navigate to /cart page
      }}
    >
      <ShoppingCart size={20} strokeWidth={2} />
      {cartCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 18,
            height: 18,
            borderRadius: 9999,
            background: "#E2001A",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkDef) => {
    if (!link.isPage) {
      e.preventDefault();
      setMenuOpen(false);
      const anchor = link.href.split("#")[1];
      if (pathname === "/") {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(link.href);
      }
    }
  };

  const isActive = (link: NavLinkDef) => {
    if (link.href === "/") return pathname === "/";
    if (!link.isPage) return false;
    return pathname.startsWith(link.href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-navbar h-[var(--navbar-height)] px-6 flex items-center justify-between">
        {/* LOGO SECTION (left) */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e as any, NAV_LINKS[0])}
          className="navbar-logo-block flex items-center gap-3 max-w-[220px] shrink-0 no-underline"
        >
          <img
            src="/bosch-logo.png"
            alt="Bosch Logo"
            className="w-10 h-10 object-contain rounded shrink-0 bg-white"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-extrabold leading-tight text-gray-900 truncate">
              BOSCH CAR SERVICE
            </span>
            <span className="text-[11px] font-medium text-gray-500 tracking-wide truncate">
              SAM Wheels Pvt Ltd
            </span>
          </div>
        </Link>

        {/* NAV LINKS (center) */}
        <nav className="hidden lg:flex items-center gap-6 flex-nowrap">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative px-3 text-[15px] whitespace-nowrap inline-flex items-center no-underline transition-colors ${
                  active
                    ? "font-semibold text-brand-red"
                    : "font-medium text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className="relative inline-flex items-center py-1">
                  {link.label}
                  {active && (
                    <span className="absolute top-[calc(100%+8px)] left-0 right-0 h-[2px] bg-brand-red rounded-full" />
                  )}
                </span>
              </a>
            );
          })}
        </nav>

        {/* RIGHT SECTION (desktop) */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          {/* Cart Button */}
          <CartButton />

          {/* Sign In / Account Link */}
          {user ? (
            <button
              onClick={() => router.push("/my-bookings")}
              className="flex items-center gap-1.5 text-[15px] font-medium text-gray-700 hover:text-brand-red transition-colors shrink-0 bg-transparent border-0 cursor-pointer p-0"
            >
              <User className="w-4 h-4 shrink-0" />
              <span>My Bookings</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/sign-in")}
              className="flex items-center gap-1.5 text-[15px] font-medium text-gray-700 hover:text-brand-red transition-colors shrink-0 bg-transparent border-0 cursor-pointer p-0"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Sign In</span>
            </button>
          )}

          {/* Book Service Button */}
          <a
            href="tel:+919028384499"
            className="h-11 px-5 rounded-lg bg-brand-red text-white font-bold text-[15px] flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity no-underline"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span>Book Service</span>
          </a>
        </div>

        {/* MOBILE CONTROLS (below lg breakpoint) */}
        <div className="lg:hidden flex items-center gap-3">
          <CartButton />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-700 hover:text-brand-red hover:bg-gray-100 focus:outline-none transition-colors bg-transparent border border-gray-200 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[var(--navbar-height)] left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 p-6 flex flex-col gap-4 max-h-[calc(100vh-var(--navbar-height))] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-3 text-[15px] font-medium rounded-lg transition-colors flex items-center justify-between no-underline ${
                    active
                      ? "font-semibold text-brand-red bg-red-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
                </a>
              );
            })}
          </div>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/my-bookings");
                }}
                className="flex items-center justify-center gap-1.5 text-[15px] font-medium text-gray-700 bg-gray-100 py-2.5 rounded-lg hover:bg-gray-200 transition-colors w-full border-0 cursor-pointer"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>My Bookings</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/sign-in");
                }}
                className="flex items-center justify-center gap-1.5 text-[15px] font-medium text-gray-700 bg-gray-100 py-2.5 rounded-lg hover:bg-gray-200 transition-colors w-full border-0 cursor-pointer"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Sign In</span>
              </button>
            )}
            <a
              href="tel:+919028384499"
              className="h-11 px-5 rounded-lg bg-brand-red text-white font-bold text-[15px] flex items-center justify-center gap-2 shrink-0 hover:opacity-90 transition-opacity no-underline w-full"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>Book Service</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
