import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import SignInClient from "@/components/SignInClient";

export const metadata: Metadata = {
  title: "Sign In | Bosch Car Service – SAM Wheels",
  description: "Sign in to manage your car service bookings at SAM Wheels Bosch Car Service, Patna.",
};

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <SignInClient />
      <Footer />
      <FloatingContact />
    </>
  );
}
