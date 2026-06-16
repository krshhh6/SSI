import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Gallery – SAM Wheels Bosch Car Service Patna",
  description: "Browse our gallery of vehicle repairs, workshop facilities, and before-after transformations at SAM Wheels Patna.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="subpage-hero">
        <Gallery />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
