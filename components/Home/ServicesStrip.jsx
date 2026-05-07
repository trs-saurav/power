"use client";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Solar Energy",
    desc: "Premium solar panels and installation for homes and commercial buildings.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop",
    tag: "Renewable",
    color: "#f59e0b",
  },
  {
    title: "CCTV & Security",
    desc: "End-to-end surveillance solutions using CP Plus and Dahua systems.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop",
    tag: "Security",
    color: "#3b82f6",
  },
  {
    title: "UPS & Batteries",
    desc: "Reliable power backup from Exide, Microtek and Eastman brands.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc2dfd4d?q=80&w=800&auto=format&fit=crop",
    tag: "Power Backup",
    color: "#10b981",
  },
  {
    title: "Electrical Wiring",
    desc: "Professional wiring and rewiring for residential and commercial sites.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=800&auto=format&fit=crop",
    tag: "Installation",
    color: "#8b5cf6",
  },
];

export default function ServicesStrip() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="py-24 bg-slate-900"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#f59e0b" }}>
            What We Do
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Our Core Services
            </h2>
            <Link href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors whitespace-nowrap">
              All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={svc.href}
                className="group relative block h-72 rounded-2xl overflow-hidden focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
                aria-label={`${svc.title} – ${svc.desc}`}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${svc.image})` }}
                  aria-hidden="true"
                />

                {/* Dark overlay — heavier at bottom */}
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.45) 55%, rgba(2,6,23,0.2) 100%)" }}
                  aria-hidden="true" />

                {/* Tag chip */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                    style={{ background: `${svc.color}22`, color: svc.color, border: `1px solid ${svc.color}44` }}>
                    {svc.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white mb-1.5">{svc.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">{svc.desc}</p>

                  {/* Arrow pill — slides up on hover */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: svc.color }}>
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>

                {/* Colored bottom border accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: svc.color }}
                  aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
