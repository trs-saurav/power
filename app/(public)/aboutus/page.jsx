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
  Zap,
  ArrowRight,
  Target,
  Globe,
  Award,
  Users
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white font-body antialiased overflow-x-hidden">
      
      {/* ── 1. PREMIUM HERO SECTION ── */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/about/hero.png"
            alt="Advanced industrial infrastructure"
            fill
            priority
            className="object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/80 via-transparent to-[#0a0a0b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-[#0a0a0b]/40" />
        </div>

        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        >
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">30 Years of Excellence</span>
            </motion.div>
            <motion.h1 
              variants={fadeUp} 
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[0.9] tracking-tighter mb-6"
            >
              OBSIDIAN <br/>
              <span className="text-blue-500 italic">PRECISION.</span>
            </motion.h1>
            <motion.p 
              variants={fadeUp} 
              className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mb-10"
            >
              Redefining electrical infrastructure through technical mastery and uncompromising standards since 1994.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link 
                href="/contact-us" 
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-none transition-all duration-300 transform hover:translate-x-2"
              >
                REQUEST A CONSULTATION <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 hidden lg:block opacity-20">
          <p className="font-heading text-sm tracking-[0.5em] vertical-text">POWER. SYSTEMS. SECURITY.</p>
        </div>
      </header>

      {/* ── 2. OUR LEGACY (Text Left, Image Right) ── */}
      <section className="py-24 lg:py-40 px-6 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
              A Legacy Built on <br/>
              <span className="text-blue-500">Structural Integrity.</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                Founded in Patna, Industrial Electrical Solutions began with a singular focus: to provide industrial-grade reliability in an era of rapid expansion. Over three decades, we have evolved from a specialized contractor into a multi-disciplinary powerhouse.
              </p>
              <p>
                We don&apos;t just install systems; we engineer long-term operational stability. Our legacy is etched into the power grids and security infrastructures of the region&apos;s most critical facilities.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <p className="text-4xl font-heading font-black text-white">30+</p>
                <p className="text-sm text-blue-400 uppercase tracking-widest mt-2">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-black text-white">500+</p>
                <p className="text-sm text-blue-400 uppercase tracking-widest mt-2">Industrial Projects</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative h-[500px] lg:h-[600px] w-full"
          >
            <div className="absolute -inset-4 border border-blue-500/20 translate-x-8 translate-y-8 z-0" />
            <div className="relative z-10 h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
              <Image 
                src="/about/story.png"
                alt="Engineering team reviewing blueprints"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 p-8 z-20 hidden md:block">
              <Award className="w-12 h-12 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. MISSION & VISION (Full Width Background) ── */}
      <section className="relative py-32 lg:py-48 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/about/solar.png"
            alt="Sustainable solar array"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#0a0a0b]/90 mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeUp} className="bg-white/5 backdrop-blur-xl p-12 border border-white/10 group hover:bg-white/10 transition-all duration-500">
              <Target className="w-12 h-12 text-blue-500 mb-8 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-heading font-bold mb-6">Our Mission</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                To provide innovative, safe, and sustainable electrical solutions that empower industries to operate at peak efficiency with zero downtime. We bridge the gap between legacy hardware and modern intelligence.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-blue-600 p-12 group hover:bg-blue-500 transition-all duration-500">
              <Globe className="w-12 h-12 text-white mb-8 transform group-hover:rotate-12 transition-transform" />
              <h3 className="text-3xl font-heading font-bold mb-6 text-white">Our Vision</h3>
              <p className="text-blue-50/80 text-lg leading-relaxed">
                To serve as the global benchmark for electrical infrastructure, setting the standard in technical precision and corporate reliability as we transition toward autonomous power networks.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. EXPERTISE (Image Left, Text Right) ── */}
      <section className="py-24 lg:py-40 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative h-[500px] lg:h-[600px] w-full"
          >
            <div className="absolute -inset-4 border border-black/5 -translate-x-8 translate-y-8 z-0" />
            <div className="relative z-10 h-full w-full overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
                alt="Technical infrastructure"
                fill
                className="object-cover transform hover:scale-110 transition-transform duration-1000"
              />
            </div>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="order-1 lg:order-2"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
              Engineering the <br/>
              <span className="text-blue-600">Invisible Machine.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 text-lg leading-relaxed mb-8">
              We specialize in high-tension industrial installations, complex UPS infrastructure, and AI-integrated security networks. Every project is approached with mathematical consistency and a focus on operational clarity.
            </motion.p>
            
            <motion.div variants={fadeUp} className="space-y-4">
              {[
                "Industrial Power Distribution",
                "Scalable Solar Networks",
                "Advanced CCTV & AI Surveillance",
                "Uninterruptible Power Supply (UPS)"
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 group">
                  <div className="w-6 h-[2px] bg-blue-600 group-hover:w-10 transition-all duration-300" />
                  <span className="font-bold uppercase tracking-widest text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. CORE VALUES (Grid) ── */}
      <section className="py-24 lg:py-40 px-6 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold mb-4"
            >
              The Pillars of Our <br/> <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8 italic">Authority.</span>
            </motion.h2>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { icon: Shield, title: "Precision", desc: "Every connection is executed with surgical accuracy." },
              { icon: Zap, title: "Power", desc: "Systems built to withstand extreme industrial demands." },
              { icon: Lock, title: "Security", desc: "Protection is our fundamental requirement, not a feature." },
              { icon: Users, title: "Legacy", desc: "Decades of trust translated into every new installation." }
            ].map((val, idx) => (
              <motion.article 
                key={idx} variants={fadeUp} 
                className="group relative p-10 bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <val.icon className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20">
                    <val.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-wider">{val.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. TEAM CTA ── */}
      <section className="py-24 bg-blue-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Zap className="w-96 h-96 text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-4 tracking-tighter uppercase">Ready to partner <br className="hidden md:block"/> with excellence?</h2>
            <p className="text-blue-100 text-lg opacity-80">Let&apos;s build your infrastructure with obsidian precision.</p>
          </div>
          <Link 
            href="/contact-us" 
            className="inline-flex items-center justify-center bg-white text-blue-600 font-black px-12 py-6 rounded-none shadow-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
          >
            START YOUR PROJECT
          </Link>
        </div>
      </section>
      
      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .font-heading {
          font-family: var(--font-outfit), sans-serif;
        }
        .font-body {
          font-family: var(--font-inter), sans-serif;
        }
      `}</style>
    </main>
  );
}
