"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isNavigatingToTopRef = useRef(false);

  useEffect(() => {
    const handleResetHome = () => {
      isNavigatingToTopRef.current = true;
      setSelectedCategory(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("resetHome", handleResetHome);
    return () => window.removeEventListener("resetHome", handleResetHome);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Scroll to top of the window when a category is selected
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      if (isNavigatingToTopRef.current) {
        isNavigatingToTopRef.current = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Scroll back to the services section when coming back from inside services
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: "instant" });
        }
      }
    }
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="home-full-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero />
              <Services selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              <Journey />
              <WorkshopShowcase />
              <Reviews />
              <Contact />
            </motion.div>
          ) : (
            <motion.div
              key={`category-detail-${selectedCategory}`}
              initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <Services selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
