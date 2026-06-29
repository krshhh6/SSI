"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { 
  Wrench, Cpu, Paintbrush, Wind, ArrowRight, Sparkles, 
  FileText, CheckCircle2, BookOpen, Clock, Calendar, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ARTICLES = [
  {
    id: "periodic-maintenance",
    category: "Maintenance",
    title: "Periodic Maintenance: The Key to Your Engine's Longevity",
    subtitle: "Why routine check-ups are the single best investment you can make for your vehicle.",
    readTime: "5 min read",
    date: "June 28, 2026",
    color: "#0066FF",
    icon: Wrench,
    summary: "Regular maintenance is crucial for the longevity and performance of your vehicle. Discover what is included in a certified Bosch multi-point service and how it saves you money in the long run.",
    sections: [
      {
        title: "The Danger of Neglecting Oil Changes",
        content: "Engine oil is the lifeblood of your car. It lubricates moving parts, reduces friction, and helps dissipate heat. Over time, engine oil breaks down, loses its viscosity, and accumulates dirt and metal particles. Running your car with old oil causes accelerated wear on engine bearings, pistons, and camshafts. In the worst-case scenario, it leads to engine seizure, costing thousands in repairs. We recommend switching to premium synthetic oil every 10,000 km or 6 months."
      },
      {
        title: "What is a Bosch 40-Point Inspection?",
        content: "Unlike a quick lube shop, a certified Bosch Car Service includes a comprehensive 40-point safety and health check. This includes testing battery health, inspecting brake pads and rotors, checking suspension bushings, assessing tire wear, testing coolant and brake fluid quality, and checking for hidden leaks. It is designed to catch minor issues before they become highway emergencies."
      }
    ],
    expertTip: "Always keep a log of your periodic servicing. A clean service history can increase your car's resale value by up to 20%!",
    bullets: ["Genuine Bosch synthetic oils and filters", "Engine health scan included", "Coolant and fluid level adjustments", "Suspension and brake safety checks"]
  },
  {
    id: "engine-diagnostics",
    category: "Technology",
    title: "Demystifying Check Engine Lights & OBD-II Diagnostics",
    subtitle: "How modern vehicles communicate faults and how certified tools identify the root cause.",
    readTime: "6 min read",
    date: "June 25, 2026",
    color: "#00AAFF",
    icon: Cpu,
    summary: "Modern cars are complex computers on wheels. When your check engine light illuminates, advanced scanners read code faults to solve mechanical mysteries without guesswork.",
    sections: [
      {
        title: "Why is My Check Engine Light On?",
        content: "The Check Engine Light (MIL) is triggered by your car's Engine Control Unit (ECU) when it detects a sensor reading outside of normal operating parameters. This could be anything from a loose gas cap, a failing Oxygen (O2) sensor, a faulty Mass Airflow Sensor, to serious engine misfires. Ignoring it can cause poor fuel economy, increased emissions, and permanent damage to your catalytic converter."
      },
      {
        title: "The Bosch KTS Advantage",
        content: "A standard OBD-II pocket scanner only reads generic emissions codes. At SAM Wheels, we use professional Bosch KTS diagnostic scanners. These advanced systems read manufacturer-specific diagnostic trouble codes (DTCs), display live sensor telemetry, test individual actuators, and allow us to reset ECU adaptations for optimal driving dynamics."
      }
    ],
    expertTip: "If your check engine light is flashing, pull over safely and turn off the engine immediately. A flashing light indicates a severe misfire that can destroy your catalytic converter in minutes.",
    bullets: ["ECU error log reading", "Live sensor data stream verification", "Actuator testing & adaptation resets", "Bosch KTS system precision"]
  },
  {
    id: "dent-and-paint",
    category: "Bodywork",
    title: "The Art and Science of Factory-Finish Paint Restoration",
    subtitle: "How computerized color matching and dust-free booths bring back your car's showroom look.",
    readTime: "4 min read",
    date: "June 20, 2026",
    color: "#E2001A",
    icon: Paintbrush,
    summary: "Dents and paint scratches compromise your car's aesthetics and expose the underlying steel to rust. Learn how factory-grade paint matching restores a seamless, mirror-like finish.",
    sections: [
      {
        title: "Why Precision Color Matching is Hard",
        content: "No two cars have the exact same paint shade, even if they have the same paint code. Sunlight exposure, weather conditions, and age slightly fade factory paint. Applying standard paint codes blindly will result in patchy, mismatched panels. We use computerized color spectrophotometers to measure the current faded paint hue and mix a custom shade that blends seamlessly."
      },
      {
        title: "The Importance of a Dust-Free Paint Booth",
        content: "Applying automotive paint requires an environment free of airborne particles. A single speck of dust landing on wet paint causes small blemishes or 'fish-eyes.' Our pressurized, dust-free paint booths use advanced downward air filtration systems and heat lamps to cure the paint evenly, guaranteeing a smooth glass finish."
      }
    ],
    expertTip: "Fix scratches early. Exposed metal panels will oxidize, causing paint bubbling and deep structural rust that is much more expensive to repair later.",
    bullets: ["Computerized spectrophotometer matching", "Dupont / Standox premium paint mixtures", "Infrared baking and curing process", "Undercoat rust protection layers"]
  },
  {
    id: "ac-service",
    category: "Climate",
    title: "Breathe Clean: Car AC Maintenance and Air Quality",
    subtitle: "Understanding cabin filtration systems and refrigeration cycles for a cool, healthy cabin.",
    readTime: "4 min read",
    date: "June 15, 2026",
    color: "#00C896",
    icon: Wind,
    summary: "Car air conditioning is about more than comfort—it is a critical safety system that filters harmful road dust, pollen, and bacteria out of your breathing space.",
    sections: [
      {
        title: "Why does my AC smell musty?",
        content: "When you run your AC, moisture condenses on the cold evaporator coils located deep inside your dashboard. Dust and mold spores stick to this damp surface, multiplying in the dark, warm environment. This creates a musty odor and can cause allergies or respiratory issues. Regular AC servicing involves cleaning the evaporator with specialized antimicrobial foam to neutralize mold."
      },
      {
        title: "Refrigerant Leaks & Compressor Health",
        content: "If your AC is blowing warm air, it is likely low on R134a refrigerant. Running the system with low gas causes the compressor to work twice as hard, leading to premature failure. During a full service, we vacuum-test the system for micro-leaks, replace compressor oil, and recharge the gas to exact factory-weight specifications."
      }
    ],
    expertTip: "Turn off your AC but keep the blower fan running for 2 minutes before reaching your destination. This dries out the evaporator coils and prevents mold growth!",
    bullets: ["Condenser coil pressure washing", "Refrigerant level check & recharge", "Activated carbon cabin filter swap", "Antimicrobial duct sanitization"]
  },
  {
    id: "wheel-alignment",
    category: "Safety",
    title: "3D Wheel Alignment: The Cure for Tire Wear & Poor Mileage",
    subtitle: "How suspension angles drift and how 3D imaging restores perfect handling.",
    readTime: "5 min read",
    date: "June 10, 2026",
    color: "#FF8800",
    icon: ShieldCheck,
    summary: "Potholes, speed bumps, and wear gradually knock your wheels out of alignment. Discover the symptoms of misalignment and how 3D alignment saves fuel and tires.",
    sections: [
      {
        title: "Signs Your Car Needs Alignment",
        content: "If your steering wheel vibrates, pulls to one side on a straight road, or sits off-center when driving straight, your wheels are misaligned. Another telltale sign is uneven tire wear, where the inner or outer edges of your tires wear out significantly faster. Misalignment increases rolling resistance, making your engine work harder and burning more fuel."
      },
      {
        title: "How 3D Alignment Works",
        content: "Traditional laser alignment can be inaccurate. Our 3D alignment systems use high-definition cameras and digital targets mounted on all four wheels to map a live 3D model of your suspension geometry. The computer compares your Camber, Caster, and Toe angles to your vehicle's factory specifications, allowing our technicians to make micro-adjustments."
      }
    ],
    expertTip: "Get your wheel alignment checked every 5,000 km, or immediately after hitting a major pothole. It can extend your tire lifespan by up to 20,000 km!",
    bullets: ["3D digital target mapping", "Camber, Caster, and Toe angle correction", "Steering angle sensor calibration", "Tire pressure and tread depth analysis"]
  },
  {
    id: "car-detailing",
    category: "Detailing",
    title: "The Science of Paint Protection: Wax vs. Polish vs. Ceramic Coating",
    subtitle: "Decoding the differences to choose the ultimate shield for your car's paint.",
    readTime: "5 min read",
    date: "June 05, 2026",
    color: "#AA66FF",
    icon: Sparkles,
    summary: "Car detailing is more than a standard wash. It is an intensive restoration process that removes oxidation, light scratches, and adds deep molecular protection.",
    sections: [
      {
        title: "Wax vs. Polish: The Common Confusion",
        content: "Polishing and waxing are opposite processes. Polishing is abrasive—it removes a microscopic layer of clear coat to eliminate swirl marks and light scratches, restoring shine. Waxing is protective—it adds a sacrificial layer of carnauba wax over the paint to fill micro-imperfections and add gloss. You must always polish first, then wax."
      },
      {
        title: "The Ultimate Shield: Ceramic Coatings",
        content: "While wax lasts 2 months, a professional Ceramic Coating (Silicon Dioxide or SiO2) bonds chemically with your clear coat to create a semi-permanent, hydrophobic glass layer. This shield repels water, mud, bird droppings, UV rays, and chemical oxidation, keeping your car looking freshly waxed for 2 to 5 years."
      }
    ],
    expertTip: "Never wash your car with laundry detergent or dish soap. These have high alkalinity that strips off protective wax coatings and dries out plastic trims, leading to fading.",
    bullets: ["Clay bar decontamination", "Multi-stage paint correction", "9H Nano-ceramic coating application", "Interior deep leather & fabric cleaning"]
  },
  {
    id: "insurance-claims",
    category: "Insurance",
    title: "Cashless Car Insurance Claims: A Hassle-Free Guide",
    subtitle: "What to do after an accident to get your vehicle repaired with zero out-of-pocket stress.",
    readTime: "6 min read",
    date: "June 01, 2026",
    color: "#FF4466",
    icon: FileText,
    summary: "Filing an insurance claim doesn't have to be a bureaucratic nightmare. Learn how cashless workshop tie-ups streamline the surveyor process and approval.",
    sections: [
      {
        title: "What is Cashless Claim Settlement?",
        content: "When you choose a cashless garage network like SAM Wheels, you don't have to pay for the repairs yourself and wait for reimbursement. The insurance company pays the workshop directly for approved repair costs. You only pay the mandatory deductible (compulsory excess) and depreciation costs for parts (like plastic or rubber components)."
      },
      {
        title: "Step-by-Step Claim Walkthrough",
        content: "1. Take photos of the damage at the spot. 2. Bring the car to our facility (or call us for a free tow). 3. Submit your documents (RC, Insurance Policy, Driving License, FIR if third party is involved). 4. Our team hosts the insurance surveyor who inspects the vehicle. 5. Once the claim is approved, we start repairs using genuine parts. 6. You drive away after paying your minor part share."
      }
    ],
    expertTip: "Report the accident to the workshop within 24-48 hours. Delayed reporting is one of the most common reasons insurance companies reject claims.",
    bullets: ["Cashless tie-up with major insurers", "Dedicated surveyor inspection desk", "Complete document processing support", "Genuine spares replacement guarantee"]
  }
];

