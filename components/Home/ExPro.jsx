"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Zap, Camera, Sun, Users, Award, Shield, Star, TrendingUp } from "lucide-react";

/* ── CountUp hook (React Bits pattern) ─────────────────────────── */
function useCountUp(target, active, duration = 2000, delay = 0) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [active]);
  return val;
}

/* ── Single stat tile ───────────────────────────────────────────── */
const Tile = ({ icon: Icon, color, value, suffix = "+", label, active, index }) => {
  const count = useCountUp(value, active, 2000, index * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center justify-center gap-3 p-8 text-center overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}
    >
      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 80%, ${color}18 0%, transparent 70%)` }}
        aria-hidden="true" />

      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}1a` }}>
        <Icon className="w-6 h-6" style={{ color }} aria-hidden="true" />
      </div>

      <div>
        <p className="text-4xl font-bold text-white tabular-nums leading-none">
          {count.toLocaleString()}<span className="text-2xl" style={{ color }}>{suffix}</span>
        </p>
        <p className="text-sm text-white/50 mt-2 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

const tiles = [
  { icon: Award,  color: "#f59e0b", value: 30,    suffix: "+",  label: "Years Experience" },
  { icon: Users,  color: "#60a5fa", value: 15000, suffix: "+",  label: "Happy Customers" },
  { icon: Zap,    color: "#34d399", value: 10000, suffix: "+",  label: "Wiring Projects" },
  { icon: Camera, color: "#a78bfa", value: 1000,  suffix: "+",  label: "CCTV Installed" },
  { icon: Sun,    color: "#fbbf24", value: 500,   suffix: "+",  label: "Solar Projects" },
];

export default function StatsShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* ── Background image with overlay ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1920&auto=format&fit=crop)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0" style={{ background: "rgba(2,6,23,0.88)" }} aria-hidden="true" />
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "64px 64px" }}
        aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#f59e0b" }}>
            Our Track Record
          </p>
          <h2 id="stats-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Excellence in Numbers
          </h2>
          <p className="mt-4 text-white/45 max-w-xl mx-auto text-sm sm:text-base">
            Three decades of powering homes, businesses and institutions across Bihar.
          </p>
        </motion.div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {tiles.map((t, i) => (
            <Tile key={i} {...t} active={inView} index={i} />
          ))}
        </div>

        {/* Bottom trust row */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[ "Authorized Dealer", "Industry Recognized", "Customer First"].map((t, i) => (
            <span key={i} className="px-5 py-2 rounded-full text-xs font-semibold text-white/70 tracking-wide"
              style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
