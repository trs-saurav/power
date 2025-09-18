"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Zap, 
  Shield, 
  Sun, 
  Camera, 
  Settings, 
  Wrench,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Users,
  Phone,
  Sparkles,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const servicesData = [
  {
    id: "ups-battery",
    icon: <Zap className="w-8 h-8" />,
    title: "UPS & Battery Solutions",
    description: "Enterprise-grade backup power systems with smart monitoring and predictive maintenance for zero downtime operations.",
    features: ["Smart UPS Systems", "Lithium-Ion Batteries", "Remote Monitoring", "24/7 Emergency Support"],
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    projects: "500+",
    rating: "4.9"
  },
  {
    id: "voltage-stabilizers",
    icon: <Settings className="w-8 h-8" />,
    title: "Voltage Stabilizers",
    description: "Advanced voltage regulation technology protecting critical infrastructure with real-time adaptive control systems.",
    features: ["Servo Stabilizers", "Static Stabilizers", "Digital Display", "Wide Input Range"],
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    projects: "750+",
    rating: "4.8"
  },
  {
    id: "solar-systems",
    icon: <Sun className="w-8 h-8" />,
    title: "Solar Power Systems",
    description: "Next-generation solar solutions with integrated energy storage and smart grid connectivity for maximum efficiency.",
    features: ["Monocrystalline Panels", "Hybrid Inverters", "Battery Storage", "Net Metering"],
    color: "text-orange-600",
    gradient: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    projects: "300+",
    rating: "4.9"
  },
  {
    id: "cctv-security",
    icon: <Camera className="w-8 h-8" />,
    title: "CCTV & Security Systems",
    description: "Intelligent surveillance with AI-powered analytics, facial recognition, and cloud-based management platforms.",
    features: ["4K IP Cameras", "AI Analytics", "Mobile Access", "Cloud Storage"],
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    projects: "400+",
    rating: "4.7"
  },
  {
    id: "electrical-wiring",
    icon: <Wrench className="w-8 h-8" />,
    title: "Electrical Installation",
    description: "Complete electrical solutions from residential wiring to industrial installations with safety certifications.",
    features: ["Industrial Wiring", "Home Automation", "Safety Compliance", "Load Calculations"],
    color: "text-red-600",
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    projects: "1000+",
    rating: "4.8"
  },
  {
    id: "maintenance",
    icon: <Shield className="w-8 h-8" />,
    title: "AMC & Support Services",
    description: "Comprehensive Annual Maintenance Contracts with proactive monitoring and guaranteed response times.",
    features: ["Preventive Maintenance", "Emergency Response", "System Upgrades", "Performance Reports"],
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    projects: "200+",
    rating: "4.9"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
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

const headerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const Services = () => {
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    triggerOnce: true 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <section className="relative z-10 w-full py-20 pt-32 px-4">
        <div className="max-w-7xl mx-auto" ref={ref}>
          
          {/* Header Section */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={headerVariants}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-3 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Our Premium Services
              </Badge>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Power & Security
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Transforming businesses with cutting-edge electrical solutions. From smart power systems 
              to intelligent security, we deliver innovation that powers your success.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                  <TrendingUp className="w-8 h-8" />
                  100K+
                </div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                  <Award className="w-8 h-8" />
                  30+
                </div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                  <Users className="w-8 h-8" />
                  99%
                </div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {servicesData.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index}
              />
            ))}
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div
            className="bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-3xl p-8 md:p-12 mb-16 border border-primary/10"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Power Electronics?</h2>
              <p className="text-muted-foreground text-lg">Three decades of excellence in electrical solutions</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Certified Excellence</h3>
                <p className="text-muted-foreground">ISO certified processes and industry-leading quality standards</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Guaranteed Support</h3>
                <p className="text-muted-foreground">24/7 technical support with guaranteed response times</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation First</h3>
                <p className="text-muted-foreground">Cutting-edge technology and future-ready solutions</p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      whileHover={{ 
        y: -15,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 p-8 h-full">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Header with Stats */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
            whileHover={{ 
              scale: 1.1,
              rotate: 10,
              transition: { duration: 0.3 }
            }}
          >
            {service.icon}
          </motion.div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {service.rating}
            </div>
            <div className="text-xs text-muted-foreground">{service.projects} Projects</div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed text-base">
            {service.description}
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-8">
            {service.features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.1 }}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                <span className="text-sm font-medium text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Learn More Button */}
          
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
      </div>
    </motion.div>
  );
};

export default Services;
