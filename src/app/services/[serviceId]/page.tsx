import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { Wrench, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

const SERVICES_DB: Record<string, { title: string; subtitle: string; description: string; benefits: string[]; color: string }> = {
  "periodic-maintenance": {
    title: "Periodic Maintenance",
    subtitle: "Keep your car running at its absolute best.",
    description: "Regular maintenance is crucial for the longevity and performance of your vehicle. Our Bosch-certified periodic maintenance includes comprehensive checks, oil changes using genuine Bosch synthetic oils, filter replacements, and fluid top-ups to ensure your vehicle remains safe and reliable on the road.",
    benefits: ["Genuine Bosch filters and oils", "Comprehensive 40-point health check", "Extended engine life", "Better fuel efficiency"],
    color: "#0066FF",
  },
  "engine-diagnostics": {
    title: "Engine Diagnostics",
    subtitle: "Precision fault detection with Bosch KTS.",
    description: "Modern cars are complex computers on wheels. When your check engine light comes on, our expert technicians use advanced Bosch KTS diagnostic scanners to communicate directly with your car's ECU, pinpointing the exact electrical or mechanical fault without guesswork.",
    benefits: ["Bosch KTS Advanced Scanners", "Accurate fault code reading", "Prevents major engine failure", "Saves time and money on blind repairs"],
    color: "#00AAFF",
  },
  "dent-and-paint": {
    title: "Dent & Paint",
    subtitle: "Flawless finish, exact color match.",
    description: "Restore your vehicle's factory look with our professional denting and painting services. We use high-quality paints and computerized color matching to ensure the repaired area blends seamlessly with the rest of your car. Our dust-free paint booth guarantees a showroom-quality finish.",
    benefits: ["Computerized color matching", "Premium quality clear coats", "Dust-free paint booth", "Seamless dent removal"],
    color: "#E2001A",
  },
  "ac-service": {
    title: "AC Service & Repair",
    subtitle: "Stay cool with expert climate control servicing.",
    description: "Don't sweat through the summer. Our comprehensive AC service includes checking for refrigerant leaks, cleaning the condenser, replacing the cabin air filter, and ensuring your compressor is functioning perfectly to deliver ice-cold air efficiently.",
    benefits: ["Leak detection & fixing", "Optimal gas pressure refill", "Cabin filter replacement", "Eliminates bad odors"],
    color: "#00C896",
  },
  "wheel-alignment": {
    title: "Wheel Alignment",
    subtitle: "Perfect handling and longer tire life.",
    description: "Misaligned wheels cause uneven tire wear, poor handling, and decreased fuel efficiency. We use state-of-the-art 3D computerized alignment machines to adjust your vehicle's suspension back to precise factory specifications.",
    benefits: ["3D computerized accuracy", "Improves steering control", "Extends tire lifespan", "Better fuel economy"],
    color: "#FF8800",
  },
  "car-detailing": {
    title: "Car Detailing",
    subtitle: "Showroom shine, inside and out.",
    description: "Treat your car to a spa day. Our detailing services go far beyond a regular wash, offering deep interior vacuuming, upholstery shampooing, exterior clay bar treatment, compounding, polishing, and protective ceramic coatings.",
    benefits: ["Removes swirl marks and light scratches", "Deep interior sanitization", "UV protection for paint", "Long-lasting ceramic shine"],
    color: "#AA66FF",
  },
  "insurance-claims": {
    title: "Insurance Claims",
    subtitle: "Hassle-free, cashless repairs.",
    description: "Getting into an accident is stressful enough—repairing your car shouldn't be. We have tie-ups with all major insurance providers to offer smooth, cashless claim settlements. We handle the paperwork, surveyor inspections, and repairs so you don't have to.",
    benefits: ["Cashless settlement with major providers", "End-to-end paperwork assistance", "Fast surveyor approval", "Genuine parts used for all repairs"],
    color: "#FF4466",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ serviceId: string }> }): Promise<Metadata> {
  const { serviceId } = await params;
  const service = SERVICES_DB[serviceId];
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} | Bosch Car Service Patna`,
    description: service.subtitle,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  const service = SERVICES_DB[serviceId];

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="subpage-hero" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <div className="container" style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/services" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Services</Link>
            <ChevronRight size={14} />
            <span style={{ color: service.color, fontWeight: 700 }}>{service.title}</span>
          </div>
        </div>

        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }} className="service-detail-grid">
            {/* Left Content */}
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "5px 16px",
                  borderRadius: 100,
                  border: `1px solid ${service.color}40`,
                  background: `${service.color}15`,
                  color: service.color,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Premium Service
              </span>
              <h1 className="display-lg" style={{ marginBottom: 24, fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                {service.title}
              </h1>
              <p style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text)", marginBottom: 20 }}>
                {service.subtitle}
              </p>
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 40 }}>
                {service.description}
              </p>

              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, backdropFilter: "blur(20px)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>Why Choose Bosch SAM Wheels?</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                  {service.benefits.map((benefit, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                      <CheckCircle2 size={18} color={service.color} style={{ flexShrink: 0 }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Action Box */}
            <div>
              <div
                style={{
                  background: "var(--card)",
                  border: `1px solid ${service.color}40`,
                  borderRadius: 24,
                  padding: 48,
                  textAlign: "center",
                  boxShadow: `0 24px 60px ${service.color}15`,
                  backdropFilter: "blur(20px)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: service.color }} />
                <div style={{ width: 80, height: 80, borderRadius: 20, background: `${service.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <Wrench size={32} color={service.color} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>
                  Book {service.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 32, lineHeight: 1.6 }}>
                  Get expert care for your vehicle. Schedule an appointment today and experience the Bosch advantage.
                </p>
                <Link
                  href={`/#booking?service=${serviceId}`}
                  style={{
                    display: "block",
                    padding: "16px 24px",
                    borderRadius: 12,
                    background: service.color,
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    boxShadow: `0 12px 30px ${service.color}40`,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Schedule Appointment
                </Link>
                <div style={{ marginTop: 24, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Or call us at <a href="tel:+919028384499" style={{ color: "var(--text)", fontWeight: 600, textDecoration: "none" }}>+91 90283 84499</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .service-detail-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
