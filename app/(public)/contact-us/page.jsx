"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { 
  Mail, 
  MapPin, 
  MessageCircle, 
  Phone,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setDisabled(true);
    const loadingToast = toast.loading("Transmitting consultation data...");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const result = await response.json();

      if (result.success) {
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        toast.success("Inquiry received. Our engineering team will contact you shortly.", { id: loadingToast });
      } else {
        throw new Error(result.message || 'Failed to send');
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Transmission failed. Please call us directly.", { id: loadingToast });
    } finally {
      setDisabled(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Technical RFPs",
      desc: "For detailed project specs.",
      info: "powerele9@gmail.com",
      link: "mailto:powerele9@gmail.com",
      color: "blue"
    },
    {
      icon: MessageCircle,
      title: "Live Operations",
      desc: "Instant engineering support.",
      info: "WhatsApp Our Team",
      link: "https://wa.me/917004135756",
      color: "green"
    },
    {
      icon: MapPin,
      title: "Corporate HQ",
      desc: "In-person consultations.",
      info: "Gulzarbagh, Patna, Bihar",
      link: "https://maps.app.goo.gl/y5EKbUTbM1kuyw867",
      color: "amber"
    },
    {
      icon: Phone,
      title: "Direct Line",
      desc: "24/7 Priority Support.",
      info: "+91 9334150024",
      link: "tel:9334150024",
      color: "red"
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white font-body antialiased overflow-x-hidden">
      
      {/* ── 1. PREMIUM HERO SECTION ── */}
      <header className="relative min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/about/contact_hero.png"
            alt="Corporate Consultation Center"
            fill
            priority
            className="object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/80 via-transparent to-[#0a0a0b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-[#0a0a0b]/40" />
        </div>

        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Project Initiation</span>
          </motion.div>
          <motion.h1 
            variants={fadeUp} 
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[0.9] tracking-tighter mb-6 uppercase"
          >
            PARTNER WITH <br/>
            <span className="text-blue-500 italic">EXCELLENCE.</span>
          </motion.h1>
          <motion.p 
            variants={fadeUp} 
            className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            Connect with our certified electrical engineers to architect your next mission-critical infrastructure.
          </motion.p>
        </motion.div>
      </header>

      {/* ── 2. FORM & CONTACT CARDS SECTION ── */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: INFORMATION & CARDS */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 tracking-tight uppercase">Reach Our <span className="text-blue-500 italic">Experts.</span></h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you need a custom quote, technical audit, or have urgent operational queries, our team is equipped to provide surgical precision in every response.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              {contactMethods.map((method, index) => (
                <motion.a
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  key={index}
                  variants={fadeUp}
                  className="group block p-4 bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                    <method.icon className="w-10 h-10" />
                  </div>
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="p-2 bg-blue-500/10 rounded-none border border-blue-500/20 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                      <method.icon className="w-4.5 h-4.5 text-blue-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base mb-1 uppercase tracking-wider group-hover:text-blue-400 transition-colors">{method.title}</h3>
                      <p className="text-[10px] text-slate-500 mb-1.5 leading-tight">{method.desc}</p>
                      <span className="inline-flex items-center text-[9px] font-black text-blue-500 uppercase tracking-widest">
                        {method.info} <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: LEAD GEN FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-white/5 border border-white/10 p-6 sm:p-10 relative overflow-hidden"
          >
            {/* Decorative Grid */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-black text-white mb-2 tracking-tighter uppercase">Request <span className="text-blue-500">Consultation.</span></h2>
                <p className="text-slate-400 text-[10px] tracking-wide uppercase">
                  Response Guaranteed Within 24 Business Hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. ARTHUR STERLING"
                      required
                      className="w-full bg-white/5 border border-white/10 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Operational Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 000 000 0000"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="CORPORATE@FACILITY.COM"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Technical Details / Inquiry</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="DESCRIBE INFRASTRUCTURE REQUIREMENTS..."
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={disabled}
                    className={`w-full group relative flex justify-center items-center py-4 px-8 text-white font-black text-[10px] tracking-[0.3em] uppercase transition-all duration-500 overflow-hidden
                      ${disabled 
                        ? 'bg-slate-800 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transform hover:-translate-y-1'
                      }`}
                  >
                    {disabled ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                        Transmitting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-4 h-4 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        INITIATE CONSULTATION
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. TRUST SECTION ── */}
      <section className="py-24 border-t border-white/5 bg-[#0a0a0b]/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { icon: ShieldCheck, title: "Secure Protocol", desc: "All transmissions are encrypted via internal corporate nodes." },
            { icon: Zap, title: "Rapid Response", desc: "Project managers assigned within 24 operational hours." },
            { icon: Globe, title: "Regional Power", desc: "Deploying mission-critical electrical solutions across Bihar." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-none bg-white/5 flex items-center justify-center mb-6 border border-white/10 group hover:border-blue-500/50 transition-colors">
                <item.icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-heading font-black uppercase text-xl mb-4 tracking-tighter">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
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
