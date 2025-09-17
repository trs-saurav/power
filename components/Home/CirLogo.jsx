"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import React from "react";

const CirLogo = () => {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.2 
  });

  const logos = [
    { src: "/logo/Eastman.webp", alt: "Eastman" },
    { src: "/logo/cpplus.png", alt: "CP Plus" },
    { src: "/logo/dahua.png", alt: "Dahua" },
    { src: "/logo/exide.png", alt: "Exide" },
    { src: "/logo/microtek.webp", alt: "Microtek" },
    { src: "/logo/adani.png", alt: "Adani" },
    { src: "/logo/oswal.png", alt: "Oswal" },
    { src: "/logo/pahal.png", alt: "Pahal" },
  ];

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="flex flex-col items-center justify-center gap-12">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary"
              initial={{ x: 100, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              We Deal In
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Trusted partnerships with leading brands in power and security solutions
            </motion.p>
          </div>

          {/* Infinite Logo Carousel */}
          <div className="relative w-full">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            
            <div className="overflow-hidden w-full">
              <motion.div
                className="flex gap-12 lg:gap-16"
                style={{ width: "max-content" }}
                animate={{
                  x: [0, -1920] // Adjust this value based on your total logo width
                }}
                transition={{
                  x: {
                    ease: "linear",
                    duration: 20,
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
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-border/50 group-hover:border-primary/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <Image
                        src={logo.src}
                        alt={`${logo.alt} Logo`}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 relative z-10"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Additional Info */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-sm md:text-base text-muted-foreground">
              Authorized dealer and service provider for premium brands
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CirLogo;
