"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "@/components/ui/command";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

export default function Navbar({
  logo = {
    url: "/",
    src: "/bosch-logo.png",
    alt: "Bosch Logo",
    title: "Bosch Car Service",
  },
  menu = [
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
    { title: "Booking", url: "/booking" },
    { title: "Blog", url: "/blog" },
  ],
  mobileExtraLinks = [
    { name: "Services", url: "/#services" },
    { name: "Contact", url: "/#contact" },
    { name: "Advantage", url: "/bosch-advantage" },
    { name: "My Bookings", url: "/my-bookings" },
  ],
  auth = {
    login: { text: "Sign in", url: "/sign-in" },
    signup: { text: "Book Service", url: "/booking" },
  },
}: NavbarProps) {
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.08] h-[64px] flex items-center transition-colors">
      <div ref={navRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        
        {/* LOGO & DESKTOP NAV */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href={logo.url} className="flex items-center gap-3 no-underline shrink-0 group">
            <div className="w-8 h-8 rounded-lg p-1 bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover:border-red-500/50 transition-colors">
              <Image
                width={32}
                height={32}
                src={logo.src}
                className="w-full h-full object-contain"
                alt={logo.alt}
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13.5px] font-extrabold leading-tight text-white tracking-tight whitespace-nowrap">
                {logo.title}
              </span>
              <span className="text-[9px] font-semibold text-neutral-400 tracking-wider uppercase whitespace-nowrap">
                SAM Wheels Pvt Ltd
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Generous Spacing */}
          <nav className="hidden lg:flex items-center gap-7">
            {menu.map((item) => {
              if (item.items) {
                const isOpen = activeDropdown === item.title;
                return (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : item.title)}
                      className={`inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors py-2 bg-transparent border-0 cursor-pointer outline-none ${
                        isOpen ? "text-white" : "text-neutral-300 hover:text-white"
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`size-3.5 text-neutral-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </button>

                    {/* Smooth Dropdown Card */}
                    {isOpen && (
                      <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="w-[360px] rounded-2xl bg-[#121215] border border-white/[0.12] p-2.5 shadow-2xl shadow-black/80 backdrop-blur-2xl">
                          <div className="flex flex-col gap-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.url}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors no-underline group/sub"
                              >
                                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 group-hover/sub:bg-[#E2001A]/15 transition-colors">
                                  {subItem.icon}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-semibold text-white group-hover/sub:text-white transition-colors">
                                    {subItem.title}
                                  </span>
                                  {subItem.description && (
                                    <span className="text-[11.5px] text-neutral-400 leading-snug mt-0.5 line-clamp-2">
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
                <Link
                  key={item.title}
                  href={item.url}
                  className="text-[14px] font-medium text-neutral-300 hover:text-white transition-colors no-underline py-2"
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer"
          >
            <Search className="size-4" />
          </button>

          {/* Cart Button */}
          <Link
            href="/my-bookings"
            aria-label="View bookings"
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-colors no-underline"
          >
            <ShoppingCart className="size-4" />
          </Link>

          {/* Auth Button */}
          <Link
            href={auth.login.url}
            className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 bg-transparent text-white rounded-lg px-4 py-1.5 text-[13px] font-medium hover:bg-white/5 transition-all no-underline h-9"
          >
            {auth.login.text}
          </Link>

          {/* CTA Book Service Button */}
          <Link
            href={auth.signup.url}
            className="inline-flex items-center justify-center bg-white text-black hover:bg-neutral-200 rounded-lg px-4 py-1.5 text-[13px] font-bold shadow-sm transition-all no-underline h-9 whitespace-nowrap"
          >
            {auth.signup.text}
          </Link>
        </div>

        {/* MOBILE TRIGGER & ACTIONS */}
        <div className="flex lg:hidden items-center gap-1">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center text-neutral-300 hover:text-white bg-transparent border-0 cursor-pointer"
          >
            <Search className="size-4" />
          </button>

          {/* Cart Button */}
          <Link
            href="/my-bookings"
            aria-label="Cart"
            className="relative w-9 h-9 flex items-center justify-center text-neutral-300 hover:text-white no-underline"
          >
            <ShoppingCart className="size-4" />
          </Link>

          {/* Mobile Menu Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="w-9 h-9 flex items-center justify-center text-white bg-transparent border-0 cursor-pointer"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-[85vw] max-w-sm bg-[#0e0e11] text-white border-l border-white/10 p-6">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Link href={logo.url} className="flex items-center gap-2.5 no-underline">
                    <div className="w-8 h-8 rounded-md p-1 bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                      <Image
                        width={32}
                        height={32}
                        src={logo.src}
                        className="w-full h-full object-contain"
                        alt={logo.alt}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-bold text-white">{logo.title}</span>
                      <span className="text-[9px] font-medium text-neutral-400 uppercase">SAM Wheels</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="my-6 flex flex-col gap-5">
                <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                  {menu.map((item) => {
                    if (item.items) {
                      return (
                        <AccordionItem key={item.title} value={item.title} className="border-b border-white/10">
                          <AccordionTrigger className="py-2.5 text-[14px] font-semibold text-neutral-200 hover:text-white hover:no-underline">
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent className="mt-1 pb-2">
                            <div className="flex flex-col gap-1 pl-2">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  className="flex select-none gap-3 rounded-lg p-2.5 leading-none outline-none transition-colors hover:bg-white/5 no-underline text-neutral-300 hover:text-white"
                                  href={subItem.url}
                                  onClick={() => setSheetOpen(false)}
                                >
                                  <div className="mt-0.5">{subItem.icon}</div>
                                  <div>
                                    <div className="text-[13px] font-medium text-white">{subItem.title}</div>
                                    {subItem.description && (
                                      <p className="text-[11px] leading-snug text-neutral-400 mt-0.5 mb-0">
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
                      <div key={item.title} className="border-b border-white/10">
                        <Link
                          href={item.url}
                          onClick={() => setSheetOpen(false)}
                          className="text-[14px] font-semibold text-neutral-200 hover:text-white py-2.5 no-underline block"
                        >
                          {item.title}
                        </Link>
                      </div>
                    );
                  })}
                </Accordion>

                {/* Extra Quick Links */}
                <div className="border-t border-white/10 pt-3">
                  <div className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Quick Navigation</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {mobileExtraLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white no-underline"
                        href={link.url}
                        onClick={() => setSheetOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth and Action */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <Link
                    href={auth.login.url}
                    onClick={() => setSheetOpen(false)}
                    className="w-full flex items-center justify-center border border-white/20 text-white rounded-lg h-9 text-xs font-semibold hover:bg-white/5 no-underline"
                  >
                    {auth.login.text}
                  </Link>
                  <Link
                    href={auth.signup.url}
                    onClick={() => setSheetOpen(false)}
                    className="w-full flex items-center justify-center bg-white text-black hover:bg-neutral-200 rounded-lg h-9 text-xs font-bold shadow-sm no-underline"
                  >
                    {auth.signup.text}
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* SEARCH COMMAND PALETTE (CMD+K) */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search car services, periodic maintenance, batteries, AC..." />
        <CommandList className="bg-[#121215] text-white">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="text-neutral-400" heading="Popular Services">
            <CommandItem
              className="text-neutral-200 hover:text-white hover:bg-white/10 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                window.location.href = "/services/car-services";
              }}
            >
              <Boxes className="size-4 mr-2 text-[#E2001A]" />
              Periodic Maintenance & Comprehensive Car Service
            </CommandItem>
            <CommandItem
              className="text-neutral-200 hover:text-white hover:bg-white/10 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                window.location.href = "/services/ac-service";
              }}
            >
              <LayoutDashboard className="size-4 mr-2 text-[#E2001A]" />
              AC Gas Recharge & Deep Evaporator Cleaning
            </CommandItem>
            <CommandItem
              className="text-neutral-200 hover:text-white hover:bg-white/10 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                window.location.href = "/services/batteries";
              }}
            >
              <Sparkles className="size-4 mr-2 text-[#E2001A]" />
              Bosch Genuine Battery Replacement & Electrical Check
            </CommandItem>
            <CommandItem
              className="text-neutral-200 hover:text-white hover:bg-white/10 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                window.location.href = "/services/denting-painting";
              }}
            >
              <Palette className="size-4 mr-2 text-[#E2001A]" />
              Premium Denting & Painting (Grade A Booth)
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
