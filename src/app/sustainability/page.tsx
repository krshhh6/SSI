import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Sustainability from "@/components/Sustainability";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Sustainability – SAM Wheels Bosch Car Service Patna",
  description: "Our commitment to green mobility, eco-friendly practices and responsible vehicle servicing at SAM Wheels Patna.",
};

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main className="subpage-hero">
        <Sustainability />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
