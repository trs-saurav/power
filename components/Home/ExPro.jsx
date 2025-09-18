"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Camera, 
  Sun, 
  Users, 
  Award, 
  TrendingUp,
  Star,
  Shield,
  Target,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const statsData = [
  // Experience Stats
  { 
    value: 30, 
    title: "Years Of Overall Experience", 
    icon: <Award className="w-8 h-8" />,
    category: "experience",
    color: "text-amber-600",
    gradient: "from-amber-500 to-orange-500"
  },
  { 
    value: 30, 
    title: "Years Wiring Experience", 
    icon: <Zap className="w-8 h-8" />,
    category: "experience",
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    value: 10, 
    title: "Years CCTV Experience", 
    icon: <Camera className="w-8 h-8" />,
    category: "experience",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    value: 5, 
    title: "Years Solar Experience", 
    icon: <Sun className="w-8 h-8" />,
    category: "experience",
    color: "text-orange-600",
    gradient: "from-orange-500 to-yellow-500"
  },
  
  // Project Stats
  { 
    value: 10000, 
    title: "Wiring Projects Completed", 
    icon: <Zap className="w-8 h-8" />,
    category: "projects",
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    value: 1000, 
    title: "CCTV Systems Installed", 
    icon: <Camera className="w-8 h-8" />,
    category: "projects",
    color: "text-teal-600",
    gradient: "from-teal-500 to-cyan-500"
  },
  { 
    value: 500, 
    title: "Solar Projects Delivered", 
    icon: <Sun className="w-8 h-8" />,
    category: "projects",
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-orange-500"
  },
  { 
    value: 15000, 
    title: "Satisfied Customers", 
    icon: <Users className="w-8 h-8" />,
    category: "projects",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-purple-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const StatsSlider = ({ items, title, subtitle, inView, startIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <motion.div className="mb-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          {title === "Years of Experience" ? (
            <Star className="w-6 h-6 text-primary" />
          ) : (
            <Target className="w-6 h-6 text-primary" />
          )}
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h3>
          {title === "Years of Experience" ? (
            <Star className="w-6 h-6 text-primary" />
          ) : (
            <Target className="w-6 h-6 text-primary" />
          )}
        </div>
        <p className="text-muted-foreground">{subtitle}</p>
      </motion.div>

      {/* Desktop Grid */}
      <motion.div 
        className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {items.map((item, idx) => (
          <StatsCard 
            key={`${title}-${idx}`} 
            item={item} 
            inView={inView} 
            index={idx + startIndex} 
          />
        ))}
      </motion.div>

      {/* Mobile Slider */}
      <div className="sm:hidden">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, idx) => (
              <div key={`${title}-mobile-${idx}`} className="w-full flex-shrink-0 px-4">
                <StatsCard 
                  item={item} 
                  inView={inView} 
                  index={idx + startIndex} 
                />
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentIndex 
                      ? 'bg-primary w-6' 
                      : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsShowcase = () => {
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    triggerOnce: true
  });

  const experienceStats = statsData.filter(item => item.category === "experience");
  const projectStats = statsData.filter(item => item.category === "projects");

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref}>
          
          {/* Header Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-3 text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Our Track Record
              </Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ scale: 0.8 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Excellence in
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                Numbers
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Three decades of unwavering commitment to electrical excellence, 
              powering thousands of projects across Bihar and beyond.
            </motion.p>
          </motion.div>

          {/* Experience Section with Slider */}
          <StatsSlider
            items={experienceStats}
            title="Years of Experience"
            subtitle="Decades of expertise across multiple electrical domains"
            inView={inView}
            startIndex={0}
          />

          {/* Projects Section with Slider */}
          <StatsSlider
            items={projectStats}
            title="Projects Delivered"
            subtitle="Successful installations and satisfied customers across Bihar"
            inView={inView}
            startIndex={4}
          />

          {/* Trust Indicators */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-3xl p-8 border border-primary/10">
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium">ISO Certified Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Industry Recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Customer First Approach</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StatsCard = ({ item, inView, index }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      const startDelay = index * 150;
      
      setTimeout(() => {
        let currentValue = 0;
        const increment = Math.ceil(item.value / 50);
        const interval = setInterval(() => {
          if (currentValue >= item.value) {
            setCount(item.value);
            clearInterval(interval);
            setHasAnimated(true);
          } else {
            currentValue += increment;
            setCount(Math.min(currentValue, item.value));
          }
        }, 30);

        return () => clearInterval(interval);
      }, startDelay);
    }
  }, [inView, item.value, hasAnimated, index]);

  return (
    <motion.div
      className="group relative"
      variants={cardVariants}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-8 h-full">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
          
          {/* Icon */}
          <motion.div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            {item.icon}
          </motion.div>

          {/* Counter */}
          <motion.div
            className="space-y-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1 + 0.5,
              type: "spring"
            }}
          >
            <div className={`text-4xl lg:text-5xl font-bold ${item.color}`}>
              {count.toLocaleString()}+
            </div>
            <div className={`w-12 h-1 bg-gradient-to-r ${item.gradient} rounded-full mx-auto`}></div>
          </motion.div>

          {/* Title */}
          <motion.p
            className="text-sm lg:text-base text-muted-foreground leading-tight font-medium max-w-xs"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1 + 0.7
            }}
          >
            {item.title}
          </motion.p>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      </div>
    </motion.div>
  );
};

export default StatsShowcase;
