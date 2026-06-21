import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Our Services | Bosch Car Service – SAM Wheels Patna",
  description: "Explore our comprehensive range of car repair and maintenance services. From engine diagnostics to denting and painting, we cover all makes and models.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="subpage-hero">
        <div style={{ paddingTop: 40, paddingBottom: 40 }}>
          <Services />
        </div>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
