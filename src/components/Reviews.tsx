"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import MaterialSymbol from "./core/MaterialSymbol";
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

const CAR_BRANDS = [
  { name: "Maruti Suzuki", slug: "maruti-suzuki" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "Tata Motors", slug: "tata-motors" },
  { name: "Mahindra", slug: "mahindra" },
  { name: "Toyota", slug: "toyota" },
  { name: "Honda", slug: "honda" },
  { name: "Kia", slug: "kia" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Skoda", slug: "skoda" },
  { name: "MG Motors", slug: "mg-motors" },
  { name: "Renault", slug: "renault" },
  { name: "BMW", slug: "bmw" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "Audi", slug: "audi" },
  { name: "Ford", slug: "ford" },
  { name: "Jeep", slug: "jeep" },
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
    }, 5000);
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
      {/* Ambient Glow */}
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
          marginBottom: 24,
          marginTop: -20,
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marquee-straight 30s linear infinite",
          }}>
            {[0, 1].map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 0, whiteSpace: "nowrap" }}>
                {["4.7★ GOOGLE RATING", "535+ HAPPY CUSTOMERS", "15+ YEARS EXPERIENCE", "30+ CAR BRANDS SERVICED", "BOSCH AUTHORIZED CENTER", "100% GENUINE PARTS"].map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                    <span style={{
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      fontFamily: "Outfit, sans-serif",
                      padding: "0 28px",
                    }}>{item}</span>
                    <span style={{ color: "var(--accent)", fontSize: "0.7rem", opacity: 0.5 }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Car Brand Partner Badges Marquee (Sleek Automotive Monochrome) */}
        <div style={{
          position: "relative",
          zIndex: 4,
          marginBottom: 52,
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marquee-straight-reverse 35s linear infinite",
          }}>
            {[0, 1].map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 40, paddingRight: 40 }}>
                {CAR_BRANDS.map((brand) => (
                  <div
                    key={brand.slug}
                    title={brand.name}
                    className="brand-logo-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      cursor: "pointer",
                      padding: "6px 10px",
                    }}
                  >
                    <img
                      src={`/brand-logos/${brand.slug}.svg?v=vibrant_v3`}
                      alt={brand.name}
                      loading="lazy"
                      style={{
                        height: 38,
                        maxWidth: 72,
                        width: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
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
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Customer Stories
          </span>
          <h2 className="display-lg">
            WHAT OUR{" "}
            <span className="gradient-text">CUSTOMERS SAY</span>
          </h2>

          {/* Authentic Google Reviews Trust Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 18,
              padding: "8px 20px",
              borderRadius: 100,
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.05)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MaterialSymbol key={i} name="star" size={15} fill color="#F59E0B" />
              ))}
            </div>
            <span style={{ color: "var(--text)", fontWeight: 800, fontSize: "0.92rem" }}>4.7</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600 }}>· 535+ Google Reviews</span>
          </div>
        </motion.div>

        {/* Carousel Main Testimonial Card */}
        <div ref={ref} style={{ position: "relative", maxWidth: 820, margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: "36px 42px",
                position: "relative",
                boxShadow: "0 14px 40px rgba(0, 0, 0, 0.08)",
              }}
              className="review-card-main"
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 32, right: 32,
                  height: 3,
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  borderRadius: "3px 3px 0 0",
                }}
              />

              {/* Stars & Verified Badge Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: reviews[current]?.rating || 5 }).map((_, i) => (
                    <MaterialSymbol key={i} name="star" size={18} fill color="#F59E0B" />
                  ))}
                </div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  color: "#10B981",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                }}>
                  <MaterialSymbol name="verified" size={14} fill color="#10B981" />
                  <span>Verified Google Review</span>
                </div>
              </div>

              {/* Review Text */}
              <p
                style={{
                  fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)",
                  color: "var(--text)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                  fontWeight: 500,
                }}
              >
                &ldquo;{reviews[current]?.text}&rdquo;
              </p>

              {/* Author Row */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid var(--border)", paddingTop: 18 }} className="review-author-row">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), #0044CC)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1rem",
                    color: "white",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0, 102, 255, 0.3)",
                  }}
                >
                  {reviews[current]?.name?.[0] || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text)" }}>
                    {reviews[current]?.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {reviews[current]?.service} · {reviews[current]?.date}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginTop: 24,
            }}
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <MaterialSymbol name="arrow_back" size={18} />
            </motion.button>

            <div style={{ display: "flex", gap: 6 }}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
                  style={{
                    width: i === current ? 22 : 7,
                    height: 7,
                    borderRadius: 100,
                    background: i === current ? "var(--accent)" : "var(--border)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => navigate(1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <MaterialSymbol name="arrow_forward" size={18} />
            </motion.button>
          </div>
        </div>

        {/* 3 Solid Secondary Review Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 36,
          }}
          className="review-mini-grid"
        >
          {reviews.filter((_, i) => i !== current).slice(0, 3).map((rev, i) => (
            <div
              key={i}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "18px 20px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                  {Array.from({ length: rev.rating }).map((_, rIdx) => (
                    <MaterialSymbol key={rIdx} name="star" size={14} fill color="#F59E0B" />
                  ))}
                </div>
                <p style={{
                  fontSize: "0.85rem",
                  color: "var(--text)",
                  lineHeight: 1.55,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>
                  {rev.name}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {rev.service}
                </span>
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
