"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Journey from "@/components/Journey";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

const WorkshopShowcase = dynamic(() => import("@/components/WorkshopShowcase"), {
  ssr: true,
});
const Reviews = dynamic(() => import("@/components/Reviews"), {
  ssr: true,
});
const Contact = dynamic(() => import("@/components/Contact"), {
  ssr: true,
});

export default function Home() {
  useEffect(() => {
    const handleResetHome = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("resetHome", handleResetHome);
    return () => window.removeEventListener("resetHome", handleResetHome);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Journey />
        <WorkshopShowcase />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
