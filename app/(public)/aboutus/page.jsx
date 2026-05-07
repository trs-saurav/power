"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lightbulb, 
  CheckCircle2, 
  Lock, 
  Wrench, 
  Sun, 
  Camera, 
  Zap,
  ArrowRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#fbf8ff] text-slate-900 font-sans antialiased overflow-hidden">
      
      {/* ── 1. SEO HERO SECTION ── */}
      <header className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center text-center">
        {/* Background Image with Deep Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop"
            alt="Advanced industrial infrastructure facility"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1E40AF]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001453]/60 to-[#1a1b22]/90" />
        </div>

        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={fadeUp} 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
          >
            Engineering the Future of Power
          </motion.h1>
          <motion.p 
            variants={fadeUp} 
            className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Three decades of established excellence, delivering high-specification industrial and commercial electrical infrastructure.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link 
              href="#contact" 
              className="inline-flex items-center justify-center bg-[#F59E0B] text-slate-900 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-amber-400 transition-colors focus:ring-4 focus:ring-amber-500/50"
            >
              Partner with Excellence <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* ── 2. OUR LEGACY (History) ── */}
      <section className="py-20 lg:py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1E40AF] mb-6">
              Three Decades of Technical Excellence
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 leading-relaxed mb-6">
              Founded in 1994, Industrial Electrical Solutions began as a specialized contractor focusing on complex industrial installations. Over the past 30 years, we have evolved into a multi-disciplinary firm, pioneering advancements in power distribution and smart infrastructure.
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 leading-relaxed">
              Our legacy is built on mathematical consistency, strict adherence to safety protocols, and an unwavering commitment to operational clarity. We treat every project as a critical component, ensuring absolute reliability for facility managers and high-end residential clients alike.
            </motion.p>
          </motion.div>
          
          <motion.figure 
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
              alt="Engineering team reviewing technical blueprints"
              fill
              className="object-cover"
            />
          </motion.figure>
        </div>
      </section>

      {/* ── 3. MISSION & VISION ── */}
      <section className="py-20 bg-[#f4f2fc]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.article variants={fadeUp} className="bg-white p-10 rounded-2xl shadow-sm border border-[#e8e7f1]">
              <div className="w-14 h-14 bg-[#e8e7f1] rounded-xl flex items-center justify-center mb-6">
                <TargetIcon className="w-7 h-7 text-[#1E40AF]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To provide innovative, safe, and sustainable electrical solutions that empower industries to operate at peak efficiency with zero downtime.
              </p>
            </motion.article>

            <motion.article variants={fadeUp} className="bg-[#1E40AF] p-10 rounded-2xl shadow-lg border border-[#00288e] text-white">
              <div className="w-14 h-14 bg-[#00288e] rounded-xl flex items-center justify-center mb-6">
                <GlobeIcon className="w-7 h-7 text-blue-200" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                To serve as the global benchmark for electrical infrastructure, setting standard in technical precision and corporate reliability.
              </p>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* ── 4. CORE VALUES ── */}
      <section className="py-20 lg:py-28 bg-white border-t border-[#e8e7f1]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E40AF] mb-4">Core Values</h2>
            <p className="text-lg text-slate-600">The principles that guarantee our operational clarity.</p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Shield, title: "Integrity", desc: "Uncompromising honesty in every technical assessment." },
              { icon: Lightbulb, title: "Innovation", desc: "Forward-thinking design for modern infrastructure." },
              { icon: CheckCircle2, title: "Reliability", desc: "Systems engineered for absolute uptime." },
              { icon: Lock, title: "Safety", desc: "Strict adherence to global safety standards." }
            ].map((val, idx) => (
              <motion.article key={idx} variants={fadeUp} className="flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-[#f4f2fc] flex items-center justify-center mb-6">
                  <val.icon className="w-8 h-8 text-[#1E40AF]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. SERVICES SUMMARY ── */}
      <section className="py-20 lg:py-28 bg-[#1a1b22] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Specialized Solutions</h2>
              <p className="text-lg text-slate-400">Comprehensive capabilities for industrial demands.</p>
            </div>
            <Link 
              href="/#services" 
              className="text-[#F59E0B] font-bold hover:text-amber-400 flex items-center transition-colors"
            >
              Explore All Services <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Wrench, title: "Industrial Wiring", desc: "Heavy-duty power distribution." },
              { icon: Sun, title: "Solar Solutions", desc: "Scalable photovoltaic networks." },
              { icon: Camera, title: "CCTV Systems", desc: "Integrated security monitoring." },
              { icon: Zap, title: "UPS Infrastructure", desc: "Uninterruptible power supply." }
            ].map((service, idx) => (
              <motion.article 
                key={idx} variants={fadeUp} 
                className="bg-[#2f3037] border border-[#444653] p-8 rounded-xl hover:border-[#1E40AF] hover:bg-[#1E40AF]/10 transition-colors"
              >
                <service.icon className="w-10 h-10 text-[#F59E0B] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400">{service.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Minimal Icons for Mission & Vision to avoid importing too many things
function TargetIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function GlobeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
