"use client";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

/* ─── CSS Marquee (pure CSS, no JS jitter) ──────────────────────── */
const logos = [
  { src: "/logo/Eastman.webp",  alt: "Eastman",  label: "Power" },
  { src: "/logo/cpplus.png",    alt: "CP Plus",   label: "Security" },
  { src: "/logo/dahua.png",     alt: "Dahua",     label: "Surveillance" },
  { src: "/logo/exide.png",     alt: "Exide",     label: "Batteries" },
  { src: "/logo/microtek.webp", alt: "Microtek",  label: "UPS" },
  { src: "/logo/adani.png",     alt: "Adani",     label: "Solar" },
  { src: "/logo/oswal.png",     alt: "Oswal",     label: "Electrical" },
  { src: "/logo/pahal.png",     alt: "Pahal",     label: "Components" },
];

const LogoCard = ({ logo }) => (
  <div className="flex-shrink-0 w-36 h-20 mx-3 rounded-xl border border-slate-100 bg-white flex flex-col items-center justify-center gap-1.5 px-4 hover:border-blue-200 hover:shadow-md transition-all duration-300 group cursor-default">
    <div className="relative w-20 h-10">
      <Image
        src={logo.src}
        alt={logo.alt}
        fill
        className="object-contain group-hover:scale-105 transition-transform duration-300"
        sizes="80px"
      />
    </div>
    <span className="text-[9px] tracking-widest uppercase font-semibold text-slate-400">{logo.label}</span>
  </div>
);

export default function CirLogo() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 bg-slate-50 overflow-hidden" aria-labelledby="partners-heading" ref={ref}>

      {/* Inject keyframe once */}
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .marquee-left  { animation: marquee-left  32s linear infinite; }
        .marquee-right { animation: marquee-right 38s linear infinite; }
        .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Authorized Partners</p>
          <h2 id="partners-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Brands You Can Trust
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            We are authorized dealers for India's leading electrical and security brands — every product is 100% genuine with full warranty.
          </p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Row 1 — left */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent" />
          <div className="flex marquee-left" style={{ width: "max-content" }}>
            {[...logos, ...logos].map((logo, i) => <LogoCard key={i} logo={logo} />)}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent" />
          <div className="flex marquee-right" style={{ width: "max-content" }}>
            {[...[...logos].reverse(), ...[...logos].reverse()].map((logo, i) => <LogoCard key={i} logo={logo} />)}
          </div>
        </div>
      </motion.div>

      {/* Trust pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mt-12 px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {[
          { dot: "#22c55e", label: "Authorized Dealer" },
          { dot: "#3b82f6", label: "Certified Service Center" },
          { dot: "#a855f7", label: "100% Genuine Products" },
          { dot: "#f59e0b", label: "Extended Warranty" },
        ].map(({ dot, label }, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} aria-hidden="true" />
            {label}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
