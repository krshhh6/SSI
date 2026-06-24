import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export default function Home() {
  return (
    <div data-theme="dark" style={{ backgroundColor: "#0F1011", color: "var(--text)", minHeight: "100vh", width: "100%", position: "relative", overflowX: "hidden" }}>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
