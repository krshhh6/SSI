import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyDifferent from "@/components/WhyDifferent";
import BoschAdvantage from "@/components/BoschAdvantage";
import Sustainability from "@/components/Sustainability";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyDifferent />
        <BoschAdvantage />
        <Sustainability />
        <Reviews />
        <Gallery />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
