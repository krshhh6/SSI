import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import SplashCursor from "@/components/ReactBits/SplashCursor";

export default function Home() {
  return (
    <>
      <SplashCursor />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
