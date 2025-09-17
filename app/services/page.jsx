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
  CheckCircle
} from "lucide-react";
import Link from "next/link";

const servicesData = [
  {
    id: "ups-battery",
    icon: <Zap className="w-8 h-8" />,
    title: "UPS & Battery Solutions",
    description: "Reliable backup power systems to ensure your operations never stop, with expert installation and 24/7 support.",
    features: ["Uninterrupted Power Supply", "Battery Backup Systems", "Power Monitoring", "24/7 Support"],
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "voltage-stabilizers",
    icon: <Settings className="w-8 h-8" />,
    title: "Voltage Stabilizers",
    description: "Protect your valuable equipment from voltage fluctuations with our advanced stabilizer solutions.",
    features: ["Voltage Regulation", "Equipment Protection", "Energy Efficiency", "Smart Monitoring"],
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "solar-systems",
    icon: <Sun className="w-8 h-8" />,
    title: "Solar Power Systems",
    description: "Harness renewable energy with our comprehensive solar installation and maintenance services.",
    features: ["Solar Panel Installation", "Grid-Tie Systems", "Off-Grid Solutions", "Energy Storage"],
    color: "text-orange-600",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    id: "cctv-security",
    icon: <Camera className="w-8 h-8" />,
    title: "CCTV & Security Systems",
    description: "Advanced surveillance solutions to protect your property with cutting-edge technology.",
    features: ["HD Camera Systems", "Remote Monitoring", "Motion Detection", "Cloud Storage"],
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "electrical-wiring",
    icon: <Wrench className="w-8 h-8" />,
    title: "Electrical Wiring",
    description: "Professional electrical installation and maintenance services for residential and commercial properties.",
    features: ["Complete Wiring", "Safety Inspections", "Code Compliance", "Emergency Repairs"],
    color: "text-red-600",
    gradient: "from-red-500 to-rose-500"
  },
  {
    id: "maintenance",
    icon: <Shield className="w-8 h-8" />,
    title: "Maintenance & Support",
    description: "Comprehensive maintenance packages to keep your electrical systems running at peak performance.",
    features: ["Preventive Maintenance", "Emergency Support", "System Upgrades", "Performance Optimization"],
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
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
    <section className="w-full py-20 pt-32 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our Services
          </motion.span>
          
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Comprehensive Power & Security Solutions
          </motion.h2>
          
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            From power backup systems to solar installations, we provide end-to-end electrical solutions 
            with over 30 years of expertise and 100,000+ satisfied customers.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/contact-us"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        {/* Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} text-white mb-6 shadow-lg`}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
        >
          {service.icon}
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {service.description}
          </p>

          {/* Features List */}
          <ul className="space-y-2 mb-6">
            {service.features.map((feature, idx) => (
              <motion.li
                key={idx}
                className="flex items-center gap-3 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.1 }}
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* Learn More Link */}
          <motion.div
            className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300 cursor-pointer"
            whileHover={{ x: 5 }}
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
      </div>
    </motion.div>
  );
};

export default Services;
