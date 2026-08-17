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
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 hover:text-[#E2001A] hover:bg-gray-100/80 transition-colors bg-transparent border-0 cursor-pointer shrink-0"
      onClick={() => {
        // Future cart drawer trigger
      }}
    >
      <ShoppingCart size={18} strokeWidth={2} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E2001A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
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
    setMenuOpen(false);
    if (link.href === "/") {
      e.preventDefault();
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }
    if (!link.isPage) {
      e.preventDefault();
      const anchor = link.href.split("#")[1];
      if (pathname === "/") {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(link.href);
      }
      return;
    }
    e.preventDefault();
    router.push(link.href);
  };

  const isActive = (link: NavLinkDef) => {
    if (link.href === "/") return pathname === "/";
    if (!link.isPage) return false;
    return pathname.startsWith(link.href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs h-[var(--navbar-height,64px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* LOGO SECTION (Left) */}
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                router.push("/");
              }
            }}
            className="navbar-logo-block flex items-center gap-2.5 shrink-0 no-underline cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg p-1 bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:border-red-200 transition-colors">
              <img
                src="/bosch-logo.png"
                alt="Bosch Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13.5px] sm:text-[14px] font-extrabold leading-tight text-gray-900 tracking-tight whitespace-nowrap">
                BOSCH CAR SERVICE
              </span>
              <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase whitespace-nowrap">
                SAM Wheels Pvt Ltd
              </span>
            </div>
          </Link>

          {/* NAV LINKS (Center Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative px-3 py-1.5 text-[13.5px] whitespace-nowrap inline-flex items-center no-underline rounded-md transition-all ${
                    active
                      ? "font-bold text-[#E2001A] bg-red-50/60"
                      : "font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* RIGHT SECTION (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {/* Cart Button */}
            <CartButton />

            {/* Sign In / My Bookings */}
            {user ? (
              <button
                onClick={() => router.push("/my-bookings")}
                className="flex items-center gap-1.5 text-[13.5px] font-semibold text-gray-700 hover:text-[#E2001A] transition-colors shrink-0 bg-transparent border-0 cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-gray-50"
              >
                <User className="w-4 h-4 shrink-0 text-gray-500" />
                <span>My Bookings</span>
              </button>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="flex items-center gap-1.5 text-[13.5px] font-semibold text-gray-700 hover:text-[#E2001A] transition-colors shrink-0 bg-transparent border-0 cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4 shrink-0 text-gray-500" />
                <span>Sign In</span>
              </button>
            )}

            {/* Book Service CTA Button */}
            <a
              href="tel:+919028384499"
              className="h-9 px-4 rounded-lg bg-[#E2001A] hover:bg-[#c90017] text-white font-bold text-[13px] tracking-wide inline-flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-xs hover:shadow-sm no-underline active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Book Service</span>
            </a>
          </div>

          {/* MOBILE CONTROLS (Mobile) */}
          <div className="lg:hidden flex items-center gap-2">
            <CartButton />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-700 hover:text-[#E2001A] hover:bg-gray-100 focus:outline-none transition-colors bg-transparent border border-gray-200 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[var(--navbar-height,64px)] left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 p-5 flex flex-col gap-3 max-h-[calc(100vh-var(--navbar-height,64px))] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-3.5 py-2.5 text-[14px] font-medium rounded-lg transition-colors flex items-center justify-between no-underline cursor-pointer ${
                    active
                      ? "font-bold text-[#E2001A] bg-red-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#E2001A]" />}
                </a>
              );
            })}
          </div>
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/my-bookings");
                }}
                className="flex items-center justify-center gap-2 text-[14px] font-semibold text-gray-700 bg-gray-100/80 py-2.5 rounded-lg hover:bg-gray-200 transition-colors w-full border-0 cursor-pointer"
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
                className="flex items-center justify-center gap-2 text-[14px] font-semibold text-gray-700 bg-gray-100/80 py-2.5 rounded-lg hover:bg-gray-200 transition-colors w-full border-0 cursor-pointer"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Sign In</span>
              </button>
            )}
            <a
              href="tel:+919028384499"
              className="h-10 px-4 rounded-lg bg-[#E2001A] text-white font-bold text-[14px] flex items-center justify-center gap-2 shrink-0 hover:bg-[#c90017] transition-all no-underline w-full shadow-xs"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>Book Service Now</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
