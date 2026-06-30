"use client";
import { motion, useMotionValue, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { CalendarCheck, Truck, Smartphone, ThumbsUp } from "lucide-react";
import React from "react";

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

function JourneyCard({ step, index }: { step: typeof STEPS[0], index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${useTransform(smoothX, v => v * 100)}% ${useTransform(smoothY, v => v * 100)}%, ${step.color}35 0%, transparent 60%)`;
  const outerGlow = useMotionTemplate`radial-gradient(circle at ${useTransform(smoothX, v => v * 100)}% ${useTransform(smoothY, v => v * 100)}%, ${step.color}60 0%, transparent 60%)`;

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        width: 280,
        position: "relative",
      }}
    >
      {/* Outer tracking glow (blurred behind the card) */}
      <motion.div
        style={{
          position: "absolute",
          inset: -15,
          background: outerGlow,
          filter: "blur(20px)",
          zIndex: 0,
          borderRadius: 140,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Actual Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          minHeight: 400,
          borderRadius: 140,
          background: "var(--card)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "56px 24px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          transformStyle: "preserve-3d",
          zIndex: 1,
        }}
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Inner Tracking Glare */}
        <motion.div 
          style={{
            position: "absolute",
            inset: 0,
            background: glareBackground,
            zIndex: 0,
            pointerEvents: "none",
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Default static bottom glow */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "65%",
          background: `radial-gradient(circle at center bottom, ${step.color}25 0%, transparent 70%)`,
          opacity: 0.8,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Card Content */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(128,128,128,0.05)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          color: step.color,
          position: "relative",
          zIndex: 2,
          transform: "translateZ(30px)", 
        }}>
          <step.icon size={30} strokeWidth={1.5} />
        </div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: 16, position: "relative", zIndex: 2, transform: "translateZ(20px)" }}>
          {step.title}
        </h3>
        
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, position: "relative", zIndex: 2, transform: "translateZ(10px)" }}>
          {step.desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

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
            <JourneyCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
