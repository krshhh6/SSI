import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BoschAdvantage from "@/components/BoschAdvantage";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Bosch Advantage – SAM Wheels Patna | Certified Workshop",
  description: "Discover the Bosch Advantage at SAM Wheels Patna — genuine parts, certified diagnostics, Bosch-trained technicians and much more.",
};

export default function BoschAdvantagePage() {
  return (
    <>
      <Navbar />
      <main className="subpage-hero">
        <BoschAdvantage />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
