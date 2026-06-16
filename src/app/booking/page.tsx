import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Book a Service – SAM Wheels Bosch Car Service Patna",
  description: "Schedule your car service appointment at SAM Wheels Patna. Quick, hassle-free booking for all car brands.",
};

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="subpage-hero">
        <Booking />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
