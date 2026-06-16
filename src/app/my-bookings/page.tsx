import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import MyBookingsClient from "@/components/MyBookingsClient";

export const metadata: Metadata = {
  title: "My Bookings | Bosch Car Service – SAM Wheels",
  description: "View and manage your car service appointments at SAM Wheels Bosch Car Service, Patna.",
};

export default function MyBookingsPage() {
  return (
    <>
      <Navbar />
      <MyBookingsClient />
      <Footer />
      <FloatingContact />
    </>
  );
}
