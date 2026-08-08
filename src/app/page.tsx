"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Journey from "@/components/Journey";
import WorkshopShowcase from "@/components/WorkshopShowcase";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      // Scroll to top of the window when a category is selected
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      // Scroll back to the services section when coming back to home
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <main>
        {!selectedCategory && <Hero />}
        <Services selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        {!selectedCategory && (
          <>
            <Journey />
            <WorkshopShowcase />
            <Reviews />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
