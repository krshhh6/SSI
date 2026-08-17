"use client"

import { Book, Menu, ShoppingCart, Search, Palette, GraduationCap, History, Users, LayoutDashboard, Sparkles, Boxes } from "lucide-react";
import * as React from "react";

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
import Link from "next/link";
import Image from "next/image";

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
          description: "Oil changes, filters, and comprehensive checks",
          icon: <Boxes className="size-5 shrink-0" />,
          url: "/services/car-services",
        },
        {
          title: "AC Service & Repair",
          description: "Cooling diagnostics, gas recharge & coil cleaning",
          icon: <LayoutDashboard className="size-5 shrink-0" />,
          url: "/services/ac-service",
        },
        {
          title: "Batteries & Electrical",
          description: "Genuine Bosch battery testing and replacement",
          icon: <Sparkles className="size-5 shrink-0" />,
          url: "/services/batteries",
        },
        {
          title: "Denting & Painting",
          description: "Grade A paint booth, panel repair & scratch removal",
          icon: <Palette className="size-5 shrink-0" />,
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
          icon: <Book className="size-5 shrink-0" />,
          url: "/bosch-advantage",
        },
        {
          title: "About Us",
          description: "Our certified technicians & state-of-the-art facility",
          icon: <Users className="size-5 shrink-0" />,
          url: "/why-different",
        },
        {
          title: "Booking Guide",
          description: "Step-by-step seamless service appointment",
          icon: <GraduationCap className="size-5 shrink-0" />,
          url: "/booking",
        },
        {
          title: "Blog & Tips",
          description: "Expert car care tips and maintenance advice",
          icon: <History className="size-5 shrink-0" />,
          url: "/blog",
        },
      ],
    },
    {
      title: "Book Service",
      url: "/booking",
    },
    {
      title: "Blog",
      url: "/blog",
    },
  ],

  mobileExtraLinks = [
    { name: "Services", url: "/#services" },
    { name: "Contact", url: "/#contact" },
    { name: "Advantage", url: "/bosch-advantage" },
    { name: "My Bookings", url: "/my-bookings" },
  ],

  auth = {
    login: { text: "Sign In", url: "/sign-in" },
    signup: { text: "Book Now", url: "/booking" },
  },
}: NavbarProps) {
  const [openSearch, setOpenSearch] = React.useState(false);

  return (
    <section className="py-2 sm:py-3 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <nav className="hidden justify-between items-center lg:flex">
          <div className="flex items-center gap-8">
            <Link href={logo.url} className="flex items-center gap-3 no-underline">
              <div className="w-9 h-9 rounded-lg p-1 bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0">
                <Image width={36} height={36} src={logo.src} className="w-full h-full object-contain" alt={logo.alt} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13.5px] font-extrabold leading-tight text-gray-900 tracking-tight whitespace-nowrap">
                  BOSCH CAR SERVICE
                </span>
                <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase whitespace-nowrap">
                  SAM Wheels Pvt Ltd
                </span>
              </div>
            </Link>
            <div className="flex items-center">
              <NavigationMenu className="[&_[data-radix-navigation-menu-viewport]]:rounded-2xl">
                <NavigationMenuList className="rounded-2xl gap-1">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSearch(true)}
              aria-label="Search"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Search className="size-4" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Link href="/my-bookings">
                <ShoppingCart className="size-4" />
              </Link>
            </Button>

            {/* Auth Buttons */}
            <Button asChild variant="outline" size="sm" className="font-semibold text-xs border-gray-200">
              <Link href={auth.login.url}>{auth.login.text}</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#E2001A] hover:bg-[#c90017] text-white font-bold text-xs shadow-xs">
              <Link href={auth.signup.url}>{auth.signup.text}</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Navbar */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-md p-1 bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
                <img src={logo.src} className="w-full h-full object-contain" alt={logo.alt} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold leading-tight text-gray-900 truncate">
                  BOSCH CAR SERVICE
                </span>
                <span className="text-[9px] font-medium text-gray-500 uppercase truncate">
                  SAM Wheels
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              {/* Search button mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenSearch(true)}
                aria-label="Search"
                className="h-9 w-9 text-gray-700"
              >
                <Search className="size-4" />
              </Button>

              {/* Cart button mobile */}
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-gray-700">
                <Link href="/my-bookings">
                  <ShoppingCart className="size-4" />
                </Link>
              </Button>

              {/* Menu Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9 text-gray-700">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2 no-underline">
                        <img src={logo.src} className="w-8 h-8 object-contain" alt={logo.alt} />
                        <span className="text-sm font-bold text-gray-900">BOSCH CAR SERVICE</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-3"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                      <div className="grid grid-cols-2 justify-start gap-1">
                        {mobileExtraLinks.map((link, idx) => (
                          <Link
                            key={idx}
                            className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground no-underline"
                            href={link.url}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <Button asChild variant="outline" className="w-full">
                        <Link href={auth.login.url}>{auth.login.text}</Link>
                      </Button>
                      <Button asChild className="bg-[#E2001A] hover:bg-[#c90017] text-white font-bold w-full shadow-xs">
                        <Link href={auth.signup.url}>{auth.signup.text}</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Search Popup */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search services, periodic maintenance, batteries, AC..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="text-gray-500" heading="Popular Services">
            <CommandItem className="text-gray-800 dark:text-gray-200 cursor-pointer" onSelect={() => { window.location.href = "/services/car-services"; }}>
              Periodic Car Servicing & Oil Change
            </CommandItem>
            <CommandItem className="text-gray-800 dark:text-gray-200 cursor-pointer" onSelect={() => { window.location.href = "/services/ac-service"; }}>
              AC Gas Recharge & Deep Cleaning
            </CommandItem>
            <CommandItem className="text-gray-800 dark:text-gray-200 cursor-pointer" onSelect={() => { window.location.href = "/services/batteries"; }}>
              Bosch Battery Replacement
            </CommandItem>
            <CommandItem className="text-gray-800 dark:text-gray-200 cursor-pointer" onSelect={() => { window.location.href = "/booking"; }}>
              Book an Appointment
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </section>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground !rounded-2xl">
        <NavigationMenuTrigger className="!rounded-2xl text-[13.5px] font-medium text-gray-700 hover:text-gray-900 bg-transparent">{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="!rounded-2xl shadow-lg border border-gray-100">
          <ul className="w-80 p-3 flex flex-col gap-1 list-none m-0">
            <NavigationMenuLink className="!rounded-2xl">
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <Link
                    className="flex select-none gap-3 rounded-lg p-2.5 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    <div className="text-[#E2001A] mt-0.5">{subItem.icon}</div>
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
    >
      {item.title}
    </Link>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-2 text-[14px] font-semibold text-gray-900 hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-1 pb-1">
          <div className="flex flex-col gap-1 pl-2">
            {item.items.map((subItem) => (
              <Link
                key={subItem.title}
                className="flex select-none gap-3 rounded-lg p-2.5 leading-none outline-none transition-colors hover:bg-gray-100 no-underline text-gray-700"
                href={subItem.url}
              >
                <div className="text-[#E2001A]">{subItem.icon}</div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">{subItem.title}</div>
                  {subItem.description && (
                    <p className="text-[11.5px] leading-snug text-gray-500 mt-0.5 mb-0">
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
    <Link key={item.title} href={item.url} className="text-[14px] font-semibold text-gray-900 py-2 no-underline block">
      {item.title}
    </Link>
  );
};
