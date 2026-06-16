import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WhyDifferent from "@/components/WhyDifferent";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Why Choose SAM Wheels – Bosch Car Service Patna",
  description: "See what sets SAM Wheels apart — Bosch-certified technicians, genuine parts, real-time WhatsApp updates and cashless insurance support.",
};

export default function WhyDifferentPage() {
  return (
    <>
      <Navbar />
      <main className="subpage-hero">
        <WhyDifferent />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
