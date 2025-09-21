"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Users, TrendingUp } from "lucide-react";

const CirLogo = () => {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.1 
  });

  const logos = [
    { src: "/logo/Eastman.webp", alt: "Eastman", category: "Power Solutions" },
    { src: "/logo/cpplus.png", alt: "CP Plus", category: "Security" },
    { src: "/logo/dahua.png", alt: "Dahua", category: "Surveillance" },
    { src: "/logo/exide.png", alt: "Exide", category: "Batteries" },
    { src: "/logo/microtek.webp", alt: "Microtek", category: "UPS Systems" },
    { src: "/logo/adani.png", alt: "Adani", category: "Solar Energy" },
    { src: "/logo/oswal.png", alt: "Oswal", category: "Electrical" },
    { src: "/logo/pahal.png", alt: "Pahal", category: "Components" },
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="flex flex-col items-center justify-center gap-16">
          
          {/* Enhanced Title Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                Authorized Partners
              </Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Premium Brand
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                Partners
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Collaborating with industry leaders to deliver world-class electrical and security solutions
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  15+
                </div>
                <div className="text-muted-foreground text-sm">Premium Brands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <Users className="w-6 h-6" />
                  50K+
                </div>
                <div className="text-muted-foreground text-sm">Products Installed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  100%
                </div>
                <div className="text-muted-foreground text-sm">Authentic Products</div>
              </div>
            </motion.div>
          </div>

          {/* Rotating Logo Carousel */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative w-full max-w-6xl mx-auto">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
              
              <div className="overflow-hidden w-full">
                <motion.div
                  className="flex gap-8 lg:gap-12"
                  style={{ width: "max-content" }}
                  animate={{
                    x: [0, -1600] // Adjust based on total width needed
                  }}
                  transition={{
                    x: {
                      ease: "linear",
                      duration: 25,
                      repeat: Infinity,
                      repeatType: "loop"
                    }
                  }}
                >
                  {/* Triple the logos for seamless infinite loop */}
                  {[...logos, ...logos, ...logos].map((logo, index) => (
                    <motion.div
                      key={`logo-${index}`}
                      className="flex-shrink-0 group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ 
                        duration: 0.6, 
                        delay: (index % logos.length) * 0.1,
                        ease: "easeOut" 
                      }}
                    >
                      <div className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-border/50 group-hover:border-primary/30">
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Logo container without rotation */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={logo.src}
                            alt={`${logo.alt} Logo`}
                            width={120}
                            height={120}
                            className="w-full h-full object-contain transition-all duration-300 relative z-10 max-w-[80%] max-h-[80%]"
                            loading="lazy"
                          />
                        </div>

                        {/* Category label */}
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
                            <p className="text-xs font-medium text-muted-foreground truncate">
                              {logo.category}
                            </p>
                          </div>
                        </div>

                        {/* Shine effect */}
                        {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" /> */}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Additional Info */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Authorized Dealer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Certified Service Center</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Genuine Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Extended Warranty</span>
              </div>
            </div>
            
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Every product comes with manufacturer warranty and our commitment to quality service
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CirLogo;
