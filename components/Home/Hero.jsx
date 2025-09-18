"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Shield, 
  Award, 
  Star,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Users,
  Sparkles,
  ChevronDown
} from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Powering Your Future",
      subtitle: "With Premium Electrical Solutions",
      description: "30+ years of expertise in UPS systems, solar installations, and electrical solutions across Bihar. Trusted by 15,000+ customers.",
      image: "/hero/electrical-hero-1.jpg",
      cta: "Get Free Consultation",
      features: ["24/7 Support", "ISO Certified", "30+ Years Experience"]
    },
    {
      title: "Smart Security Solutions",
      subtitle: "Advanced CCTV & Surveillance Systems",
      description: "Protect your property with cutting-edge security technology. Professional installation and monitoring services.",
      image: "/hero/security-hero-2.jpg",
      cta: "Secure Your Space",
      features: ["AI-Powered Cameras", "Remote Monitoring", "Cloud Storage"]
    },
    {
      title: "Solar Energy Solutions",
      subtitle: "Sustainable Power for Tomorrow",
      description: "Harness the power of the sun with our premium solar installations. Reduce costs and embrace clean energy.",
      image: "/hero/solar-hero-3.jpg",
      cta: "Go Solar Today",
      features: ["Grid-Tie Systems", "Battery Storage", "25-Year Warranty"]
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-20' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-violet-500/20"></div>
          </div>
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left space-y-8"
          >
            
            {/* Badge */}


            {/* Main Headline */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {heroSlides[currentSlide].title}
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                {heroSlides[currentSlide].description}
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div variants={fadeInUp}>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {heroSlides[currentSlide].features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl"
                  >
                    <Link href="/contact-us" className="flex items-center gap-3">
                      {heroSlides[currentSlide].cta}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-border/50 hover:border-primary/50 bg-background/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link href="tel:+919334150024" className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Info */}
           
          </motion.div>

          {/* Stats/Visual Section */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">15K+</div>
                    <div className="text-sm text-muted-foreground font-medium">Happy Customers</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">30+</div>
                    <div className="text-sm text-muted-foreground font-medium">Years Experience</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground font-medium">Projects Done</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground font-medium">Support Available</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"
            />
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-16 gap-3"
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary w-8' 
                  : 'bg-border hover:bg-primary/50'
              }`}
            />
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
