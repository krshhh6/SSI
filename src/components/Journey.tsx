"use client";
import { motion } from "framer-motion";
import { CalendarCheck, Truck, Smartphone, ThumbsUp } from "lucide-react";

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Book Your Service",
    desc: "Simply choose the service & book an appointment in just a few clicks.",
    color: "#00C896",
  },
  {
    icon: Truck,
    title: "Pickup & Drop",
    desc: "Our team will arrive at your location to pick up your car from your home or office at your convenience.",
    color: "#C0CA33",
  },
  {
    icon: Smartphone,
    title: "Real-Time Updates",
    desc: "Track your car's service progress digitally and get notified at every step.",
    color: "#AA66FF",
  },
  {
    icon: ThumbsUp,
    title: "Hassle-Free Delivery",
    desc: "Once the service is complete, we'll deliver your car back to you, sparkling clean and ready to go.",
    color: "#00AAFF",
  }
];

export default function Journey() {
  return (
    <section className="section-padding" style={{ background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            Your Journey, Simplified
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 650, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.6 }}>
            From the moment you book to when you get your car back, we make the entire process simple and stress-free.
          </p>
        </motion.div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                width: 280,
                minHeight: 400,
                borderRadius: 140,
                background: "#16191C",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "56px 24px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              {/* Bottom Gradient Glow */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "65%",
                background: `radial-gradient(circle at center bottom, ${step.color}50 0%, transparent 70%)`,
                opacity: 0.8,
                pointerEvents: "none",
              }} />

              {/* Icon Circle */}
              <div style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
                color: step.color,
                position: "relative",
                zIndex: 2,
              }}>
                <step.icon size={30} strokeWidth={1.5} />
              </div>

              <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: 16, position: "relative", zIndex: 2 }}>
                {step.title}
              </h3>
              
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, position: "relative", zIndex: 2 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
