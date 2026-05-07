"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { 
  MailIcon, 
  MapPinIcon, 
  MessageCircle, 
  PhoneIcon,
  Send,
  ArrowRight
} from "lucide-react";

export default function ContactUsPage() {
  // Form State
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
    toast.loading("Sending your message...", { id: 'sending' });

    const data = {
      form_name: name,
      form_number: phone,
      form_email: email,
      form_message: message,
    };

    try {
      await emailjs.send("service_i4bh7ri", "template_peffz3o", data, "RGLfHvoDvDi5xc9lh");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      toast.success("Message sent successfully! Our engineering team will contact you shortly.", { id: 'sending' });
    } catch (error) {
      console.error("Email sending failed:", error);
      toast.error("Failed to send message. Please try again or call us directly.", { id: 'sending' });
    } finally {
      setDisabled(false);
    }
  };

  const contactMethods = [
    {
      icon: <MailIcon className="w-6 h-6 text-[#1E40AF]" />,
      title: "Email Inquiries",
      desc: "For detailed project specifications and RFP submissions.",
      info: "powerele9@gmail.com",
      link: "mailto:powerele9@gmail.com",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#1E40AF]" />,
      title: "WhatsApp Chat",
      desc: "Instant support for urgent operational queries.",
      info: "Message Our Team",
      link: "https://wa.me/917004135756",
    },
    {
      icon: <MapPinIcon className="w-6 h-6 text-[#1E40AF]" />,
      title: "Corporate Office",
      desc: "Visit us for in-person engineering consultations.",
      info: "Gulzarbagh, Patna, Bihar",
      link: "https://maps.app.goo.gl/y5EKbUTbM1kuyw867",
    },
    {
      icon: <PhoneIcon className="w-6 h-6 text-[#1E40AF]" />,
      title: "Direct Phone",
      desc: "Speak immediately with our project managers.",
      info: "+91 9334150024",
      link: "tel:9334150024",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fbf8ff] text-slate-900 font-sans antialiased overflow-hidden pt-24 lg:pt-32 pb-20">
      
      {/* ── 1. SEO HERO / HEADER ── */}
      <header className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-28 px-6 bg-[#001453] flex flex-col items-center justify-center text-center overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-sm mx-auto max-w-[1920px]">
        {/* Engineering Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="inline-block text-[#F59E0B] font-bold tracking-widest uppercase text-sm mb-4">
            Start A Project
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Partner with Excellence
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Connect with our team of certified electrical engineers and project managers to discuss your infrastructure requirements.
          </p>
        </motion.div>
      </header>

      {/* ── 2. SPLIT LAYOUT SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 lg:-mt-12 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Contact Cards */}
          <div className="lg:col-span-5 space-y-8 lg:pt-16">
            <div>
              <h2 className="text-3xl font-bold text-[#001453] mb-4">Reach Our Experts</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you need a custom quote, technical support, or have questions about our electrical solutions, our team is ready to assist you.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactMethods.map((method, index) => (
                <motion.a
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="group block bg-white p-6 rounded-xl border border-[#e8e7f1] shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#1E40AF]"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#f4f2fc] rounded-lg group-hover:bg-[#1E40AF] transition-colors duration-300">
                      {React.cloneElement(method.icon, { 
                        className: "w-6 h-6 text-[#1E40AF] group-hover:text-white transition-colors duration-300" 
                      })}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a1b22] text-lg mb-1 group-hover:text-[#1E40AF] transition-colors">{method.title}</h3>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{method.desc}</p>
                      <span className="inline-flex items-center text-sm font-bold text-[#1E40AF]">
                        {method.info} <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* RIGHT: Lead Generation Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-[#e8e7f1]"
          >
            <div className="mb-8 border-b border-[#e8e7f1] pb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001453] mb-2">Request a Technical Consultation</h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Fill out the form below. A certified project manager will respond within 24 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-shadow"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700">Corporate Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@company.com"
                  required
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-slate-700">Project Details <span className="text-red-500">*</span></label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your electrical infrastructure requirements or query..."
                  required
                  rows={5}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-shadow resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={disabled}
                  className={`w-full flex justify-center items-center py-4 px-6 rounded-lg text-white font-bold text-lg transition-all shadow-md
                    ${disabled 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-[#1E40AF] hover:bg-[#173bab] hover:shadow-lg active:scale-[0.98]'
                    }`}
                >
                  {disabled ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Transmitting Data...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Submit Inquiry
                    </span>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  By submitting this form, you agree to our privacy policy and consent to being contacted regarding your inquiry.
                </p>
              </div>
            </form>
          </motion.div>

        </div>
      </section>

    </main>
  );
}
