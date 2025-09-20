"use client";
import React, { useState, useRef, useEffect } from "react";
import ProductCard from "../ProductCard";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get unique categories and select one product from each category
  const getUniqueProducts = () => {
    const categories = {};
    const uniqueProducts = [];
    
    products.forEach(product => {
      if (!categories[product.category] && uniqueProducts.length < 6) {
        categories[product.category] = true;
        uniqueProducts.push(product);
      }
    });
    
    // If we have less than 6 unique categories, fill with remaining products
    if (uniqueProducts.length < 6) {
      const remainingProducts = products.filter(product => 
        !uniqueProducts.find(up => up._id === product._id)
      );
      uniqueProducts.push(...remainingProducts.slice(0, 6 - uniqueProducts.length));
    }
    
    return uniqueProducts.slice(0, 6);
  };

  const displayProducts = getUniqueProducts();
  const totalSlides = displayProducts.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Popular Products
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Discover our top Products from different categories
          </p>
        </motion.div>

        {/* Products Display */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
          className="mb-10"
        >
          {/* Desktop View - Uniform Grid */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
              {displayProducts.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex justify-center"
                >
                  {/* Fixed container for consistent sizing */}
                  <div className="w-full max-w-[280px] h-full">
                    <ProductCard product={product} className="h-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile View - Single Product Slider */}
          <div className="md:hidden relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {displayProducts.map((product, index) => (
                  <div
                    key={product._id || index}
                    className="w-full flex-shrink-0 px-2"
                  >
                    {/* Fixed mobile container */}
                    <div className="flex justify-center">
                      <div className="w-full max-w-[280px] mx-auto">
                        <ProductCard product={product} className="h-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full  shadow-lg border flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full  shadow-lg border flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Next product"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {displayProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>

            {/* Product Info */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {currentSlide + 1} of {totalSlides} • {displayProducts[currentSlide]?.category}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => router.push('/all-products')}
            size="lg"
            className="group px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Products
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-3">
            Explore {products.length}+ electrical products across all categories
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeProducts;
