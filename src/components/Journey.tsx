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
    image: "/images/book-service-promo.jpg",
  },
  {
    icon: Truck,
    title: "Pickup & Drop",
    desc: "Our team will arrive at your location to pick up your car from your home or office at your convenience.",
    color: "#C0CA33",
    image: "/images/pickup-drop-promo.png",
  },
  {
    icon: Smartphone,
    title: "Real-Time Updates",
    desc: "Track your car's service progress digitally and get notified at every step.",
    color: "#AA66FF",
    image: "/images/real-time-updates-promo.jpg",
  },
  {
    icon: ThumbsUp,
    title: "Hassle-Free Delivery",
    desc: "Once the service is complete, we'll deliver your car back to you, sparkling clean and ready to go.",
    color: "#00AAFF",
    image: "/images/hassle-free-delivery-promo.jpg",
  }
];

function JourneyCard({ step, index }: { step: typeof STEPS[0], index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${useTransform(smoothX, v => v * 100)}% ${useTransform(smoothY, v => v * 100)}%, ${step.color}35 0%, transparent 60%)`;
  const outerGlow = useMotionTemplate`radial-gradient(circle at ${useTransform(smoothX, v => v * 100)}% ${useTransform(smoothY, v => v * 100)}%, ${step.color}50 0%, transparent 60%)`;

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full relative"
      style={{
        perspective: 1000,
      }}
    >
      {/* Outer tracking glow */}
      <motion.div
        className="hidden sm:block absolute -inset-2 rounded-2xl filter blur-xl z-0 pointer-events-none"
        style={{
          background: outerGlow,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Actual Card */}
      <motion.div
        className="w-full relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-sm bg-white aspect-square"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          zIndex: 1,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {/* Inner Tracking Glare */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: glareBackground,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card Content - Promo Image */}
        {step.image ? (
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover relative z-0"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background: "rgba(128,128,128,0.05)",
                border: "1px solid var(--border)",
                color: step.color,
              }}
            >
              <step.icon size={22} strokeWidth={1.75} />
            </div>

            <h3 className="text-sm sm:text-base font-bold mb-1.5 text-gray-900">
              {step.title}
            </h3>
            
            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
              {step.desc}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Journey() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50/50 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 max-w-2xl w-full"
        >
          <div className="text-[11px] font-bold tracking-widest text-[#E2001A] uppercase mb-1.5">
            SEAMLESS SERVICE EXPERIENCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Your Journey, Simplified
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            From the moment you book to when you get your car back, we make the entire process simple, transparent, and stress-free.
          </p>
        </motion.div>

        {/* 2x2 Grid on Mobile, 4-Cols on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {STEPS.map((step, i) => (
            <JourneyCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
