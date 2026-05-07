"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop",
    badge: "30+ Years of Trusted Excellence",
    headline: "Power That\nNever Stops",
    sub: "Bihar's most trusted name in electrical solutions — wiring, solar, UPS, CCTV and beyond.",
    cta1: { label: "Get Free Quote", href: "/contact-us" },
    cta2: { label: "Our Services",   href: "/services" },
  },
  {
    image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=1920&auto=format&fit=crop",
    badge: "Clean & Renewable Energy",
    headline: "Go Solar,\nSave More",
    sub: "Cut electricity bills with premium solar installations from India's leading brands.",
    cta1: { label: "Solar Quote",     href: "/contact-us" },
    cta2: { label: "Learn More",      href: "/services" },
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format&fit=crop",
    badge: "Professional Surveillance",
    headline: "Secure Every\nCorner",
    sub: "Expert CCTV installation with CP Plus and Dahua — 24/7 monitoring for homes and businesses.",
    cta1: { label: "Book Install",    href: "/contact-us" },
    cta2: { label: "View Products",   href: "/all-products" },
  },
];

const stats = [
  { value: "30+", label: "Years Experience" },
  { value: "15K+", label: "Happy Customers" },
  { value: "500+", label: "Solar Projects" },
  { value: "24/7", label: "Support" },
];

export default function HeroSection() {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  const restart = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIdx(p => (p + 1) % slides.length), 6500);
  };

  useEffect(() => { restart(); return () => clearInterval(timer.current); }, []);

  const go = i => { setIdx(i); restart(); };
  const s = slides[idx];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden" aria-label="Hero">

      {/* ── Background image ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${s.image})` }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          aria-hidden="true"
        />
      </AnimatePresence>

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to right, rgba(3,7,18,0.88) 0%, rgba(3,7,18,0.65) 55%, rgba(3,7,18,0.3) 100%)"
      }} aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase"
              style={{ borderColor: "rgba(251,191,36,0.4)", color: "#fbbf24", background: "rgba(251,191,36,0.08)" }}>
              <Zap className="w-3 h-3" aria-hidden="true" />
              {s.badge}
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
              style={{ whiteSpace: "pre-line" }}>
              {s.headline}
            </h1>

            {/* Sub */}
            <p className="text-base sm:text-lg text-white/65 leading-relaxed mb-10 max-w-lg">
              {s.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href={s.cta1.href}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-2xl hover:shadow-amber-500/20"
                style={{ background: "#f59e0b", color: "#0c0a09" }}>
                {s.cta1.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href={s.cta2.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm text-white transition-all duration-300 hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.3)" }}>
                {s.cta2.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Slide dots ── */}
        <div className="absolute bottom-28 left-6 lg:left-12 flex gap-2" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} role="tab" aria-selected={i === idx}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-500 rounded-full focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
              style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? "#f59e0b" : "rgba(255,255,255,0.3)" }}
            />
          ))}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20"
        style={{ background: "rgba(3,7,18,0.7)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-4 divide-x divide-white/10 py-4">
            {stats.map((st, i) => (
              <div key={i} className="flex flex-col items-center py-2">
                <span className="text-xl sm:text-2xl font-bold text-white">{st.value}</span>
                <span className="text-[11px] sm:text-xs text-white/50 mt-0.5 tracking-wide">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
