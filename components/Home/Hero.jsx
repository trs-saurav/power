"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  const slides = [
    { title: 'Professional Electrical Solutions', description: 'Quality electrical services for your home and business with 30+ years of experience.', buttonText: 'Get Quote', buttonLink: '/contact-us' },
    { title: 'Solar Power Solutions', description: 'Harness clean solar energy and reduce your electricity bills with our premium installations.', buttonText: 'Learn More', buttonLink: '/services' },
    { title: 'Expert Installation & Repair', description: 'Professional UPS, battery, and electrical system installation with ongoing support.', buttonText: 'Book Service', buttonLink: '/contact-us' },
    { title: 'Why Shop With Us?', description: '15+ years experience, 10000+ happy customers, 7 days support, and 100% quality guarantee on all products and services.', buttonText: 'Shop Now', buttonLink: '/all-products' },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 8000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Static page H1 (always visible) */}
      <div className="relative z-10 pt-16 px-4">
        <h1 className="sr-only md:not-sr-only text-center text-white text-3xl md:text-5xl font-bold">
          Power Electronics – Electrical Solutions in Patna
        </h1>
      </div>

      {/* Background Patterns (unchanged) */}
      <div className="absolute inset-0">
        {/* ... existing background/circles/svg/overlay ... */}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              {/* Slide title demoted to H2 */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {slides[currentSlide].title}
              </h2>

              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                {slides[currentSlide].description}
              </p>

              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg group mb-12">
                <Link href={slides[currentSlide].buttonLink} className="flex items-center">
                  {slides[currentSlide].buttonText}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">25+</div>
                  <div className="text-sm text-white/80 font-medium">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">365 Days</div>
                  <div className="text-sm text-white/80 font-medium">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">10000+</div>
                  <div className="text-sm text-white/80 font-medium">Customers</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-300 transition-colors p-2">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-300 transition-colors p-2">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
