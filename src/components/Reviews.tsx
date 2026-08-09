"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import CurvedLoop from "./CurvedLoop";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ReviewData = {
  id: string;
  name: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  createdAt?: unknown;
};

const FALLBACK_REVIEWS: ReviewData[] = [
  {
    id: "f1",
    name: "Rohit Kumar",
    rating: 5,
    text: "I had a very good experience there. Great service and professional staff. They diagnosed the issue within an hour and fixed it the same day. Highly recommend SAM Wheels!",
    service: "Engine Diagnostics",
    date: "2 months ago",
  },
  {
    id: "f2",
    name: "Ram Bhagat",
    rating: 5,
    text: "Nice service done by them. Atmosphere is good and staff is cooperative. The Bosch diagnostic machine they use is very advanced. My car runs like new.",
    service: "Periodic Maintenance",
    date: "1 month ago",
  },
  {
    id: "f3",
    name: "Gaurav Sinha",
    rating: 5,
    text: "Pickup and drop process was smooth. Excellent dent and paint work — you cannot even tell there was a dent. The color matching was perfect. Worth every penny.",
    service: "Dent & Paint",
    date: "3 weeks ago",
  },
  {
    id: "f4",
    name: "Priya Verma",
    rating: 5,
    text: "The AC service was done perfectly. Team was transparent about what needed to be fixed and what didn't. Pricing is fair and they use only genuine Bosch parts.",
    service: "AC Service",
    date: "5 weeks ago",
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewData[]>(FALLBACK_REVIEWS);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewData));
          setReviews(fetched);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, reviews.length]);

  const navigate = (dir: 1 | -1) => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c + dir + reviews.length) % reviews.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <section
      id="reviews"
      className="section-padding"
      style={{ background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0, 102, 255, 0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        {/* Straight Text Ticker */}
        <div style={{
          position: "relative",
          zIndex: 4,
          marginBottom: 32,
          marginTop: -20,
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marquee-straight 28s linear infinite",
          }}>
            {[0, 1].map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 0, whiteSpace: "nowrap" }}>
                {["4.7★ GOOGLE RATING", "535+ HAPPY CUSTOMERS", "15+ YEARS EXPERIENCE", "30+ CAR BRANDS SERVICED", "BOSCH AUTHORIZED CENTER", "100% GENUINE PARTS"].map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                    <span style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "var(--accent)",
                      fontFamily: "Outfit, sans-serif",
                      padding: "0 32px",
                    }}>{item}</span>
                    <span style={{ color: "var(--accent)", fontSize: "0.7rem", opacity: 0.6 }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── OUR PARTNERS ── */}
        <div style={{
          position: "relative",
          zIndex: 4,
          marginBottom: 56,
          padding: "44px 0 40px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              <span style={{ color: "#FFFFFF" }}>OUR </span>
              <span style={{
                background: "linear-gradient(90deg, #FF6B6B 0%, #FFB347 30%, #00D4FF 65%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>PARTNERS</span>
            </h2>
            <p style={{
              marginTop: 8,
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.45)",
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}>
              Trusted collaborations powering better service for you
            </p>
          </div>

          {/* Partners row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "16px 28px",
          }}>
            {[
              {
                name: "Bosch",
                imgSrc: null,
                svgLogo: (
                  <svg width="100" height="36" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="2" width="56" height="56" rx="8" fill="#E2001A"/>
                    <text x="28" y="44" fontFamily="Arial, Helvetica, sans-serif" fontSize="32" fontWeight="900" fill="white" textAnchor="middle">B</text>
                    <text x="78" y="41" fontFamily="Arial Black, Helvetica, sans-serif" fontSize="26" fontWeight="900" fill="white" letterSpacing="1">BOSCH</text>
                  </svg>
                ),
              },
              { name: "Allianz Assistance", imgSrc: "/partners/allianz.svg",   svgLogo: null },
              { name: "ATS Elgi",           imgSrc: "/partners/atselgi.svg",   svgLogo: null },
              { name: "Autorox",            imgSrc: "/partners/autorox.svg",   svgLogo: null },
              { name: "Autozilla",          imgSrc: "/partners/autozilla.svg", svgLogo: null },
            ].map((partner) => (
              <div
                key={partner.name}
                title={partner.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 28px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  minWidth: 160,
                  height: 80,
                  flexShrink: 0,
                  cursor: "default",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.15)";
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
                  el.style.borderColor = "rgba(255,255,255,0.25)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.07)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                {partner.imgSrc ? (
                  <img
                    src={partner.imgSrc}
                    alt={partner.name}
                    style={{
                      height: 46,
                      maxWidth: 200,
                      objectFit: "contain",
                      opacity: 0.95,
                    }}
                  />
                ) : (
                  partner.svgLogo
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid var(--border-hover)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Customer Stories
          </span>
          <h2 className="display-lg">
            WHAT OUR{" "}
            <span className="gradient-text">CUSTOMERS SAY</span>
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              padding: "6px 16px",
              borderRadius: 100,
              background: "rgba(255, 184, 0, 0.1)",
              border: "1px solid rgba(255, 184, 0, 0.3)",
            }}
          >
            <span style={{ color: "#FFB800", fontSize: "1rem" }}>★★★★★</span>
            <span style={{ color: "var(--text)", fontWeight: 700 }}>4.7</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>based on 535+ Google reviews</span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div ref={ref} style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "44px 48px",
                position: "relative",
                overflow: "hidden",
              }}
              className="review-card-main"
            >
              {/* Blue accent border top */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 48, right: 48,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                }}
              />

              {/* Quote icon */}
              <div
                style={{
                  position: "absolute",
                  top: 24, right: 32,
                  opacity: 0.07,
                }}
              >
                <Quote size={80} color="var(--accent)" />
              </div>

              {/* Stars */}
              <div style={{ marginBottom: 20 }}>
                {"★".repeat(reviews[current]?.rating || 5).split("").map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                    style={{ color: "#FFB800", fontSize: "1.2rem" }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>

              {/* Review text */}
              <p
                style={{
                  fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                  color: "var(--text)",
                  lineHeight: 1.75,
                  marginBottom: 28,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                &ldquo;{reviews[current]?.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }} className="review-author-row">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), #00AAFF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {reviews[current]?.name?.[0] || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
                    {reviews[current]?.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {reviews[current]?.service} · {reviews[current]?.date}
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }} className="review-google-badge">
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 100,
                      background: "var(--accent-glow)",
                      border: "1px solid var(--border-hover)",
                      color: "var(--accent)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    Google Review ✓
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 32,
            }}
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
              }}
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div style={{ display: "flex", gap: 8 }}>
              {reviews.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
                  animate={{
                    width: i === current ? 24 : 8,
                    background: i === current ? "var(--accent)" : "var(--border)",
                  }}
                  style={{
                    height: 8,
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => navigate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
              }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Mini review cards background */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 40,
            opacity: 0.5,
          }}
          className="review-mini-grid"
        >
          {reviews.filter((_, i) => i !== current).slice(0, 3).map((rev, i) => (
            <div
              key={i}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <div style={{ color: "#FFB800", fontSize: "0.75rem", marginBottom: 6 }}>
                {"★".repeat(rev.rating)}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {rev.text}
              </p>
              <div style={{ marginTop: 8, fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>
                — {rev.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .review-mini-grid { display: none !important; }
        }
      `}</style>
    </section>
  );
}
