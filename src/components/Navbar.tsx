"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
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
  PhoneCall,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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

const MENU_ITEMS: MenuItem[] = [
  { title: "Home", url: "/" },
  {
    title: "Services",
    url: "/services",
    items: [
      {
        title: "Periodic Maintenance",
        description: "Oil changes, filters, and comprehensive checks",
        icon: <Boxes className="size-4 shrink-0 text-[#E2001A]" />,
        url: "/services/car-services",
      },
      {
        title: "AC Service & Repair",
        description: "Cooling diagnostics, gas recharge & coil cleaning",
        icon: <LayoutDashboard className="size-4 shrink-0 text-[#E2001A]" />,
        url: "/services/ac-service",
      },
      {
        title: "Batteries & Electrical",
        description: "Genuine Bosch battery testing and replacement",
        icon: <Sparkles className="size-4 shrink-0 text-[#E2001A]" />,
        url: "/services/batteries",
      },
      {
        title: "Denting & Painting",
        description: "Grade A paint booth, panel repair & scratch removal",
        icon: <Palette className="size-4 shrink-0 text-[#E2001A]" />,
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
        description: "Why SAM Wheels Bosch authorized workshop leads",
        icon: <Book className="size-4 shrink-0 text-[#E2001A]" />,
        url: "/bosch-advantage",
      },
      {
        title: "About Us",
        description: "Our certified technicians & state-of-the-art facility",
        icon: <Users className="size-4 shrink-0 text-[#E2001A]" />,
        url: "/why-different",
      },
      {
        title: "Booking Guide",
        description: "Step-by-step seamless service appointment",
        icon: <GraduationCap className="size-4 shrink-0 text-[#E2001A]" />,
        url: "/booking",
      },
      {
        title: "Blog & Tips",
        description: "Expert car care tips and maintenance advice",
        icon: <History className="size-4 shrink-0 text-[#E2001A]" />,
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
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { cartCount } = useCart();

  // Close search/sheet when pathname changes
  React.useEffect(() => {
    setSheetOpen(false);
    setOpenSearch(false);
  }, [pathname]);

  const handleLinkClick = (url: string, e?: React.MouseEvent) => {
    setSheetOpen(false);
    if (url === "/") {
      if (e) e.preventDefault();
      if (pathname === "/") {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs h-[var(--navbar-height,64px)] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LOGO & DESKTOP NAVIGATION */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            onClick={(e) => handleLinkClick("/", e)}
            className="flex items-center gap-2.5 no-underline shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg p-1 bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:border-red-200 transition-colors">
              <Image
                width={36}
                height={36}
                src="/bosch-logo.png"
                className="w-full h-full object-contain"
                alt="Bosch Car Service"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13.5px] font-extrabold leading-tight text-gray-900 tracking-tight whitespace-nowrap">
                BOSCH CAR SERVICE
              </span>
              <span className="text-[9.5px] font-semibold text-gray-500 tracking-wider uppercase whitespace-nowrap">
                SAM Wheels Pvt Ltd
              </span>
            </div>
          </Link>

          {/* Radix Navigation Menu (Desktop) */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu className="[&_[data-radix-navigation-menu-viewport]]:rounded-2xl">
              <NavigationMenuList className="rounded-2xl gap-1">
                {MENU_ITEMS.map((item) => {
                  if (item.items) {
                    return (
                      <NavigationMenuItem key={item.title} className="text-muted-foreground !rounded-2xl">
                        <NavigationMenuTrigger className="!rounded-2xl text-[13.5px] font-medium text-gray-700 hover:text-gray-900 bg-transparent">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="!rounded-2xl shadow-lg border border-gray-100 bg-white">
                          <ul className="w-80 p-3 flex flex-col gap-1 list-none m-0">
                            <NavigationMenuLink className="!rounded-2xl">
                              {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                  <Link
                                    className="flex select-none gap-3 rounded-lg p-2.5 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-gray-900"
                                    href={subItem.url}
                                  >
                                    <div className="mt-0.5">{subItem.icon}</div>
                                    <div>
                                      <div className="text-[13px] font-semibold text-gray-900">
                                        {subItem.title}
                                      </div>
                                      {subItem.description && (
                                        <p className="text-[11.5px] leading-snug text-gray-500 mt-1 mb-0">
                                          {subItem.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </NavigationMenuLink>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  }

                  return (
                    <Link
                      key={item.title}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-1.5 text-[13.5px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 no-underline"
                      href={item.url}
                      onClick={(e) => handleLinkClick(item.url, e)}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            className="w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Search className="size-4" />
          </Button>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Link href="/my-bookings" aria-label="View bookings">
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E2001A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Auth Button */}
          {user ? (
            <Button asChild variant="outline" size="sm" className="h-9 font-semibold text-xs border-gray-200 gap-1.5">
              <Link href="/my-bookings">
                <User className="size-3.5" />
                <span className="max-w-[90px] truncate">{user.displayName || "Account"}</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="h-9 font-semibold text-xs border-gray-200">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}

          {/* Book Now Button */}
          <Button asChild size="sm" className="h-9 bg-[#E2001A] hover:bg-[#c90017] text-white font-bold text-xs shadow-xs px-4 rounded-lg">
            <Link href="/booking">
              <PhoneCall className="size-3.5 mr-1.5" />
              Book Service
            </Link>
          </Button>
        </div>

        {/* MOBILE NAVBAR */}
        <div className="flex lg:hidden items-center gap-1">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            className="w-9 h-9 text-gray-700"
          >
            <Search className="size-4" />
          </Button>

          {/* Cart Button */}
          <Button variant="ghost" size="icon" asChild className="relative w-9 h-9 text-gray-700">
            <Link href="/my-bookings" aria-label="Cart">
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#E2001A] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="w-9 h-9 text-gray-700">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-[85vw] max-w-sm bg-white p-6">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Link
                    href="/"
                    onClick={(e) => handleLinkClick("/", e)}
                    className="flex items-center gap-2.5 no-underline"
                  >
                    <div className="w-8 h-8 rounded-md p-1 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <Image
                        width={32}
                        height={32}
                        src="/bosch-logo.png"
                        className="w-full h-full object-contain"
                        alt="Bosch Car Service"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-bold text-gray-900">BOSCH CAR SERVICE</span>
                      <span className="text-[9px] font-medium text-gray-500 uppercase">SAM Wheels</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="my-6 flex flex-col gap-5">
                <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                  {MENU_ITEMS.map((item) => {
                    if (item.items) {
                      return (
                        <AccordionItem key={item.title} value={item.title} className="border-b border-gray-100">
                          <AccordionTrigger className="py-2.5 text-[14px] font-semibold text-gray-900 hover:no-underline">
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent className="mt-1 pb-2">
                            <div className="flex flex-col gap-1 pl-2">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  className="flex select-none gap-3 rounded-lg p-2 leading-none outline-none transition-colors hover:bg-gray-100 no-underline text-gray-700"
                                  href={subItem.url}
                                  onClick={() => setSheetOpen(false)}
                                >
                                  <div>{subItem.icon}</div>
                                  <div>
                                    <div className="text-[13px] font-medium text-gray-900">{subItem.title}</div>
                                    {subItem.description && (
                                      <p className="text-[11px] leading-snug text-gray-500 mt-0.5 mb-0">
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
                      <div key={item.title} className="border-b border-gray-100">
                        <Link
                          href={item.url}
                          onClick={(e) => handleLinkClick(item.url, e)}
                          className="text-[14px] font-semibold text-gray-900 py-2.5 no-underline block"
                        >
                          {item.title}
                        </Link>
                      </div>
                    );
                  })}
                </Accordion>

                {/* Extra Quick Links */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Navigation</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MOBILE_EXTRA_LINKS.map((link, idx) => (
                      <Link
                        key={idx}
                        className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 no-underline"
                        href={link.url}
                        onClick={(e) => handleLinkClick(link.url, e)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  {user ? (
                    <Button asChild variant="outline" className="w-full justify-start text-xs font-semibold">
                      <Link href="/my-bookings" onClick={() => setSheetOpen(false)}>
                        <User className="size-3.5 mr-2" />
                        My Account ({user.displayName || "User"})
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full text-xs font-semibold">
                      <Link href="/sign-in" onClick={() => setSheetOpen(false)}>Sign In</Link>
                    </Button>
                  )}
                  <Button asChild className="bg-[#E2001A] hover:bg-[#c90017] text-white font-bold w-full text-xs shadow-xs">
                    <Link href="/booking" onClick={() => setSheetOpen(false)}>
                      <PhoneCall className="size-3.5 mr-1.5" />
                      Book Service Now
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* SEARCH COMMAND PALETTE (CMD+K) */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search car services, batteries, periodic maintenance, AC..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="text-gray-500" heading="Popular Services">
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/services/car-services");
              }}
            >
              <Boxes className="size-4 mr-2 text-[#E2001A]" />
              Periodic Maintenance & Comprehensive Car Service
            </CommandItem>
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/services/ac-service");
              }}
            >
              <LayoutDashboard className="size-4 mr-2 text-[#E2001A]" />
              AC Gas Recharge & Deep Evaporator Cleaning
            </CommandItem>
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/services/batteries");
              }}
            >
              <Sparkles className="size-4 mr-2 text-[#E2001A]" />
              Bosch Genuine Battery Replacement & Electrical Check
            </CommandItem>
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/services/denting-painting");
              }}
            >
              <Palette className="size-4 mr-2 text-[#E2001A]" />
              Premium Denting & Painting (Grade A Booth)
            </CommandItem>
          </CommandGroup>

          <CommandGroup className="text-gray-500" heading="Quick Links">
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/booking");
              }}
            >
              <PhoneCall className="size-4 mr-2 text-[#E2001A]" />
              Book a Service Appointment
            </CommandItem>
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/bosch-advantage");
              }}
            >
              <Book className="size-4 mr-2 text-[#E2001A]" />
              Why Choose SAM Wheels Bosch Workshop
            </CommandItem>
            <CommandItem
              className="text-gray-800 cursor-pointer"
              onSelect={() => {
                setOpenSearch(false);
                router.push("/blog");
              }}
            >
              <History className="size-4 mr-2 text-[#E2001A]" />
              Expert Car Care Blog & Maintenance Tips
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