export default function BlogPage() {
  const [activeArticle, setActiveArticle] = useState(ARTICLES[0].id);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setActiveArticle(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Adjust for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Monitor scroll to update active sidebar state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150; // offset for detection
      for (const art of ARTICLES) {
        const el = document.getElementById(art.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveArticle(art.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 100, color: "var(--text)" }}>
        {/* Header Hero Section */}
        <section className="container" style={{ padding: "40px 24px 60px", position: "relative" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 100,
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 20
              }}
            >
              <BookOpen size={14} /> Car Care Knowledge Base
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="display-lg" 
              style={{ marginBottom: 20 }}
            >
              SAM Wheels <span className="gradient-text-blue">Expert Blog</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Learn maintenance tips, technical secrets, and vehicle safety advice directly from our Bosch-certified master technicians.
            </motion.p>
          </div>
        </section>

        {/* Layout Grid */}
        <section className="container" style={{ padding: "0 24px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 48 }} className="blog-layout-grid">
            
            {/* Sidebar Sticky Table of Contents */}
            <aside style={{ position: "sticky", top: 100, height: "fit-content" }} className="blog-sidebar">
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, backdropFilter: "blur(12px)" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>
                  Articles
                </h3>
                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {ARTICLES.map(art => {
                    const Icon = art.icon;
                    const isActive = activeArticle === art.id;
                    return (
                      <button
                        key={art.id}
                        onClick={() => scrollToSection(art.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: "none",
                          background: isActive ? "var(--bg-secondary)" : "transparent",
                          color: isActive ? "var(--accent)" : "var(--text-secondary)",
                          cursor: "pointer",
                          fontSize: "0.88rem",
                          fontWeight: isActive ? 700 : 500,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
                        }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: isActive ? `${art.color}15` : "rgba(0,0,0,0.02)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: isActive ? art.color : "var(--text-muted)",
                          transition: "all 0.2s ease"
                        }}>
                          <Icon size={14} />
                        </div>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {art.category}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Articles List Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 60 }} className="blog-content-list">
              {ARTICLES.map((art, idx) => {
                const Icon = art.icon;
                return (
                  <motion.article 
                    key={art.id}
                    id={art.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 24,
                      padding: "48px 40px",
                      position: "relative",
                      overflow: "hidden",
                      backdropFilter: "blur(12px)",
                      boxShadow: "var(--shadow-card)"
                    }}
                  >
                    {/* Top strip accent color */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: art.color }} />

                    {/* Metadata Header */}
                    <header style={{ marginBottom: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "5px 12px",
                          borderRadius: 100,
                          background: `${art.color}12`,
                          border: `1px solid ${art.color}30`,
                          color: art.color,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em"
                        }}>
                          <Icon size={12} /> {art.category}
                        </span>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 500 }}>
                          <Calendar size={13} /> <span>{art.date}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 500 }}>
                          <Clock size={13} /> <span>{art.readTime}</span>
                        </div>
                      </div>

                      <h2 className="font-outfit" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.25, marginBottom: 12 }}>
                        {art.title}
                      </h2>
                      <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", fontWeight: 500, lineHeight: 1.5 }}>
                        {art.subtitle}
                      </p>
                    </header>

                    {/* Summary Intro */}
                    <div style={{
                      padding: "20px 24px",
                      borderRadius: 16,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      marginBottom: 32,
                      fontStyle: "italic"
                    }}>
                      {art.summary}
                    </div>

                    {/* Detailed Content Sections */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 36 }}>
                      {art.sections.map((sect, sIdx) => (
                        <div key={sIdx}>
                          <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
                            {sect.title}
                          </h4>
                          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                            {sect.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Key Service Highlights */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, marginBottom: 36 }} className="article-details-grid">
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 16 }}>
                          What We Check/Do:
                        </h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                          {art.bullets.map((b, bIdx) => (
                            <li key={bIdx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                              <CheckCircle2 size={15} color={art.color} style={{ flexShrink: 0 }} />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expert Tip Alert Box */}
                      <div style={{
                        background: `${art.color}06`,
                        border: `1px solid ${art.color}25`,
                        borderRadius: 16,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: art.color, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          <Sparkles size={14} /> Expert Tip
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                          {art.expertTip}
                        </p>
                      </div>
                    </div>

                    {/* Action footer */}
                    <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 28, flexWrap: "wrap", gap: 16 }}>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Need this service? Book with Patna&apos;s leading Bosch workshop.
                      </div>
                      <Link
                        href={`/booking?service=${art.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 24px",
                          borderRadius: 10,
                          background: art.color,
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          textDecoration: "none",
                          boxShadow: `0 8px 20px ${art.color}25`,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 12px 24px ${art.color}40`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = `0 8px 20px ${art.color}25`;
                        }}
                      >
                        Book Service <ArrowRight size={15} />
                      </Link>
                    </footer>
                  </motion.article>
                );
              })}
            </div>

          </div>
        </section>

        {/* Custom CSS overrides for responsiveness */}
        <style>{`
          @media (max-width: 900px) {
            .blog-layout-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
            .blog-sidebar {
              position: static !important;
              margin-bottom: 16px;
            }
            .blog-sidebar nav {
              flex-direction: row !important;
              flex-wrap: wrap;
              gap: 8px;
            }
            .blog-sidebar nav button {
              width: auto !important;
              padding: 6px 12px !important;
            }
            .blog-sidebar nav button span {
              display: inline !important;
            }
            .article-details-grid {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
            article {
              padding: 32px 24px !important;
            }
          }
        `}</style>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
